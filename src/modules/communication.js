/**
 *  Reducer: 'communication'
 */
import moment from 'moment'
import axios from 'axios';
import { EndPoints } from '../MCXclient/endpoints';
import {
  MESSAGES,
  resolvePriority,
  ringtoneAudio,
  dialAudio,
  newMsgBeep,
  callConnect,
  callEnd,
  pttRelease,
  pttAcquire,
  subscriberType,
  subscriberStatus,
  tisMaster,
  initialCallState,
  completedCallState,
  onprocessCallState
} from '../constants/constants'
import { StatusUpdate } from '../models/status'
import {
  getCallActionState, getMediaConstraint, getTextCount, checkCallBelongToFav, getFavGrpCallWithHighestPriority,
  getFavPlusEmgCallsRunning, getCallWithHighestPriority, checkCallToDesignatedController
} from '../utils/lib'
import { CallAction } from '../models/callAction'
import { sipGroupCallTypes, sipIndividualCallTypes } from '../utils/sipConfig'
import store from '../store'
import {
  TEXT_MESSAGE_RECEIVED,
  GROUP_TEXT_MESSAGE_RECEIVED,
  UPDATE_TEXT_MESSAGE_STATE,
  UPDATE_GROUP_TEXT_MESSAGE_STATE,
  FETCH_TEXT_MESSAGES_SUCCESS,
  FETCH_TEXT_MESSAGES_ERROR,
  SEND_TEXT_MESSAGE,
  SEND_TEXT_MESSAGE_STATE,
  INDIVIDUAL_CALL_RECEIVED,
  GROUP_CALL_RECEIVED,
  CONFERENCE_CALL_RECEIVED,
  CALL_ON_HOLD_UNHOLD_RECEIVED,
  UPDATE_INDIVIDUAL_CALL_ACTION,
  UPDATE_GROUP_CALL_ACTION,
  FETCH_INDIVIDUAL_CALLS_SUCCESS,
  FETCH_GROUP_CALLS_SUCCESS,
  FETCH_INDIVIDUAL_CALLS_ERROR,
  FETCH_GROUP_CALLS_ERROR,
  SEND_INDIVIDUAL_CALL,
  INDIVIDUAL_CALL_COUNT,
  SEND_INDIVIDUAL_CALL_ACTION,
  SEND_GROUP_CALL,
  SEND_GROUP_CALL_ACTION,
  ADD_DISCREET_SUBSCRIBER,
  REMOVE_DISCREET_SUBSCRIBER,
  TOGGLE_SILENT,
  FETCH_ALL_CONTACTS,
  UPDATE_CONTACT_TRAIN_DATA,
  ADD_FAV_CONTACT,
  REMOVE_FAV_CONTACT,
  MCX_ADD_FAV,
  MCX_REMOVE_FAV,
  GETSUBSCRIBERDETAIL,
  UPDATE_SUBSCRIBERDETAIL,
  SENT_CALL,
  ENABLE_MPTT,
  ADD_MPTT,
  REMOVE_MPTT,
  END_MPTT,
  FETCH_SDS_TEXT,
  UPDATE_SDS_TEXT,
  LOG,
  SET_CURRENT_CALL,
  REM_CURRENT_CALL,
  SET_AS_CURRENT_CALL,
  INITIATE_PATCH_CALL,
  PATCH_CALL_SELN,
  SEND_PATCH_CALLS,
  MCX_PATCH_CALLS,
  PATCH_RESPONSE,
  INITIATE_MERGE_CALL,
  MERGE_CALL_SELN,
  SEND_MERGE_CALLS,
  MCX_MERGE_CALLS,
  MERGE_RESPONSE,
  MUTE_UNMUTE_ALL_CALL,
  SPEAKER_ONOFF_ALL_CALL,
  SEND_ACK_EMERGENCY_CALL,
  UPDATE_ACK_EMERGENCY_CALL,
  ADD_ACK_EMERGENCY_CALL,
  ADD_ACK_EMERGENCY_CALL_STATUS,
  UPDATE_ACK_EMERGENCY_CALL_STATUS,
  UPDATE_CALL_CONTACTS,
  UPDATE_DEFAULT_GROUP,
  UPDATE_USER_SDS_TEXT,
  FETCH_USER_SDS_TEXT,
  UPLOAD_SDS_FILE,
  FETCH_GROUP_ACTIVE_MEMBERS,
  UPDATE_GROUP_ACTIVE_MEMBERS,
  FETCH_USERS_GROUPS,
  UPDATE_USERS_GROUPS,
  UPDATE_TASK_CALL,
  INITIATE_DEFAULT_GROUP_CALL,
  GET_CHAT_USERLIST,
  SET_CHAT_USERLIST
} from './actions/type';

import { REFRESH_REQD } from './activityLog';
import { getCountCall, getCountSDS, getCallieIdToShow, checkRunningDefaultGrpCall } from '../utils/lib'
import { showMessage } from './alerts'
/**
 *  Reducer: 'communication'
 */
const actionForCall = [
  'ACQUIRE_PUSH_TO_TALK', 'RELEASE_PUSH_TO_TALK',
  'DISCONNECTED', 'ANSWER',
  'HOLD', 'UNHOLD',
  'MUTE_MIC', 'UNMUTE_MIC'
];
//const localAudio = navigator.mediaDevices.getUserMedia({audio:true,video:false});
// const remoteAudio = document.createElement('audio');
const remoteAudio = document.getElementById('remoteAudio')
var mediaStream = new MediaStream()

//FUNCTIONS

const speakerOnOrOffAllCall = async (data) => {
  try {
    remoteAudio.pause();
    for (let i = 0; i < mediaStream.getTracks().length; i++) {
      mediaStream.getAudioTracks()[i].enabled = !data;
    }
    remoteAudio.load();
    remoteAudio.srcObject = mediaStream;
    setTimeout(async () => {
      //await remoteAudio.play();
      let playPromise = remoteAudio.play();
      if (playPromise !== undefined) {
        playPromise.then(_ => {
          // Automatic playback started!
          // Show playing UI.
          // We can now safely pause video...
          //remoteAudio.pause();
        })
          .catch(error => {
            // Auto-play was prevented
            // Show paused UI.
          });
      }
    }, 100);
  }
  catch (e) {
    console.log('ERROR: FAILED UPDATING MEDIA', e)
  }
}

const updateMedia = async (streamId, value) => {
  try {
    remoteAudio.pause();
    for (let i = 0; i < mediaStream.getAudioTracks().length; i++) {
      if (mediaStream.getAudioTracks()[i].id === streamId) {
        mediaStream.getAudioTracks()[i].enabled = value;
      }
    }
    remoteAudio.load();
    remoteAudio.srcObject = mediaStream;
    setTimeout(async () => {
      //await remoteAudio.play();
      let playPromise = remoteAudio.play();
      if (playPromise !== undefined) {
        playPromise.then(_ => {
          console.log('updateMedia play')
        })
          .catch(error => {
            console.log('updateMedia play error', error)
          });
      }
    }, 100);
  }
  catch (e) {
    console.log('ERROR: FAILED UPDATING MEDIA', e)
  }
}

const addMedia = async (stream) => {
  try {
    remoteAudio.pause();
    stream.forEach(element => {
      mediaStream.addTrack(element);
    });
    remoteAudio.load();
    remoteAudio.srcObject = mediaStream;
    setTimeout(async () => {
      //await remoteAudio.play();
      let playPromise = remoteAudio.play();
      if (playPromise !== undefined) {
        playPromise.then(_ => {
          console.log('updateMedia play')
        })
          .catch(error => {
            console.log('updateMedia play error', error)
          });
      }
      //console.log('MEDIA: AFTER ADD', mediaStream.getAudioTracks())
      //UPDATE OUTPUT DEVICE IF MODIFIED
      const curOutput = localStorage.getItem('selDevice');
      if (remoteAudio.sinkId !== curOutput) {
        await remoteAudio.setSinkId(curOutput)
          .then(() => { console.log('REMOTE SINKID UPDATED') })
          .catch((e) => { console.log('REMOTE SINKID UPDATE FAILED', e) })
      }
    }, 100);
  }
  catch (e) {
    console.log('ERROR: FAILED ADDING MEDIA', e)
  }
}

const removeMedia = async (streamId,totalIndCall) => {
  try {
    // console.log('MEDIA: BEFORE',streamId,mediaStream.getAudioTracks())
    remoteAudio.pause();
    for (var i = 0; i < mediaStream.getTracks().length; i++) {
      if (mediaStream.getAudioTracks()[i].id === streamId) {
        // mediaStream.getAudioTracks()[i].stop();
        mediaStream.removeTrack(mediaStream.getAudioTracks()[i]);
      }
    }
   
    if (mediaStream.getTracks().length) {
      remoteAudio.load();
      remoteAudio.srcObject = mediaStream;
      setTimeout(async () => {
        //await remoteAudio.play();
        var playPromise = remoteAudio.play();
        if (playPromise !== undefined) {
          playPromise.then(_ => {
            console.log('updateMedia play')
          })
            .catch(error => {
              console.log('updateMedia play error', error)
            });
        }
      }, 100);
    } else {
      remoteAudio.srcObject = null;
      await remoteAudio.pause();
    }
    // console.log('MEDIA: AFTER',mediaStream.getAudioTracks())
  }
  catch (e) {
    console.log('ERROR: FAILED REMOVING MEDIA', e)
  }
}

const initialState = {
  textMessages: [],
  groupTextMessages: [],
  individualCalls: [],
  groupCalls: [],
  contactList: [],
  //MASTER PTT
  initMptt: false,
  mpttList: [],
  //SDS PAGINATION
  total: 0,
  currentPage: 1,
  lastPage: 1,
  //CURRENT CALL
  currentCall: [],
  currentPTTCalls: [],
  iscurrCallSet: false,
  //PATCHING
  initPatch: false,
  patchCalls: [],
  patchCallType: '',
  recentPatchLog: {},
  //MERGING
  initMerge: false,
  mergeCalls: [],
  mergeCallType: '',
  recentMergeLog: {},
  //All Call Action
  muteAllCall: false,
  speakerOffAllCall: false,
  pendingAckEmergCallls: [],
  emergencyCallStatus: [],
  defaultGroupId: '',
  currentChatMessages: {},
  activeGroupMembers: [],
  userAttachedGroups: [],
  chatUserList: [],
}
//CALLS
const audio = new Audio(ringtoneAudio)  //RING OUT
audio.loop = true
const dialtone = new Audio(dialAudio)   //RING IN
const connectBeep = new Audio(callConnect)
const endBeep = new Audio(callEnd)
const pttAcq = new Audio(pttAcquire)
const pttRel = new Audio(pttRelease)
//SDS
const msgBeep = new Audio(newMsgBeep)

let iCallRequestId = 0
let gCallRequestId = 0
let iSdsRequestId = 0
let gSdsRequestId = 0
let fetchFlag = false
let cu = ""
let userDetailsFetch = false
let patchCallsData = {};
let mergeCallsData = {};

dialtone.loop = true

