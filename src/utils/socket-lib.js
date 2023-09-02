// `Socket` class

import {KurentoSignalingLibrary} from './signaling-server-webrtc'

export default class Socket {
  
  /**
    Constructor params:
      host - host of the web socket url 
      path - path of the web socket url
      subscriberId - (part of the web socket url) subscriberId of the user in active session
      handlers - (optional) list of the handlers for web socket events {EVENT: HANDLER}
      dispatch - (optional) redux store's dispatch method that will be used to dispatch an action
  */
  constructor(
    host,
    path,
    port,
    subscriberId,
    authToken,
    videoElement,
    handlers,
    dispatch) {
    this.ws = null
    this.host = host
    this.port = port
    this.path = path
    this.subscriberId = subscriberId
    this.authToken = authToken
    this.videoElement = videoElement
    this.dispatch = dispatch
    this.kurento = null
    if(handlers){
      this.connectionOpenHandler              = handlers['OPEN']
      this.connectionErrorHandler             = handlers['ERROR']
      this.connectionCloseHandler             = handlers['CLOSE']
      this.sdsLocationMessageHandler          = handlers['SDS_LOCATION_MESSAGE']
      this.textMessageMessageHandler          = handlers['TEXT_MESSAGE_MESSAGE']
      this.groupTextMessageHandler            = handlers['GROUP_TEXT_MESSAGE_MESSAGE']
      this.textMessageStateUpdateHandler      = handlers['TEXT_MESSAGE_STATE_UPDATE']
      this.groupTextMessageStateUpdateHandler = handlers['GROUP_TEXT_MESSAGE_STATE_UPDATE']
      this.statusMessageHandler               = handlers['STATUS_MESSAGE']
      this.groupStatusMessageHandler          = handlers['GROUP_STATUS_MESSAGE']
      this.individualCallMessageHandler       = handlers['INDIVIDUAL_CALL_MESSAGE']
      this.individualCallActionMessageHandler = handlers['INDIVIDUAL_CALL_ACTION_MESSAGE']
      this.groupCallMessageHandler            = handlers['GROUP_CALL_MESSAGE']
      this.groupCallActionMessageHandler      = handlers['GROUP_CALL_ACTION_MESSAGE']
      this.pipelineActiveMessageHandler       = handlers['PIPELINE_ACTIVE_MESSAGE']
      this.pipelineDestroyMessageHandler      = handlers['PIPELINE_DESTROY_MESSAGE']
      this.atsMessageHandler                  = handlers['ATS_MESSAGE']
      this.systemStatusMessageHandler         = handlers['SYSTEM_STATUS_MESSAGE']
    }
  }

