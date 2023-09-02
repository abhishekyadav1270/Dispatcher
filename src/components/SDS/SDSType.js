import React, {useState,useEffect } from 'react'
import { connect } from 'react-redux'
import { ButtonGroup, ToggleButton, Dropdown} from 'react-bootstrap'

//Other
import {sdsTypes,otherStatus,paAlerts,statusOption } from '../../constants/constants'
import { SearchableDropdown } from '../commom'
//import { validateSDSMsg } from '../../utils/lib'

const SDSType = ({sendSDS,setreplyPressed,back}) => {
    const [options, setOptions] = useState(sdsTypes);
    const [selected, setSelected] = useState("");
    const [sdsMsg, setSdsMsg] = useState("");
    const [statusCode, setCode] = useState("");
    const [selectedSdsOpt, setSelectedOption] = useState("Other");
    useEffect(() => {
    }, [])
    //functions
    const sendSdsMsg=()=>{
        if(selected !== 'Custom'){
            sendSDS('',statusCode,true);
        }
        else{
            sendSDS(sdsMsg,'',false);
            setSdsMsg('');
        }
    }

    return (
        <div class="widg-footer m-t-10">
                    <div class="dropdown-divider"></div>
                    <div class="chat-bottom">
                        <div class="chat-messagebar m-t-10">
                            {selected === ''?
                            <center>
                                <div class="chat-footer-grid"   v-if="selected == ''" id="dropdown-1">
                                    {back?
                                    <div class="chat-back-button">
                                        <button class="sq-icon-btn" onClick={()=> setreplyPressed(false)}><i class="feather icon-chevron-left"></i></button>
                                    </div>:null}
                                    <div class="chat-input-area">
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
                                                    style={{ color:'#fff'}}
                                                    checked={selected === radio.value}
                                                    onChange={(e) => setSelected(e.target.value)}
                                                >
                                                    {radio.text}
                                                </ToggleButton>
                                            ))}
                                        </ButtonGroup>
                                    </div>
                                </div>
                            </center>:null}

                            {selected !== 'Custom' && selected !== ''?
                            <center>
                                <div class="chat-footer-grid" id="dropdown-1">
                                    <div class="chat-back-button">
                                        <button class="sq-icon-btn" onClick={()=> setSelected('')}><i class="feather icon-chevron-left"></i></button>
                                    </div>
                                    <div class="chat-input-area">
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
                                                onChange={(e) => {setSelectedOption(e.target.value); setCode('')}}
                                            >
                                                <i class={radio.iconClass}></i>
                                            </ToggleButton>
                                        ))}
                                        <SearchableDropdown   
                                            options={selectedSdsOpt==='Other'?otherStatus:paAlerts}
                                            title={selectedSdsOpt==='Other'?'Other Status':'PA Status'}
                                            type={'buttonDropdown'}
                                            setSelection={(status)=>{setCode(status)}}
                                            buttonName={statusCode?statusCode.desc:'Select '+selectedSdsOpt}
                                            buttonClass="btn dropdown-toggle btn-rgba-el-m-dark btn-lg m-l-100"
                                        />
                                    </ButtonGroup>
                                    </div>
                                    <div class="chat-send-button">
                                        <button class="btn btn-success" onClick={sendSdsMsg}><i class="fa fa-send"></i></button>
                                    </div>
                                </div>
                            </center>:null}

                            {selected === 'Custom'?
                            <center>
                                <div class="chat-footer-grid">
                                    <div class="chat-back-button">
                                        <button class="sq-icon-btn" onClick={()=> setSelected('')}><i class="feather icon-chevron-left"></i></button>
                                    </div>
                                    <div class="chat-input-area">
                                        <input type="text" value={sdsMsg} onChange={(e)=>setSdsMsg(e.target.value)} class="textinput f-12 w100" style={{height:'30px'}} placeholder="Write SDS Message here..."/>
                                    </div>
                                    <div class="chat-send-button">
                                        <button class="btn btn-success" onClick={sendSdsMsg}><i class="fa fa-send"></i></button>
                                    </div>
                                </div>
                            </center>:null}

                        </div>
                    </div>
                </div>
    )
}

const mapStateToProps = ({ train }) => {
    const {  } = train;
    return {
    };
  };
  
export default connect(mapStateToProps, {  })(SDSType);
