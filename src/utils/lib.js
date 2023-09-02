import React, { Component } from 'react';
import { domain, subscriberStatus, subscriberType, trainMapConfig } from "../constants/constants"
import { TRACKS_SEPARATION } from "../constants/train"
import moment from "moment";
//import '../constants/trainmapConfig';
import '../constants/verConfig';

export const getStationLoc = (station, track) => {
  if (track.isHorizontal) {
    return {
      x: track.x + (station.x / 100) * track.length,
      y: track.y + track.dy
    }
  } else {
    return {
      x: track.x + track.dx,
      y: (station.x / 100) * track.length
    }
  }
}

export const getCircuitCords = (circuits, track, allStationsOnTrack) => {
  const circuitCords = []
  let lastStation = { abbr: null, x: 0, y: 0 }
  allStationsOnTrack.length &&
    allStationsOnTrack.forEach(station => {
      // Circuits that circuit lies between the stations
      let circuitBtSts = circuits.filter(
        circuit =>
          circuit.st1 === lastStation.abbr &&
          circuit.st2 === station.abbr &&
          circuit.track_id === track.track_id
      )
      circuitBtSts = [...circuitBtSts]

      const startStnCords = getStationLoc(lastStation, track)
      const endStnCords = getStationLoc(station, track)

      circuitBtSts.forEach((circuit, i) => {
        const circuitCopy = Object.assign({}, circuit)
        const length = track.isHorizontal
          ? endStnCords.x - startStnCords.x
          : endStnCords.y - startStnCords.y
        const interval = length / (circuitBtSts.length + 1)
        if (track.isHorizontal) {
          circuitCopy.x = startStnCords.x + interval * (i + 1)
          circuitCopy.y = endStnCords.y
        } else {
          circuitCopy.y =
            track.y + startStnCords.y + interval * (i + 1)
          circuitCopy.x = endStnCords.x
        }
        circuitCords.push(circuitCopy)
      })

      // Circuits that circuit lies on the station
      const circuitOnSts = circuits.filter(
        circuit => circuit.station === station.abbr
      )
      circuitOnSts.forEach((circuit, i) => {
        const circuitCopy = Object.assign({}, circuit)
        if (track.isHorizontal) {
          circuitCopy.x = endStnCords.x
          circuitCopy.y = endStnCords.y
        } else {
          circuitCopy.y = track.y + endStnCords.y
          circuitCopy.x = endStnCords.x
        }
        circuitCords.push(circuitCopy)
      })
      lastStation = station
    })
  return circuitCords
}

export const getTrainCords = (train, circuitCoords) => {
  const trackCircuit = train.info.trackCircuit.substr(-4)
  const stationAbbr = train.info.trackCircuit.substr(0, train.info.trackCircuit.length - trackCircuit.length)

  const circuitLoc = circuitCoords.filter(
    circuit => circuit.name === trackCircuit
  )
  let location
  circuitLoc.forEach(circuit => {
    if (
      circuit.st1 === stationAbbr ||
      circuit.st2 === stationAbbr ||
      circuit.station === stationAbbr
    ) {
      location = circuit
    }
  })
  return location
}

export const getTrackCoords = track => {
  const {
    x,
    y,
    dx = 0,
    dy = 0,
    length,
    isHorizontal,
    initDx = 0,
    initDy = 0,
    cropEnd,
    cropStart
  } = track
  let x1 = x + dx + initDx
  let y1 = y + dy + initDy
  let x2 = isHorizontal ? x1 + length : x1
  let y2 = isHorizontal ? y1 : y1 + length

  if (cropStart) {
    if (!isHorizontal) {
      y1 = y1 + TRACKS_SEPARATION
    } else {
      x1 = x1 + TRACKS_SEPARATION
    }
  } else if (cropEnd) {
    if (!isHorizontal) {
      y2 = y2 - TRACKS_SEPARATION
    } else {
      x2 = x2 - TRACKS_SEPARATION
    }
  }
  return { x1, y1, x2, y2 }
}

export const createFilterQuery = (user) => {
  return {
    "queryConditions": [
      {
        "field": "fromId",
        "value": user,
        "clause": "EQUALS",
        "conjunction": "NONE"
      },
      {
        "field": "toId",
        "value": user,
        "clause": "EQUALS",
        "conjunction": "OR"
      }
    ]
  }
}

export const getKeyByValue = (object, value) => Object.keys(object).find(key => object[key] === value)

export const hasPermission = (user, permission) => {
  try {
    return user.profile.Role.toString() === permission.toString();
  } catch (e) {
    return false
  }
}

export const fetchSubscriberIdFromTrain = (subscribers, trainInfo) => {
  try {
    return subscribers.filter(sub => sub.trainInfo && sub.trainInfo.ptiTrainId === trainInfo.physicalTrainID && sub.trainInfo.trainNumber === trainInfo.trainNumber)[0].subscriberId
  } catch (e) {
    return null
  }
}

export const convertDaysToSeconds = (days) => days * 86400

export const convertSecondsToDays = (seconds) => seconds / 86400

export const uniqueByKey = (array, key) => array.filter((e, i) => array.findIndex(a => a[key] === e[key]) === i)

export const setTrainConfig = (lteCount) => {
  if (lteCount > 100) {
    const configData = trainMapConfig.filter(conf => lteCount >= conf.minlteCount && lteCount <= conf.maxlteCount)
    if (configData && configData.length > 0) {
      global.config.trainConfig = configData[0]
    }
  }
}

export const getLTEsCount = (trackData) => {
  let count = 0;
  for (let k = 0; k < trackData.length; k++) {
    let LTEslist = trackData[k].LTEs;
    let diverge = trackData[k].diverging;
    if (LTEslist && LTEslist.length > 0) {
      for (let j = 0; j < LTEslist.length; j++) count++;
      if (diverge && diverge.length != 0) count++
    }
    else if (diverge && diverge.length != 0) count++;
  }
  return count;
}

