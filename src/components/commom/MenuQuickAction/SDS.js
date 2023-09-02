import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux'
import { Button, Form } from 'react-bootstrap'
import { otherStatus, paAlerts, sdsTypes, subscriberType } from '../../../constants/constants';
import SearchableDropdown from '../SearchableDropdown';
import { GroupTextMessage, IndividualTextMessage } from '../../../models/message';
import { sendTextMessage } from '../../../modules/communication';
import { showMessage } from '../../../modules/alerts';
import { GroupStatusMessage, IndividualStatusMessage } from '../../../models/statusMessage';
import { sendStatus } from '../../../modules/alarm';
//import { validateSDSMsg } from '../../../utils/lib';

//Other

const SdsQuickAction = (props) => {
    const [sdsMsg, setSdsMsg] = useState("");
    const [immed, setImmed] = useState(true);
    const [delivery, setDelivery] = useState(false);
    const [consumed, setConsumed] = useState(false);
    const [statusCode, setCode] = useState("");

    //PROPS
    const { close, sdsType, sub, sendTextMessage, user, showMessage, sendStatus } = props;


    useEffect(() => {
    }, [])
    //functions
    const sendSds = () => {
        if (sdsType === 'Text') {
            if (sdsMsg) {
                const toId = sub.mcptt_id;
                const fromId = user && user.profile.mcptt_id;
                const isFAMessage = sub.isFACall ? sub.isFACall : false;
                const report = { imm: immed, dely: delivery, consd: consumed }
                const message = (sub.subscriber_type === subscriberType['GROUP']) ?
                    new GroupTextMessage(sdsMsg, toId, fromId, report)
                    : new IndividualTextMessage(sdsMsg, toId, fromId, report, isFAMessage)
                console.log('Sending TEXT SDS...',message)
                setSdsMsg('');
                sendTextMessage(user, message);
                close(false)
            }
            else showMessage({ header: 'SDS', content: 'Please enter a message!', type: 'error' })
        }
        if (sdsType === 'Status' || sdsType === 'PA') {
            if (statusCode && statusCode.code) {
                const toId = sub.mcptt_id;
                const isFAMessage = sub.isFACall ? sub.isFACall : false;
                const message = (sub.subscriber_type === subscriberType['GROUP']) ?
                    new GroupStatusMessage(statusCode.code, toId)
                    : new IndividualStatusMessage(statusCode.code, toId, isFAMessage)
                console.log('STATUS SDS',message, sub)
                setCode('');
                sendStatus(user, message)
                close(false)
            }
            else {
                showMessage({ header: 'SDS', content: 'Please select status message!', type: 'error' })
            }
        }
        if (sdsType === 'LivePA') {
            close(false)
        }
    }

    return (
        <div class='p-l-10 p-r-10 m-b-10'>
            <div class='body-flex m-b-10 m-t-10'>
                <p class="f-14 black">
                    {sdsType === 'Text' ? 'Message'
                        : sdsType === 'Status' ? 'Select Status'
                            : sdsType === 'PA' ? 'Select Public Anouncement Status' : null
                    }</p>
            </div>
            {sdsType === 'Text' ?
                <textarea
                    class="textinput-white mb-4 w100"
                    placeholder="Write SDS Message here..."
                    style={{ height: '90px' }}
                    value={sdsMsg}
                    onChange={(e) => setSdsMsg(e.target.value)}
                />
                : null}
            {/* <SearchableDropdown   
                options={otherStatus}
                title={'Other Status'}
                type={'buttonDropdown'}
                setSelection={(status)=>{setCode(status)}}
                buttonName={statusCode?statusCode.desc:'Select Status'}
                buttonClass="btn dropdown-toggle btn-rgba-el-m-dark btn-lg m-l-100"
            /> */}
            {sdsType === 'Status' || sdsType === 'PA' ?
                <Form>
                    <Form.Group controlId="exampleForm.SelectCustomHtmlSize">
                        <Form.Control
                            as="select"
                            htmlSize={6}
                            custom
                            style={{ backgroundColor: 'rgba(0,0,0,0.1)', height: '400px' }}
                            onChange={(e) => console.log(e.target.value, e.target.key)}
                        >
                            {(sdsType === 'Status' ? otherStatus : paAlerts).map((opt, id) => {
                                return (
                                    <option
                                        key={opt.code}
                                        id={id}
                                        onClick={(e) => { setCode(opt) }}
                                        style={{ color: '#000' }}
                                    >
                                        {" ( " + opt.code + " ) : " + opt.desc}
                                    </option>
                                );
                            })}
                        </Form.Control>
                    </Form.Group>
                    <span class="f-subs-name dark">{'Selected : ' + (statusCode && " ( " + statusCode.code + " )  " + statusCode.desc)}</span>
                </Form>
                : null}
            <div class="widg-grid-1 m-t-15">
                {sdsType === 'Text' ?
                    <div class="widg-b1">
                        <div class="m-b-2">
                            <input type="checkbox" class='checkBox' defaultChecked={immed} onClick={() => setImmed(!immed)} />&nbsp;&nbsp;Immediate
                        </div>
                        <div class="m-b-2">
                            <input type="checkbox" class='checkBox' onClick={() => setDelivery(!delivery)} />&nbsp;&nbsp;Request Delivery Report
                        </div>
                        <div class="m-b-2">
                            <input type="checkbox" class='checkBox' onClick={() => setConsumed(!consumed)} />&nbsp;&nbsp;Request Consumed Report
                        </div>
                    </div>
                    : null}
                <div class="widg-b2 al-center" style={{ justifyContent: 'center' }}>
                    {/* <button class="btn btn-mainyellow flt-r" onClick={()=>{}}>
                        Send SDS<i class="feather icon-chevron-right m-l-4"></i>
                    </button> */}
                    <Button variant="success" onClick={sendSds}>
                        Send SDS<i class="feather icon-chevron-right m-l-4"></i>
                    </Button>{' '}
                </div>
            </div>
        </div>
    )
}

const mapStateToProps = ({ auth }) => {
    const { user } = auth;
    return {
        user
    };
};

export default connect(mapStateToProps, { sendTextMessage, showMessage, sendStatus })(SdsQuickAction);
