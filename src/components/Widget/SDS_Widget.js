import React, { useState, useEffect, useRef } from 'react'
import { connect } from 'react-redux'
import { ButtonGroup, ToggleButton, Dropdown } from 'react-bootstrap'

//Other
import { } from '../../modules/actions';
import { SearchableDropdown } from '../commom';
import { GroupTextMessage, IndividualTextMessage } from '../../models/message';
import { GroupStatusMessage, IndividualStatusMessage } from '../../models/statusMessage';
import { subscriberType, sdsTypes, otherStatus,statusOption,paAlerts } from '../../constants/constants';
import { sendTextMessage } from '../../modules/communication';
import { showMessage } from '../../modules/alerts';
import { sendStatus } from '../../modules/alarm';
//import { validateSDSMsg } from '../../utils/lib';
import MenuQuickAction from '../../components/commom/MenuQuickAction';


const SDSWidget = ({contactList,user,sendTextMessage,showMessage,forward,msg,closeForwardView,sendStatus}) => {
    const [options, setOptions] = useState(sdsTypes);
    const [selectedSubscriber, setSubscriber] = useState();
    const [selected, setSelected] = useState("Status Alerts");
    const [sdsMsg, setSdsMsg] = useState("");
    const [statusCode, setCode] = useState("");
    const [immed, setImmed] = useState(true);
    const [delivery, setDelivery] = useState(false);
    const [consumed, setConsumed] = useState(false);
    const [selectedSdsOpt, setSelectedOption] = useState("");
    const [showAction, setShowAction] = useState(false);
    const [selSubrID, setSubrID] = useState('');

    const subrRef = useRef(null)

    useEffect(() => {
        //code here
        //handleData()
        if(forward) {setSdsMsg(msg.message); setSelected('Custom')}
    }, [contactList])
    //functions

    const sendSDS = () =>{
        if (!selectedSubscriber) {
            showMessage({ header: 'SDS', content: 'Please select subscriber!', type: 'error' })
            return;
        }
        const sendTo = JSON.parse(selectedSubscriber)
        if (selected === 'Custom') {
            if (!sdsMsg) {
                showMessage({ header: 'SDS', content: 'Please enter SDS text message!', type: 'error' })
                return;
            }
            const toId = sendTo.mcptt_id;
            const fromId = user && user.profile.mcptt_id;
            const report = { imm: immed, dely: delivery, consd: consumed }
            const message = (sendTo.subscriber_type === subscriberType['GROUP']) ? new GroupTextMessage(sdsMsg, toId, fromId, report) : new IndividualTextMessage(sdsMsg, toId, fromId, report)
            // console.log('SEND SDS_WIDGET',message)  
            clearSeln()
            sendTextMessage(user, message);
            if (forward) {
                closeForwardView()
            }
        }
        else{
            if(sendTo && statusCode){
                const toId = sendTo.mcptt_id;
                const message = (sendTo.subscriber_type===subscriberType['GROUP'])? 
                    new GroupStatusMessage(statusCode.code,toId) 
                    : new IndividualStatusMessage(statusCode.code,toId)
                // console.log('STATUS MSG',message)
                setCode('');
                sendStatus(user, message)
            }
            else{
                showMessage({header: 'SDS', content: 'Please enter required details!', type: 'error'})
            }
        }
    }

    const validateData = (selOpt) => {
        if(!selSubrID){
            showMessage({header: 'SDS', content: 'Please select subcriber!', type: 'error'})
            return;
        }
        setSelectedOption(selOpt); 
        setCode('');
        setShowAction(true)
    }

    const clearSeln = () => {
        subrRef.current.clearSelection()
        setSelectedOption(''); 
        setShowAction(false);
        setSubscriber('');
        setSubrID('')
        setSdsMsg('');
    }

    return (
        <div class="main-widg-grid">
            <div class="widg-header">
                <div class="widg-grid-1">
                    <div class="widg-a"></div>
                    <div class="widg-b1 m-b-10"><p class="f-title-m white">{forward?'Forward SDS':'Send SDS'}</p></div>
                    <div class="widg-b2"></div>
                    <div class="widg-c"></div>
                </div>
                <p class="f-text-10 all-caps ml-1" style={{ color: '#8A98AC' }}>{(forward?'Forward':'SEND NEW')+' SDS FROM HERE'}</p>
            </div>
            <div class="widg-body">
                <div><p class="f-widg-label">Search Subscriber Name</p></div>
                <div class="widg-grid-2 m-t-10 m-b-10">
                    <div class="widg-a"></div>
                    <div class="widg-b1">
                        <SearchableDropdown
                            ref={subrRef}
                            options={contactList}
                            type={'SearchDropdown'}
                            setSelection={(sub)=>{setSubscriber(sub); setSubrID(JSON.parse(sub).mcptt_id)}}
                        />
                    </div>
                    <div class="widg-c">
                        <img alt='keypad' class="x18 m-t-5 m-l-5" src="/assets/icons/ion_keypad.svg" />
                    </div>
                </div>
                
                <div class='m-b-10'><p class="f-widg-label">Type of SDS</p></div>
                <ButtonGroup toggle>
                    {options.map((radio, idx) => (
                        <ToggleButton
                            key={idx}
                            size="lg"
                            type="radio"
                            name="radio"
                            variant="outline-el-m-dark"
                            id="btn-radios-2"
                            //name={radio.value}
                            value={radio.value}
                            checked={selected === radio.value}
                            onChange={(e) => {setSelected(e.target.value); setCode('')}}
                        >
                            {radio.text}
                        </ToggleButton>
                    ))}
                </ButtonGroup>

                <div class='m-t-10'><p class="f-widg-label">{selected==='Custom'?'Message':selected}</p></div>
                <div class="widg-grid-2 m-t-12">
                    <div class="widg-a"></div>
                    <div class="widg-b1">
                        {selected !=='Custom'?
                        <React.Fragment>
                            {/* <SearchableDropdown   
                                options={otherStatus}
                                title={'Other Statuses'}
                                type={'buttonDropdown'}
                                setSelection={(status)=>{setCode(status)}}
                                buttonName={statusCode?statusCode.desc:'Select '+selected}
                                buttonClass="btn dropdown-toggle btn-rgba-el-m-dark btn-lg"
                            /> */}
                            <ButtonGroup toggle>
                            {statusOption.map((radio, idx) => (
                                <ToggleButton
                                    key={idx}
                                    size="lg"
                                    type="radio"
                                    name="radio"
                                    variant="outline-el-b-dark"
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
                                buttonClass="btn dropdown-toggle btn-rgba-el-m-dark btn-lg m-l-100"
                            /> */}
                        </ButtonGroup>
                    </React.Fragment>:null}

                        {selected ==='Custom'?
                        <textarea
                            class="textinput w100"
                            placeholder="Write SDS Message here..."
                            style={{ height:'90px'}}
                            value={sdsMsg}
                            onChange={(e)=>setSdsMsg(e.target.value)}
                        ></textarea>:null}
                    </div>
                    <div class="widg-c"></div>
                </div>
            </div>
            <div class="widg-footer">
                <div class="widg-grid-1">
                    <div class="widg-a"></div>
                    <div class="widg-b1">
                        <div class="widg-grid-2">
                            <div class="widg-a"></div>
                            <div class="widg-b1">
                                <div class="single-dropdown">
                                {selected ==='Custom'?
                                    <div class="dropdown">
                                        <button
                                            class="btn btn-mildgreen-solid dropdown-toggle"
                                            type="button"
                                            id="dropdownMenuButton"
                                            data-toggle="dropdown"
                                            aria-haspopup="true"
                                            aria-expanded="false"
                                        >
                                            {(immed || delivery || consumed)?'Report Added':'No Report'}
                                        </button>
                                        <div
                                            class="dropdown-menu"
                                            aria-labelledby="dropdownMenuButton"
                                        >
                                            <div class="dropdown-item">
                                                <input type="checkbox" defaultChecked={immed} class='checkBox' onClick={()=>setImmed(!immed)}/>&nbsp;&nbsp;Immediate
                                            </div>
                                            <div class="dropdown-item">
                                                <input type="checkbox" class='checkBox' onClick={()=>setDelivery(!delivery)}/>&nbsp;&nbsp;Request Delivery Report
                                            </div>
                                            <div class="dropdown-item">
                                                <input type="checkbox" class='checkBox' onClick={()=>setConsumed(!consumed)}/>&nbsp;&nbsp;Request Consumed Report
                                            </div>
                                        </div>
                                    </div>
                                :null}
                                </div>
                            </div>
                            <div class="widg-c"></div>
                        </div>
                    </div>
                    <div class="widg-b2">
                        {selected === 'Custom' &&
                            <button class="btn btn-mainyellow flt-r" onClick={sendSDS}>
                                Send SDS<i class="feather icon-chevron-right m-l-4"></i>
                            </button>
                        }
                    </div>
                    <div class="widg-c"></div>
                </div>
            </div>
            {showAction ?
                <MenuQuickAction
                    open={showAction}
                    closeModal={(v) => clearSeln()}
                    type={selectedSdsOpt == 'Other' ? 'sdsStatus' : 'predefinedPA'}
                    id={selSubrID}
                />
                : null}
        </div>
    )
}

const mapStateToProps = ({ communication,auth }) => {
    const { contactList } = communication;
    const { user } = auth;
    return {
        contactList,
        user
    };
};

export default connect(mapStateToProps, {sendTextMessage,showMessage,sendStatus})(SDSWidget);
