import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux'
import moment from 'moment'

import { ButtonPopOver, ContextMenu } from '../../components/commom';
import { otherStatus, SdsStatus, subscriberType, paAlerts } from '../../constants/constants';
import { acknowledgeStatus, ignoreStatus, sendStatus, pinUnpinStatus } from '../..//modules/alarm';
import { GroupStatusMessage, IndividualStatusMessage } from '../../models/statusMessage';
import { showMessage } from '../../modules/alerts'
import { StatusUpdate } from '../..//models/status';
import { getRandomString, getCallieIdToShow} from '../../utils/lib';

const AlertList = (props) => {
    const [isactive, setActive] = useState(false);

    const { data, acknowledgeStatus, ignoreStatus, sendStatus, user, showMessage, pinUnpinStatus } = props;

    useEffect(() => {
    }, [])

    const acknowledgeAlert = () => {
        acknowledgeStatus(new StatusUpdate(data, 'ACKNOWLEDGED'))
        showMessage({ header: 'Alarms', content: 'Alarm is successfully acknowledged!', type: 'success' })
    }

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

    const getAlert = (code, sent) => {
        // if (sent) {
        //     const alert = [...otherStatus, ...paAlerts].filter(status => Number(status.code) === Number(code));
        //     if (alert && alert.length > 0) return alert[0].desc
        //     else return ''
        // }
        // else {
        //     const alert = [...SdsStatus, ...otherStatus].filter(status => Number(status.code) === Number(code));
        //     if (alert && alert.length > 0) return alert[0].desc
        //     else return ''
        // }
        const alert = [...SdsStatus, ...otherStatus, ...paAlerts].filter(status => Number(status.code) === Number(code));
        if (alert && alert.length > 0) return alert[0].desc
        else return ''
    }

    const pinAlert = () => {
        pinUnpinStatus(data, data.pinned ? false : true)
    }

    const ackEnable = data.stateType !== 'ACKNOWLEDGED';
    const sent = getCallieIdToShow(data.fromId) === getCallieIdToShow(user.profile.mcptt_id);
    const isGeneral = false //(Number(data.tetraCode) >= 65024 && Number(data.tetraCode) <= 65031)
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
        <div class="alert-list-grid" style={data.type === 'emergency' || data.tetraCode === '0' || data.priority === '0' ? { backgroundColor: '#fbc6c6' } : {}}>
        {/* <ContextMenu id={data.id + getRandomString(5)} type={'Alert'} subr={sent ? data.toId : data.fromId} pinStatus={data.pinned} Class="alert-list-grid" pin={pinAlert} style={data.type === 'emergency' || data.tetraCode === '0' || data.priority === '0' ? { backgroundColor: '#fbc6c6' } : {}}> */}
            <div class="alert-header-list">
                <div class="f-subs-name in-blc m-r-10">{getRakeAndTrainId()}</div>
                <i class={sent ? "la la-arrow-up" : ackEnable ? "la la-arrow-down" : "la la-check green"}></i>
                <div class="f-subs-name in-blc m-l-20">{global.config.project === 'mumbai' ? (data.type === 'emergency' || data.tetraCode === '0' || data.priority === '0' ? '(Critical)' : '(Major)') : ''}</div>
            </div>
            <div class="alert-body-list">
                <span class="f-subs-name-list">{getAlert(data.tetraCode, sent)}</span>
            </div>
            <div class="alert-date-list">
                <div class="f-subs-name-list flt-r in-blc">{moment(data.created).format('DD/MM/YY H:mm:ss')}</div>
            </div>
            <div class="alert-ack-list-nested alert-list">
                <div class="alert-ack">
                    {!isGeneral ?
                        <button
                            onClick={acknowledgeAlert}
                            style={(!ackEnable || sent) ? { pointerEvents: 'none' } : {}}
                            class={data.type === 'emergency' ? "btn btn-rgba-danger f-semi f-14"
                                : (!ackEnable || sent) ? "btn hld_btn f-semi f-14 opacity-50" : "btn hld_btn f-semi f-14"
                            }>
                            {ackEnable ? 'Acknowledge' : 'Acknowledged'}
                        </button> : null}
                </div>
                <div class="alert-ack-btn">
                    <ContextMenu id={data.id + getRandomString(5)} type={'Alert'} subr={sent ? data.toId : data.fromId} pinStatus={data.pinned} Class="d" pin={pinAlert} clickOpen={true}>
                        <buttton class="arrow-icon flt-r"><i class="fa fa-caret-right"></i></buttton>
                    </ContextMenu>
                    {/* <buttton class="arrow-icon flt-r"><i class="fa fa-caret-right"></i></buttton> */}
                </div>
            </div>
        {/* </ContextMenu> */}
        </div>
    )
}

const mapStateToProps = ({ auth }) => {
    const { user } = auth;
    return {
        user
    };
};

export default connect(mapStateToProps, { acknowledgeStatus, ignoreStatus, sendStatus, showMessage, pinUnpinStatus })(AlertList)
