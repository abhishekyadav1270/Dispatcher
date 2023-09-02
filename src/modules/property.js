/**
 *  Reducer: 'user'
 */

import axios from 'axios'

import { EndPoints } from '../MCXclient/endpoints'
import { MESSAGES } from '../constants/constants'
//import {sipPrivateId} from '../utils/sipConfig'


export const FETCH_PROPERTIES_SUCCESS = 'PROPERTY/FETCH_PROPERTIES_SUCCESS'
export const FETCH_PROPERTIES_ERROR = 'PROPERTY/FETCH_PROPERTIES_ERROR'

const initialState = {
  properties: []
}

export default (state = initialState, action) => {
  switch (action.type) {

    case FETCH_PROPERTIES_SUCCESS:
      return {
        ...state, 
        properties: action.data
      }

    case FETCH_PROPERTIES_ERROR:
      return {
        ...state, 
        properties: []
      }

    default:
      return state
  }
}

const actions = {
  fetchAllPropertiesSuccess: (data) => ({type: FETCH_PROPERTIES_SUCCESS, data}),
  fetchAllPropertiesError: () => ({type: FETCH_PROPERTIES_ERROR})
}

/**
 *  Action: 'fetchAllProperties'
 */
export const fetchAllProperties = () => {
  return dispatch => {
    return axios.get(EndPoints.getConfig().property).then(
      res => {
        if(res.data.entity.length > 0){
          dispatch(actions.fetchAllPropertiesSuccess(res.data.entity))
          return {header: 'Property', content: `${res.data.message}`, type: 'success'}
        }
        else{
          dispatch(actions.fetchAllPropertiesError())
          return {header: 'Property', content: `${MESSAGES.noResults}`, type: 'error'}
        }
      },
      err => {
        dispatch(actions.fetchAllPropertiesError())
        return {header: 'Property', content: `${MESSAGES.defaultError}`, type: 'error'}
      }
    ).catch(
      err => {
        dispatch(actions.fetchAllPropertiesError())
        return {header: 'Property', content: `${MESSAGES.defaultError}`, type: 'error'}
      }
    )
  }
}

/**
 *  Action: 'updateProperty'
 */
export const updateProperty = (property, id, user) => {
  const params = {
    ...property,
    updatedBy: user.profile.mcptt_id
  }
  return dispatch => {
    return axios.put(`${EndPoints.getConfig().property}/${id}`, params).then(
      res => ({header: 'Property', content: `${res.data.message}`, type: 'success'}),
      err => ({content: err.response.data.message ? `Property: ${err.response.data.message}` : `Property: ${err.response.statusText}`, type: 'error'})
    ).catch(
      err => ({header: 'Property', content: `${MESSAGES.defaultError}`, type: 'error'})
    )
  }
}