export default (state = initialState, action) => {
  switch (action.type) {

    case TEXT_MESSAGE_RECEIVED:
    case GROUP_TEXT_MESSAGE_RECEIVED:
      return {
        ...state,
        textMessages: [action.data, ...state.textMessages]
      }

    case UPDATE_TEXT_MESSAGE_STATE:
    case UPDATE_GROUP_TEXT_MESSAGE_STATE:
      if (action.data.indexId) {
        // state update to an older message - for the persistentId, update the state       
        return {
          ...state,
          textMessages: state.textMessages.map(message => {
            if (message.messageId && (message.messageId.toString() === action.data.messageId.toString())) {
              return { ...message, stateType: action.data.stateType }
            } else {
              return message
            }
          })
        }
      }
      else return state

    case UPDATE_USER_SDS_TEXT:
      return {
        ...state,
        currentChatMessages: action.data
      }

    case UPDATE_SDS_TEXT:
      const sdsFetch = action.data;
      return {
        ...state,
        textMessages: sdsFetch.data,
        currentPage: sdsFetch.current_page,
        lastPage: sdsFetch.last_page,
        total: sdsFetch.total
      }

    case FETCH_TEXT_MESSAGES_SUCCESS:
      const sdsData = action.data.data;
      const sdsFlag = action.data.flag;
      if (fetchFlag) {
        iSdsRequestId = sdsFlag.id;
        gSdsRequestId = sdsFlag.grpId
        fetchFlag = false;
      }
      return {
        ...state,
        statuses: sdsData.data,
        currentPage: sdsData.current_page,
        lastPage: sdsData.last_page,
        total: sdsData.total
      }

    case FETCH_TEXT_MESSAGES_ERROR:
      return {
        ...state,
        textMessages: []
      }

    case INDIVIDUAL_CALL_RECEIVED:
      return {
        ...state,
        individualCalls: [action.data, ...state.individualCalls]
      }

    case CONFERENCE_CALL_RECEIVED:
      const CONFCallData = action.data;
      console.log('CONFERENCE_CALL_RECEIVED state ', CONFCallData)
      return {
        ...state,
        individualCalls: state.individualCalls.map(call => {
          let callId = CONFCallData.callId ? CONFCallData.callId.toString() : null;
          if (call.callId.toString() == callId) {
            console.log('CONFERENCE_CALL_RECEIVED INSIDE', call, CONFCallData)
            return { ...call, isConfCall: true }
          }
          return call
        }).filter(call => call)
      }

    case CALL_ON_HOLD_UNHOLD_RECEIVED:
      const holdunholdData = action.data;
      console.log('CALL_ON_HOLD_UNHOLD_RECEIVED state ', holdunholdData)
      return {
        ...state,
        individualCalls: state.individualCalls.map(call => {
          let callId = holdunholdData.callId ? holdunholdData.callId.toString() : null;
          if (call.callId.toString() == callId) {
            console.log('CALL_ON_HOLD_UNHOLD_RECEIVED INSIDE', call, holdunholdData);
            if (holdunholdData.isCallOnHold) {
              return { ...call, isCallOnHold: true }
            } else {
              return { ...call, isCallOnHold: false }
            }
          }
          return call
        }).filter(call => call)
      }
    case INDIVIDUAL_CALL_COUNT:
      console.log("action INDIVIDUAL_CALL_COUNT-->",action.data )
      if (action.data===0){
        audio.pause();
        audio.currentTime = 0;
      }
      else{
        audio.pause();
        audio.currentTime = 0;
        audio.play();
      }
      return {
        ...state
      }

    case UPDATE_INDIVIDUAL_CALL_ACTION:
      const calldata = action.data.data;
      const isCallRecd = action.data.isCallRecd;
      //call stateType checkk
      console.log('indvlcall action state', calldata)
      if (calldata.callId) {
        // state update to an older call - for the persistentId, update the state  
        if (completedCallState.includes(calldata.callActionType)) {
          const call = state.individualCalls.filter(call => (call.callId.toString() == calldata.callId.toString()))
          if (call.length) {
            removeMedia(call[0].stream)
            setTimeout(()=>{
              endBeep.play()
            },10)
          }
          console.log('individual DIS call_action', call)
          //Remove from current call if it's current call
          const currCallId = state.currentCall.length ? state.currentCall[0].callId : null;
          if (currCallId) {
            const isCurrAvl = (currCallId == calldata.callId) ? true : false;
            if (isCurrAvl) {
              console.log('individual DIS call_action isCurrAvl', isCurrAvl)
              //Check if current call is set. if set check if set is same as current call
              let newCurrent = [];
              const isZeroth = state.currentPTTCalls.length ? state.currentPTTCalls[0].callId.includes(currCallId) : false;
              if (isZeroth && state.currentPTTCalls.length > 1) newCurrent = [state.currentPTTCalls[1]];
              if (!isZeroth && state.iscurrCallSet && state.currentPTTCalls.length >= 1) newCurrent = [state.currentPTTCalls[0]];
              return {
                ...state,
                individualCalls: state.individualCalls.filter(call => !(call.callId.toString() == calldata.callId.toString())),
                currentPTTCalls: state.currentPTTCalls.filter(call => !(call.callId.toString() == calldata.callId.toString())),
                currentCall: newCurrent,
                iscurrCallSet: false
              }
            }
            else {
              return {
                ...state,
                individualCalls: state.individualCalls.filter(call => !(call.callId.toString() == calldata.callId.toString())),
                currentPTTCalls: state.currentPTTCalls.filter(call => !(call.callId.toString() == calldata.callId.toString())),
              }
            }
          }
          return {
            ...state,
            individualCalls: state.individualCalls.filter(call => !(call.callId.toString() == calldata.callId.toString())),
            currentPTTCalls: state.currentPTTCalls.filter(call => !(call.callId.toString() == calldata.callId.toString())),
          }
        }
        else {
          return {
            ...state,
            individualCalls: state.individualCalls.map(call => {
              let callId1 = calldata.callId1 ? calldata.callId1.toString() : call.callId1 ? call.callId1.toString() : null;
              let forwardedId = calldata.forwardedId ? calldata.forwardedId : call.forwardedId ? call.forwardedId : '';
              if (call.callId.toString() == calldata.callId.toString()) {
                console.log('indvlcall call_action', call, calldata)
                //AUDIO CHECK
                // if (isCallRecd && (calldata.callActionType === 'MISSED' || calldata.callActionType === 'ANSWER' || calldata.callActionType === 'DISCONNECTED' || calldata.callActionType === 'REJECTED')) {
                // console.log("audio_call_pause -->" ,state.totalIndCall);
                // if (state.totalIndCall===0){
                //   console.log("audio_call_pause-------->",calldata)
                //   audio.pause();
                //   audio.currentTime = 0;
                // }
                // else{
                //   audio.play();
                // }

                //STATE UPDATE 
                let actItm = calldata.actionItem || getCallActionState(calldata.callActionType, initialCallState)
                if (calldata.actionItem) {
                  actItm = calldata.actionItem
                } else if (call.actionItem) {
                  actItm = call.actionItem
                } else {
                  actItm = getCallActionState(calldata.callActionType, initialCallState)
                }
                //console.log('indvlcall action reducer', actItm, call, calldata)
                if (calldata.callActionType === 'DIS_HIGH') {
                  console.log('indvlcall call_action DIS_HIGH', call, actItm)
                  return { ...call, actionItem: actItm, callId1: callId1, forwardedId: forwardedId }
                }
                if (calldata.callActionType === 'ANSWER') {
                  if (calldata.remoteStream) {
                    return {
                      ...call, stateType: calldata.callActionType, actionItem: actItm, stream: calldata && calldata.stream ? calldata.stream[0].id : '', remoteStream: calldata.remoteStream,
                      isVideo: call.isVideo ? call.isVideo : 'false', callId1: callId1, forwardedId: forwardedId
                    }
                  } else {
                    return {
                      ...call, stateType: calldata.callActionType, actionItem: actItm, stream: calldata && calldata.stream ? calldata.stream[0].id : '',
                      isVideo: call.isVideo ? call.isVideo : 'false', callId1: callId1, forwardedId: forwardedId
                    }
                  }
                }
                if (calldata.callActionType === 'PUSH_TO_TALK_STATUS') {
                  return { ...call, stateType: calldata.callActionType, actionItem: actItm, talkingPartyId: calldata.talkingPartyId }
                }
                else {
                  return { ...call, stateType: calldata.callActionType ? calldata.callActionType : call.stateType, actionItem: actItm }
                }
              }
              return call
            }).filter(call => call)
          }
        }
      }
      else {
        return state
      }

    // @Sakshi - dont show any ongoing calls
    // show MISSED calls only - if recent callAction is DECLINE
    case FETCH_INDIVIDUAL_CALLS_SUCCESS:
      const indvData = action.data.data;
      const indvFlag = action.data.flag;
      if (fetchFlag) {
        iCallRequestId = indvFlag;
        fetchFlag = false;
      }
      return {
        ...state,
        individualCalls: indvData
      }

    case FETCH_INDIVIDUAL_CALLS_ERROR:
      return {
        ...state,
        individualCalls: []
      }

    case SENT_CALL:
      //console.log('grpcall SENT CALL -REDUCER', action.data)
      const sentData = action.data
      sentData.actionItem = initialCallState
      const isSentGroup = sentData.callType.includes('GROUP')
      let isManual, isGroup = false;
      if (!isSentGroup) {
        if (sentData.callType === sipIndividualCallTypes.hookCall || sentData.callType === sipIndividualCallTypes.duplex) {
          isManual = true
        }
        if (sentData.callType === sipIndividualCallTypes.directCall) {
          connectBeep.play()
        }

        if (sentData.callType !== sipIndividualCallTypes.duplex) {
          sentData.actionItem = getCallActionState("PTT_GRANTED", initialCallState)
          if (sentData.callType == sipIndividualCallTypes.directCall) {
            sentData.talkingPartyId = sentData.fromId
          }
        }
      }
      else {
        isGroup = true
        sentData.actionItem = getCallActionState("PTT_GRANTED", initialCallState)
        sentData.talkingPartyId = sentData.fromId
      }

      let recdCall = {
        ...sentData,
        stateType: sentData.callId ? (isGroup ? 'PERSISTED' : 'TRYING') : 'WAITING',
        created: moment(new Date()).format('YYYY-MM-DD hh:mm:ss'),
        //session: action.data.session,
        //conf: action.data.conf
      }
      if (isSentGroup) {
        return {
          ...state,
          groupCalls: [recdCall, ...state.groupCalls]
        }
      }
      else {
        return {
          ...state,
          individualCalls: [recdCall, ...state.individualCalls]
        }
      }

    case GROUP_CALL_RECEIVED:
      //console.log('grpcall state ', action.data)
      return {
        ...state,
        groupCalls: [action.data, ...state.groupCalls]
      }

    case UPDATE_GROUP_CALL_ACTION:
      const grpUp = action.data.data;
      const isRecd = action.data.isCallRecd;
      console.log('grpcall action main state', grpUp, grpUp.actionItem)
      if (grpUp && grpUp.callId) {
        // state update to an older call - for the persistentId, update the state 
        if (completedCallState.includes(grpUp.callActionType)) {
          const calls = state.groupCalls.filter(call => call.callId.toString().includes(grpUp.callId.toString()))
          if (calls.length) {
            removeMedia(calls[0].stream)
            endBeep.play()
          }
          //console.log('##GRP DIS call_action', call[0])
          //Remove from current call if it's current call
          const currCallId = state.currentCall.length ? state.currentCall[0].callId : null;
          if (currCallId) {
            const isCurrAvl = currCallId.includes(grpUp.callId);
            if (isCurrAvl) {
              //Check if current call is set. if set check if set is same as current call
              let newCurrent = [];
              const isZeroth = state.currentPTTCalls.length ? state.currentPTTCalls[0].callId.includes(currCallId) : false;
              if (isZeroth && state.currentPTTCalls.length > 1) newCurrent = [state.currentPTTCalls[1]];
              if (!isZeroth && state.iscurrCallSet && state.currentPTTCalls.length >= 1) newCurrent = [state.currentPTTCalls[0]];
              //console.log('ZEROTH',isZeroth,state.currentPTTCalls,newCurrent)
              return {
                ...state,
                groupCalls: state.groupCalls.filter(call => !call.callId.toString().includes(grpUp.callId.toString())),
                currentPTTCalls: state.currentPTTCalls.filter(call => !call.callId.toString().includes(grpUp.callId.toString())),
                currentCall: newCurrent,
                iscurrCallSet: false
              }
            }
            else {
              return {
                ...state,
                groupCalls: state.groupCalls.filter(call => !call.callId.toString().includes(grpUp.callId.toString())),
                currentPTTCalls: state.currentPTTCalls.filter(call => !call.callId.toString().includes(grpUp.callId.toString())),
              }
            }
          }
          return {
            ...state,
            groupCalls: state.groupCalls.filter(call => !call.callId.toString().includes(grpUp.callId.toString())),
            currentPTTCalls: state.currentPTTCalls.filter(call => !call.callId && call.callId.toString().includes(grpUp.callId && grpUp.callId.toString())),
          }
        }
        else {
          return {
            ...state,
            groupCalls: state.groupCalls.map(call => {
              if (call.callId.toString().includes(grpUp.callId.toString()) || grpUp.callId.toString().includes(call.callId.toString())) {
                //STATE UPDATE 
                let actItm = grpUp.actionItem || getCallActionState(grpUp.callActionType, initialCallState)
                if (grpUp.actionItem) {
                  actItm = grpUp.actionItem
                } else if (call.actionItem) {
                  actItm = call.actionItem
                } 

                let talkingPartyId = grpUp.talkingPartyId ? grpUp.talkingPartyId : call.talkingPartyId ? call.talkingPartyId : '0'
                console.log('grpcall action main reducer', grpUp, call, talkingPartyId, actItm);
                if (grpUp.callActionType === 'DIS_HIGH') {
                  return { ...call, actionItem: actItm, talkingPartyId: talkingPartyId }
                }
                if (grpUp.callActionType === 'PUSH_TO_TALK_STATUS') {
                  actItm = call.actionItem || actItm
                  return { ...call, stateType: grpUp.callActionType, actionItem: actItm, talkingPartyId: grpUp.talkingPartyId }
                }
                if (grpUp.callActionType === 'ANSWER') {
                  if (grpUp.remoteStream) {
                    return { ...call, stateType: grpUp.callActionType, actionItem: actItm, stream: grpUp && grpUp.stream ? grpUp.stream[0].id : '', remoteStream: grpUp.remoteStream, talkingPartyId: talkingPartyId }
                  } else {
                    return { ...call, stateType: grpUp.callActionType, actionItem: actItm, stream: grpUp && grpUp.stream ? grpUp.stream[0].id : '', talkingPartyId: talkingPartyId }
                  }
                }
                else {
                  return { ...call, stateType: grpUp.callActionType, actionItem: actItm, talkingPartyId: talkingPartyId }
                }
              } else {
                return { ...call, talkingPartyId: call.talkingPartyId ? call.talkingPartyId : '0' }
              }
            }).filter(call => call)
          }
        }
      } else {
        return state
      }

    case FETCH_GROUP_CALLS_SUCCESS:
      const grpData = action.data.data;
      const grpFlag = action.data.flag;
      if (fetchFlag) {
        gCallRequestId = grpFlag;
        fetchFlag = false;
      }
      return {
        ...state,
        groupCalls: grpData
      }

    case FETCH_GROUP_CALLS_ERROR:
      return {
        ...state,
        groupCalls: []
      }

    case ENABLE_MPTT:
      if (action.data) {
        return {
          ...state,
          initMptt: action.data
        }
      }
      else {
        return {
          ...state,
          initMptt: action.data,
          mpttList: []
        }
      }

    case ADD_MPTT:
      return {
        ...state,
        mpttList: [...state.mpttList, action.data]
      }

    case REMOVE_MPTT:
      const callData = state.mpttList.filter(call => call.callId === action.data.callId)
      if (callData && callData.length) {
        return {
          ...state,
          mpttList: state.mpttList.filter(call => call.callId !== action.data.callId)
        }
      }
      return state;

    case END_MPTT:
      return {
        ...state,
        mpttList: []
      }

    case FETCH_ALL_CONTACTS:
      return {
        ...state,
        contactList: action.data
      }

    case UPDATE_CONTACT_TRAIN_DATA:
      const radios = action.data.radios;
      const data = action.data.data;
      const trains = action.data.trains;
      //Check if train is not available on trains list
      const ifavail = !trains.filter(train => train.trainNumber === data.trainNumber).length;
      if (ifavail && state.contactList.length > 0) {
        try {
          //Getting PTID from RadioList
          //let PTID;
          const Radio = radios.filter(rd => {
            if (rd.rakeId === data.rakeId) {
              return rd
            }
            // if (parseInt(rd.rakeId) === parseInt(data.physicalTrainID) || parseInt(rd.PTID_B) === parseInt(data.physicalTrainID)) {
            //   return rd
            // }
          })
          //if (parseInt(Radio[0].PTID_A) === parseInt(data.physicalTrainID)) PTID = { radio: Radio[0].RadioID_A, ptid: Radio[0].PTID_A }
          //if (parseInt(Radio[0].PTID_B) === parseInt(data.physicalTrainID)) PTID = { radio: Radio[0].RadioID_B, ptid: Radio[0].PTID_B }
          const updatedContactData = state.contactList.map(cont => {
            if (cont.mcptt_id === Radio.RadioID_A || cont.mcptt_id === Radio.RadioID_B) {
              return { ...cont, Reg_status: subscriberStatus['REGISTERED'], PTID: Radio.PTID }
            } else {
              return cont
            }
          })
          return {
            ...state,
            contactList: updatedContactData
          }
        }
        catch (e) {
          console.log(e)
          return { ...state }
        }
      }
      else return { ...state }

    case ADD_FAV_CONTACT:
      return {
        ...state,
        contactList: action.data
      }

    case REMOVE_FAV_CONTACT:
      return {
        ...state,
        contactList: action.data
      }

    /* CURRENT CALL */
    case SET_AS_CURRENT_CALL:
      //console.log('SET_AS_CURRENT_CALL', action)
      return {
        ...state,
        currentCall: [action.call],
        iscurrCallSet: action.flag
      }

    case SET_CURRENT_CALL:
      return {
        ...state,
        currentCall: !state.iscurrCallSet ? [action.data] : state.currentCall,
        currentPTTCalls: [action.data, ...state.currentPTTCalls]
      }

    case REM_CURRENT_CALL:
      return {
        ...state,
        currentCall: []
      }

    case INITIATE_PATCH_CALL: {
      return {
        ...state,
        initPatch: true,
        patchCalls: [action.data],
        patchCallType: action.data.callType,
      }
    }

    case PATCH_CALL_SELN: {
      return {
        ...state,
        patchCalls: [...state.patchCalls, action.data]
      }
    }

    case PATCH_RESPONSE: {
      //console.log('MCX PATCH IN RES', action)
      if (action.success && action.data.stateType === 'WAITING_RES') {
        return {
          ...state,
          recentPatchLog: action.data
        }
      }
      if (action.success && action.data.stateType === 'SUCCESS') {
        const recentPatch = state.recentPatchLog;
        if (recentPatch && recentPatch.hasOwnProperty('callId1')) {
          return {
            ...state,
            initPatch: false,
            patchCalls: [],
            patchCallType: '',
            individualCalls: state.individualCalls.filter(call => !(call.callId.includes(recentPatch.callId1) || call.callId.includes(recentPatch.callId2))),
            recentPatchLog: {}
          }
        }
        else return { ...state }
      }
      else {
        const recentPatch = state.recentPatchLog;
        return {
          ...state,
          initPatch: false,
          patchCalls: [],
          patchCallType: '',
          recentPatchLog: {},
          individualCalls: state.individualCalls.map(call => {
            if (call.callId.includes(recentPatch.callId1) || call.callId.includes(recentPatch.callId2)) {
              const actItm = getCallActionState('PATCH_UNTICK', call.actionItem)
              return { ...call, actionItem: actItm, stateType: 'PATCH_UNTICK' }
            }
            else return call
          })
        }
      }
    }

    case INITIATE_MERGE_CALL: {
      console.log('initiateMergeCall reducer', action.data);
      return {
        ...state,
        initMerge: true,
        mergeCalls: [action.data],
        mergeCallType: action.data.callType,
      }
    }

    case MERGE_CALL_SELN: {
      return {
        ...state,
        mergeCalls: [...state.mergeCalls, action.data]
      }
    }

    case MERGE_RESPONSE: {
      console.log('MCX MERGE IN RES', action)
      if (action.success && action.data.stateType === 'WAITING_RES') {
        return {
          ...state,
          recentMergeLog: action.data
        }
      }
      if (action.success && action.data.stateType === 'SUCCESS') {
        const recentPatch = state.recentMergeLog;
        console.log('merge call statte...', recentPatch, action)
        if (recentPatch && recentPatch.hasOwnProperty('callId1')) {
          return {
            ...state,
            initMerge: false,
            mergeCalls: [],
            mergeCallType: '',
            individualCalls: state.individualCalls.filter(call => !(call.callId.includes(recentPatch.callId1) || call.callId.includes(recentPatch.callId2))),
            recentMergeLog: {}
          }
        }
        else return { ...state }
      }
      else {
        const recentPatch = state.recentMergeLog;
        return {
          ...state,
          initMerge: false,
          mergeCalls: [],
          mergeCallType: '',
          recentMergeLog: {},
          individualCalls: state.individualCalls.map(call => {
            if (call.callId.includes(recentPatch.callId1) || call.callId.includes(recentPatch.callId2)) {
              const actItm = getCallActionState('MERGE_UNTICK', call.actionItem)
              return { ...call, actionItem: actItm, stateType: 'MERGE_UNTICK' }
            }
            else return call
          })
        }
      }
    }

    case MUTE_UNMUTE_ALL_CALL: {
      return {
        ...state,
        muteAllCall: action.data
      }
    }

    case SPEAKER_ONOFF_ALL_CALL: {
      return {
        ...state,
        speakerOffAllCall: action.data
      }
    }

    case UPDATE_ACK_EMERGENCY_CALL: {
      return {
        ...state,
        pendingAckEmergCallls: state.pendingAckEmergCallls.filter(ackCall => ackCall.callId !== action.data.callId)
      }
    }

    case ADD_ACK_EMERGENCY_CALL: {
      return {
        ...state,
        pendingAckEmergCallls: [action.data, ...state.pendingAckEmergCallls]
      }
    }

    case ADD_ACK_EMERGENCY_CALL_STATUS: {
      return {
        ...state,
        emergencyCallStatus: [action.data, ...state.emergencyCallStatus]
      }
    }

    case UPDATE_ACK_EMERGENCY_CALL_STATUS: {
      return {
        ...state,
        emergencyCallStatus: state.emergencyCallStatus.filter(ackCall => ackCall.callId !== action.data.callId)
      }
    }

    case UPDATE_CALL_CONTACTS: {
      const mcxId = action.data.mcxId
      const isActive = action.data.isActive
      //console.log('contact call data', mcxId, isActive)
      return {
        ...state,
        contactList: state.contactList.map(cont => {
          if (getCallieIdToShow(cont.mcptt_id) == getCallieIdToShow(mcxId)) {
            return { ...cont, active: isActive }
          } else {
            return cont
          }
        })
      }
    }

    case UPDATE_DEFAULT_GROUP: {
      console.log('defaultGroupId..', action.data)
      return {
        ...state,
        defaultGroupId: action.data
      }
    }

    case UPDATE_GROUP_ACTIVE_MEMBERS: {
      return {
        ...state,
        activeGroupMembers: action.data
      }
    }

    case UPDATE_USERS_GROUPS: {
      return {
        ...state,
        userAttachedGroups: action.data
      }
    }

    case SET_CHAT_USERLIST: {
      // console.log("sds chat list--", action.data)
      let usersList = []
      if (action && action.data) {
        usersList = action.data.map((sds) => {
          return { ...sds, mcptt_id: sds.contactId, subscriber_type: sds.groupId ? "GROUP" : "INDIVIDUAL" }
        })
      }
      usersList.sort(function (a, b) {
        return new Date(b.created) - new Date(a.created);
      })
      return {
        ...state,
        chatUserList: usersList
      }
    }

    default:
      return state
  }
}

