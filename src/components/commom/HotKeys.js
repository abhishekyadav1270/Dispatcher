import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Popup } from 'semantic-ui-react'
import { ButtonGroup, ToggleButton } from 'react-bootstrap'

import SearchableDropdown from './SearchableDropdown';
import { otherStatus, paAlerts, priorityOptions, sdsTypes, statusOption, subscriberType } from '../../constants/constants'
import { GroupTextMessage, IndividualTextMessage } from '../../models/message'
import { sendGroupCall, sendIndividualCall, sendTextMessage } from '../../modules/communication'
import { showMessage } from '../../modules/alerts'
import { sendStatus } from '../../modules/alarm'
import { GroupStatusMessage, IndividualStatusMessage } from '../../models/statusMessage'
import { GroupCall, IndividualCall } from '../../models/call'
import { getCallType } from '../../utils/lib'
import MenuQuickAction from '../../components/commom/MenuQuickAction';

const HotKeys = ({
    divclass,
    title,
    Icon,
    subheader,
    type,
    sub,
    defPrior,
    //REDUX
    user,
    //Actions
    sendTextMessage,
    sendStatus,
    showMessage,
    //CALL
    sendGroupCall,
    sendIndividualCall
}) => {
    const [selected, setSelected] = useState("Status Alerts");
    const [sdsMsg, setSdsMsg] = useState("");
    const [statusCode, setCode] = useState("");
    const [immed, setImmed] = useState(true);
    const [delivery, setDelivery] = useState(false);
    const [consumed, setConsumed] = useState(false);
    const [selectedSdsOpt, setSelectedOption] = useState("");
    const [selectedPriority, setPriority] = useState('MEDIUM')
    const [showAction, setShowAction] = useState(false);

    const validateData = (selOpt) => {
        if (!sub.mcptt_id) {
            showMessage({ header: 'SDS', content: 'Failed to select subscriber!', type: 'error' })
            return;
        }
        setSelectedOption(selOpt);
        setCode('');
        setShowAction(true)
    }

    const clearSeln = () => {
        setSelectedOption('');
        setShowAction(false);
        setSdsMsg('');
    }

    const sendSDS = () => {
        if (!sub) {
            showMessage({ header: 'SDS', content: 'Please select subscriber!', type: 'error' })
            return;
        }
        const sendTo = sub
        if (selected === 'Custom') {
            if (!sdsMsg) {
                showMessage({ header: 'SDS', content: 'Please enter SDS text message!', type: 'error' })
                return;
            }
            const toId = sendTo.mcptt_id;
            const fromId = user && user.profile.mcptt_id;
            const report = { imm: immed, dely: delivery, consd: consumed }
            const message = (sendTo.subscriber_type === subscriberType['GROUP']) ? new GroupTextMessage(sdsMsg, toId, fromId, report) : new IndividualTextMessage(sdsMsg, toId, fromId, report)
            // console.log('SEND',message)
            setSdsMsg('');
            sendTextMessage(user, message);
        }
        else {
            if (sendTo && statusCode) {
                const toId = sendTo.mcptt_id;
                const message = (sendTo.subscriber_type === subscriberType['GROUP']) ?
                    new GroupStatusMessage(statusCode.code, toId)
                    : new IndividualStatusMessage(statusCode.code, toId)
                // console.log('STATUS MSG',message)
                setCode('');
                sendStatus(user, message)
            }
            else {
                showMessage({ header: 'SDS', content: 'Please enter required details!', type: 'error' })
            }
        }
    }

    const initiateCall = () => {
        const sendTo = sub;
        //console.log('Hot key tetraId and type ', sendTo, sendTo.mcptt_id,type, selectedPriority)
        if (sendTo && sendTo.mcptt_id) {
            if (type) {
                let callPriority = selectedPriority
                if (type === 'emgGroupCall') {
                    callPriority = 'EMERGENCY'
                }
                const call = sendTo.subscriber_type === subscriberType['GROUP'] ?
                    new GroupCall(getCallType(type), sendTo.mcptt_id, callPriority)
                    : new IndividualCall(getCallType(type), sendTo.mcptt_id, callPriority);
                if (sendTo.subscriber_type === subscriberType['GROUP']) {
                    sendGroupCall(user, call)
                }
                else {
                    sendIndividualCall(user, call)
                }
            }
            else showMessage({ header: 'Call', content: 'Please select call type!', type: 'error' })
        }
        else {
            showMessage({ header: 'Call', content: 'Please select subscriber!', type: 'error' })
        }
    }

    return (
        <React.Fragment>
            {!defPrior ?
                <Popup
                    className='hotkey-popup'
                    hideOnScroll
                    trigger={
                        <div class={divclass}>
                            {Icon?
                            <button
                                id="popover-radio"
                                title={title}
                                // ref="buttoncomradio"
                                class="sq-icon-btn"
                            >
                                <i class={Icon}></i>
                            </button>
                            :
                            <p>{title}</p>
                        }
                        </div>
                    }
                    style={{ padding: 0 }}
                    content={
                        <React.Fragment>
                            {type === 'SDS' ?
                                <div class>
                                    <div class="popover-grid" style={selectedSdsOpt === "PA Anouncement" ? { width: '270px' } : {}}>
                                        <div class="pop-header">
                                            <div class="pop-header-grid">
                                                <div class="pop-name">
                                                    <div>
                                                        <p class="f-pop-title"> {subheader ? subheader : title}</p>
                                                    </div>
                                                </div>
                                                <div class="pop-icom">
                                                    <i class={Icon}></i>
                                                </div>
                                            </div>
                                        </div>

                                        <div class="pop-body">
                                            <div>
                                                <div class="f-pop-text">{sub.contactName}</div>
                                            </div>
                                            <div class="body-flex">
                                                <ButtonGroup toggle>
                                                    {sdsTypes.map((radio, idx) => (
                                                        <ToggleButton
                                                            key={idx}
                                                            size="lg"
                                                            type="radio"
                                                            variant="outline-el-m-dark-pop"
                                                            name="radio"
                                                            value={radio.value}
                                                            checked={selected === radio.value}
                                                            onChange={(e) => setSelected(e.target.value)}
                                                        >
                                                            {radio.text}
                                                        </ToggleButton>
                                                    ))}
                                                </ButtonGroup>
                                            </div>

                                            <div class='body-flex m-t-10'><p class="f-widg-label black">{selected === 'Custom' ? 'Message' : selected}</p></div>
                                            <div class="widg-grid-2 m-b-10">
                                                <div class="widg-b1">
                                                    {selected !== 'Custom' ?
                                                        <React.Fragment>
                                                            <ButtonGroup toggle>
                                                                {statusOption.map((radio, idx) => (
                                                                    <ToggleButton
                                                                        key={idx}
                                                                        size="lg"
                                                                        type="radio"
                                                                        name="radio"
                                                                        variant="outline-el-m-dark-pop"
                                                                        id="btn-radios-2"
                                                                        value={radio.value}
                                                                        checked={selectedSdsOpt === radio.value}
                                                                        onChange={(e) => validateData(e.target.value)}
                                                                    >
                                                                        <i class={radio.iconClass}></i>
                                                                    </ToggleButton>
                                                                ))}
                                                                {/* <SearchableDropdown   
                                                            options={selectedSdsOpt==='Other'?otherStatus:paAlerts}
                                                            title={selectedSdsOpt==='Other'?'Other Status':'PA Status'}
                                                            type={'buttonDropdown'}
                                                            setSelection={(status)=>{setCode(status)}}
                                                            buttonName={statusCode?statusCode.desc:'Select '+selectedSdsOpt}
                                                            //buttonClass="btn dropdown-toggle btn-rgba-el-m-dark btn-lg"
                                                            variant={'outline-el-m-dark-pop'}
                                                        /> */}
                                                            </ButtonGroup>
                                                        </React.Fragment> : null}
                                                    {selected === 'Custom' ?
                                                        <textarea
                                                            class="textinput-white mb-4"
                                                            placeholder="Write SDS Message here..."
                                                            style={{ width: '220px', height: '45px' }}
                                                            value={sdsMsg}
                                                            onChange={(e) => setSdsMsg(e.target.value)}
                                                        ></textarea> : null}
                                                </div>
                                            </div>
                                        </div>

                                        <div class="pop-footer">
                                            <div class="single-dropdown in-blc mr-8">
                                                {selected === 'Custom' ?
                                                    <div class="dropdown">
                                                        <button
                                                            class="btn btn-mildgreen-solid dropdown-toggle"
                                                            type="button"
                                                            id="dropdownMenuButton"
                                                            data-toggle="dropdown"
                                                            aria-haspopup="true"
                                                            aria-expanded="false"
                                                        >
                                                            {(immed || delivery || consumed) ? 'Report Added' : 'No Report'}
                                                        </button>
                                                        <div
                                                            class="dropdown-menu"
                                                            aria-labelledby="dropdownMenuButton"
                                                        >
                                                            <div class="dropdown-item">
                                                                <input type="checkbox" class='checkBox' defaultChecked={immed} onClick={() => setImmed(!immed)}/>&nbsp;&nbsp;Immediate
                                                            </div>
                                                            <div class="dropdown-item">
                                                                <input type="checkbox" class='checkBox' onClick={() => setDelivery(!delivery)} />&nbsp;&nbsp;Request Delivery Report
                                                            </div>
                                                            <div class="dropdown-item">
                                                                <input type="checkbox" class='checkBox' onClick={() => setConsumed(!consumed)} />&nbsp;&nbsp;Request Consumed Report
                                                            </div>
                                                        </div>
                                                    </div>
                                                    : null}
                                            </div>
                                            {selected === 'Custom' &&
                                                <button class="btn bg_lime-6 flt-r" onClick={sendSDS}>
                                                    Send SDS<i class="feather icon-chevron-right m-l-4"></i>
                                                </button>
                                            }
                                        </div>
                                    </div>
                                </div>
                                : null}
                            {type !== 'SDS' ?
                                <div class>
                                    <div class="popover-grid">
                                        <div class="pop-header">
                                            <div class="pop-header-grid">
                                                <div class="pop-name">
                                                    <div>
                                                        <p class="f-pop-title">{subheader ? subheader : title}</p>
                                                    </div>
                                                </div>
                                                <div class="pop-icom">
                                                    <i class={Icon}></i>
                                                </div>
                                            </div>
                                        </div>

                                        <div class="pop-body">
                                            <div>
                                                <div class="f-pop-text">{sub.contactName}</div>
                                            </div>
                                        </div>

                                        <div class="pop-footer">
                                            <ButtonGroup toggle>
                                                {priorityOptions.map((radio, idx) => (
                                                    <ToggleButton
                                                        key={idx}
                                                        size="lg"
                                                        type="radio"
                                                        variant="outline-el-m-dark-pop"
                                                        name="radio"
                                                        value={radio.value}
                                                        checked={selectedPriority === radio.value}
                                                        onChange={(e) => setPriority(e.target.value)}
                                                    >
                                                        {radio.text}
                                                    </ToggleButton>
                                                ))}
                                            </ButtonGroup>
                                            <button class="btn bg_lime-6 flt-l m-t-10" onClick={initiateCall}>
                                                Initiate Call<i class="feather icon-chevron-right m-l-4"></i>
                                            </button>
                                        </div>

                                    </div>
                                </div> : null}
                        </React.Fragment>
                    }
                    on='click'
                    position='bottom center'
                />
                :
                <div class={divclass}>
                    <button
                        id="popover-radio"
                        title={title}
                        // ref="buttoncomradio"
                        class="sq-icon-btn"
                        onClick={initiateCall}
                    >
                        <i class={Icon}></i>
                    </button>
                </div>
            }
            {showAction ?
                <MenuQuickAction
                    open={showAction}
                    closeModal={(v) => clearSeln()}
                    type={selectedSdsOpt == 'Other' ? 'sdsStatus' : 'predefinedPA'}
                    id={sub.mcptt_id}
                />
                : null}
        </React.Fragment>
    )
}

const mapStateToProps = ({ communication, auth }) => {
    // const { contactList } = communication;
    const { user } = auth;
    return {
        // contactList,
        user
    };
};

export default connect(mapStateToProps, { sendTextMessage, sendStatus, showMessage, sendGroupCall, sendIndividualCall })(HotKeys)