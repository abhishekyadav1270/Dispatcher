/**
 *  Model: 'Message'
 */

export class IndividualTextMessage {
  constructor(message, toId, fromId, report = { imm: false, dely: false, consd: false }, isFAMessage = false) {
    this.message = message || ""
    this.immediate = report.imm || true
    this.consumedReportNeeded = report.consd || false
    this.deliveryReportNeeded = report.dely || false
    this.toId = toId || ""
    this.fromId = fromId || ""
    this.sdsType = "TEXT_MESSAGE"
    this.communicationType = "SDS"
    if (isFAMessage) {
      this.isFAMessage = isFAMessage
      if (global.config.activatedFA) {
        this.fromId = global.config.activatedFA
      }
    }
  }
}

export class IndividualTextMessageWithId {
  constructor(message, messageId, toId, fromId, report = { imm: false, dely: false, consd: false }, msgType, view, fileId, isFAMessage = false) {
    this.message = message || ""
    this.immediate = report.imm || true
    this.consumedReportNeeded = report.consd || false
    this.deliveryReportNeeded = report.dely || false
    this.toId = toId || ""
    this.fromId = fromId || ""
    this.sdsType = "TEXT_MESSAGE"
    this.communicationType = "SDS"
    this.messageId = messageId
    this.messageType = msgType
    this.view = view
    this.fileId = fileId
    if (isFAMessage) {
      this.isFAMessage = isFAMessage
      if (global.config.activatedFA) {
        this.fromId = global.config.activatedFA
      }
    }
  }
}

export class GroupTextMessage {
  constructor(message, groupId, fromId, report = { imm: false, dely: false, consd: false }) {
    this.message = message || ""
    this.immediate = report.imm || true
    this.consumedReportNeeded = report.consd || false
    this.deliveryReportNeeded = report.dely || false
    this.groupId = groupId || ""
    this.toId = groupId || ""
    this.fromId = fromId || ""
    this.sdsType = "GROUP_TEXT_MESSAGE"
    this.communicationType = "SDS"
  }
}

export class GroupTextMessageWithId {
  constructor(message, messageId, groupId, fromId, report = { imm: false, dely: false, consd: false }, msgType, view, fileId) {
    this.message = message || ""
    this.immediate = report.imm || true
    this.consumedReportNeeded = report.consd || false
    this.deliveryReportNeeded = report.dely || false
    this.groupId = groupId || ""
    this.toId = groupId || ""
    this.fromId = fromId || ""
    this.sdsType = "GROUP_TEXT_MESSAGE"
    this.communicationType = "SDS"
    this.messageId = messageId
    this.messageType = msgType
    this.view = view
    this.fileId = fileId
  }
}