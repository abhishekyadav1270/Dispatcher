/**
 *  Action: 'location'
 */
import axios from 'axios'

import { EndPoints } from '../../MCXclient/endpoints';
import { COLORS, MESSAGES } from '../../constants/constants'
import {
  UPDATE_SEARCH_TEXT,
  LOCATION_RECEIVED,
  FETCH_LOCATIONS_SUCCESS,
  FETCH_LOCATIONS_ERROR,
  FETCH_SNAIL_TRAILS_SUCCESS,
  FETCH_SNAIL_TRAILS_ERROR,
  FETCH_FENCES_SUCCESS,
  FETCH_FENCES_ERROR,
  REMOVE_SNAIL_TRAIL_SUCCESS,
  REMOVE_FENCE_SUCCESS,
  REMOVE_ACTIVITY_SUCCESS,
  USER_LOCATION_UPDATE,
  USER_INSIDE_FENCE,
  MAP_CENTER_POSITION,
  ZOOM_LEVEL,
  FENCE_HIGHLIGHT,
  POI_HIGHLIGHT
} from './type';

const actions = {
  updateSearchText: (data) => ({ type: UPDATE_SEARCH_TEXT, data }),
  updateLocation: (data) => ({ type: LOCATION_RECEIVED, data }),
  fetchAllLocationsSuccess: (data) => ({ type: FETCH_LOCATIONS_SUCCESS, data }),
  fetchAllLocationsError: () => ({ type: FETCH_LOCATIONS_ERROR }),
  fetchSnailTrailsSuccess: (data) => ({ type: FETCH_SNAIL_TRAILS_SUCCESS, data }),
  fetchSnailTrailsError: () => ({ type: FETCH_SNAIL_TRAILS_ERROR }),
  fetchFencesSuccess: (data) => ({ type: FETCH_FENCES_SUCCESS, data }),
  fetchFencesError: () => ({ type: FETCH_FENCES_ERROR }),
  removeSnailTrailSuccess: (id) => ({ type: REMOVE_SNAIL_TRAIL_SUCCESS, id: id }),
  removeFenceSuccess: (id) => ({ type: REMOVE_FENCE_SUCCESS, id: id }),
  removeActivitySuccess: (id) => ({ type: REMOVE_ACTIVITY_SUCCESS, id: id }),
  updateUserLocation: (data) => ({ type: USER_LOCATION_UPDATE, data }),
  onGeoFenceUpdate: (data) => ({ type: USER_INSIDE_FENCE, data }),
  setMapCenterPosition: (data) => ({ type: MAP_CENTER_POSITION, data }),
  setZoomLevel: (data)=> ({type: ZOOM_LEVEL, data}),
  onFenceHighlight: (data) =>({ type: FENCE_HIGHLIGHT, data }),
  onPOIHighlight: (data)=> ({type: POI_HIGHLIGHT, data}),
}

/**
 *  Action: 'onPOIHighlight'
 */
export const onPOIHighlight = (data) => {
  return dispatch => {
    dispatch(actions.onPOIHighlight(data))
  }
}

/**
 *  Action: 'onFenceHighlight'
 */
export const onFenceHighlight = (data) => {
  // console.log("fence highlight", data);
  
  return dispatch => {
    dispatch(actions.onFenceHighlight(data))
  }
}

/**
 *  Action: 'onMapCenterPosUpdate'
 */
export const setMapCenterPosition = (data) => {
  console.log("Center Clicked" ,data);
  return dispatch => {
    dispatch(actions.setMapCenterPosition(data))
  }
}

/**
 *  Action: 'setZoomLevel'
 */
export const setZoomLevel = (data) => {
  return dispatch => {
    dispatch(actions.setZoomLevel(data))
  }
}

/**
 *  Action: 'updateSearchText'
 */
export const updateSearchText = (data) => {
  return dispatch => {
    dispatch(actions.updateSearchText(data))
  }
}

/**
 *  Action: 'updateLocation'
 */
export const updateLocation = (data) => {
  return dispatch => {
    dispatch(actions.updateLocation(data))
  }
}

/**
 *  Action: 'fetchAllLocations'
 */
export const fetchAllUserLocations = () => {
  return dispatch => {
    return axios.get(EndPoints.getConfig().sdsLocation).then(
      res => {
        if (res.data.entity.length > 0) {
          dispatch(actions.fetchAllLocationsSuccess(res.data.entity))
          return { header: 'Location', content: `${res.data.message}`, type: 'success' }
        }
        else {
          dispatch(actions.fetchAllLocationsError())
          return { header: 'Location', content: `${MESSAGES.noResults}`, type: 'error' }
        }
      },
      err => {
        dispatch(actions.fetchAllLocationsError())
        return { header: 'Location', content: `${MESSAGES.defaultError}`, type: 'error' }
      }
    ).catch(
      err => {
        dispatch(actions.fetchAllLocationsError())
        return { header: 'Location', content: `${MESSAGES.defaultError}`, type: 'error' }
      }
    )
  }
}

/**
 *  Action: 'fetchSnailTrails'
 */
