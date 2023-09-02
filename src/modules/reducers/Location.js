/**
 *  Reducer: 'location'
 */
import { COLORS } from '../../constants/constants'
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
} from '../actions/type';

const initialState = {
  searchText: '',
  markers: [],
  snailTrails: [],
  fences: [],
  activities: [],
  userlocation: null,
  geoFenceUpdate: null,
  mapCenterPosition: process.env.REACT_APP_DEFAULT_COORDINATE ? JSON.parse(process.env.REACT_APP_DEFAULT_COORDINATE) : [28.6830, 77.5060],
  zoomLevel: '12',
  POIHighlight: -1,
  fenceHighlight: -1
}

export default (state = initialState, action) => {
  switch (action.type) {

    case UPDATE_SEARCH_TEXT:
      return { ...state, searchText: action.data }

    case LOCATION_RECEIVED:
      if (!state.markers.filter(location => location.fromId === action.data.fromId).length) {
        return { ...state, markers: [...state.markers, action.data] }
      } else {
        return {
          ...state,
          markers: state.markers.map(location => {
            if (location.fromId === action.data.fromId) {
              return action.data
            } else {
              return location
            }
          }),
          snailTrails: state.snailTrails.map(st => {
            if (st.subscriberId === action.data.fromId) {
              return { ...st, snailTrailActivities: [...st.snailTrailActivities, { latitude: action.data.latitude, longitude: action.data.longitude }] }
            } else {
              return st
            }
          })
        }
      }

    case FETCH_LOCATIONS_SUCCESS:
      return {
        ...state,
        markers: action.data.map(marker => ({ ...marker, fromId: marker.subscriberId }))
      }

    case FETCH_LOCATIONS_ERROR:
      return {
        ...state,
        markers: []
      }

    case FETCH_SNAIL_TRAILS_SUCCESS:
      return {
        ...state,
        snailTrails: action.data.map((st, i) => ({ ...st, color: COLORS[i % COLORS.length], snailTrailActivities: st.snailTrailActivities.length ? st.snailTrailActivities.sort((a, b) => (a.id - b.id)) : st.snailTrailActivities }))
      }

    case FETCH_SNAIL_TRAILS_ERROR:
      return {
        ...state,
        snailTrails: []
      }

    case REMOVE_SNAIL_TRAIL_SUCCESS:
      return {
        ...state,
        snailTrails: state.snailTrails.filter(st => st.id !== action.id)
      }

    case FETCH_FENCES_SUCCESS:
      return {
        ...state,
        fences: action.data.map((fence, i) => ({ ...fence, color: COLORS[i % COLORS.length], geoFenceCoordinates: fence.geoFenceCoordinates.map(vertex => ({ lat: vertex.latitude, lng: vertex.longitude })) })),
        // todo - use /geoFenceActivity once id starts flowing
        activities: [].concat(...action.data.map((fence, i) => (fence.geoFenceActivities.map(activity => ({ ...activity, color: COLORS[i % COLORS.length], fenceName: fence.name, fenceId: fence.id })))))
      }

    case FETCH_FENCES_ERROR:
      return {
        ...state,
        fences: [],
        activities: []
      }

    case REMOVE_FENCE_SUCCESS:
      return {
        ...state,
        fences: state.fences.filter(fence => fence.id !== action.id),
        activities: state.activities.filter(activity => activity.fenceId !== action.id)
      }

    case REMOVE_ACTIVITY_SUCCESS:
      return {
        ...state,
        activities: state.activities.filter(activity => activity.id !== action.id)
      }

    case USER_LOCATION_UPDATE:
      return {
        ...state,
        userlocation: action.data
      }

    case USER_INSIDE_FENCE:
      return {
        ...state,
        geoFenceUpdate: action.data
      }

    case MAP_CENTER_POSITION:
      return {
        ...state,
        mapCenterPosition: action.data
      }

    case ZOOM_LEVEL:
      return {
        ...state,
        zoomLevel: action.data
      }

    case FENCE_HIGHLIGHT:
      return {
        ...state,
        fenceHighlight:action.data
      }

    case POI_HIGHLIGHT:
      return {
        ...state,
        POIHighlight:action.data
      }

    default:
      return state
  }
}