export const setMaxLTE = (upTrack, downTrack) => {
  if (global.config.project == 'mumbai' || global.config.project == 'dhaka') {
    global.config.trainConfig = global.config.mumbaiTrainConfig;
  }
  else if (global.config.project == 'pune') {
    global.config.trainConfig = global.config.puneTrainConfig;
  } else if (global.config.project == 'cdot') {
    global.config.trainConfig = global.config.cdotTrainConfig;
  }
  const upCount = getLTEsCount(upTrack);
  const downCount = getLTEsCount(downTrack)
  const maxLastCount = global.config.trainConfig.maxlteCount;
  const newMax = Math.max(upCount, downCount);
  if (newMax > maxLastCount) setTrainConfig(newMax)
}
//Newly Added
export const getAllStations = async (uptrack, downtrack) => {
  let station = [];
  const upstations = await getAllSortedStations(uptrack)
  const downstations = await getAllSortedStations(downtrack)
  for (let i = 0; i < upstations.length; i++) {
    const newSTn = upstations[i];
    newSTn.nextDownLTE = downstations[i].nextLTE;
    station.push(newSTn)
  }
  return station;
}

//getUpstations
export const getAllSortedStations = (track) => {
  let station = [];
  for (let i = 0; i < track.length; i++) {
    const trackCircuit = track[i];
    if (trackCircuit.station && trackCircuit.station.length > 0) {
      const newSTn = trackCircuit.station[0];
      if (i + 1 < track.length) {
        newSTn.nextLTE = track[i + 1].name;
      } else {
        newSTn.nextLTE = ''
      }
      station.push(newSTn)
    }
  }
  return station;
}

export const getLTEsCountbetweenStation = (track, prevStn, nextStn) => {

  let count = 0;
  for (let i = 0; i < track.length; i++) {
    const trackCircuit = track[i];
    const LTEs = trackCircuit.LTEs;
    const diverge = trackCircuit.diverging;
    if (trackCircuit.prevStation.includes(prevStn) && trackCircuit.nextStation.includes(nextStn)
      //&& trackCircuit.station && trackCircuit.station.length==0 &&trackCircuit.LTEs && trackCircuit.LTEs.length>0
    ) {
      // count=count + (trackCircuit.LTEs.length>0?trackCircuit.LTEs.length:1)
      if (LTEs && LTEs.length !== 0 && diverge && diverge.length === 0) {
        count = count + LTEs.length
        // console.log('only LTE')
      }
      if (LTEs && LTEs.length !== 0 && diverge && diverge.length !== 0) {
        //count = count + LTEs.length + 1
        count = count + LTEs.length
        // console.log('LTE & Div')
      }
      if (LTEs && LTEs.length === 0 && diverge && diverge.length !== 0) {
        //count = count + 1
        count = count + diverge.length
        // console.log('Only Div')
      }
      // if(LTEs && LTEs.length === 0 && diverge && diverge.length===0){
      //   count=count +1
      //   // console.log('NO LTE & DIV')
      // }
      //console.log('🐙', count, trackCircuit, prevStn, nextStn);
    }
  }
  return count;
}

export const getInitialLTEsFirstSTation = (track, nextStn) => {
  let count = 0;
  //console.log('STATION ARRANGED......getInitialLTEsFirstSTation', track, nextStn);
  for (let i = 0; i < track.length; i++) {
    const trackCircuit = track[i];
    const LTEs = trackCircuit.LTEs;
    const diverge = trackCircuit.diverging;
    if (trackCircuit.station && trackCircuit.station.length > 0 && trackCircuit.station[0].abbr === nextStn) {
      break;
    }
    else {
      if (LTEs && LTEs.length !== 0 && diverge && diverge.length === 0) {
        count = count + LTEs.length
      }
      if (LTEs && LTEs.length !== 0 && diverge && diverge.length !== 0) {
        count = count + LTEs.length + 1
      }
      else {
        count = count + (LTEs.length > 0 ? LTEs.length : 1)
      }
    }
    //console.log('STATION ARRANGED......LTEs and diverge', LTEs, diverge, count)
  }
  return count;
}

export const AddnewData = (track, lte, count) => {
  const newTrackData = track.map((trackCircuit) => {
    if (trackCircuit.name === lte) {
      let newTrack = trackCircuit;
      newTrack.rearrange = count + 1
      return newTrack
    }
    else {
      return trackCircuit
    }
  })
  return newTrackData
}

export const getDiffereneInFirstStation = async (upTrack, downTrack, station) => {
  //console.log('PASSED', station)
  const up = await getInitialLTEsFirstSTation(upTrack, station);
  const down = await getInitialLTEsFirstSTation(downTrack, station);
  //console.log('STATION ARRANGED... FIRST', up, down)
  if (up === down) {
    return null
  }
  if (down < up) {
    return (up - down)
  }
  if (down > up) {
    return -(down - up)
  }
}

