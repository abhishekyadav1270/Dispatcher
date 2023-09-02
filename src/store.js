/**
 *  Redux Store
 */
import { createStore, applyMiddleware, compose } from 'redux'
//import { routerMiddleware } from 'react-router-redux'
import thunk from 'redux-thunk'
// import logger from 'redux-logger'
//import createHistory from 'history/createBrowserHistory'
import createSagaMiddleware from 'redux-saga'
import rootReducer from './modules'

import userManager from './utils/userManager'//vik
import { loadUser } from 'redux-oidc'
import { composeWithDevTools } from 'redux-devtools-extension'
import { combineReducers } from "redux";
import { configureStore } from "@reduxjs/toolkit";

import { createReduxHistoryContext } from "redux-first-history";
import { createBrowserHistory } from "history";



const initialState = {}
const enhancers = []
export const sagaMiddleware = createSagaMiddleware()

//const oidcMiddleware = createOidcMiddleware(userManager, () => true, false, '/callback'); //vik

const loggerMiddleware = store => next => action => {
  console.log("🛬 Action type:", action.type);
  console.log("🔥 Action payload:", action.payload?action.payload:action.data);
  console.log("📌 State before:", store.getState());
  next(action);
  console.log("😻 State after:", store.getState());
}



let middleware = [
  thunk,
  sagaMiddleware,
  // loggerMiddleware
  //oidcMiddleware // vik
]

if (process.env.NODE_ENV !== 'production') {
  middleware = [ ...middleware/*, logger*/ ]
}

if (process.env.NODE_ENV === 'development') {
  const devToolsExtension = window.devToolsExtension

  if (typeof devToolsExtension === 'function') {
    enhancers.push(devToolsExtension())
  }
}


const {
  createReduxHistory,
  routerMiddleware,
  routerReducer
} = createReduxHistoryContext({ history: createBrowserHistory() });


export const store = configureStore({
 
  reducer: rootReducer,
   
  middleware: [...middleware,routerMiddleware],
  enhancers:[...enhancers]
});

export const history = createReduxHistory(store);

// const store = configureStore({
//   reducer: rootReducer,
//   middleware: [...middleware, routerMiddleware(history)],
//   enhancers:[...enhancers]
// });


// export const history = createReduxHistory(store);
// const composedEnhancers = compose(
//   applyMiddleware(...middleware),
//   ...enhancers
// )(createStore);

// const store = composedEnhancers(rootReducer,initialState);
loadUser(store,userManager);

// export default store;





export default store;


