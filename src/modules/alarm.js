/**
 *  Reducer: 'alarm'
 */

import moment from 'moment'

import { MESSAGES, newAlertBeep } from '../constants/constants'
import { getCountSDS, getAlertCount } from '../utils/lib'
//import { createFilterQuery } from '../utils/lib'
//import {sipPrivateId} from '../utils/sipConfig'
import { REFRESH_REQD } from './activityLog';
import { showMessage } from './alerts';
import { sendLog } from './communication';

export const STATUS_RECEIVED = 'ALARM/STATUS_RECEIVED'
export const GROUP_STATUS_RECEIVED = 'ALARM/GROUP_STATUS_RECEIVED'
export const UPDATE_STATUS_STATE = 'ALARM/UPDATE_STATUS_STATE'
export const UPDATE_GROUP_STATUS_STATE = 'ALARM/UPDATE_GROUP_STATUS_STATE'
export const PIN_STATUS = 'ALARM/PIN_STATUS'

export const FETCH_STATUSES_SUCCESS = 'ALARM/FETCH_STATUSES_SUCCESS'
export const FETCH_STATUSES_ERROR = 'ALARM/FETCH_STATUSES_ERROR'

export const SEND_STATUS = 'ALARM/SEND_STATUS'
export const ACKNOWLEDGE_STATUS = 'ALARM/ACKNOWLEDGE_STATUS'
export const IGNORE_STATUS = 'ALARM/IGNORE_STATUS'
//MCX UPDATE API
export const MCX_PIN_ALERT = 'COMMUNICATION/MCX_PIN_ALERT'
export const MCX_ACK_ALERT = 'COMMUNICATION/MCX_ACK_ALERT'
//PAGINATION
export const GET_ALERTS = 'COMMUNICATION/GET_ALERTS'
export const ADD_ALERTS = 'COMMUNICATION/ADD_ALERTS'

const alertBeep = new Audio(newAlertBeep)

const initialState = {
  statuses: [],
  groupStatuses: [],
  total: 0,
  currentPage: 1,
  lastPage: 1
}
let requestId = 1
let grequestId = 1
let fetchFlag = false
export default (state = initialState, action) => {
  switch (action.type) {

    case STATUS_RECEIVED:
    case GROUP_STATUS_RECEIVED:
      const alert = action.data
      if (alert.indexId) alert.id = alert.indexId;
      else {
        if (alert.sdsType === "STATUS_MESSAGE") alert.id = requestId++
        else alert.id = grequestId++
      }

      return {
        ...state,
        statuses: [
          {
            ...alert,
            stateType: 'PERSISTED',
            created: alert.created ? alert.created : moment(new Date()).format('YYYY-MM-DD hh:mm:ss')
          }, ...state.statuses]
      }

    case ADD_ALERTS:
      const alertData = action.data;
      console.log('FETCHED ALERTS', alertData)
      return {
        ...state,
        statuses: alertData.data,
        currentPage: alertData.current_page,
        lastPage: alertData.last_page,
        total: alertData.total
      }

    case UPDATE_STATUS_STATE:
    case UPDATE_GROUP_STATUS_STATE:
      if (action.data.indexId) {
        return {
          ...state,
          statuses: state.statuses.map(status => {
            if (status.id && status.id.toString() === action.data.indexId.toString() && status.sdsType === action.data.sdsType) {
              return { ...status, stateType: action.data.stateType }
            } else {
              return status
            }
          })
        }
      } else {
        return state
      }

    case PIN_STATUS:
      const statusType = (action.data.sdsType === 'STATUS_MESSAGE') ? 'statuses' : 'groupStatuses'
      return {
        ...state,
        [statusType]: state[statusType].map(status => {
          if (status.id.toString() === action.data.indexId.toString() && status.fromId === action.data.fromId && status.toId === action.data.toId) {
            return { ...status, pinned: action.data.pinned }
          } else {
            return status
          }
        })
      }

    case FETCH_STATUSES_SUCCESS:
      const alarmData = action.data.data;
      const alarmFlag = action.data.flag;
      if (fetchFlag) {
        requestId = alarmFlag.id;
        grequestId = alarmFlag.grpId
        fetchFlag = false;
      }
      return {
        ...state,
        statuses: alarmData.data,
        currentPage: alarmData.current_page,
        lastPage: alarmData.last_page,
        total: alarmData.total
      }

    case FETCH_STATUSES_ERROR:
      return {
        ...state,
        statuses: []
      }

    default:
      return state
  }
}