const actions = {
  textMessageReceived: (data) => ({ type: TEXT_MESSAGE_RECEIVED, data }),
  groupTextMessageReceived: (data) => ({ type: GROUP_TEXT_MESSAGE_RECEIVED, data }),
  updateTextMessageState: (data) => ({ type: UPDATE_TEXT_MESSAGE_STATE, data }),
  updateGroupTextMessageState: (data) => ({ type: UPDATE_GROUP_TEXT_MESSAGE_STATE, data }),
  fetchTextMessagesSuccess: (data) => ({ type: FETCH_TEXT_MESSAGES_SUCCESS, data }),
  fetchTextMessagesError: () => ({ type: FETCH_TEXT_MESSAGES_ERROR }),
  fetchSdsTextLog: (data) => ({ type: FETCH_SDS_TEXT, data }),
  fetchUserSdsMessage: (data) => ({ type: FETCH_USER_SDS_TEXT, data }),

  individualCallReceived: (data) => ({ type: INDIVIDUAL_CALL_RECEIVED, data }),
  updateIndividualCallAction: (data) => ({ type: UPDATE_INDIVIDUAL_CALL_ACTION, data }),
  fetchIndividualCallsSuccess: (data, currentUser) => ({ type: FETCH_INDIVIDUAL_CALLS_SUCCESS, data, currentUser }),
  fetchIndividualCallsError: () => ({ type: FETCH_INDIVIDUAL_CALLS_ERROR }),
  groupCallReceived: (data) => ({ type: GROUP_CALL_RECEIVED, data }),
  conferenceCallReceived: (data) => ({ type: CONFERENCE_CALL_RECEIVED, data }),
  callOnHoldUnHoldReceived: (data) => ({ type: CALL_ON_HOLD_UNHOLD_RECEIVED, data }),
  updateGroupCallAction: (data) => ({ type: UPDATE_GROUP_CALL_ACTION, data }),
  fetchGroupCallsSuccess: (data) => ({ type: FETCH_GROUP_CALLS_SUCCESS, data }),
  fetchGroupCallsError: () => ({ type: FETCH_GROUP_CALLS_ERROR }),

  sendTextMessage: (message) => ({ type: SEND_TEXT_MESSAGE, message }),
  sendTextMessageState: (data) => ({ type: SEND_TEXT_MESSAGE_STATE, data }),
  UploadSDSFile: (data) => ({ type: UPLOAD_SDS_FILE, data }),

  sendIndividualCall: (call) => ({ type: SEND_INDIVIDUAL_CALL, call }),
  sendIndividualCallAction: (data) => ({ type: SEND_INDIVIDUAL_CALL_ACTION, data }),
  setIndvdCallCount: (data) => ({ type: INDIVIDUAL_CALL_COUNT, data }),
  sendGroupCall: (call) => ({ type: SEND_GROUP_CALL, call }),
  sendGroupCallAction: (data) => ({ type: SEND_GROUP_CALL_ACTION, data }),

  sendAckEmergencyCall: (data) => ({ type: SEND_ACK_EMERGENCY_CALL, data }),
  addAckEmergencyCall: (data) => ({ type: ADD_ACK_EMERGENCY_CALL, data }),
  addAckEmergencyCallStatus: (data) => ({ type: ADD_ACK_EMERGENCY_CALL_STATUS, data }),
  updateAckEmergencyCallStatus: (data) => ({ type: UPDATE_ACK_EMERGENCY_CALL_STATUS, data }),

  addDiscreetSubscriber: (data) => ({ type: ADD_DISCREET_SUBSCRIBER, data }),
  removeDiscreetSubscriber: (data) => ({ type: REMOVE_DISCREET_SUBSCRIBER, data }),

  toggleSilent: () => ({ type: TOGGLE_SILENT }),

  fetchContacts: (data) => ({ type: FETCH_ALL_CONTACTS, data }),
  updateContacts: (data) => ({ type: UPDATE_CONTACT_TRAIN_DATA, data }),
  addfavContact: (data) => ({ type: ADD_FAV_CONTACT, data }),
  remfavContact: (data) => ({ type: REMOVE_FAV_CONTACT, data }),
  fetchGroupActiveMembers: (data) => ({ type: FETCH_GROUP_ACTIVE_MEMBERS, data }),
  updateGroupActiveMembers: (data) => ({ type: UPDATE_GROUP_ACTIVE_MEMBERS, data }),
  fetchUserAttachedGroups: (data) => ({ type: FETCH_USERS_GROUPS, data }),
  updateUserAttachedGroups: (data) => ({ type: UPDATE_USERS_GROUPS, data }),

  updateUserDetails: (data) => ({ type: GETSUBSCRIBERDETAIL, data }),
  updateSubDetails: (data) => ({ type: UPDATE_SUBSCRIBERDETAIL, data }),

  //MCX UPDATE API
  addfavMCX: (data) => ({ type: MCX_ADD_FAV, data }),
  remfavMCX: (data) => ({ type: MCX_REMOVE_FAV, data }),

  //Master PTT
  initMasterPTT: (data) => ({ type: ENABLE_MPTT, data }),
  addMastPTT: (data) => ({ type: ADD_MPTT, data }),
  remMastPTT: (data) => ({ type: REMOVE_MPTT, data }),
  endMasterPTT: (data) => ({ type: END_MPTT, data }),
  //REFRESH
  setRefresh: (data) => ({ type: REFRESH_REQD, data }),
  //LOG
  sendLog: (msg, data) => ({ type: LOG, msg, data }),
  //CURRENT CALL
  setCurrentCall: (data) => ({ type: SET_CURRENT_CALL, data }),
  remCurrentCall: () => ({ type: REM_CURRENT_CALL }),
  setAsCurrentCall: (call, flag) => ({ type: SET_AS_CURRENT_CALL, call, flag }),

  //PATCH
  initiatePatchCall: (data) => ({ type: INITIATE_PATCH_CALL, data }),
  addCallToPatch: (data) => ({ type: PATCH_CALL_SELN, data }),
  sendPatchCallMCX: (data) => ({ type: MCX_PATCH_CALLS, data }),
  patchResponseRecd: (data, success) => ({ type: PATCH_RESPONSE, data, success }),

  //MERGE
  initiateMergeCall: (data) => ({ type: INITIATE_MERGE_CALL, data }),
  addCallToMerge: (data) => ({ type: MERGE_CALL_SELN, data }),
  sendMergeCallMCX: (data) => ({ type: MCX_MERGE_CALLS, data }),
  mergeResponseRecd: (data, success) => ({ type: MERGE_RESPONSE, data, success }),

  //Mute All Call
  muteOrUnmuteCalls: (data) => ({ type: MUTE_UNMUTE_ALL_CALL, data }),
  speakerOnOrOffCalls: (data) => ({ type: SPEAKER_ONOFF_ALL_CALL, data }),

  //Update call on contact list
  addRemoveContactInActiveCalls: (data) => ({ type: UPDATE_CALL_CONTACTS, data }),

  //Update default group Id
  addRemoveDefaultGroup: (data) => ({ type: UPDATE_DEFAULT_GROUP, data }),

  //Update task releated to call
  updateTaskRelatedToCall: (data) => ({ type: UPDATE_TASK_CALL, data }),

  initiateDefaultGrpCall: () => ({ type: INITIATE_DEFAULT_GROUP_CALL }),

  getChatUserList: (data) => ({ type: GET_CHAT_USERLIST, data }),

}

export const setIndvdCallCount = (data) => {
  return dispatch => {
    dispatch(actions.setIndvdCallCount(data))
  }
}

/**
 *  Action: logs data
 */
export const sendLog = (msg = '', data = null) => {
  return dispatch => {
    dispatch(actions.sendLog(msg, data))
  }
}

/**
 *  Action: fetches all the SDS as per filter
 */
