/**
 *  Reducer: 'user'
 */

import axios from 'axios'

import { EndPoints } from '../MCXclient/endpoints'
import { MESSAGES, subscriberApiAlias } from '../constants/constants'
import { User } from '../models/user'
//import {sipPrivateId} from '../utils/sipConfig'


export const FETCH_USERS_SUCCESS = 'USER/FETCH_USERS_SUCCESS'
export const FETCH_USERS_ERROR = 'USER/FETCH_USERS_ERROR'
export const FETCH_SUBSCRIBERS_SUCCESS = 'USER/FETCH_SUBSCRIBERS_SUCCESS'
export const FETCH_GROUPS_SUCCESS = 'USER/FETCH_GROUPS_SUCCESS'
export const FETCH_SUBSCRIBERS_ERROR = 'USER/FETCH_SUBSCRIBERS_ERROR'
export const FETCH_GROUPS_ERROR = 'USER/FETCH_GROUPS_ERROR'
export const FETCH_ROLES_SUCCESS = 'USER/FETCH_ROLES_SUCCESS'
export const FETCH_ROLES_ERROR = 'USER/FETCH_ROLES_ERROR'
export const FETCH_ACCESSES_SUCCESS = 'USER/FETCH_ACCESSES_SUCCESS'
export const FETCH_ACCESSES_ERROR = 'USER/FETCH_ACCESSES_ERROR'
export const ADD_USER_SUCCESS = 'USER/ADD_USER_SUCCESS'
export const ADD_ROLE_SUCCESS = 'USER/ADD_ROLE_SUCCESS'
export const UPDATE_USER_SUCCESS = 'USER/UPDATE_USER_SUCCESS'
export const DELETE_USER_SUCCESS = 'USER/DELETE_USER_SUCCESS'

const initialState = {
  users: [],
  subscribers: [],
  roles: [],
  accesses: [],
  groups: []
}

export default (state = initialState, action) => {
  switch (action.type) {

    case FETCH_USERS_SUCCESS:
      return {
        ...state, 
        users: action.data
      }

    case FETCH_USERS_ERROR:
      return {
        ...state, 
        users: []
      }

    case FETCH_SUBSCRIBERS_SUCCESS:
      return {
        ...state, 
        subscribers: action.data
      }

    case FETCH_SUBSCRIBERS_ERROR:
      return {
        ...state, 
        subscribers: []
      }

    case FETCH_GROUPS_SUCCESS:
      return{
        ...state,
        groups: action.data
      }
    
    case FETCH_GROUPS_ERROR:
      return{
        ...state,
        groups: []
      }
    case FETCH_ROLES_SUCCESS:
      return {
        ...state, 
        roles: action.data
      }

    case FETCH_ROLES_ERROR:
      return {
        ...state, 
        roles: []
      }

    case FETCH_ACCESSES_SUCCESS:
      return {
        ...state,
        accesses: action.data
      }

    case FETCH_ACCESSES_ERROR:
      return {
        ...state,
        accesses: []
      }

    case ADD_USER_SUCCESS:
      return {
        ...state,
        users: [...state.users, action.data]
      }

    case UPDATE_USER_SUCCESS:
      return {
        ...state,
        users: state.users.map(user => {
          if(user.profile.mcptt_id === action.user.id){
            return action.user
          } else {
            return user
          }
        })
      }

    case ADD_ROLE_SUCCESS:
      return {
        ...state,
        roles: [...state.roles, action.data]
      }

    case DELETE_USER_SUCCESS:
      return {
        ...state,
        users: state.users.filter(user => user.profile.mcptt_id !== action.id) 
      }

    default:
      return state
  }
}

const actions = {
  fetchAllUsersSuccess: (data) => ({type: FETCH_USERS_SUCCESS, data}),
  fetchAllUsersError: () => ({type: FETCH_USERS_ERROR}),
  fetchAllSubscribersSuccess: (data) => ({type: FETCH_SUBSCRIBERS_SUCCESS, data}),
  fetchAllSubscribersError: () => ({type: FETCH_SUBSCRIBERS_ERROR}),
  fetchAllGroupsSuccess: (data) => ({type: FETCH_GROUPS_SUCCESS, data}),
  fetchAllGroupsError: () => ({type:FETCH_GROUPS_ERROR}),
  fetchAllRolesSuccess: (data) => ({type: FETCH_ROLES_SUCCESS, data}),
  fetchAllRolesError: () => ({type: FETCH_ROLES_ERROR}),
  fetchAllAccessesSuccess: (data) => ({type: FETCH_ACCESSES_SUCCESS, data}),
  fetchAllAccessesError: () => ({type: FETCH_ACCESSES_ERROR}),
  addRoleSuccess: (data) => ({type: ADD_ROLE_SUCCESS, data}),
  deleteUserSuccess: (userId) => ({type: DELETE_USER_SUCCESS, id: userId})
}

