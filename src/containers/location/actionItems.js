/**
 *  Component: ActionItems
 */

import React from 'react'
import PropTypes from 'prop-types'
import { Image, Icon } from 'semantic-ui-react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import { addSnailTrail, fetchSnailTrails } from '../../modules/actions' 
import { cacheReload } from '../../modules/common' 
import { showMessage } from '../../modules/alerts' 
import { IndividualCall } from '../../models/call'
import { CallAction } from '../../models/callAction'
import { 
  sendTextMessage, 
  sendIndividualCall,
  sendIndividualCallAction,
  updateIndividualCallAction
} from '../../modules/communication'

const propTypes = {
  user: PropTypes.object,
  fetchSnailTrails: PropTypes.func.isRequired,
  addSnailTrail: PropTypes.func.isRequired,
  cacheReload: PropTypes.func.isRequired,
  showMessage: PropTypes.func.isRequired,
  page: PropTypes.string,
  subscriberId: PropTypes.string.isRequired,
  data: PropTypes.array
}

class ActionItems extends React.Component {

  addSnailTrail = async () => {
    const {subscriberId, addSnailTrail, cacheReload, showMessage, user} = this.props
    const resAdd = await addSnailTrail(user, subscriberId)
    showMessage(resAdd)
    if(resAdd.type === 'success'){
      cacheReload()
      const resFetch = await fetchSnailTrails(user)
      if(resFetch.type !== 'success'){
        // todo?
        showMessage(resFetch)
      }
      this.context.router.history.push('/location/snail-trail')
    }
  }

  initiateCall = (type, receiver) => {
    const {user, sendIndividualCall, showMessage} = this.props
    // todo :: priority - to ask
    sendIndividualCall(user, new IndividualCall(type, receiver, 'HIGH'))
    showMessage({header: '', content: 'Call successfully made!', type: 'success'})
  }

  releasePtt = () => {
    const {user, sendIndividualCallAction, updateIndividualCallAction, individualCalls} = this.props
    const call = individualCalls[0]
    if(call && call.stateType!=='DECLINE' && call.stateType!=='DISCONNECT' && call.stateType!=='CALL_FAILURE' && call.stateType!=='MISSED'){
      const data = new CallAction(call, 'RELEASE_PUSH_TO_TALK')
      sendIndividualCallAction(user, data)
      updateIndividualCallAction(data)
    }
  }

  render () {
    const {subscriberId, data, page, initiateMessaging} = this.props
    if(!subscriberId){
      return <div className='action-items'>
        <div className='name'>
          <div className='action'>
            <Icon color='red' name='exclamation triangle' /> Subscriber ID not found
          </div>
        </div>
      </div>
    }
    return (
      <div className='action-items'>
        <div className='name'>{subscriberId}</div>
        <div>
          <div>
          {
            page==='map' && 
              <div className={`action pointer ${data.map(st => st.subscriberId).indexOf(subscriberId)>-1 ? 'disabled' : undefined}`} onClick={this.addSnailTrail}>
                <Image src='/images/snail_trail.svg' /> Add to Snail Trail
              </div>
          }
          </div>
          <div className='action pointer' onClick={() => this.initiateCall('duplex', subscriberId)}>
            <Icon color='blue' name='phone' /> Full Duplex Call
          </div>
          <div className='action pointer' onMouseDown={() => this.initiateCall('simplexDirect', subscriberId)} onMouseUp={() => this.releasePtt()}>
            <Image src='/images/ptt.svg' /> Half Duplex Direct Call
          </div>
          <div className='action pointer' onClick={() => this.initiateCall('simplexHook', subscriberId)}>
            <Image className='hook' src='/images/hook.png' /> Half Duplex Hook Call
          </div>
          <div className='action pointer' onClick={() => this.initiateCall('ambient', subscriberId)}>
            <Image className='wave' src='/images/call_wave.svg' /> Ambient Listening Call
          </div>
          <div className='action pointer' onClick={initiateMessaging}>
            <Icon color='orange' name='mail' /> Send Message
          </div>
        </div>
      </div>
    )
  }
} 

const mapStateToProps = state => ({
  user: state.auth.user,
  individualCalls: state.communication.individualCalls
})

const mapDispatchToProps = dispatch => bindActionCreators({
  cacheReload,
  fetchSnailTrails,
  addSnailTrail,
  sendIndividualCall,
  sendTextMessage,
  sendIndividualCallAction,
  updateIndividualCallAction,
  showMessage
}, dispatch)

ActionItems.propTypes = propTypes

ActionItems.contextTypes = {
  router: PropTypes.object.isRequired
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ActionItems)