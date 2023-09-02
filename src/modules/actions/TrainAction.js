import {
  ATS_MESSAGE_RECEIVED,
  FETCH_TRAINS_INFO_SUCCESS,
  FETCH_TRAINS_INFO_ERROR,
  FETCH_TRAINS_TRACKCIRCUIT,
  FETCH_ALL_LINES,
  FETCH_TABS_DATA,
  FETCH_ACTIVE_TRAINS,
  TRAIN_UPDATE_RECIEVED,
  GET_DEPOT_DATA,
  GET_RADIO_DATA,
  GET_STATION_RADIOS,
  UPDATE_TRAIN_DETAILS,
  UPDATE_CONTACT_TRAIN_DATA,
  GET_ALL_LOCATIONS,
  GET_CURRENT_LOCATIONS,
  UPDATE_CURRENT_LOCATIONS,
  GET_BASESTATIONS,
  UPDATE_BASESTATION_STATUS,
  UPDATE_TRAIN_LAST_LOCATION,
  GET_LINES_GROUPSSI,
  GRABBED_LINES
} from './type';
import { EndPoints } from '../../MCXclient/endpoints';
import { MESSAGES, axiosHttps } from '../../constants/constants';
import { stationRadios, trainInfo } from "../../constants/train"
import train from '../../containers/train';
//import { trackCircuits } from "../../constants/train2"
//import { trackCircuits } from "../../constants/trainPune"
//import { trackCircuits } from "../../constants/train3"
//import { trackCircuits } from "../../constants/train";

const actions = {
  atsMessageReceived: (data) => ({ type: ATS_MESSAGE_RECEIVED, data }),
  fetchAllTrainsInfoSuccess: (data) => ({ type: FETCH_TRAINS_INFO_SUCCESS, data }),
  fetchAllTrainsInfoError: () => ({ type: FETCH_TRAINS_INFO_ERROR }),
  fetchTrackcircuits: (data) => ({ type: FETCH_TRAINS_TRACKCIRCUIT, data }),
  fetchAllLines: (data) => ({ type: FETCH_ALL_LINES, data }),
  fetchTabs: (data) => ({ type: FETCH_TABS_DATA, data }),
  fetchActiveTrains: (data) => ({ type: FETCH_ACTIVE_TRAINS, data }),
  updateTrainPosn: (data) => ({ type: TRAIN_UPDATE_RECIEVED, data }),
  updateDepoData: (data) => ({ type: GET_DEPOT_DATA, data }),
  getRadioData: (data) => ({ type: GET_RADIO_DATA, data }),
  getStationRadios: (data) => ({ type: GET_STATION_RADIOS, data }),
  updateTrainDetails: (data) => ({ type: UPDATE_TRAIN_DETAILS, data }),
  updateContacts: (data) => ({ type: UPDATE_CONTACT_TRAIN_DATA, data }),
  fetchAllLocations: (data) => ({ type: GET_ALL_LOCATIONS, data }),
  fetchCurrentLocations: (data) => ({ type: GET_CURRENT_LOCATIONS, data }),
  updateCurrentLA: (data) => ({ type: UPDATE_CURRENT_LOCATIONS, data }),
  filterCurrentLA: (data, laID) => ({ type: GET_CURRENT_LOCATIONS, data, laID }),
  fetchAllBaseStations: (data) => ({ type: GET_BASESTATIONS, data }),
  updateBaseStation: (data) => ({ type: UPDATE_BASESTATION_STATUS, data }),
  updateTrainLastMovment: (data) => ({ type: UPDATE_TRAIN_LAST_LOCATION, data }),
  getGrabbedLines: (data) => ({ type: GRABBED_LINES, data }),
  getLineWithGrroupssi: (data) => ({ type: GET_LINES_GROUPSSI, data }),
}

/**
 *  Action: 'atsMessageReceived'
 */