export const fetchSdsTextLog = (data) => {
  return dispatch => {
    dispatch(actions.fetchSdsTextLog(data))
  }
}

export const fetchUserSdsMessage = (data) => {
  return dispatch => {
    dispatch(actions.fetchUserSdsMessage(data))
  }
}

/**
 *  Action: 'textMessageReceived'
 */
export const textMessageReceived = (data) => {
  return async (dispatch) => {
    msgBeep.play()

    // if (data.deliveryReportNeeded) {
    //   // send delivery report
    //   const message = new StatusUpdate(data, 'DELIVERED')
    //   // const params = {
    //   //   ...message,
    //   //   toId: message.fromId,
    //   //   fromId: message.toId
    //   // }
    //   dispatch(actions.sendTextMessageState(message))
    // }
  }
}

/**
 *  Action: 'groupTextMessageReceived'
 */
export const groupTextMessageReceived = (data) => {
  return async dispatch => {
    // if (data.indexId) {
    //   data.id = Number(data.indexId);
    // } else {
    //   data.id = ++gSdsRequestId;
    // }
    //  //Modify data for storage
    //  let recdGrpSDS = {
    //   ...data,
    //   stateType: data.id ? 'PERSISTED' : 'WAITING', 
    //   created: moment(new Date()).format('YYYY-MM-DD hh:mm:ss')
    // };
    // delete recdGrpSDS['indexId'];
    msgBeep.play()
    // dispatch(actions.groupTextMessageReceived(recdGrpSDS))
  }
}

const logSentMessage = (data, dispatch) => {
  if (data.indexId) {
    data.id = Number(data.indexId);
  } else {
    data.id = ++iSdsRequestId;
  }
  // newMsgBeep.play()
  //Modify data for storage
  let recdSDS = {
    ...data,
    stateType: data.id ? 'PERSISTED' : 'WAITING',
    created: moment(new Date()).format('YYYY-MM-DD hh:mm:ss')
  };
  delete recdSDS['indexId'];

  if (data.sdsType === 'TEXT_MESSAGE') {
    dispatch(actions.textMessageReceived(recdSDS));
  } else {
    dispatch(actions.groupTextMessageReceived(recdSDS));
  }
}


/**
 *  Action: 'updateTextMessageState'
 */
export const updateTextMessageState = (data) => {
  return dispatch => {
    dispatch(actions.updateTextMessageState(data))
  }
}

/**
 *  Action: 'updateGroupTextMessageState'
 */
export const updateGroupTextMessageState = (data) => {
  return dispatch => {
    dispatch(actions.updateGroupTextMessageState(data))
  }
}

/**
 *  Action: 'fetchTextMessages'
 */
export const fetchTextMessages = ({ sds, userId }) => {
  return dispatch => {
    if (sds && sds.data.length) {
      fetchFlag = true;
      const count = getTextCount(sds.data, userId);
      dispatch(actions.fetchTextMessagesSuccess({ data: sds, flag: count }))
    }
    else dispatch(actions.fetchTextMessagesError())
  }
}

/**
 *  Action: 'sendTextMessage'
 */
export const sendTextMessage = (user, message) => {
  if (message.type === 'getSubscribers' || message.type === 'getGroups') {
    return dispatch => {
      dispatch(actions.sendTextMessage(message));
    }
  } else {
    return (dispatch, getState) => {
      const mcxState = getState().connection.mcx
      if (mcxState.primary || mcxState.secondary) {
        const data = {
          ...message,
          fromId: message.fromId ? message.fromId : user.profile.mcptt_id,
          indexId: message.sdsType === 'TEXT_MESSAGE' ? ++iSdsRequestId : ++gSdsRequestId
        }
        // logSentMessage(data,dispatch);
        dispatch(actions.sendTextMessage(data))
        dispatch(actions.sendLog('SENT SDS TEXT', data))
        setTimeout(() => {
          dispatch(actions.setRefresh({ opt: 'sds', val: true }))
        }, 500);
      }
      else dispatch(showMessage({ header: 'Connection', content: 'MCX disconnected!', type: 'notif' }))
    }
  }
}

export const UploadSDSFile = (data) => {
  return dispatch => {
    dispatch(actions.UploadSDSFile(data));
  }
}

/**
 *  Action: 'sendTextMessageState'
 */
export const sendTextMessageState = (message) => {
  return dispatch => {
    dispatch(actions.sendTextMessageState(message))
    setTimeout(() => {
      dispatch(actions.setRefresh({ opt: 'sds', val: true }))
    }, 500);
    dispatch(actions.sendLog('SENT TEXT_MESSAGE STATE', message));
  }
}

/**
 * Action: MuteAndUnmute all call
*/
export const muteOrUnmuteCalls = (data) => {
  return dispatch => {
    let actionType = "MUTE_MIC"
    if (data) {
      actionType = "MUTE_MIC"
    } else {
      actionType = "UNMUTE_MIC"
    }
    const allIndvCalls = store.getState().communication.individualCalls;
    const allGroupCalls = store.getState().communication.groupCalls;
    const dispatcher_id = store.getState().auth.user && store.getState().auth.user.profile.mcptt_id ? store.getState().auth.user.profile.mcptt_id : '';
    allIndvCalls.forEach(call => {
      if (call.actionItem && call.actionItem.hold !== true) {
        const newUpdate = new CallAction(call, actionType);
        const isRecd = (getCallieIdToShow(dispatcher_id) === getCallieIdToShow(call.toId))
        dispatch(actions.sendIndividualCallAction(newUpdate));
        newUpdate.actionItem = getCallActionState(actionType, newUpdate.actionItem)
        dispatch(actions.updateIndividualCallAction({ data: newUpdate, isCallRecd: isRecd }));
      }
    });
    allGroupCalls.forEach(call => {
      if (call.actionItem && call.actionItem.hold !== true) {
        const newUpdate = new CallAction(call, actionType);
        dispatch(actions.sendGroupCallAction(newUpdate));
        const isRecd = (getCallieIdToShow(dispatcher_id) === getCallieIdToShow(call.toId))
        newUpdate.actionItem = getCallActionState(actionType, newUpdate.actionItem)
        dispatch(actions.updateGroupCallAction({ data: newUpdate, isCallRecd: isRecd }));
      }
    });
    dispatch(actions.muteOrUnmuteCalls(data))
  }
}

export const speakerOnOrOffCalls = (data) => {
  speakerOnOrOffAllCall(data)
  return dispatch => {
    dispatch(actions.speakerOnOrOffCalls(data))

    let actionType = "MUTE_SPEAKER"
    if (data) {
      actionType = "MUTE_SPEAKER"
    } else {
      actionType = "UNMUTE_SPEAKER"
    }
    const allIndvCalls = store.getState().communication.individualCalls;
    const allGroupCalls = store.getState().communication.groupCalls;
    const dispatcher_id = store.getState().auth.user && store.getState().auth.user.profile.mcptt_id ? store.getState().auth.user.profile.mcptt_id : '';
    allIndvCalls.forEach(call => {
      if (call.actionItem && call.actionItem.hold !== true) {
        const newUpdate = new CallAction(call, actionType);
        const isRecd = (getCallieIdToShow(dispatcher_id) === getCallieIdToShow(call.toId))
        newUpdate.actionItem = getCallActionState(actionType, newUpdate.actionItem)
        dispatch(actions.updateIndividualCallAction({ data: newUpdate, isCallRecd: isRecd }));
      }
    });
    allGroupCalls.forEach(call => {
      if (call.actionItem && call.actionItem.hold !== true) {
        const newUpdate = new CallAction(call, actionType);
        const isRecd = (getCallieIdToShow(dispatcher_id) === getCallieIdToShow(call.toId))
        newUpdate.actionItem = getCallActionState(actionType, newUpdate.actionItem)
        dispatch(actions.updateGroupCallAction({ data: newUpdate, isCallRecd: isRecd }));
      }
    });
  }
}

export const initiateDefaultGrpCall = () => {
  const defaultGrpId = store.getState().communication.defaultGroupId
  const allGroupCalls = store.getState().communication.groupCalls;
  //const currentPttCalls = store.getState().communication.currentPTTCalls;
  const currentCalls = store.getState().communication.currentCall;
  const mpttList = store.getState().communication.mpttList;
  const initMptt = store.getState().communication.initMptt;
  const activeTab = store.getState().logs.activeTab;

  //console.log('KEY DOWN PRESSED calls comm...', allGroupCalls, defaultGrpId, currentCalls)
  if (currentCalls.length > 0) {
    return { groupId: null, currentCall: currentCalls, mpttList: mpttList, initMptt: initMptt, activeTab: activeTab }
  } else if (defaultGrpId.length == 0) {
    return { groupId: null, currentCall: currentCalls, mpttList: mpttList, initMptt: initMptt, activeTab: activeTab }
  }
  else {
    if (checkRunningDefaultGrpCall(allGroupCalls, defaultGrpId)) {
      return { groupId: null, currentCall: currentCalls, mpttList: mpttList, initMptt: initMptt, activeTab: activeTab }
    }
    return { groupId: defaultGrpId, currentCall: currentCalls, mpttList: mpttList, initMptt: initMptt, activeTab: activeTab }
  }
}

export const checkMcpttIdIsInRunningCalls = (mcxId) => {
  const allGroupCalls = store.getState().communication.groupCalls;
  const allIndvlCalls = store.getState().communication.individualCalls;
  let found = false;
  for (const element of allGroupCalls) {
    if (getCallieIdToShow(element.groupId) == getCallieIdToShow(mcxId)) {
      found = true
      break
    }
  }
  if (!found) {
    for (const element of allIndvlCalls) {
      if (getCallieIdToShow(element.fromId) == getCallieIdToShow(mcxId) || getCallieIdToShow(element.toId) == getCallieIdToShow(mcxId)) {
        found = true
        break
      }
    }
  }

  return found
}

/**
 *  Action: 'individualCallReceived'
 */
export const individualCallReceived = (data) => {
  console.log('individual call recvd.. ', data)
  let isManual = false;
  if (data.callId) {
    return async (dispatch, getState) => {
      const allIndvCalls = getState().communication.individualCalls;
      const isOngoing = allIndvCalls && allIndvCalls.filter(call => getCallieIdToShow(call.fromId) === getCallieIdToShow(data.fromId))
      //Disconnect call if it's already active
      if (isOngoing && isOngoing.length) {
        const newCallData = new CallAction(isOngoing[0], "DISCONNECTED");
        dispatch(actions.updateIndividualCallAction({ data: newCallData, isCallRecd: true }))
      }
      if (data.callType === sipIndividualCallTypes.hookCall || data.callType === sipIndividualCallTypes.duplex) {
        audio.play();
        isManual = true
      }

      let recdCall = {
        ...data,
        stateType: data.indexId ? (isManual ? 'PERSISTED' : 'INITIATED') : 'WAITING',
        created: moment(new Date()).format('YYYY-MM-DD hh:mm:ss'),
        stream: data && data.stream ? data.stream[0].id : '',
        actionItem: initialCallState
      }
      if (data && data.stream) {
        addMedia(data.stream);
      }
      // auto-answer direct call
      if (!(data.callType === sipIndividualCallTypes.hookCall || data.callType === sipIndividualCallTypes.duplex)) {
        let answerRequest = new CallAction(data, "ANSWER")
        answerRequest = {
          ...answerRequest,
          actionItem: getCallActionState("ANSWER", initialCallState)
        }
        navigator.mediaDevices.getUserMedia(getMediaConstraint()).then(localAudio => {
          //console.log('individual localAudio.......', localAudio)
          if (localAudio) answerRequest.localAudio = localAudio
          else dispatch(showMessage({ header: 'Error', content: 'Failed to get Media', type: 'error' }))
          //data.actionItem = getCallActionState("ANSWER", initialCallState)
          console.log('individual answerRequest.......', answerRequest)
          dispatch(actions.sendIndividualCallAction(answerRequest))
        }).catch(e => {
          console.log('info', `Error getting local meadia stream ${e}`);
          //remote.log("Error getting local meadia stream individual call recd: ", e)
        });
      }
      else {
        dispatch(actions.individualCallReceived(recdCall))
        if (Number(data.callPriority) === 15) {
          if (data.callType === sipIndividualCallTypes.duplex || data.callType === sipIndividualCallTypes.hookCall) {
            //add the emergency call status for miss duplex or hook emergency call 
            //console.log('individual call miss added..', data)
            dispatch(actions.addAckEmergencyCallStatus(data))
          }
        }
      }
    }
  } else {
    return dispatch => {
      dispatch(actions.individualCallReceived(data))
    }
  }
}

export const successIndvCallAction = (CallData) => {
  return dispatch => {
    if (!(CallData.callType === sipIndividualCallTypes.hookCall || CallData.callType === sipIndividualCallTypes.duplex)) {
      dispatch(actions.individualCallReceived(CallData))
      dispatch(actions.updateIndividualCallAction({ data: CallData, isCallRecd: true }))
    }
    //Set as current call
    //if (CallData.callType !== sipIndividualCallTypes.duplex) dispatch(actions.setCurrentCall(CallData))
  }
}


/**
 *  Action: 'updateIndividualCallAction'
 */