  // Create web socket connection
  connect() {

    this.ws = new WebSocket(`wss://${this.host}:${this.port}/${this.path}/${this.subscriberId}/${this.authToken}`)
    this.kurento = new KurentoSignalingLibrary(this.ws, this.subscriberId)

    // Connection opened 
    this.ws.onopen = () => {
      if (this.connectionOpenHandler) {
        this.connectionOpenHandler()
      }
      this.kurento.createWebRtcPeer(this.videoElement)
    }

    // Log errors
    this.ws.onerror = error => {
      if (this.connectionErrorHandler) {
        this.connectionErrorHandler()
      }
    }

    // Listen for messages
    this.ws.onmessage = event => {
      const message = JSON.parse(event.data)
      if (message.communicationType === 'SDS') {
        switch (message.sdsType) {
          case 'LOCATION':
            /* 
              'message' object: 
              {
                latitude: FLOAT, 
                longitude: FLOAT,
                fromId: STRING (id of the subscriber received),
                toId: STRING (current user),
                sdsType: "LOCATION",
                communicationType: "SDS", 
              }
            */
            if (this.sdsLocationMessageHandler) {
              this.dispatch ? this.dispatch(this.sdsLocationMessageHandler(message)) : this.sdsLocationMessageHandler(message)
            }
            break

          case 'TEXT_MESSAGE':
            /* 
              'message' object: 
              {
                persistentId: String, 
                message: String, 
                immediate: Boolean,
                consumedReportNeeded: Boolean,
                deliveryReportNeeded: Boolean,
                fromId: STRING (message sender),
                toId: STRING (current user),
                sdsType: "TEXT_MESSAGE",
                communicationType: "SDS",
                requestId: STRING
              }
            */
            if (this.textMessageMessageHandler) {
              this.dispatch ? this.dispatch(this.textMessageMessageHandler(message)) : this.textMessageMessageHandler(message)
            }
            break

          case 'GROUP_TEXT_MESSAGE':
            /* 
              'message' object: 
              {
                message: String, 
                immediate: Boolean,
                consumedReportNeeded: Boolean,
                deliveryReportNeeded: Boolean,
                groupId: STRING,
                fromId: STRING (message sender),
                toId: STRING (current user),
                sdsType: "TEXT_MESSAGE",
                communicationType: "SDS", 
                requestId: STRING
              }
            */
            if (this.groupTextMessageHandler) {
              this.dispatch ? this.dispatch(this.groupTextMessageHandler(message)) : this.groupTextMessageHandler(message)
            }
            break

          case 'STATUS_MESSAGE':
            /* 
              'message' object: 
              {
                signalingStatusId: Integer, 
                tetraCode: Long,
                fromId: STRING (id of the subscriber received),
                toId: STRING (current user),
                communicationType: "SDS", 
                sdsType: "STATUS_MESSAGE"
              }
            */
            console.log("INDIVIDUAL STATUS MESSAGE received", message)
            if (this.statusMessageHandler) {
              this.dispatch ? this.dispatch(this.statusMessageHandler(message)) : this.statusMessageHandler(message)
            }
            break

          case 'GROUP_STATUS_MESSAGE':
            /* 
              'message' object: 
              {
                signalingStatusId: Integer, 
                tetraCode: Long,
                groupId: String,
                fromId: STRING (id of the subscriber received),
                toId: STRING (current user),
                communicationType: "SDS", 
                sdsType: "STATUS_MESSAGE",
              }
            */
            console.log("GROUP STATUS MESSAGE received", message)
            if (this.groupStatusMessageHandler) {
              this.dispatch ? this.dispatch(this.groupStatusMessageHandler(message)) : this.groupStatusMessageHandler(message)
            }
            break

          default:
            break
        }
      } else if (message.communicationType === 'STATE_UPDATE') {
        switch (message.sdsType) {
          case 'TEXT_MESSAGE':
            /* 
              'message' object: 
              {
                stateType: STRING (PERSISTED/DELIVERED/CONSUMED), 
                persistentId: String,
                fromId: STRING,
                toId: STRING (current user),
                sdsType: "TEXT_MESSAGE",
                communicationType: "STATUS_UPDATE"
              }
            */
            console.log("INDIVIDUAL MESSAGE received", message)
            if (this.textMessageStateUpdateHandler) {
              this.dispatch ? this.dispatch(this.textMessageStateUpdateHandler(message)) : this.textMessageStateUpdateHandler(message)
            }
            break

          case 'GROUP_TEXT_MESSAGE':
            /* 
              'message' object: 
              {
                stateType: STRING (PERSISTED/DELIVERED/CONSUMED), 
                persistentId: String,
                groupId: STRING,
                fromId: STRING (sender),
                toId: STRING (current user),
                sdsType: "GROUP_TEXT_MESSAGE",
                communicationType: "STATUS_UPDATE"
              }
            */
            console.log("GROUP MESSAGE received", message)
            if (this.groupTextMessageStateUpdateHandler) {
              this.dispatch ? this.dispatch(this.groupTextMessageStateUpdateHandler(message)) : this.groupTextMessageStateUpdateHandler(message)
            }
            break

          default:
            break
        }
      } else if (message.communicationType === 'CALL') {
        switch (message.callType) {
          case 'SIMPLEX_INDIVIDUAL_HOOK_CALL':
          case 'DUPLEX_INDIVIDUAL_CALL':
          case 'SIMPLEX_INDIVIDUAL_DIRECT_CALL':
          case 'DISCREET_LISTENING_CALL':
            /* 
              'message' object: 
              {
                communicationType: "CALL", 
                messageSource: "RIS_CLIENT",
                callType: STRING,
                callPriority: INTEGER,
                fromId: STRING (current user),
                toId: STRING (to user),
                persistentId: STRING
              }
            */
            console.log("INDIVIDUAL CALL received", message)
            if (this.individualCallMessageHandler) {
              this.dispatch ? this.dispatch(this.individualCallMessageHandler(message)) : this.individualCallMessageHandler(message)
            }
            break

          case 'SIMPLEX_GROUP_CALL':
          case 'SIMPLEX_BROADCAST_GROUP_CALL':
            /* 
              'message' object: 
              {
                
              }
            */
            console.log("GROUP CALL received", message)
            if (this.groupCallMessageHandler) {
              this.dispatch ? this.dispatch(this.groupCallMessageHandler(message)) : this.groupCallMessageHandler(message)
            }
            break

          default:
            break
        }
      } else if (message.communicationType === 'CALL_ACTION') {
        switch (message.callType) {
          case 'SIMPLEX_INDIVIDUAL_HOOK_CALL':
          case 'DUPLEX_INDIVIDUAL_CALL':
          case 'SIMPLEX_INDIVIDUAL_DIRECT_CALL':
          case 'AMBIENT_LISTENING_CALL':
          case 'DISCREET_LISTENING_CALL':
          case 'MERGE_CALL':
            /* 
              'message' object: 
              {
                communicationType: "CALL_ACTION", 
                callType: STRING,
                callActionType: STRING,
                callPriority: INTEGER,
                toId: STRING (to user),
                fromId: STRING (current user),
                persistentId: STRING,
                requestId: STRING
              }
            */
            console.log("INDIVIDUAL CALL ACTION received", message)
            if (this.individualCallActionMessageHandler) {
              this.dispatch ? this.dispatch(this.individualCallActionMessageHandler(message)) : this.individualCallActionMessageHandler(message)
            }
            break

          case 'SIMPLEX_GROUP_CALL':
          case 'SIMPLEX_BROADCAST_GROUP_CALL':
            /* 
              'message' object: 
              {
              }
            */
            console.log("GROUP CALL ACTION received", message)
            if (this.groupCallActionMessageHandler) {
              this.dispatch ? this.dispatch(this.groupCallActionMessageHandler(message)) : this.groupCallActionMessageHandler(message)
            }
            break

          default:
            break
        }
      } else if (message.communicationType === 'KURENTO') {
        if (this.pipelineActiveMessageHandler) {
          this.kurento.processKurentoMessage(message, this.pipelineActiveMessageHandler.bind(this))
        } else {
          this.kurento.processKurentoMessage(message)
        }
      } else if (message.communicationType === 'PIPELINE_DESTROY') {
        this.kurento.processKurentoMessage(message)
        if (this.pipelineDestroyMessageHandler) {
          this.dispatch ? this.dispatch(this.pipelineDestroyMessageHandler()) : this.pipelineDestroyMessageHandler()
        }
      } else if (message.communicationType === 'ATS') {
        console.log("ATS received", message)
        if (this.atsMessageHandler) {
          this.dispatch ? this.dispatch(this.atsMessageHandler(message)) : this.atsMessageHandler(message)
        }
      } else if (message.communicationType === 'SYSTEM_STATUS') {
        if (this.systemStatusMessageHandler) {
          this.dispatch ? this.dispatch(this.systemStatusMessageHandler(message)) : this.systemStatusMessageHandler(message)
        }
      }
    }

    // Connection closed 
    this.ws.onclose = () => {
      if (this.connectionCloseHandler) {
        this.dispatch ? this.dispatch(this.connectionCloseHandler()) : this.connectionCloseHandler()
      }
    }
  }

  // send messages
  send (params) {
    this.ws.send(JSON.stringify(params))
  }

  // close the web socket connection
  close () {
    this.ws.close()
  }
}