export const atsMessageReceived = (data) => {
  return (dispatch, getState) => {
    try {
      const trainConfig = global.config.trainConfig;
      const radioData = getState().train.radioData;
      const trains = getState().train.trains;
      const tracks = getState().train.track;
      //console.log('broadcast main train data--->>>>', data, trains, tracks, radioData);
      const position = ['up', 'down', 'mid', 'up1', 'down1'];
      //data.virtualTrackCircuit = data.virtualTrackCircuit.substring(3);
      //console.log('broadcast main train action virtualTrackCircuit', data.virtualTrackCircuit)
      let foundLTE = false
      let depot = data.depot ? data.depot : ''
      if (depot.length === 0) {
        // let trackPosn = JSON.parse(data.movementDirection) ? 'down' : 'up'
        // let trackPosn = "";
        for (let i = 0; i < tracks.length; i++) {
          const line = tracks[i][data.line];
          if (line) {
            for (let j = 0; j < position.length; j++) {
              let postn = position[j];
              if (line[postn]) {
                const lte = line[postn].filter(LTE => LTE.name.toString().toUpperCase() === data.virtualTrackCircuit.toString().toUpperCase() || LTE.divergeName === data.virtualTrackCircuit);
                if (lte.length > 0) {
                  foundLTE = true
                  data.moveTo = lte[0].dist
                  data.coordY = postn === 'up' ? trainConfig.upTrackY : postn == 'down' ? trainConfig.downTrackY : postn === 'mid' ? trainConfig.midTrackY : postn === 'down1' ? trainConfig.down1TrackY : trainConfig.up1TrackY;
                  data.trackPosn = postn
                  data.track = tracks
                  break;
                }
              }
            }
            if (foundLTE) {
              break;
            }
          }
        }
        // for (let i = 0; i < tracks.length; i++) {
        //   const line = tracks[i][data.line];
        //   //console.log('broadcast main train line.. ',line)
        //   if (line && line[trackPosn]) {
        //     console.log('broadcast main trackPosn..', trackPosn, data)
        //     const lte = line[trackPosn].filter(LTE => LTE.name.toString().toUpperCase() === data.virtualTrackCircuit.toString().toUpperCase() || LTE.divergeName === data.virtualTrackCircuit);
        //     if (lte.length > 0) {
        //       foundLTE = true
        //       data.moveTo = lte[0].dist
        //       data.trackPosn = trackPosn
        //       data.mid = false
        //     } else {
        //       if (trackPosn === 'down') {
        //         trackPosn = 'up'
        //       } else {
        //         trackPosn = 'down'
        //       }
        //       //console.log('broadcast trackPosn else..', trackPosn, data)
        //       if (line[trackPosn]) {
        //         const lte = line[trackPosn].filter(LTE => LTE.name.toString().toUpperCase() === data.virtualTrackCircuit.toString().toUpperCase() || LTE.divergeName === data.virtualTrackCircuit);
        //         if (lte.length > 0) {
        //           foundLTE = true
        //           data.moveTo = lte[0].dist
        //           data.trackPosn = trackPosn
        //           data.mid = false
        //         } else {
        //           trackPosn = 'mid'
        //           //console.log('trackPosn mid..', trackPosn, data)
        //           if (line[trackPosn]) {
        //             const lte = line[trackPosn].filter(LTE => LTE.name.toString().toUpperCase() === data.virtualTrackCircuit.toString().toUpperCase() || LTE.divergeName === data.virtualTrackCircuit);
        //             if (lte.length > 0) {
        //               foundLTE = true
        //               data.moveTo = lte[0].dist
        //               data.trackPosn = trackPosn
        //               data.mid = true
        //             }
        //           }
        //         }
        //       }
        //     }
        //   }
        // }
      }
      //console.log('broadcast main train data msg', data, foundLTE, getState().train.track);
      if (depot.length > 0 || foundLTE) {
        dispatch(actions.updateTrainDetails(data))
        // console.log('IN ATS',data)
        dispatch(actions.atsMessageReceived(data))
        //Communication reducer call to update contact list
        dispatch(actions.updateContacts({ data: data, radios: radioData, trains: trains }))
      } else {
        //console.log('train not found action', data.virtualTrackCircuit.substring(3))
      }
    } catch (error) {
      console.log('train not found action error', error)
    }

  }
}

/**
 *  Action: 'fetchAllTrainsInfo'
 */
