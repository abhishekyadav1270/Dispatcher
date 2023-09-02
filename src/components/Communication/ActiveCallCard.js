import React, { useEffect, useState, useRef } from 'react'
import { connect } from 'react-redux'

import { ContextMenu } from '../../components/commom';
import { CallAction } from '../../models/callAction';
import {
    sendGroupCallAction, sendIndividualCallAction,
    masterPTT, addMastPTT, remMastPTT,
    setCallasCurrent,
    initiatePatchCall, addCallToPatch, addAckEmergencyCallStatus, initiateMergeCall, addCallToMerge,
} from '../../modules/communication';
import { getCallAction, getCallActionState, getCallName, getPriority, getCallieIdToShow } from '../../utils/lib';

const ActiveCallCard = ({
    data, contactList, user, dial,
    isAmb, isBrd, isEmg, initMptt,
    sendGroupCallAction, sendIndividualCallAction,
    masterPTT, addMastPTT, remMastPTT,
    setCallasCurrent, currentCall,
    initiatePatchCall, addCallToPatch, patchCallType, initPatch, addAckEmergencyCallStatus, mergeCallType, initMerge, initiateMergeCall, addCallToMerge, disableOptionForMergePatchCall
}) => {

    //Speaking party / call action
    const [callAction, setCallAction] = useState('');
    const [colorReqd, setColor] = useState(false);
    const [isMptt, setifMptt] = useState(false);
    const [isPatchable, setPatchable] = useState(false);
    const [isPatching, setPatching] = useState(false);
    const [isMergable, setMergable] = useState(false);
    const [isMerging, setMerging] = useState(false);
    const [msg, setMsg] = useState('Trying...');
    const [actionItem, setAction] = useState({
        hold: false,
        mic: true,
        speaker: true,
        ptt: false,
        ispttTick: false,
        disconnectDis: false,
        holdDis: false,
        micDis: false,
        speakerDis: false,
        pttDis: false,
        pttReq: false,
    });
    const videoRef = useRef();
    const [videocall, setVideoCall] = useState(false);
    const [onProcessState, setOnProcessState] = useState(true);
    
    const getCallieName = (id) => {
        //const callerId = getCallieIdToShow(id)
        const subDetails = contactList.filter(cont =>
            //getCallieIdToShow(cont.mcptt_id) === callerId
            cont.mcptt_id == id
        );
        if (subDetails.length > 0) return subDetails[0].contactName
        else return getCallieIdToShow(id)
    }

    useEffect(() => {
        console.log('active call card .... effect', data, data.actionItem)
        const callState = getCallAction(data.stateType);
        const actionItem = data.actionItem;
        setAction(data.actionItem)
        if (data.stateType === 'RINGING' || data.stateType === 'TRYING' || data.stateType === 'WAITING') {
            setOnProcessState(true);
        } else {
            setOnProcessState(false);
        }
        if (dial) {
            if (data.stateType === 'RINGING') setMsg('Ringing...')
            if (data.stateType === 'TRYING') setMsg('Trying...')
            if (data.stateType === 'WAITING') setMsg('Waiting...')
        }
        if (!dial && data.actionItem['highlight']) {
            setTimeout(() => {
                const stateup = getCallActionState("DIS_HIGH", data.actionItem);
                data.actionItem = stateup;
                if (data.callType.includes('GROUP')) sendGroupCallAction(user, data)
                else sendIndividualCallAction(user, data)
            }, 200);
        }
        // console.log('TALKING',data,actionItem)
        if (callState) {
            setCallAction(callState)
            setColor(true)
        } else {
            if (data.stateType == "UNHOLD") {
                setCallAction('')
            }
        }

        if (!dial && data.talkingPartyId && data.talkingPartyId !== '0') {
            if (getCallieIdToShow(data.talkingPartyId) === getCallieIdToShow(user.profile.mcptt_id)) {
                setCallAction('You are Speaking')
                setColor(false)
                if (!data.actionItem['ptt']) {
                    updateCallAction("PTT_GRANTED")
                }
            }
            else {
                const callie = '(' + getCallieIdToShow(data.talkingPartyId) + ') is speaking!'
                setCallAction(callie);
                setColor(false)
                if (data.actionItem['ptt']) {
                    updateCallAction("PTT_IGNORED")
                }
            }
        } else if (data.talkingPartyId && data.talkingPartyId === '0') {
            if (data.stateType == "HOLD") {
                setCallAction(callState)
            } else {
                setCallAction('');
            }
            if (data.actionItem['pttReq'] || data.actionItem['ptt']) {
                updateCallAction("PTT_IGNORED")
            }
        }
        // else if (!dial && data.talkingPartyId && data.talkingPartyId === '0') {
        //     setCallAction('');
        //     if (data.actionItem['pttReq'] || data.actionItem['ptt']) {
        //         updateCallAction("PTT_IGNORED")
        //     }
        // }

        //ifAcquired by MPTT
        if (data.stateType === 'ACQUIRE_PUSH_TO_TALK') {
            if (!data.actionItem['pttReq']) {
                //updateCallAction("ACQUIRE_PUSH_TO_TALK")
            }
        }
        try {
            // if(!(actionItem['hold'] || actionItem['pttReq'])) setCallAction('')
            //if ((!data.actionItem['hold'] && data.actionItem['ptt'])) setCallAction('You are speaking')
        }
        catch (e) { console.log('CRASH actionItem: ', e, actionItem) }
        //PATCHING
        if (data.stateType === "PATCH_CALL" && !isPatching) setPatching(true);
        if (data.stateType !== "PATCH_CALL" && isPatching) setPatching(false);

        if (data.stateType === "MERGE_CALL" && !isMerging) setMerging(true);
        if (data.stateType !== "MERGE_CALL" && isMerging) setMerging(false);

        const isVideo = data.isVideo ? JSON.parse(data.isVideo) : false
        const isVideoconfig = global.config.video_call_config ? JSON.parse(global.config.video_call_config) : false
        if (data.remoteStream && isVideo && isVideoconfig) {
            const videoElement = videoRef.current;
            if (videoElement) {
                videoRef.current.srcObject = data.remoteStream;
                setVideoCall(true)
            } else {
                setVideoCall(false)
            }
        } else {
            setVideoCall(false)
        }

    }, [data])

    useEffect(() => {
        if (data.callType.includes('GROUP')) {
            if (initMptt && !isMptt) setifMptt(true);
            else if (!initMptt && isMptt) {
                setifMptt(false);
            }
        }
    }, [initMptt])

    useEffect(() => {
        if (initPatch && patchCallType === data.callType) {
            setPatchable(true)
        }
        if (!initPatch && isPatchable) setPatchable(false)
    }, [initPatch])

    useEffect(() => {
        if (initMerge && mergeCallType === data.callType) {
            setMergable(true)
        }
        if (!initMerge && isMergable) setMergable(false)
    }, [initMerge])

    const updateCallAction = (type) => {
        const call = new CallAction(data, type);
        const stateup = getCallActionState(type, data.actionItem);
        call.actionItem = stateup;
        // setAction(stateup) 
        console.log('Active Call updateCallAction..', type, call)
        if (type === 'DISCONNECTED') {
            if (user.profile.mcptt_id === data.toId) {
                if (Number(data.callPriority) === 15) {
                    addAckEmergencyCallStatus(call)
                }
            }
        }

        if (type === 'RELEASE_PUSH_TO_TALK' || type === 'ACQUIRE_PUSH_TO_TALK') {
            call.fromId = user && user.profile.mcptt_id
        }
        if (type !== 'ACQUIRE_PUSH_TO_TALK') {
            if (call.callType.includes('GROUP')) sendGroupCallAction(user, call)
            else sendIndividualCallAction(user, call)
        }
        else if (data.stateType !== 'RELEASE_PUSH_TO_TALK') {
            if (call.callType.includes('GROUP')) sendGroupCallAction(user, call)
            else sendIndividualCallAction(user, call)
        }
    };

    const getBgStyle = () => {
        try {
            if (actionItem['ptt']) {
                if (!isEmg) return { backgroundColor: 'rgb(186, 255, 184)' }
                else return { backgroundColor: '#fbc6c6' }
            }
            else if (actionItem['hold']) return { backgroundColor: '#dddddd' }
            else if (!actionItem['speaker']) return { backgroundColor: '#e3f1ff' }
            else if (isEmg) return { backgroundColor: '#fff' }
            else return { color: '#666' }
        }
        catch (e) {
            console.log('CRASH : getting Card BgClr', e)
            return {}
        }
    }

    const initMasterPTT = () => {
        masterPTT(true)
    }

    const checkMpttSelcn = (check) => {
        if (check) {
            addMastPTT(data);
            updateCallAction("PTT_TICK")
        }
        else {
            remMastPTT(data);
            updateCallAction("ENABLE")
            // setAction(getCallActionState("ENABLE",actionItem))
        }
        if (check === 'enable') {
            setAction(getCallActionState("ENABLE", actionItem))
        }
    }

    const Priority = getPriority(parseInt(data.callPriority));
    const callieId = data.fromId === (user && user.profile.mcptt_id) ? data.toId : (data.groupId || data.fromId);
    let Name = getCallieName(callieId)
    const showCallieId = getCallieIdToShow(data.fromId)
    let isCalled = data.fromId === (user && user.profile.mcptt_id) ? true : false;
    const callTypeName = getCallName(data.callType);
    const isCurrent = (currentCall && currentCall.length) ? currentCall[0].callId.includes(data.callId) : false;
    const isPatched = isPatchable && actionItem['isPatchTick'];
    const isMerged = isMergable && actionItem['isMergeTick'];
    const divMain = videocall === true ? "act-grp-card-video-background" : "act-grp-card-audio-background"
    if (global.config.activatedFA && global.config.activatedFA.length > 0) {
        if (data.fromId === global.config.activatedFA) {
            isCalled = true
            Name = data.toId
        }
    }
    if (data.forwardedId && data.forwardedId.length > 0) {
        Name = Name + ' -> ' + getCallieIdToShow(data.forwardedId);
    }
    /*
    style={actionItem['ispttTick'] && !actionItem['ptt'] && initMptt ? { cursor: 'pointer', opacity: '0.6' }
                    : (initPatch && !isPatchable) ? { pointerEvents: 'none', opacity: '0.6' } : getBgStyle()}

                    <span class="f-subs-name dark">{Name}</span>
    */
    return (
        <div ref={videoRef} class={divMain + (actionItem['highlight'] || isCurrent ? " highlight" : "") + (isPatched || isMerged ? " highlightPatch" : "")}
            style={actionItem['highlight'] || isCurrent ? { backgroundColor: '#baffb7' } : { backgroundColor: '' }}
        >
            {
                videocall === true ?
                    <div className='act-grp-card-video'>
                        <video ref={videoRef} autoPlay className='act-grp-video' />
                    </div>
                    : null
            }
            <div
            >
                <ContextMenu
                    id={data.indexId + Name}
                    subr={callieId} type={'AC'}
                    setMptt={initMasterPTT}
                    setCurrent={() => setCallasCurrent(data, true)}
                    pttOpt={true}
                    callType={data.callType}
                    initPatch={() => initiatePatchCall(data)}
                    addToPatch={() => addCallToPatch(data)}
                    initMerge={() => initiateMergeCall(data)}
                    addToMerge={() => addCallToMerge(data)}
                    disableCallPatchMerge={disableOptionForMergePatchCall ? true : false}
                    onProcessState={onProcessState}
                >
                    <div class={isEmg ? "act-card-grid-emg" : "act-card-grid"}
                        style={actionItem['ispttTick'] && !actionItem['ptt'] && initMptt ? { cursor: 'pointer', opacity: '0.6' }
                            : (initPatch && !isPatchable) ? { pointerEvents: 'none', opacity: '0.6' } : getBgStyle()}
                    >
                        {isMptt && !actionItem['ptt'] ? <input class="act-checkbox" type="checkbox" checked={actionItem['ispttTick']} onChange={(e) => checkMpttSelcn(e.target.checked)} /> : null}
                        <span class="act-name f-subs-name dark">{Name}</span>

                        {/* <div class="act-id">
                    <p class="f-subs-id">{showCallieId}</p>
                </div> */}
                        <div class="act-status">
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
                                <span class="f-status" style={colorReqd || isPatching ? { color: '#078041', fontWeight: 'bold' } : {}}>
                                    {!isPatching ? callAction : 'Patching...'}
                                </span>
                            </p>
                        </div>
                        <div class="act-icon">
                            <p class="f-status in-blc mr-8">
                                <strong>{Priority}</strong>
                            </p>
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

                        {/* <ContextMenu id={data.indexId+data.fromId} subr={callieId} type={'PTT'} Class="act-ptt"> */}
                        <div class="act-ptt">
                            <button
                                type="button"
                                onClick={() => actionItem['ptt'] ? updateCallAction("RELEASE_PUSH_TO_TALK") : updateCallAction("ACQUIRE_PUSH_TO_TALK")}
                                class={("btn w100 h100 " + (!isEmg ? "ptt " : "emergency-ptt ")) + (isAmb || isBrd ? 'amb' : !actionItem['pttReq'] ? (actionItem['ptt'] ? 'active' : actionItem['pttDis'] ? 'inactive' : '') : 'req')}
                                data-toggle="button"
                                aria-pressed="false"
                                style={actionItem['pttDis'] || dial || isAmb || isBrd ? { pointerEvents: 'none' } : {}}
                            >
                                {!(isAmb || isBrd) ?
                                    <React.Fragment>
                                        <img src="/assets/images/Vector-4.svg" alt='' />
                                        <p class="white m-t-4"><strong>PTT</strong></p>
                                    </React.Fragment>
                                    :
                                    <React.Fragment>
                                        <img src={`/assets/images/${isAmb ? 'listening' : 'broadcast'}.svg`} alt='' />
                                        <p class="white m-t-4"><strong>{isAmb ? 'AMB' : 'BRD'}</strong></p>
                                    </React.Fragment>}
                            </button>
                        </div>
                        {/* </ContextMenu> */}
                        <div class="act-discon">
                            <button
                                class="discon w100 h100"
                                onClick={() => updateCallAction("DISCONNECTED")}
                                type="button"
                                name=""
                                style={actionItem['disconnectDis'] ? { pointerEvents: 'none' } : {}}
                            >
                                <img
                                    src={`/assets/images/${actionItem['disconnectDis'] ? 'dis_disconnect' : 'Vector-3'}.svg`}
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
                                onClick={() => actionItem['hold'] ? updateCallAction("UNHOLD") : updateCallAction("HOLD")}
                                style={dial ? { pointerEvents: 'none', color: '#078041' } : actionItem['holdDis'] ? { pointerEvents: 'none', color: '#757575' } : {}}
                            >
                                {dial ? msg
                                    : <img src={`/assets/images/${actionItem['holdDis'] ? 'hold_disabled' : actionItem['hold'] ? 'unhold' : 'hold'}.svg`} alt='' />}
                            </button>
                        </div>
                        {!dial ?
                            <div class="act-mut">
                                <button
                                    onClick={() => !actionItem['speaker'] ? updateCallAction("UNMUTE_SPEAKER") : updateCallAction("MUTE_SPEAKER")}
                                    data-toggle="button"
                                    aria-pressed="false"
                                    class="btn mut_btn w100 h100 brd_0"
                                    style={actionItem['speakerDis'] ? { pointerEvents: 'none' } : {}}
                                >
                                    <img src={`/assets/images/${actionItem['speakerDis'] ? 'muted' : !actionItem['speaker'] ? 'mutePressed' : 'Group'}.svg`} alt='' />
                                </button>
                            </div>
                            : null}
                    </div>
                </ContextMenu>
            </div>
        </div>

    )
}

const mapStateToProps = ({ auth, communication }) => {
    const { user } = auth;
    const { contactList, initMptt, currentCall, patchCallType, initPatch, mergeCallType, initMerge } = communication;
    return {
        user, contactList, initMptt, currentCall, patchCallType, initPatch, mergeCallType, initMerge
    };
};

export default connect(mapStateToProps, {
    sendGroupCallAction, sendIndividualCallAction,
    masterPTT, addMastPTT, remMastPTT,
    setCallasCurrent,
    initiatePatchCall, addCallToPatch, addAckEmergencyCallStatus,
    initiateMergeCall, addCallToMerge
})(ActiveCallCard)
