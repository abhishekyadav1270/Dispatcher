/* global google */
import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import {
  withScriptjs,
  withGoogleMap,
  GoogleMap,
  OverlayView,
  Polygon
} from 'react-google-maps'
import DrawingManager from "react-google-maps/lib/components/drawing/DrawingManager"
import { Confirm, Icon } from 'semantic-ui-react'

import { removeFence } from '../../../modules/actions' 
import { showMessage } from '../../../modules/alerts'
import { MAP_DEFAULTS } from '../../../constants/constants'
import Marker from './marker'

const propTypes = {
  removeFence: PropTypes.func.isRequired,
  showMessage: PropTypes.func.isRequired
}

class Map extends React.Component {

  state = {
    selectedFence: null,
    isDeleteClicked: false,
    editableFence: null,
    zoom: MAP_DEFAULTS.zoom,
    center: {
      lat: MAP_DEFAULTS.latitude,
      lng: MAP_DEFAULTS.longitude
    },
    map: {
      drawingMode: null
    }
  }

  showConfirm = fenceId => this.setState({ selectedFence: fenceId, isDeleteClicked: true })
  handleDelete = fenceId => this.removeFence(fenceId)
  handleCancel = () => this.setState({ isDeleteClicked: false })

  componentDidMount () {
  }

  removeFence = async (id) => {
    const {removeFence, showMessage} = this.props
    const res = await removeFence(id)
    showMessage(res)
    this.setState({ isDeleteClicked: false })
  }

  fenceClicked = (fenceId) => {
    // this.setState({selectedFence: fenceId})
  }

  editFence = (fence) => {
    // this.setState({editableFence: fence.id})
    // this.props.editingFence(fence)
  }

  render() {
    const {zoom, center, selectedFence, editableFence, isDeleteClicked, map} = this.state
    const {markers, doneDrawing, fences} = this.props
    return (
      <GoogleMap
        defaultZoom={zoom}
        center={center}
      >
        {
          fences.map((fence, i) => (
            <Polygon 
              key={fence.id}
              path={fence.geoFenceCoordinates}
              onClick={() => this.fenceClicked(fence.id)}
              options={{
                strokeColor: editableFence===fence.id ? 'black' : fence.color,
                strokeOpacity: 0.8,
                strokeWeight: 2,
                fillColor: editableFence===fence.id ? 'black' : fence.color,
                fillOpacity: 0.35,
                clickable: true,
                editable: editableFence===fence.id
              }}
            />
          ))
        }
        {
          // delete icon
          fences.map((fence, i) => (
            <OverlayView
              position={fence.geoFenceCoordinates[0]}
              mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}
            >
              <span>
                <Icon style={{background: fence.color}} className='delete-icon' circular name='trash alternate outline' onClick={() => this.showConfirm(fence.id)} />
                  {
                    selectedFence===fence.id && <Confirm
                      size='mini'
                      open={isDeleteClicked}
                      header={`Remove '${fence.name}' fence`}
                      onCancel={this.handleCancel}
                      onConfirm={() => this.handleDelete(fence.id)}
                      />
                  }
              </span>
            </OverlayView>
          ))
        }
        {
          // title
          fences.map((fence, i) => (
            <OverlayView
              position={fence.geoFenceCoordinates[0]}
              mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}
            >
              <span style={{background: fence.color}} className='title'>
                {fence.name}
              </span>  
            </OverlayView>
          ))
        }
        <DrawingManager
            defaultDrawingMode={map.drawingMode}
            defaultOptions={{
              drawingControl: true,
              drawingControlOptions: {
                position: google.maps.ControlPosition.TOP_CENTER,
                drawingModes: [
                  google.maps.drawing.OverlayType.POLYGON,
                ],
              }
            }}
            onPolygonComplete={doneDrawing}
          />
        {
          markers.map(marker => (
            <OverlayView
              position={{lat: marker.latitude, lng: marker.longitude}}
              mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}
            >
              <Marker key={marker.fromId} subscriberId={marker.fromId} />
            </OverlayView>
          ))
        }
      </GoogleMap>
    )
  }
}


const mapDispatchToProps = dispatch => bindActionCreators({
  removeFence,
  showMessage
}, dispatch)

Map.propTypes = propTypes

export default connect(
  null,
  mapDispatchToProps
)(withScriptjs(withGoogleMap(Map)))