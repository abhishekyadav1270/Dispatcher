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


const AlertCard = (props) => {
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
        <ContextMenu id={data.id + getRandomString(5)} type={'Alert'} subr={sent ? data.toId : data.fromId} pinStatus={data.pinned} Class="alert-card-grid" pin={pinAlert} style={data.type === 'emergency' || data.tetraCode === '0' || data.priority === '0' ? { backgroundColor: '#fbc6c6' } : {}}>
            <div class="alert-header">
                <div class="f-subs-name in-blc m-r-10">{getRakeAndTrainId()}</div>
                <i class={sent ? "la la-arrow-up" : ackEnable ? "la la-arrow-down" : "la la-check green"}></i>
                <div class="f-status flt-r in-blc">{moment(data.created).format('DD/MM/YY H:mm:ss')}</div>
            </div>
            <div class="alert-body">
                <span class="f-alerts">{getAlert(data.tetraCode, sent)}</span>
            </div>
            <div class="alert-footer">
                <div class="a">
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
                <div class="b">
                    {/* <button onClick={()=>pinUnpinStatus(data,data.pinned?false:true)} class="btn hld_btn f-semi f-14">Call</button> */}
                </div>
                <div class="c">
                    {/* {!isGeneral || sent?
                    <ButtonPopOver 
                        type='button'
                        btnText='Forward'
                        title='Forward Status' 
                        header='Subscriber Name' 
                        Class="btn hld_btn f-semi f-14"
                        submitText='Send'
                        btnHighlight='Send SDS Status'
                        onSubmit={(alert)=>forwardAlarm(alert)}
                    />:null} */}
                    {/* <button onClick={()=>{}} class="btn hld_btn f-semi f-14">Forward</button> */}
                </div>

                <ContextMenu id={data.id + getRandomString(5)} type={'Alert'} subr={sent ? data.toId : data.fromId} pinStatus={data.pinned} Class="d" pin={pinAlert} clickOpen={true}>
                    <buttton class="arrow-icon flt-r"><i class="fa fa-caret-right"></i></buttton>
                </ContextMenu>
                {/* <div class="d"><buttton class="arrow-icon flt-r"><i class="fa fa-caret-right"></i></buttton></div> */}
            </div>
        </ContextMenu>
    )
}

const mapStateToProps = ({ auth }) => {
    const { user } = auth;
    return {
        user
    };
};

export default connect(mapStateToProps, { acknowledgeStatus, ignoreStatus, sendStatus, showMessage, pinUnpinStatus })(AlertCard)
