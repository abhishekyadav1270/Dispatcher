/**
 *  Component: Fence
 */
/* global google */
import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { Input, Button } from 'semantic-ui-react'

import Map from './map'
import Activity from './activity'
import { GOOGLE_MAPS_AP_KEY } from '../../../constants/constants'
import { showMessage } from '../../../modules/alerts' 
import { fetchAllUserLocations, fetchFences, addFence } from '../../../modules/actions'
import FenceModel from '../../../models/location'
import Loader from '../../../components/loader'
import SubMenu from '../subMenu'

import '../../../styles/location.scss'
import '../../../styles/fence.scss'

const googleMapURL = `https://maps.googleapis.com/maps/api/js?libraries=geometry,drawing&key=${GOOGLE_MAPS_AP_KEY}`;

const propTypes = {
  user: PropTypes.object,
  markers: PropTypes.array,
  fences: PropTypes.array,
  fetchAllUserLocations: PropTypes.func.isRequired,
  fetchFences: PropTypes.func.isRequired,
  addFence: PropTypes.func.isRequired,
  showMessage: PropTypes.func.isRequired
}

class Fence extends React.Component {

  state = {
    fence: null,
    previousFence: null,
    currentFence: new FenceModel(),
    isPolygonComplete: false
  }

  componentDidMount = async () => {
    const {fetchFences, fetchAllUserLocations, showMessage, user, markers, fences} = this.props
    let res
    if(!markers.length) {
      res = await fetchAllUserLocations()
      if(res.type !== 'success'){
        showMessage(res)
      }
    }
    if(!fences.length) {
      res = await fetchFences(user)
      if(res.type !== 'success'){
        showMessage(res)
      }
    }
  }

  toggleDrawingMode = () => {
    // drawingManager.setDrawingMode(google.maps.drawing.OverlayType.POLYGON)
  }

  doneDrawing = (polygon) => {
    if (this.state.previousPolygon) {
      this.state.previousPolygon.setMap(null);
    }
    try{
      let polygonVertices = []
      polygon.getPath().getArray().forEach((vertex, i) => {
        polygonVertices.push({vertex: i, lat: vertex.lat(), lng: vertex.lng()})
      })
      this.setState({
        isPolygonComplete: true, 
        currentFence: {
          ...this.state.currentFence, 
          geoFenceCoordinates: polygonVertices
        },
        fence: new google.maps.Polygon({
          paths: polygon.getPaths()
        }),
        previousPolygon: polygon
      })
    } catch (e) {}
  }

  onChange = (e) => {
    this.setState({
      currentFence: {
        ...this.state.currentFence, 
        [e.target.name]: e.target.value
      }
    })
  }

  addFence = async () => {
    let {currentFence} = this.state
    const {addFence, fetchFences, showMessage, user, markers} = this.props
    currentFence.encircledSubscribers = []
    markers.forEach(marker => {
      if(google.maps.geometry.poly.containsLocation(new google.maps.LatLng(marker.latitude, marker.longitude), this.state.fence)){
        currentFence.encircledSubscribers.push(marker.fromId)
      }
    })
    const resAdd = await addFence(user, currentFence)
    showMessage(resAdd)
    if(resAdd.type === 'success'){
      this.cancel()
      const resFetch = await fetchFences(user)
      if(resFetch.type !== 'success'){
        // todo?
        showMessage(resFetch)
      }
    }
  }

  cancel = () => {
    this.setState({isPolygonComplete: false, currentFence: new FenceModel()})
    if (this.state.previousPolygon) {
      this.state.previousPolygon.setMap(null);
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
    const {currentFence, isPolygonComplete} = this.state
    const {fences} = this.props
    const markers = this.filterMarkers()

    return (
      <div id="fence" className='full-height-width'>
        <SubMenu />
        {
          /*
          <Button 
            className='add-btn' 
            size='tiny'
            floated='right' 
            onClick={this.toggleDrawingMode.bind(this)}
            secondary>
            <Icon name='add' />Add New Fence
          </Button>
          */
        }
        <Map 
          googleMapURL={googleMapURL}
          loadingElement={
            <Loader />
          }
          containerElement={
            <div style={{ height: '100vh', width: '100%' }} />
          }
          mapElement={
            <div style={{ height: '100vh', width: '100%' }} />
          }
          markers={markers}
          fences={fences}
          cancel={this.cancel.bind(this)}
          doneDrawing={this.doneDrawing.bind(this)}
        />
        {
          isPolygonComplete &&   
            <div className="action-items">
              <Input value={currentFence.name} name="name" onChange={this.onChange} placeholder='Enter fence name' /><br/><br/>
              <Button disabled={currentFence.name===''} color="orange" content="Track" onClick={this.addFence} />
              <Button content="Cancel" onClick={this.cancel} />
            </div>
        }
        {
          <Activity />
        }
      </div>
    )
  }
} 

const mapStateToProps = state => ({
  user: state.auth.user,
  fences: state.location.fences,
  searchText: state.location.searchText,
  markers: state.location.markers
})

const mapDispatchToProps = dispatch => bindActionCreators({
  fetchAllUserLocations,
  fetchFences,
  addFence,
  showMessage
}, dispatch)

Fence.propTypes = propTypes

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Fence)