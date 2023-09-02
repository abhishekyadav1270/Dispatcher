import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux'
import moment from 'moment'
import { subscriberType } from '../../constants/constants';
import { acknowledgeStatus, ignoreStatus, sendStatus, pinUnpinStatus } from '../..//modules/alarm';
import { GroupStatusMessage, IndividualStatusMessage } from '../../models/statusMessage';
import { showMessage } from '../../modules/alerts'
import { StatusUpdate } from '../..//models/status';
import axios from 'axios';
import { EndPoints } from '../../MCXclient/endpoints';
import { Button } from '@material-ui/core';
import { GroupCall, IndividualCall } from '../../models/call';
import { sendIndividualCall, sendIndividualCallAction } from '../../modules/communication';
import { updateTab } from '../../modules/activityLog';
import { push } from 'react-router-redux'
import { getCallActionState } from '../../utils/lib';
import { CallAction } from '../../models/callAction';
import { ContextMenu } from '../../components/commom';
import { getRandomString, getCallieIdToShow } from '../../utils/lib';

const HelpPointTaskListItem = (props) => {
    const [isactive, setActive] = useState(false);
    const { data, taskData, acknowledgeStatus, ignoreStatus, sendStatus, user, showMessage, pinUnpinStatus,
        onTaskAcknowledge, sendIndividualCall, updateTab, navigateToCom, individualCalls, sendIndividualCallAction } = props;

    console.log('taskData taskStatus..', taskData, data)
    const startCall = (taskData) => {
        //IMPLEMENT CODE FOR START CALL USING ABOVE TASKDATA
        if (taskData && taskData.taskInput && taskData.taskInput.radioId) {
            let call = new IndividualCall('DUPLEX_INDIVIDUAL_CALL', taskData.taskInput.radioId, 'HELPPOINT');
            call.alertTask = taskData
            sendIndividualCall(user, call)
            navigateToCom()
            updateTab('communication')
        }
    }

    const updateCallAction = (callData, type) => {
        const call = new CallAction(callData, type);
        const stateup = getCallActionState(type, callData.actionItem);
        call.actionItem = stateup;
        if (type === 'DISCONNECTED') {
            sendIndividualCallAction(user, call)
        }
    };

    const acknowledgeTask = (inputAction) => {
        let taskDataReq = { ...taskData }
        taskDataReq = {
            ...taskDataReq,
            taskOutput: {
                ...taskDataReq.taskOutput,
                action: inputAction
            }
        }
        if (inputAction === 'COMPLETED') {
            // check running call
            if (taskDataReq.taskOutput.callId) {
                if (individualCalls.length > 0) {
                    let getcallMatchedId = individualCalls.filter(call => call.callId === taskDataReq.taskOutput.callId)
                    if (getcallMatchedId.length > 0) {
                        console.log('callId checking match... ', getcallMatchedId)
                        updateCallAction(getcallMatchedId[0], 'DISCONNECTED')
                    }
                }
            }
        }
        // action:"ANSWER/REJECT/ISOLATE"
        console.log("TASK UPDATE REQ", taskDataReq);
        axios
            .put(EndPoints.getConfig().updateTask, taskDataReq, {
                headers: {
                    Authorization: `Bearer ${user.access_token}`
                }
            })
            .then(
                (res) => {
                    if (res.data) {
                        console.log("TASK UPDATE RES ", JSON.stringify(res.data));
                        onTaskAcknowledge()
                        if (res.data.data) {
                            let alertTask = res.data.data
                            if (alertTask.taskOutput && alertTask.taskOutput.action === 'ANSWER') {
                                // initiate duplex call
                                if (alertTask.taskInput && alertTask.taskInput.radioId) {
                                    setTimeout(() => {
                                        startCall(alertTask)
                                    }, 600)
                                }
                            }
                        }
                    }
                },
                (err) => {
                    console.log("TASK UPDATE ER ", err);
                }
            )
            .catch((err) => {
                console.log("TASK UPDATE ER", err);
            });

    };

    const ignoreAlert = () => {
        ignoreStatus(new StatusUpdate(data, 'ACKNOWLEDGED'))
        showMessage({ header: 'Alarms', content: 'Alarm is successfully ignored!', type: 'success' })
    }

    const forwardAlarm = (sendTo) => {
        if ((sendTo && sendTo.mcptt_id) && data.tetraCode) {
            const toId = sendTo.mcptt_id;
            const message = (sendTo.subscriber_type === subscriberType['GROUP']) ?
                new GroupStatusMessage(data.tetraCode, toId)
                : new IndividualStatusMessage(data.tetraCode, toId)
            sendStatus(user, message)
            showMessage({ header: 'SDS', content: 'Alert forwarded successfully!', type: 'success' })
        }
        else {
            showMessage({ header: 'SDS', content: 'Please enter required details!', type: 'error' })
        }
    }

    const pinAlert = () => {
        pinUnpinStatus(data, data.pinned ? false : true)
    }

    const ackEnable = taskData.taskStatus !== 'COMPLETED';
    const sent = data.fromId === user.profile.mcptt_id;

    const getRakeAndTrainId = () => {
        const radioId = sent === true ? data.toId : data.fromId
        let output = getCallieIdToShow(radioId)
        if (data.rakeId) {
            output = output + " | " + data.rakeId
        }
        if (data.padId) {
            output = output + " | " + data.padId
        }
        if (data.coachId) {
            output = output + " | " + data.coachId
        }
        if (data.trainNum) {
            output = output + " | " + data.trainNum
        }
        return output
    }

    const getDescription = () => {
        if (data.mode) {
            return taskData.description + '  (' + data.mode + ')'
        } else {
            return taskData.description
        }
    }

    const checkTaskIsStillActive = () => {
        if (taskData.taskStatus === "STARTED") {
            //check call id
            if (taskData.taskOutput && taskData.taskOutput.action === "CALL_STARTED") {
                if (taskData.taskOutput.callId) {
                    if (individualCalls.length > 0) {
                        let getcallMatchedId = individualCalls.filter(call => call.callId === taskData.taskOutput.callId)
                        if (getcallMatchedId.length > 0) {
                            console.log('callId checking match... ', getcallMatchedId)
                            return true
                        }
                    }
                }
            }
        }
        return false
    }

    return (
        <div class="alert-list-grid" style={taskData.taskPriority === '0' ? { backgroundColor: '#fbc6c6' } : {}}>
            <div class="alert-header-list">
                <div class="f-subs-name in-blc m-r-10">{getRakeAndTrainId()}</div>
                <i class={sent ? "la la-arrow-up" : ackEnable ? "la la-arrow-down" : "la la-check green"}></i>
                <div class="f-subs-name in-blc m-l-20">{global.config.project === 'mumbai' ? (taskData.taskPriority === '0' ? '(Critical)' : '(Major)') : ''}</div>
            </div>
            <div class="alert-body-list">
                <span class="f-subs-name-list">{getDescription()}</span>
            </div>
            <div class="alert-date-list">
                <div class="f-subs-name-list flt-r in-blc">{moment(data.created).format('DD/MM/YY H:mm:ss')}</div>
            </div>
            {
                data.mode && data.mode == 'UTO' ?
                    <div class="alert-ack-list-nested">
                        <div class="alert-ack">
                            {taskData.taskStatus === "PREASSIGNED" ?
                                <div style={{ display: "flex", flexDirection: "row", alignContent: "space-around", width: '250px' }}>
                                    {data.radio === "AVAILABLE" ?
                                        <Button style={{ marginLeft: "100px", backgroundColor: "#1FAC4C", color: "white" }} variant="contained" onClick={() => acknowledgeTask("ANSWER")} >Answer</Button>
                                        : null
                                    }
                                    <Button style={data.radio === "AVAILABLE" ? { marginLeft: "10px", backgroundColor: "#D65757", color: "white" } : { padding: '10px', marginLeft: "100px", backgroundColor: "#D65757", color: "white" }} variant="contained" color="error" onClick={() => acknowledgeTask("REJECT")} >Reject</Button>
                                    <Button style={{ marginLeft: "10px", backgroundColor: "#EFD989", color: "black" }} variant="contained" color="secondary" onClick={() => acknowledgeTask("ISOLATE")} >Isolate</Button>
                                </div>

                                : taskData.taskStatus === "ASSIGNED" ?
                                    <div style={{ display: "flex", flexDirection: "row", alignContent: "space-around", width: '250px' }}>
                                        <Button style={{ marginLeft: "100px", backgroundColor: "#1FAC4C", color: "white" }} variant="contained" onClick={() => startCall(taskData)} >Start call</Button>
                                    </div>

                                    : taskData.taskStatus === "STARTED" ?
                                        <div style={{ display: "flex", flexDirection: "row", width: '250px', alignItems: 'flex-end', alignContent: 'flex-end' }}>
                                            {checkTaskIsStillActive() === false ?
                                                <Button style={{ marginLeft: "100px", backgroundColor: "#1FAC4C", color: "white" }} variant="contained" onClick={() => startCall(taskData)} >Start call</Button>
                                                : null
                                            }
                                            <Button style={{ marginLeft: '10px', backgroundColor: "#1FAC4C", color: "white" }} variant="contained" onClick={() => acknowledgeTask("COMPLETED")} >Complete</Button>
                                        </div>
                                        :
                                        <div></div>
                            }
                        </div>
                    </div>
                    :
                    taskData.taskStatus !== "COMPLETED" ?
                        <div class="alert-ack-list-nested">
                            <div class="alert-ack" style={{ marginLeft: '165px' }}>
                                <button
                                    onClick={() => acknowledgeTask('COMPLETED')}
                                    style={(!ackEnable || sent) ? { pointerEvents: 'none' } : {}}
                                    class={data.type === 'emergency' ? "btn btn-rgba-danger f-semi f-14"
                                        : (!ackEnable || sent) ? "btn hld_btn f-semi f-14 opacity-50" : "btn hld_btn f-semi f-14"
                                    }>
                                    {ackEnable ? 'Acknowledge' : 'Acknowledged'}
                                </button>
                            </div>
                            <div class="alert-ack-btn" style={{ alignItems: 'flex-end', alignContent: 'flex-end' }}>
                                <ContextMenu id={data.id + getRandomString(5)} type={'Alert'} subr={sent ? data.toId : data.fromId} pinStatus={data.pinned} Class="d" pin={pinAlert} clickOpen={true}>
                                    <buttton class="arrow-icon flt-r"><i class="fa fa-caret-right"></i></buttton>
                                </ContextMenu>
                            </div>
                        </div>
                        : null
            }

        </div>
    )
}

const mapStateToProps = ({ auth, communication }) => {
    const { user } = auth;
    const { individualCalls } = communication;
    return {
        user,
        individualCalls
    };
};

export default connect(mapStateToProps, {
    acknowledgeStatus, ignoreStatus, sendStatus, showMessage, pinUnpinStatus,
    sendIndividualCall, sendIndividualCallAction,
    updateTab,
    navigateToCom: () => push('/communication')
})(HelpPointTaskListItem)
