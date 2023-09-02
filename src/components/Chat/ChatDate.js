import React from "react";
import { isSameDay } from '../../utils/lib';
import moment from "moment";

const ChatDate = (props) => {
    const { currentMsg, prevMsg } = props
    //console.log('msggg curMsg and prevMsg', currentMsg, prevMsg)
    return (
        <div className="chat-date-view">
            {
                prevMsg === null ?
                    (
                        <div className="chat-date-header">
                            {currentMsg.createdAt.length > 0 ? moment(currentMsg.createdAt).format("ll") : moment(new Date()).format("ll")}
                        </div>
                    )
                    : isSameDay(currentMsg, prevMsg) === false ?
                        (
                            <div className="chat-date-header">
                                {currentMsg.createdAt.length > 0 ? moment(currentMsg.createdAt).format("ll") : moment(new Date()).format("ll")}
                            </div>
                        ) : null
            }
        </div>
    )
}
export default ChatDate;