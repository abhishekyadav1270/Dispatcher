import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux'
import moment from 'moment'

//Other
import { } from '../../modules/actions';
//import { data } from 'autoprefixer';
import { ContextMenu } from '../commom';
import { subscriberType } from '../../constants/constants';
import { GroupTextMessage, IndividualTextMessage } from '../../models/message';
import { sendTextMessage } from '../../modules/communication';
import { showMessage } from '../../modules/alerts'
import SDSType from './SDSType';
import { GroupStatusMessage, IndividualStatusMessage } from '../../models/statusMessage';
import { sendStatus } from '../../modules/alarm';
import { getRandomString, getCallieIdToShow } from '../../utils/lib';
import { otherStatus, SdsStatus, paAlerts } from '../../constants/constants';

const SDS_Message = (props) => {
    const [isreply, setreplyPressed] = useState(false);

    useEffect(() => {
        //code here
        //handleData()
    }, [])
    //functions

    const { data, setMsg, Class, msgType, read, markasRead, forwardMsg, user } = props;

    const sendSDS = (sdsMsg, statusCode, statusType) => {
        if (statusType) {
            if (statusCode.code) {
                const toId = data.fromId;
                const message = (data.subscriber_type === subscriberType['GROUP']) ?
                    new GroupStatusMessage(statusCode.code, toId)
                    : new IndividualStatusMessage(statusCode.code, toId)
                props.sendStatus(user, message)
            }
            else {
                showMessage({ header: 'SDS', content: 'Please select status!', type: 'error' })
            }
        }
        else if (sdsMsg) {
            let toId = '', fromId = '';
            if (msgType === 'SENT') {
                toId = data.toId;
                fromId = data.fromId;
            }
            else {
                toId = data.fromId;
                fromId = data.toId;
            }
            const report = {
                imm: data.immediate,
                dely: data.deliveryReportNeeded,
                consd: data.consumedReportNeeded
            }
            const message = (data.subscriber_type === subscriberType['GROUP']) ? new GroupTextMessage(sdsMsg, toId, fromId, report) : new IndividualTextMessage(sdsMsg, toId, fromId, report)
            setreplyPressed(false);
            props.sendTextMessage(props.user, message);
        }
        else {
            props.showMessage({ header: 'SDS', content: 'Please enter a message!', type: 'error' })
        }
    }

    const isMsgRead = data.stateType === "READ" && data.consumedReportNeeded;
    const sentRead = data.stateType === "CONSUMED" && msgType === 'SENT'
    const sentDelivered = data.stateType === "DELIVERED" && msgType === 'SENT'

    const getEncodedMessage = () => {
        if (data.messageType === 'STATUS') {
            return getAlert(data.message)
        } else {
            return data.message
        }
    }

    const getAlert = (code) => {
        const alert = [...SdsStatus, ...otherStatus, ...paAlerts].filter(status => Number(status.code) === Number(code));
        if (alert && alert.length > 0) return alert[0].desc
        else return code
    }

    return (
        <div class={"sds-card-grid m-t-4 " + Class} style={isreply ? { height: '140px' } : {}} onClick={() => { }}>
            <div class="sds-icon" style={{ cursor: 'pointer' }}>
                <center>
                    <div class="sds-status-div" onClick={() => setMsg(data)}>
                        <i class={read || msgType === 'READ' ? 'fa fa-envelope-o f-24' : 'fa fa-envelope f-24'}></i>
                    </div>
                    <div class="f-status h_center">{moment(data.created).format('DD/MM/YY')}</div>
                    <div class="f-status h_center">{moment(data.created).format('H:mm:ss')}</div>
                </center>
            </div>
            <div class="sds-text"><p class="f-sds disp-sds" style={{ textOverflow: 'ellipsis' }}>{getEncodedMessage()}</p></div>
            {/* <ContextMenu id={data.id + getRandomString(5)} Class="sds-ops" type={'SDS'} subr={msgType === 'SENT' ? data.toId : data.fromId} clickOpen={true}>
                <button class="arrow-icon vg_bottom">
                    <i class="fa fa-caret-right"></i>
                </button>
            </ContextMenu> */}
            <div class="sds-from">
                {!isreply ?
                    <React.Fragment>
                        {msgType === 'INBOX' && data.consumedReportNeeded ?
                            <button class="sq-icon-btn in-blc wx32"
                                style={isMsgRead ? { pointerEvents: 'none' } : {}}
                                onClick={() => ((data.stateType !== 'CONSUMED' || data.stateType !== 'READ') && (msgType === 'INBOX')) ? markasRead(data) : null}
                            >
                                <i class="fa fa-check-circle f-16" style={isMsgRead ? { color: '#2e9e79' } : {}}></i>
                            </button>
                            : null}
                        {sentDelivered ?
                            <img class="in-blc x20" src="assets/images/svg-icon/checkmark.svg" alt='sent' />
                            : null}
                        {sentRead ?
                            <img class="in-blc x20" src="assets/images/svg-icon/checkmark-done.svg" alt='read' />
                            : null}
                        <button class="sq-icon-btn in-blc wx32" onClick={() => setreplyPressed(true)}>
                            <i class="fa fa-send f-16 pink"></i>
                        </button>
                        <button class="sq-icon-btn in-blc wx32" onClick={() => forwardMsg(data)}>
                            <i class="fa fa-share f-16"></i>
                        </button>
                        <span class="f-from m-l-8">
                            {msgType === 'SENT' ? '' : getCallieIdToShow(data.fromId)}
                            {data.groupId ? ' GROUP : ' + getCallieIdToShow(data.groupId) : ''}
                        </span>
                    </React.Fragment> : null}
                {isreply ?
                    <SDSType sendSDS={(sdsMsg, statusCode, statusType) => sendSDS(sdsMsg, statusCode, statusType)} setreplyPressed={setreplyPressed} back={true} />
                    : null}
            </div>
        </div >
    )
}

const mapStateToProps = ({ auth }) => {
    const { user } = auth;
    return {
        user
    };
};

export default connect(mapStateToProps, { sendStatus, sendTextMessage, showMessage })(SDS_Message);
