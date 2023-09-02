import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import moment from "moment";

//Other
import {} from "../../modules/actions";
//import { data } from 'autoprefixer';
import { ContextMenu } from "../commom";
import { GroupTextMessage, IndividualTextMessage } from "../../models/message";
import { sendTextMessage } from "../../modules/communication";
import { showMessage } from "../../modules/alerts";
import SDSType from "./SDSType";
import {
  GroupStatusMessage,
  IndividualStatusMessage,
} from "../../models/statusMessage";
import { sendStatus } from "../../modules/alarm";
import {
  getRandomString,
  getCallieIdToShow,
  RenderIcon,
} from "../../utils/lib";
import { otherStatus, SdsStatus, paAlerts,subscriberType } from "../../constants/constants";

const ChatUserList = (props) => {
  const {
    data,
    setMsg,
    Class,
    msgType,
    read,
    markasRead,
    forwardMsg,
    user,
  } = props;
  const [isreply, setreplyPressed] = useState(false);
  const [openChat, setOpenChat] = useState(false);
  //console.log("Inside ChatUserList ---->", data);

  const sendSDS = (sdsMsg, statusCode, statusType) => {
    if (statusType) {
      if (statusCode.code) {
        const toId = data.fromId;
        const message =
          data.subscriber_type === subscriberType["GROUP"]
            ? new GroupStatusMessage(statusCode.code, toId)
            : new IndividualStatusMessage(statusCode.code, toId);
        props.sendStatus(user, message);
      } else {
        showMessage({
          header: "SDS",
          content: "Please select status!",
          type: "error",
        });
      }
    } else if (sdsMsg) {
      let toId = "",
        fromId = "";
      if (msgType === "SENT") {
        toId = data.toId;
        fromId = data.fromId;
      } else {
        toId = data.fromId;
        fromId = data.toId;
      }
      const report = {
        imm: data.immediate,
        dely: data.deliveryReportNeeded,
        consd: data.consumedReportNeeded,
      };
      const message =
        data.subscriber_type === subscriberType["GROUP"]
          ? new GroupTextMessage(sdsMsg, toId, fromId, report)
          : new IndividualTextMessage(sdsMsg, toId, fromId, report);
      setreplyPressed(false);
      props.sendTextMessage(props.user, message);
    } else {
      props.showMessage({
        header: "SDS",
        content: "Please enter a message!",
        type: "error",
      });
    }
  };

  const isMsgRead = data.stateType === "READ" && data.consumedReportNeeded;
  const sentRead = data.stateType === "CONSUMED" && msgType === "SENT";
  const sentDelivered = data.stateType === "DELIVERED" && msgType === "SENT";

  const getEncodedMessage = () => {
    if (data.messageType === "STATUS") {
      return getAlert(data.message);
    } else {
      return data.message;
    }
  };

  const getAlert = (code) => {
    const alert = [...SdsStatus, ...otherStatus, ...paAlerts].filter(
      (status) => Number(status.code) === Number(code)
    );
    if (alert && alert.length > 0) return alert[0].desc;
    else return code;
  };

  const showTextMessage = (msg) => {
    return <p className="word-overflow-ellipsis">{msg}</p>;
  };

  const showMultiMediaMsg = (msgType) => {
    if (msgType == "image") {
      return (
        <div className="msg-container">
          <div className="msg-icon">
            <i class="fa fa-camera" aria-hidden="true" />
          </div>
          <div className="msg-type">
            <span>Photo</span>
          </div>
        </div>
      );
    } else if (msgType == "audio") {
      return (
        <div className="msg-container">
          <div className="msg-icon">
            <i class="fa fa-microphone" aria-hidden="true"></i>
          </div>
          <div className="msg-type">
            <span>Audio</span>
          </div>
        </div>
      );
    } else if (msgType == "video") {
      return (
        <div className="msg-container">
          <div className="msg-icon">
            <i class="fa fa-video-camera" aria-hidden="true"></i>
          </div>
          <div className="msg-type">
            <span>Video</span>
          </div>
        </div>
      );
    } else {
      return null;
    }
  };

  const showDateTime = (datetime) => {
    let currDate = new Date();
    let oldDate = new Date(datetime);
    let dateDiff = currDate.getDate() - oldDate.getDate();
    // console.log("datediff ", dateDiff, currDate, oldDate, datetime);
    if (dateDiff < 1) {
      // return moment(datetime).format('hh:mm A')
      return moment(datetime).format("LT");
    } else if (Math.floor(dateDiff) == 1) {
      return "Yesterday";
    }
    return moment(datetime).format("DD/MM/YY");
  };

  const handleChatBox = () => {
    setOpenChat(!openChat);
    props.switchFunc(true, data);
  };
  return (
    <div>
      {
        <div
          key={data.id}
          className="sds-card-grid-temp"
          onClick={handleChatBox}
        >
          <div className="sds-t-icon">
            <div class="fav-icon" style={{ padding: "6px 6px" }}>
              {RenderIcon(data.groupId ? "GROUP" : "INDIVIDUAL", "gray")}
            </div>
          </div>
          <div className="sds-t-msg">
            <div className="f-contact-name white blc">
              <span style={{ wordBreak: "break-all" }}>
                {getCallieIdToShow(data.contactId)}
              </span>
            </div>
            <div className="last-msg-status">
              {data.messageType == "text"
                ? showTextMessage(data.message)
                : data.messageType == "STATUS" ? getEncodedMessage():showMultiMediaMsg(data.messageType)}
            </div>
          </div>
          <div className="sds-t-date">
            <span>{showDateTime(data.created)}</span>
          </div>
        </div>
      }
    </div>
  );
};

const mapStateToProps = ({ auth}) => {
  const { user } = auth;
  return {
    user,
  };
};

export default connect(mapStateToProps, {
  sendStatus,
  sendTextMessage,
  showMessage,
})(ChatUserList);
