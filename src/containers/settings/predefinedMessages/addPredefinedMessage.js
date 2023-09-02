/**
 *  Component: Add Predefined Message
 */

import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { Button, Header, Form, Modal } from 'semantic-ui-react'
import { 
  addUserMessage,
  addGlobalMessage
} from '../../../modules/predefinedMessage'
import { showMessage } from '../../../modules/alerts' 
import '../../../styles/settings.scss'

const propTypes = {
  addUserMessage: PropTypes.func.isRequired,
  addGlobalMessage: PropTypes.func.isRequired
}

class AddPredefinedMessage extends React.Component {

  state = {
    text: undefined,
    showModal: false
  }

  onChange = (e) => this.setState({[e.target.name]: e.target.value})

  onFormSubmit = async () => {
    const {text} = this.state
    const {messageScope, addUserMessage, addGlobalMessage, showMessage, init, user} = this.props
    const res = (messageScope === 'GLOBAL') ? await addGlobalMessage({text, messageScope}, user) : await addUserMessage({text, messageScope}, user)
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
    const {messageScope} = this.props
    const content = (messageScope==='GLOBAL') ? 'Add Global Message' : 'Add User-specific Message'
    return (
      <Modal size='tiny' onClose={this.closeModal} open={showModal} trigger={
        <Button className='right' size='small' icon='plus' labelPosition='left' content={content} onClick={() => this.setState({ showModal: true })} closeIcon />
      } closeIcon>
        <Header content={content} />
        <Modal.Content>
          <Form onSubmit={this.onFormSubmit}>
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
  addUserMessage,
  addGlobalMessage,
  showMessage
}, dispatch)

AddPredefinedMessage.propTypes = propTypes

export default connect(
  mapStateToProps, mapDispatchToProps
)(AddPredefinedMessage)