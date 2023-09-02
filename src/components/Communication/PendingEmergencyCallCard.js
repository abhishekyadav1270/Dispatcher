import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux'
import './comunication.css'
import { getCallName, getCallieIdToShow } from '../../utils/lib';
import { sendAckEmergencyCall } from '../../modules/communication';

const PendingEmergencyCallCard = ({ data, contactList, user, sendAckEmergencyCall }) => {

    const getCallieName = (id) => {
        //const callerId = getCallieIdToShow(id)
        const subDetails = contactList.filter(cont =>
            //cont.mcptt_id.includes(callerId)
            //getCallieIdToShow(cont.mcptt_id) === callerId
            cont.mcptt_id == id
        );
        if (subDetails.length > 0) return subDetails[0]
        else return id
    }

    const updateCallAction = () => {
        sendAckEmergencyCall(data)
    }

    const callieId = data.groupId ? data.groupId : data.fromId
    const Name = getCallieName(callieId).contactName;
    const isMax = Name && Name.length > 10 ? true : false;
    const isCalled = data.fromId === (user && user.profile.mcptt_id) ? true : false;
    const callTypeName = getCallName(data.callType);
    const getFromId = () => {
        if (callTypeName == 'Group') {
            if (data.fromId) {
                return getCallieIdToShow(data.fromId)
            }
        }
        return ''
    }
    return (
        <div
            class="act-ack-card-grid-emg m-t-5"
            style={
                { backgroundColor: '#fbc6c6' }
            }
        >
            <div class="act-name">
                <span class={"f-subs-name dark" + (isMax ? "f-14" : "")}>{Name}</span>
            </div>
            <div class="act-id">
                <p class="f-subs-id">{getFromId()}</p>
            </div>
            <div class="act-icon">
                <p class="f-status in-blc mr-8"><strong>EMG</strong></p>
                {/* <i class="feather icon-alert-triangle f-12 red-7"></i> */}
                <img
                    class="in-blc x10"
                    src={`/assets/images/${isCalled ? 'outgoing' : 'incoming'}.svg`}
                    alt=''
                />
            </div>
            <div class="act-call">
                <p class="f-status in-blc m-l-15">
                    <strong>{callTypeName + '(' + getCallieIdToShow(callieId) + ')' + (isCalled ? ' (OUT)' : ' (IN)')}</strong>
                </p>
            </div>
            <div class="act-ack">
                <button
                    class="btn w100 h100"       //"ackBtn w50 h50"
                    onClick={() => updateCallAction("Acknowledge")}
                    type="button"
                    name=""
                    style={{ pointerEvents: 'auto', backgroundColor: 'orange' }}
                >
                    {/* <img
                        src={`/assets/images/ackEm.png`}
                        id="w-node-5470f4d863f4-c405450c"
                        alt=""
                    /> */}
                    <p class="white m-t-4"><strong>ACK</strong></p>
                </button>
            </div>
        </div>
    )
}

const mapStateToProps = ({ auth, communication }) => {
    const { user } = auth;
    const { contactList } = communication;
    return {
        user, contactList
    };
};

export default connect(mapStateToProps, { sendAckEmergencyCall })(PendingEmergencyCallCard)
