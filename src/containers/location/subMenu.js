/**
 *  Component: SubMenu
 */

import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import { NavLink } from 'react-router-dom'
import { Menu, Input } from 'semantic-ui-react'

import { hasPermission } from '../../utils/lib'
import Count from '../../components/count'
import { updateSearchText } from '../../modules/actions' 
import '../../styles/subMenu.scss'

const propTypes = {
  snailTrails: PropTypes.array,
  fences: PropTypes.array,
  updateSearchText: PropTypes.func.isRequired
}

class SubMenu extends React.Component {

  state = {
    searchText: ''
  }

  onChange = (e) => {
    const {updateSearchText} = this.props
    this.setState({searchText: e.target.value})
    updateSearchText(e.target.value)
  }

  render () {
    const {user, searchText, snailTrails, activities} = this.props
    const snailTrailsCount = snailTrails.length
    const activitiesCount = activities.length
    return (
      <div className="sub-menu location">
        <Menu widths={8} pointing secondary>
          <Menu.Item as={NavLink} activeClassName='active' to="/location/map">
            Map
          </Menu.Item>
          {
            hasPermission(user, 'SNAIL_TRAIL') && 
              <Menu.Item as={NavLink} activeClassName='active' to="/location/snail-trail">
                Snail Trail <Count count={snailTrailsCount} />
              </Menu.Item>
          }
          {
            hasPermission(user, 'FENCING') && 
              <Menu.Item as={NavLink} activeClassName='active' to="/location/fencing">
                Fencing <Count count={activitiesCount} />
              </Menu.Item>
          }
        </Menu>
        <div className='search'>
          <Input icon='search' value={searchText} name='searchText' onChange={this.onChange} iconPosition='left' placeholder='Search' />
        </div>
      </div>
    )
  }
}

const mapStateToProps = state => ({
  user: state.auth.user,
  activities: state.location.activities,
  snailTrails: state.location.snailTrails,
  searchText: state.location.searchText
})

const mapDispatchToProps = dispatch => bindActionCreators({
  updateSearchText
}, dispatch)

SubMenu.propTypes = propTypes

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SubMenu)