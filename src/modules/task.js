import { FETCH_TASK_LIST, UPDATE_TASK_LIST, UPDATE_BEEP_TASK, FETCH_ACTIVE_TASK_COUNT, UPDATE_ACTIVE_TASK_COUNT } from './actions/type'
const initialState = {
    tasks: {},
    activeTaskCount: {},
    beepTask: false
}

export default (state = initialState, action) => {
    const incomingData = action.data;
    switch (action.type) {
        case UPDATE_TASK_LIST:
            console.log('activeTab action task reducer', incomingData)
            let foundBeep = false
            for (let index = 0; index < incomingData.data.length; index++) {
                const task = incomingData.data[index];
                if (task && task.taskInput && task.taskInput.statusCode) {
                    if (task.taskInput.statusCode == '65310' || task.taskInput.statusCode == '65311') {
                        if (task.taskStatus !== 'COMPLETED') {
                            console.log('activeTab action task reducer found beep', task)
                            foundBeep = true
                            break
                        }
                    }
                }
            }
            if (foundBeep) {
                return {
                    ...state,
                    tasks: incomingData,
                    beepTask: true
                }
            } else {
                return {
                    ...state,
                    tasks: incomingData,
                }
            }
        case UPDATE_ACTIVE_TASK_COUNT:
            return {
                ...state,
                activeTaskCount: incomingData,
            }
        case UPDATE_BEEP_TASK:
            console.log('tasks for beep sound reducer', incomingData)
            return {
                ...state,
                beepTask: incomingData,
            }
        default:
            return state
    }
}

const actions = {
    getAllTasks: (data) => ({ type: FETCH_TASK_LIST, data }),
    updateAlertBeepTasks: (data) => ({ type: UPDATE_BEEP_TASK, data }),
    getActiveTaskCount: (data) => ({ type: FETCH_ACTIVE_TASK_COUNT, data }),
}

export const getAllTasks = (data) => {
    return dispatch => {
        dispatch(actions.getAllTasks(data))
    }
}

export const updateAlertBeepTasks = (data) => {
    return dispatch => {
        dispatch(actions.updateAlertBeepTasks(data))
    }
}

export const getActiveTaskCount = (data) => {
    return dispatch => {
        dispatch(actions.getActiveTaskCount(data))
    }
}