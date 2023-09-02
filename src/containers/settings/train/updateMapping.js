/**
 *  Component: Update Train Subscriber Settings
 */

import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { Button, Header, Form, Select, Modal } from 'semantic-ui-react'
import { updateSubscriber } from '../../../modules/user'
import { showMessage } from '../../../modules/alerts' 
import '../../../styles/settings.scss'

const propTypes = {
  trainsInfo: PropTypes.array,
  showMessage: PropTypes.func.isRequired,
  updateSubscriber: PropTypes.func.isRequired
}

class UpdateMapping extends React.Component {

  state = {
    subscriberId: '',
    showModal: false
  }

  componentDidMount = async () => {
  }

  onChange = (e, data) => this.setState({[data.name]: data.value})

  onFormSubmit = async () => {
    const {subscriberId} = this.state
    const {subscribers, trainsInfo, updateSubscriber, selectedMapping, showMessage, init} = this.props
    let res
    if(selectedMapping.subscriberId!==''){
      let oldSubscriber = subscribers.filter(sub => sub.subscriberId === selectedMapping.subscriberId)[0]
      oldSubscriber.trainInfo = null
      res = await updateSubscriber(oldSubscriber, oldSubscriber.id) 
    }
    let newSubscriber = subscribers.filter(sub => sub.id === subscriberId)[0]
    newSubscriber.trainInfo = trainsInfo.filter(train => train.ptiTrainId === selectedMapping.trainPhysicalId)[0]
    res = await updateSubscriber(newSubscriber, newSubscriber.id) 
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
    const {subscriberId, showModal} = this.state
    const {subscribers, selectedMapping} = this.props
    return (
      <Modal size='tiny' onClose={this.closeModal} open={showModal} trigger={<Button size='mini' content='Edit' onClick={() => this.setState({ showModal: true })} />} closeIcon>
        <Header content='Edit Train-Subscriber Mapping' />
        <Modal.Content>
          <Form onSubmit={this.onFormSubmit}>
            <Form.Field>
              <label>Train Physical ID</label>
              <input disabled value={selectedMapping.trainPhysicalId} />
            </Form.Field>
            <Form.Field name='subscriberId' onChange={this.onChange} value={subscriberId} control={Select} label='Subscriber' options={subscribers.map(sub => ({key: sub.id, text: sub.subscriberId, value: sub.id}))} placeholder='Subscriber' />
            <Button size='tiny' primary type='submit'>Submit</Button>
          </Form>
        </Modal.Content>
      </Modal>
    )
  }
}

const mapStateToProps = state => ({
})

const mapDispatchToProps = dispatch => bindActionCreators({
  updateSubscriber,
  showMessage
}, dispatch)

UpdateMapping.propTypes = propTypes

export default connect(
  mapStateToProps, mapDispatchToProps
)(UpdateMapping)