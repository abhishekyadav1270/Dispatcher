/**
 *  Reducer: 'predefinedMessage'
 */

import axios from 'axios'

import { EndPoints } from '../MCXclient/endpoints'
import { dispatcherServerPort,host } from '../constants/endpoints'
import { MESSAGES } from '../constants/constants'
//import {sipPrivateId} from '../utils/sipConfig'


export const FETCH_USER_MESSAGES_SUCCESS = 'PREDEFINED_MESSAGE/FETCH_USER_MESSAGES_SUCCESS'
export const FETCH_USER_MESSAGES_ERROR = 'PREDEFINED_MESSAGE/FETCH_USER_MESSAGES_ERROR'
export const FETCH_GLOBAL_MESSAGES_SUCCESS = 'PREDEFINED_MESSAGE/FETCH_GLOBAL_MESSAGES_SUCCESS'
export const FETCH_GLOBAL_MESSAGES_ERROR = 'PREDEFINED_MESSAGE/FETCH_GLOBAL_MESSAGES_ERROR'

const initialState = {
  userMessages: [],
  globalMessages: []
}
let uMessageId = 0;
let gMessageId = 0;
let fetchFlag = false;
export default (state = initialState, action) => {
  switch (action.type) {

    case FETCH_USER_MESSAGES_SUCCESS:
      if(fetchFlag){
        uMessageId = action.data[0].id;
        fetchFlag = false;
      }
      return {
        ...state,
        userMessages: action.data
      }

    case FETCH_USER_MESSAGES_ERROR:
      return {
        ...state, 
        userMessages: []
      }

    case FETCH_GLOBAL_MESSAGES_SUCCESS:
      if(fetchFlag){
        gMessageId = action.data[0].id;
        fetchFlag = false;
      }
      return {
        ...state, 
        globalMessages: action.data
      }

    case FETCH_GLOBAL_MESSAGES_ERROR:
      return {
        ...state, 
        globalMessages: []
      }

    default:
      return state
  }
}

const actions = {
  fetchAllUserMessagesSuccess: (data) => ({type: FETCH_USER_MESSAGES_SUCCESS, data}),
  fetchAllUserMessagesError: () => ({type: FETCH_USER_MESSAGES_ERROR}),
  fetchAllGlobalMessagesSuccess: (data) => ({type: FETCH_GLOBAL_MESSAGES_SUCCESS, data}),
  fetchAllGlobalMessagesError: () => ({type: FETCH_GLOBAL_MESSAGES_ERROR})
}

/**
 *  Action: 'fetchAllUserMessages'
 */
export const fetchAllUserMessages = (currentUser) => {
  return dispatch => {
    // return axios.get(`${endpoints.userCustomMessageText}?filter=userEntity.id::${currentUser}`).then(
    //   res => {
    //     if(res.data.entity.length > 0){
    //       dispatch(actions.fetchAllUserMessagesSuccess(res.data.entity))
    //       return {header: 'User Message', content: `${res.data.message}`, type: 'success'}
    //     }
    //     else{
    //       dispatch(actions.fetchAllUserMessagesError())
    //       return {header: 'User Message', content: `${MESSAGES.noResults}`, type: 'error'}
    //     }
    //   },
    //   err => {
    //     dispatch(actions.fetchAllUserMessagesError())
    //     return {header: 'User Message', content: `${MESSAGES.defaultError}`, type: 'error'}
    //   }
    // ).catch(
    //   err => {
    //     dispatch(actions.fetchAllUserMessagesError())
    //     return {header: 'User Message', content: `${MESSAGES.defaultError}`, type: 'error'}
    //   }
    // )
    //return axios.get(`http://${host}:${dispatcherServerPort}/usermessages?toId=${currentUser}`).then(
      return axios.get(`${EndPoints.getConfig().userMessages}?toId=${currentUser}`).then(
      res=>{
        console.log(res.data)
        if(res.data){
          fetchFlag = true;
          dispatch(actions.fetchAllUserMessagesSuccess(res.data))
          return {header: 'Communincation - Text Messages', content: `${res.data.message}`, type: 'success'}
        }
        else{
          dispatch(actions.fetchAllUserMessagesError())
          return {header: 'Communincation - Text Messages', content: `${MESSAGES.noResults}`, type: 'nr'}
        }
      },
      err=>{
        dispatch(actions.fetchAllUserMessagesError())
        return {header: 'Communincation - Text Messages', content: `${MESSAGES.defaultError}`, type: 'error'}
      }
    ).catch(
      err=>{
        dispatch(actions.fetchAllUserMessagesError())
        return {header: 'Communincation - Text Messages', content: `${MESSAGES.defaultError}`, type: 'error'}
      }
    )
  }
}

/**
 *  Action: 'addUserMessage'
 */
export const addUserMessage = (message, user) => {
  const params = {
    ...message,
    id: ++uMessageId,
    user: {
      id: user.profile.mcptt_id
    },
    createdBy: user.profile.mcptt_id,
    createdAt: `${new Date().toDateString()} ${new Date().toLocaleTimeString()}`
  }
  return dispatch => {
    // return axios.post('http://'+host+':'+dispatcherServerPort+'/usermessages',params).then(
      return axios.post(EndPoints.getConfig().userMessages,params).then(
      res =>  ({header: 'Global Message', content: `${res.data.message}`, type: 'success'}),
      err => ({content: err.response.data.message ? `Global Message: ${err.response.data.message}` : `Global Message: ${err.response.statusText}`, type: 'error'})
    )
  }
}

