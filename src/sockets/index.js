import{
  atsMessageReceived,
  updateLocation
} from '../modules/actions'
import { 
  textMessageReceived, 
  groupTextMessageReceived, 
  updateTextMessageState, 
  updateGroupTextMessageState,
  individualCallReceived,
  updateIndividualCallAction,
  groupCallReceived,
  updateGroupCallAction
} from '../modules/communication'
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
import { host, wsPath, wsPort } from '../constants/endpoints'
import Socket from '../utils/socket-lib'

const videoElement = document.getElementById('video')

const setupSocket = (dispatch, user) => {
  if (!user){
    return
  }

  const ws = new Socket(
    host, 
    wsPath,
    wsPort,
    user.profile.mcptt_id,
    user.authToken,
    videoElement,
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

export default setupSocket