/**
 *  Model: 'DiscreetListener'
 */

export class DiscreetListener { 
  constructor(discreetListeners, action, subscriberId) {
    this.communicationType = "DISCREET_LISTENERS"
    this.discreetListeners = discreetListeners || []
    this.fromId = subscriberId
    this.toId = subscriberId
    switch (action) {
      case 'add':
        this.action = 'ADD'
        break
      case 'remove':
        this.action = 'REMOVE'
        break
      default:
        this.action = action
        break
    }
  }
}