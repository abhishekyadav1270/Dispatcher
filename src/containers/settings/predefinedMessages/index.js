/**
 *  Component: Predefined Messages
 */

import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { Table } from 'semantic-ui-react'
import { 
  fetchAllUserMessages,
  fetchAllGlobalMessages
 } from '../../../modules/predefinedMessage'
import { showMessage } from '../../../modules/alerts' 
import UpdatePredefinedMessage from './updatePredefinedMessage'
import AddPredefinedMessage from './addPredefinedMessage'
import { hasPermission } from '../../../utils/lib'

import '../../../styles/settings.scss'

const propTypes = {
  userMessages: PropTypes.array,
  globalMessages: PropTypes.array,
  fetchAllUserMessages: PropTypes.func.isRequired,
  fetchAllGlobalMessages: PropTypes.func.isRequired,
  user: PropTypes.object,
  showMessage: PropTypes.func.isRequired
}

class PredefinedMessagesSettings extends React.Component {

  state = {
    predefinedMessages: []
  }

  componentDidMount() {
    this.init()
  }

  init = async () => {
    const {fetchAllUserMessages, fetchAllGlobalMessages, showMessage, user} = this.props
    if(user){
      const res1 = await fetchAllUserMessages(user.profile.mcptt_id)
      if(res1.type !== 'success'){
        showMessage(res1)
      }
      if(hasPermission(user, 'Admin')){
        const res2 = await fetchAllGlobalMessages()
        if(res2.type !== 'success'){
          showMessage(res1)
        }
        this.setState({
          predefinedMessages: [...this.props.userMessages, ...this.props.globalMessages]
        })
      } else {
        this.setState({
          predefinedMessages: this.props.userMessages
        })
      }
    }
  }

  render () {
    const {predefinedMessages} = this.state
    const {user} = this.props
    return (
      <div className="settings">
      {
        <div>
          <AddPredefinedMessage messageScope='USER_SPECIFIC' init={this.init} />
          {
            hasPermission(user, 'Admin') && <AddPredefinedMessage messageScope='GLOBAL' init={this.init} />
          }
          {
            predefinedMessages.length>0 &&
              <Table celled>
                <Table.Header>
                  <Table.Row>
                    <Table.HeaderCell>S. No.</Table.HeaderCell>
                    <Table.HeaderCell>Message</Table.HeaderCell>
                    <Table.HeaderCell>Type</Table.HeaderCell>
                    <Table.HeaderCell>Created At</Table.HeaderCell>
                    <Table.HeaderCell>Created By</Table.HeaderCell>
                    <Table.HeaderCell>Updated At</Table.HeaderCell>
                    <Table.HeaderCell>Updated By</Table.HeaderCell>
                    <Table.HeaderCell></Table.HeaderCell>
                  </Table.Row>
                </Table.Header>

                <Table.Body>
                  {
                    predefinedMessages.map((message, index) => (
                      <Table.Row key={message.id}>
                        <Table.Cell>{index+1}.</Table.Cell>
                        <Table.Cell>{message.text}</Table.Cell>
                        <Table.Cell>{message.messageScope}</Table.Cell>
                        <Table.Cell>{message.createdAt}</Table.Cell>
                        <Table.Cell>{message.createdBy}</Table.Cell>
                        <Table.Cell>{message.updatedAt}</Table.Cell>
                        <Table.Cell>{message.updatedBy}</Table.Cell>
                        <Table.Cell>
                          {
                            <UpdatePredefinedMessage init={this.init} predefinedMessages={predefinedMessages} selectedMessage={message} />
                          }
                        </Table.Cell>
                      </Table.Row>
                    ))
                  }
                </Table.Body>
              </Table>
          }
        </div>
      }
      </div>
    )
  }
}

const mapStateToProps = state => ({
  userMessages: state.predefinedMessage.userMessages,
  globalMessages: state.predefinedMessage.globalMessages,
  user: state.auth.user
})

const mapDispatchToProps = dispatch => bindActionCreators({
  fetchAllUserMessages,
  fetchAllGlobalMessages,
  showMessage
}, dispatch)

PredefinedMessagesSettings.propTypes = propTypes

export default connect(
  mapStateToProps, mapDispatchToProps
)(PredefinedMessagesSettings)