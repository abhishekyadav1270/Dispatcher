/**
 *  Model: 'User'
 */

export class User { 
  constructor(data, stateType) {
    this.name = ''
    this.password = ''
    this.roleId = undefined
    this.subscriberId = ''
    this.accesses = []
  }
}