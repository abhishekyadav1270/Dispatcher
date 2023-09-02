/**
 *  Component: Discreet Subscribers
 */

import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { Select, Header, Button, Table } from 'semantic-ui-react'

import { fetchAllSubscribers } from '../../../modules/user'
import { showMessage } from '../../../modules/alerts' 
import { DiscreetListener } from '../../../models/discreetListener'
import { addDiscreetSubscriber, removeDiscreetSubscriber } from '../../../modules/communication'
//import {sipPrivateId} from '../../../utils/sipConfig'

import '../../../styles/settings.scss'

const propTypes = {
  user: PropTypes.object,
  subscribers: PropTypes.array,
  showMessage: PropTypes.func.isRequired
}

class DiscreetSubscribers extends React.Component {

  state = {
    discreetSubscribers: [],
    newSubscriber: undefined
  }

  componentDidMount() {
    this.init()
  }

  init = async () => {
    const {fetchAllSubscribers, showMessage, user} = this.props
    const res = await fetchAllSubscribers()
    if(res.type !== 'success'){
      showMessage(res)
    }
    this.setState({discreetSubscribers: this.props.subscribers.filter(sub => sub.subscriberId === user.profile.mcptt_id.toString())[0].discreetSubscribers})
  }

  onChange = (e, data) => {
    this.setState({newSubscriber: data.value})
  }

  addSubscriber = () => {
    const {user, addDiscreetSubscriber} = this.props
    const {newSubscriber} = this.state
    let params = new DiscreetListener([newSubscriber], 'add', user.profile.mcptt_id)
    addDiscreetSubscriber(params)
    setTimeout(() => {
      this.setState({newSubscriber: undefined})
      this.init()
    }, 500)
  }

  removeSubscriber = (subscriber) => {
    const {user, removeDiscreetSubscriber} = this.props
    let params = new DiscreetListener([subscriber], 'remove', user.profile.mcptt_id)
    removeDiscreetSubscriber(params)
    setTimeout(() => {
      this.init()
    }, 500)
  }

  filterSubscribers = () => {
    const {user} = this.props
    const {discreetSubscribers} = this.state
    return this.props.subscribers.filter(sub => sub.active && discreetSubscribers.indexOf(sub.subscriberId)===-1 && sub.subscriberId!==user.profile.mcptt_id && sub.subscriberType!=="GROUP").map(r => ({description: r.description, active: false, key: r.id, text: r.subscriberId, value: r.subscriberId}))
  }

  render () {
    const {discreetSubscribers, newSubscriber} = this.state
    const subscribers = this.filterSubscribers()
    return (
      <div className="settings discreet-subscribers">
        <Header as='h3'>List of Discreet Subscribers</Header>
        <Table>
          <Table.Body>
          {
            discreetSubscribers.map(sub => (
              <Table.Row key={sub}>
                <Table.Cell>
                  {sub} 
                </Table.Cell>
                <Table.Cell width='125' textAlign='right'>
                  <Button size='tiny' onClick={() => this.removeSubscriber(sub)} negative>Remove</Button>
                </Table.Cell>
              </Table.Row>
            ))
          }
          </Table.Body>
        </Table>
        <Select search name="subscriber" label='Subscriber ID' onChange={this.onChange} value={newSubscriber} options={subscribers} placeholder='Select' />
        &nbsp;&nbsp;&nbsp;&nbsp;<Button size='tiny' onClick={this.addSubscriber} positive>Add</Button>
      </div>
    )
  }
}

const mapStateToProps = state => ({
  user: state.auth.user,
  subscribers: state.user.subscribers
})

const mapDispatchToProps = dispatch => bindActionCreators({
  showMessage,
  fetchAllSubscribers,
  addDiscreetSubscriber,
  removeDiscreetSubscriber
}, dispatch)

DiscreetSubscribers.propTypes = propTypes

export default connect(
  mapStateToProps, mapDispatchToProps
)(DiscreetSubscribers)