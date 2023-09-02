/**
 *  Component: ActionItems
 */

import React from 'react'
import PropTypes from 'prop-types'
import { Modal, Header, TextArea, Button } from 'semantic-ui-react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import { showMessage } from '../../modules/alerts' 
import { IndividualTextMessage } from '../../models/message'
import { sendTextMessage } from '../../modules/communication'

const propTypes = {
  user: PropTypes.object,
  showMessage: PropTypes.func.isRequired,
  page: PropTypes.string,
  subscriberId: PropTypes.string.isRequired,
  data: PropTypes.array
}

class ActionItems extends React.Component {

  state = {
    message: ''
  }

  onChange = (e) => this.setState({ [e.target.name]: e.target.value })

  sendMessage = (receiver) => {
    const {message} = this.state
    const {user, sendTextMessage, showMessage, closeModal} = this.props
    sendTextMessage(user, new IndividualTextMessage(message, receiver))
    this.setState({message: ''})
    closeModal()
  }

  render () {
    const {message} = this.state
    const {subscriberId, closeModal, showMessageModal} = this.props
    if(!subscriberId){
      return (
        <Modal className="send-message-modal" size='tiny' onClose={closeModal} open={showMessageModal} closeIcon>
          <Header content='Error' />
          <Modal.Content>
            Subscriber ID not found
          </Modal.Content>
        </Modal>
      )
    }
    return (
      <Modal className="send-message-modal" size='tiny' onClose={closeModal} open={showMessageModal} closeIcon>
        <Header content={'Send message to ' + subscriberId} />
        <Modal.Content>
          <div className='message'>
            <TextArea name="message" label='Enter Message' onChange={this.onChange} value={message} placeholder='' />
            <div className='btn-container'>
              <Button size='mini' disabled={message===''} onClick={() => this.sendMessage(subscriberId)}> Submit</Button>
            </div>
          </div>
        </Modal.Content>
      </Modal>
    )
  }
} 

const mapStateToProps = state => ({
  user: state.auth.user,
})

const mapDispatchToProps = dispatch => bindActionCreators({
  sendTextMessage,
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