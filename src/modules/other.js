/**
 *  Reducer: 'OTHERS'
 */
import {
  CAD_CALL_RECEIVED,
  UPDATE_CAD_CALL_ACTION,
  SEND_CAD_UPDATE,
} from "./actions/type"
import { showMessage } from "./alerts";


const initialState = {
  CADcalls: [
    // { 
    //     fromId : '1008',
    //     toId : '1007',
    //     communicationType : "CALL",
    //     callPriority : "0",
    //     callType : "CAD_CALL",
    //     callId1 : '1008',
    //     callId2 : '1007',
    //     requestId : "123456yui",
    //     hold:false,
    //     stateType:'PERSISTED'
    //   }
  ]
}

export default (state = initialState, action) => {
  switch (action.type) {
    case CAD_CALL_RECEIVED:
      const newCAD = {
        ...action.data,
        hold: false,
        stateType: 'PERSISTED'
      }
      return {
        ...state,
        CADcalls: [...state.CADcalls, newCAD],
      };

    case UPDATE_CAD_CALL_ACTION:
      const data = action.data;
      if (data.stateType === 'DISCONNECTED' || data.stateType === 'SUCCESS' || data.stateType === 'GRANT_REQUEST') {
        return {
          ...state,
          CADcalls: state.CADcalls.filter(call => !(call.callId2.toString().includes(data.callId2.toString()) && call.callId1.toString().includes(data.callId1.toString())))
        }
      }
      else {
        return {
          ...state,
          CADcalls: state.CADcalls.map(cad => {
            if ((cad.requestId.toString().includes(data.requestId.toString()))) {
              if (data.stateType === 'HOLD' || data.stateType === 'UNHOLD') {
                return { ...cad, stateType: data.stateType, hold: data.hold }
              }
            }
            return cad
          })
        };
      }

    default:
      return state;
  }
};

const actions = {
  //CAD
  newCADReceived: (data) => ({ type: CAD_CALL_RECEIVED, data }),
  updateCAD: (data) => ({ type: UPDATE_CAD_CALL_ACTION, data }),
  sendCadUpdate: (data) => ({ type: SEND_CAD_UPDATE, data }),
}

/**
 *  Action: 'NEW CAD'
 */
//   AuthorizeCall { 
//     fromId = userId.toString()
//     toId = userId.toString()
//     communicationType = "CALL"
//     callPriority = "0"
//     callType = "AUTHORIZATION_CALL"
//     callId1 = callId1.toString()
//     callId2 = callId2.toString()
//   }

export const newCADReceived = (data) => {
  return dispatch => {
    dispatch(actions.newCADReceived(data))
  }
}

export const updateCADCall = (user, data) => {
  return dispatch => {
    dispatch(actions.updateCAD(data));
    dispatch(actions.sendCadUpdate(data));
  }
}

export const cadCallResponse = (data) => {
  return dispatch => {
    if (data.stateType === 'SUCCESS') dispatch(showMessage({ header: 'CAD', content: 'CAD authorized successfully!', type: 'success' }))
    else dispatch(showMessage({ header: 'CAD', content: 'Failed to send CAD', type: 'error' }))
    data.stateType = "DISCONNECTED"
    dispatch(actions.updateCAD(data));
  }
}