import React, { useEffect, useState, useRef } from 'react'
import { Modal, Button } from 'react-bootstrap';
import VideoAudioPlayerView from './VideoAudioPlayerView';

const ChatFile = (props) => {
    const [showMsgModal, setShowMsgModal] = useState(false);
    const { sender, msgType, fileId, msgText } = props

    const downloadImg = () => {
        //props.downloadFile(fileId)
        //console.log('btn click..', msgType, fileId)
        if (msgType != 'text') {
            setShowMsgModal(true);
        }
    }

    const handleCloseMsgModal = () => {
        setShowMsgModal(false);
    };

    return (
        <div>
            {
                msgType === 'image' ?
                    (
                        sender === true ?
                            (
                                <div className="from-me-in-chat">
                                    <img className="blue-bubble-img-chat" src={`assets/config/img_download.png`} onClick={downloadImg} />
                                </div>
                            ) :
                            (
                                <div className="from-them-in-chat">
                                    <img className="grey-bubble-img-chat" src={`assets/config/img_download.png`} onClick={downloadImg} />
                                </div>
                            )
                    ) :
                    (
                        msgType === 'audio' ?
                            (
                                sender === true ?
                                    (
                                        <div className="from-me-in-chat">
                                            <img className="blue-bubble-img-chat" src={`assets/config/audio-chat.png`} onClick={downloadImg}/>
                                        </div>
                                    ) :
                                    (
                                        <div className="from-them-in-chat">
                                            <img className="grey-bubble-img-chat" src={`assets/config/audio-chat.png`} onClick={downloadImg}/>
                                        </div>
                                    )
                            ) :
                            (
                                msgType === 'video' ?
                                    (
                                        sender === true ?
                                            (
                                                <div className="from-me-in-chat">
                                                    <img className="blue-bubble-img-chat" src={`assets/config/video-chat.png`} onClick={downloadImg}/>
                                                </div>
                                            ) :
                                            (
                                                <div className="from-them-in-chat">
                                                    <img className="grey-bubble-img-chat" src={`assets/config/video-chat.png`} onClick={downloadImg}/>
                                                </div>
                                            )
                                    ) :
                                    (
                                        null
                                    )
                            )
                    )
            }
            <div>
                <Modal show={showMsgModal} onHide={handleCloseMsgModal}>
                    <Modal.Header closeButton>
                        <Modal.Title>Message</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <div>
                            <VideoAudioPlayerView msgType={msgType} fileId={fileId} msgText={msgText}></VideoAudioPlayerView>
                        </div>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={handleCloseMsgModal}>Close</Button>
                    </Modal.Footer>
                </Modal>
            </div>
        </div>
    )

}
export default ChatFile;