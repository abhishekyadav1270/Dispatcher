/**
 *  Component: Status Message Settings
 */

import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { Table } from 'semantic-ui-react'
import { fetchAllStatusMessages } from '../../../modules/statusMessage'
import { showMessage } from '../../../modules/alerts' 
import AddStatusMessage from './addStatusMessage'
import UpdateStatusMessage from './updateStatusMessage'

import '../../../styles/settings.scss'

const propTypes = {
  statusMessages: PropTypes.array,
  fetchAllStatusMessages: PropTypes.func.isRequired,
  showMessage: PropTypes.func.isRequired
}

class StatusMessageSettings extends React.Component {

  componentDidMount() {
    this.init()
  }

  init = async () => {
    const {fetchAllStatusMessages, showMessage} = this.props
    const res = await fetchAllStatusMessages()
    if(res.type !== 'success'){
      showMessage(res)
    }
  }

  render () {
    const {statusMessages} = this.props
    return (
      <div className="settings">
      {
        <div>
          <AddStatusMessage init={this.init} />
          {
            statusMessages.length>0 && <Table celled>
              <Table.Header>
                <Table.Row>
                  <Table.HeaderCell>S. No.</Table.HeaderCell>
                  <Table.HeaderCell>Description</Table.HeaderCell>
                  <Table.HeaderCell>Code</Table.HeaderCell>
                  <Table.HeaderCell>Created At</Table.HeaderCell>
                  <Table.HeaderCell>Created By</Table.HeaderCell>
                  <Table.HeaderCell>Updated At</Table.HeaderCell>
                  <Table.HeaderCell>Updated By</Table.HeaderCell>
                  <Table.HeaderCell></Table.HeaderCell>
                </Table.Row>
              </Table.Header>

              <Table.Body>
                {
                  statusMessages.map((message, index) => (
                    <Table.Row key={message.id}>
                      <Table.Cell>{index+1}.</Table.Cell>
                      <Table.Cell>{message.description}</Table.Cell>
                      <Table.Cell>{message.code}</Table.Cell>
                      <Table.Cell>{message.created}</Table.Cell>
                      <Table.Cell>{message.createdBy}</Table.Cell>
                      <Table.Cell>{message.updated}</Table.Cell>
                      <Table.Cell>{message.updatedBy}</Table.Cell>
                      <Table.Cell>
                        {
                          <UpdateStatusMessage init={this.init} statusMessages={statusMessages} selectedStatusMessage={message} />
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
  statusMessages: state.statusMessage.statusMessages
})

const mapDispatchToProps = dispatch => bindActionCreators({
  fetchAllStatusMessages,
  showMessage
}, dispatch)

StatusMessageSettings.propTypes = propTypes

export default connect(
  mapStateToProps, mapDispatchToProps
)(StatusMessageSettings)