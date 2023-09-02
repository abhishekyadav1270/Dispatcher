import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import moment from "moment";
import { sipGroupCallTypes } from "../../utils/sipConfig";
import { getCallName, getCallieIdToShow } from "../../utils/lib";
//Other

const TypeCall = ({ log, user, contactList }) => {
  const [callLogs, setCallLogs] = useState();

  const getCallieName = (id) => {
    let contactName = getDisplayName(id)
    if (contactName.length > 0) {
      if (contactName == getCallieIdToShow(id)) {
        return contactName
      } else {
        return contactName + '(' + getCallieIdToShow(id) + ')'
      }
    } else {
      return getCallieIdToShow(id)
    }
  };

  const getDisplayName = (id) => {
    //const callerId = getCallieIdToShow(id)
    const subDetails = contactList.filter(cont =>
      //cont.mcptt_id.includes(callerId)
      cont.mcptt_id == id
    );
    if (subDetails.length > 0) return subDetails[0].contactName
    else return id
  }

  const getDisplayId = () => {
    if (ifSent) {
      return log.toId
    } else {
      if (log.groupId && log.groupId.length > 0) {
        return log.groupId
      } else {
        return log.fromId
      }
    }
  }

  useEffect(() => {
  }, []);
  //functions
  const comType = log.communicationType;
  const sdsType = log.sdsType;
  const userId = user && user.profile.mcptt_id;
  let ifSent = log.fromId === userId;
  let pr = "LOW",
    isGroup = false,
    isIndv = false,
    isStatus = false,
    isGrpStatus = false,
    icon = "icon-user",
    type = "",
    priorClr = "green";
  if (comType === "SDS") {
    if (sdsType === "TEXT_MESSAGE") {
      isIndv = true;
      icon = "icon-mail";
      type = "SDS";
    }
    if (sdsType === "GROUP_TEXT_MESSAGE") {
      isGroup = true;
      icon = "icon-mail";
      type = "Group SDS";
    }
    if (sdsType === "STATUS_MESSAGE") {
      isStatus = true;
      icon = "icon-alert-triangle";
      type = "Alert";
    }
    if (sdsType === "GROUP_STATUS_MESSAGE") {
      isGrpStatus = true;
      icon = "icon-alert-triangle";
      type = "Group Alert";
    }
    const displayId = ifSent ? log.toId : log.fromId;
    return (
      <div class="act-row-grid">
        {/* <div class="act1">
                    <input type="checkbox" />
                </div> */}
        <div class="act2"></div>
        <div class="act3">
          <i class={"feather " + icon}></i>
        </div>
        <div class="act4"></div>
        {/* NAME */}
        <div class="act5">
          <span class="f-act">
            {log.contactName ? log.contactName : getCallieName(displayId)}
          </span>
        </div>
        <div class="act6">
          <span class="f-act-sm">{moment(log.created).format("DD/MM/YY")}</span>
        </div>
        {/* Time */}
        <div class="act7">
          <span class="f-act-date">{moment(log.created).format("LT")}</span>
        </div>
        {/* Priority */}
        <div class="act8">
          {log.priority ? <div class="act-tags">{log.priority}</div> : null}
        </div>
        {/* action- Hook direct Call*/}
        <div class="act10">
          <span class="f-act-sm">{ifSent ? "Sent" : "Received"}</span>
        </div>
        {/* Type- incoming, outing */}
        <div class="act9">
          <span class="f-act-date">{type}</span>
        </div>
        {/* <div class="act11"></div> */}
      </div>
    );
  }
  if (comType === "CALL" || comType === "CALL_ACTION") {
    const priority = parseInt(log.callPriority);
    if (priority <= 5) { // 0 to 5
      pr = "LOW";
      priorClr = "#008000";
    }
    if (priority > 5 && priority <= 11) { // 6 to 11
      pr = "MED";
      priorClr = "#FFB266";
    }
    if (priority > 11 && priority <= 14) { // 12 to 14
      pr = "HIGH";
      priorClr = "#ff9d2c";
    }
    if (priority === 15) {
      pr = "EMG";
      priorClr = "#ff0000";
      if (log.stateType === 'ACKNOWLEDGED') {
        pr = "ACK";
        priorClr = "#FFA500";
      }
    }

    if (log.stateType === 'MISSED') {
      pr = "MISSED";
      priorClr = "#ff0000";
    }

    // if(log.callType.includes('GROUP')) type='Group Call'
    type = getCallName(log.callType);
    if (!type) type = "Call";
    //const displayId = type==='Call'?(ifSent?log.toId:log.fromId):ifSent?log.toId || log.groupId:log.fromId
    const displayId = getDisplayId()
    if (type == "Patch Call" || type == "Merge Call") {
      ifSent = true;
    }
    return (
      <div class="act-row-grid">
        {/* <div class="act1">
                    <input type="checkbox" />
                </div> */}
        <div class="act2"></div>
        <div class="act3">
          {type == "Merge Call" ? (<i class={"context-icon feather icon-git-merge yellow"}></i>) :
            type !== "Patch Call" ? (
              <i
                class={
                  "feather icon-phone" + (ifSent ? "-outgoing" : "-incoming")
                }
              ></i>
            ) :
              (<i class={"context-icon feather icon-git-merge yellow"}></i>)}
        </div>
        <div class="act4"></div>
        {/* NAME */}
        {type == "Patch Call" || type == "Merge Call" ? (
          <div class="act5">
            <span class="f-ac f-10">{`${getCallieIdToShow(log.toId)} - ${getCallieIdToShow(log.fromId)}`}</span>
          </div>
        ) : (
          <div class="act5">
            <span class="f-act">
              {log.contactName ? log.contactName : getCallieName(displayId)}
            </span>
          </div>
        )}
        <div class="act6">
          <span class="f-act-sm">{moment(log.created).format("DD/MM/YY")}</span>
        </div>
        {/* Time */}
        <div class="act7">
          <span class="f-act-date">{moment(log.created).format("LT")}</span>
        </div>
        {/* Priority */}
        <div class="act8">
          {pr ? (
            <div class="act-tags" style={{ backgroundColor: priorClr }}>
              {pr}
            </div>
          ) : null}
        </div>
        {/* action- Hook direct Call*/}
        <div class="act10">
          <span class="f-act-sm">{ifSent ? "Outgoing" : "Incoming"}</span>
        </div>
        {/* Type- incoming, outing */}
        <div class="act9">
          <span class="f-act-date">{type}</span>
        </div>
        {/* <div class="act11"></div> */}
      </div>
    );
  } else {
    return (
      <div class="act-row-grid">
        {/* <div class="act1">
                    <input type="checkbox" />
                </div> */}
        <div class="act2"></div>
        <div class="act3">
          <i class="feather icon-users"></i>
        </div>
        <div class="act4"></div>
        <div class="act5">
          <span class="f-act">{log.name}</span>
        </div>
        <div class="act6">
          <span class="f-act-sm">{log.name}</span>
        </div>
        <div class="act7">
          <span class="f-act-date">{log.time}</span>
        </div>
        <div class="act8">
          {" "}
          <div class="act-tags">{log.priority}</div>{" "}
        </div>
        <div class="act10">
          <span class="f-act-sm">{log.action}</span>
        </div>
        <div class="act9">
          <span class="f-act-date">{log.type}</span>
        </div>
        {/* <div class="act11"></div> */}
      </div>
    );
  }
};

const mapStateToProps = ({ auth, communication }) => {
  const { user } = auth;
  const { contactList } = communication;
  return {
    user,
    contactList,
  };
};

export default connect(mapStateToProps, {})(TypeCall);
