import React from 'react'
import {showTime } from './definedFunction';

const RegisterTableRow = (props) => {
    const { data } = props;

    const showUser = () => {
        if (data) {
            if (data.callerDisplayName)
                return data.callerDisplayName;
        }
        return "";
    }

    const showUA = () => {
        if (data) {
            if (data.callerUA)
                return data.callerUA;
        }
        return "";
    }

    const showUserType = () => {
        if (data) {
            if (data.callerUserType)
                return data.callerUserType;
        }
        return "";
    }

    return (
        <React.Fragment>
            <div class="rgstr-tb-user train-cell-center">
                <span>{showUser()}</span>
            </div>
            <div class="rgstr-tb-ua  train-cell-center">
                <span>{showUA()}</span>
            </div>
            <div class="rgstr-tb-userType train-cell-center">
                <span>{showUserType()}</span>
            </div>
            <div class="rgstr-tb-time train-cell-center">
                <span>{showTime(data.recordStartTime)}</span>
            </div>
            <div class="rgstr-tb-type train-cell-center">
                <span>{data.sessionType}</span>
            </div>
            <div class="rgstr-tb-ueid train-cell-center">
                <span>{data.callerUeId.split("@")[0]}</span>
            </div>
            <div class="rgstr-tb-impu train-cell-center">
                <span>{data.callerIMPU.split("@")[0]}</span>
            </div>
        </React.Fragment>
    )
}

export default RegisterTableRow