import {
  FETCH_TRAINS_INFO_ERROR,
  FETCH_TRAINS_INFO_SUCCESS,
  ATS_MESSAGE_RECEIVED,
  FETCH_TRAINS_TRACKCIRCUIT,
  FETCH_ALL_LINES,
  FETCH_TABS_DATA,
  FETCH_ACTIVE_TRAINS,
  TRAIN_UPDATE_RECIEVED,
  GET_DEPOT_DATA,
  GET_RADIO_DATA,
  GET_STATION_RADIOS,
  UPDATE_TRAIN_DETAILS,
  GET_ALL_LOCATIONS,
  GET_CURRENT_LOCATIONS,
  GET_BASESTATIONS,
  UPDATE_BASESTATION_STATUS,
  GET_LINES_GROUPSSI,
  GRABBED_LINES
} from '../actions/type';

import { presentTrainInCurrentLocs } from '../../utils/lib'
const initialState = {
  trains: [],
  trainsInfo: [],
  track: [],
  lines: [],
  tabs: [],
  depo: [],
  radioData: [],
  stationRadios: [],
  trainDetails: [],
  allLocs: [],
  currentLALocs: [],
  basestations: [],
  updateStatus: false,
  grabbedLines: [],
  laGroups: []
}

export default (state = initialState, action) => {
  switch (action.type) {

    case ATS_MESSAGE_RECEIVED:
      try {
        if (!action.data.rakeId) return;
        //Train moved to Depot
        if (action.data.depot) {
          const trainData = action.data;
          //console.log('broadcast depo trainData..', trainData, state.depo)
          // if (global.config.project !== 'mumbai') {
          //   if (trainData.line === 'NS') trainData.depot = 'Hingna'
          //   else trainData.depot = 'Mihan'
          // }
          const filteredTrains = state.trains.filter(train => train.rakeId.toString() !== trainData.rakeId.toString())
          const traindatainDepo = state.depo.filter(dep => dep.rakeId.toString() === trainData.rakeId.toString())
          if (traindatainDepo.length > 0) {
            return {
              ...state,
              depo: state.depo.map(dep => {
                if (dep.rakeId.toString() === trainData.rakeId.toString()) {
                  return trainData
                } else {
                  return dep
                }
              }),
              trains: filteredTrains
            }
          } else {
            return {
              ...state,
              depo: [...state.depo, trainData],
              trains: filteredTrains
            }
          }
        }
        //Check if train/PTID is already on track running
        if (state.trains.filter(train => train.rakeId.toString() === action.data.rakeId.toString()).length) {
          const presentTrainsInCurLocs = state.currentLALocs.filter(loc => parseInt(loc) === parseInt(action.data.currentLoc))
          if (presentTrainsInCurLocs.length !== 0) {
            return {
              ...state,
              trains: state.trains.map(train => {
                if (train.rakeId.toString() === action.data.rakeId.toString()) {
                  return action.data
                } else {
                  return train
                }
              })
            }
          } else {
            // Remove train from track
            let filteredTrains = state.trains.filter(train => train.rakeId.toString() !== action.data.rakeId.toString())
            return {
              ...state,
              trains: filteredTrains
            }
          }
        }
        else {
          //Check if Train have switch PTID
          const activeId = action.data.rakeId.toString();
          if (state.trains.filter(train => (train.rakeId.toString() === activeId && JSON.parse(train.movementDirection) != JSON.parse(action.data.movementDirection))).length) {
            const presentTrainsInCurLocs = state.currentLALocs.filter(loc => parseInt(loc) === parseInt(action.data.currentLoc))
            if (presentTrainsInCurLocs.length !== 0) {
              return {
                ...state,
                trains: state.trains.map(train => {
                  if (train.rakeId.toString() === activeId) {
                    return action.data
                  } else {
                    return train
                  }
                })
              }
            } else {
              // Remove train from track
              let filteredTrains = state.trains.filter(train => train.rakeId.toString() !== action.data.rakeId.toString())
              return {
                ...state,
                trains: filteredTrains
              }
            }
          }
          //New Train added on track
          else {
            const presentTrainsInCurLocs = state.currentLALocs.filter(loc => parseInt(loc) === parseInt(action.data.currentLoc))
            if (presentTrainsInCurLocs.length !== 0) {
              return { ...state, trains: [...state.trains, action.data], updateStatus: true }
            }
            else {
              return {
                ...state
              }
            }
          }
        }
      }
      catch (e) {
        console.log('CRASH : ATS REDUCER');
        return { ...state }
      }

    case FETCH_TRAINS_TRACKCIRCUIT:
      return {
        ...state,
        track: [
          ...state.track,
          action.data.data
        ]
      }

    case FETCH_ALL_LINES:
      return {
        ...state,
        lines: action.data
      }

    case GET_DEPOT_DATA:
      //const activeTrains = action.data.filter(train => train.depot === '' && presentTrainInCurrentLocs(state.currentLALocs, train)).map((train) => { return { ...train, physicalTrainID: train.physicalTrainID ? train.physicalTrainID : '', virtualTrackCircuit: train.virtualTrackCircuit ? train.virtualTrackCircuit : '', movementDirection: train.movementDirection == '0' ? false : true } });
      const trainsInDepot = action.data.filter(train => train.depot !== '');
      //console.log('broadcast depo trains..', action.data, trainsInDepot, state.currentLALocs)
      return {
        ...state,
        depo: trainsInDepot,
        //trains: activeTrains
      }

    case GET_RADIO_DATA:
      return {
        ...state,
        radioData: action.data
      }

    case FETCH_TRAINS_INFO_SUCCESS:
      return {
        ...state,
        trainsInfo: action.data
      }

    case FETCH_TRAINS_INFO_ERROR:
      return {
        ...state,
        trainsInfo: []
      }

    case GET_STATION_RADIOS:
      return {
        ...state,
        stationRadios: action.data
      }

    case UPDATE_TRAIN_DETAILS:
      const radioData = state.radioData;
      const data = action.data;
      if (!data.rakeId) return;
      const TrainPhysicalID = data.rakeId.toString() //parseInt(data.physicalTrainID)

      try {
        const availonDetail = !state.trainDetails.filter(train => (train.rakeId.toString() === TrainPhysicalID)).length;

        //Train moved to Depot
        if (data.depot) {
          const filteredTrainsData = state.trainDetails.filter(train => (train.rakeId.toString() !== TrainPhysicalID))
          return {
            ...state,
            trainDetails: filteredTrainsData,
          }
        }
        //TrainDetails => when new update received or new train on line
        for (var i = 0; i < radioData.length; i++) {
          const radio = radioData[i];
          const PTID = radio.rakeId.toString(); //parseInt(radio.rakeId);
          if (PTID === TrainPhysicalID) {
            let radioA = {
              trainID: data.trainNumber,
              group: null,
              crewid: data.activeCab,
              mode: data.positionType === 0 ? 'No CBTC' : 'CBTC',
              dirn: JSON.parse(data.movementDirection) ? 'DWN' : 'UP',
              line: data.line,
              PTID: PTID,
              rakeId: radio.rakeId.toString(),
              radioID: data.activeCab === 'DMB' ? parseInt(radio.RadioID_B) : parseInt(radio.RadioID_A),
              activeCabin: 'active',
              activeCab: data.activeCab,
            }
            if (!availonDetail) {
              const presentTrainsInCurLocs = state.currentLALocs.filter(loc => parseInt(loc) === parseInt(data.currentLoc))
              if (presentTrainsInCurLocs.length !== 0) {
                return {
                  ...state,
                  trainDetails: state.trainDetails.map(train => {
                    if ((train.rakeId.toString() == TrainPhysicalID)) {
                      return radioA
                    }
                    else return train
                  })
                }
              } else {
                // remove existing traindetail
                const filteredTrainsData = state.trainDetails.filter(train => train.rakeId.toString() !== TrainPhysicalID)
                return {
                  ...state,
                  trainDetails: filteredTrainsData
                }
              }
            }
            else {
              // add new trains 
              const presentTrainsInCurLocs = state.currentLALocs.filter(loc => parseInt(loc) === parseInt(data.currentLoc))
              if (presentTrainsInCurLocs.length !== 0) {
                return {
                  ...state,
                  trainDetails: [...state.trainDetails, radioA]
                }
              } else {
                return {
                  ...state,
                }
              }
            }
          }
        }
      }
      catch (e) {
        console.log(e)
      }
      return {
        ...state,
      }
    case FETCH_TABS_DATA:
      return {
        ...state,
        tabs: action.data
      }

    case FETCH_ACTIVE_TRAINS:
      return {
        ...state,
        trains: action.data
      }

    case TRAIN_UPDATE_RECIEVED:
      if (!state.trains.filter(train => train.trainNumber === action.data.trainNumber).length) {
        return { ...state, trains: [...state.trains, action.data] }
      } else {
        return {
          ...state,
          trains: state.trains.map(train => {
            if (train.trainNo === action.data.trainNo) {
              return {
                line: train.line,
                direction: train.direction,
                lte: action.data.lte,
                trainNo: train.trainNo,
                physicalId: train.physicalId,
                trackId: action.data.lte,
                time: '01/01/2020',
              }
            } else {
              return train
            }
          })
        }
      }
    case GET_ALL_LOCATIONS:
      return {
        ...state,
        allLocs: action.data
      }
    case GET_CURRENT_LOCATIONS:
      return {
        ...state,
        currentLALocs: action.data
      }
    case GET_BASESTATIONS:
      return {
        ...state,
        basestations: action.data
      }
    case UPDATE_BASESTATION_STATUS:
      return {
        ...state,
        basestations: action.data
      }
    case GET_LINES_GROUPSSI:
      return {
        ...state,
        laGroups: action.data ? action.data : []
      }
    case GRABBED_LINES:
      console.log('RESPONSE allgrabbedlines reducer', action.data)
      return {
        ...state,
        grabbedLines: action.data ? action.data : []
      }
    default:
      return state
  }
}

//[{"nodeNumber":"1","location":"LON","status":"0"},{"nodeNumber":"2","location":"KPR","status":"4"},{"nodeNumber":"3","location":"UJN","status":"4"},{"nodeNumber":"4","location":"AJS","status":"4"},{"nodeNumber":"5","location":"SIB","status":"4"},{"nodeNumber":"6","location":"KAC","status":"4"},{"nodeNumber":"7","location":"NAR","status":"4"},{"nodeNumber":"8","location":"SBS","status":"4"},{"nodeNumber":"9","location":"SNS","status":"4"}]
// state.basestations.map(base => {
//   if(base.nodeNumber == action.data.nodeNumber){
//     return {
//       ...base,
//       status: action.data.status
//     }
//   }
//   else return base;
// })