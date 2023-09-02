/**
 *  Component: Update Status Message
 */

import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { Button, Header, Form, Modal } from 'semantic-ui-react'
import { updateStatusMessage } from '../../../modules/statusMessage'
import { showMessage } from '../../../modules/alerts' 
import '../../../styles/settings.scss'

const propTypes = {
  statusMessages: PropTypes.array.isRequired,
  updateStatusMessage: PropTypes.func.isRequired
}

class UpdateStatusMessage extends React.Component {

  state = {
    description: this.props.selectedStatusMessage.description,
    code: this.props.selectedStatusMessage.code,
    showModal: false
  }

  onChange = (e) => this.setState({[e.target.name]: e.target.value})

  onFormSubmit = async () => {
    const {description, code} = this.state
    const {statusMessages, updateStatusMessage, selectedStatusMessage, showMessage, init, user} = this.props
    let statusMessage = statusMessages.filter(message => message.id === selectedStatusMessage.id)[0]
    statusMessage.description = description
    statusMessage.code = code
    delete statusMessage.updated
    const res = await updateStatusMessage(statusMessage, statusMessage.id, user)
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
    const {code, description, showModal} = this.state
    return (
      <Modal size='tiny' onClose={this.closeModal} open={showModal} trigger={<Button size='mini' content='Edit' onClick={() => this.setState({ showModal: true })} />} closeIcon>
        <Header content='Update Status Message' />
        <Modal.Content>
          <Form onSubmit={this.onFormSubmit}>
            <Form.Field>
              <label>Status Message</label>
              <input type="text" name='description' onChange={this.onChange} value={description} placeholder='Status Message' />
            </Form.Field>
            <Form.Field>
              <label>Status Code</label>
              <input type="number" name='code' onChange={this.onChange} value={code} placeholder='Code' />
            </Form.Field>
            <Button size='tiny' primary type='submit'>Submit</Button>
          </Form>
        </Modal.Content>
      </Modal>
    )
  }
}

const mapStateToProps = state => ({
  user: state.auth.user
})

const mapDispatchToProps = dispatch => bindActionCreators({
  updateStatusMessage,
  showMessage
}, dispatch)

UpdateStatusMessage.propTypes = propTypes

export default connect(
  mapStateToProps, mapDispatchToProps
)(UpdateStatusMessage)