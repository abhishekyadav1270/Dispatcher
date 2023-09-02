import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux'
import moment from 'moment'

import { ContextMenu } from '../../components/commom';
import { subscriberType } from '../../constants/constants';
import { acknowledgeStatus, ignoreStatus, sendStatus, pinUnpinStatus } from '../..//modules/alarm';
import { GroupStatusMessage, IndividualStatusMessage } from '../../models/statusMessage';
import { showMessage } from '../../modules/alerts'
import { StatusUpdate } from '../..//models/status';
import { getRandomString, getCallieIdToShow } from '../../utils/lib';
import axios from 'axios';
import { EndPoints } from '../../MCXclient/endpoints';

const DefaultTaskListItem = (props) => {
    const [isactive, setActive] = useState(false);
    const { data, taskData, acknowledgeStatus, ignoreStatus, sendStatus, user, showMessage, pinUnpinStatus, onTaskAcknowledge } = props;
    //console.log('TASK LIST REQ data', data, taskData)
    const checkRestrictedAlarm = () => {
        if (data.statusCode == '65310' || data.statusCode == '65311') {
            return true
        } else {
            return false
        }
    }

    const acknowledgeAlert = () => {
        acknowledgeStatus(new StatusUpdate(data, 'ACKNOWLEDGED'))
        showMessage({ header: 'Alarms', content: 'Alarm is successfully acknowledged!', type: 'success' })
    }

    const acknowledgeTask = (taskData) => {
        console.log("TASK UPDATE REQ", taskData);
        // taskData={...taskData,
        //     taskStatus: "COMPLETED"
        // }
        if (taskData) {
            const res = axios
                .put(EndPoints.getConfig().updateTask, taskData, {
                    headers: {
                        Authorization: `Bearer ${user.access_token}`
                        // Authorization:user.access_token
                    }
                })
                .then(
                    (res) => {
                        if (res.data) {
                            console.log("TASK UPDATE RES ", JSON.stringify(res.data));
                            let data = res.data;
                            if (data) {
                                onTaskAcknowledge()
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
        }
    };

    // const ignoreAlert = () => {
    //     ignoreStatus(new StatusUpdate(data, 'ACKNOWLEDGED'))
    //     showMessage({ header: 'Alarms', content: 'Alarm is successfully ignored!', type: 'success' })
    // }

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
        if (data.trainNum) {
            output = output + " | " + data.trainNum
        }
        return output
    }

    return (
        <div class="alert-list-grid" style={taskData.taskPriority === '0' || checkRestrictedAlarm() === true ? { backgroundColor: '#fbc6c6' } : {}}>
            <div class="alert-header-list">
                <div class="f-subs-name in-blc m-r-10">{getRakeAndTrainId()}</div>
                <i class={sent ? "la la-arrow-up" : ackEnable ? "la la-arrow-down" : "la la-check green"}></i>
                <div class="f-subs-name in-blc m-l-20">{global.config.project === 'mumbai' ? (taskData.taskPriority === '0' ? '(Critical)' : '(Major)') : ''}</div>
            </div>
            <div class="alert-body-list">
                <span class="f-subs-name-list">{taskData.description}</span>
            </div>
            <div class="alert-date-list">
                <div class="f-subs-name-list flt-r in-blc">{moment(data.created).format('DD/MM/YY H:mm:ss')}</div>
            </div>
            <div class="alert-ack-list-nested">
                <div class="alert-ack" style={ { marginLeft: '165px' } }>
                    {taskData.taskStatus !== "COMPLETED" ?
                        <button
                            onClick={() => acknowledgeTask(taskData)}
                            style={(!ackEnable || sent) ? { pointerEvents: 'none' } : {}}
                            class={data.type === 'emergency' ? "btn btn-rgba-danger f-semi f-14"
                                : (!ackEnable || sent) ? "btn hld_btn f-semi f-14 opacity-50" : "btn hld_btn f-semi f-14"
                            }>
                            {ackEnable ? 'Acknowledge' : 'Acknowledged'}
                        </button> :
                        <label style={{ color: '#A9A9A9' }}>Acknowledged</label>
                    }
                </div>
                <div class="alert-ack-btn" style={{ alignItems: 'flex-end', alignContent: 'flex-end' }}>
                    <ContextMenu id={data.id + getRandomString(5)} type={'Alert'} subr={sent ? data.toId : data.fromId} pinStatus={data.pinned} Class="d" pin={pinAlert} clickOpen={true}>
                        <buttton class="arrow-icon flt-r"><i class="fa fa-caret-right"></i></buttton>
                    </ContextMenu>
                </div>
            </div>
        </div>
    )
}

const mapStateToProps = ({ auth }) => {
    const { user } = auth;
    return {
        user
    };
};

export default connect(mapStateToProps, { acknowledgeStatus, ignoreStatus, sendStatus, showMessage, pinUnpinStatus })(DefaultTaskListItem)