const actions = {
  statusReceived: (data) => ({ type: STATUS_RECEIVED, data }),
  groupStatusReceived: (data) => ({ type: GROUP_STATUS_RECEIVED, data }),
  updateStatusState: (data) => ({ type: UPDATE_STATUS_STATE, data }),
  updateGroupStatusState: (data) => ({ type: UPDATE_GROUP_STATUS_STATE, data }),
  pinUnpinStatus: (data) => ({ type: PIN_STATUS, data }),
  pinAlertMcx: (data) => ({ type: MCX_PIN_ALERT, data }),
  ackAlertMcx: (data) => ({ type: MCX_ACK_ALERT, data }),

  fetchStatusesSuccess: (data) => ({ type: FETCH_STATUSES_SUCCESS, data }),
  fetchStatusesError: () => ({ type: FETCH_STATUSES_ERROR }),

  acknowledgeStatus: (data) => ({ type: ACKNOWLEDGE_STATUS, data }),
  ignoreStatus: (data) => ({ type: IGNORE_STATUS, data }),
  sendStatus: (data) => ({ type: SEND_STATUS, data }),
  //PAGINATION
  getAlerts: (data) => ({ type: GET_ALERTS, data }),
  //REFRESH
  setRefresh: (data) => ({ type: REFRESH_REQD, data }),
}

/**
 *  Action: 'statusReceived'
 */
export const getAlerts = (data) => {
  return dispatch => {
    dispatch(actions.getAlerts(data))
  }
}

/**
 *  Action: 'statusReceived'
 */
export const statusReceived = (data) => {
  alertBeep.play()
  return dispatch => {
    dispatch(actions.statusReceived(data))
  }
}

/**
 *  Action: 'groupStatusReceived'
 */
export const groupStatusReceived = (data) => {
  alertBeep.play()
  return dispatch => {
    dispatch(actions.groupStatusReceived(data))
  }
}

/**
 *  Action: 'updateStatusState'
 */
export const updateStatusState = (data) => {
  return dispatch => {
    dispatch(actions.updateStatusState(data))
  }
}

/**
 *  Action: 'updateGroupStatusState'
 */
export const updateGroupStatusState = (data) => {
  return dispatch => {
    dispatch(actions.updateGroupStatusState(data))
  }
}

/**
 *  Action: 'pinUnpinStatus'
 */
export const pinUnpinStatus = (data, pinStatus) => {
  data['pinned'] = pinStatus;
  data['indexId'] = data.id;
  return async (dispatch) => {
    dispatch(actions.pinUnpinStatus(data));
    try {
      dispatch(actions.pinAlertMcx(data));
      dispatch(sendLog('PIN: SDS STATUS', data))
    }
    catch (error) {
      console.log('Alert pin ERR', error)
      dispatch(sendLog('ERR PIN: SDS STATUS', data))
    }
  }
}

/**
 *  Action: 'fetchStatuses'
 */
export const fetchStatuses = ({ alerts, userId }) => {
  return dispatch => {
    if (alerts && alerts.data.length) {
      fetchFlag = true;
      const count = getAlertCount(alerts.data, userId);
      dispatch(actions.fetchStatusesSuccess({ data: alerts, flag: count }))
    }
    else dispatch(actions.fetchStatusesError())
  }
}

/**
 *  Action: 'acknowledgeStatus'
 */
export const acknowledgeStatus = (data) => {
  console.log('ACK', data)
  return dispatch => {
    // dispatch(actions.acknowledgeStatus(data))
    // if(data.sdsType === 'STATUS_MESSAGE'){
    //   dispatch(actions.updateStatusState(data))
    // } else {
    //   dispatch(actions.updateGroupStatusState(data))
    // }
    //Update status in Store
    try {
      dispatch(actions.ackAlertMcx(data))
      dispatch(actions.setRefresh({ opt: 'alerts', val: true }))
      dispatch(sendLog('ACK: SDS STATUS', data))
    }
    catch (error) {
      console.log('ERR', error)
      dispatch(sendLog('ERR ACK: SDS STATUS', data))
    }
  }
}

/**
 *  Action: 'ignoreStatus'
 */
export const ignoreStatus = (status) => {
  const data = {
    ...status,
    toId: status.fromId,
    fromId: status.toId
  }
  return dispatch => {
    dispatch(actions.ignoreStatus(data))
    if (data.sdsType === 'STATUS_MESSAGE') {
      dispatch(actions.updateStatusState(data))
    } else {
      dispatch(actions.updateGroupStatusState(data))
    }
  }
}

/**
 *  Action: 'sendStatus'
 */
export const sendStatus = (user, status) => {
  const data = {
    ...status,
    fromId: status.fromId ? status.fromId : user.profile.mcptt_id,
    indexId: status.sdsType === 'STATUS_MESSAGE' ? ++requestId : ++grequestId
  }
  alertBeep.play()

  return (dispatch, getState) => {
    const mcxState = getState().connection.mcx
    if (mcxState.primary || mcxState.secondary) {
      // if(data.sdsType === 'STATUS_MESSAGE'){
      //   dispatch(actions.statusReceived(data))
      // } else {
      //   dispatch(actions.groupStatusReceived(data))
      // }
      dispatch(actions.sendStatus(data))
      dispatch(sendLog('SENT: SDS STATUS', data))
      setTimeout(() => {
        dispatch(actions.setRefresh({ opt: 'sds', val: true }))
      }, 500);
    }
    else dispatch(showMessage({ header: 'Connection', content: 'MCX disconnected!', type: 'notif' }))
  }
}