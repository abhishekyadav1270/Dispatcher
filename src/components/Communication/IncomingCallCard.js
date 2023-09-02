import React, { useState } from 'react'
import { connect } from 'react-redux'

import { } from '../../components/commom';
import { subscriberType } from '../../constants/constants';
import { CallAction } from '../../models/callAction';
import { sendGroupCallAction, sendIndividualCallAction } from '../../modules/communication';
import { getCallieIdToShow } from '../../utils/lib'
import { decodeCallPriority } from '../../constants/constants'

const IncomingCallCard = ({ data, contactList, sendGroupCallAction, sendIndividualCallAction, user, radioData }) => {

    const [disconnect, setDisconnect] = useState(false);
    const [answer, setAnswer] = useState(false);

    const getCallie = (id) => {
        //const callerId = getCallieIdToShow(id)
        const subDetails = contactList.filter(cont =>
            //getCallieIdToShow(cont.mcptt_id) === callerId
            cont.mcptt_id == id
        );
        if (subDetails.length > 0) return subDetails[0]
        else return getCallieIdToShow(id)
    }

    const updateCallAction = (type) => {
        switch (type) {
            case "ANSWER":
                setAnswer(true)
                break;
            case "DISCONNECTED":
                setDisconnect(true);
                break;
            default:
                break;
        }
        const call = new CallAction(data, type);
        const sub_type = getCallie(data.fromId).subscriber_type;
        if (sub_type === subscriberType['GROUP']) {
            sendGroupCallAction(user, call)
        }
        else {
            sendIndividualCallAction(user, call)
        }
    };
    var trainID;
    const checkRTTCall = () => {
        const isRTTCallP = data.callPriority && decodeCallPriority(data.callPriority) === 'RTT';
        if (isRTTCallP) {
            // check train radio 11010
            let radios = radioData.filter(radio => radio.RadioID_A == getCallieIdToShow(data.fromId) || radio.RadioID_B == getCallieIdToShow(data.fromId))
            if (radios.length > 0) {
                trainID=radios[0].trainID;
                return true
            }
        }
        return false
    }

    console.log('incoming duplex call data...', data)
    let Name = getCallie(data.fromId).contactName;
    const isGroup = getCallie(data.fromId).subscriber_type === subscriberType['GROUP'];
    const isMax = Name && Name.length > 10 ? true : false;
    const isRTTCall = checkRTTCall();
    console.log('isRTTCall.....', isRTTCall)
    if (isRTTCall) {
        Name = Name + `( RTT-${trainID} )`
    }
    return (
        <div class={isRTTCall ? "inc-card-RTT-grid  m-t-10" : "inc-card-grid  m-t-10"}>
            <div class="inc-discon" onClick={() => updateCallAction("DISCONNECTED")}>
                <button class="discon w100 h100">
                    <img src="/assets/images/Vector-3.svg" id="w-node-5470f4d863f4-c405450c" alt="" />
                </button>
            </div>
            <div class="inc-header">
                <div class="inc-id">
                    <div class="id m-t-6">
                        <p class="f-subs-id m-l-6" >{getCallieIdToShow(data.fromId)}</p>
                    </div>
                </div>
                <div class="inc-icon">
                    <div class="icon">
                        <img class="m-t-8 m-r-8" src={`assets/images/${isGroup ? 'Vector-6' : 'Vector-7'}.svg`} style={{ float: 'right' }} id="w-node-1ba3dc3bb5b2-c405450c" alt="" />
                    </div>
                </div>
            </div>
            <div class="inc-name">
                <p class={"f-subs-name dark m-l-6" + (isMax ? "f-14" : "")} style={isMax ? { fontSize: '14px' } : {}}>{Name}</p>
            </div>
            <div class="inc-ptt">
                <button class="ptt w100 h100" onClick={() => updateCallAction("ANSWER")}>
                    <img src="/assets/images/Vector-4.svg" alt='' />
                </button>
            </div>
        </div>
    )
}

const mapStateToProps = ({ auth, communication, train }) => {
    const { user } = auth;
    const { contactList } = communication;
    const { radioData } = train;
    return {
        user, contactList, radioData
    };
};

export default connect(mapStateToProps, { sendGroupCallAction, sendIndividualCallAction })(IncomingCallCard)
