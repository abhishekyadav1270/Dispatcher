import React, { useState, useEffect } from 'react'
import EditLocIcon from '@material-ui/icons/EditLocationSharp';
import DeleteIcon from '@material-ui/icons/Delete';
import { connect } from "react-redux";

import {
  Button
} from '@material-ui/core'
const EntityListItem = (props) => {
  const POIdata = props.item
  const deletePOI = props.deletePOI

  const { POIHighlight, fenceHighlight, index } = props;

  const isSelected = () => {
    let layerType = POIdata.layerType;
    if (layerType == 'POI') {
      if (index == POIHighlight)
        return true;
    }
    if (layerType == 'fence') {
      if (index == fenceHighlight)
        return true;
    }
    return false;
  }
  const colorSelected = isSelected() ? '#FF0000' : 'grey'

  return (
    <div style={{
      alignItems: 'center',
      justifyContent: 'flex-start', marginTop: 8, borderRadius: 8, width: '100%',
      display: 'flex', flexDirection: 'row', backgroundColor: colorSelected, paddingTop: 10, paddingBottom: 10
    }}
      onClick={() => { props.onClick(POIdata) }} >
      <label style={{ flex: 1, paddingLeft: 10 }}
      // onClick={() => {props.onClick(POIdata)}}
      >{POIdata.title} </label>
      <div style={{ display: 'flex', flexDirection: "column", alignItems: "center" }}>
        <label >
          {POIdata.activeUserCount ? POIdata.activeUserCount : "-"}
        </label>
        <label style={{ fontSize:"11px" }}>Users</label>
      </div>
      <div style={{ display: 'flex', flexDirection: 'row', flex: 0.2, justifyContent: 'flex-end', paddingRight: 5 }}>
        <EditLocIcon style={{ paddingLeft: 10, marginRight: "5px", height: "30px", width: "30px" }} onClick={() => props.editPOI(POIdata)} />
        <DeleteIcon style={{ paddingLeft: 10, marginRight: 16, height: "30px", width: "30px" }} onClick={() => deletePOI(POIdata)} />
      </div>

    </div>
  )
}
const mapStateToProps = ({ location }) => {
  const { fenceHighlight, POIHighlight } = location;

  // console.log('zoomLevel and mapCenterPosition', zoomLevel, mapCenterPosition)
  return {
    fenceHighlight,
    POIHighlight
  };
};
// export default EntityListItem
export default connect(mapStateToProps, null)(EntityListItem);