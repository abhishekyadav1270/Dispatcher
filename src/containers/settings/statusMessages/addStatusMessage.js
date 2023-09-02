/**
 *  Component: Add Status Message
 */

import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { Button, Header, Form, Modal } from 'semantic-ui-react'
import { addStatusMessage } from '../../../modules/statusMessage'
import { showMessage } from '../../../modules/alerts' 
import '../../../styles/settings.scss'

const propTypes = {
  statusMessages: PropTypes.array.isRequired,
  addStatusMessage: PropTypes.func.isRequired
}

class AddStatusMessage extends React.Component {

  state = {
    description: undefined,
    code: undefined,
    showModal: false
  }

  onChange = (e) => this.setState({[e.target.name]: e.target.value})

  onFormSubmit = async () => {
    const {description, code} = this.state
    const {addStatusMessage, showMessage, init, user} = this.props
    const res = await addStatusMessage({description, code}, user)
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
      <Modal size='tiny' onClose={this.closeModal} open={showModal} trigger={
        <Button className='right' size='small' icon='plus' labelPosition='left' content='Add Status Message' onClick={() => this.setState({ showModal: true })} closeIcon />
      } closeIcon>
        <Header content='Add Status Message' />
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
  addStatusMessage,
  showMessage
}, dispatch)

AddStatusMessage.propTypes = propTypes

export default connect(
  mapStateToProps, mapDispatchToProps
)(AddStatusMessage)