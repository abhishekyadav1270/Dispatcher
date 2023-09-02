import { atsMessageReceived,updateLocation } from '../modules/actions';
import { 
  textMessageReceived, 
  groupTextMessageReceived, 
  updateTextMessageState, 
  updateGroupTextMessageState,
  individualCallReceived,
  updateIndividualCallAction,
  groupCallReceived,
  updateGroupCallAction,
} from '../modules/communication'
import{fetchAllSubscribersSuccess, fetchAllGroupsSuccess } from '../modules/user'
import { 
  statusReceived, 
  groupStatusReceived 
} from '../modules/alarm'
import { 
  connectionOpened,
  connectionClosed,
  pipelineActive,
  pipelineDestroyed,
  systemStatusReceived
} from '../modules/connection'
import { host } from '../constants/endpoints'
import { sipConfig } from '../utils/sipConfig'
import Sip from '../utils/sip-lib'

const remoteAudio = document.getElementById('remoteAudio')
const localAudio = document.getElementById('localAudio');

const setupSip= (dispatch, user) => {
  if (!user){
    return
  }
  console.log("in Sip Setup");
  remoteAudio.addEventListener('error',(ev)=>{
    if(ev){
      alert(ev.error);
      console.log("ElementError", ev.error)
    }
  },false)
  let config = new sipConfig(user.profile.mcptt_id);
  console.log("config=",config);
  const ws = new Sip(
    config, 
    host,
    user.profile.mcptt_id,
    user.access_token,
    remoteAudio,
    localAudio,
    {
      // open
      OPEN: connectionOpened,

      // close
      CLOSE: connectionClosed,

      // train
      ATS_MESSAGE: atsMessageReceived,

      // location
      SDS_LOCATION_MESSAGE: updateLocation,
      
      // communication
      TEXT_MESSAGE_MESSAGE: textMessageReceived,
      GROUP_TEXT_MESSAGE_MESSAGE: groupTextMessageReceived,
      TEXT_MESSAGE_STATE_UPDATE: updateTextMessageState,
      GROUP_TEXT_MESSAGE_STATE_UPDATE: updateGroupTextMessageState,

      INDIVIDUAL_CALL_MESSAGE: individualCallReceived,
      INDIVIDUAL_CALL_ACTION_MESSAGE: updateIndividualCallAction,
      GROUP_CALL_MESSAGE: groupCallReceived,
      GROUP_CALL_ACTION_MESSAGE: updateGroupCallAction,

      // alarm
      STATUS_MESSAGE: statusReceived,
      GROUP_STATUS_MESSAGE: groupStatusReceived,
      FETCH_SUBSCRIBERS_SUCCESS: fetchAllSubscribersSuccess,
      FETCH_GROUPS_SUCCESS: fetchAllGroupsSuccess,
      // pipeline
      PIPELINE_ACTIVE_MESSAGE: pipelineActive,
      PIPELINE_DESTROY_MESSAGE: pipelineDestroyed,

      // system status
      SYSTEM_STATUS_MESSAGE: systemStatusReceived
    },
    dispatch
  )
  ws.connect()

  return ws
}

export default setupSip