export const fetchSnailTrails = (user) => {
  return dispatch => {
    return axios.get(`${EndPoints.getConfig().snailTrail}?filter=mcptt_id::${user.profile.mcptt_id}~active::true`).then(
      res => {
        if (res.data.entity.length > 0) {
          dispatch(actions.fetchSnailTrailsSuccess(res.data.entity))
          return { header: 'Snail Trail', content: `${res.data.message}`, type: 'success' }
        }
        else {
          dispatch(actions.fetchSnailTrailsError())
          return { header: 'Snail Trail', content: `${MESSAGES.noResults}`, type: 'error' }
        }
      },
      err => {
        dispatch(actions.fetchSnailTrailsError())
        return { header: 'Snail Trail', content: `${MESSAGES.defaultError}`, type: 'error' }
      }
    ).catch(
      err => {
        dispatch(actions.fetchSnailTrailsError())
        return { header: 'Snail Trail', content: `${MESSAGES.defaultError}`, type: 'error' }
      }
    )
  }
}

/**
 *  Action: 'addSnailTrail'
 */
export const addSnailTrail = (user, subscribeTo) => {
  return dispatch => {
    const params = {
      subscriberId: subscribeTo,
      user: {
        id: user.profile.mcptt_id
      },
      active: true,
      snailTrailPoints: []
    }
    return axios.put(EndPoints.getConfig().snailTrail, params).then(
      res => ({ header: 'Snail Trail', content: `${res.data.message}`, type: 'success' }),
      err => ({ content: err.response.data.message ? `Snail Trail: ${err.response.data.message}` : `Snail Trail: ${err.response.statusText}`, type: 'error' })
    ).catch(
      err => ({ header: 'Snail Trail', content: `${MESSAGES.defaultError}`, type: 'error' })
    )
  }
}

/**
 *  Action: 'removeSnailTrail'
 */
export const removeSnailTrail = (id) => {
  return dispatch => {
    return axios.delete(`${EndPoints.getConfig().snailTrail}/${id}`).then(
      res => {
        dispatch(actions.removeSnailTrailSuccess(id))
        return { header: 'Snail Trail', content: `${res.data.message}`, type: 'success' }
      },
      err => ({ header: 'Snail Trail', content: err.response.data.message ? `${err.response.data.message}` : `${err.response.statusText}`, type: 'error' })
    ).catch(
      err => ({ header: 'Snail Trail', content: `${MESSAGES.defaultError}`, type: 'error' })
    )
  }
}

/**
 *  Action: 'fetchFences'
 */
export const fetchFences = (user) => {
  return dispatch => {
    return axios.get(`${EndPoints.getConfig().fence}?filter=profile.mcptt_id::${user.profile.mcptt_id}`).then(
      res => {
        if (res.data.entity.length > 0) {
          dispatch(actions.fetchFencesSuccess(res.data.entity))
          return { header: 'GeoFence', content: `${res.data.message}`, type: 'success' }
        }
        else {
          dispatch(actions.fetchFencesError())
          return { header: 'GeoFence', content: `${MESSAGES.noResults}`, type: 'error' }
        }
      },
      err => {
        dispatch(actions.fetchFencesError())
        return { header: 'GeoFence', content: `${MESSAGES.defaultError}`, type: 'error' }
      }
    ).catch(
      err => {
        dispatch(actions.fetchFencesError())
        return { header: 'GeoFence', content: `${MESSAGES.defaultError}`, type: 'error' }
      }
    )
  }
}

/**
 *  Action: 'addFence'
 */
export const addFence = (user, obj) => {
  return dispatch => {
    const params = {
      ...obj,
      user: {
        id: user.profile.name
      },
      geoFenceCoordinates: obj.geoFenceCoordinates.map(vertex => ({ vertex: vertex.vertex, latitude: Number(vertex.lat.toFixed(6)), longitude: Number(vertex.lng.toFixed(6)) })),
      // todo
      createdBy: user.profile.mcptt_id,
      updatedBy: user.profile.mcptt_id
    }
    return axios.put(EndPoints.getConfig().fence, params).then(
      res => ({ header: 'GeoFence', content: `${res.data.message}`, type: 'success' }),
      err => ({ header: 'GeoFence', content: err.response.data.message ? `${err.response.data.message}` : `${err.response.statusText}`, type: 'error' })
    ).catch(
      err => ({ header: 'GeoFence', content: `${MESSAGES.defaultError}`, type: 'error' })
    )
  }
}

/**
 *  Action: 'removeFence'
 */
export const removeFence = (id) => {
  return dispatch => {
    return axios.delete(`${EndPoints.getConfig().fence}/${id}`).then(
      res => {
        dispatch(actions.removeFenceSuccess(id))
        return { header: 'GeoFence', content: `${res.data.message}`, type: 'success' }
      },
      err => ({ header: 'GeoFence', content: err.response.data.message ? `${err.response.data.message}` : `${err.response.statusText}`, type: 'error' })
    ).catch(
      err => ({ header: 'GeoFence', content: `${MESSAGES.defaultError}`, type: 'error' })
    )
  }
}

/**
 *  Action: 'removeGeoFenceActvity'
 */
export const removeGeoFenceActvity = (id) => {
  return dispatch => {
    return axios.delete(`${EndPoints.getConfig().geoFenceActivity}/${id}`).then(
      res => {
        dispatch(actions.removeFenceSuccess(id))
      },
      err => ({ header: 'GeoFence Activity', content: err.response.data.message ? `${err.response.data.message}` : `${err.response.statusText}`, type: 'error' })
    ).catch(
      err => ({ header: 'GeoFence Activity', content: `${MESSAGES.defaultError}`, type: 'error' })
    )
  }
}

export const updateUserLocation = (data) => {
  return (dispatch) => {
    dispatch(actions.updateUserLocation(data))
  }
}
export const onGeoFenceUpdate = (data) => {
  return (dispatch) => {
    dispatch(actions.onGeoFenceUpdate(data))
  }
}