export const getNewLTE = async (upTrack, downTrack) => {
  const station = await getAllStations(upTrack, downTrack);
  //console.log('STATION ARRANGED...station... ', station)
  let downAdjust = 0
  if (station && station.length > 0) {
    //Identify gap between first station lte
    downAdjust = await getDiffereneInFirstStation(upTrack, downTrack, station[0].abbr)
    //console.log('STATION ARRANGED...downAdjust... ', downAdjust)
    //Manage Track LTEs where unequal between two stations
    for (let i = 0; i < station.length; i++) {
      if (station[i] && station[i + 1]) {
        const diffUp = await getLTEsCountbetweenStation(upTrack, station[i].abbr, station[i + 1].abbr)
        const diffDown = await getLTEsCountbetweenStation(downTrack, station[i + 1].abbr, station[i].abbr)
        //console.log('STATION ARRANGED...diffUp...diffDown... ', i, i + 1, diffUp, diffDown)
        if (diffUp > diffDown) {
          downTrack = await AddnewData(downTrack, station[i].nextDownLTE, diffUp - diffDown)
          //console.log('🐙>>>UP\n', station[i].abbr, '->', station[i + 1].abbr, station[i].nextDownLTE, diffUp, diffDown, diffUp - diffDown)
        }
        if (diffDown > diffUp) {
          upTrack = await AddnewData(upTrack, station[i].nextLTE, diffDown - diffUp)
          upTrack = await AddnewData(upTrack, station[i].nextVTE || station[i].nextLTE, diffDown - diffUp)
          //console.log('🐙>>>DOWN\n', station[i].abbr, '->', station[i + 1].abbr, station[i].nextLTE, diffDown - diffUp)
        }
      }
    }
  }

  //console.log('🐙 POST UPDATE', upTrack, downTrack, downAdjust)
  return { upTrack, downTrack, downAdjust }
}

export const getDistForDiverging = (distTrack, line, dirn, lte) => {
  console.log("distanceForDiverging", dirn, distTrack, line, lte)
  if (dirn === 'up') {
    const upDist = getLTEdist(distTrack, line, dirn, lte.name);
    const downDist = getLTEdist(distTrack, line, 'down', lte.mergingTC);
    //console.log('MID DIST UP', lte, upDist, downDist)
    if (upDist && downDist) return { diff: upDist - downDist, mid: false };
    if (upDist && !downDist) {
      const midDist = getLTEdist(distTrack, line, 'mid', lte.mergingTC);
      //console.log('MID DIST got', upDist, midDist, lte)
      if (lte.type === 'Siding') return { diff: 0, mid: false, direction: lte.direction, siding: true };
      else return { diff: upDist - midDist, mid: true, direction: lte.direction };
    }
    else return 0;
  }
  if (dirn === 'dwn') {
    const downDist = getLTEdist(distTrack, line, 'down', lte.name);
    const upDist = getLTEdist(distTrack, line, 'up', lte.mergingTC);
    // console.log('DOWN',lte.name,upDist,lte.mergingTC,downDist)
    if (upDist && downDist) return { diff: upDist - downDist, mid: false };
    if (!upDist && downDist) {
      const midDist = getLTEdist(distTrack, line, 'mid', lte.mergingTC);
      // console.log('MID DIST',downDist,midDist,lte)
      if (lte.type === 'Siding') return { diff: 0, mid: false, siding: true, direction: lte.direction };
      else return { diff: downDist - midDist, mid: true, direction: lte.direction };
    }
    else return 0;
  }
  if (dirn === 'mid') {
    const upDist = getLTEdist(distTrack, line, 'up', lte.mergingTC, true);
    const downDist = getLTEdist(distTrack, line, 'down', lte.mergingTC, true);
    //console.log('DISTMID----->',lte,upDist,downDist)
    if (upDist) return upDist;
    if (downDist) return downDist;
  }
}

//Returns LTE distance value
export const getLTEdist = (tracks, linetype, trackPosn, LTEid, mid = false) => {
  let dist;
  if (LTEid) {
    for (let i = 0; i < tracks.length; i++) {
      const line = tracks[i][linetype];
      if (line && line[trackPosn]) {
        if (mid) {
          let lte = line[trackPosn].filter(LTE => LTE.TC == LTEid);
          if (lte) {
            // do nothing
          } else {
            lte = line[trackPosn].filter(LTE => LTE.name.toUpperCase().includes(LTEid.toUpperCase()));
          }
          if (lte && lte.length > 0) {
            dist = lte[0].dist;
            return dist;
          }
        }
        else {
          const lineData = line[trackPosn];
          let prev, next;
          for (var j = 0; j < lineData.length; j++) {
            prev = lineData[j - 1];
            let condn = lineData[j].TC == LTEid;
            if (condn) {
              // do nothing
            } else {
              condn = lineData[j].name.toUpperCase().includes(LTEid.toUpperCase())
            }
            if (condn) {
              next = lineData[j]
              if (prev && prev.name === 'DIVERGE') return prev.dist
              else return next.dist
            }
          }
        }
      }
    }
  }
}

