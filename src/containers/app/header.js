/**
 *  Component: Header
 */

import React from 'react'
import PropTypes from 'prop-types'
import { push } from 'react-router-redux'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { NavLink } from 'react-router-dom'
import { Dropdown, Menu, Image, Icon } from 'semantic-ui-react'

import { hasPermission } from '../../utils/lib'
import Count from './count'
import DeviceTesting from '../deviceTesting'
import { stopTimer } from '../../modules/connection'
import { logoutUser } from '../../modules/actions'
import '../../styles/header.scss'

const propTypes = {
  statuses: PropTypes.array,
  groupStatuses: PropTypes.array,
  activities: PropTypes.array,
  navigateToLogin: PropTypes.func.isRequired,
  stopTimer: PropTypes.func.isRequired,
  isAuthenticated: PropTypes.bool,
  logoutUser: PropTypes.func.isRequired
}

class Header extends React.Component {

  state = {
    curTime: null
  }

  logout = async () => {
    this.props.stopTimer()
    await this.props.logoutUser()
    this.props.navigateToLogin()
  }

  componentDidMount() {
    setInterval( () => {
      this.setState({
        curTime : new Date().toLocaleTimeString('en-GB').slice(0, -3)
      })
    },1000)
  }

  render () {
    const {user, isAuthenticated, statuses, groupStatuses, activities, individualCalls} = this.props
    const {curTime} = this.state
    const alarmsCount = [...statuses, ...groupStatuses].filter(status => status.stateType==='PERSISTED').length
    const communicationCount = individualCalls.length
    const activitiesCount = activities.length

    return isAuthenticated ? (
      <div className="header">
        <Menu pointing secondary>
          <Menu.Item fitted as={NavLink} to="/trains">
            <Image size='mini' src='/logo.png' />
          </Menu.Item>
          <Menu.Item as={NavLink} activeClassName='active' to="/trains">
            <Icon name='train' />Trains
          </Menu.Item>
          <Menu.Item as={NavLink} activeClassName='active' to="/communication">
            <Icon name='comments' />Communication<Count count={communicationCount} />
          </Menu.Item>
          <Menu.Item as={NavLink} activeClassName='active' to="/alarms">
            <Icon name='warning sign' />Alarms<Count count={alarmsCount} />
          </Menu.Item>
          <Menu.Item as={NavLink} activeClassName='active' to="/location">
            <Icon name='marker' />Location<Count count={activitiesCount} />
          </Menu.Item>
          <Menu.Menu position='right'>
            <Menu.Item className='clock'>{curTime}</Menu.Item>
            <Menu.Item>
              <Dropdown position="right" size="medium" icon='user circle outline' pointing className='icon'>
                <Dropdown.Menu>
                  <div className='subscriber'>
                    {user.profile.name}
                    {
                      user.profile.name && <span>&nbsp;({user.profile.name})</span>
                    }
                  </div>
                  <Dropdown.Item>
                    <DeviceTesting />
                  </Dropdown.Item>
                  {
                    hasPermission(user, 'ROLE_MANAGEMENT') &&
                      <Dropdown.Item>
                        <NavLink to="/settings/users">User Settings</NavLink>
                      </Dropdown.Item>
                  }
                  {
                    hasPermission(user, 'ROLE_MANAGEMENT') &&
                      <Dropdown.Item>
                        <NavLink to="/settings/trains">Train-Subscriber Mappings</NavLink>
                      </Dropdown.Item>
                  }
                  {
                    hasPermission(user, 'ROLE_MANAGEMENT') &&
                      <Dropdown.Item>
                        <NavLink to="/settings/properties">Data Retention Policy</NavLink>
                      </Dropdown.Item>
                  }
                  {
                    hasPermission(user, 'ROLE_MANAGEMENT') &&
                      <Dropdown.Item>
                        <NavLink to="/settings/statusMessages">Status Messages</NavLink>
                      </Dropdown.Item>
                  }
                  {
                    <Dropdown.Item>
                      <NavLink to="/settings/predefinedMessages">Pre-defined Messages</NavLink>
                    </Dropdown.Item>
                  }
                  {
                    <Dropdown.Item>
                      <NavLink to="/settings/discreetSubscribers">Discreet Subscribers</NavLink>
                    </Dropdown.Item>
                  }
                  <Dropdown.Item onClick={this.logout}>
                    Logout
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </Menu.Item>
          </Menu.Menu>
        </Menu>
      </div>
    ) : <div/>
  }
}

const mapStateToProps = state => ({
  user: state.auth.user,
  isAuthenticated: state.auth.isAuthenticated,
  statuses: state.alarm.statuses,
  groupStatuses: state.alarm.groupStatuses,
  activities: state.location.activities,
  individualCalls: state.communication.individualCalls
})

const mapDispatchToProps = dispatch => bindActionCreators({
  stopTimer,
  logoutUser,
  navigateToLogin: () => push('/')
}, dispatch)

Header.propTypes = propTypes

export default connect(
  mapStateToProps, mapDispatchToProps, null, {
    pure: false
  }
)(Header)
