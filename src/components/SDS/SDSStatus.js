import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux'
import moment from 'moment'
//Other
import { ContextMenu } from '../commom';
import { getRandomString, getCallieIdToShow } from '../../utils/lib';
import { otherStatus, SdsStatus, paAlerts } from '../../constants/constants';

const SDSStatus = (props) => {
    const { data, user } = props;
    useEffect(() => {
        //code here

    }, [])

    const sent = getCallieIdToShow(data.fromId) === getCallieIdToShow(user.profile.mcptt_id);
    const messageWithSenderId = () => {
        const msg = getAlert(data.tetraCode)
        if (data.groupId) {
            return msg + ' (' + getCallieIdToShow(data.groupId) + ')'
        } else {
            if (sent) {
                return msg + ' (' + getCallieIdToShow(data.toId) + ')'
            } else {
                return msg + ' (' + getCallieIdToShow(data.fromId) + ')'
            }
        }
    }
    //functions
    const getAlert = (code) => {
        const alert = [...SdsStatus, ...otherStatus, ...paAlerts].filter(status => Number(status.code) === Number(code));
        if (alert && alert.length > 0) return alert[0].desc
        else return ''
    }

    return (
        <div class={"sds-card-grid m-t-4 "} >
            <div class='sds-icon m-l-8'>
                <i class='feather icon-alert-triangle m-r-8'></i>
            </div>
            <div class="sds-text"><p class="f-sds disp-sds" style={{ textOverflow: 'ellipsis' }}>{messageWithSenderId()}</p></div>
            <div class="sds-from" style={{ cursor: 'pointer' }}>
                <div class="f-status">{moment(data.created).format('DD/MM/YY H:mm:ss')}</div>
            </div>
            <ContextMenu id={data.id + getRandomString(5)} Class="sds-ops" type={'SDS'} subr={sent === true ? data.toId : data.fromId} clickOpen={true}>
                <button class="arrow-icon vg_bottom">
                    <i class="fa fa-caret-right"></i>
                </button>
            </ContextMenu>
        </div >
    )
}

const mapStateToProps = ({ auth }) => {
    const { user } = auth;
    return {
        user
    };
};

export default connect(mapStateToProps, null)(SDSStatus);
