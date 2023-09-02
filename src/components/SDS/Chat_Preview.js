import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux'
import { ButtonGroup, ToggleButton, Dropdown, Button, DropdownButton } from 'react-bootstrap'
import moment from 'moment'
import { otherStatus, SdsStatus, paAlerts } from '../../constants/constants';

//Other
import { } from '../../modules/actions';
import SDSType from './SDSType';
import { subscriberType } from '../../constants/constants';
import { GroupTextMessage, IndividualTextMessage } from '../../models/message';
import { sendTextMessage } from '../../modules/communication';
import { showMessage } from '../../modules/alerts' 


const ChatPreview = (props) => {
    const { data,closePrev,msgType } = props;
    useEffect(() => {
    }, [])

    const getEncodedMessage = (data) => {
        if (data.messageType === 'STATUS') {
            return getAlert(data.message)
        } else {
            return data.message
        }
    }
    const getAlert = (code) => {
        const alert = [...SdsStatus, ...otherStatus, ...paAlerts].filter(status => Number(status.code) === Number(code));
        if (alert && alert.length > 0) return alert[0].desc
        else return code
    }


    //functions
    const sendSDS = (sdsMsg) =>{
        if(sdsMsg){
            let toId='',fromId='';
            if(msgType==='SENT'){
                toId = data.toId;
                fromId = data.fromId;
            }
            else{
                toId = data.fromId;
                fromId = data.toId;
            }
            const message = (data.subscriber_type===subscriberType['GROUP'])? new GroupTextMessage(sdsMsg,toId,fromId) : new IndividualTextMessage(sdsMsg,toId,fromId)
            props.sendTextMessage(props.user,message);
        }
        else{
            props.showMessage({header: 'SDS', content: 'Please enter a message!', type: 'error'})
        }
    }

    return (
        <div class="wrap-3 border-2 m-t-10" style={{padding:'20px'}}>
             <div style={{height:'350px'}}>
                <div class="main-widg-grid">
                    <div class="widg-header">
                        <div class="title-grid-4">
                            <div class="title1"><p class="f-14 inter white">{data.fromId?data.fromId.split('@')[0]:""}</p>
                            </div>
                            <div class="search" onClick={()=>closePrev()}>
                                <i class="feather icon-x white f-24"></i>
                            </div>
                        </div>
                    </div>
                    <div class="widg-body">
                        <div class="body-chat" style={{ overflow:'scroll', height:'270px', overflowX:'hidden',paddingTop:'10px'}}>
                            <div class="">
                                <div class="chat-content-l">
                                    <div class="left-bubble" style={{ backgroundColor:'transparent'}}>{getEncodedMessage(data)}</div>
                                </div>
                                <div class="chat-meta-l">
                                    <div class="meta-right">{moment(data.created).format('MMMM Do YYYY, h:mm:ss a')}</div>
                                </div>
                            </div>
                        </div>
                        <SDSType sendSDS={(msg)=>sendSDS(msg)} back={false}/>
                        </div>
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

export default connect(mapStateToProps, {sendTextMessage,showMessage})(ChatPreview);