export const updateIndividualCallAction = (data, user) => {
  const isCallRecd = (getCallieIdToShow(user.profile.mcptt_id) === getCallieIdToShow(data.toId));
  let updatedActionItem = null
  if (data.callActionType === "ANSWER") {
    addMedia(data.stream);
    dialtone.pause()
    dialtone.currentTime = 0
  }
  if (data.callActionType !== 'PERSISTED') {
    audio.load()
  }
  if (data.callActionType === 'RINGING') {
    dialtone.pause()
    dialtone.currentTime = 0
    dialtone.play()
  }
  return (dispatch, getState) => {
    if (data.callActionType === "ANSWER") {

      const allGroupCalls = getState().communication.groupCalls;
      const allIndvCalls = getState().communication.individualCalls;
      const defaultGrpId = store.getState().communication.defaultGroupId
      const contacts = store.getState().communication.contactList;

      if (data.callType === sipIndividualCallTypes.directCall) {
        // if incoming call is simplex direct call
        // First check already any default group call(DGC) is running
        dispatch(manageAndUpdateCallState(data, allGroupCalls, allIndvCalls, contacts, defaultGrpId, user, false))
      } else {
        dispatch(updateCallsState(allGroupCalls, allIndvCalls, data, "HOLD", false, user))
        const mute_mic_all = store.getState().communication.muteAllCall
        if (mute_mic_all) {
          const newupdate = new CallAction(data, 'MUTE_MIC');
          dispatch(actions.sendIndividualCallAction(newupdate));
          data.actionItem = { ...data.actionItem, mic: !mute_mic_all }
        }
        const mute_speaker_all = store.getState().communication.speakerOffAllCall
        if (mute_speaker_all) {
          data.actionItem = { ...data.actionItem, speaker: !mute_speaker_all }
          if (data.stream && data.stream.length > 0) {
            updateMedia(data.stream[0].id, !mute_speaker_all)
          }
        }
        dispatch(actions.updateIndividualCallAction({ data, isCallRecd }))
        if (data.callType !== sipIndividualCallTypes.duplex) dispatch(actions.setCurrentCall(data))
      }
    } else {
      if (data.callActionType === "PUSH_TO_TALK_STATUS") {
        const allIndvlCalls = store.getState().communication.individualCalls;
        let foundPTTCall = null
        allIndvlCalls.forEach(call => {
          if ((call.callId.includes(data.callId)) || (data.callId.includes(call.callId))) {
            if (call.actionItem && call.actionItem.hold === true) {
              foundPTTCall = { ...call }
            }
          }
        });
        if (foundPTTCall !== null) {
          let callUpdate = new CallAction(foundPTTCall, "HOLD");
          const stateup = getCallActionState("HOLD", callUpdate.actionItem);
          callUpdate.actionItem = stateup;
          if (data.talkingPartyId) {
            callUpdate.talkingPartyId = data.talkingPartyId
          }
          console.log('indvl call found PTT', callUpdate, data);
          if (callUpdate.stream) {
            updateMedia(callUpdate.stream, false)
            dispatch(actions.sendIndividualCallAction(callUpdate));
            dispatch(actions.updateIndividualCallAction({ data: callUpdate, isCallRecd }));
          }
        } else {
          dispatch(actions.updateIndividualCallAction({ data, isCallRecd }))
        }
      } else {
        if (data.callActionType === "DISCONNECTED" || data.callActionType === "REJECTED") {
          dialtone.pause()
          dialtone.currentTime = 0
          const allIndvCalls = store.getState().communication.individualCalls;
          let alertTask = null
          allIndvCalls.forEach(call => {
            if (data.callId.includes(call.callId)) {
              if (call.actionItem) {
                updatedActionItem = { ...call.actionItem }
              }
              if (call.alertTask) {
                alertTask = call.alertTask
              }
            }
          });
          if (alertTask) {
            dispatch(actions.updateTaskRelatedToCall(alertTask))
          }
        }
        dispatch(actions.updateIndividualCallAction({ data, isCallRecd }))
      }
    }

    const currPatch = getState().communication.patchCalls;
    if (currPatch && currPatch.length > 0) {
      if (data.callId === (currPatch[0] && currPatch[0].callId) || data.callId === (currPatch[0] && currPatch[1].callId)) {
        data.callId1 = data.callId;
        dispatch(actions.patchResponseRecd(data, false));
      }
    }
    const currMerge = getState().communication.mergeCalls;
    if (currMerge && currMerge.length > 0) {
      if (data.callId === (currMerge[0] && currMerge[0].callId) || data.callId === (currMerge[0] && currMerge[1].callId)) {
        data.callId1 = data.callId;
        dispatch(actions.mergeResponseRecd(data, false));
      }
    }

    if (Number(data.callPriority) === 15 && !(data.callActionType === "DISCONNECTED" || data.callActionType === "REJECTED")) {
      if (data.callType === sipIndividualCallTypes.duplex || data.callType === sipIndividualCallTypes.hookCall) {
        //clear the emergency call status for miss duplex or hook emergency call 
        dispatch(actions.updateAckEmergencyCallStatus(data))
      }
    }

    if (data.callActionType === "DISCONNECTED" || data.callActionType === "REJECTED") {
      let mcxId = data.toId
      if (getCallieIdToShow(user.profile.mcptt_id) === getCallieIdToShow(data.toId)) {
        mcxId = data.fromId
      }
      const defaultGrpId = store.getState().communication.defaultGroupId
      const allGroupCalls = store.getState().communication.groupCalls;
      const allIndvCalls = store.getState().communication.individualCalls;
      const contacts = store.getState().communication.contactList;
      let foundIndvlCall = null
      if (updatedActionItem !== null) {
        foundIndvlCall = { ...data, actionItem: updatedActionItem }
      }

      if (foundIndvlCall !== null) {
        dispatch(makeActiveCallWhenDisconnected(foundIndvlCall, allGroupCalls, allIndvCalls, contacts, defaultGrpId, user))
      } else {
        dispatch(makeActiveCallWhenDisconnected(data, allGroupCalls, allIndvCalls, contacts, defaultGrpId, user))
      }

      if (Number(data.callPriority) === 15 && data.callType === sipIndividualCallTypes.directCall) {
        const emergencyCalls = getState().communication.emergencyCallStatus;
        const filteredCalls = emergencyCalls.filter(call => call.callId.toString().includes(data.callId.toString()))
        //console.log('individual call filtered', filteredCalls, emergencyCalls)
        if (filteredCalls.length === 0) { // call is disconnected by other user
          if (getCallieIdToShow(data.fromId) === getCallieIdToShow(user.profile.mcptt_id)) {
            // outgoing emergency call
            dispatch(actions.sendAckEmergencyCall(data))
          } else {
            dispatch(actions.addAckEmergencyCall(data))
          }
        } else {
          let filterCall = filteredCalls[0]
          dispatch(actions.updateAckEmergencyCallStatus(filterCall))
        }
      } else {
        if (Number(data.callPriority) === 15 && isCallRecd) {
          //Handle acknowledge for miss individual duplex and hook incoming emergency call
          const emergencyCalls = getState().communication.emergencyCallStatus;
          const filteredCalls = emergencyCalls.filter(call => call.callId.toString().includes(data.callId.toString()))
          //console.log('individual call miss filtered..', filteredCalls, emergencyCalls)
          if (filteredCalls.length > 0) {
            let filterCall = filteredCalls[0]
            dispatch(actions.updateAckEmergencyCallStatus(filterCall))
            dispatch(actions.addAckEmergencyCall(data))
          }
        }
      }
      setTimeout(() => {
        dispatch(actions.setRefresh({ opt: 'logs', val: true }))
      }, 500);
    }
  }
}

/**
 *  Action: 'fetchIndividualCalls'
 */
export const fetchIndividualCalls = ({ calls, userId }) => {
  return dispatch => {
    if (calls && calls.length) {
      fetchFlag = true;
      const count = getCountCall(calls, userId);
      dispatch(actions.fetchIndividualCallsSuccess({ data: calls, flag: count }))
    }
    else dispatch(actions.fetchIndividualCallsError())
  }
}

/**
 *  Action: 'sendIndividualCall'
 */
export const sendIndividualCall = (user, call) => {
  return async (dispatch, getState) => {
    const mcxState = getState().connection.mcx
    dispatch(actions.sendLog('SENT INDV CALL CHECK: MCX STATE', mcxState))
    if (mcxState.primary || mcxState.secondary) {
      let data = {
        ...call,
        callPriority: isNaN(call.callPriority) ? resolvePriority[call.callPriority] : call.callPriority,
        fromId: call.fromId ? call.fromId : user.profile.mcptt_id,
        indexId: Number(++iCallRequestId),
      }
      navigator.mediaDevices.getUserMedia(getMediaConstraint()).then(localAudio => {
        if (localAudio) data.localAudio = localAudio
        else dispatch(showMessage({ header: 'Error', content: 'Failed to get Media', type: 'error' }))
        const actvInvCall = getState().communication.individualCalls;
        const ifavl = actvInvCall.filter(c => c.toId === call.toId && !(c.stateType === "COMPLETED" || c.stateType === "DISCONNECTED")).length
        if (!ifavl) {
          dispatch(actions.sendIndividualCall(data))
          dispatch(actions.sendLog('SENT: INDIVIDUAL CALL', data))
          //Set call as current call
          //if (data.callType !== sipIndividualCallTypes.duplex) dispatch(actions.setCurrentCall(data))
        }
        else dispatch(showMessage({ header: 'Call', content: 'There is already running voice call to ' + call.toId, type: 'notif' }))
      }).catch(e => {
        console.log('info', `Error getting local meadia stream ${e}`);
        //remote.log("Error getting local meadia stream individual call: ", e)
      });
    }
    else dispatch(showMessage({ header: 'Connection', content: 'MCX disconnected!', type: 'notif' }))
  }
}

/**
 *  Action: 'sendIndividualCallAction'
 */
export const sendIndividualCallAction = (user, call) => {
  console.log('individual call send action..', call)
  let isCallRecd = (getCallieIdToShow(user.profile.mcptt_id) === getCallieIdToShow(call.toId));
  if (global.config.activatedFA && global.config.activatedFA.length > 0) {
    if (call.fromId === global.config.activatedFA) {
      isCallRecd = false
    }
  }

  const data = {
    ...call,
    actionItem: call.actionItem || initialCallState
  }
  if (data.callActionType === 'ACQUIRE_PUSH_TO_TALK') {
    pttAcq.play()
  }
  if (data.callActionType === 'RELEASE_PUSH_TO_TALK') {
    pttRel.play()
  }
  if (data.callActionType === 'MUTE_SPEAKER') {
    updateMedia(data.stream, false)
  }
  if (data.callActionType === 'HOLD') {
    updateMedia(data.stream, false)
  }
  if (data.callActionType === 'UNMUTE_SPEAKER') {
    updateMedia(data.stream, true)
  }
  if (data.callActionType === 'UNHOLD') {
    updateMedia(data.stream, true)
  }
  return async dispatch => {
    if (data.callActionType === 'ANSWER') {
      data.localAudio = await navigator.mediaDevices.getUserMedia(getMediaConstraint()).catch(e => {
        console.log('info', `Error getting local meadia stream ${e}`);
      });
    }
    //if duplex incoming, put other duplex call on hold
    if (data.callType === sipIndividualCallTypes.duplex && isCallRecd && data.callActionType === "ANSWER") {
      const allIndvCalls = store.getState().communication.individualCalls;
      const ongoingDuplex = (allIndvCalls.filter(call =>
        call.callType === sipIndividualCallTypes.duplex && !(call.callId === data.callId || call.stateType === 'COMPLETED' || call.stateType === 'PERSISTED' || call.stateType === 'DISCONNECTED')
        && !(call.stateType === 'RINGING' || call.stateType === 'TRYING' || call.stateType === 'WAITING')))
        .map(dup => { return dup.callId });
       //console.log('Ongoing Duplex',ongoingDuplex)
      if (ongoingDuplex && ongoingDuplex.length) {
        allIndvCalls.forEach(call => {
          if (ongoingDuplex.includes(call.callId)) {
            //console.log('Ongoing Duplex going to hold ',ongoingDuplex, call.callId)
            const newUpdate = new CallAction(call, "HOLD");
            const isRecd = (getCallieIdToShow(user.profile.mcptt_id) === getCallieIdToShow(call.toId))
            dispatch(actions.sendIndividualCallAction(newUpdate));
            newUpdate.actionItem = getCallActionState("HOLD", newUpdate.actionItem)
            dispatch(actions.updateIndividualCallAction({ data: newUpdate, isCallRecd: isRecd }));
          }
        });
      }
    }
    if (data.callActionType === 'DISCONNECTED') {
      const allIndvCalls = store.getState().communication.individualCalls;
      let alertTask = null
      allIndvCalls.forEach(call => {
        if (data.callId.includes(call.callId)) {
          if (call.alertTask) {
            alertTask = call.alertTask
          }
        }
      });
      if (alertTask) {
        dispatch(actions.updateTaskRelatedToCall(alertTask))
      }
    }
    if (actionForCall.includes(data.callActionType)) dispatch(actions.sendIndividualCallAction(data));
    if (data.callActionType !== 'ANSWER') dispatch(actions.updateIndividualCallAction({ data, isCallRecd }));
    dispatch(actions.sendLog('SENT INDV CALL_ACTION', data));
    if (data.callActionType === 'DISCONNECTED') {
      setTimeout(() => {
        dispatch(actions.setRefresh({ opt: 'logs', val: true }))
      }, 500);
    }
  }
}

/**
 *  Action: 'groupCallReceived'
 */
export const groupCallReceived = (data) => {
  return async (dispatch, getState) => {
    const laGroups = getState().train.laGroups;
    const grabbedLines = getState().train.grabbedLines;
    //console.log('RESPONSE allgrabbedlines communication..', grabbedLines);
    if (!checkCallToDesignatedController(data.groupId, laGroups, grabbedLines)) {
      return
    }
    const allgroupCalls = getState().communication.groupCalls;
    const isOngoing = allgroupCalls && allgroupCalls.filter(call => call.groupId === data.groupId)
    //Disconnect call if it's already active
    if (isOngoing && isOngoing.length) {
      //const newCallData = new CallAction(isOngoing[0], "DISCONNECTED");
      //dispatch(actions.updateGroupCallAction({ data: newCallData, isCallRecd: true }))
    }
    //ADD MEDIA
    if (data && data.stream) {
      addMedia(data.stream);
    }
    data.callActionType = "ANSWER"
    navigator.mediaDevices.getUserMedia(getMediaConstraint()).then(localAudio => {
      if (localAudio) data.localAudio = localAudio
      else dispatch(showMessage({ header: 'Error', content: 'Failed to get Media', type: 'error' }))
      data.actionItem = getCallActionState("ANSWER", initialCallState)
      dispatch(actions.sendGroupCallAction(data));
    }).catch(e => {
      console.log('info', `Error getting local meadia stream ${e}`);
      //remote.log("Error getting local meadia stream group call recd: ", e)
    });
  }
}


export const successGroupCallAction = (CallData) => {
  return dispatch => {
    dispatch(actions.groupCallReceived(CallData));
    //dispatch(actions.setCurrentCall(CallData))
  }
}

/* CONFERENCE CALL */
export const conferenceCallReceived = (data) => {
  return async (dispatch, getState) => {
    console.log('conference call recieved...', data);
    dispatch(actions.conferenceCallReceived(data));
  }
}

/* HOLD/UNHOLD CALL */
export const callOnHoldUnHoldReceived = (data) => {
  return async (dispatch, getState) => {
    console.log('callOnHoldUnHoldReceived call recieved...', data);
    dispatch(actions.callOnHoldUnHoldReceived(data));
  }
}

