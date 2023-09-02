import React from "react";
import ChatFile from './ChatFile'

const ChatBubble = (props) => {
    const { sender, msgType, msgText, fileId, downloadFile } = props
    return (
        <div>
            {
                msgType === 'text' ||  msgType === 'STATUS'?
                    (
                        sender === true ?
                            (
                                <div className="from-me-in-chat">
                                    <div className="blue-bubble-chat"><span style={{ wordBreak: "break-all"}}>{msgText}</span></div>
                                </div>
                            )
                            :
                            (
                                <div className="from-them-in-chat">
                                    <div className="grey-bubble-chat"><span style={{ wordBreak: "break-all"}}>{msgText}</span></div>
                                </div>
                            )
                    ) :
                    (
                        <ChatFile sender={sender} msgText = {msgText} msgType={msgType} fileId={fileId} downloadFile = {downloadFile}></ChatFile>
                    )
            }
        </div>
    )

}
export default ChatBubble;