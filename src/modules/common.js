/**
 *  Reducer: 'common'
 */

import axios from 'axios'

import { EndPoints } from '../MCXclient/endpoints';
import {
  ADD_DGNA,
  EDIT_DGNA,
  FETCH_DGNA,
  UPDATE_DGNA,
  FREE_DGNA,
  EXPORT_DGNA,
  ATTACH_DGNA,
  FETCH_USERLIST,
  UPDATE_USERLIST,
  DELETE_USERLIST,
  EDIT_USERLIST
} from './actions/type';

const initialState = {
  dgna: [],
  userLists: []
}

export default (state = initialState, action) => {
  switch (action.type) {
    // case ADD_DGNA:
    //   return {
    //     ...state,
    //     dgna:[ action.data, ...state.dgna]
    //   }

    // case EDIT_DGNA:
    //   return {
    //     ...state,
    //     dgna: state.dgna.map(d=>{
    //         if(d.id === action.data.id) return action.data
    //         else return d
    //     })
    //   }

    case UPDATE_DGNA:
      if (action.data.length > 0) {
        // const newDGNA = state.dgna.map((dg,id)=>{
        //     const attachedDG = action.data.find(x=>x.ssId === dg.ssId)
        //     if(attachedDG) return attachedDG;
        //     else return dg
        //   })
        // const availDG = newDGNA.filter((dg,id)=> dg.attached).sort((a,b)=> {return a.ssId-b.ssId})
        // const freeDG = newDGNA.filter((dg,id)=> !dg.attached).sort((a,b)=> {return a.ssId-b.ssId})
        // const filtrd = [...availDG, ...freeDG]
        // return {
        //   ...state, 
        //   dgna: filtrd
        // }
        const dgData = action.data.map((dg) => {
          return { ...dg, grpMembers: JSON.parse(dg.grpMembers), attached: true }
        })
        return {
          ...state,
          dgna: dgData
        }
      }
      if (action.data.length === 0) {
        return {
          ...state,
          dgna: []
        }
      }
      return { ...state }

    case UPDATE_USERLIST:
      return {
        ...state,
        userLists: action.data
      }

    default:
      return state
  }
}

const actions = {
  // ***** DGNA ****** //
  editDgna: (data) => ({ type: EDIT_DGNA, data }),
  fetchDgna: (id) => ({ type: FETCH_DGNA, id }),
  updateDGNA: (data) => ({ type: UPDATE_DGNA, data }),
  detachDGNA: (data, id) => ({ type: FREE_DGNA, data }),
  attachDGNA: (data, id) => ({ type: ATTACH_DGNA, data, id }),
  //USERLIST
  exportDGNAList: (data, id) => ({ type: EXPORT_DGNA, data, id }),
  fetchUserLists: (groupId) => ({ type: FETCH_USERLIST, groupId }),
  updateUserLists: (data) => ({ type: UPDATE_USERLIST, data }),
  delUserLists: (data, id) => ({ type: DELETE_USERLIST, data, id }),
  editUserLists: (data, id) => ({ type: EDIT_USERLIST, data, id }),
}

/**
 *  Action: 'ADD DGNA'
 */
export const addDGNA = (data) => {
  return (dispatch, getState) => {
    const id = getState().auth.user && getState().auth.user.profile.mcptt_id;
    const domain = getState().auth.userProfile && getState().auth.userProfile.domain;
    const updatedData = { ...data, domain: domain }
    dispatch(actions.attachDGNA(updatedData, id));
  }
}
/**
 *  Action: 'EDIT DGNA'
 */
export const editDGNA = (data) => {
  return (dispatch, getState) => {
    const domain = getState().auth.userProfile && getState().auth.userProfile.domain;
    const updatedData = { ...data, domain: domain }
    dispatch(actions.editDgna(updatedData))
  }
}
/**
 *  Action: 'FETCH DGNA'
 */
export const fetchDgna = (id) => {
  return dispatch => {
    dispatch(actions.fetchDgna(id))
  }
}

export const updateDGNA = (data) => {
  return (dispatch, getState) => {
    const domain = getState().auth.userProfile && getState().auth.userProfile.domain;
    const updatedData = { ...data, domain: domain }
    dispatch(actions.updateDGNA(updatedData));
  }
}

export const detachDGNA = (groupId) => {
  return (dispatch, getState) => {
    const id = getState().auth.user && getState().auth.user.profile.mcptt_id;
    const domain = getState().auth.userProfile && getState().auth.userProfile.domain;
    const data = { domain: domain, fromId: id,  groupId: groupId}
    dispatch(actions.detachDGNA(data));
  }
}

export const exportDGNAList = (data) => {
  return (dispatch, getState) => {
    const id = getState().auth.user && getState().auth.user.profile.mcptt_id;
    const domain = getState().auth.userProfile && getState().auth.userProfile.domain;
    const updatedData = { ...data, domain: domain }
    dispatch(actions.exportDGNAList(updatedData, id));
  }
}

//USERLISTS
export const fetchUserLists = (groupId) => {
  return (dispatch) => {
    dispatch(actions.fetchUserLists(groupId))
  }
}

export const updateUserLists = (data) => {
  return dispatch => {
    dispatch(actions.updateUserLists(data));
  }
}

export const delUserLists = (data) => {
  return (dispatch, getState) => {
    const id = getState().auth.user && getState().auth.user.profile.mcptt_id;
    dispatch(actions.delUserLists(data, id));
  }
}

export const editUserLists = (data) => {
  return (dispatch, getState) => {
    const id = getState().auth.user && getState().auth.user.profile.mcptt_id;
    dispatch(actions.editUserLists(data, id));
  }
}
//OTHER

export const cacheReload = () => {
  return dispatch => {
    const payload = {
      "classez": ["snailtrailcache"],
      "passphrase": "@dm!n"
    }
    return axios.post(EndPoints.getConfig().cacheReload, payload)
  }
}