/**
 *  Action: 'updateGroupCallAction'
 */
export const updateGroupCallAction = (data, user) => {
  const laGroups = store.getState().train.laGroups;
  const grabbedLines = store.getState().train.grabbedLines;
  console.log('grpcall action main updateGroupCallAction..', data, laGroups, grabbedLines)
  if (!checkCallToDesignatedController(data.groupId, laGroups, grabbedLines) && Number(data.callPriority) === 15) {
    console.log('grpcall action main ignore..', data, laGroups, grabbedLines)
    return { type: null };
  }
  const isCallRecd = (getCallieIdToShow(user.profile.mcptt_id) === getCallieIdToShow(data.toId));
  if (data.callActionType === "ANSWER") {
    addMedia(data.stream);
  }
  let updatedActionItem = null
  //console.log('grpcall found Action..', data)
  return dispatch => {
    if (data.callActionType === "ANSWER") {
      const defaultGrpId = store.getState().communication.defaultGroupId
      const allGroupCalls = store.getState().communication.groupCalls;
      const allIndvCalls = store.getState().communication.individualCalls;
      const contacts = store.getState().communication.contactList;
      console.log('update group call action answer..', defaultGrpId, data)
      if (getCallieIdToShow(data.groupId) !== getCallieIdToShow(defaultGrpId)) { // this call is not default group call
        dispatch(manageAndUpdateCallState(data, allGroupCalls, allIndvCalls, contacts, defaultGrpId, user, true))
      } else {
        //if this call is default group call then mute all rest of calls
        //console.log('defaultGroupId else..', defaultGrpId, data.groupId, getCallieIdToShow(defaultGrpId), getCallieIdToShow(data.groupId));
        dispatch(updateCallsState(allGroupCalls, allIndvCalls, data, "HOLD", false, user))
        const mute_speaker_all = store.getState().communication.speakerOffAllCall
        if (mute_speaker_all) {
          data.actionItem = { ...data.actionItem, speaker: !mute_speaker_all }
          if (data.stream && data.stream.length > 0) {
            updateMedia(data.stream[0].id, !mute_speaker_all)
          }
        }
        dispatch(actions.updateGroupCallAction({ data: data, isCallRecd }));
        dispatch(actions.setCurrentCall(data))
      }
    } else if (data.callActionType === "PUSH_TO_TALK_STATUS") {
      const allGroupCalls = store.getState().communication.groupCalls;
      let foundPTTCall = null;
      for (const call of allGroupCalls) {
        if ((call.callId.includes(data.callId)) || (data.callId.includes(call.callId))) {
          if (call.actionItem && call.actionItem.hold === true) {
            foundPTTCall = { ...call }
            break;
          }
        }
      }
      if (foundPTTCall !== null) {
        let callUpdate = new CallAction(foundPTTCall, "HOLD");
        const stateup = getCallActionState("HOLD", callUpdate.actionItem);
        callUpdate.actionItem = stateup;
        if (data.talkingPartyId) {
          callUpdate.talkingPartyId = data.talkingPartyId
        }
        console.log('grpcall found PTT calll', callUpdate, data)
        if (callUpdate.stream) {
          updateMedia(callUpdate.stream, false)
          dispatch(actions.sendGroupCallAction(callUpdate));
          dispatch(actions.updateGroupCallAction({ data: callUpdate, isCallRecd }));
        }
      } else {
        console.log('grpcall found PTT calll no', data)
        dispatch(actions.updateGroupCallAction({ data: data, isCallRecd }));
      }
    } else {
      if (data.callActionType === "DISCONNECTED" || data.callActionType === "REJECTED") {
        const allGroupCalls = store.getState().communication.groupCalls;
        console.log('grpcall action main discon all groups', allGroupCalls)
        allGroupCalls.forEach(call => {
          if (data.callId.includes(call.callId)) {
            if (call.actionItem) {
              updatedActionItem = { ...call.actionItem }
            }
          }
        });
      }
      dispatch(actions.updateGroupCallAction({ data: data, isCallRecd }));
    }
    if (data.callActionType === "DISCONNECTED" || data.callActionType === "REJECTED") {
      const defaultGrpId = store.getState().communication.defaultGroupId
      const allGroupCalls = store.getState().communication.groupCalls;
      const allIndvCalls = store.getState().communication.individualCalls;
      const contacts = store.getState().communication.contactList;
      let foundGrpCall = null
      if (updatedActionItem !== null) {
        foundGrpCall = { ...data, actionItem: updatedActionItem }
      }
      console.log('grpcall action main discont all groups', allGroupCalls, foundGrpCall)
      if (foundGrpCall !== null) {
        dispatch(makeActiveCallWhenDisconnected(foundGrpCall, allGroupCalls, allIndvCalls, contacts, defaultGrpId, user))
      } else {
        dispatch(makeActiveCallWhenDisconnected(data, allGroupCalls, allIndvCalls, contacts, defaultGrpId, user))
      }

      if (Number(data.callPriority) === 15) {
        const emergencyCalls = store.getState().communication.emergencyCallStatus;
        const filteredCalls = emergencyCalls.filter(call => call.callId.toString().includes(data.callId.toString()))
        //console.log('group call filtered', filteredCalls, emergencyCalls, data)
        if (filteredCalls.length === 0) { // call is disconnected by other user
          if (data.fromId === user.profile.mcptt_id) {
            // outgoing emergency call
            dispatch(actions.sendAckEmergencyCall(data))
          } else {
            dispatch(actions.addAckEmergencyCall(data))
          }
        } else {
          const filterCall = filteredCalls[0]
          dispatch(actions.updateAckEmergencyCallStatus(filterCall))
        }
      }
      dispatch(actions.remMastPTT(data));
      setTimeout(() => {
        dispatch(actions.setRefresh({ opt: 'logs', val: true }))
      }, 500);
    }
  }
}

/**
 *  Action: 'Manage calls with their call priority'
 */
const updateCallsState = (allGroupCalls, allIndvCalls, currentCall, state, enable, user) => {
  return dispatch => {
    for (const call of allIndvCalls) {
      if (call.callId !== currentCall.callId) {
        //console.log('call stateType checkk...',call.stateType, !onprocessCallState.includes(call.stateType), call) 
        if (call.stateType && !onprocessCallState.includes(call.stateType)) {
          if (call.stream) {
            updateMedia(call.stream, enable)
          }
          let newUpdate = new CallAction(call, state);
          //console.log('call stateType newupdate...',newupdate)
          dispatch(actions.sendIndividualCallAction(newUpdate));
          const isRecd = (getCallieIdToShow(user.profile.mcptt_id) === getCallieIdToShow(call.toId))
          newUpdate.actionItem = getCallActionState(state, newUpdate.actionItem)
          dispatch(actions.updateIndividualCallAction({ data: newUpdate, isCallRecd: isRecd }));
        }
      }
    }

    for (const call of allGroupCalls) {
      if (call.callId !== currentCall.callId) {
        if (call.stream) {
          updateMedia(call.stream, enable)
        }
        let newUpdate = new CallAction(call, state);
        console.log('grp call is going to hold..', newUpdate, state);
        dispatch(actions.sendGroupCallAction(newUpdate));
        const isRecd = (getCallieIdToShow(user.profile.mcptt_id) === getCallieIdToShow(call.toId))
        newUpdate.actionItem = getCallActionState(state, newUpdate.actionItem)
        dispatch(actions.updateGroupCallAction({ data: newUpdate, isCallRecd: isRecd }));
      }
    }
  }
}

export const updateCallState = (call, state, enable, user) => {
  return dispatch => {
    const mute_speaker_all = store.getState().communication.speakerOffAllCall
    const mute_mic_all = store.getState().communication.muteAllCall
    if (call.callType.includes("GROUP")) {
      if (call.stream) {
        updateMedia(call.stream, enable)
        const newupdate = new CallAction(call, state);
        dispatch(actions.sendGroupCallAction(newupdate));
      }
      if (mute_speaker_all) {
        call.actionItem = { ...call.actionItem, speaker: !mute_speaker_all }
        if (call.stream) {
          updateMedia(call.stream, !mute_speaker_all)
        }
      } else {
        if (state === 'UNHOLD') {
          call.actionItem = { ...call.actionItem, speaker: true }
        }
      }
      if (mute_mic_all) {
        const newupdate = new CallAction(call, 'MUTE_MIC');
        dispatch(actions.sendGroupCallAction(newupdate));
        call.actionItem = { ...call.actionItem, mic: !mute_mic_all }
      } else {
        if (state === 'UNHOLD') {
          call.actionItem = { ...call.actionItem, mic: true }
        }
      }
      let newUpdate = new CallAction(call, state);
      const isRecd = (getCallieIdToShow(user.profile.mcptt_id) === getCallieIdToShow(call.toId))
      newUpdate.actionItem = getCallActionState(state, newUpdate.actionItem)
      dispatch(actions.updateGroupCallAction({ data: newUpdate, isCallRecd: isRecd }))
    } else {
      //console.log('call stateType...',call.stateType, !onprocessCallState.includes(call.stateType)) 
      if (call.stateType && !onprocessCallState.includes(call.stateType)) {
        if (call.stream) {
          updateMedia(call.stream, enable)
          const newupdate = new CallAction(call, state);
          dispatch(actions.sendIndividualCallAction(newupdate));
        }
        if (mute_mic_all) {
          const newupdate = new CallAction(call, 'MUTE_MIC');
          dispatch(actions.sendIndividualCallAction(newupdate));
          call.actionItem = { ...call.actionItem, mic: !mute_mic_all }
        }
        if (mute_speaker_all) {
          call.actionItem = { ...call.actionItem, speaker: !mute_speaker_all }
          if (call.stream) {
            updateMedia(call.stream, !mute_speaker_all)
          }
        }
        let newUpdate = new CallAction(call, state);
        const isRecd = (getCallieIdToShow(user.profile.mcptt_id) === getCallieIdToShow(call.toId))
        newUpdate.actionItem = getCallActionState(state, newUpdate.actionItem)
        dispatch(actions.updateIndividualCallAction({ data: newUpdate, isCallRecd: isRecd }));
      }
    }
  }
}

export const manageAndUpdateCallState = (data, allGroupCalls, allIndvCalls, contacts, defaultGrpId, user, igc) => {
  const isCallRecd = (getCallieIdToShow(user.profile.mcptt_id) === getCallieIdToShow(data.toId));
  let updatedData = { ...data }
  return dispatch => {
    // check already default group call is running or not, if running, then current call should be on HOLD state
    let foundDefaultGrpCall = false
    for (const call of allGroupCalls) {
      if (getCallieIdToShow(call.groupId) === getCallieIdToShow(defaultGrpId)) {
        foundDefaultGrpCall = true
        dispatch(actions.setCurrentCall(call))
      }
    }
    //console.log('foundDefaultGrpCall...', foundDefaultGrpCall, Number(updatedData.callPriority));
    if (foundDefaultGrpCall) {
      updatedData.actionItem = getCallActionState("HOLD", updatedData.actionItem)
    } else {
      // if not found any running default group call, then check fav calls
      if (allGroupCalls.length > 0 || allIndvCalls.length > 0) {
        const icp = updatedData.callPriority ? Number(updatedData.callPriority) : 0 //incoming call priority
        let icFv = false
        if (igc) {
          icFv = checkCallBelongToFav(updatedData.groupId, contacts)
        } else {
          const userId = getCallieIdToShow(updatedData.fromId) === getCallieIdToShow(user.profile.mcptt_id) ? updatedData.toId : updatedData.fromId
          icFv = checkCallBelongToFav(userId, contacts)
        }
        if (icFv && icp === 15) {
          // if current call is both fav and emg, (this is second priority call)
          // then all other running calls should be on hold
          dispatch(updateCallsState(allGroupCalls, allIndvCalls, updatedData, "HOLD", false, user))
          dispatch(actions.setCurrentCall(updatedData))
        } else {
          // now check any other running call is fav Plus emg or not 
          const foundFavPlusEmgCalls = getFavPlusEmgCallsRunning(updatedData, allGroupCalls, allIndvCalls, contacts, user)
          if (foundFavPlusEmgCalls.length > 0) {
            // if fav plus emg call is already running then this current call should go on hold
            updatedData.actionItem = getCallActionState("HOLD", updatedData.actionItem)
          } else {
            // if no fav plus emg call is running 
            // check any fav only calls is running or not
            const favCallsOnly = getFavGrpCallWithHighestPriority(updatedData, allGroupCalls, allIndvCalls, contacts, user)
            const foundFavOnlyCalls = favCallsOnly.length > 0 ? true : false
            const rfcp = favCallsOnly.length > 0 ? favCallsOnly[0].callPriority ? Number(favCallsOnly[0].callPriority) : Number(0) : Number(0)//running fav call priority
            if (foundFavOnlyCalls) {
              if (icFv) {
                if (icp >= rfcp) {
                  // it means current call is fav plus has higher priority than running fav calls
                  // then all other running call should go on hold
                  dispatch(updateCallsState(allGroupCalls, allIndvCalls, updatedData, "HOLD", false, user))
                  dispatch(actions.setCurrentCall(updatedData))
                } else {
                  // this current call should go on hold
                  updatedData.actionItem = getCallActionState("HOLD", updatedData.actionItem)
                }
              } else {
                // if current call is not fav and found running fav calls then current call should go on hold
                updatedData.actionItem = getCallActionState("HOLD", updatedData.actionItem)
              }
            } else {
              // not found any running fav calls
              if (icFv) {
                // current call is fav and not found any running fav calls
                // then all other running call should go on hold
                dispatch(updateCallsState(allGroupCalls, allIndvCalls, updatedData, "HOLD", false, user))
                dispatch(actions.setCurrentCall(updatedData))
              } else {
                // current call is non-fav and not found any running fav calls
                const runningCalls = getCallWithHighestPriority(updatedData, allGroupCalls, allIndvCalls)
                const rcp = runningCalls.length > 0 ? runningCalls[0].callPriority ? Number(runningCalls[0].callPriority) : Number(0) : Number(0)
                //console.log('foundDefaultGrpCall else...', icp, rcp, runningCalls);
                if (icp >= rcp) {
                  // it means current call has higher priority than running all calls
                  // then all other running call should go on hold
                  console.log('same priority call is going on..', icp, rcp, updatedData, allIndvCalls, allGroupCalls);
                  dispatch(updateCallsState(allGroupCalls, allIndvCalls, updatedData, "HOLD", false, user));
                  dispatch(actions.setCurrentCall(updatedData));
                } else {
                  // this current call should go on hold
                  console.log('do not same priority call is going on..', icp, rcp, updatedData);
                  updatedData.actionItem = getCallActionState("HOLD", updatedData.actionItem)
                }
              }
            }
          }
        }
      }
    }
    if (updatedData.actionItem && updatedData.actionItem.hold !== true) {
      const mute_mic_all = store.getState().communication.muteAllCall
      const mute_speaker_all = store.getState().communication.speakerOffAllCall
      if (mute_speaker_all) {
        updatedData.actionItem = { ...updatedData.actionItem, speaker: !mute_speaker_all }
        //console.log('indvlcall updateddata after', updatedData)
        if (updatedData.stream && updatedData.stream.length > 0) {
          updateMedia(updatedData.stream[0].id, !mute_speaker_all)
        }
      }
      if (mute_mic_all) {
        const newupdate = new CallAction(updatedData, 'MUTE_MIC');
        if (igc) {
          dispatch(actions.sendGroupCallAction(newupdate));
        } else {
          dispatch(actions.sendIndividualCallAction(newupdate));
        }
        updatedData.actionItem = { ...updatedData.actionItem, mic: !mute_mic_all }
        //console.log('indvlcall updated mute_mic_all', updatedData)
      }
    }
    if (igc) {
      //console.log('grpcall updated', updatedData)
      dispatch(actions.updateGroupCallAction({ data: updatedData, isCallRecd }));
    } else {
      console.log('indvlcall updateddd', updatedData)
      dispatch(actions.updateIndividualCallAction({ data: updatedData, isCallRecd: isCallRecd }))
    }
  }
}

