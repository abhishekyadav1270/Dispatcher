import store from "../store"

export const FETCH_ACTIVITY_LOG = 'ACTIVITY/FETCH_ACTIVITY_LOG'
export const UPDATE_ACTIVITY_LOG = 'ACTIVITY/UPDATE_ACTIVITY_LOG'
//TAB MANAGEMENT
export const UPDATE_TAB = 'ACTIVESCREEN/UPDATE_TAB'
export const UPDATE_TAB_OPTIONS = 'ACTIVESCREEN/UPDATE_TAB_OPTIONS'
export const REFRESH_REQD = 'ACTIVESCREEN/REFRESH_REQD'
export const UPDATE_ALERT_TAB_OPTIONS = 'ACTIVESCREEN/UPDATE_ALERT_TAB_OPTIONS'

const initialState = {
    activityLogs: [],
    total: 0,
    currentPage: 1,
    lastPage: 1,
    //DISPATCHER ACTIVE TAB STATE
    activeTab: 'trains',  //trains/communication/alerts
    trains: {
        log: 'all'   //all/call/sds/alerts
    },
    communication: {
        sds: 'inbox', //inbox/sent/read
        log: 'all'   //all/calls/sds/alerts
    },
    alerts: {
        alerts: 'inc',  //inc/ack/sent
        log: 'all'   //all/calls/sds/alerts
    },
    //Refresh Flag
    sdsRefresh: false,
    alertsRefresh: false,
    callsRefresh: false,
    logsRefresh: false,
    taskRefresh: false,
    alertActiveTab: 'inc'
}

export default (state = initialState, action) => {
    switch (action.type) {
        case UPDATE_ACTIVITY_LOG:
            const actData = action.data;
            return {
                ...state,
                activityLogs: !action.isNew ? [...state.activityLogs, ...actData.data] : actData.data,
                currentPage: actData.current_page,
                lastPage: actData.last_page,
                total: actData.total
            }
        case UPDATE_TAB:
            const activeTab = action.data
            return {
                ...state,
                activeTab: activeTab
            }
        case UPDATE_TAB_OPTIONS:
            const tab = action.data
            return {
                ...state,
                [state.activeTab]: {
                    ...state[[state.activeTab]],
                    [tab.opt]: tab.val
                }
            }
        case REFRESH_REQD:
            console.log('activeTab action REFRESH', action.data)
            const flag = action.data
            return {
                ...state,
                [flag.opt + 'Refresh']: flag.val,        //e.g sdsRefresh: true/false
            }
        case UPDATE_ALERT_TAB_OPTIONS:
            const alertTab = action.data
            return {
                ...state,
                alertActiveTab: alertTab
            }
        default:
            return state;
    }
};

const actions = {
    fetchActivityLog: (data) => ({ type: FETCH_ACTIVITY_LOG, data }),
    updateTab: (data) => ({ type: UPDATE_TAB, data }),
    updateTabOption: (data) => ({ type: UPDATE_TAB_OPTIONS, data }),
    setRefresh: (data) => ({ type: REFRESH_REQD, data }),
    updateAlertTabOption: (data) => ({ type: UPDATE_ALERT_TAB_OPTIONS, data }),
}

/**
 *  Action: fetches all the activity as per filter
 */
export const fetchActivityLog = (data) => {
    return dispatch => {
        dispatch(actions.fetchActivityLog(data))
    }
}
/**
 *  Action: updates the active tab
 */
export const updateTab = (data) => {
    return dispatch => {
        dispatch(actions.updateTab(data))
    }
}
/**
 *  Action: updates the actions tab of active tab
 */
export const updateTabOption = (opt, val) => {
    return dispatch => {
        dispatch(actions.updateTabOption({ opt, val }))
    }
}
/**
 *  Action: updates the state of refresh reqd or not
 */
export const setRefresh = (opt, val) => {
    return dispatch => {
        dispatch(actions.setRefresh({ opt, val }))
    }
}

export const updateAlertTabOption = (data) => {
    return dispatch => {
        dispatch(actions.updateAlertTabOption(data))
    }
}

export const isRefreshReqd = (recdType) => {
    // recdType = sds/alerts/calls
    const logs = store.getState().logs
    const { activeTab, trains, communication, alerts, alertActiveTab } = logs;
    console.log('activeTab action..', recdType, activeTab, alertActiveTab)
    return dispatch => {
        if (activeTab === 'trains') {
            if (trains['log'] === recdType || trains['log'] === 'all') dispatch(actions.setRefresh({ opt: 'logs', val: true }))
        }
        if (activeTab === 'communication') {
            if (recdType === 'sds' && communication['sds'] === 'inbox') {
                dispatch(actions.setRefresh({ opt: 'sds', val: true }))
            }
            if (recdType === 'status') {
                dispatch(actions.setRefresh({ opt: 'status', val: true }))
            }
            if (communication['log'] === recdType || communication['log'] === 'all') {
                dispatch(actions.setRefresh({ opt: 'logs', val: true }))
            }
        }
        if (activeTab === 'alerts') {
            console.log('activeTab action alert..', alerts)
            if (recdType === 'alerts' && alerts['alerts'] === 'inc') {
                dispatch(actions.setRefresh({ opt: 'alerts', val: true }))
            }
            if (alerts['log'] === recdType || alerts['log'] === 'all') {
                dispatch(actions.setRefresh({ opt: 'logs', val: true }))
            }
            if (recdType === 'task' && alertActiveTab === 'inc') {
                dispatch(actions.setRefresh({ opt: 'task', val: true }))
            }
        }
    }
}
