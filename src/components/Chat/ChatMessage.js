import React, { useEffect, useState, useRef } from 'react'
import ChatTime from './ChatTime';
import ChatMessageStatus from './ChatMessageStatus'
import ChatBubble from './ChatBubble';
import ChatDate from './ChatDate';
import ChatUser from './ChatUser'
import './chatstyle.css'
//import AudioRecord from './AudioRecord';
import { connect } from 'react-redux'
import { otherStatus, SdsStatus, paAlerts,subscriberType } from "../../constants/constants";
import {
    sendTextMessageState, updateTextMessageState,
    updateGroupTextMessageState, fetchUserSdsMessage,
    sendTextMessage
} from '../../modules/communication'
import { IndividualTextMessageWithId, GroupTextMessageWithId } from '../../models/message';
import InfiniteScroll from "react-infinite-scroll-component";
//import GetPhotoFromWebCam from './GetPhotoFromWebCam';
import { Modal, Button } from 'react-bootstrap';
import AudioRecordView from './AudioRecordView';
import { getCallieIdToShow } from '../../utils/lib'
import { Image, Icon } from 'semantic-ui-react'
import { setRefresh } from "../../modules/activityLog";
import usePrevious from './usePrevious';

const axios = require("axios").default;

const ChatMessage = (props) => {
   
    const { data, user, textMessages, currentChatMessages, fetchUserSdsMessage, sendTextMessage,lastPage,currPage,sdsRefresh,
        setRefresh } = props
    
    const intialReport={
        immed: props.report?props.report.immed:true,
        delivery: props.report?props.report.delivery:false,
        consumed:  props.report?props.report.consumed:false,
    }
    const [msgText, setMsgText] = useState('')
    const [messages, setMessages] = useState([])
    
    // const [immediate, setImmediate] = useState(intialReport.immed);
    // const [delivery, setDelivery] = useState(intialReport.delivery);
    // const [consumed, setConsumed] = useState(intialReport.consumed);
    const [currentPage, setCurrentPage] = useState(1);
    const [msgId, setMsgId] = useState('initial')
    const per_page = 10
    const messagesEndRef = useRef(null)
    const [openModal, setOpenModal] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const isGroup = data.subscriber_type === "GROUP" ? true : false;
    const prevChatId = usePrevious(data.messageId);

    // console.log("--------Inside Chat Message -----",data);
    const scrollToBottom = () => {
        setTimeout(() => {
            const scroll = messagesEndRef.current.scrollHeight - messagesEndRef.current.clientHeight;
            messagesEndRef.current.scrollTo(0, scroll);
        }, 3);
    }

    useEffect(()=>{
        fetchLogs();
    },[]);

    useEffect(() => {
        // console.log('msggg data sdsRefresh..', sdsRefresh)
        if (sdsRefresh) {
            setTimeout(() => {
            setRefresh("sds", false);
            fetchLogs();
            }, 1000);
        }
    }, [sdsRefresh])

    useEffect(() => {
        // console.log('SDS msggg currentChatMessages..', currentChatMessages,currentChatMessages.current_page==1)
        if (currentChatMessages.data && currentChatMessages.data.length > 0) {
            getMessagesData(currentChatMessages.data,currentChatMessages.current_page)
        }
        if (sdsRefresh) {
            setTimeout(() => {
              setRefresh("sds", false);
            }, 1000);
        }
    }, [currentChatMessages])

    useEffect(() => {
        // console.log('SDS msggg textMessages..', textMessages)
        if (msgId === 'initial') {
            setMsgId('')
            return
        }
        if (textMessages.length > 0) {
            let txtMsg = textMessages[0]
            if (txtMsg.creatorId && getCallieIdToShow(txtMsg.creatorId) === getCallieIdToShow(user.profile.mcptt_id)) {
                let groupId = "";
                let groupIdWithoutMcptt = "";
                if (isGroup) {
                    if (txtMsg.groupId) {
                        groupId = txtMsg.groupId;
                        groupIdWithoutMcptt = groupId.replace("-mcptt", "");
                    }
                }
                if ((txtMsg.fromId.toString() === user.profile.mcptt_id) && (txtMsg.toId.toString() === data.mcptt_id.toString())) {
                    // update delivery status of your sent message
                    let newMsgs = []
                    for (const msg of messages) {
                        if (msg.id === txtMsg.messageId) {
                            newMsgs.push(msg)
                        } else {
                            newMsgs.push(msg)
                        }
                    }
                    // console.log("message  to show --->" , newMsgs)
                    setMessages(newMsgs)
                } else {
                    if ((isGroup && ((groupId.toString() === data.mcptt_id.toString()) ||
                        (groupIdWithoutMcptt === data.mcptt_id.toString()))) ||
                        ((txtMsg.fromId.toString() === data.mcptt_id.toString()) && (txtMsg.toId.toString() === user.profile.mcptt_id.toString()))) {
                        // incoming message
                        let updatedMsgs = messages.filter(msg => msg.id === txtMsg.messageId)
                        if (updatedMsgs.length === 0) {
                            let incomingMsg = []
                            incomingMsg.push({
                                id: txtMsg.messageId,
                                text: txtMsg.message,
                                createdAt: txtMsg.created,
                                user: {
                                    id: txtMsg.fromId,
                                },
                                messageType: txtMsg.messageType,
                                fileId: txtMsg.fileId
                            })
                            // console.log('msggg incoming..', incomingMsg)
                            let allMsgs = [...messages, incomingMsg[0]]
                            // console.log("message  to show --->" , allMsgs)
                            setMessages(allMsgs)
                        }
                    }
                }
            }
        }
        scrollToBottom()
    }, [textMessages])

    const fetchLogs = () => {
            // console.log("Inside ChatMessage Fetch Log")
            const param = {
                disp_id: user.profile.mcptt_id,
                toId: data.mcptt_id,
                per_page: per_page,
                current_page: 1
            };
            fetchUserSdsMessage(param)
            setCurrentPage(2);
            setHasMore(true);
    }

    const getMsgFromApi = () => {
            if(currentPage > currentChatMessages.last_page){
                // console.log("last page",currentPage)
                setHasMore(false);
                return;
            }
            const param = {
                disp_id: user.profile.mcptt_id,
                toId: data.mcptt_id,
                per_page: per_page,
                current_page: currentPage
            };
            // console.log('msggg param..', param)
            fetchUserSdsMessage(param)
            setCurrentPage(currentPage+1);
    }
    const getMessagesData = (dataMsgs,page) => {
            let newMsgs = []
            dataMsgs.map(msg => {
                if (msg.creatorId && getCallieIdToShow(msg.creatorId) === getCallieIdToShow(user.profile.mcptt_id)) {
                    let groupId = "";
                    let groupIdWithoutMcptt = "";
                    if (isGroup) {
                        if (msg.groupId) {
                            groupId = msg.groupId;
                            groupIdWithoutMcptt = groupId.replace("-mcptt", "");
                        }
                        if ((groupId.toString() === data.mcptt_id.toString()) ||
                            (groupIdWithoutMcptt === data.mcptt_id.toString())) {
                            newMsgs.push({
                                id: msg.messageId,
                                text: msg.message,
                                createdAt: msg.created,
                                user: {
                                    id: msg.fromId,
                                },
                                messageType: msg.messageType,
                                fileId: msg.fileId
                            })
                        }
                    } else {
                        if ((msg.fromId.toString() === data.mcptt_id.toString()) || (msg.toId.toString() === data.mcptt_id.toString())) {
                            if ((msg.fromId.toString() === user.profile.mcptt_id.toString()) || (msg.toId.toString() === user.profile.mcptt_id.toString())) {
                                newMsgs.push({
                                    id: msg.messageId,
                                    text: msg.message,
                                    createdAt: msg.created,
                                    user: {
                                        id: msg.fromId,
                                    },
                                    messageType: msg.messageType,
                                    fileId: msg.fileId
                                })
                            }
                        }
                    }
                }
    
            })
            console.log("getMessagesData message  to show --->" , newMsgs ,"----",messages)

            if(page==1){
                setCurrentPage(page+1);
                setMessages(newMsgs);
            }
            else{
                setMessages( [...messages,...newMsgs]);
            }
            // scrollToBottom()
    }
    const handleSubmit = () => {
        if (msgText.length > 0) {
            let message = applyMessage(msgText, 'text', '')
            // console.log('SDS msggg handle submit', message)
            sendTextMessage(user, message);
        }
        setMsgText('')
        scrollToBottom()
    }

    const fileChangedHandler = (event) => {
        if (event.target.files.length > 0) {
            const file = event.target.files[0]
            // console.log('selected file', file)
            const formData = new FormData()
            formData.append("file", file)
            uploadFileOnServer(formData)
        }
    }

    const uploadFileOnServer = (formData) => {
        setOpenModal(false);
        let path = `https://${global.config.ipConfig.dispatcherHost}:${global.config.ipConfig.dispatcherServerPort}/sdsFile`
        axios({
            method: "post",
            url: path,
            data: formData,
        }).then(function (res) {
            // console.log("msggg file API res ", res)
            if (res.data.File.fileId && res.data.File.fileType) {
                if (res.data.File.fileType.includes('image')) {
                    let msg = applyMessage(res.data.File.fileName, 'image', res.data.File.fileId)
                    console.log('SDS msggg handle file submit', msg)
                    sendTextMessage(user, msg);
                } else if (res.data.File.fileType.includes('video')) {
                    let msg = applyMessage(res.data.File.fileName, 'video', res.data.File.fileId)
                    console.log('SDS msggg handle file submit', msg)
                    sendTextMessage(user, msg);
                }
            }
        }).catch(function (err) {
            console.log("msgg file API err", err)
        })
    }

    const uploadAudioFileOnServer = (formData) => {
        setOpenModal(false);
        let path = `https://${global.config.ipConfig.dispatcherHost}:${global.config.ipConfig.dispatcherServerPort}/sdsAudioFile`
        axios({
            method: "post",
            url: path,
            data: formData,
        }).then(function (res) {
            // console.log("msggg audio file API res ", res)
            if (res.data.File.fileId) {
                let msg = applyMessage(res.data.File.fileName, 'audio', res.data.File.fileId)
                // console.log('msggg handle audio file ', msg)
                sendTextMessage(user, msg);
            }
        }).catch(function (err) {
            console.log("msgg file API err ", err)
        })
    }

    const downloadFile = (fileId) => {
        let path = `https://${global.config.ipConfig.dispatcherHost}:${global.config.ipConfig.dispatcherServerPort}/sdsFileDownload/`
        let baseUrl = `${path}${fileId}`
        console.log('msgg baseUrl', baseUrl)
        axios({
            method: "get",
            url: baseUrl,
        }).then(function (res) {
            console.log("msgg downloadfile API res ", res)
        }).catch(function (err) {
            console.log("msgg file API err ", err)
        })
    }

    // const addPrevData = () => {
    //     console.log('msggg previous data')
    //     getMsgFromApi();
        
    // }

    const applyMessage = (msgText, msgType, fileId) => {
        const toId = data.mcptt_id;
        const fromId = user && user.profile.mcptt_id;
        const report = { imm: intialReport.immed, dely: intialReport.delivery, consd: intialReport.consumed }
        const messageId = Math.random().toString(36).slice(2);
        let message = ''
        if (isGroup) {
            message = new GroupTextMessageWithId(msgText, messageId, toId, fromId, report, msgType, true, fileId)
        } else {
            message = new IndividualTextMessageWithId(msgText, messageId, toId, fromId, report, msgType, true, fileId)
        }

        let sendMsg = {
            id: messageId,
            text: msgText,
            createdAt: new Date(),
            user: {
                id: fromId,
            },
            messageType: msgType,
            fileId: fileId
        }
        let newMsgs = [sendMsg,...messages]
        console.log("applyMessage message  to show --->" ,sendMsg, messages,newMsgs)
        setMessages(newMsgs)
        return message
    }

    const handleCloseModal = () => {
        setOpenModal(false);
    };

    const handleOpenModal = () => {
        setOpenModal(true);
    };

    const shareRecording = (audioBlob) => {
        console.log('msggg audio blob...', audioBlob)
        const formData = new FormData()
        formData.append("name", 'audioWav')
        formData.append("file", audioBlob)
        uploadAudioFileOnServer(formData)
    }

    const getEncodedMessage = (data) => {
        if (data.messageType === "STATUS") {
          return getAlert(data.text);
        } else {
          return data.text;
        }
    };
    
    const getAlert = (code) => {
        const alert = [...SdsStatus, ...otherStatus, ...paAlerts].filter(
          (status) => Number(status.code) === Number(code)
        );   
        if (alert && alert.length > 0) {
            return alert[0].desc
        }
        else return code;
    };

    if(prevChatId !== data.messageId){
        console.log("Different");
        return null;
    }

    return (
        <div className='chat-bar'>
            <div ref={messagesEndRef} className='inner-chat' id='scrollableDiv'
             style={{
                overflow: "auto",
                display: "flex",
                flexDirection: "column-reverse"
              }}>
                {
                    // <InfiniteScroll
                    //     dataLength={messages.length}
                    //     next={addPrevData}
                    //     hasMore={hasMore}
                    //     inverse={true}
                    //     refreshFunction={() => fetchLogs()}
                    //     style={{ display: 'flex',s flexDirection: 'column' }}
                    //     loader={<div class='al-center'><p class='white'>Loading</p></div>}
                    //     scrollableTarget="inner-chat"
                    // >

                    <InfiniteScroll
                        dataLength={messages.length}
                        next={getMsgFromApi}
                        style={{ display: "flex", flexDirection: "column-reverse" }} //To put endMessage and loader to the top.
                        inverse={true} //
                        hasMore={hasMore}
                        loader={<h4>Loading...</h4>}
                        scrollableTarget="scrollableDiv"
                    >    
                        {
                            messages.map((chatData, index) => (
                                <div key={index}>
                                    <ChatDate currentMsg={chatData} prevMsg={index < messages.length-1 ? messages[index + 1] : null} indx={index}></ChatDate>
                                    {isGroup && (chatData.user.id != user.profile.mcptt_id) ?
                                        <ChatUser userId={getCallieIdToShow(chatData.user.id)}></ChatUser>
                                        :
                                        null
                                    }

                                    <ChatBubble sender={chatData.user.id === user.profile.mcptt_id} msgText={chatData.messageType==="text"?chatData.text:getEncodedMessage(chatData)} fileId={chatData.fileId} msgType={chatData.messageType ? chatData.messageType : 'text'} downloadFile={downloadFile}></ChatBubble>
                                    <div className= {chatData.user.id === user.profile.mcptt_id ? "message-status-details-me":"message-status-details-them" }>
                                        {chatData.user.id === user.profile.mcptt_id ? <ChatMessageStatus messageStatus={"delivered"} /> : null}
                                        <ChatTime createdAt={chatData.createdAt} sender={chatData.user.id === user.profile.mcptt_id} />
                                    </div>
                                </div>
                            ))
                        }
                    </InfiniteScroll>
                }
            </div>
            <div className='input-View' >
                <span className='attach-icon-btn' onClick={handleOpenModal} 
                style={
                    (user.profile && JSON.parse(user.profile.tetraUser))
                      ? { display: "none" }
                      : null
                  }
                >
                    <Image className='wave' src=' /images/attach-file.svg' />
                </span>
                {/* <button className='circle plus' > </button> */}
                <input className='input-in-chat' placeholder='Type message..' value={msgText} onChange={(e) => setMsgText(e.target.value)} />
                {/* <button className='add-button-in-chat' onClick={handleSubmit}>Send</button> */}
                <span onClick={handleSubmit}>
                    <Image className='attach-icon-btn' src=' /images/message_sent.svg' />
                    {/* <i class="fa fa-paper-plane" aria-hidden="true" ></i> */}
                </span>
            </div>
            <div>
                <Modal show={openModal} onHide={handleCloseModal}>
                    <Modal.Header closeButton>
                        <Modal.Title>Share Files</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        {/* <div>
                            <h4>Choose any file</h4>
                            <input className='browser-file' type='file' id='file' onChange={fileChangedHandler} />
                        </div>
                        <br /> */}
                        <div>
                            <h4>Browse and select file </h4>
                            <input type="file" name="myFile" accept="image/*, video/*" onChange={fileChangedHandler} />
                            <br />
                            {/* <br />
                            <br />
                            <h4>choose Image From Web Cam </h4>
                            <GetPhotoFromWebCam setImageMessage={imgCaptureHandler}></GetPhotoFromWebCam> */}
                        </div>
                        <br />
                        <div>
                            <h4>Record your voice</h4>
                            <br />
                            <AudioRecordView shareRecording={shareRecording}></AudioRecordView>
                        </div>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={handleCloseModal}>Close</Button>
                        <Button variant="primary" onClick={handleCloseModal}>Submit</Button>
                    </Modal.Footer>
                </Modal>
            </div>
        </div>
    )

};
const mapStateToProps = ({ communication, auth ,logs}) => {
    const { textMessages, groupTextMessages, currentChatMessages,lastPage } = communication;
    const { user } = auth;
    const { sdsRefresh } = logs;
    return {
        textMessages, groupTextMessages, currentChatMessages,lastPage, sdsRefresh,
        user,
    };
};

export default connect(mapStateToProps, {
    sendTextMessage,
    sendTextMessageState,
    updateTextMessageState,
    updateGroupTextMessageState,
    fetchUserSdsMessage,
    setRefresh,
})(ChatMessage);

