/**
 *  Model: 'Status Message'
 */

export class IndividualStatusMessage { 
  constructor(codeId, toId, isFAMessage = false) {
    // this.signalingStatusId = codeId
    // this.tetraCode = Number(message.message)
    this.tetraCode = Number(codeId)
    this.toId = toId || ""
    this.sdsType = "STATUS_MESSAGE"
    this.communicationType = "SDS"
    if (isFAMessage) {
      this.isFAMessage = isFAMessage
      if (global.config.activatedFA) {
        this.fromId = global.config.activatedFA
      }
    }
  }
}

export class GroupStatusMessage { 
  constructor(codeId, groupId) {
    // this.signalingStatusId = codeId
    // this.tetraCode = Number(message.message)
    this.tetraCode = Number(codeId)
    this.toId = groupId || ""
    this.groupId = groupId || ""
    this.sdsType = "GROUP_STATUS_MESSAGE"
    this.communicationType = "SDS"
  }
}