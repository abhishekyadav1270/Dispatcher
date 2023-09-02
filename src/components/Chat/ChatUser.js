import React from "react";
import moment from "moment";

const ChatUser = (props) => {
    const { userId } = props
    return (
        <div>
            {
                <div className='userId-show'>{userId}</div>
            }
            
        </div>
    )
}
export default ChatUser;
