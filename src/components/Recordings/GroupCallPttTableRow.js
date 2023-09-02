import React, { useState } from 'react'
import { Modal as ModalBootStrap } from "react-bootstrap";
import Button from 'react-bootstrap/Button';
import { showDuration } from './definedFunction';



function GroupCallPttTableRow(props) {
    const { data , callStartTime } = props;
    console.log("groupcall ptt table Row----",data,callStartTime);
    
    return (
        <React.Fragment >
            {/* <div class=" ptt-tb-callid ">
                <span>{data.callId}</span>
            </div> */}
            <div class="ptt-tb-eventtype">
                <span>{data.eventType}</span>
            </div>
            <div class="ptt-tb-eventtime">
                <span>{showDuration(callStartTime, data.eventTime)}</span>
            </div>
            {/* <div class="ptt-tb-ua train-cell-center">
                <span>{data.userAgent}</span>
            </div>
            <div class="ptt-tb-usertype train-cell-center">
                <span>{data.userType}</span>
            </div>
            <div class="ptt-tb-ueid train-cell-center">
                <span>{data.ueId}</span>
            </div> */}
            <div class="ptt-tb-displayName">
                <span>{data.displayName}</span>
            </div>
            <div class="ptt-tb-mcpttid">
                <span>{data.mcpttId}</span>
            </div>
        </React.Fragment>
    )
}

export default GroupCallPttTableRow