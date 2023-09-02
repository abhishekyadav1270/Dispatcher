/**
 *  Reducers/index
 *  combine all the reducers
 */
import { combineReducers } from 'redux'
//import { routerReducer } from 'react-router-redux'
import common from './common'
import alerts from './alerts'
import alarm from './alarm'
import connection from './connection'
import train from './reducers/Train'
import auth from './reducers/Auth'
import dialerDomainOption from './reducers/dialerDomainOption'
import alertReducer from './reducers/alerts'
import location from './reducers/Location'
import communication from './communication'
import logs from './activityLog'
import settings from './settings'
import other from './other'
import adminstate from './adminstate'
import domains from './domains'
import systemdgnassi from './systemdgnassi'
import enableDgna from './enableDgna'
import enableAmbienceListening from './enableAmbienceListening'
import enablePatchCall from './enablePatchCall'
import enableMergeCall from './enableMergeCall'
import enableCadCall from './enableCadCall'
import enableCallForwarding from './enableCallForwarding'
import user from './user'
import property from './property'
import statusMessage from './statusMessage'
import predefinedMessage from './predefinedMessage'
import { reducer } from 'redux-oidc'
import task from './task'
import registeredUsersList from './registeredUsersList'
import { connectRouter } from 'connected-react-router'
import { createReduxHistoryContext } from "redux-first-history";
import { createBrowserHistory } from "history";
import player from './reducers/Player'


//import {routerReducer} from "../store"
const {
  routerReducer
} = createReduxHistoryContext({ history: createBrowserHistory() });

const appReducer = combineReducers({
  router: routerReducer,
  common,
  alerts,
  communication,
  alarm,
  connection,
  user,
  property,
  statusMessage,
  predefinedMessage,
  oidc: reducer, //vik
  //updated
  train,
  auth,
  dialerDomainOption,
  location,
  logs,
  settings,
  other,
  adminstate,
  domains,
  alertReducer,
  task,
  systemdgnassi,
  registeredUsersList,
  player,
  enableDgna,
  enableAmbienceListening,
  enableCadCall,
  enableCallForwarding,
  enablePatchCall,
  enableMergeCall
})

const rootReducer = (state, action) => {
  if (action.type === 'AUTH/LOGOUT') {
    state = undefined
  }
  return appReducer(state, action)
}

export default rootReducer

// const rootReducer = (history) => combineReducers({
//   router: connectRouter(history),
//   common,
//   alerts,
//   communication,
//   alarm,
//   connection,
//   user,
//   property,
//   statusMessage,
//   predefinedMessage,
//   oidc: reducer, //vik
//   //updated
//   train,
//   auth,
//   location,
//   logs,
//   settings,
//   other,
//   adminstate,
//   domains,
//   alertReducer,
//   task,
//   systemdgnassi,
//   registeredUsersList,
// })

// export default rootReducer