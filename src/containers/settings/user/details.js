/**
 *  Component: User Details
 */

import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { goBack } from 'react-router-redux'
import { bindActionCreators } from 'redux'
import { Form, Select, Dropdown, Button } from 'semantic-ui-react'
import {
  fetchUser,
  addUser,
  updateUser,
  fetchAllSubscribers,
  fetchAllRoles,
  fetchAllAccesses
 } from '../../../modules/user' 
import { showMessage } from '../../../modules/alerts' 
import '../../../styles/settings.scss'

const propTypes = {
  roles: PropTypes.array,
  accesses: PropTypes.array,
  addUser: PropTypes.func.isRequired,
  updateUser: PropTypes.func.isRequired,
  fetchAllRoles: PropTypes.func.isRequired,
  fetchAllAccesses: PropTypes.func.isRequired,
  showMessage: PropTypes.func.isRequired
}

class UserDetails extends React.Component {

  state = {
    userDetails: null,
    roles: [],
    accesses: []
  }

  componentDidMount = async () => {
    const {fetchUser, showMessage, fetchAllSubscribers, fetchAllRoles, fetchAllAccesses} = this.props
    const params = new URL(document.location).searchParams
    const userId = params.get('id')
    let userDetails = await fetchUser(userId)
    if(userDetails.type !== 'success'){
      showMessage(userDetails)
    }
    let res = await fetchAllSubscribers()
    if(res.type !== 'success'){
      showMessage(res)
    }
    res = await fetchAllRoles()
    if(res.type !== 'success'){
      showMessage(res)
    }
    res = await fetchAllAccesses()
    if(res.type !== 'success'){
      showMessage(res)
    }
    const {subscribers, roles, accesses} = this.props
    this.setState({ 
      userDetails: {
        ...userDetails.data,
        subscriberId: userDetails.data.subscriber && userDetails.data.subscriber.subscriberId ? userDetails.data.subscriber.subscriberId : undefined,
        roleId: userDetails.data.role && userDetails.data.role.id ? userDetails.data.role.id : undefined,
        accesses: (roles && userDetails.data.role && userDetails.data.role.id) ? roles.filter(r => r.id===userDetails.data.role.id)[0].accesses.map(x => x.id) : []
      }, 
      roles: roles ? roles.map(r => ({key: r.id, text: r.name, value: r.id})) : [], 
      subscribers: subscribers ? subscribers.map(r => ({key: r.id, text: r.subscriberId, value: r.subscriberId})) : [], 
      accesses: accesses ? accesses.map(a => ({key: a.id, text: a.type, value: a.id})) : [] 
    })
  }

  onChange = (e, data) => this.setState({userDetails: {...this.state.userDetails, [e.target.name]: e.target.value}})

  onRuleChange = (e, data) => {
    const {roles} = this.props
    this.setState({
      userDetails: {
        ...this.state.userDetails,
        roleId: data.value, 
        accesses: (roles && data.value) ? roles.filter(r => r.id===data.value)[0].accesses.map(x => x.id) : []
      }
    })
  }

  onSubscriberChange = (e, data) => this.setState({ userDetails: {...this.state.userDetails, [data.name]: data.value} })

  createRequestObject = (data) => {
    const {subscribers} = this.props
    return {
      name: data.name,
      password: data.password,
      role: {
        id: data.roleId
      },
      subscriber: {
        id: subscribers.filter(s => s.subscriberId===data.subscriberId)[0].id,
        subscriberType: subscribers.filter(s => s.subscriberId===data.subscriberId)[0].subscriberType
      }
    }
  }

  submitForm = async () => {
    const {addUser, updateUser, showMessage, goBack, user} = this.props
    const {userDetails} = this.state
    let res
    const params = this.createRequestObject(userDetails)
    if(userDetails.id) {
      // update the user
      res = await updateUser(params, userDetails.id, user)
    } else {
      // add the user
      res = await addUser(params)
    }
    showMessage(res)
    if(res.type==='success'){
      goBack()
    }
  }

  render () {
    const {userDetails, subscribers, roles, accesses} = this.state
    const {goBack} = this.props
    if(!userDetails){
      return <div></div>
    }
    return (
      <div className="settings">
        <Form onSubmit={this.submitForm}>
          <Form.Field>
            <label>Username</label>
            <input name='name' onChange={this.onChange} value={userDetails.name} placeholder='Username' />
          </Form.Field>
          <Form.Field>
            <label>Password</label>
            <input name='password' onChange={this.onChange} value={userDetails.password} type='password' placeholder='Password' />
          </Form.Field>
          <Form.Field search name='subscriberId' onChange={this.onSubscriberChange} value={userDetails.subscriberId} control={Select} label='Subscriber' options={subscribers} placeholder='Subscriber' />
          <Form.Field name='roleId' onChange={this.onRuleChange} value={userDetails.roleId} control={Select} label='Role' options={roles} placeholder='Role' />
          <Form.Field value={userDetails.accesses} control={Dropdown} multiple selection label='Access' options={accesses} placeholder='Access' />
          <Button size='tiny' primary type='submit'>Submit</Button>
          <Button size='tiny' type='button' onClick={goBack}>Back</Button>
        </Form>
      </div>
    )
  }
}

const mapStateToProps = state => ({
  user: state.auth.user,
  users: state.user.users,
  subscribers: state.user.subscribers,
  roles: state.user.roles,
  accesses: state.user.accesses
})

const mapDispatchToProps = dispatch => bindActionCreators({
  fetchUser,
  addUser,
  updateUser, 
  fetchAllSubscribers,
  fetchAllRoles,
  fetchAllAccesses,
  showMessage,
  goBack: () => goBack()
}, dispatch)

UserDetails.propTypes = propTypes

export default connect(
  mapStateToProps, mapDispatchToProps
)(UserDetails)