/**
 *  Component: Alert
 */

import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { Message } from 'semantic-ui-react'
import { Toast } from 'react-bootstrap'

import { removeMessage } from '../../modules/alerts' 
import '../../styles/alert.scss'

const propTypes = {
  messages: PropTypes.array
}

class Alert extends React.Component {

  state = {

  }

  componentDidMount() {

  }

  render () {
    const {messages, removeMessage} = this.props
    return (
      messages.length ? 
        <div className="alert">
        <React.Fragment>
          {
            messages.map(message => (
              // <Message 
              //   onDismiss={() => removeMessage(message.id)}
              //   compact
              //   size='mini'
              //   key={message.id} 
              //   success={message.type === 'success'} 
              //   error={message.type === 'error'}
              //   // color='black'
              //   header={message.header}
              //   content={message.content}
              //   />
              <Toast onClose={() => this.setState({[message.id]:true})} show={!this.state[message.id]?true:false}>
                <Toast.Header style={{ backgroundColor:message.type==='success'?'#2e9e79':message.type==='notif'?'#ff9b54':'#e0003c'}}>
                  {/* <img src="assets/images/metro.png" className="rounded mr-2" alt="" style={{height:'50px',width:'150px'}} /> */}
                  <strong className="mr-auto white">{message.header}</strong>
                  {/* <small>just now</small> */}
                </Toast.Header>
                <Toast.Body>{message.content}</Toast.Body>
              </Toast>
            ))
          }
        </React.Fragment>
        </div>
        : 
        <span />
    )
  }
}

const mapStateToProps = state => ({
  messages: state.alerts.messages
})

const mapDispatchToProps = dispatch => bindActionCreators({
  removeMessage
}, dispatch)

Alert.propTypes = propTypes

export default connect(
  mapStateToProps, mapDispatchToProps
)(Alert)