//Get upTrack and DownTrack distance Calculation
export const getLTEsOnlywithDistance = (trackData, dirn, adjust = 0) => {  //return distances in pixel for ltes
  // this.printALlLTEs(trackData,trackData)
  //const dotSpace = 15; //each dot/LTE takes 5px height + 10px left & right margin
  const lteGap = global.config.trainConfig.lteGap;   //5
  const lteSize = global.config.trainConfig.lteSize;   //7  
  const rightGap = global.config.trainConfig.trackCtGap;  //2
  const dotSpace = lteSize + (lteGap * 2); // 17
  // const emptyTrackarea = 80; //EMpty track area 80 px left and right
  //const trainView = 40+(adjust?adjust*15:0); //train view pointer calculated value (80px left - 50px trainview/2-15px first track dot)
  // const trainView = (global.config.trainConfig.startGap - 25 - dotSpace) + (adjust?adjust*dotSpace:0);

  let trainView = global.config.trainConfig.startGap - 34.335 - (dotSpace / 2) + (adjust ? adjust * dotSpace : 0) //38.495 //34.335+green line

  //                               80
  //    55. -50
  // if (dirn === 'up1' || dirn === 'down1') {
  //   trainView = global.config.trainConfig.startGap - 34.335 - (dotSpace / 2) + (adjust ? adjust * dotSpace : 0) - 51
  //   console.log("INDIA UP1 ----->", lteGap, lteSize, rightGap, dotSpace, trainView, global.config.trainConfig.startGap);
  // }


  if (dirn === 'down1') {
    trainView = global.config.trainConfig.down1TrackPl - 36.335 - (dotSpace / 2) + (adjust ? adjust * dotSpace : 0)
  }
  if (dirn === 'mid') {
    trainView = global.config.trainConfig.midTrackPl - 36.335 - (dotSpace / 2) + (adjust ? adjust * dotSpace : 0)
  }
  if (dirn === 'up1') {
    trainView = global.config.trainConfig.up1TrackPl - 36.335 - (dotSpace / 2) + (adjust ? adjust * dotSpace : 0)
  }

  //console.log("INDIA ----->", lteGap, lteSize, rightGap, dotSpace, trainView, global.config.trainConfig.startGap);
  //  5        7     2          17        37.165          80
  // console.log('trainview',trainView,adjust)
  let newLTEsList = [];
  let marginRight = 0;  //2px marginright after evert trackcircuit completion
  let increase = 1;
  // console.log('ADJUST',trackData, dirn,adjust,trainView)
  for (let k = 0; k < trackData.length; k++) {
    let LTEslist = trackData[k].LTEs;
    let diverge = trackData[k].diverging;
    let TC = trackData[k].name;
    let divergingN = ''
    if (trackData[k].rearrange) {
      increase = increase + (trackData[k].rearrange - 1); //rearrange is 2 if diff is 1, so 2-1=1
      // console.log('🐉 INCREASE ',increase,trackData[k])
    }
    // if (trackData[k].size) {
    //   increase = increase + (trackData[k].size); //rearrange is 2 if diff is 1, so 2-1=1
    //   console.log('🐉 INCREASE ',increase,trackData[k])
    // }
    if (LTEslist && LTEslist.length > 0 && diverge && diverge.length === 0) {
      if (dirn === 'down' && global.config.trainConfig.downRev) LTEslist = LTEslist.reverse();
      for (let j = 0; j < LTEslist.length; j++) {           //   0       +    37.165   +  (1+1)*17
        let size = 0;
        if (LTEslist[j].size) {
          increase = increase + (LTEslist[j].size - 1);
        }
        newLTEsList.push({ name: LTEslist[j].name, TC, dist: marginRight + trainView + (newLTEsList.length + increase) * dotSpace + size, divergeName: divergingN })
        //console.log("Bharat --->", LTEslist[j].name, (marginRight + trainView + (newLTEsList.length + increase + size) * dotSpace), newLTEsList);
      }
      marginRight = marginRight + rightGap;
    }
    if (LTEslist && LTEslist.length > 0 && diverge && diverge.length !== 0) {
      let ifrearr = 0;
      if (dirn === 'down' && global.config.trainConfig.downRev) LTEslist = LTEslist.reverse();
      if (trackData[k].rearrange) ifrearr = trackData[k].rearrange - 1;
      else ifrearr = 0
      //Diverge lte representation
      if (LTEslist[0].diverging) {
        divergingN = LTEslist[0].diverging
      }
      //newLTEsList.push({ name: 'DIVERGE', TC, dist: marginRight + trainView + (newLTEsList.length + increase - ifrearr) * dotSpace, divergeName: divergingN });
      for (let j = 0; j < LTEslist.length; j++) {
        let size = 0;
        if (LTEslist[j].size) {
          increase = increase + (LTEslist[j].size - 1);  // 1+ 2
        }
        newLTEsList.push({ name: LTEslist[j].name, TC, dist: marginRight + trainView + (newLTEsList.length + increase) * dotSpace, divergeName: '' })
      }
      // for (let j = 0; j < LTEslist.length; j++) {
      //   for (let k = 0; k < diverge.length; k++) {
      //     let ltename = LTEslist[j].name
      //     let nextLTE = diverge[k].nextLTE
      //     let prevLTE = diverge[k].prevLTE
      //     if (ltename == nextLTE || ltename == prevLTE) {
      //       newLTEsList.push({ name: 'DIVERGE', TC, dist: marginRight + trainView + (newLTEsList.length + increase - ifrearr) * dotSpace, divergeName: divergingN });
      //     }
      //   }
      //   newLTEsList.push({ name: LTEslist[j].name, TC, dist: marginRight + trainView + (newLTEsList.length + increase) * dotSpace, divergeName: '' })
      // }
      marginRight = marginRight + rightGap;
    }
    if (LTEslist && LTEslist.length === 0 && diverge && diverge.length !== 0) {
      marginRight = marginRight + rightGap;
      newLTEsList.push({ name: trackData[k].name, TC, dist: marginRight + trainView + (newLTEsList.length + increase) * dotSpace, divergeName: divergingN })
    }
  }
  return newLTEsList;
}

/**************MID TRACK CALCULATION */
export const getMidTrackwithDistance = (upTrack, downTrack, midTrack) => {
  let leftgap = 10000000000, midDistTrack = [];
  const lteGap = global.config.trainConfig.lteGap;
  const lteSize = global.config.trainConfig.lteSize;
  const dotSpace = lteSize + (lteGap * 2);
  // const dotSpace = 15;
  if (midTrack && midTrack.length > 0) {
    for (var i = 0; i < midTrack.length; i++) {
      if (midTrack[i].diverging && midTrack[i].diverging.length > 0) {
        const dist = getLTEdistMID(upTrack, downTrack, midTrack[i].diverging[0].mergingTC)
        if (dist < leftgap) leftgap = dist;
      }
    }
  }
  leftgap = leftgap - 25;
  for (var j = 0; j < midTrack.length; j++) {
    let LTEslist = midTrack[j].LTEs;
    let diverge = midTrack[j].diverging;
    let divergingN = ''
    if (LTEslist && LTEslist.length === 0 && diverge && diverge.length !== 0) {
      midDistTrack.push({ name: midTrack[j].name, dist: leftgap + (midDistTrack.length + 1) * dotSpace, divergeName: divergingN })
    }
    if (LTEslist && LTEslist.length > 0 && diverge && diverge.length !== 0) {
      if (LTEslist[0].diverging) {
        divergingN = LTEslist[0].diverging
      }
      midDistTrack.push({ name: 'DIVERGE', dist: leftgap + (midDistTrack.length + 1) * dotSpace, divergeName: divergingN })
      for (let k = 0; k < LTEslist.length; k++) {
        midDistTrack.push({ name: LTEslist[k].name, dist: leftgap + (midDistTrack.length + 1) * dotSpace, divergeName: divergingN })
      }
    }
  }
  return midDistTrack;
}

