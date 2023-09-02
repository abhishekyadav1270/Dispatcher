import React from 'react'
import { showTime } from './definedFunction';
import { otherStatus, SdsStatus, paAlerts } from '../../constants/constants';

const SdsTableRow = (props) => {
    const { data } = props;

    const showCalleeName = () => {
        if (data) {
            if (data.calleeDisplayName) {
                return data.calleeDisplayName;
            }
        }
        return ""
    }
    const showCallerName = () => {
        if (data) {
            if (data.callerDisplayName) {
                return data.callerDisplayName;
            }
        }
        return ""
    }
    const showGroupName = () => {
        if (data) {
            if (data.displayGroupName) {
                return data.displayGroupName;
            }
        }
        return ""
    }
    
    const getEncodedMessage = (data) => {
        if (data.sessionType === 'STATUS') {
            return getAlert(data.sdsPayloadData)
        } else {
            return data.sdsPayloadData;
        }
    }
    const getAlert = (code) => {
        const alert = [...SdsStatus, ...otherStatus, ...paAlerts].filter(status => Number(status.code) === Number(code));
        if (alert && alert.length > 0) return alert[0].desc
        else return code
    }

    return (
        <React.Fragment>
            <div class="sds-tb-to train-cell-center ">
                <span>{showCalleeName()}</span>
            </div>
            <div class="sds-tb-from train-cell-center ">
                <span>{showCallerName()}</span>
            </div>
            <div class="sds-tb-grp train-cell-center">
                <span>{showGroupName()}</span>
            </div>
            <div class="sds-tb-time train-cell-center ">
                <span>{showTime(data.recordStartTime)}</span>
            </div>
            <div class="sds-tb-msgType train-cell-center ">
                <span>{data.sessionType}</span>
            </div>
            <div class="sds-tb-msg train-cell-center">
                <span>{data.sdsPayloadData?getEncodedMessage(data):""}</span>
            </div>
        </React.Fragment>
    )
}

export default SdsTableRow