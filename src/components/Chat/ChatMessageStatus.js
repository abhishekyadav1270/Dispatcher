import React from "react";

import { Image, Icon } from 'semantic-ui-react'
const ChatMessageStatus = (props) => {
    const { messageStatus } = props

    return (
        <>
            {
                messageStatus === "store" ?
                    <span className='dilivery-in-chat-from-me'>{"Stored"}</span>
                    : messageStatus === "delivered" ?
                        <span style={{ height: "inherit"}}> <Image style={{height: "12px" ,width: "12px"}}  src='/images/stored_tick.svg'></Image></span>
                        : <span className='dilivery-in-chat-from-me'>{"Sent"}</span>
            }
            
        </>
    )

}
export default ChatMessageStatus;

//store -> message reached in DB
//delivered
//read