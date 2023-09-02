import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux'

import { getPriority, RenderIcon, setIconColor, getCallieIdToShow } from '../../utils/lib';
import {
    updateCADCall
} from '../../modules/other'

const IncomingCAD = ({
    data, contactList, user, dial, updateCADCall
}) => {

    //Speaking party / call action
    const [isGrant, setGrant] = useState(false);

    useEffect(() => {
        if (data.stateType === 'GRANT_REQUEST') setGrant(true)
        else if (isGrant) setGrant(false)
    }, [data])

    const getUserData = (id) => {
        const callerId = getCallieIdToShow(id)
        const subDetails = contactList.filter(cont =>
            getCallieIdToShow(cont.mcptt_id) == callerId
        );
        if (subDetails.length > 0) return subDetails[0]
        else return []
    }

    const getAction = (data, type) => {
        return {
            ...data,
            stateType: type,
            hold: type === 'HOLD' ? true : false
        }
    }

    const updateCallAction = (type) => {
        const call = getAction(data, type);
        updateCADCall(user, call);
    };

    const getBgStyle = () => {
        try {
            if (data.hold) return { backgroundColor: '#dddddd' }
            else return { backgroundColor: '#fff' }
        }
        catch (e) {
            console.log('CRASH : getting Card BgClr', e)
            return {}
        }
    }

    const Priority = getPriority(parseInt(data.callPriority));
    // const callieId = data.fromId ===(user && user.profile.mcptt_id)?data.toId:data.fromId;
    const fromData = getUserData(data.callId1);
    const toData = getUserData(data.callId2);

    return (
        <div
            class={"cad-card-grid m-t-10"}
            style={getBgStyle()}
        >
            <div class="cad-from pl-4">
                {RenderIcon(fromData.subscriber_type, setIconColor(fromData))}
                <span class="f-text-14b dark pl-4">{fromData.contactName}</span>
                <p class="f-subs-id pl-4">{' ( ' + getCallieIdToShow(fromData.mcptt_id) + ' )'}</p>
            </div>

            <div class="cad-to pl-4">
                <img
                    src={`/assets/images/cad-arrow.svg`}
                    id="w-node-5470f4d863f4-c405450c"
                    alt=""
                    class="pl-12 pr-12"
                />
                {RenderIcon(toData.subscriber_type, setIconColor(toData))}
                <span class="f-text-14b dark pl-4">{toData.contactName ? toData.contactName : getCallieIdToShow(data.callId2)}</span>
                <p class="f-subs-id pl-4">{' ( ' + getCallieIdToShow(toData.mcptt_id ? toData.mcptt_id : data.callId2) + ' )'}</p>
            </div>

            <div class="cad-info">
                <span
                    class="f-status pl-12"
                    style={!isGrant ? { color: '#3071F2', fontWeight: 'bold' } : { color: '#2AC769', fontWeight: 'bold' }}>
                    {!isGrant ? 'CAD ' + getCallieIdToShow(data.toId) + ' : ' + (toData.contactName ? toData.contactName : getCallieIdToShow(data.callId2)) : 'Authorizing request'}
                </span>
            </div>

            <div class="act-indv-discon">
                <button
                    class="discon w100 h100"
                    onClick={() => updateCallAction("DISCONNECTED")}
                    type="button"
                    name=""
                >
                    <img
                        src={`/assets/images/Vector-3.svg`}
                        id="w-node-5470f4d863f4-c405450c"
                        alt=""
                    />
                </button>
            </div>
            <div class="cad-accept">
                <button
                    class="btn cad_grant"
                    data-toggle="button"
                    aria-pressed="false"
                    disabled={isGrant}
                    onClick={() => updateCallAction("GRANT_REQUEST")}
                >
                    <img src={`/assets/images/cad-accept.svg`} alt='' />
                </button>
            </div>
        </div>
    )
}

const mapStateToProps = ({ auth, communication }) => {
    const { user } = auth;
    const { contactList } = communication;
    return {
        user, contactList
    };
};


export default connect(mapStateToProps, { updateCADCall })(IncomingCAD)
