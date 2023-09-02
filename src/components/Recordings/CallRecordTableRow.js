import React, { useState } from 'react'
import { Modal as ModalBootStrap } from "react-bootstrap";
import Button from 'react-bootstrap/Button';
import { changeBoolValue, showDuration,showTime } from './definedFunction';

function CallRecordTableRow(props) {
    const { data } = props;
    const showCalleeName = ()=>{
        if(data){
            if(data.calleeDisplayName)
            return data.calleeDisplayName;
            if(data.calleeMcpttIdURI)
            return data.calleeMcpttIdURI;
        }
        return ""
    }
    const showCallerName = ()=>{
        if(data){
            if(data.callerDisplayName)
            return data.callerDisplayName;
            if(data.callerMcpttId)
            return data.callerMcpttId;
        }
        return ""
    }
    const showGroupName = ()=>{
        if(data){
            if(data.displayGroupName)
            return data.displayGroupName;
            if(data.groupIdUri)
            return data.groupIdUri;
        }
        return ""
    }

    
    return (
           <React.Fragment>
            <div class=" plr-tb-clrid train-cell-center">
                <span>{showCallerName()}</span>
            </div>
            <div class="plr-tb-cleid  train-cell-center">
                <span>{showCalleeName()}</span>
            </div>
            <div class="plr-tb-groupId train-cell-center">
                <span>{showGroupName().split('@')[0]}</span>
            </div>
            <div class=" plr-tb-strtm train-cell-center">
                <span>{showTime(data.recordStartTime)}</span>
            </div>
            <div class="plr-tb-endtm train-cell-center">
                <span>{showTime(data.recordEndTime)}</span>
            </div>
            <div class="plr-tb-dur train-cell-center">
                <span>{ showDuration(data.recordStartTime,data.recordEndTime)}</span>
            </div>
            {/* <div class="plr-tb-sesstype train-cell-center">
                <span>{data.sessionType}</span>
            </div> */}
            <div class="plr-tb-calltype train-cell-center">
                <span>{data.sessionType}</span>
            </div>
            <div class="plr-tb-ansmode train-cell-center">
                <span>{data.answerMode}</span>
            </div>
            <div class="plr-tb-floorCntrl train-cell-center">
                <span>{changeBoolValue(data.floorControl)}</span>
            </div>
            {/* <div class=" plr-tb-fa train-cell-center">
                <span>{data.faCall}</span>
            </div>
            <div class="plr-tb-cad train-cell-center">
                <span>{data.cadCall}</span>
            </div> */}
        </React.Fragment>
    )
}

export default CallRecordTableRow