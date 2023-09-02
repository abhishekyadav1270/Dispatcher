/**
 *  Model: 'Call'
 */

export class IndividualCall { 
  constructor(type, toId, priority, isFACall = false) {
    this.toId = toId || ""
    this.callPriority = priority || "MEDIUM"
    this.communicationType = "CALL"
    this.callType = type
    if (isFACall) {
      this.isFACall = isFACall
      if (global.config.activatedFA && global.config.activatedFA.length > 0) {
        this.fromId = global.config.activatedFA
      }
    }
  //   switch (type) {
  //     case 'duplex':
  //       this.callType = 'DUPLEX_INDIVIDUAL_CALL'
  //       break
  //     case 'simplexHook':
  //       this.callType = 'SIMPLEX_INDIVIDUAL_HOOK_CALL'
  //       break
  //     case 'simplexDirect':
  //       this.callType = 'SIMPLEX_INDIVIDUAL_DIRECT_CALL'
  //       break
  //     case 'ambient':
  //       this.callType = 'AMBIENT_LISTENING_CALL'
  //       break
  //     default:
  //       this.callType = type
  //       break
  //   }
  }
}

export class GroupCall { 
  constructor(type, toId, priority) {
    this.toId = toId || ""
    this.groupId = toId || ""
    this.callPriority = priority || "MEDIUM"
    this.communicationType = "CALL"
    this.callType = type
    // switch (type) {
    //   case 'simplex':
    //     this.callType = 'SIMPLEX_GROUP_CALL'
    //     break
    //   case 'broadcast':
    //     this.callType = 'SIMPLEX_BROADCAST_GROUP_CALL'
    //     break
    //   default:
    //     this.callType = type
    //     break
    // }
  }
}

export class MergeCall { 
  constructor(userId, callId1, callId2) {
    this.fromId = userId.toString()
    this.toId = userId.toString()
    this.communicationType = "CALL"
    this.callPriority = "0"
    this.callType = "MERGE_CALL"
    this.callId1 = callId1.toString()
    this.callId2 = callId2.toString()
  }
}