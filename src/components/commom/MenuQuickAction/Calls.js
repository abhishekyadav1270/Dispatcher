import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux'
import { ButtonGroup, ToggleButton, Button } from 'react-bootstrap'
import { push } from 'react-router-redux'

import { priorityOptions, subscriberType } from '../../../constants/constants';
import { sendGroupCall, sendIndividualCall } from '../../../modules/communication';
import { showMessage } from '../../../modules/alerts';
import { GroupCall, IndividualCall } from '../../../models/call';
import { updateTab } from '../../../modules/activityLog';


//Other

const CallsQuickAction = (props) => {
    const [selectedPrior, setSelectedPrior] = useState("LOW");

    //PROPS
    const { close, sub, user, callType, showMessage, children, sendGroupCall, sendIndividualCall, activeTab, navigateToCom, updateTab, prior } = props;

    useEffect(() => {
        if (prior) setSelectedPrior(prior)
    }, [])

    //functions
    const getCallType = (type) => {
        if (type) {
          switch (type) {
            case "duplex":
              return "DUPLEX_INDIVIDUAL_CALL";
            case "simplexHook":
              return "SIMPLEX_INDIVIDUAL_HOOK_CALL";
            case "simplexDirect":
              return "SIMPLEX_INDIVIDUAL_DIRECT_CALL";
            case "ambient":
              return "AMBIENT_LISTENING_CALL";
            case "groupCall":
              return "SIMPLEX_GROUP_CALL";
            case "broadcast":
              return "SIMPLEX_BROADCAST_GROUP_CALL";
            case "LivePA":
              return "SIMPLEX_BROADCAST_GROUP_CALL";
            case "LivePAStn":
                return "SIMPLEX_INDIVIDUAL_DIRECT_CALL";
            default:
              return "CALL";
          }
        }
      };
    const initiateCall = () => {
        const sendTo = sub;
        if (sendTo && sendTo.mcptt_id) {
            if (callType) {
                const call = sendTo.subscriber_type === subscriberType['GROUP'] ?
                    new GroupCall(getCallType(callType), sendTo.mcptt_id, selectedPrior)
                    : new IndividualCall(getCallType(callType), sendTo.mcptt_id, selectedPrior, sendTo.isFACall ? sendTo.isFACall : false);
                if (sendTo.subscriber_type === subscriberType['GROUP']) {
                    sendGroupCall(user, call)
                }
                else {
                    sendIndividualCall(user, call)
                }
                close(false)
                if (activeTab !== 'communication') {
                    navigateToCom()
                    updateTab('communication')
                }
            }
        }
        else {
            showMessage({ header: 'Call', content: 'Could not get subscriber details!', type: 'error' })
        }
    }

    return (
        <div class='p-l-10 p-r-10 m-b-10'>
            {children}
            <div class="m-t-15">
                <div class='m-b-5'>
                    <p class="black m-l-8 m-t-12 f-12">Select Call Priority</p></div>
                <ButtonGroup toggle>
                    {priorityOptions.map((radio, idx) => (
                        <ToggleButton
                            key={idx}
                            size="lg"
                            type="radio"
                            name="radio"
                            variant="outline-el-b-dark"
                            id="btn-radios-4"
                            style={{ color: '#000' }}
                            value={radio.value}
                            checked={selectedPrior === radio.value}
                            onChange={(e) => setSelectedPrior(e.target.value)}
                        >
                            {radio.text}
                        </ToggleButton>
                    ))}
                </ButtonGroup>
            </div>
            <div class="widg-b2 al-center m-t-15">
                <Button variant="success" onClick={initiateCall}>
                    Initiate Call<i class="feather icon-chevron-right m-l-4"></i>
                </Button>
            </div>
        </div>
    )
}

const mapStateToProps = ({ auth, logs }) => {
    const { user } = auth;
    const { activeTab } = logs;
    return {
        user, activeTab
    };
};

export default connect(mapStateToProps, {
    showMessage,
    sendGroupCall,
    sendIndividualCall,
    updateTab,
    navigateToCom: () => push('/communication')
})(CallsQuickAction);
