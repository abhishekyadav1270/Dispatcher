import React, { useState, useEffect, useRef } from 'react'
import { connect } from 'react-redux'
import { push } from 'react-router-redux'
import { ButtonGroup, ToggleButton, Dropdown, Button, } from 'react-bootstrap'
import { SearchableDropdown } from '../commom';
import { pbxDomainConfig } from "../../constants/constants";
//Other
import { } from '../../modules/actions';
import { showMessage } from '../../modules/alerts'
import { sendIndividualCall, sendIndividualCallAction, sendGroupCall } from '../../modules/communication'
import { IndividualCall, GroupCall } from '../../models/call'
import { CallAction } from '../../models/callAction'
import { subscriberType, priorityOptions } from '../../constants/constants';
import { updateTab } from '../../modules/activityLog';
import Dial from '../Dialer/Dialer';

const CallWidget = ({
    contactList,
    user,
    userProfile,
    dialerdomainOptions,
    showMessage,
    sendIndividualCall,
    sendIndividualCallAction,
    sendGroupCall,
    navigateToCom,
    updateTab,
    activeTab,
    configDomain,
    configAmbienceListening
}) => {
    const [options, setOptions] = useState([
        { text: "Individual", value: "Individual Call" },
        { text: "Group", value: "Group Call" },
    ]);

    const [selected, setSelected] = useState("Individual Call");
    const [selectedPrior, setSelectedPrior] = useState("LOW");
    const [callType, setCallType] = useState({ name: 'duplex', value: 'Duplex Call' });
    const [filteredContacts, setfiltered] = useState([]);
    const [selectedSubscriber, setSubscriber] = useState(null);
    const [seen1, setSeen1] = useState(true);
    const [seen2, setSeen2] = useState(false);
    const [showdailpad, setShowDailPad] = useState(false);

    const subrRef = useRef(null)

    useEffect(() => {
        filterSubscriberData(selected)
    }, [contactList])

    //functions
    const hideit = () => {
        setSeen1(!seen1)
        setSeen2(!seen2)
    }

    const filterSubscriberData = (type) => {
        let filteredContact, filterSubscr;
        if (type === 'Individual Call') {
            filteredContact = filterData(contactList.filter(cont => cont.subscriber_type !== subscriberType['GROUP']));
        }
        if (type === 'Group Call') {
            filteredContact = filterData(contactList.filter(cont => cont.subscriber_type === subscriberType['GROUP']));
        }
        // filteredContact=filterSubscr.map(sub=>{ return({key:sub.mcptt_id,value:sub.mcptt_id,text:sub.contactName})})
        setfiltered(filteredContact);
    };

    const filterData = (array) => {
        const disabled = array.filter(x => x.Reg_status !== 'Registered')
        const enabled = array.filter(x => x.Reg_status === 'Registered')
        const rebuilt = [...enabled, ...disabled];
        return rebuilt;
    };

    const getCallType = (type, icon = false) => {
        if (!icon) {
            switch (type) {
                case 'duplex':
                    return 'DUPLEX_INDIVIDUAL_CALL'
                case 'simplexHook':
                    return 'SIMPLEX_INDIVIDUAL_HOOK_CALL'
                case 'simplexDirect':
                    return 'SIMPLEX_INDIVIDUAL_DIRECT_CALL'
                case 'ambient':
                    return 'AMBIENT_LISTENING_CALL'
                case 'groupCall':
                    return 'SIMPLEX_GROUP_CALL'
                case 'broadcast':
                    return 'SIMPLEX_BROADCAST_GROUP_CALL'
                default:
                    return 'CALL'
            }
        }
        else {
            switch (type) {
                case 'duplex':
                    return 'feather icon-phone-outgoing'
                case 'simplexHook':
                    return 'feather icon-phone-call'
                case 'simplexDirect':
                    return 'feather icon-phone-outgoing'
                case 'ambient':
                    return 'feather icon-phone-call'
                case 'groupCall':
                    return 'feather icon-phone-outgoing'
                case 'broadcast':
                    return 'la la-bullhorn'
                default:
                    return 'CALL'
            }
        }
    }

    const initiateCall = () => {
        const sendTo = JSON.parse(selectedSubscriber);
        if (sendTo && sendTo.mcptt_id) {
            if (callType && callType.name) {
                //console.log('Hot key emg tetraId and priority', sendTo, selectedPrior)
                const call = sendTo.subscriber_type === subscriberType['GROUP'] ?
                    new GroupCall(getCallType(callType.name), sendTo.mcptt_id, selectedPrior)
                    : new IndividualCall(getCallType(callType.name), sendTo.mcptt_id, selectedPrior);
                if (sendTo.subscriber_type === subscriberType['GROUP']) {
                    sendGroupCall(user, call)
                }
                else {
                    sendIndividualCall(user, call)
                }
                if (activeTab !== 'communication') {
                    navigateToCom()
                    updateTab('communication')
                }
                clearSelection();
            }
            else showMessage({ header: 'Call', content: 'Please select call type!', type: 'error' })
        }
        else {
            showMessage({ header: 'Call', content: 'Please select subscriber!', type: 'error' })
        }
    }

    const initiateDialerCall = (dialerId, domaingroup) => {
       // console.log("call making from dialpad ", configDomain, dialerId, domaingroup);

        let toIdDomain = domaingroup ? domaingroup : "";
        
        let callTypeName = callType.name;
        let callMode = selected;
        if (toIdDomain && toIdDomain.includes('pbx')) {
            callTypeName = 'duplex';
            callMode = 'Individual Call';
        }

        let call = callMode === 'Individual Call' ?
            new IndividualCall(getCallType(callTypeName), dialerId, selectedPrior) :
            new GroupCall(getCallType(callTypeName), dialerId, selectedPrior)

        call = { ...call, toId: `${call.toId}@${toIdDomain}` }

        console.log("call making from dialpad ", call, callMode, callTypeName);

        if (callMode === 'Individual Call')
            sendIndividualCall(user, call)
        else
            sendGroupCall(user, call)
        if (activeTab !== 'communication') {
            navigateToCom()
            updateTab('communication')
        }
        setShowDailPad(false)
    }

    const clearSelection = () => {
        subrRef.current.clearSelection()
        setSelectedPrior('LOW');
        //setCallType('');
        setSubscriber(null);
    }

    const updateCallType = (val) => {
        if (val === 'Group Call') {
            setCallType({ name: 'groupCall', value: 'Group Call' });
        } else {
            setCallType({ name: 'duplex', value: 'Duplex Call' });
        }
    }

    return (
        <div>
            {seen1 && !showdailpad ?
                <div id="call1" v-if="seen1">
                    <div class="main-widg-grid">
                        <div class="widg-header">
                            <div class="title-grid-4">
                                <div class="title">
                                    <p class="f-title-m white in-blc">New Call</p>
                                </div>
                                {/* <div class="search">
                                    <button
                                        class="btn btn-rgba-quick-link btn-rounded btn-sm white muli"
                                        id="new_dgna"
                                        onClick={hideit}
                                    >
                                        Create Contact
                                    </button>
                                </div> */}
                            </div>
                            {/* <p class="f-text-10 all-caps ml-1 m-t-10" style={{ color: '#8A98AC' }}>GROUP OR INDIVIDUAL CALL</p> */}
                            <div class="v_center m-t-12">
                                <ButtonGroup toggle >
                                    {options.map((radio, idx) => (
                                        <ToggleButton
                                            key={idx}
                                            size="lg"
                                            type="radio"
                                            //name="radio"
                                            variant="outline-el-m-dark"
                                            id="btn-radios-2"
                                            name={radio.value}
                                            value={radio.value}
                                            checked={selected === radio.value}
                                            onChange={(e) => { setSelected(e.target.value); filterSubscriberData(e.target.value); clearSelection(); updateCallType(e.target.value) }}
                                        >
                                            {radio.text}
                                        </ToggleButton>
                                    ))}
                                </ButtonGroup>
                            </div>
                        </div>
                        <div class="widg-body m-t-12">
                            <div class="">
                                <div class='m-b-15'><p class="white m-l-8 m-t-12 f-12">Call Priority</p></div>
                                <ButtonGroup toggle>
                                    {priorityOptions.map((radio, idx) => (
                                        <ToggleButton
                                            key={idx}
                                            size="lg"
                                            type="radio"
                                            name="radio"
                                            variant="outline-el-b-dark"
                                            id="btn-radios-4"
                                            value={radio.value}
                                            checked={selectedPrior === radio.value}
                                            onChange={(e) => setSelectedPrior(e.target.value)}
                                        >
                                            {radio.text}
                                        </ToggleButton>
                                    ))}
                                </ButtonGroup>
                            </div>
                            <div class='m-t-15'><p class="white m-l-12 m-t-15">Subscriber Identity</p></div>
                            <div class="widg-grid-2 m-t-4 m-b-15 m-t-15">
                                <div class="widg-a"></div>
                                <div class="widg-b1">
                                    <SearchableDropdown
                                        ref={subrRef}
                                        options={filteredContacts}
                                        type={'SearchDropdown'}
                                        setSelection={(sub) => { setSubscriber(sub) }}
                                    />
                                </div>
                                <div class="widg-c" onClick={() => setShowDailPad(true)}>
                                    <img class="x18 m-t-5 m-l-5" src="/assets/icons/ion_keypad.svg" alt='' />
                                </div>
                            </div>
                            <div class="dropdown-divider"></div>
                            <div>
                                <Dropdown as={ButtonGroup}
                                    className="w90 m-t-16 f-bold w-100"
                                    menu-class="w-100">
                                    <Button onClick={initiateCall} variant="mainyellow"
                                    // style={{ width: '25vh' }}
                                    >
                                        <i class={"m-r-8 " + getCallType(callType.name, true)}></i>
                                        {callType && callType.name ? callType.value : 'Select call type'}
                                    </Button>
                                    <Dropdown.Toggle split variant="mainyellow" id="dropdown-custom-2" />
                                    <Dropdown.Menu className="super-colors">
                                        {selected !== 'Group Call' ?
                                            <div>
                                                <Dropdown.Item onClick={() => setCallType({ name: 'simplexHook', value: 'Hook Call' })}><i class="feather icon-phone-call m-r-8"></i>Hook Call</Dropdown.Item>
                                                <Dropdown.Item onClick={() => setCallType({ name: 'simplexDirect', value: 'Direct Call' })}><i class="feather icon-phone-outgoing m-r-8"></i>Direct Call</Dropdown.Item>
                                                <Dropdown.Item onClick={() => setCallType({ name: 'duplex', value: 'Duplex Call' })}><i class="feather icon-phone-outgoing m-r-8"></i>Duplex Call</Dropdown.Item>
                                                {global.config.project != 'dhaka' && configAmbienceListening ?
                                                    <Dropdown.Item onClick={() => setCallType({ name: 'ambient', value: 'Ambience Call' })}><i class="feather icon-phone-call m-r-8"></i>Ambience Call</Dropdown.Item>
                                                    : null}
                                            </div> : null}
                                        {selected === 'Group Call' ?
                                            <React.Fragment>
                                                <Dropdown.Item onClick={() => setCallType({ name: 'groupCall', value: 'Group Call' })}><i class="feather icon-phone-call m-r-8"></i>Group Call</Dropdown.Item>
                                                <Dropdown.Item onClick={() => setCallType({ name: 'broadcast', value: 'Broadcast Call' })}><i class="la la-bullhorn m-r-8"></i>Broadcast Call</Dropdown.Item>
                                            </React.Fragment>
                                            : null}
                                    </Dropdown.Menu>
                                </Dropdown>
                            </div>
                        </div>
                        <div class="widg-footer"></div>
                    </div>
                </div> : null}
            {seen2 ?
                <div class="" id="call2" v-if="seen2">
                    <div class="main-widg-grid">
                        <div class="widg-header">
                            <div class="title-grid-4">
                                <div class="title">
                                    <p class="f-title-m white in-blc">Create Contact</p>
                                </div>
                                <div class="search">
                                    <button class="btn btn-success" id="new_dgna"
                                        onClick={hideit}>
                                        Save Contact
                                    </button>
                                </div>
                            </div>
                            <p class="f-text-10 all-caps ml-1" style={{ color: '#8A98AC' }}>GROUP OR INDIVIDUAL CALL</p>
                            <div class="v_cente m-t-15">
                                <ButtonGroup toggle>
                                    {options.map((radio, idx) => (
                                        <ToggleButton
                                            key={idx}
                                            size="lg"
                                            type="radio"
                                            //name="radio"
                                            // variant="outline-el-m-dark"
                                            id="btn-radios-2"
                                            name="radio-btn-outline"
                                            value={radio.value}
                                            checked={selected === radio.value}
                                            onChange={(e) => console.log('Radiobutton')}
                                        >
                                            {radio.text}
                                        </ToggleButton>
                                    ))}
                                </ButtonGroup>

                                <button
                                    class="btn btn-outline-warning m-l-30"
                                    data-toggle="button"
                                    aria-pressed="false"
                                >
                                    <i class="feather icon-star m-r-4"></i>Fav
                                </button>
                            </div>
                        </div>
                        <div class="widg-body">
                            <div class="in-flex w100 m-t-15">
                                <div class="w50 in-blc">
                                    <p class="f-widg-label">Subscriber ID</p>
                                    <input
                                        class="textinput w100"
                                        type="text"
                                        placeholder="Subscriber ID"
                                    />
                                </div>

                                <div class="w45 in-blc">
                                    <p class="f-widg-label">Alias Name</p>
                                    <input
                                        class="textinput w100 m-l-8"
                                        type="text"
                                        placeholder="Alias Name"
                                    />
                                </div>
                            </div>
                            <div class="wrap-2 border-2 m-t-15">
                                <p class="f-text-10 all-caps ml-1" style={{ color: '#8A98AC' }}>Dynamic Group Members</p>
                                <div class="ovr-scr-y m-b-4" style={{ height: '140px' }}>
                                    <div class="dgna-row-grid">
                                        <div class="dgna-grp">
                                            <span class="f-text-12">Subscriber Name</span>
                                        </div>
                                        <div class="dgna-id">
                                            <span class="f-text-12">1000007</span>
                                        </div>
                                        <div class="dgna-act">
                                            <button class="icon-btn">
                                                <i class="dripicons-cross"></i>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                                <div class="input-group m-t-15">
                                    <input
                                        type="text"
                                        class="textinput searchinput-sq"
                                        placeholder="Recipient's username"
                                        aria-label="Recipient's username"
                                        aria-describedby="button-addon-group"
                                    />
                                    <div class="input-group-append">
                                        <button
                                            class="btn btn-success"
                                            type="button"
                                            id="button-addon-group"
                                        >
                                            Add
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="widg-footer"></div>
                    </div>
                </div> : null}
            {showdailpad &&
                <div>
                    <Dial dialerDomain={dialerdomainOptions} onClose={() => setShowDailPad(false)} onDialPadCall={(dialerId, domainGroup) => initiateDialerCall(dialerId, domainGroup)} />
                </div>
            }
        </div>
    )
}

const mapStateToProps = ({ communication, auth, logs, domains, enableAmbienceListening, dialerDomainOption }) => {
    const { contactList } = communication;
    const { user, userProfile } = auth;
    const { activeTab } = logs;
    const { configDomain } = domains;
    const { configAmbienceListening } = enableAmbienceListening;
    const { dialerdomainOptions } = dialerDomainOption;
    return {
        contactList,
        user,
        userProfile,
        activeTab,
        configDomain,
        configAmbienceListening,
        dialerdomainOptions
    };
};

export default connect(mapStateToProps, {
    showMessage,
    sendIndividualCall,
    sendIndividualCallAction,
    sendGroupCall,
    updateTab,
    navigateToCom: () => push('/communication')
})(CallWidget);
