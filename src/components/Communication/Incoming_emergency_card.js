import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux'

import { } from '../../components/commom';
import { subscriberType } from '../../constants/constants';
import { CallAction } from '../../models/callAction';
import { sendGroupCallAction, sendIndividualCallAction } from '../../modules/communication';
import { getCallieIdToShow } from '../../utils/lib';
// import './comunication.scss'

const IncomingEmergencyCard = ({ data, contactList, user, sendGroupCallAction, sendIndividualCallAction }) => {

  const [disconnect, setDisconnect] = useState(false);
  const [answer, setAnswer] = useState(false);

  const getCallieName = (id) => {
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
        setDisconnect(false);
        break;
      default:
        break;
    }
    const call = new CallAction(data, type);
    const sub_type = getCallieName(data.fromId).subscriber_type;
    if (sub_type === subscriberType['GROUP']) {
      sendGroupCallAction(user, call)
    }
    else {
      sendIndividualCallAction(user, call)
    }
  };

  const Name = getCallieName(data.fromId).contactName;
  const isGroup = getCallieName(data.fromId).subscriber_type === subscriberType['GROUP'];
  const isMax = Name && Name.length > 10 ? true : false;
  //console.log('CALL INCOMING Emergency...', data);
  return (
    <div class="inc-card-grid-emg m-t-6">
      <div class="inc-discon">
        <button class="discon w100 h100" onClick={() => updateCallAction("DISCONNECTED")}>
          <img
            src="/assets/images/Vector-3.svg"
            id="w-node-5470f4d863f4-c405450c"
            alt=""
          />
        </button>
      </div>
      <div class="inc-header">
        <div class="inc-id">
          <div class="id m-t-6">
            <p class="f-subs-id m-l-6">{getCallieIdToShow(data.fromId)}</p>
          </div>
        </div>
        <div class="inc-icon">
          <div class="icon">
            <img
              class="m-t-8 m-r-8"
              src={`assets/images/${isGroup ? 'Vector-6' : 'Vector-7'}.svg`}
              style={{ float: 'right' }}
              id="w-node-1ba3dc3bb5b2-c405450c"
              alt=""
            />
          </div>
        </div>
      </div>
      <div class="inc-name">
        <p class={"f-subs-name dark m-l-6 " + (isMax ? "f-14" : "")}>{Name}</p>
      </div>
      <div class="inc-ptt">
        <button class="ptt emergency-ptt w100 h100" onClick={() => updateCallAction("ANSWER")}>
          <img src="/assets/images/Vector-4.svg" alt='' />
        </button>
      </div>
    </div>
  )
}

const mapStateToProps = ({ communication, auth }) => {
  const { contactList } = communication;
  const { user } = auth;
  return {
    contactList,
    user
  };
};

export default connect(mapStateToProps, { sendGroupCallAction, sendIndividualCallAction })(IncomingEmergencyCard)
