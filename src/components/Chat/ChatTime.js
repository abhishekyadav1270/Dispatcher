import React from "react";
import moment from "moment";

const ChatTime = (props) => {
    const { createdAt, sender } = props
    return (
        <>
            {
                sender === true ?
                (
                    <span className='date-color-in-chat-from-me'>{createdAt.length > 0 ? moment(createdAt).format("LT") : moment(new Date()).format("LT")}</span>
                )
                :
                (
                    <span className='date-color-in-chat-from-them'>{createdAt.length > 0 ? moment(createdAt).format("LT") : moment(new Date()).format("LT")}</span>
                )
            }
            
        </>
    )
}
export default ChatTime;
//moment(createdAt).format("LT")