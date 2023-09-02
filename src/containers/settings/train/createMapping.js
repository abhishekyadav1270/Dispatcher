/**
 *  Component: Create Train Subscriber Settings
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

class CreateMapping extends React.Component {

  state = {
    mapping: {
      trainId: '',
      subscriberId: ''
    },
    showModal: false
  }

  componentDidMount = async () => {
  }

  onChange = (e, data) => this.setState({mapping: {...this.state.mapping, [data.name]: data.value}})

  onFormSubmit = async () => {
    const {mapping} = this.state
    const {subscribers, trainsInfo, updateSubscriber, showMessage, init} = this.props
    let subscriber = subscribers.filter(sub => sub.id === mapping.subscriberId)[0]
    subscriber.trainInfo = trainsInfo.filter(train => train.id === mapping.trainId)[0]
    const res = await updateSubscriber(subscriber, mapping.subscriberId) 
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
    const {mapping, showModal} = this.state
    const {subscribers, trainsInfo} = this.props
    return (
      <Modal size='tiny' onClose={this.closeModal} open={showModal} trigger={<Button className='right' size='small' icon='plus' labelPosition='left' content='Add Mapping' onClick={() => this.setState({ showModal: true })} />} closeIcon>
        <Header content='Add new Train-Subscriber Mapping' />
        <Modal.Content>
          <Form onSubmit={this.onFormSubmit}>
            <Form.Field name='trainId' onChange={this.onChange} value={mapping.trainId} control={Select} label='Train Physical ID' options={trainsInfo.map(train => ({key: train.id, text: train.ptiTrainId, value: train.id}))} placeholder='Train Physical ID' />
            <Form.Field search name='subscriberId' onChange={this.onChange} value={mapping.subscriberId} control={Select} label='Subscriber ID' options={subscribers.map(sub => ({key: sub.id, text: sub.subscriberId, value: sub.id}))} placeholder='Subscriber ID' />
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

CreateMapping.propTypes = propTypes

export default connect(
  mapStateToProps, mapDispatchToProps
)(CreateMapping)