export const makeActiveCallWhenDisconnected = (data, allGroupCalls, allIndvCalls, contacts, defaultGrpId, user) => {
  return dispatch => {
    if (data.actionItem && data.actionItem.hold === true) {
      return
    }
    // first check any default group call is running or not
    let makeActiveCall = null
    allGroupCalls.forEach(call => {
      if (getCallieIdToShow(call.groupId) === getCallieIdToShow(defaultGrpId)) {
        makeActiveCall = { ...call }
      }
    });
    if (makeActiveCall === null) {
      // no default group call is running, now check any fav plus emg call is running
      const foundFavPlusEmgCalls = getFavPlusEmgCallsRunning(data, allGroupCalls, allIndvCalls, contacts, user)
      if (foundFavPlusEmgCalls.length > 0) {
        // if fav plus emg call is already running then this call should go on unhold 
        dispatch((updateCallState(foundFavPlusEmgCalls[0], "UNHOLD", true, user)))
        if (foundFavPlusEmgCalls[0].callType !== sipIndividualCallTypes.duplex) dispatch(actions.setCurrentCall(foundFavPlusEmgCalls[0]))
      } else {
        // if not any fav plus emg call is running then check fav calls only
        const favCallsOnly = getFavGrpCallWithHighestPriority(data, allGroupCalls, allIndvCalls, contacts, user)
        const foundFavOnlyCalls = favCallsOnly.length > 0 ? true : false
        if (foundFavOnlyCalls) {
          // found other fav calls is running
          // then this call should be on unhold and make current call
          console.log('grpcall action main discon foundFavOnlyCalls', allGroupCalls, data, favCallsOnly)
          dispatch((updateCallState(favCallsOnly[0], "UNHOLD", true, user)))
          if (favCallsOnly[0].callType !== sipIndividualCallTypes.duplex) dispatch(actions.setCurrentCall(favCallsOnly[0]))
        } else {
          // not found any fav calls is running, then get call with highest priority
          const runningCalls = getCallWithHighestPriority(data, allGroupCalls, allIndvCalls)
          if (runningCalls.length > 0) {
            let callWithHP = runningCalls[0]
            //callWithHP should be on unhold state
            dispatch((updateCallState(callWithHP, "UNHOLD", true, user)))
            if (callWithHP.callType !== sipIndividualCallTypes.duplex) dispatch(actions.setCurrentCall(callWithHP))
          } else {
            // no running call found then disconnect current call..

          }
        }
      }
    } else {
      // Make this DGC to current call and unhold this default group call
      // write a logic for unhold makeCurrentCall
      dispatch((updateCallState(makeActiveCall, "UNHOLD", true, user)))
      dispatch(actions.setCurrentCall(makeActiveCall))
    }
  }
}

/**
 *  Action: 'fetchGroupCalls'
 */
export const fetchGroupCalls = ({ groupCalls, userId }) => {
  return dispatch => {
    if (groupCalls && groupCalls.length) {
      fetchFlag = true
      const count = getCountCall(groupCalls, userId); //returns called count counter
      dispatch(actions.fetchGroupCallsSuccess({ data: groupCalls, flag: count }))
    }
    else dispatch(actions.fetchGroupCallsError())
  }
}

/**
 *  Action: 'sendGroupCall'
 */
export const sendGroupCall = (user, call) => {
  //console.log('send call grp', call)
  return async (dispatch, getState) => {
    const mcxState = getState().connection.mcx
    //console.log('==>GROUP MCX', mcxState)
    dispatch(actions.sendLog('SENT GRP CALL CHECK: MCX STATE', mcxState))
    if (mcxState.primary || mcxState.secondary) {
      let data = {
        ...call,
        callPriority: resolvePriority[call.callPriority],
        fromId: user.profile.mcptt_id,
        indexId: ++gCallRequestId,
        // localAudio: await navigator.mediaDevices.getUserMedia(getMediaConstraint()).catch(e => {
        //   console.log('info', `Error getting local meadia stream ${e}`);
        // })
      }
      // const actvGrpCall = getState().communication.groupCalls;
      // const ifavl = actvGrpCall.filter(g => g.toId === call.toId && !(g.stateType === "COMPLETED" || g.stateType === "DISCONNECTED")).length
      // if (!ifavl) {
      //   dispatch(actions.sendGroupCall(data))
      //   dispatch(actions.sendLog('SENT GRP CALL', data))
      //   //Set as current call
      //   dispatch(actions.setCurrentCall(data));
      // }
      // else dispatch(showMessage({ header: 'Call', content: 'There is already running voice call to ' + call.toId, type: 'notif' }))

      navigator.mediaDevices.getUserMedia(getMediaConstraint()).then(localAudio => {
        if (localAudio) data.localAudio = localAudio
        else dispatch(showMessage({ header: 'Error', content: 'Failed to get Media', type: 'error' }))
        const actvGrpCall = getState().communication.groupCalls;
        const ifavl = actvGrpCall.filter(g => g.toId === call.toId && !(g.stateType === "COMPLETED" || g.stateType === "DISCONNECTED")).length
        if (!ifavl) {
          dispatch(actions.sendGroupCall(data))
          dispatch(actions.sendLog('SENT GRP CALL', data))
          //Set as current call
          //dispatch(actions.setCurrentCall(data));
        }
        else dispatch(showMessage({ header: 'Call', content: 'There is already running voice call to ' + call.toId, type: 'notif' }))
      }).catch(e => {
        console.log('info', `Error getting local meadia stream ${e}`);
        //remote.log("Error getting local meadia stream send group call: ", e)
      });
    }
    else dispatch(showMessage({ header: 'Connection', content: 'MCX disconnected!', type: 'notif' }))
  }
}

/**
 *  Action: 'addDiscreetSubscriber'
 */
export const addDiscreetSubscriber = (params) => {
  return dispatch => {
    dispatch(actions.addDiscreetSubscriber(params))
  }
}

/**
 *  Action: 'removeDiscreetSubscriber'
 */
export const removeDiscreetSubscriber = (params) => {
  return dispatch => {
    dispatch(actions.removeDiscreetSubscriber(params))
  }
}

/**
 *  Action: 'sendGroupCallAction'
 */
export const sendGroupCallAction = (user, call) => {
  const isCallRecd = (user.profile.mcptt_id === call.toId);
  console.log('grpcall sendGroupCallAction', call);
  const data = {
    ...call,
    actionItem: call.actionItem || initialCallState
  }
  
  //console.log('grpcall send action', data)
  if (data.callActionType === 'MUTE_SPEAKER' || data.callActionType === 'HOLD') {
    updateMedia(data.stream, false)
  }
  if (data.callActionType === 'UNMUTE_SPEAKER' || data.callActionType === 'UNHOLD') {
    updateMedia(data.stream, true)
  }
  return dispatch => {
    if (actionForCall.includes(data.callActionType)) dispatch(actions.sendGroupCallAction(data));
    dispatch(actions.updateGroupCallAction({ data, isCallRecd }));
    dispatch(actions.sendLog('SENT GRP CALL_ACTION', data));
    if (data.callActionType === 'DISCONNECTED') {
      setTimeout(() => {
        dispatch(actions.setRefresh({ opt: 'logs', val: true }))
      }, 500);
    }
  }
}

export const sendAckEmergencyCall = (data) => {
  return dispatch => {
    dispatch(actions.sendAckEmergencyCall(data))
    setTimeout(() => {
      dispatch(actions.setRefresh({ opt: 'logs', val: true }))
    }, 500);
  }
}

export const addAckEmergencyCallStatus = (data) => {
  return dispatch => {
    dispatch(actions.addAckEmergencyCallStatus(data))
  }
}

export const updateAckEmergencyCallStatus = (data) => {
  return dispatch => {
    dispatch(actions.updateAckEmergencyCallStatus(data))
  }
}

/**
 *  Action: 'toggleSilent'
 */
export const toggleSilent = () => {
  audio.load()
  return dispatch => {
    dispatch(actions.toggleSilent())
  }
}

// Update/Add Dispatcher Detail on tetraid recd
export const updateSubDetails = (allContacts, mcxId) => {
  if (store.getState().auth.userDetail && store.getState().auth.userDetail.length === 0) {
    //const allContacts = store.getState().communication.contactList;
    const DispatcherDetails = allContacts.filter(cont =>
      cont.mcptt_id.includes(mcxId)
    );
    const updatedSubscibersList = allContacts.filter(cont =>
      !cont.mcptt_id.includes(mcxId)
    );
    //console.log('userDetail ', updatedSubscibersList.length, DispatcherDetails)
    if (!userDetailsFetch && DispatcherDetails.length) {
      localStorage.setItem('userDetails', JSON.stringify(DispatcherDetails[0]));
      userDetailsFetch = true;
    }
    return dispatch => {
      dispatch(actions.fetchContacts(updatedSubscibersList))
      dispatch(actions.updateUserDetails(DispatcherDetails))
    }
  }
  else return dispatch => console.log('No Update required')
}

export const fetchContacts = ({ favConts, contList }) => {
  let mcxContList = contList;
  let favContList = favConts;
  return async dispatch => {
    try {
      if (favContList.length) {
        const Allsubscibers = await getUpdatedContactList(mcxContList, favContList);
        dispatch(actions.fetchContacts(Allsubscibers.subscribers))
        dispatch(actions.updateUserDetails(Allsubscibers.userDetail))
      }
      else {
        const Allsubscibers = await getUpdatedContactList(mcxContList, []);
        dispatch(actions.fetchContacts(Allsubscibers.subscribers))
        dispatch(actions.updateUserDetails(Allsubscibers.userDetail))
      }
    }
    catch (error) {
      console.log('ERR', error);
      const Allsubscibers = await getUpdatedContactList(mcxContList, []);
      dispatch(actions.fetchContacts(Allsubscibers.subscribers))
      dispatch(actions.updateUserDetails(Allsubscibers.userDetail))
    }
  }
}

const getUpdatedContactList = (mcxCon, favCon) => {
  // console.log('favs contact list..', favCon)
  const groups = mcxCon.filter(cont => cont.subscriber_type === subscriberType['GROUP'])
    .map(grp => { return grp.mcptt_id });
  const groupsList = mcxCon.filter(cont => cont.subscriber_type === subscriberType['GROUP'])
  const nongroups = mcxCon.filter(cont => cont.subscriber_type !== subscriberType['GROUP']);
  //Filer and add Group data to Subscribers
  let newList = [];
  for (var i = 0; i < nongroups.length; i++) {
    let subscriber = nongroups[i];
    let subGrp = subscriber.Groups; //original Group received
    if (subGrp && subGrp.length > 0) {
      //const filteredGrp = subGrp.filter(grp => groups.includes(grp.GroupSSI)) //filtered group
      //subscriber.Groups = filteredGrp;
    }
    newList.push(subscriber);
  }

  //Filter active members and add to Group
  let newGrpList = [];
  for (var j = 0; j < groupsList.length; j++) {
    let indvGrp = groupsList[j]; //original Group data
    //const grpID = indvGrp.mcptt_id;
    let activeMembers = [];
    for (var k = 0; k < newList.length; k++) {
      // if (newList[k].Groups.length > 0) {
      //   const getactive = newList[k].Groups.filter(grp => grp.GroupSSI === grpID);
      //   if (getactive.length > 0) activeMembers = [...activeMembers, newList[k]]
      // }
    }
    indvGrp.activeMembers = activeMembers //Active members added to group
    newGrpList.push(indvGrp);
  }

  //Filetered and modified Subscribers data
  const modifiedSubscibers = [...newList, ...newGrpList];
  const dispatcher_id = store.getState().auth.user && store.getState().auth.user.profile.mcptt_id;
  const DispatcherDetails = modifiedSubscibers.filter(cont =>
    cont.mcptt_id.includes(dispatcher_id)
  );
  const FinalSubscibers = modifiedSubscibers.filter(cont => !cont.mcptt_id.includes(dispatcher_id)).filter(cont => cont.mcptt_id !== tisMaster);
  //Add favorites to subscribers data
  let updatedContactList = FinalSubscibers.map(cont => {
    const isFav = favCon.filter(contf => getCallieIdToShow(cont.mcptt_id) === getCallieIdToShow(contf.mcptt_id)
    ).length > 0 ? true : false;
    return { ...cont, fav: isFav, default: false }
  });
  //Get Unique Contactlist by tetra-id
  //console.log('userDetails reducer favCon', favCon)
  //console.log('userDetails reducer', dispatcher_id, FinalSubscibers, updatedContactList)
  //updatedContactList = updatedContactList.filter((v, i, a) => a.findIndex(t => (getCallieIdToShow(t.mcptt_id) === getCallieIdToShow(v.mcptt_id))) === i)
  return { subscribers: updatedContactList, userDetail: DispatcherDetails };
}