export const fetchAllTrainsInfo = () => {
  return dispatch => {
    return axiosHttps.get(EndPoints.getConfig().trainInfo).then(
      res => {
        if (res.data.entity.length > 0) {
          dispatch(actions.fetchAllTrainsInfoSuccess(res.data.entity))
          return { header: 'Trains Info', content: `${res.data.message}`, type: 'success' }
        }
        else {
          dispatch(actions.fetchAllTrainsInfoError())
          return { header: 'Trains Info', content: `${MESSAGES.noResults}`, type: 'error' }
        }
      },
      err => {
        dispatch(actions.fetchAllTrainsInfoError())
        return { header: 'Trains Info', content: `${MESSAGES.defaultError}`, type: 'error' }
      }
    ).catch(
      err => {
        dispatch(actions.fetchAllTrainsInfoError())
        return { header: 'Trains Info', content: `${MESSAGES.defaultError}`, type: 'error' }
      }
    )
  }
}

export const updateTrainLastMovment = (data) => {
  return dispatch => {
    dispatch(actions.updateTrainLastMovment(data))
  }
}

export const fetchActiveTrains = (data) => {
  return dispatch => {
    dispatch(actions.fetchActiveTrains(trainInfo))
  }
}

export const updateTrainPosn = (data) => {
  return dispatch => {
    dispatch(actions.updateTrainPosn(data))
  }
}

export const fetchTrackcircuits = (data) => {
  return dispatch => {
    dispatch(actions.fetchTrackcircuits(data))
  }
}

export const fetchAllLines = (data) => {
  return dispatch => {
    return axiosHttps.get(EndPoints.getConfig().trainmap).then(
      res => {
        console.log('allLines response', res)
        if (res.data.length > 0) {
          dispatch(actions.fetchTabs(res.data[0]))
          dispatch(actions.fetchAllLines(res.data[1]))
          dispatch(actions.getRadioData(res.data[2]))
          dispatch(actions.getStationRadios(res.data[3]))
          dispatch(actions.getLineWithGrroupssi(res.data[4]))
          // dispatch(actions.getStationRadios(stationRadios))
          return { header: 'Lines Info', content: `${res.data.message}`, type: 'success' }
        }
        else {
          console.log('🥴 FAILED')
          return { header: 'Lines Info', content: `${MESSAGES.noResults}`, type: 'error' }
        }
      }
    ).catch(
      err => {
        return { header: 'Lines Info', content: `${MESSAGES.noResults}`, type: 'error' }
      }
    )

    //  const response = trackCircuits;
    //  console.log('TRACK DATA----------------', response)
    //  dispatch(actions.fetchTabs(response[0]))
    //  dispatch(actions.fetchAllLines(response[1]))
    // FilterLineData(response[0],response[1],dispatch)
  }
}

export const fetchAllTrainDetails = () => {
  return dispatch => {
    return axiosHttps.get(EndPoints.getConfig().currentpositions).then(
      res => {
        console.log('✅ RESPONSE', res)
        if (res.data.length > 0) {
          for (const trainObj of res.data) {
            //console.log('trainobj....', trainObj)
            dispatch(atsMessageReceived(trainObj))
          }
          dispatch(actions.updateDepoData(res.data))
          return { header: 'Depo Info', content: `${res.data.message}`, type: 'success' }
        }
        else {
          console.log('🥴 FAILED')
          return { header: 'Depo Info', content: `${MESSAGES.noResults}`, type: 'error' }
        }
      },
      err => {
        console.log('❌ RESPONSE FAILED', err)
        return { header: 'Depo Info', content: `${MESSAGES.defaultError}`, type: 'error' }
      }
    ).catch(
      err => {
        console.log('ERR', err)
        return { header: 'Depo Info', content: `${MESSAGES.defaultError}`, type: 'error' }
      }
    )
  }
}

export const fetchAllLocations = () => {
  return dispatch => {
    return axiosHttps.get(EndPoints.getConfig().getAllLocs).then(
      res => {
        console.log('RESPONSE allLoc', res)
        if (res.data.length > 0) {
          dispatch(actions.fetchAllLocations(res.data))
          return { header: 'Depo Info', content: `${res.message}`, type: 'success' }
        }
        else {
          return { header: 'Depo Info', content: `${MESSAGES.noResults}`, type: 'error' }
        }
      },
      err => {
        return { header: 'Depo Info', content: `${MESSAGES.defaultError}`, type: 'error' }
      }
    ).catch(
      err => {
        console.log('ERR allLoc', err)
        return { header: 'Depo Info', content: `${MESSAGES.defaultError}`, type: 'error' }
      }
    )
  }
}

