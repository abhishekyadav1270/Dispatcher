/**
 *  Component: SnailTrail
 */

import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import GoogleMap from 'google-map-react'

import { GOOGLE_MAPS_AP_KEY, MAP_DEFAULTS } from '../../../constants/constants'
import { showMessage } from '../../../modules/alerts' 
import { fetchSnailTrails } from '../../../modules/actions'
import SubMenu from '../subMenu'
import Marker from './marker'

import '../../../styles/snailTrail.scss'

const propTypes = {
  user: PropTypes.object,
  snailTrails: PropTypes.array,
  fetchSnailTrails: PropTypes.func.isRequired,
  showMessage: PropTypes.func.isRequired
}

class SnailTrail extends React.Component {

  state = {
    center: {
      lat: MAP_DEFAULTS.latitude,
      lng: MAP_DEFAULTS.longitude
    },
    zoom: MAP_DEFAULTS.zoom,
  }

  componentDidMount = async () => {
    const {fetchSnailTrails, showMessage, snailTrails, user} = this.props
    if(!snailTrails.length) {
      const res = await fetchSnailTrails(user)
      if(res.type !== 'success'){
        showMessage(res)
      }
    }
  }

  filterSnailTrails = () => {
    const {snailTrails, searchText} = this.props
    if(searchText && searchText!==''){
      return snailTrails.filter(st => st.subscriberId.indexOf(searchText)>-1)
    }
    return snailTrails
  }

  render () {
    const {center, zoom} = this.state
    const snailTrails = this.filterSnailTrails()
    return (
      <div id="snail-trail" className='full-height-width'>
        <SubMenu />
        <GoogleMap
          bootstrapURLKeys={{ key: GOOGLE_MAPS_AP_KEY }}
          defaultCenter={center}
          defaultZoom={zoom}
        >
          {
            snailTrails.map((snailTrail, i) => (
              snailTrail.snailTrailActivities.map((location, j) => (
                (j < snailTrail.snailTrailActivities.length-1) ? 
                  (
                    <div 
                      key={j} 
                      className={"trail " + (j===0 && 'circle')}
                      style={{borderColor: snailTrail.color}}
                      lat={location.latitude} 
                      lng={location.longitude} 
                    >
                    </div>
                  ) :
                  (
                    <Marker key={j} text={snailTrail.subscriberId} color={snailTrail.color} lat={location.latitude} lng={location.longitude} snailTrailId={snailTrail.id} />
                  )
              ))
            ))
          }
        </GoogleMap>
      </div>
    )
  }
} 

const mapStateToProps = state => ({
  user: state.auth.user,
  snailTrails: state.location.snailTrails,
  searchText: state.location.searchText
})

const mapDispatchToProps = dispatch => bindActionCreators({
  fetchSnailTrails,
  showMessage
}, dispatch)

SnailTrail.propTypes = propTypes

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SnailTrail)