/**
 *  Action: 'updateUserMessage'
 */
export const updateUserMessage = (message, id, user) => {
  const params = {
    ...message,
    updatedBy: user.profile.mcptt_id,
    updatedAt: `${new Date().toDateString()} ${new Date().toLocaleTimeString()}`
  }
  return dispatch => {
    return axios.put(`${EndPoints.getConfig().userMessages}?toId=${user.profile.mcptt_id}&id=${id}`, params).then(
    // return axios.put(`http://${host}:${dispatcherServerPort}/usermessages?toId=${user.profile.mcptt_id}&id=${id}`, params).then(
      res => ({header: 'User Message', content: `${res.data.message}`, type: 'success'}),
      err => ({content: err.response.data.message ? `User Message: ${err.response.data.message}` : `User Message: ${err.response.statusText}`, type: 'error'})
    ).catch(
      err => ({header: 'User Message', content: `${MESSAGES.defaultError}`, type: 'error'})
    )
  }
}

/**
 *  Action: 'fetchAllGlobalMessages'
 */
export const fetchAllGlobalMessages = () => {
  return dispatch => {
    // return axios.get(endpoints.globalCustomMessageText).then(
    //   res => {
    //     if(res.data.entity.length > 0){
    //       dispatch(actions.fetchAllGlobalMessagesSuccess(res.data.entity))
    //       return {header: 'Global Message', content: `${res.data.message}`, type: 'success'}
    //     }
    //     else{
    //       dispatch(actions.fetchAllGlobalMessagesError())
    //       return {header: 'Global Message', content: `${MESSAGES.noResults}`, type: 'error'}
    //     }
    //   },
    //   err => {
    //     dispatch(actions.fetchAllGlobalMessagesError())
    //     return {header: 'Global Message', content: `${MESSAGES.defaultError}`, type: 'error'}
    //   }
    // ).catch(
    //   err => {
    //     dispatch(actions.fetchAllGlobalMessagesError())
    //     return {header: 'Global Message', content: `${MESSAGES.defaultError}`, type: 'error'}
    //   }
    // )
    return axios.get(EndPoints.getConfig().globalmessages).then(
    // return axios.get(`http://${host}:${dispatcherServerPort}/globalmessages`).then(
      res=>{
        console.log(res.data)
        if(res.data){
          fetchFlag = true;
          dispatch(actions.fetchAllGlobalMessagesSuccess(res.data))
          return {header: 'Communincation - Text Messages', content: `${res.data.message}`, type: 'success'}
        }
        else{
          dispatch(actions.fetchAllGlobalMessagesError())
          return {header: 'Communincation - Text Messages', content: `${MESSAGES.noResults}`, type: 'nr'}
        }
      },
      err=>{
        dispatch(actions.fetchAllGlobalMessagesError())
        return {header: 'Communincation - Text Messages', content: `${MESSAGES.defaultError}`, type: 'error'}
      }
    ).catch(
      err=>{
        dispatch(actions.fetchAllGlobalMessagesError())
        return {header: 'Communincation - Text Messages', content: `${MESSAGES.defaultError}`, type: 'error'}
      }
    )
  }
}

/**
 *  Action: 'addGlobalMessage'
 */
export const addGlobalMessage = (message, user) => {
  const params = {
    ...message,
    id: ++gMessageId,
    createdBy: user.profile.mcptt_id,
    createdAt: `${new Date().toDateString()} ${new Date().toLocaleTimeString()}`
  }
  return dispatch => {
    // return axios.put(`${endpoints.globalCustomMessageText}`, params).then(
    //   res => ({header: 'Global Message', content: `${res.data.message}`, type: 'success'}),
    //   err => ({content: err.response.data.message ? `Global Message: ${err.response.data.message}` : `Global Message: ${err.response.statusText}`, type: 'error'})
    // ).catch(
    //   err => ({header: 'Global Message', content: `${MESSAGES.defaultError}`, type: 'error'})
    // )
    // return axios.post('http://'+host+':'+dispatcherServerPort+'/globalmessages',params).then(
    return axios.post(EndPoints.getConfig().globalmessages,params).then(
      res =>  ({header: 'Global Message', content: `${res.data.message}`, type: 'success'}),
      err => ({content: err.response.data.message ? `Global Message: ${err.response.data.message}` : `Global Message: ${err.response.statusText}`, type: 'error'})
    )
  }
}

/**
 *  Action: 'updateGlobalMessage'
 */
export const updateGlobalMessage = (message, id, user) => {
  const params = {
    ...message,
    updatedBy: user.profile.mcptt_id,
    updatedAt: `${new Date().toDateString()} ${new Date().toLocaleTimeString()}`
  }
  return dispatch => {
    // return axios.put(`http://${host}:${dispatcherServerPort}/globalmessages?toId=${user.profile.mcptt_id}&id=${id}`, params).then(
    return axios.put(`${EndPoints.getConfig().globalmessages}?toId=${user.profile.mcptt_id}&id=${id}`, params).then(
      res => ({header: 'Global Message', content: `${res.data.message}`, type: 'success'}),
      err => ({content: err.response.data.message ? `Global Message: ${err.response.data.message}` : `Global Message: ${err.response.statusText}`, type: 'error'})
    ).catch(
      err => ({header: 'Global Message', content: `${MESSAGES.defaultError}`, type: 'error'})
    )
  }
}