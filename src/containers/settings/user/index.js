/**
 *  Component: User Settings
 */

import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { push } from 'react-router-redux'
import { bindActionCreators } from 'redux'
import { Table, Button, Confirm, Input } from 'semantic-ui-react'
import { 
  fetchAllUsers,
  addUser,
  updateUser,
  deleteUser,
 } from '../../../modules/user' 
import { showMessage } from '../../../modules/alerts' 
import '../../../styles/settings.scss'

const propTypes = {
  users: PropTypes.array,
  fetchAllUsers: PropTypes.func.isRequired,
  addUser: PropTypes.func.isRequired,
  updateUser: PropTypes.func.isRequired,
  deleteUser: PropTypes.func.isRequired,
  showMessage: PropTypes.func.isRequired
}

class UserSettings extends React.Component {

  state = {
    searchText: '',
    selectedUser: null,
    isDeleteClicked: false
  }

  showConfirm = userId => this.setState({ selectedUser: userId, isDeleteClicked: true })
  handleDelete = userId => this.deleteUser(userId)
  handleCancel = () => this.setState({ isDeleteClicked: false })

  componentDidMount = async () => {
    const {fetchAllUsers, showMessage} = this.props
    const res = await fetchAllUsers()
    if(res.type !== 'success'){
      showMessage(res)
    }
  }

  onChange = (e) => this.setState({searchText: e.target.value})

  deleteUser = async (id) => {
    const {deleteUser, showMessage} = this.props
    const res = await deleteUser(id)
    showMessage(res)
    this.setState({ isDeleteClicked: false })
  }

  getFilteredUsers = () => {
    const {users} = this.props
    const {searchText} = this.state
    let result = users
    if(searchText && searchText!==''){
      result = users.filter(user => user.name.indexOf(searchText) > -1)
      if(!result.length){
        result = users.filter(user => user.subscriber.subscriberId.indexOf(searchText) > -1)
      }
    }
    return result
  }

  render () {
    const {isDeleteClicked, selectedUser, searchText} = this.state
    const {editUser, newRule} = this.props
    return (
      <div className="settings">
      {
        <div>
          <Input icon='search' className='search' value={searchText} name='searchText' onChange={this.onChange} iconPosition='left' placeholder='Search User or Subscriber ID' />
          <Button className='right' size='small' icon='plus' labelPosition='left' content='Add User' onClick={newRule} />
          <Table celled>
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell>User ID</Table.HeaderCell>
                <Table.HeaderCell>Username</Table.HeaderCell>
                <Table.HeaderCell>Subscriber ID</Table.HeaderCell>
                <Table.HeaderCell>Created At</Table.HeaderCell>
                <Table.HeaderCell>Created By</Table.HeaderCell>
                <Table.HeaderCell>Updated At</Table.HeaderCell>
                <Table.HeaderCell>Updated By</Table.HeaderCell>
                <Table.HeaderCell></Table.HeaderCell>
              </Table.Row>
            </Table.Header>

            <Table.Body>
              {
                this.getFilteredUsers().map(user => (
                  <Table.Row key={user.profile.name}>
                    <Table.Cell>{user.profile.name}</Table.Cell>
                    <Table.Cell>{user.profile.mcptt_id}</Table.Cell>
                    <Table.Cell>{user.subscriber.subscriberId}</Table.Cell>
                    <Table.Cell>{}</Table.Cell>
                    <Table.Cell>{}</Table.Cell>
                    <Table.Cell>{}</Table.Cell>
                    <Table.Cell>{}</Table.Cell>
                    <Table.Cell>
                      <Button size='mini' onClick={() => editUser(user.profile.name)}>Edit</Button>
                      <Button size='mini' negative onClick={() => this.showConfirm(user.profile.name)}>Remove</Button>
                      {
                        selectedUser===user.name && <Confirm
                          size='mini'
                          open={isDeleteClicked}
                          header={`Remove '${user.name}'`}
                          onCancel={this.handleCancel}
                          onConfirm={() => this.handleDelete(user.profile.name)}
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
  users: state.user.users
})

const mapDispatchToProps = dispatch => bindActionCreators({
  fetchAllUsers,
  addUser,
  updateUser, 
  deleteUser,
  showMessage,
  editUser: (userId) => push(`/settings/users/user?id=${userId}`),
  newRule: () => push('/settings/users/user')
}, dispatch)

UserSettings.propTypes = propTypes

export default connect(
  mapStateToProps, mapDispatchToProps
)(UserSettings)