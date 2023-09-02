import React, { useState, useEffect, useLayoutEffect } from "react";
import { connect } from "react-redux";
import InfiniteScroll from "react-infinite-scroll-component";
//Other
import {} from "../../modules/actions";
import SDSMessage from "./SDS_Message";
import ChatWidget from "./Chat_Widget";
import ChatPreview from "./Chat_Preview";
//Data format
import { StatusUpdate } from "../../models/status";

//Redux Actions
import { showMessage } from "../../modules/alerts";
import {
  sendTextMessageState,
  updateTextMessageState,
  updateGroupTextMessageState,
  fetchSdsTextLog,
} from "../../modules/communication";
import ForwardSDS from "./ForwardSDS";
import { Title } from "../commom/Title";
import { setRefresh, updateTabOption } from "../../modules/activityLog";
import { getAlerts } from "../../modules/alarm";
import ChatUserList from "./ChatUserList";
import { getChatUserList } from "../../modules/communication";
import Slide from "@mui/material/Slide";
import ChatMessage from "../Chat/ChatMessage";
import { RenderIcon,getCallieIdToShow } from "../../utils/lib";
import { Tooltip, OverlayTrigger } from "react-bootstrap";

const SDS_Table = (props) => {
  // console.log("Inside SDS TABLE");
  const [Menuoptions, setMenuOptions] = useState([
    {
      name: "Inbox",
      value: 1,
      id: "pills-contact-tab",
      href: "#pills-read",
      aria: "pills-contact",
    },
    {
      name: "Sent",
      value: 2,
      id: "pills-contact-tab",
      href: "#pills-read",
      aria: "pills-contact",
    },
    {
      name: "Read",
      value: 3,
      id: "pills-contact-tab",
      href: "#pills-read",
      aria: "pills-contact",
    },
  ]);
  const [previewChat, setPreview] = useState(false);
  const [prevMsg, setPrevMsg] = useState({});
  const [forwardMsg, setforwardMsg] = useState({});
  const [showforward, setshowforward] = useState(false);
  const [selected, setSelected] = useState(1);
  const [filteredSDS, setfilteredSDS] = useState([]);
  const [lastFileteredSDS, setLastTabSDS] = useState([]);
  const {
    updateTabOption,
    showMessage,
    fetchSdsTextLog,
    user,
    textMessages,
    groupTextMessages,
    sendTextMessageState,
    updateTextMessageState,
    updateGroupTextMessageState,
    lastPage,
    sdsRefresh,
    setRefresh,
    chatUserList,
    getChatUserList,
  } = props;
  const [isSearch, setSearched] = useState(false);
  const [currentPage, setPage] = useState(1);
  const [initialFetch, setFetch] = useState(true);

  const [sdsMessages, setSdsMessages] = useState([]);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoader] = useState(false);
  const [showingNextData, setShowingNextData] = useState(false);
  const [isOpenChat, setOpenChat] = useState(false);

  const [selectedChat, setSelectedChat] = useState({});
  const intialReport = {
    immed: true,
    delivery: false,
    consumed: false,
  };
  const [report, setReport] = useState(intialReport);

  useEffect(() => {
    // console.log("msggg textMessages", textMessages, groupTextMessages, user);
    if (user && user.profile && user.profile.mcptt_id) {
      getChatUserList(user.profile.mcptt_id);
    }
    if (sdsRefresh) {
      setTimeout(() => {
        setRefresh("sds", false);
        fetchSDS(selected);
      }, 1000);
    }
  }, [textMessages, groupTextMessages, sdsRefresh]);

  useEffect(() => {
    if (user && user.profile && user.profile.mcptt_id)
      getChatUserList(user.profile.mcptt_id);
  }, []);
  // console.log("chat user list", chatUserList);

  //functions
  const fetchSDS = (tab) => {
    if (selected != tab) {
      setSdsMessages([]);
    }
    let filtr = [];
    if (tab !== 0) {
      const tabType = getTab(tab);
      filtr = {
        type: tabType,
        id: user && user.profile.mcptt_id,
        current_page: 1,
      };
      setSelected(tab);
      updateTabOption("sds", tabType);
    } else {
      filtr = {
        type: getTab(selected),
        id: user && user.profile.mcptt_id,
        current_page: 1,
      };
      showMessage({
        header: "SDS",
        content: "Tab refreshed successfully",
        type: "notif",
      });
    }
    resetPages();
    fetchSdsTextLog(filtr);
  };

  const fetchPage = (page) => {
    const filtr = {
      type: getTab(selected),
      id: user && user.profile.mcptt_id,
      current_page: page,
    };
    setPage(page);
    fetchSdsTextLog(filtr);
  };

  const getTab = (activeTab) => {
    if (activeTab === 1) return "inbox";
    if (activeTab === 2) return "sent";
    if (activeTab === 3) return "read";
    else return "";
  };

  const resetPages = () => {
    setPage(1);
    setHasMore(true);
    setLoader(true);
    setShowingNextData(false);
  };

  const sendTextMessageStateUpdate = (message) => {
    /*if (message.consumedReportNeeded) {
        sendTextMessageState(new StatusUpdate(message, 'CONSUMED'))
    }
    const data = new StatusUpdate(message, 'READ')
    sendTextMessageState(data)
    if (data.sdsType === 'TEXT_MESSAGE') {
        updateTextMessageState(data)
    } else {
        updateGroupTextMessageState(data)
    }*/
  };

  const showMsgPreview = (msg) => {
    setPreview(true);
    setPrevMsg(msg);
    if (msg.stateType !== "READ" && selected === 1) {
      // sendTextMessageStateUpdate(msg)
    }
  };

  const showForwardScreen = (msg) => {
    setshowforward(true);
    setforwardMsg(msg);
  };

  const searchSDS = (search) => {
    let filterSDS;
    if (search) {
      filterSDS = lastFileteredSDS.filter(
        (cont) => cont.toId.includes(search) || cont.fromId.includes(search)
      );
      setfilteredSDS(filterSDS);
      setSearched(true);
    } else {
      setfilteredSDS(lastFileteredSDS);
      setSearched(false);
    }
  };

  const getMoreData = () => {
    console.log("msggg textMessages get more data..", currentPage, lastPage);
    if (currentPage === lastPage) {
      setHasMore(false);
      return;
    }
    setLoader(true);
    setShowingNextData(true);
    fetchPage(currentPage + 1);
  };
  const switchWindow = (isChatOpen, data) => {
    setOpenChat(isChatOpen);
    setSelectedChat(data);
  };

  const leftSwipeHandler = () => {
    setOpenChat(!isOpenChat);
    getChatUserList(user.profile.mcptt_id);
  };

  const renderTooltip = (props) => (
    <Tooltip id="button-tooltip" className="sdsTitletooltip" {...props}>
      {props.contactId}
    </Tooltip>
  );

  const icon = (
    <div className="chat-container">
      <div className="chat-container-header">
        <div className="chat-t-icon">
          <div className="back-to-list" onClick={leftSwipeHandler}>
            <i class="fa fa-arrow-left"></i>
          </div>
          <div className="fav-icon dp-icon">
            {RenderIcon(selectedChat.groupId ? "GROUP" : "INDIVIDUAL", "gray")}
          </div>
          <div className="f-contact-name white blc word-overflow-ellipsis">
            {/* <OverlayTrigger
              placement="bottom"
              delay={{ show: 250, hide: 400 }}
              overlay={renderTooltip({ contactId: selectedChat.contactId })}
            > */}
              <span className="word-overflow-ellipsis">{ getCallieIdToShow(selectedChat.contactId)}</span>
            {/* </OverlayTrigger> */}
          </div>
        </div>

        <div class="dropdown">
          <button
            class="btn btn-mildgreen-solid dropdown-toggle"
            type="button"
            id="dropdownMenuButton"
            data-toggle="dropdown"
            aria-haspopup="true"
            aria-expanded="false"
          >
            {report.immed || report.delivery || report.consumed
              ? "Report Added"
              : "No Report"}
          </button>
          <div class="dropdown-menu" aria-labelledby="dropdownMenuButton">
            <div class="dropdown-item">
              <input
                type="checkbox"
                class="checkBox"
                defaultChecked={report.immed}
                onClick={() => setReport({ ...report, immed: !report.immed })}
              />
              &nbsp;&nbsp;Immediate
            </div>
            <div class="dropdown-item">
              <input
                type="checkbox"
                class="checkBox"
                onClick={() =>
                  setReport({ ...report, delivery: !report.delivery })
                }
              />
              &nbsp;&nbsp;Request Delivery Report
            </div>
            <div class="dropdown-item">
              <input
                type="checkbox"
                class="checkBox"
                onClick={() =>
                  setReport({ ...report, consumed: !report.consumed })
                }
              />
              &nbsp;&nbsp;Request Consumed Report
            </div>
          </div>
        </div>
      </div>
      <div style={{ height: "370px" }}>
        <ChatMessage data={selectedChat} report={report}></ChatMessage>
      </div>
    </div>

    //  <div style={{width:'100px',height:'100px' , backgroundColor:'green'}}/>
  );
  return (
    <div>
      <Title
        title="SDS Messages"
        type="collapseSDS"
        filtr={fetchSDS}
        search={() => {}}
      />
      <div
        id={"scrollableDivSDSMsg"}
        class="tab-pane fade show active ovr-scr-y"
        style={{
          height: "420px",
          marginTop: "12px",
          borderRadius: "12px",
          position: "relative",
        }}
        //id="pills-unread"
        role="tabpanel"
        aria-labelledby="pills-home-tab"
      >
        {isOpenChat ? (
          <Slide
            direction="left"
            in={isOpenChat}
            style={{ position: "absolute" }}
          >
            {icon}
          </Slide>
        ) : null}
        {!isOpenChat && chatUserList && chatUserList.length > 0
          ? chatUserList
              .map((sds, id) => {
                return (
                  <ChatUserList data={sds} key={id} switchFunc={switchWindow} />
                );
              })
          : null}
        {chatUserList && chatUserList.length === 0 ? (
          <div
            class="pt-6 pb-6 pr-6 pl-6 f-18 f-reg white"
            style={{
              height: "400px",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            {isSearch ? "No match found" : loading ? "" : "No sds availabble"}
          </div>
        ) : null}
      </div>
    </div>
  );
};

const mapStateToProps = ({ communication, auth, logs, alarm }) => {
  const { textMessages, groupTextMessages, lastPage, chatUserList } =
    communication;
  const { user } = auth;
  const { sdsRefresh } = logs;
  return {
    textMessages,
    groupTextMessages,
    lastPage,
    user,
    sdsRefresh,
    chatUserList,
  };
};

export default connect(mapStateToProps, {
  sendTextMessageState,
  showMessage,
  updateTextMessageState,
  updateGroupTextMessageState,
  fetchSdsTextLog,
  updateTabOption,
  setRefresh,
  getAlerts,
  getChatUserList,
})(SDS_Table);
