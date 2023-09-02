/**
 *  Reducer: 'alerts'
 */
import { TIMEOUTS } from '../constants/constants'

export const ADD_MESSAGE = 'ALERTS/ADD_MESSAGE'
export const REMOVE_MESSAGE = 'ALERTS/REMOVE_MESSAGE'

let nextNotificationId = 0

const initialState = {
  messages: []
}

export default (state = initialState, action) => {
  switch (action.type) {

    case ADD_MESSAGE:
      return {
        ...state, messages: [{id: action.id, ...action.data}, ...state.messages]
      }

    case REMOVE_MESSAGE:
      return {
        ...state, messages: state.messages.filter(m => m.id !== action.id)
      }

    default:
      return state
  }
}

const actions = {
  addMessage: (id, data) => ({type: ADD_MESSAGE, id, data}),
  removeMessage: (id) => ({type: REMOVE_MESSAGE, id})
}

/**
 *  Action: 'showMessage'
 */
export const showMessage = (data) => {
  return dispatch => {
    const id = nextNotificationId++
    dispatch(actions.addMessage(id, data))
    setTimeout(() => {
      dispatch(actions.removeMessage(id))
    }, TIMEOUTS.alert)
  }
}

/**
 *  Action: 'removeMessage'
 */
export const removeMessage = (id) => {
  return dispatch => {
    dispatch(actions.removeMessage(id))
  }
}