export const getLTEdistMID = (lineUp, lineDown, LTEid) => {
  let dist;
  const lteUp = lineUp.filter(LTE => LTEid.toUpperCase().includes(LTE.name.toUpperCase()));
  const lteDwn = lineDown.filter(LTE => LTEid.toUpperCase().includes(LTE.name.toUpperCase()));
  console.log('STATION ARRANGED mid track diverging..', lineUp, lineDown, LTEid, lteDwn, lteUp)
  if (lteUp.length > 0) {
    dist = lteUp[0].dist;
    return dist;
  }
  else {
    dist = lteDwn[0].dist;
    return dist;
  }
}

//Get last count of SDS and Alarm
export const getCountSDS = (SDS, userId) => {
  const sent = SDS.filter(message => message.fromId === userId).sort((a, b) => new Date(b.created) - new Date(a.created));
  let count = sent[0] && sent[0].id ? Number(sent[0].id) : 0;
  for (var i = 0; i < sent.length; i++) {
    const indexId = Number(sent[i].id)
    if (count < indexId) count = indexId
  }
  return count;
}

//Get last count of Alerts
export const getAlertCount = (SDS, userId) => {
  let id, grpId = 1
  try {
    const sds = SDS.filter(message => message.sdsType === "STATUS_MESSAGE")
    const groupsds = SDS.filter(message => message.sdsType === "GROUP_STATUS_MESSAGE")
    id = getCountSDS(sds, userId)
    grpId = getCountSDS(groupsds, userId)
    return { id, grpId }
  }
  catch (e) {
    console.log('ERR: getting ALERTS count', e)
    return { id, grpId }
  }
}

//Get last count of Alerts
export const getTextCount = (SDS, userId) => {
  let id, grpId = 1
  try {
    const sds = SDS.filter(message => message.sdsType === "TEXT_MESSAGE")
    const groupsds = SDS.filter(message => message.sdsType === "GROUP_TEXT_MESSAGE")
    console.log('TEXT COUNT', sds, groupsds)
    id = getCountSDS(sds, userId)
    grpId = getCountSDS(groupsds, userId)
    return { id, grpId }
  }
  catch (e) {
    console.log('ERR: getting SDS_TEXT count', e)
    return { id, grpId }
  }
}

//Get last count of CALL
export const getCountCall = (calls, userId) => {
  const sent = calls.filter(call => call.fromId === userId).sort((a, b) => new Date(b.created) - new Date(a.created));
  let count = sent[0] && sent[0].id ? Number(sent[0].id) : 0;
  for (var i = 0; i < sent.length; i++) {
    const indexId = Number(sent[i].indexId)
    if (count < indexId) count = indexId
  }
  return count;
}
//*** CONTACT LIST/ USER DETAILS */
//Render Contact Icons
export const RenderIcon = (type, iconColor, status = true) => {
  if (type === subscriberType['GROUP'] || type === subscriberType['INDIVIDUAL'] || type === subscriberType['Dispatcher']) iconColor = iconColor === 'green' ? '#18d26b' : iconColor;
  if (!status) {
    iconColor = '#808080';
  }
  if (type === subscriberType['GROUP']) {
    return (
      <svg
        width="18"
        height="12"
        viewBox="0 0 18 12"
        fill={iconColor}
        xmlns="http://www.w3.org/2000/svg">
        <path
          d="M10.625 4.25C11.8008 4.25 12.7429 3.30083 12.7429 2.125C12.7429 0.949167 11.8008 0 10.625 0C9.44917 0 8.5 0.949167 8.5 2.125C8.5 3.30083 9.44917 4.25 10.625 4.25ZM4.95833 4.25C6.13417 4.25 7.07625 3.30083 7.07625 2.125C7.07625 0.949167 6.13417 0 4.95833 0C3.7825 0 2.83333 0.949167 2.83333 2.125C2.83333 3.30083 3.7825 4.25 4.95833 4.25ZM4.95833 5.66667C3.30792 5.66667 0 6.49542 0 8.14583V9.91667H9.91667V8.14583C9.91667 6.49542 6.60875 5.66667 4.95833 5.66667ZM10.625 5.66667C10.4196 5.66667 10.1858 5.68083 9.93792 5.70208C10.7596 6.29708 11.3333 7.0975 11.3333 8.14583V9.91667H15.5833V8.14583C15.5833 6.49542 12.2754 5.66667 10.625 5.66667Z"
        />
      </svg>
    )
  }
  if (type === subscriberType['INDIVIDUAL'] || type === subscriberType['Dispatcher'] || type === '') {
    return (
      <svg
        width="12"
        height="12"
        viewBox="0 0 12 12"
        fill={iconColor}
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M6 5.14286C7.42286 5.14286 8.56285 3.99429 8.56285 2.57143C8.56285 1.14857 7.42286 0 6 0C4.57714 0 3.42857 1.14857 3.42857 2.57143C3.42857 3.99429 4.57714 5.14286 6 5.14286ZM6 6.85714C4.00286 6.85714 0 7.86 0 9.85714V12H12V9.85714C12 7.86 7.99714 6.85714 6 6.85714Z"
          fill={iconColor}
        />
      </svg>
    )
  }
  // if (type === subscriberType['MOBILE']) {
  //     return (
  //         <svg width="15" height="15" viewBox="0 0 25 26" fill="none" xmlns="http://www.w3.org/2000/svg">
  //             <path fill-rule="evenodd" clip-rule="evenodd" d="M18.5836 25.8328C21.5836 25.8328 24.0164 23.4023 24.0164 20.4V5.43281C24.0164 2.43281 21.5859 0 18.5836 0H5.43516C2.43516 0 0 2.43047 0 5.43281V20.4C0 23.4 2.4375 25.8328 5.43516 25.8328H18.5836ZM18.682 11.543C20.3039 11.543 21.6117 10.2305 21.6117 8.61328V4.90781C21.6117 3.29063 20.3039 1.98047 18.682 1.98047H5.32031C3.70312 1.98047 2.39062 3.29063 2.39062 4.90781V8.61328C2.39062 10.2305 3.70312 11.543 5.32031 11.543H18.682ZM4.41484 22.5423C5.50234 22.5423 6.38594 21.661 6.38594 20.5735C6.38594 19.4837 5.50234 18.6001 4.41484 18.6001C3.89146 18.6001 3.3895 18.808 3.01941 19.1781C2.64932 19.5482 2.44141 20.0501 2.44141 20.5735C2.44141 21.661 3.325 22.5423 4.41484 22.5423ZM17.6152 20.5735C17.6152 21.661 18.4965 22.5423 19.5863 22.5423C20.6738 22.5423 21.5551 21.661 21.5551 20.5735C21.5551 19.4837 20.6738 18.6001 19.5863 18.6001C18.4965 18.6001 17.6152 19.4837 17.6152 20.5735Z" 
  //             fill={iconColor} />
  //         </svg>
  //     )
  // }
  if (type === subscriberType['MOBILE']) {
    return (
      <img
        src={"/images/ptt_" + iconColor + ".svg"}
        style={{ height: 17, width: 17 }}
        alt={'PTT'}
      />
    )
  }
  if (type === subscriberType['APPLICATION']) {
    return (
      <img
        src={"/assets/images/svg-main/dispatcher_" + iconColor + ".svg"}
        style={{ height: 17, width: 17 }}
        alt={'app'}
      />
    )
  }
  if (type === subscriberType['TERMINAL']) {
    return (
      <img
        src={"/assets/images/svg-main/terminal_" + iconColor + ".svg"}
        style={{ height: 17, width: 17 }}
        alt={'Terminal'}
      />
    )
  }
}

