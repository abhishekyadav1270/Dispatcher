/**
 *  Reducer: 'statusMessage'
 */

import axios from 'axios'

import { EndPoints } from '../MCXclient/endpoints'
import { dispatcherServerPort,host} from '../constants/endpoints'
import { MESSAGES } from '../constants/constants'
//import {sipPrivateId} from '../utils/sipConfig'


export const FETCH_STATUS_MESSAGES_SUCCESS = 'STATUS_MESSAGE/FETCH_STATUS_MESSAGES_SUCCESS'
export const FETCH_STATUS_MESSAGES_ERROR = 'STATUS_MESSAGE/FETCH_STATUS_MESSAGES_ERROR'

const initialState = {
  statusMessages: []
}

export default (state = initialState, action) => {
  switch (action.type) {

    case FETCH_STATUS_MESSAGES_SUCCESS:
      return {
        ...state,
        statusMessages: action.data
      }

    case FETCH_STATUS_MESSAGES_ERROR:
      return {
        ...state, 
        statusMessages: []
      }

    default:
      return state
  }
}

const actions = {
  fetchAllStatusMessagesSuccess: (data) => ({type: FETCH_STATUS_MESSAGES_SUCCESS, data}),
  fetchAllStatusMessagesError: () => ({type: FETCH_STATUS_MESSAGES_ERROR})
}

/**
 *  Action: 'fetchAllStatusMessages'
 */
export const fetchAllStatusMessages = () => {
  return dispatch => {
    // return axios.get(endpoints.statusMessage).then(
    //   res => {
    //     if(res.data.entity.length > 0){
    //       dispatch(actions.fetchAllStatusMessagesSuccess(res.data.entity))
    //       return {header: 'Status Message', content: `${res.data.message}`, type: 'success'}
    //     }
    //     else{
    //       dispatch(actions.fetchAllStatusMessagesError())
    //       return {header: 'Status Message', content: `${MESSAGES.noResults}`, type: 'error'}
    //     }
    //   },
    //   err => {
    //     dispatch(actions.fetchAllStatusMessagesError())
    //     return {header: 'Status Message', content: `${MESSAGES.defaultError}`, type: 'error'}
    //   }
    // ).catch(
    //   err => {
    //     dispatch(actions.fetchAllStatusMessagesError())
    //     return {header: 'Status Message', content: `${MESSAGES.defaultError}`, type: 'error'}
    //   }
    // )
    // return axios.get(`http://${host}:${dispatcherServerPort}/status`).then(
    return axios.get(EndPoints.getConfig().status).then(
      res=>{
        console.log(res.data)
        if(res.data){
          //fetchFlag = true;
          dispatch(actions.fetchAllStatusMessagesSuccess(res.data))
          return {header: 'Communincation - Text Messages', content: `${res.data.message}`, type: 'success'}
        }
        else{
          dispatch(actions.fetchAllStatusMessagesError())
          return {header: 'Communincation - Text Messages', content: `${MESSAGES.noResults}`, type: 'nr'}
        }
      },
      err=>{
        dispatch(actions.fetchAllStatusMessagesError())
        return {header: 'Communincation - Text Messages', content: `${MESSAGES.defaultError}`, type: 'error'}
      }
    ).catch(
      err=>{
        dispatch(actions.fetchAllStatusMessagesError())
        return {header: 'Communincation - Text Messages', content: `${MESSAGES.defaultError}`, type: 'error'}
      }
    )
  }
}

/**
 *  Action: 'addStatusMessage'
 */
export const addStatusMessage = (message, user) => {
  const params = {
    ...message,
    createdBy: user.profile.mcptt_id,
    updatedBy: user.profile.mcptt_id
  }
  return dispatch => {
    return axios.put(`${EndPoints.getConfig().statusMessage}`, params).then(
      res => ({header: 'Status Message', content: `${res.data.message}`, type: 'success'}),
      err => ({content: err.response.data.message ? `Status Message: ${err.response.data.message}` : `Status Message: ${err.response.statusText}`, type: 'error'})
    ).catch(
      err => ({header: 'Status Message', content: `${MESSAGES.defaultError}`, type: 'error'})
    )
  }
}

/**
 *  Action: 'updateStatusMessage'
 */
export const updateStatusMessage = (message, id, user) => {
  const params = {
    ...message,
    updatedBy: user.profile.mcptt_id
  }
  return dispatch => {
    return axios.put(`${EndPoints.getConfig().statusMessage}/${id}`, params).then(
      res => ({header: 'Status Message', content: `${res.data.message}`, type: 'success'}),
      err => ({content: err.response.data.message ? `Status Message: ${err.response.data.message}` : `Status Message: ${err.response.statusText}`, type: 'error'})
    ).catch(
      err => ({header: 'Status Message', content: `${MESSAGES.defaultError}`, type: 'error'})
    )
  }
}