import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux'
import { ButtonGroup, ToggleButton, Dropdown, Button, DropdownButton } from 'react-bootstrap'

//Other
import { } from '../../modules/actions';
import SDS_Message from './SDS_Message';


const ChatWidget = () => {
    const [msgs, setMsgs] = useState([
        { name: "Devdarsh (10001)", time:'13:12:08', msg:"Private messaging via Facebook Messenger is one of  messaging can be eitherthe main ways that people interact on Facebook.",status:'recd'},
        { name: "Devdarsh (10001)", time:'13:12:08', msg:"Yeah! totally agreed.",status:'sent'},
        { name: "Devdarsh (10001)", time:'13:12:08', msg:"Private messaging via Facebook Messenger is one of  messaging can be eitherthe main ways that people interact on Facebook.",status:'recd'},
        { name: "Devdarsh (10001)", time:'13:12:08', msg:"Read messages",status:'recd'},
        { name: "Devdarsh (10001)", time:'13:12:08', msg:"Private messaging via Facebook Messenger is one of  messaging can be eitherthe main ways that people interact on Facebook.",status:'sent'},
        { name: "Devdarsh (10001)", time:'13:12:08', msg:"Problem resolved",status:'recd'},
    ]);
    const [options, setOptions] = useState([
        { text: "Status", value: "Status Alerts" },
        { text: "Predefined", value: "Predefined Alerts" },
        { text: "Custom", value: "Custom" },
      ]);
    const [selected, setSelected] = useState("");

    useEffect(() => {
    }, [])
    //functions

    return (
        <div class="wrap-3 border-2" style={{padding:'20px'}}>
             <div style={{height:'400px'}}>
                <div class="main-widg-grid">
                    <div class="widg-header">
                        <div class="title-grid-4">
                            <div class="title1"><p class="f-14 inter white">Subscriber Name</p>
                            </div>
                            <div class="search"></div>
                        </div>
                    </div>
                    <div class="widg-body">
                        <div class="body-chat" style={{ overflow:'scroll', height:'325px', overflowX:'hidden',paddingTop:'10px'}}>
                            {msgs.map((msg,id)=>{
                                return(
                                    <React.Fragment>
                                    {msg.status ==='sent'?
                                        <div class="chat-row-r">
                                            <div class="chat-content-r">
                                                <div class="right-bubble">{msg.msg}</div>
                                            </div>
                                            <div class="chat-meta-r">
                                                <div class="meta-right">{msg.time}</div>
                                            </div>
                                        </div>
                                    :
                                    <div class="chat-row-l">
                                        <div class="chat-content-l">
                                            <div class="left-bubble">{msg.msg}</div>
                                        </div>
                                        <div class="chat-meta-l">
                                            <div class="meta-right">{msg.time}</div>
                                        </div>
                                    </div>
                                    }
                                    </React.Fragment>
                                )
                            })}
                        </div>
                        <div class="widg-footer m-t-10">
                            <div class="dropdown-divider"></div>
                            <div class="chat-bottom">
                                <div class="chat-messagebar m-t-10">
                                    {selected === ''?
                                    <center>
                                        <div class="chat-footer-grid"   v-if="selected == ''" id="dropdown-1">
                                            <div class="chat-back-button"></div>
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
                                                <Dropdown>
                                                    <Dropdown.Toggle 
                                                        variant="rgba-el-m-dark"
                                                        size="lg"
                                                        class="m-md-2"
                                                        id="dropdown-basic">
                                                        {selected}
                                                    </Dropdown.Toggle>

                                                    <Dropdown.Menu>
                                                        <Dropdown.Item href="#/action-1">Alert 1</Dropdown.Item>
                                                        <Dropdown.Item href="#/action-2">Alert 2</Dropdown.Item>
                                                        <Dropdown.Item href="#/action-3">Alert 3</Dropdown.Item>
                                                    </Dropdown.Menu>
                                                </Dropdown>
                                            </div>
                                            <div class="chat-send-button">
                                                <button class="btn btn-success"><i class="fa fa-send"></i></button>
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
                                                <input type="text" class="textinput f-12 w100" style={{height:'30px'}} placeholder="Write SDS Message here..."/>
                                            </div>
                                            <div class="chat-send-button">
                                                <button class="btn btn-success"><i class="fa fa-send"></i></button>
                                            </div>
                                        </div>
                                    </center>:null}

                                </div>
                            </div>
                        </div>
                    </div>
                </div>
             </div>
        </div>
    )
}

const mapStateToProps = ({ train }) => {
    const { } = train;
    return {

    };
};

export default connect(mapStateToProps, {})(ChatWidget);