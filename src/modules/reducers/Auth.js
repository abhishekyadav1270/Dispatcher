import {
  LOGIN_SUCCESS,
  LOGIN_FAILED,
  LOGOUT,
  GETSUBSCRIBERDETAIL,
  GET_TETRAID,
  USER_PROFILE_UPDATE
} from '../actions/type';


const initialState = {
  isAuthenticated: null,
  user: null,
  userProfile: null,
  userDetail: [],
  userTetraId: ''
}

export default (state = initialState, action) => {
  switch (action.type) {
    case LOGIN_SUCCESS:
      return { ...state, isAuthenticated: true, user: action.user, userProfile: action.userProfile }

    case USER_PROFILE_UPDATE:
      return { ...state, userProfile: action.data }

    case GET_TETRAID:
      return {
        ...state,
        userTetraId: action.data
      }

    case LOGIN_FAILED:
      return { ...state, isAuthenticated: false }

    case LOGOUT:
      return { ...state, isAuthenticated: null }

    case GETSUBSCRIBERDETAIL:
      return { ...state, userDetail: action.data }

    default:
      return state
  }
}