//GET COLOR ORANGE OR GREEN
export const setIconColor = (data) => {
  if (data.Reg_status === subscriberStatus['REGISTERED']) {
    if (data.Domain === domain['MCX']) return 'orange';
    else return 'green';
  }
  if (data.subscriber_type === subscriberType['GROUP']) return 'orange'
  else return 'gray'
}

export const getPriority = (p) => {
  if (p <= 5) return 'LOW'
  else if (p > 5 && p <= 11) return 'MED'
  else if (p > 11 && p < 15) return 'HIGH'
  else if (p === 15) return 'EMG'
}
//Returns state msg for call
export const getCallAction = (type) => {
  switch (type) {
    case "ACQUIRE_PUSH_TO_TALK":
      return 'PTT on request'
    case "HOLD":
      return 'Call on hold'
    case "MUTE_MIC":
      return 'Call on mute'
    default:
      return ''
  }
};

export const getCallActionState = (type, action) => {
  switch (type) {
    case "ACQUIRE_PUSH_TO_TALK":
      return {
        ...action,
        hold: false,
        pttReq: true,
        pttDis: true,
        // enable
        holdDis: false,
        micDis: false,
        speakerDis: false,
      }
    case "RELEASE_PUSH_TO_TALK":
      return {
        ...action,
        hold: false,
        mic: false,
        ptt: false,
      }
    case "PTT_GRANTED":
      return {
        ...action,
        hold: false,
        mic: true,
        ptt: true,
        pttReq: false,
        pttDis: false,
      }
    case "PTT_IGNORED":
      return {
        ...action,
        hold: false,
        mic: false,
        ptt: false,
        pttReq: false,
        pttDis: false,
      }
    case "PTT_TICK":
      return {
        ...action,
        ispttTick: true,
        // holdDis:true,
        // micDis:true,
        // speakerDis:true,
        // pttDis:true,
        // disconnectDis:true
      }
    case "MUTE_SPEAKER":
      return {
        ...action,
        hold: false,
        mic: false,
        speaker: false,
      }
    case "UNMUTE_SPEAKER":
      return {
        ...action,
        hold: false,
        speaker: true,
      }
    case "HOLD":
      return {
        ...action,
        hold: true,
        micDis: true,
        speakerDis: true,
        pttDis: true
      }
    case "UNHOLD":
      return {
        ...action,
        hold: false,
        micDis: false,
        speakerDis: false,
        pttDis: false
      }
    case "DISCONNECTED":
      return {
        ...action,
        disconnected: true
      }
    case "UNMUTE_MIC":
      return {
        ...action,
        hold: false,
        mic: true,
        speaker: true,
      }
    case "MUTE_MIC":
      //if Mic & Speaker ON
      if (action['speaker'] && action['mic']) {
        return {
          ...action,
          hold: false,
          mic: false,
          speaker: true,
        }
      }
      else break;
    case "DISABLE":
      return {
        ...action,
        ispttTick: true,
        holdDis: true,
        micDis: true,
        speakerDis: true,
        pttDis: true,
        disconnectDis: true
      }
    case "ENABLE":
      return {
        ...action,
        holdDis: false,
        micDis: false,
        speakerDis: false,
        pttDis: false,
        disconnectDis: false,
        ispttTick: false
      }
    case "DIS_HIGH":
      return {
        ...action,
        highlight: false
      }
    case "PATCH_TICK":
      return {
        ...action,
        isPatchTick: true
      }
    case "PATCH_UNTICK":
      return {
        ...action,
        isPatchTick: false
      }
    case "MERGE_TICK":
      return {
        ...action,
        isMergeTick: true
      }
    case "MERGE_UNTICK":
      return {
        ...action,
        isMergeTick: false
      }
    default:
      return {
        hold: false,
        mic: true,
        speaker: true,
        disconnectDis: false,
        holdDis: false,
        micDis: false,
        speakerDis: false,
        ispttTick: false,
      }
  }
};