/**
 *  Action: 'fetchAllUsers'
 */
export const fetchAllUsers = () => {
  return dispatch => {
    return axios.get(EndPoints.getConfig().user).then(
      res => {
        if(res.data.entity.length > 0){
          dispatch(actions.fetchAllUsersSuccess(res.data.entity))
          return {header: 'User', content: `${res.data.message}`, type: 'success'}
        }
        else{
          dispatch(actions.fetchAllUsersError())
          return {header: 'User', content: `${MESSAGES.noResults}`, type: 'error'}
        }
      },
      err => {
        dispatch(actions.fetchAllUsersError())
        return {header: 'User', content: `${MESSAGES.defaultError}`, type: 'error'}
      }
    ).catch(
      err => {
        dispatch(actions.fetchAllUsersError())
        return {header: 'User', content: `${MESSAGES.defaultError}`, type: 'error'}
      }
    )
  }
}
/**
 * Action: Fetch mcx subs
 */
export const fetchAllSubscribersSuccess = (data)=>{
  return dispatch =>{
    dispatch(actions.fetchAllSubscribersSuccess(data));
  }
}

/**
 * Action: Fetch mcx groups
 */
export const fetchAllGroupsSuccess = (data)=>{
  return dispatch=>{
    dispatch(actions.fetchAllGroupsSuccess(data));
  }
}

/**
 *  Action: 'fetchAllSubscribers'
 */
export const fetchAllSubscribers = () => {
  return dispatch => {
    return axios.get(EndPoints.getConfig().subscribers).then(
      res => {
        if(res.data.length > 0){
          dispatch(actions.fetchAllSubscribersSuccess(res.data.sort((a, b) => Number(a.subscriberId)-Number(b.subscriberId))))
          return {header: 'Subscriber', content: `Fetched successfully`, type: 'success'}
        }
        else{
          dispatch(actions.fetchAllSubscribersError())
          return {header: 'Subscriber', content: `${MESSAGES.noResults}`, type: 'error'}
        }
      },
      err => {
        dispatch(actions.fetchAllSubscribersError())
        return {header: 'Subscriber', content: `${MESSAGES.defaultError}`, type: 'error'}
      }
    ).catch(
      err => {
        dispatch(actions.fetchAllSubscribersError())
        return {header: 'Subscriber', content: `${MESSAGES.defaultError}`, type: 'error'}
      }
    )
  }
}

/**
 *  Action: 'updateSubscriber'
 */
export const updateSubscriber = (subscriber, id) => {
  return dispatch => {
    return axios.put(`${EndPoints.getConfig().subscriber}/${subscriberApiAlias[subscriber.subscriberType]}/${id}`, subscriber).then(
      res => ({header: 'Subscriber', content: `${res.data.message}`, type: 'success'}),
      err => ({content: err.response.data.message ? `Subscriber: ${err.response.data.message}` : `Subscriber: ${err.response.statusText}`, type: 'error'})
    ).catch(
      err => ({header: 'Subscriber', content: `${MESSAGES.defaultError}`, type: 'error'})
    )
  }
}

/**
 *  Action: 'fetchUser'
 */
export const fetchUser = (userId) => {
  if (!userId) {
    return dispatch => {
      return {header: 'User', data: new User(), type: 'success'}
    }
  }
  return dispatch => {
    return axios.get(`${EndPoints.getConfig().user}/id/${userId}`).then(
      res => {
        if(res.data.entity){
          return {header: 'User', data: res.data.entity, content: `${res.data.message}`, type: 'success'}
        }
        else{
          return {header: 'User', content: `User not found`, type: 'error'}
        }
      },
      err => {
        dispatch(actions.fetchAllUsersError())
        return {header: 'User', content: `${MESSAGES.defaultError}`, type: 'error'}
      }
    ).catch(
      err => {
        dispatch(actions.fetchAllUsersError())
        return {header: 'User', content: `${MESSAGES.defaultError}`, type: 'error'}
      }
    )
  }
}

