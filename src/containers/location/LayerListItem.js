import React, { useState, useEffect } from 'react'
import DeleteIcon from '@material-ui/icons/Delete';
import {  Button } from '@material-ui/core'
import EditLocIcon from '@material-ui/icons/EditLocationSharp';

const LayerListItem = (props) => {
    const data = props.item
    const deleteHandler = props.deleteHandler
    const editHandler =props.editHandler
    const bgColor = props.bgColor
  const itemIndex= props.itemIndex
  
    return (
      <div style={{
        alignItems: 'center',
        justifyContent: 'flex-start', marginTop: 8, borderRadius: 8, width: '100%', display: 'flex', flexDirection: 'row', backgroundColor: bgColor, paddingTop: 10, paddingBottom: 10
      }}>
        <label style={{ flex: 1, paddingLeft: 10 }} onClick={() => {
          props.onClick(data,itemIndex)
        }}>{data.title} </label>
       
        <div style={{ display: 'flex', flexDirection: 'row', flex: 0.2, justifyContent: 'flex-end', paddingRight: 5 }}>
        
        <Button style={{ width: '20px' }} onClick={() => editHandler(data)}>
          <EditLocIcon />
        </Button>
          <Button style={{ width: '20px' }} onClick={() => deleteHandler(data)}>
            <DeleteIcon />
          </Button>
        </div>
  
      </div>
    )
  }
  export default LayerListItem;