export const updateContacts = (data) => {
  return (dispatch, getState) => {
    const radioData = getState().train.radioData;
    dispatch(actions.updateContacts(data))
  }
}

export const fetchGroupActiveMembers = (data) => {
  return dispatch => {
    dispatch(actions.fetchGroupActiveMembers(data))
  }
}

export const updateGroupActiveMembers = (data) => {
  return dispatch => {
    dispatch(actions.updateGroupActiveMembers(data))
  }
}

export const fetchUserAttachedGroups = (data) => {
  return dispatch => {
    dispatch(actions.fetchUserAttachedGroups(data))
  }
}

export const updateUserAttachedGroups = (data) => {
  return dispatch => {
    dispatch(actions.updateUserAttachedGroups(data))
  }
}

export const addRemoveFav = (data, isAddFav) => {
  const dispatcher_id = store.getState().auth.user && store.getState().auth.user.profile.mcptt_id ? store.getState().auth.user.profile.mcptt_id : 'test-222';
  const currentContLists = store.getState().communication.contactList;
  //Update fav value
  const updatedContactList = currentContLists.map(cont => {
    if (cont.mcptt_id === data.mcptt_id) {
      return { ...cont, fav: isAddFav }
    } else {
      return cont
    }
  })
  //Add to fav list
  if (isAddFav) {
    const params = {
      mcptt_id: data.mcptt_id,
      tetra_id: data.mcptt_id,
      dispatcher_id: dispatcher_id,
      contactName: data.contactName
    }
    return async dispatch => {
      try {
        dispatch(actions.addfavMCX(params))
        dispatch(actions.addfavContact(updatedContactList))
      }
      catch (error) {
        console.log('ERR', error)
      }
    }
  }
  //delete from fav list
  else {
    const params = {
      mcptt_id: data.mcptt_id,
      tetra_id: data.mcptt_id,
      dispatcher_id: dispatcher_id,
    }
    return async dispatch => {
      try {
        dispatch(actions.remfavMCX(params))
        dispatch(actions.remfavContact(updatedContactList))
      }
      catch (error) {
        console.log('ERR', error)
      }
    }
  }
}

export const addRemoveDefaultGroup = (data, isDefault) => {
  if (isDefault) {
    return dispatch => {
      dispatch(actions.addRemoveDefaultGroup(data))
    }
  } else {
    return dispatch => {
      dispatch(actions.addRemoveDefaultGroup(''))
    }
  }
}

export const masterPTT = (data) => {
  return (dispatch) => {
    dispatch(actions.initMasterPTT(data))
  }
}

export const addMastPTT = (data) => {
  return (dispatch) => {
    dispatch(actions.addMastPTT(data))
  }
}

export const remMastPTT = (data) => {
  return (dispatch) => {
    dispatch(actions.remMastPTT(data))
  }
}

export const sendMPTT = () => {
  return (dispatch, getState) => {
    const callselList = getState().communication.mpttList;
    const activeGrpCall = getState().communication.groupCalls;
    //console.log('SEND MPTT', callselList)
    if (callselList && callselList.length > 1) {
      callselList.forEach(call => {
        // //Get latest actionState of call
        const selCall = activeGrpCall.filter(c => c.callId === call.callId)
        //console.log('MPTT CALL', selCall)
        if (selCall.length && selCall[0].actionItem && !selCall[0].actionItem['ptt']) {
          const newUpdate = new CallAction(selCall[0], "ACQUIRE_PUSH_TO_TALK");
          const isRecd = getState().auth.user.profile.mcptt_id === call.toId
          dispatch(actions.updateGroupCallAction({ data: newUpdate, isCallRecd: isRecd }));
          dispatch(actions.sendGroupCallAction(newUpdate));
        }
        // if(call.actionItem && !call.actionItem['ptt']){
        //   const newUpdate = new CallAction(call, "ACQUIRE_PUSH_TO_TALK");
        //   const isRecd = getState().auth.user.profile.mcptt_id === call.toId
        //   dispatch(actions.updateGroupCallAction({data:newUpdate,isCallRecd: isRecd}));
        //   dispatch(actions.sendGroupCallAction(newUpdate));
        // }
      });
      // dispatch(actions.initMasterPTT(false))
    }
  }
}

export const releaseMPTT = () => {
  return (dispatch, getState) => {
    const callselList = getState().communication.mpttList;
    //console.log('RELEASE MPTT', callselList)
    if (callselList && callselList.length > 1) {
      callselList.forEach(call => {
        const newUpdate = new CallAction(call, "RELEASE_PUSH_TO_TALK");
        const isRecd = getState().auth.user.profile.mcptt_id === call.toId
        dispatch(actions.updateGroupCallAction({ data: newUpdate, isCallRecd: isRecd }));
        dispatch(actions.sendGroupCallAction(newUpdate));
      });
      // dispatch(actions.endMasterPTT(true))
      // dispatch(actions.initMasterPTT(false))
    }
  }
}

//Set call as current call
export const setCallasCurrent = (call, flag) => {
  console.log('SET PRESSED NM', call, flag)
  return dispatch => {
    dispatch(actions.setAsCurrentCall(call, flag));
  }
}

//PATCH CALL
export const initiatePatchCall = (call) => {
  return (dispatch, getState) => {
    dispatch(actions.initiatePatchCall(call));
    const newUpdate = new CallAction(call, "PATCH_TICK");
    newUpdate.actionItem = getCallActionState("PATCH_TICK", call.actionItem)
    const isRecd = getState().auth.user.profile.mcptt_id === call.toId
    //console.log('INIT PATCH', call, newUpdate, isRecd)
    if (call.callType.includes('GROUP')) dispatch(actions.updateGroupCallAction({ data: newUpdate, isCallRecd: isRecd }));
    else dispatch(actions.updateIndividualCallAction({ data: newUpdate, isCallRecd: true }))
  }
}

export const addCallToPatch = (call) => {
  //console.log('ADD TO PATCH', call)
  return (dispatch, getState) => {
    dispatch(actions.addCallToPatch(call));
    const newUpdate = new CallAction(call, "PATCH_TICK");
    newUpdate.actionItem = getCallActionState("PATCH_TICK", call.actionItem)
    const isRecd = getState().auth.user.profile.mcptt_id === call.toId
    if (call.callType.includes('GROUP')) dispatch(actions.updateGroupCallAction({ data: newUpdate, isCallRecd: isRecd }));
    else dispatch(actions.updateIndividualCallAction({ data: newUpdate, isCallRecd: true }))
    dispatch(sendPatchCalls());
  }
}

export const sendPatchCalls = () => {
  return (dispatch, getState) => {
    const pCalls = getState().communication.patchCalls;
    const pCallType = getState().communication.patchCallType;
    const DispUserId = getState().auth.user.profile.mcptt_id;
    let activePatchCall = [];
    if (pCallType.includes('GROUP')) activePatchCall = getState().communication.groupCalls;
    else activePatchCall = getState().communication.individualCalls;
    console.log('SEND PATCH', pCalls)
    if (pCalls && pCalls.length === 2) {
      pCalls.forEach(pcall => {
        const avlCall = activePatchCall.filter(call => call.callId === pcall.callId)
        if (avlCall && avlCall.length > 0) {
          const newUpdate = new CallAction(avlCall[0], "PATCH_CALL");
          // newUpdate.actionItem = getCallActionState("PATCH_TICK",call.actionItem)
          const isRecd = DispUserId === pcall.toId
          if (pcall.callType.includes('GROUP')) dispatch(actions.updateGroupCallAction({ data: newUpdate, isCallRecd: isRecd }));
          else dispatch(actions.updateIndividualCallAction({ data: newUpdate, isCallRecd: true }))
        }
      })
      let fromId = pCalls[0].toId == DispUserId ? pCalls[0].fromId : pCalls[0].toId;
      let toId = pCalls[1].toId == DispUserId ? pCalls[1].fromId : pCalls[1].toId;
      const data = {
        fromId: fromId,
        toId: toId,
        callId1: pCalls[0].callId,
        callId2: pCalls[1].callId,
        communicationType: "CALL",
        callPriority: "6",
        callType: "PATCH_CALL",
        patchCallType: pCallType
      }
      const user1 = DispUserId === pCalls[0].toId ? pCalls[0].fromId : pCalls[0].toId;
      const user2 = DispUserId === pCalls[1].toId ? pCalls[1].fromId : pCalls[1].toId
      patchCallsData = {
        ...data,
        callPriority: 'MED',
        callId: pCalls[0].callId,
        toId: user1,
        groupId: user2
      };
      dispatch(actions.sendPatchCallMCX(data))
    }
  }
}

export const patchResponseRecd = (data, success) => {
  //console.log('PATCH LOG RESPONSE', data, success, patchCallsData)
  return (dispatch, getState) => {
    if (success && data.stateType === 'SUCCESS') {
      dispatch(showMessage({ header: 'Patch Call', content: 'Call patched successfully!', type: 'success' }))
      // const pCalls = getState().communication.patchCalls;
      // const pCallType = getState().communication.patchCallType;    
      // const DispUserId = getState().auth.user.profile.mcptt_id;
      return axios.post(EndPoints.getConfig().calls, patchCallsData).then(
        res => {
          console.log('PATCH LOG SUCCESS', res)
          patchCallsData = null;
          setTimeout(() => {
            dispatch(actions.setRefresh({ opt: 'logs', val: true }))
          }, 500);
        },
        err => {
          console.log('PATCH LOG FAAILED', err)
        }
      ).catch(
        err => {
          console.log('PATCH LOG FAAILED', err)
        }
      )
    }
    dispatch(actions.patchResponseRecd(data, success));
  }
}

//MERGE CALL
export const initiateMergeCall = (call) => {
  return (dispatch, getState) => {
    console.log('initiateMergeCall...', call);
    dispatch(actions.initiateMergeCall(call));
    const newUpdate = new CallAction(call, "MERGE_TICK");
    newUpdate.actionItem = getCallActionState("MERGE_TICK", call.actionItem)
    const isRecd = getState().auth.user.profile.mcptt_id === call.toId
    //console.log('INIT PATCH', call, newUpdate, isRecd)
    if (call.callType.includes('GROUP')) dispatch(actions.updateGroupCallAction({ data: newUpdate, isCallRecd: isRecd }));
    else dispatch(actions.updateIndividualCallAction({ data: newUpdate, isCallRecd: true }))
  }
}

export const addCallToMerge = (call) => {
  console.log('ADD TO Merge', call)
  return (dispatch, getState) => {
    dispatch(actions.addCallToMerge(call));
    const newUpdate = new CallAction(call, "MERGE_TICK");
    newUpdate.actionItem = getCallActionState("MERGE_TICK", call.actionItem)
    const isRecd = getState().auth.user.profile.mcptt_id === call.toId
    if (call.callType.includes('GROUP')) dispatch(actions.updateGroupCallAction({ data: newUpdate, isCallRecd: isRecd }));
    else dispatch(actions.updateIndividualCallAction({ data: newUpdate, isCallRecd: true }))
    dispatch(sendMergeCalls());
  }
}

export const sendMergeCalls = () => {
  return (dispatch, getState) => {
    const pCalls = getState().communication.mergeCalls;
    const pCallType = getState().communication.mergeCallType;
    const DispUserId = getState().auth.user.profile.mcptt_id;
    let activePatchCall = [];
    if (pCallType.includes('GROUP')) activePatchCall = getState().communication.groupCalls;
    else activePatchCall = getState().communication.individualCalls;
    console.log('SEND MERGE call', pCalls)
    if (pCalls && pCalls.length === 2) {
      pCalls.forEach(pcall => {
        const avlCall = activePatchCall.filter(call => call.callId === pcall.callId)
        if (avlCall && avlCall.length > 0) {
          const newUpdate = new CallAction(avlCall[0], "MERGE_CALL");
          // newUpdate.actionItem = getCallActionState("PATCH_TICK",call.actionItem)
          const isRecd = DispUserId === pcall.toId
          if (pcall.callType.includes('GROUP')) dispatch(actions.updateGroupCallAction({ data: newUpdate, isCallRecd: isRecd }));
          else dispatch(actions.updateIndividualCallAction({ data: newUpdate, isCallRecd: true }))
        }
      })
      let fromId = pCalls[0].toId == DispUserId ? pCalls[0].fromId : pCalls[0].toId;
      let toId = pCalls[1].toId == DispUserId ? pCalls[1].fromId : pCalls[1].toId;
      const data = {
        fromId: fromId,
        toId: toId,
        callId1: pCalls[0].callId,
        callId2: pCalls[1].callId,
        communicationType: "CALL",
        callPriority: "6",
        callType: "MERGE_CALL",
        mergeCallType: pCallType
      }
      const user1 = DispUserId === pCalls[0].toId ? pCalls[0].fromId : pCalls[0].toId;
      const user2 = DispUserId === pCalls[1].toId ? pCalls[1].fromId : pCalls[1].toId
      mergeCallsData = {
        ...data,
        callPriority: 'MED',
        callId: pCalls[0].callId,
        toId: user1,
        groupId: user2
      };
      dispatch(actions.sendMergeCallMCX(data))
    }
  }
}

export const mergeResponseRecd = (data, success) => {
  //console.log('PATCH LOG RESPONSE', data, success, mergeCallsData)
  return (dispatch, getState) => {
    if (success && data.stateType === 'SUCCESS') {
      dispatch(showMessage({ header: 'Merge Call', content: 'Call Merged successfully!', type: 'success' }))
      // const pCalls = getState().communication.patchCalls;
      // const pCallType = getState().communication.patchCallType;    
      // const DispUserId = getState().auth.user.profile.mcptt_id;
      return axios.post(EndPoints.getConfig().calls, mergeCallsData).then(
        res => {
          console.log('MERGE LOG SUCCESS', res)
          mergeCallsData = null;
          setTimeout(() => {
            dispatch(actions.setRefresh({ opt: 'logs', val: true }))
          }, 500);
        },
        err => {
          console.log('MERGE LOG FAAILED', err)
        }
      ).catch(
        err => {
          console.log('PATCH LOG FAAILED', err)
        }
      )
    }
    dispatch(actions.mergeResponseRecd(data, success));
  }
}

export const getChatUserList = (data) => {
  console.log("chat list action--", data)
  return dispatch => {
    dispatch(actions.getChatUserList(data))
  }
}