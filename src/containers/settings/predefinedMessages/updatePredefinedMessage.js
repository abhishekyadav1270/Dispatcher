/**
 *  Component: Update Predefined Message
 */

import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { Button, Header, Form, Modal } from 'semantic-ui-react'
import { 
  updateUserMessage,
  updateGlobalMessage
} from '../../../modules/predefinedMessage'
import { showMessage } from '../../../modules/alerts' 
import '../../../styles/settings.scss'

const propTypes = {
  predefinedMessages: PropTypes.array.isRequired,
  updateUserMessage: PropTypes.func.isRequired,
  updateGlobalMessage: PropTypes.func.isRequired
}

class UpdatePredefinedMessage extends React.Component {

  state = {
    text: this.props.selectedMessage.text,
    showModal: false
  }

  onChange = (e) => this.setState({[e.target.name]: e.target.value})

  onFormSubmit = async () => {
    const {text} = this.state
    const {predefinedMessages, updateUserMessage, updateGlobalMessage, selectedMessage, showMessage, init, user} = this.props
    let message = predefinedMessages.filter(message => message.id === selectedMessage.id)[0]
    message.text = text
    delete message.updated
    const res = (message.messageScope === 'GLOBAL') ? await updateGlobalMessage(message, message.id, user) : await updateUserMessage(message, message.id, user)
    showMessage(res)
    if(res.type==='success'){
      this.closeModal()
      init()
    }
  }

  closeModal = () => {
    this.setState({ showModal: false })
  }

  render () {
    const {text, showModal} = this.state
    const {selectedMessage} = this.props
    return (
      <Modal size='tiny' onClose={this.closeModal} open={showModal} trigger={<Button size='mini' content='Edit' onClick={() => this.setState({ showModal: true })} />} closeIcon>
        <Header content='Update Predefined Message' />
        <Modal.Content>
          <Form onSubmit={this.onFormSubmit}>
            <Form.Field>
              <label>ID</label>
              <input disabled value={selectedMessage.id} />
            </Form.Field>
            <Form.Field>
              <label>Message</label>
              <input type="text" name='text' onChange={this.onChange} value={text} placeholder='Message' />
            </Form.Field>
            <Button size='tiny' primary type='submit'>Submit</Button>
          </Form>
        </Modal.Content>
      </Modal>
    )
  }
}

const mapStateToProps = state => ({
  user: state.auth.user,
})

const mapDispatchToProps = dispatch => bindActionCreators({
  updateUserMessage,
  updateGlobalMessage,
  showMessage
}, dispatch)

UpdatePredefinedMessage.propTypes = propTypes

export default connect(
  mapStateToProps, mapDispatchToProps
)(UpdatePredefinedMessage)