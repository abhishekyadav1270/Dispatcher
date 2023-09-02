/**
 *  Component: Map
 */

import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { GOOGLE_MAPS_AP_KEY, MAP_DEFAULTS } from '../../../constants/constants'

import { showMessage } from '../../../modules/alerts' 
import { fetchAllUserLocations } from '../../../modules/actions'
import SubMenu from '../subMenu'
import GoogleMap from 'google-map-react'
import Marker from './marker'

const propTypes = {
  markers: PropTypes.array,
  fetchAllUserLocations: PropTypes.func.isRequired,
}

class Map extends React.Component {

  state = {
    center: {
      lat: MAP_DEFAULTS.latitude,
      lng: MAP_DEFAULTS.longitude
    },
    zoom: MAP_DEFAULTS.zoom,
  }

  componentDidMount = async () => {
    const {fetchAllUserLocations, showMessage, markers} = this.props
    if(!markers.length) {
      const res = await fetchAllUserLocations()
      if(res.type !== 'success'){
        showMessage(res)
      }
    }
  }

  filterMarkers = () => {
    const {markers, searchText} = this.props
    if(searchText && searchText!==''){
      return markers.filter(marker => marker.fromId.indexOf(searchText)>-1)
    }
    return markers
  }

  render () {
    const {center, zoom} = this.state
    const markers = this.filterMarkers()
    return (
      <div className='full-height-width'>
        <SubMenu />
        <GoogleMap
          bootstrapURLKeys={{ key: GOOGLE_MAPS_AP_KEY }}
          defaultCenter={center}
          defaultZoom={zoom}
        >
          {
            markers.map(marker => (
              <Marker key={marker.fromId} lat={marker.latitude} lng={marker.longitude} subscriberId={marker.fromId} />
            ))
          }
        </GoogleMap>
      </div>
    )
  }
} 

const mapStateToProps = state => ({
  markers: state.location.markers,
  searchText: state.location.searchText
})

const mapDispatchToProps = dispatch => bindActionCreators({
  fetchAllUserLocations,
  showMessage
}, dispatch)

Map.propTypes = propTypes

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Map)