export const getCallType = (type, icon = false) => {
  if (!icon) {
    switch (type) {
      case 'duplex':
        return 'DUPLEX_INDIVIDUAL_CALL'
      case 'simplexHook':
        return 'SIMPLEX_INDIVIDUAL_HOOK_CALL'
      case 'simplexDirect':
        return 'SIMPLEX_INDIVIDUAL_DIRECT_CALL'
      case 'ambient':
        return 'AMBIENT_LISTENING_CALL'
      case 'groupCall':
        return 'SIMPLEX_GROUP_CALL'
      case 'broadcast':
        return 'SIMPLEX_BROADCAST_GROUP_CALL'
      case 'emgGroupCall':
        return 'SIMPLEX_GROUP_CALL'
      default:
        return 'CALL'
    }
  }
}

export const getCallName = (type) => {
  if (type) {
    switch (type) {
      case "DUPLEX_INDIVIDUAL_CALL":
        return "Duplex";
      case "SIMPLEX_INDIVIDUAL_HOOK_CALL":
        return "Hook";
      case "SIMPLEX_INDIVIDUAL_DIRECT_CALL":
        return "Direct";
      case "AMBIENT_LISTENING_CALL":
        return "Ambience";
      case "SIMPLEX_GROUP_CALL":
        return "Group";
      case "SIMPLEX_BROADCAST_GROUP_CALL":
        return "Broadcast";
      case 'PATCH_CALL':
        return 'Patch Call'
      case 'MERGE_CALL':
        return 'Merge Call'
      default:
        return "CALL";
    }
  }
}

//VALIDATION
export const validateSDSMsg = (text) => {
  // const regex = /^[a-zA-Z0-9_ ]*$/; //Only ALphanumeric with space allowed
  // if (regex.test(text) && text.length <= 128) {
  //   return text;
  // }
  // else if (text.length <= 128) {
  //   return text.replace(/[$&+,:;=?[\]@#|{}'<>.^*()%!-/]/, "");
  // }
  // else return text.substring(0, 128);
  return text
}

//Returns Radio_ID/tetraId from Train PTID
export const getRadioId = (radios, PTID, movement, activeCab = 'DMA') => {
  try {
    const Radio = radios.filter(rd => {
      if (rd.rakeId.toString() === PTID.toString()) {
        return rd
      }
    });
    if (Radio.length) {
      let radioId = Radio[0].RadioID_A
      let inactiveRadioId = Radio[0].RadioID_B
      // if(JSON.parse(movement)) radioId = Radio[0].RadioID_B
      // else radioId = Radio[0].RadioID_A

      if (activeCab === 'DMB') {
        radioId = Radio[0].RadioID_B
        inactiveRadioId = Radio[0].RadioID_A
      }
      return { radioId, inactiveRadioId, livePaId: Radio[0].livePaId }
    }
    else return null
  }
  catch (e) {
    console.log('CRASH : getRadioId', e);
    return null
  }
}

export const getDepoRadioId = (radios, rakeId) => {
  try {
    const Radio = radios.filter(rd => {
      if (rd.rakeId.toString() === rakeId.toString()) {
        return rd
      }
    });
    if (Radio.length) {
      let radioId = Radio[0].RadioID_A
      let inactiveRadioId = Radio[0].RadioID_B
      return { radioId, inactiveRadioId, livePaId: Radio[0].livePaId }
    }
    else return null
  }
  catch (e) {
    console.log('CRASH : getRadioId', e);
    return null
  }
}

//Returns Station Radio ID/Tetra ID from list of sttaion radio's
export const getStationRadioId = (radios, code) => {
  try {
    const Radio = radios.filter(rd => {
      return rd.stnCode === code || rd.abbr === code
    })
    if (Radio && Radio.length) return Radio[0].radio_id;
    else return null;
  }
  catch (e) {
    console.log('CRASH : getStationRadioId', e)
  }
}

//Media constraints
export const getMediaConstraint = () => {
  const userSetMic = localStorage.getItem('selMic');
  const constraints = {
    audio: { deviceId: userSetMic ? { exact: userSetMic } : undefined },
    // audio:true,
    video: false
  };
  return constraints;
}

//Check trains in current location
export const presentTrainInCurrentLocs = (currentLocs, train) => {
  let data = currentLocs.filter(loc => loc == parseInt(train.currentLoc))
  if (data.length !== 0) {
    return true
  } else {
    return false
  }
}
export const getRandomString = (len, charSet) => {
  charSet = charSet || 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  var randomString = '';
  for (var i = 0; i < len; i++) {
    var randomPoz = Math.floor(Math.random() * charSet.length);
    randomString += charSet.substring(randomPoz, randomPoz + 1);
  }
  return randomString;
}

export const checkCallBelongToFav = (mcxId, contacts) => {
  let filter = contacts.filter(cont => getCallieIdToShow(cont.mcptt_id) === getCallieIdToShow(mcxId))
  return filter.length > 0 ? filter[0].fav : false
}

