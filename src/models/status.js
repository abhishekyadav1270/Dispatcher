/**
 *  Model: 'Status'
 */

export class StatusUpdate { 
  constructor(data, stateType) {
    this.messageId = data.messageId || ''
    this.toId = data.fromId
    this.fromId = data.toId
    this.indexId =  data.id || data.indexId //isNaN(data.persistentId) ? data.persistentId :
    this.sdsType = data.sdsType
    this.stateType = stateType
    this.communicationType = "STATE_UPDATE"
  }
}