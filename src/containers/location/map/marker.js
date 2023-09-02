/**
 *  Component: Marker
 */

import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import ActionPopup from '../actionPopup'
import '../../../styles/location.scss'

const propTypes = {
  user: PropTypes.object.isRequired,
  snailTrails: PropTypes.array
}

class Marker extends React.Component {

  componentDidMount() {
  }

  render () {
    const {subscriberId, snailTrails} = this.props
    return (
      <div className="location-marker">
        <ActionPopup subscriberId={subscriberId} data={snailTrails} page='map' />
      </div>
    )
  }
}

const mapStateToProps = state => ({
  user: state.auth.user,
  snailTrails: state.location.snailTrails
})

const mapDispatchToProps = dispatch => bindActionCreators({
}, dispatch)

Marker.propTypes = propTypes

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Marker)