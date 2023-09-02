import axios from 'axios'

import { EndPoints } from '../../MCXclient/endpoints';
import { MESSAGES } from '../../constants/constants'
import {
  LOGIN_SUCCESS,
  LOGIN_FAILED,
  LOGOUT,
  GET_TETRAID,
  USER_PROFILE_UPDATE
} from './type';

const actions = {
  loginSuccess: (user, userProfile) => ({ type: LOGIN_SUCCESS, user, userProfile }),
  loginError: () => ({ type: LOGIN_FAILED }),
  logout: () => ({ type: LOGOUT }),
  fetchTetraId: (data) => ({ type: GET_TETRAID, data }),
  userProfileUpdate: (data) => ({ type: USER_PROFILE_UPDATE, data })
}

export const userProfileUpdate = (data) => {
  return dispatch => {
    dispatch(actions.userProfileUpdate(data))
  }
}

export const successLogin = (user, userProfile) => (dispatch) => {
  dispatch(actions.loginSuccess(user, userProfile));
  // const expTime = user.expires_at
  // const curTime =  new Date().getTime() / 1000
  // const maxTime = (expTime-curTime)*1000
  // setTimeout(() => {
  //   console.log('LOGGED OUT')
  //   dispatch(actions.logout())
  //   push('/')
  // }, maxTime);
}

export const errorLogin = () => (dispatch) => {
  dispatch(actions.loginError());
  console.log("Auth dispatch error");
}

/**
 * Action: Fetch Tetra ID of Dispatcher
 */
export const fetchTetraId = (data) => {
  return dispatch => {
    dispatch(actions.fetchTetraId(data));
  }
}


/**
 *  Action: 'authenticateUser'
 *  will call the auth api to get authenticate the user
 */
export const authenticateUser = (data, sessionUser) => {
  return dispatch => {
    if (sessionUser) {
      dispatch(actions.loginSuccess(sessionUser, null))
      return { header: 'Authentication', content: 'Success', type: 'success' }
    }
    return axios.post(EndPoints.getConfig().authenticate, data).then(
      res => {
        // localStorage.setItem('session', JSON.stringify(res.data))
        dispatch(actions.loginSuccess(res.data))
        return { header: 'Authentication', content: 'Success', type: 'success' }
      },
      err => {
        dispatch(actions.loginError())
        return { header: 'Authentication', content: `${err.response.data.message}`, type: 'error' }
      }
    ).catch(
      err => {
        dispatch(actions.loginError())
        return { header: 'Authentication', content: `${MESSAGES.authenticationError}`, type: 'error' }
      }
    )
  }
}

/**
 *  Action: 'logout'
 *  will logout the use
 */
export const logoutUser = () => {
  return dispatch => {
    // localStorage.removeItem('session')
    dispatch(actions.logout())
  }
}
