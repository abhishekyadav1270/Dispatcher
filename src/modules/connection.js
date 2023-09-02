/**
 *  Reducer: 'communication'
 */

export const TIMER_TICK = 'CONNECTION/TIMER_TICK'
export const CONNECTION_OPENED = 'CONNECTION/OPEN'
export const CONNECTION_CLOSED = 'CONNECTION/CLOSE'
export const PIPELINE_ACTIVE = 'CONNECTION/PIPELINE_ACTIVE'
export const PIPELINE_DESTROYED = 'CONNECTION/PIPELINE_DESTROYED'
export const UPDATE_SYSTEM_STATUS = 'CONNECTION/UPDATE_SYSTEM_STATUS'

let timer = null
const maxTimer = 600

const initialState = {
  counter: 0,
  signalingServer: null,
  mcx: {
    primary: null,
    secondary: null
  },
  ris: {
    primary: null,
    secondary: null
  },
  das: {
    primary: null,
    secondary: null
  },
  ats: {
    primary: null,
    secondary: null
  }
}

export default (state = initialState, action) => {
  switch (action.type) {

    case CONNECTION_OPENED:
      return {
        ...state,
        signalingServer: true
      }

    case CONNECTION_CLOSED:
      return {
        ...state,
        signalingServer: false
      }

    case PIPELINE_ACTIVE:
      return {
        ...state
      }

    case PIPELINE_DESTROYED:
      return {
        ...state
      }

    case UPDATE_SYSTEM_STATUS:
      const system = (action.data.systemType === 'MCX' || action.data.systemType === 'MCX_CONSUMER') ? 'mcx' : action.data.systemType === 'RIS' ? 'ris' :
        action.data.systemType === 'ATS' ? 'ats' : 'das'
      const instance = (action.data.applicationInstanceType === 'OCC') ? 'primary' : 'secondary'
      const status = (action.data.systemStateType === 'UP') ? true : false
      return {
        ...state,
        counter: 0,
        [system]: {
          ...state[system],
          [instance]: status
        }
      }

    case TIMER_TICK:
      if (state.counter >= maxTimer) {
        return {
          ...state,
          counter: 0,
          mcx: {
            primary: false,
            secondary: false
          },
          ris: {
            primary: false,
            secondary: false
          },
          ats: {
            primary: false,
            secondary: false
          }
        }
      }
      return {
        ...state,
        counter: state.counter + 1
      }

    default:
      return state
  }
}

const actions = {
  connectionOpened: () => ({ type: CONNECTION_OPENED }),
  connectionClosed: () => ({ type: CONNECTION_CLOSED }),
  pipelineActive: () => ({ type: PIPELINE_ACTIVE }),
  pipelineDestroyed: () => ({ type: PIPELINE_DESTROYED }),
  updateSystemStatus: (data) => ({ type: UPDATE_SYSTEM_STATUS, data }),
  tick: () => ({ type: TIMER_TICK })
}

export const connectionOpened = () => {
  console.log("------------------- connectionOpened -------------------")
  return dispatch => {
    dispatch(actions.connectionOpened())
  }
}

export const connectionClosed = () => {
  console.log("------------------- connectionClosed -------------------")
  return dispatch => {
    dispatch(actions.connectionClosed())
  }
}

export const pipelineActive = () => {
  console.log("------------------- Pipeline Active -------------------")
}

export const pipelineDestroyed = () => {
  console.log("------------------- Pipeline Destroyed -------------------")
}

export const systemStatusReceived = (message) => {
  return dispatch => {
    dispatch(actions.updateSystemStatus(message))
  }
}

export const startTimer = () => (dispatch) => {
  clearInterval(timer)
  timer = setInterval(() => dispatch(actions.tick()), 1000)
  dispatch(actions.tick())
}

export const stopTimer = () => (dispatch) => {
  clearInterval(timer)
}