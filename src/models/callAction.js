/**
 *  Model: 'CallAction'
 */

export class CallAction { 
  constructor(data, action) {
    this.toId = data.toId
    this.fromId = data.fromId
    this.callId = data.callId || data.id || data.requestId
    this.callType = data.callType
    this.communicationType = "CALL_ACTION"
    this.callPriority = data.callPriority || 1
    this.callActionType = action
    this.stream = data.stream || ''
    this.session = data.session
    this.conf = data.conf
    this.statetype = data.stateType ? data.stateType : ''
    this.isVideo = data.isVideo ? data.isVideo : false
    this.actionItem = data.actionItem || {}
    this.callId1 = data.callId1 ? data.callId1 : null
    this.forwardedId = data.forwardedId ? data.forwardedId : ''
  }
}