export const fetchCurrentLocations = (data) => {
  return dispatch => {
    return axiosHttps.get(EndPoints.getConfig().currentLA, { params: data }).then(
      res => {
        console.log('RESPONSE currentLoc', res)
        if (res && res.data && res.data.length > 0) {
          dispatch(actions.fetchCurrentLocations(res.data))
          return { header: 'Depo Info', content: `${res.message}`, type: 'success' }
        }
        else {
          if (res && res.data && res.data.length == 0) {
            dispatch(actions.fetchCurrentLocations(res.data))
            return { header: 'Depo Info', content: `${res.message}`, type: 'success' }
          } else {
            return { header: 'Depo Info', content: `${MESSAGES.noResults}`, type: 'error' }
          }
        }
      },
      err => {
        return { header: 'Depo Info', content: `${MESSAGES.defaultError}`, type: 'error' }
      }
    ).catch(
      err => {
        console.log('ERR allLoc', err)
        return { header: 'Depo Info', content: `${MESSAGES.defaultError}`, type: 'error' }
      }
    )
  }
}

export const filterCurrentLA = (data, laID) => {
  return dispatch => {
    let currentLocsData = data.filter(element => element.currentLA === laID)
    let currentLocs = currentLocsData.map(element => element.locId)
    //console.log('filter locs', currentLocs)
    dispatch(actions.fetchCurrentLocations(currentLocs))
  }
}

export const updateCurrentLA = (data) => {
  return dispatch => {
    let params = {
      'locId': data.locID,
      'LAId': data.laID
    }
    let axiosConfig = {
      headers: {
        'Content-Type': 'application/json',
      }
    }
    console.log('updateCurrentLA params', params)
    return axiosHttps.post(EndPoints.getConfig().updateLA, params, axiosConfig).then(
      res => {
        console.log('updateCurrentLA RESPONSE', res)
        return { header: 'Trains Info', content: `${res.message}`, type: 'success' }
      }
    ).catch(
      err => {
        console.log('updateCurrentLA ERR allLoc', err)
        return { header: 'Depo Info', content: `${MESSAGES.defaultError}`, type: 'error' }
      }
    )
  }
}

export const fetchAllBaseStations = (data) => {
  return dispatch => {
    return axiosHttps.get(EndPoints.getConfig().getAllBaseStations).then(
      res => {
        console.log('RESPONSE allbasestations', res)
        if (res.data.length > 0) {
          dispatch(actions.fetchAllBaseStations(res.data))
          return { header: 'Depo Info', content: `${res.message}`, type: 'success' }
        }
        else {
          return { header: 'Depo Info', content: `${MESSAGES.noResults}`, type: 'error' }
        }
      },
      err => {
        return { header: 'Depo Info', content: `${MESSAGES.defaultError}`, type: 'error' }
      }
    ).catch(
      err => {
        console.log('ERR allLoc', err)
        return { header: 'Depo Info', content: `${MESSAGES.defaultError}`, type: 'error' }
      }
    )
  }
}

export const updateBaseStation = (data) => {
  return (dispatch) => {
    dispatch(actions.updateBaseStation(data))
  }
}

export const getGrabbedLines = (data) => {
  return dispatch => {
    return axiosHttps.get(EndPoints.getConfig().getGrabbedLines, { params: data }).then(
      res => {
        console.log('RESPONSE allgrabbedlines', res)
        if (res.data) {
          dispatch(actions.getGrabbedLines(res.data))
        }
        return { header: 'Depo Info', content: `${res.message}`, type: 'success' }
      },
      err => {
        return { header: 'Depo Info', content: `${MESSAGES.defaultError}`, type: 'error' }
      }
    ).catch(
      err => {
        console.log('ERR allLoc', err)
        return { header: 'Depo Info', content: `${MESSAGES.defaultError}`, type: 'error' }
      }
    )
  }
}