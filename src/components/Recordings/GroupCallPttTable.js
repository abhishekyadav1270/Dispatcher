import React, { useEffect, useState } from 'react'
import GroupCallPttTableRow from './GroupCallPttTableRow';
import { Typography } from '@material-ui/core';
import { EndPoints } from '../../MCXclient/endpoints';
import axios from 'axios';
import { durationInSeconds } from './definedFunction';
import './player.css'

const GroupCallPttTable = (props) => {
    const { callStartTime, callId, seekHandler} = props;
    const [eventData, setEventData] = useState([]);
    console.log("---starttime func---",callStartTime);
    const pttRowOnClickHandler=(eventTime)=>{
        console.log("ptt row clicked",eventTime);
        seekHandler(durationInSeconds(callStartTime,eventTime));
    }
    useEffect(()=>{
        let params = {
            callId,
            eventType:["FloorGrantedMessage","CallLegDestroyed", "NewCallLegAdded"]
        }
        axios.post(EndPoints.getConfig().getPTTEvents,params)
        .then((res)=>{
            if(res.data){
                console.log("ptt event res ",res.data)
                setEventData(res.data)
                console.log("Ptt event data ",eventData,callStartTime);
            }
        })
        .catch((err)=>{
            console.log("error in fetching ptt event--",err);
        })
    },[]);
    return (
        <div className='w-100'>
            {/* <div className="pttTable-row-grid-head"> */}
                <Typography variant="h6" className='color-white'>Event Table</Typography>
            {/* </div> */}
            <div className="pttTable-row-grid-head">
                {/* <div class="ptt-tb-callid  ">
                    <span>Call Id</span>
                </div> */}
                <div class="ptt-tb-eventtype ">
                    <span>Event Type</span>
                </div>
                <div class=" ptt-tb-eventtime  ">
                    <span>Event Time</span>
                </div>
                {/* <div class="ptt-tb-ua train-cell-center">
                    <span>UA</span>
                </div>
                <div class="ptt-tb-usertype train-cell-center">
                    <span>User Type</span>
                </div>
                <div class="ptt-tb-ueid train-cell-center">
                    <span>UeId</span>
                </div> */}
                <div class="ptt-tb-displayName">
                    <span>User</span>
                </div>
                <div class="ptt-tb-mcpttid ">
                    <span>McpttId</span>
                </div>
            </div>
            <div style={{ height: "22vh", overflowY: "scroll"}}>
                { eventData  && Array.isArray(eventData) && eventData.map((data,idx) => {
                    return (
                        <div className="pttTable-row-grid" onClick={()=>pttRowOnClickHandler(data.eventTime)}>
                            < GroupCallPttTableRow  data={data} key={idx} callStartTime={callStartTime}/>
                        </div>
                    );
                }
                )}
            </div>
        </div>
    )
}

export default GroupCallPttTable