/**
 *  Action: 'fetchAllRoles'
 */
export const fetchAllRoles = () => {
  return dispatch => {
    return axios.get(EndPoints.getConfig().role).then(
      res => {
        if(res.data.entity.length > 0){
          dispatch(actions.fetchAllRolesSuccess(res.data.entity))
          return {header: 'Role', content: `${res.data.message}`, type: 'success'}
        }
        else{
          dispatch(actions.fetchAllRolesError())
          return {header: 'Role', content: `${MESSAGES.noResults}`, type: 'error'}
        }
      },
      err => {
        dispatch(actions.fetchAllRolesError())
        return {header: 'Role', content: `${MESSAGES.defaultError}`, type: 'error'}
      }
    ).catch(
      err => {
        dispatch(actions.fetchAllRolesError())
        return {header: 'Role', content: `${MESSAGES.defaultError}`, type: 'error'}
      }
    )
  }
}

/**
 *  Action: 'fetchAllAccesses'
 */
export const fetchAllAccesses = () => {
  return dispatch => {
    return axios.get(EndPoints.getConfig().access).then(
      res => {
        if(res.data.entity.length > 0){
          dispatch(actions.fetchAllAccessesSuccess(res.data.entity))
          return {header: 'Access', content: `${res.data.message}`, type: 'success'}
        }
        else{
          dispatch(actions.fetchAllAccessesError())
          return {header: 'Access', content: `${MESSAGES.noResults}`, type: 'error'}
        }
      },
      err => {
        dispatch(actions.fetchAllAccessesError())
        return {header: 'Access', content: `${MESSAGES.defaultError}`, type: 'error'}
      }
    ).catch(
      err => {
        dispatch(actions.fetchAllAccessesError())
        return {header: 'Access', content: `${MESSAGES.defaultError}`, type: 'error'}
      }
    )
  }
}

/**
 *  Action: 'addUser'
 */
export const addUser = (user) => {
  return dispatch => {
    return axios.put(EndPoints.getConfig().user, user).then(
      res => ({header: 'User', content: `${res.data.message}`, type: 'success'}),
      err => ({content: err.response.data.message ? `User: ${err.response.data.message}` : `User: ${err.response.statusText}`, type: 'error'})
    ).catch(
      err => ({header: 'User', content: `${MESSAGES.defaultError}`, type: 'error'})
    )
  }
}

/**
 *  Action: 'addRole'
 */
export const addRole = (role) => {
  return dispatch => {
    return axios.put(EndPoints.getConfig().role, role).then(
      res => {
        dispatch(actions.addRole(res.data.entity))
        return {header: 'Role', content: `${res.data.message}`, type: 'success'}
      },
      err => ({content: err.response.data.message ? `User: ${err.response.data.message}` : `User: ${err.response.statusText}`, type: 'error'})
    ).catch(
      err => ({header: 'Role', content: `${MESSAGES.defaultError}`, type: 'error'})
    )
  }
}

/**
 *  Action: 'updateUser'
 */
export const updateUser = (user, userId, currentUser) => {
  const params = {
    ...user,
    updatedBy: user.profile.mcptt_id
  }
  return dispatch => {
    return axios.put(`${EndPoints.getConfig().user}/${userId}`, params).then(
      res => ({header: 'User', content: `${res.data.message}`, type: 'success'}),
      err => ({content: err.response.data.message ? `User: ${err.response.data.message}` : `User: ${err.response.statusText}`, type: 'error'})
    ).catch(
      err => ({header: 'User', content: `${MESSAGES.defaultError}`, type: 'error'})
    )
  }
}

/**
 *  Action: 'deleteUser'
 */
export const deleteUser = (id) => {
  return dispatch => {
    return axios.delete(`${EndPoints.getConfig().user}/${id}`).then(
      res => {
        dispatch(actions.deleteUserSuccess(id))
        return {header: 'User', content: `${res.data.message}`, type: 'success'}
      },
      err => ({header: 'User', content: err.response.data.message ? `${err.response.data.message}` : `${err.response.statusText}`, type: 'error'})
    ).catch(
      err => ({header: 'User', content: `${MESSAGES.defaultError}`, type: 'error'})
    )
  }
}