/**
 *  Component: ActionPopup
 */

import React from 'react'
import PropTypes from 'prop-types'
import { Image, Popup } from 'semantic-ui-react'

import ActionItems from './actionItems' 
import MessageModal from './messageModal'

const propTypes = {
  page: PropTypes.string,
  subscriberId: PropTypes.string.isRequired,
  data: PropTypes.array
}

class ActionPopup extends React.Component{

  state = {
    showMessageModal: false
  }
  
  closeModal = () => this.setState({showMessageModal: false})
  initiateMessaging = () => this.setState({showMessageModal: true})

  render () {
    const {subscriberId, data, page} = this.props
    const {showMessageModal} = this.state
    return (
      <div>
        <Popup
          className='marker-popup'
          trigger={
            <div>
              <div className='label'>{subscriberId}</div>
              <Image className='marker pointer' src='/images/location.svg' />
            </div>
          }
          content={
            <ActionItems subscriberId={subscriberId} data={data} page={page} initiateMessaging={this.initiateMessaging} />
          }
          on='click'
          position='top right'
        />
        <MessageModal subscriberId={subscriberId} closeModal={this.closeModal} showMessageModal={showMessageModal} />
      </div>
    )  
  }
} 

ActionPopup.propTypes = propTypes

export default ActionPopup