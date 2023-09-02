/**
 *  Component: Train Subscriber Settings
 */

import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { Table, Button, Confirm, Input } from 'semantic-ui-react'

import { fetchAllTrainsInfo } from '../../../modules/actions';
import { fetchAllSubscribers, updateSubscriber } from '../../../modules/user'
import { showMessage } from '../../../modules/alerts' 
import CreateMapping from './createMapping'
import UpdateMapping from './updateMapping'

import '../../../styles/settings.scss'

const propTypes = {
  trainsInfo: PropTypes.array,
  updateSubscriber: PropTypes.func.isRequired,
  fetchAllTrainsInfo: PropTypes.func.isRequired,
  fetchAllSubscribers: PropTypes.func.isRequired,
  showMessage: PropTypes.func.isRequired
}

class TrainSubscriberSettings extends React.Component {

  state = {
    subscribers: [],
    searchText: '',
    selectedTrainInfo: null,
    isDeleteClicked: false,
    mappings: []
  }

  showConfirm = trainId => this.setState({ selectedTrainInfo: trainId, isDeleteClicked: true })
  handleDelete = mapping => this.deleteMapping(mapping)
  handleCancel = () => this.setState({ isDeleteClicked: false })

  componentDidMount = () => {
    this.init()
  }

  onChange = (e) => this.setState({searchText: e.target.value})

  deleteMapping = async (mapping) => {
    const {subscribers, updateSubscriber, showMessage} = this.props
    let subscriber = subscribers.filter(sub => sub.subscriberId === mapping.subscriberId)[0]
    delete subscriber.trainInfo
    const res = await updateSubscriber(subscriber, subscriber.id) 
    showMessage(res)
    if(res.type === 'success'){
      this.setState({isDeleteClicked: false})
      this.init()
    }
  }

  init = async () => {
    const {trainsInfo, fetchAllTrainsInfo, fetchAllSubscribers, showMessage} = this.props
    let res
    if(!trainsInfo.length) {
      res = await fetchAllTrainsInfo()
      if(res.type !== 'success'){
        showMessage(res)
      }
    }
    res = await fetchAllSubscribers()
    if(res.type !== 'success'){
      showMessage(res)
    }
    this.setState({
      subscribers: this.props.subscribers.filter(sub => sub.subscriberType!=="GROUP" && sub.active),
      mappings: this.props.trainsInfo.map(train => {
        const sub = this.props.subscribers.filter(sub => sub.trainInfo && sub.trainInfo.id===train.id)
        return {
          trainId: train.id,
          trainPhysicalId: train.ptiTrainId,
          trainNumber: train.trainNumber,
          subscriberId: sub.length ? sub[0].subscriberId : '',
        }
      })
    })
  }

  getFilteredMappings = () => {
    const {mappings, searchText} = this.state
    let result = mappings
    if(searchText && searchText!==''){
      result = mappings.filter(mapping => mapping.trainNumber.indexOf(searchText) > -1)
      if(!result.length){
        result = mappings.filter(mapping => mapping.subscriberId.indexOf(searchText) > -1)
      }
    }
    return result
  }

  render () {
    const {subscribers, isDeleteClicked, selectedTrainInfo, searchText} = this.state
    const {trainsInfo} = this.props
    return (
      <div className="settings">
      {
        <div>
          <Input icon='search' className='search' value={searchText} name='searchText' onChange={this.onChange} iconPosition='left' placeholder='Search Train or Subscriber' />
          <CreateMapping init={this.init} subscribers={subscribers} trainsInfo={trainsInfo} />
          <Table celled>
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell>S. No</Table.HeaderCell>
                <Table.HeaderCell>Train Physical ID</Table.HeaderCell>
                <Table.HeaderCell>Train Number</Table.HeaderCell>
                <Table.HeaderCell>Subscriber ID</Table.HeaderCell>
                <Table.HeaderCell></Table.HeaderCell>
              </Table.Row>
            </Table.Header>

            <Table.Body>
              {
                this.getFilteredMappings().map((mapping, index) => (
                  <Table.Row key={index}>
                    <Table.Cell>{index+1}.</Table.Cell>
                    <Table.Cell>{mapping.trainPhysicalId}</Table.Cell>
                    <Table.Cell>{mapping.trainNumber}</Table.Cell>
                    <Table.Cell>{mapping.subscriberId || '-'}</Table.Cell>
                    <Table.Cell>
                      {
                        <UpdateMapping init={this.init} selectedMapping={mapping} subscribers={subscribers} trainsInfo={trainsInfo} />
                      }
                      {
                        mapping.subscriberId && <Button size='mini' negative onClick={() => this.showConfirm(mapping.trainId)}>Remove</Button>
                      }
                      {
                        selectedTrainInfo===mapping.trainId && <Confirm
                          size='mini'
                          open={isDeleteClicked}
                          header={`Remove ${mapping.trainNumber}'s subscriber mapping`}
                          onCancel={this.handleCancel}
                          onConfirm={() => this.handleDelete(mapping)}
                          />
                      }
                    </Table.Cell>
                  </Table.Row>
                ))
              }
            </Table.Body>
          </Table>
        </div>
      }
      </div>
    )
  }
}

const mapStateToProps = state => ({
  trainsInfo: state.train.trainsInfo,
  subscribers: state.user.subscribers
})

const mapDispatchToProps = dispatch => bindActionCreators({
  updateSubscriber,
  fetchAllSubscribers,
  fetchAllTrainsInfo,
  showMessage
}, dispatch)

TrainSubscriberSettings.propTypes = propTypes

export default connect(
  mapStateToProps, mapDispatchToProps
)(TrainSubscriberSettings)