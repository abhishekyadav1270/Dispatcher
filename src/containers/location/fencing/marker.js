/**
 *  Component: Marker
 */

import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import ActionPopup from '../actionPopup'
import { showMessage } from '../../../modules/alerts' 

const propTypes = {
  user: PropTypes.object.isRequired,
  showMessage: PropTypes.func.isRequired
}

class Marker extends React.Component {

  componentDidMount() {
  }

  render () {
    const { subscriberId } = this.props
    return (
      <div className="location-marker">
        <ActionPopup subscriberId={subscriberId} page='fencing' />
      </div>
    )
  }
}

const mapStateToProps = state => ({
  user: state.auth.user
})

const mapDispatchToProps = dispatch => bindActionCreators({
  showMessage
}, dispatch)

Marker.contextTypes = {
  router: PropTypes.object.isRequired
}

Marker.propTypes = propTypes

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Marker)