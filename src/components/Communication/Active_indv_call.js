import React, { useEffect, useState, useRef } from 'react'
import { connect } from 'react-redux'

import { ContextMenu } from '../../components/commom';
import { getPriority, getCallAction, getCallName, getCallActionState, getCallieIdToShow } from '../../utils/lib';
import {
    sendIndividualCallAction, setCallasCurrent,
    initiatePatchCall, addCallToPatch, initiateMergeCall, addCallToMerge,
} from '../../modules/communication'
import { CallAction } from '../../models/callAction';
import { decodeCallPriority } from '../../constants/constants'

const Active_indv_call = ({
    data, contactList, user, dial, sendIndividualCallAction, isEmg, setCallasCurrent,
    patchCallType, initPatch, initiatePatchCall, addCallToPatch, radioData, mergeCallType, initMerge, initiateMergeCall, addCallToMerge, disableOptionForMergePatchCall
}) => {

    //Speaking party / call action
    const [callAction, setCallAction] = useState('');
    const [colorReqd, setColor] = useState(false);
    const [isPatchable, setPatchable] = useState(false);
    const [isPatching, setPatching] = useState(false);
    const [isMergable, setMergable] = useState(false);
    const [isMerging, setMerging] = useState(false);
    const [msg, setMsg] = useState('Trying...');
    const [actionItem, setAction] = useState({
        hold: false,
        mic: true,
        speaker: true,
        disconnectDis: false,
        holdDis: false,
        micDis: false,
        speakerDis: false
    });
    const videoRef = useRef();
    const [videocall, setVideoCall] = useState(false);
    const [onProcessState, setOnProcessState] = useState(true);

    useEffect(() => {
        console.log('individual duplex call.... effect', data);
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
                updateCallAction("DIS_HIGH")
            }, 1000);
        }
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
        if (data.stateType === "HOLD") {
            if (!data.actionItem['hold']) {
                const stateup = getCallActionState("HOLD", data.actionItem);
                setAction(stateup);
            }
        }
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
        if (initPatch && patchCallType === data.callType) {
            setPatchable(true)
        }
        if (!initPatch && isPatchable) setPatchable(false)
    }, [initPatch])

    useEffect(() => {
        console.log('init merge started..', initMerge);
        if (initMerge && mergeCallType === data.callType) {
            setMergable(true)
        }
        if (!initMerge && isMergable) setMergable(false)
    }, [initMerge])

    const getCallieName = (id) => {
        const callerId = getCallieIdToShow(id)
        const subDetails = contactList.filter(cont =>
            //cont.mcptt_id.includes(callerId)
            getCallieIdToShow(cont.mcptt_id) === callerId
        );
        if (subDetails.length > 0) return subDetails[0].contactName
        else return id
    }

    const updateCallAction = (type) => {
        const call = new CallAction(data, type);
        const stateup = getCallActionState(type, data.actionItem);
        call.actionItem = stateup;
        // console.log("UPDATE CALL ACTION", call,stateup);
        sendIndividualCallAction(user, call);
    };

    const getBgStyle = () => {
        try {
            if (actionItem['hold'] || otherCallOnHold) return { backgroundColor: '#dddddd' }
            else if (!actionItem['speaker']) return { backgroundColor: '#e3f1ff' }
            else if (isEmg) return { backgroundColor: '#fbc6c6' }
            else if (isRTTCall) return { backgroundColor: 'rgb(240, 211, 50)' }
            else return { backgroundColor: 'rgb(186, 255, 184)' }
        }
        catch (e) {
            console.log('CRASH : getting Card BgClr', e)
            return {}
        }
    }
    var trainID;
    const checkRTTCall = () => {
        const isRTTCallP = data.callPriority && decodeCallPriority(data.callPriority) === 'RTT';
        if (isRTTCallP) {
            // check train radio
            let radios = radioData.filter(radio => radio.RadioID_A == getCallieIdToShow(data.fromId) || radio.RadioID_B == getCallieIdToShow(data.fromId))
            if (radios.length > 0) {
                trainID = radios[0].trainID;
                return true
            }
        }
        return false
    }

    const Priority = getPriority(parseInt(data.callPriority));
    let callieId = data.fromId === (user && user.profile.mcptt_id) ? data.toId : data.fromId;
    let isCalled = data.fromId === (user && user.profile.mcptt_id) ? true : false;
    const showCallieId = getCallieIdToShow(callieId)
    let Name = getCallieName(callieId)
    const callTypeName = getCallName(data.callType);
    const isPatched = isPatchable && actionItem['isPatchTick'];
    const isMerged = isMergable && actionItem['isMergeTick'];
    const isRTTCall = checkRTTCall();
    console.log('isRTTCall active.....', isRTTCall)
    const isConf = data.isConfCall ? data.isConfCall : false;
    console.log('individual duplex call.... isConf', isConf)
    if (isConf) {
        Name = 'Conference Call'
    }

    if (isRTTCall) {
        Name = Name + `( RTT-${trainID} )`
    }
    if (global.config.activatedFA && global.config.activatedFA.length > 0) {
        if (data.fromId === global.config.activatedFA) {
            isCalled = true
            Name = data.toId
        }
    }
    if (data.forwardedId && data.forwardedId.length > 0) {
        Name = Name + ' -> ' + getCallieIdToShow(data.forwardedId);
    }
    const callIsOnHold = data.actionItem && data.actionItem.hold
    const divMain = videocall === true ? "act-indv-card-video-background" : "act-indv-card-audio-background"
    const otherCallOnHold = data.isCallOnHold ? data.isCallOnHold : false;

    return (
        <ContextMenu
            subr={callieId}
            id={callieId + data.fromId}
            type={'AC'}
            callType={data.callType}
            initPatch={() => initiatePatchCall(data)}
            addToPatch={() => addCallToPatch(data)}
            initMerge={() => initiateMergeCall(data)}
            addToMerge={() => addCallToMerge(data)}
            setCurrent={() => { console.log('SET PRESSED', data); setCallasCurrent(data, true) }}
            disableCallPatchMerge={disableOptionForMergePatchCall ? true : false}
            onProcessState={onProcessState}
        >
            <div ref={videoRef} className={divMain + (actionItem['highlight'] ? " highlight" : "") + (isPatched || isMerged ? " highlightPatch" : "")}
                style={actionItem['highlight'] == true || ((isPatchable || isMergable) && !callIsOnHold) ? videocall == true ? { backgroundColor: '#baffb7' } : { backgroundColor: '#baffb7' } : { backgroundColor: '' }}
            >
                {
                    videocall === true ?
                        <div className='act-indv-card-video'>
                            <video ref={videoRef} autoPlay className='act-indv-video' />
                        </div>
                        : null
                }
                <div
                    class={"act-indv-card-grid" + (isEmg ? " emergency-red m-t-10" : "")}
                    style={(initPatch && !isPatchable) || (initMerge && !isMergable) ? { pointerEvents: 'none', opacity: '0.6' } : getBgStyle()}
                >
                    <div class="act-indv-name">
                        <span class="f-subs-name dark">{Name}</span>
                    </div>
                    {/* <div class="act-indv-id">
                        <p class="f-subs-id">{showCallieId}</p>
                    </div> */}
                    <div class="act-indv-status" >
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
                            <span class="f-status" style={colorReqd || isPatching || otherCallOnHold ? { color: '#078041', fontWeight: 'bold' } : {}}>
                                {isPatching ? 'Patching...' : callAction.length > 0 ? callAction : otherCallOnHold ? 'put your call on hold' : ''}
                                {/* {!isPatching ? callAction : 'Patching...'} */}
                            </span>
                        </p>
                    </div>
                    <div
                        class="act-indv-icon"
                    // @contextmenu.prevent="$refs.menu.open($event, { foo: 'bar' })"
                    >
                        <p class="f-status in-blc mr-8">
                            <strong>{Priority}</strong>
                        </p>
                        <img
                            class="in-blc x10"
                            src={`/assets/images/${isCalled ? 'outgoing' : 'incoming'}.svg`}
                            alt=''
                        />
                    </div>

                    <div class="act-indv-calltype">
                        <p class="f-status in-blc m-l-15">
                            <strong>{callTypeName + (isCalled ? ' (OUT)' : ' (IN)')}</strong>
                        </p>
                    </div>

                    <div class="act-indv-discon">
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
                    <div class="act-indv-hld f-12 f-mid">
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
                        <div class="act-indv-mic">
                            <button
                                class="btn mic_btn"
                                data-toggle="button"
                                aria-pressed="false"
                                onClick={() => !actionItem['mic'] ? updateCallAction("UNMUTE_MIC") : updateCallAction("MUTE_MIC")}
                                style={actionItem['micDis'] ? { pointerEvents: 'none', color: '#757575' } : {}}
                            >
                                <img src={`/assets/images/${actionItem['micDis'] ? 'mute_disabled' : !actionItem['mic'] ? 'unmute' : 'mute'}.svg`} alt='' />
                            </button>
                        </div>
                        : null}
                    {!dial ?
                        <div class="act-indv-mut">
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
            </div>
        </ContextMenu>
    )
}

const mapStateToProps = ({ auth, communication, train }) => {
    const { user } = auth;
    const { contactList, patchCallType, initPatch, mergeCallType, initMerge } = communication;
    const { radioData } = train;
    return {
        user, contactList, patchCallType, initPatch, radioData, mergeCallType, initMerge
    };
};


export default connect(mapStateToProps, {
    sendIndividualCallAction, setCallasCurrent,
    initiatePatchCall, addCallToPatch, initiateMergeCall, addCallToMerge,
})(Active_indv_call)