export const getFavGrpCallWithHighestPriority = (currentCall, grpCalls, indvlCalls, favConts, user) => {
  let favCalls = []
  grpCalls.forEach(call => {
    if (call.callId !== currentCall.callId) {
      if (checkCallBelongToFav(call.groupId, favConts)) {
        favCalls = [...favCalls, call]
      }
    }
    // if (getCallieIdToShow(call.groupId) !== getCallieIdToShow(currentCall.groupId)) {
    //   if (checkCallBelongToFav(call.groupId, favConts)) {
    //     favCalls = [...favCalls, call]
    //   }
    // }
  });
  if (favCalls.length === 0) {
    indvlCalls.forEach(call => {
      if (call.stateType && call.stateType !== "PERSISTED") {
        const userId = call.fromId === user.profile.mcptt_id ? call.toId : call.fromId
        if (checkCallBelongToFav(userId, favConts)) {
          favCalls = [...favCalls, call]
        }
      }
    });
  }
  favCalls = favCalls.sort((a, b) => (Number(a.callPriority) <= Number(b.callPriority) ? 1 : -1)) //descending order
  return favCalls.length > 0 ? favCalls : []
}

export const getFavPlusEmgCallsRunning = (currentCall, grpCalls, indvlCalls, favConts, user) => {
  let favCalls = []
  grpCalls.forEach(call => {
    if (call.callId !== currentCall.callId) {
      if (checkCallBelongToFav(call.groupId, favConts) && (call.callPriority && Number(call.callPriority) === 15)) {
        favCalls = [...favCalls, call]
      }
    }
    // if (getCallieIdToShow(call.groupId) !== getCallieIdToShow(currentCall.groupId)) {
    //   if (checkCallBelongToFav(call.groupId, favConts) && (call.callPriority && Number(call.callPriority) === 15)) {
    //     favCalls = [...favCalls, call]
    //   }
    // }
  });
  if (favCalls.length === 0) {
    indvlCalls.forEach(call => {
      if (call.stateType && call.stateType !== "PERSISTED") {
        const userId = call.fromId === user.profile.mcptt_id ? call.toId : call.fromId
        if (checkCallBelongToFav(userId, favConts) && (call.callPriority && Number(call.callPriority) === 15)) {
          favCalls = [...favCalls, call]
        }
      }
    });
  }
  return favCalls
}

export const getCallWithHighestPriority = (currentCall, grpCalls, indvlCalls) => {
  let runningCalls = []
  grpCalls.forEach(call => {
    if (call.callId !== currentCall.callId) {
      runningCalls = [...runningCalls, call]
    }
    // if (getCallieIdToShow(call.groupId) !== getCallieIdToShow(currentCall.groupId)) {
    //   runningCalls = [...runningCalls, call]
    // }
  });
  if (runningCalls.length === 0) {
    indvlCalls.forEach(call => {
      if (call.stateType && call.stateType !== "PERSISTED") {
        runningCalls = [...runningCalls, call]
      }
    });
  }
  runningCalls = runningCalls.sort((a, b) => (Number(a.callPriority) <= Number(b.callPriority) ? 1 : -1)) //descending order
  return runningCalls.length > 0 ? runningCalls : []
}

export function isSameDay(currentMessage, diffMessage) {
  if (currentMessage.createdAt.length === 0 || diffMessage.createdAt.length === 0) {
    return true;
  }
  let currentDateAndTime = currentMessage.createdAt
  if (currentMessage.createdAt.length === 0) {
    currentDateAndTime = new Date()
  }
  let prevDateAndTime = diffMessage.createdAt
  if (diffMessage.createdAt.length === 0) {
    prevDateAndTime = new Date()
  }
  const time1 = moment(currentDateAndTime).format('YYYY-MM-DD');
  const time2 = moment(prevDateAndTime).format('YYYY-MM-DD')
  //return time1.startOf('day').isSame(time2.startOf('day'));
  // console.log('msgg time', time1, time2)
  if (time2 > time1) {
    return false
  } else if (time1 > time2) {
    return false
  } else {
    return true
  }
}

export const getCallieIdToShow = (fromId) => {
  if (fromId && fromId.length == 0) {
    return fromId
  }
  if (fromId) {
    if (fromId.includes('@')) {
      let arr = fromId.split('@')
      if (arr.length > 0) {
        return removeDashMcptt(arr[0])
      } else {
        return removeDashMcptt(fromId)
      }
    } else {
      return removeDashMcptt(fromId)
    }
  } else {
    return fromId
  }
}
export const removeDashMcptt = (fromId) => {
  if (fromId && fromId.length == 0) {
    return ""
  }
  if (fromId.includes('-')) {
    let arr = fromId.split('-')
    if (arr.length > 0) {
      return arr[0]
    } else {
      return fromId
    }
  } else {
    return fromId
  }

}

export const checkCallToDesignatedController = (groupId, laGroups, grabbedLines) => {
  if (groupId && groupId.length > 0) {
    if (global.config.userConfig.Grab == 'all') {
      return true
    }
    let desginated = true
    for (let index = 0; index < laGroups.length; index++) {
      const laGrp = laGroups[index];
      console.log('RESPONSE allgrabbedlines check', laGrp, getCallieIdToShow(groupId), grabbedLines)
      if (grabbedLines) {
        if (laGrp.gssi === getCallieIdToShow(groupId)) {
          let foundLines = grabbedLines.filter(line => line.toLowerCase() === laGrp.line.toLowerCase())
          if (foundLines.length > 0) {
            desginated = true
          } else {
            desginated = false
          }
        }
      }
    }
    return desginated
  }
  return true
}

export const checkRunningDefaultGrpCall = (grpCalls, defaultGrpId) => {
  let found = false
  for (const element of grpCalls) {
    if (getCallieIdToShow(element.groupId) == getCallieIdToShow(defaultGrpId)) {
      found = true
      break
    }
  }
  return found
}