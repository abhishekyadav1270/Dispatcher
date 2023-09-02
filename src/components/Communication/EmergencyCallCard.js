import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux'

import './comunication.css'
import { ContextMenu } from '../../components/commom';
import { getCallAction, getCallName, getPriority, getCallActionState, getCallieIdToShow } from '../../utils/lib';
import { sendGroupCallAction, sendIndividualCallAction, addAckEmergencyCallStatus } from '../../modules/communication';
import { CallAction } from '../../models/callAction';
import { subscriberType } from '../../constants/constants';

const EmergencyCallCard = ({ data, contactList, dial, sendGroupCallAction, sendIndividualCallAction, addAckEmergencyCallStatus, user }) => {
    const [isactive, setActive] = useState(false);
    const [disconnect, setDisconnect] = useState(true);
    const [ptt, setPTT] = useState(false);
    const [ismute, setMute] = useState(false);
    const [ishold, setHold] = useState(false);
    //DISABLE
    const [ismuteDis, setMuteDis] = useState(false);
    const [disconnectDis, setDisconnectDis] = useState(false);
    const [isholdDis, setHoldDis] = useState(false);
    const [pttDis, setPTTDis] = useState(false);
    //Speaking party / call action
    const [callAction, setCallAction] = useState('');
    const [colorReqd, setColor] = useState(false);

    useEffect(() => {
        const callState = getCallAction(data.stateType);
        if (callState) {
            setCallAction(callState)
            setColor(true)
        }
        else if (data.talkingPartyId && data.talkingPartyId !== '0') {
            if (getCallieIdToShow(data.talkingPartyId) === getCallieIdToShow(user.profile.mcptt_id)) {
                setCallAction('You are Speaking')
                setColor(false)
            }
            else {
                const callie = getCallieIdToShow(data.talkingPartyId) + ' is speaking!'
                setCallAction(callie);
                setColor(false)
            }
        }
        else setCallAction('')
    }, [data])

    const getCallieName = (id) => {
        //const callerId = getCallieIdToShow(id)
        const subDetails = contactList.filter(cont =>
            //getCallieIdToShow(cont.mcptt_id) === callerId
            cont.mcptt_id == id
        );
        if (subDetails.length > 0) return subDetails[0]
        else return getCallieIdToShow(id)
    }

    const updateCallAction = (type) => {
        switch (type) {
            case "ACQUIRE_PUSH_TO_TALK":
                setPTT(true);
                break;
            case "RELEASE_PUSH_TO_TALK":
                setPTT(false);
                break;
            case "MUTE_SPEAKER":
                setMute(true);
                setHoldDis(true);
                setDisconnectDis(true);
                setPTTDis(true);
                break;
            case "UNMUTE_SPEAKER":
                setMute(false);
                setHoldDis(false);
                setDisconnectDis(false);
                setPTTDis(false);
                break;
            case "HOLD":
                setHold(true);
                setDisconnectDis(true);
                setMuteDis(true);
                setPTTDis(true);
                break;
            case "UNHOLD":
                setHold(false);
                setDisconnectDis(false);
                setMuteDis(false);
                setPTTDis(false);
                break;
            case "DISCONNECTED":
                setDisconnect(false);
                break;
            default:
                setMute(false);
                setHold(false);
                break;
        }
        const call = new CallAction(data, type);
        const stateup = getCallActionState(type, data.actionItem);
        call.actionItem = stateup;

        if (type === 'DISCONNECTED') {
            if (Number(data.callPriority) === 15) {
                addAckEmergencyCallStatus(call)
            }
        }
        if (call.callType.includes('GROUP')) {
            sendGroupCallAction(user, call)
        }
        else {
            sendIndividualCallAction(user, call)
        }
    };

    const Priority = getPriority(parseInt(data.callPriority));
    const callieId = data.fromId === (user && user.profile.mcptt_id) ? data.toId : data.fromId;
    const showCallieId = getCallieIdToShow(callieId)
    let Name = getCallieName(callieId).contactName;
    const isMax = Name && Name.length > 10 ? true : false;
    let isCalled = data.fromId === (user && user.profile.mcptt_id) ? true : false;
    const callTypeName = getCallName(data.callType);
    if (global.config.activatedFA && global.config.activatedFA.length > 0) {
        if (data.fromId === global.config.activatedFA) {
            isCalled = true
            Name = data.toId
        }
    }
    return (
        <div
            class="act-card-grid-emg"
            style={
                ismute
                    ? { backgroundColor: '#e3f1ff' }
                    : isactive
                        ? { backgroundColor: 'rgb(186, 255, 184)' }
                        : ishold
                            ? { backgroundColor: '#dddddd' }
                            : { backgroundColor: '#fbc6c6' }
            }
        >
            <ContextMenu id={data.indexId + data.fromId} subr={callieId} type={'AC'} Class="act-name">
                <div
                // class="act-name"
                >
                    <span class={"f-subs-name dark" + (isMax ? "f-14" : "")}>{Name}</span>
                </div>
            </ContextMenu>
            {/* <div class="act-id">
                <p class="f-subs-id">{showCallieId}</p>
            </div> */}
            <div class="act-status" >
                <div class="in-blc mr-4 lime-5">
                    <svg
                        width="8"
                        height="8"
                        viewBox="0 0 6 6"
                        class="blinking"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <circle cx="3" cy="3" r="3" fill="currentColor" />
                    </svg>
                </div>
                <p class="f-10 f-mid roboto in-blc mrg-0">
                    <span class="f-status" style={colorReqd ? { color: '#078041', fontWeight: 'bold' } : {}}>{callAction}</span>
                </p>
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
                    <strong>{callTypeName + (isCalled ? ' (OUT)' : ' (IN)')}</strong>
                </p>
            </div>
            <ContextMenu id={data.indexId + Name} subr={callieId} type={'PTT'} Class="act-ptt">
                <button
                    type="button"
                    onClick={() => ptt ? updateCallAction("RELEASE_PUSH_TO_TALK") : updateCallAction("ACQUIRE_PUSH_TO_TALK")}
                    class="btn emergency-ptt w100 h100"
                    data-toggle="button"
                    aria-pressed="false"
                    style={pttDis || dial ? { pointerEvents: 'none' } : {}}
                >
                    <img src="/assets/images/Vector-4.svg" alt='' />
                    <p class="white m-t-4"><strong>PTT</strong></p>
                </button>
            </ContextMenu>
            {/* <div
                class="act-discon"
                >
                <button 
                    class="discon w100 h100 emergency-red" 
                    type="button" 
                    name=""
                    onClick={()=> setDisconnect(false)}
                >
                    <img
                        src="/assets/images/Vector-3.svg"
                        id="w-node-5470f4d863f4-c405450c"
                        alt=""
                    />
                </button>
            </div>
            <div
                class="act-hld f-12 f-mid h_center v_center"
                >
                <button class="hld_btn emergency-red" onClick={()=> setHold(!ishold)}>
                    <i class="ion ion-md-pin f-18"></i>
                </button>
            </div>
            <div class="act-mut">
                <button class="mut_btn w100 h100 emergency-red brd_0" onClick={()=> setMute(!ismute)}>
                    <img src="/assets/images/Group.svg" alt='' />
                </button>
            </div> */}
            <div class="act-discon">
                <button
                    class="discon w100 h100"
                    onClick={() => updateCallAction("DISCONNECTED")}
                    type="button"
                    name=""
                    style={disconnectDis ? { pointerEvents: 'none' } : {}}
                >
                    <img
                        src={`/assets/images/${disconnectDis ? 'dis_disconnect' : 'Vector-3'}.svg`}
                        id="w-node-5470f4d863f4-c405450c"
                        alt=""
                    />
                </button>
            </div>
            <div class="act-hld f-12 f-mid h_center v_center">
                <button
                    class="btn hld_btn"
                    data-toggle="button"
                    aria-pressed="false"
                    onClick={() => ishold ? updateCallAction("UNHOLD") : updateCallAction("HOLD")}
                    style={dial ? { pointerEvents: 'none', color: '#078041' } : isholdDis ? { pointerEvents: 'none', color: '#757575' } : {}}
                >
                    {dial ? 'Dialing...'
                        : <img src={`/assets/images/${ishold ? 'unhold' : isholdDis ? 'hold_disabled' : 'hold'}.svg`} alt='' />}
                </button>
            </div>
            {!dial ?
                <div class="act-mut">
                    <button
                        onClick={() => ismute ? updateCallAction("UNMUTE_SPEAKER") : updateCallAction("MUTE_SPEAKER")}
                        style={ismuteDis ? { pointerEvents: 'none' } : {}}
                        data-toggle="button"
                        aria-pressed="false"
                        class="btn mut_btn w100 h100 brd_0"
                    >
                        <img src={`/assets/images/${ismuteDis ? 'muted' : ismute ? 'mutePressed' : 'Group'}.svg`} alt='' />
                    </button>
                </div>
                : null}
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

export default connect(mapStateToProps, { sendGroupCallAction, sendIndividualCallAction, addAckEmergencyCallStatus })(EmergencyCallCard)
