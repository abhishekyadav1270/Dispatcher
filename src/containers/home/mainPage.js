/* eslint-disable no-undef */
import React from "react";
import { connect } from "react-redux";
import userManager from "../../utils/userManager";
//import { userAgent } from "../../utils/sipConfig"
import PropTypes from "prop-types";
import { bindActionCreators } from "redux";
import { SplashScreen } from "../../components/commom";
import store, { sagaMiddleware } from "../../store";
import handleNewMessage from "../../sagas";
import { fetchStatuses } from "../../modules/alarm";
import {
  fetchTextMessages,
  fetchIndividualCalls,
  fetchGroupCalls,
  textMessageReceived,
  groupTextMessageReceived,
  updateTextMessageState,
  updateGroupTextMessageState,
  updateSubDetails,
  individualCallReceived,
  groupCallReceived,
  conferenceCallReceived,
  callOnHoldUnHoldReceived,
  updateIndividualCallAction,
  updateGroupCallAction,
  patchResponseRecd,
  mergeResponseRecd,
} from "../../modules/communication";
import { fetchAllSubscribers } from "../../modules/user";
import { fetchAllStatusMessages } from "../../modules/statusMessage";
import {
  fetchAllUserMessages,
  fetchAllGlobalMessages,
} from "../../modules/predefinedMessage";
import { startTimer, systemStatusReceived } from "../../modules/connection";
import { showMessage } from "../../modules/alerts";
import { fetchContacts } from "../../modules/communication";
import {
  fetchAllLocations,
  fetchSnailTrails,
  fetchFences,
  atsMessageReceived,
  fetchTetraId,
  filterCurrentLA,
  fetchCurrentLocations,
  fetchAllTrainDetails,
  updateBaseStation,
  updateUserLocation,
  onGeoFenceUpdate,
  getGrabbedLines,
} from "../../modules/actions";
import { statusReceived, groupStatusReceived } from "../../modules/alarm";
import { getAllTasks, getActiveTaskCount } from "../../modules/task";
import "../../styles/login.scss";
//import {user.profile.mcptt_id} from '../../utils/sipConfig'
import TrainScreen from "../train/index";
import CommunicationScreen from "../communication/index";
import AlertsScreen from "../alerts/index";
import RecordingsScreen from "../recordings";
import AdminScreen from "../../Admin/screens/Admin";
import { fetchRegisteredUsersList } from "../../modules/registeredUsersList";

import { userProfileUpdate } from "../../modules/actions";
//MCX
import io from "socket.io-client";
//import { io } from "socket.io-client";
import { EndPoints } from "../../MCXclient/endpoints";
import { isRefreshReqd } from "../../modules/activityLog";
import { updateMasterPttKey } from "../../modules/settings";
import {
  cadCallResponse,
  newCADReceived,
  updateCADCall,
} from "../../modules/other";
import { network_config } from "../../constants/constants";

const propTypes = {
  fetchAllSubscribers: PropTypes.func.isRequired,
  fetchAllLocations: PropTypes.func.isRequired,
  getGrabbedLines: PropTypes.func.isRequired,
  fetchSnailTrails: PropTypes.func.isRequired,
  fetchFences: PropTypes.func.isRequired,
  fetchTextMessages: PropTypes.func.isRequired,
  fetchIndividualCalls: PropTypes.func.isRequired,
  fetchGroupCalls: PropTypes.func.isRequired,
  fetchStatuses: PropTypes.func.isRequired,
  fetchAllStatusMessages: PropTypes.func.isRequired,
  fetchAllUserMessages: PropTypes.func.isRequired,
  fetchAllGlobalMessages: PropTypes.func.isRequired,
  startTimer: PropTypes.func.isRequired,
  user: PropTypes.object,
  laGroups: PropTypes.array,
  grabbedLines: PropTypes.array,
  showMessage: PropTypes.func.isRequired,
  //userAgent: PropTypes.object,
  isSipRegistered: PropTypes.bool,
  floor_state_val: PropTypes.string,
};

//Connection
var upCon = {
  systemType: "",
  applicationInstanceType: network_config,
  systemStateType: "UP",
};
var dnCon = {
  systemType: "",
  applicationInstanceType: network_config,
  systemStateType: "DOWN",
};

class MainPage extends React.Component {
  constructor(props) {
    super(props);
  }
  componentDidMount = async () => {
    this.checkMic();
    this.getLatestSettings();
    const {
      user,
      showMessage,
      updateIndividualCallAction,
      updateGroupCallAction,
      isRefreshReqd,
      newCADReceived,
      updateCADCall,
      cadCallResponse,
      patchResponseRecd,
      mergeResponseRecd,
      fetchRegisteredUsersList,
    } = this.props;
    console.log("user in MainPage", user);
    //console.log('RESPONSE allgrabbedlines main',this.props.grabbedLines)
    let risUpdate = true;

    if (user && user.profile && user.profile.Role == "Admin") {
      risUpdate = false;
    }
    console.log("RisUpdate", risUpdate );
    if (risUpdate) {
      //SOCKECT Train Update
      const risSocket = io.connect(EndPoints.getConfig().websocketURL);
      //const risSocket = io(websocketURL);
      console.log("risSocket object...", risSocket);

      risSocket.on("connect", (sock) => {
        console.log("RIS CONNECTED", sock);
        this.props.systemStatusReceived({
          ...upCon,
          systemType: "RIS",
        });
      });

      risSocket.on("broadcast", (atsMsg) => {
        console.log("broadcast main", JSON.parse(atsMsg));
        if (global.config.userConfig.TrainMovement !== "none") {
          this.props.atsMessageReceived(JSON.parse(atsMsg));
        }
      });

      risSocket.on("LAUpdate", (atsMsg) => {
        console.log(
          "LAUpdate event",
          JSON.parse(atsMsg),
          global.config.currentLAId
        );
        this.props.fetchCurrentLocations({ LA: global.config.currentLAId });
        this.props.fetchAllTrainDetails();
        this.props.getGrabbedLines({ LA: global.config.currentLAId });
      });

      risSocket.on("DispatchLA", (atsMsg) => {
        console.log(
          "DispatchLA event",
          JSON.parse(atsMsg),
          global.config.currentLAId
        );
        this.props.fetchCurrentLocations({ LA: global.config.currentLAId });
        this.props.fetchAllTrainDetails();
        this.props.getGrabbedLines({ LA: global.config.currentLAId });
      });

      risSocket.on("BaseStation", (atsMsg) => {
        console.log("BaseStation", JSON.parse(atsMsg));
        this.props.updateBaseStation(JSON.parse(atsMsg));
      });

      risSocket.on("USER_LOCATION_UPDATE", (atsMsg) => {
        console.log("USER_LOCATION_UPDATE", atsMsg);
        this.props.updateUserLocation(JSON.parse(atsMsg));
      });

      risSocket.on("USER_INSIDE_FENCE", (atsMsg) => {
        console.log("USER_INSIDE_FENCE", atsMsg);
        this.props.onGeoFenceUpdate(JSON.parse(atsMsg));
      });

      risSocket.on("disconnect", (s) => {
        console.log("RIS DISCONNECTED", s);
        this.props.systemStatusReceived({
          ...dnCon,
          systemType: "RIS",
        });
        this.props.systemStatusReceived({
          ...dnCon,
          systemType: "ATS",
        });
      });

      risSocket.on("ATS_LINK", (data) => {
        console.log("ATS status", data);
        if (data) {
          this.props.systemStatusReceived({
            ...upCon,
            systemType: "ATS",
          });
        } else {
          this.props.systemStatusReceived({
            ...dnCon,
            systemType: "ATS",
          });
        }
      });
    }
    
  
    const mcxClient = this.props.mcxClient;
    sagaMiddleware.run(handleNewMessage, { mcxClient, userManager });

    if (user) {
      this._loginSuccess(mcxClient);
    }
    
    //CONNECTION
  
    mcxClient.on("onUnregistered", (sock) => {
      console.log("MCX unregistered", user.profile.mcptt_id);
      this.props.systemStatusReceived({
        ...dnCon,
        systemType: "MCX",
      });
    });

    mcxClient.on("onRegister", (sock) => {
      console.log("MCX onRegister", user.profile.mcptt_id);
      this.props.systemStatusReceived({
        ...upCon,
        systemType: "MCX",
      });
    });

    /*mcxClient.on("registered", (sock) => {
      console.log("MCX registered", user.profile.mcptt_id);
      setTimeout(() => {
        this.props.systemStatusReceived({
          ...upCon,
          systemType: "MCX",
        });
      }, 4500);
      mcxClient.log("MCX registered", user.profile.mcptt_id);
    });
    mcxClient.on("registrationFailed", (sock) => {
      console.log("MCX registrationFailed", user.profile.mcptt_id);
      this.props.systemStatusReceived({
        ...dnCon,
        systemType: "MCX",
      });
      mcxClient.log("MCX registrationFailed", user.profile.mcptt_id);
    });*/

    mcxClient.on("Contactlist", async (list) => {
      //FAV CONTACTS
      //console.log("contact list event...", list);
      let favConts = await mcxClient.getData("FAVS", user.profile.mcptt_id);
      favConts = favConts && favConts.length ? favConts : [];
      // let favConts = [];
      const contList = list && list.length ? list : [];
      this.props.fetchContacts({ favConts, contList });
      //console.log('RES 🚀 ',list);
      //console.log("contact list event...", list, favConts);
      //mcxClient.log("Fav contact count: ", favConts.length);
    });

    mcxClient.on("registeredUEIds", async (list) => {
      console.log("registeredUEIds...", list);
      //save to redux
      fetchRegisteredUsersList(list);
    });

    mcxClient.on("tetraRegistered", (obj) => {
      const subId = obj.replace("X-MCX-TETRA-ID: ", "");
      // console.log('TETRA12',obj,subId)
      this.props.fetchTetraId(subId);
      //this.props.updateSubDetails(subId)
    });

    mcxClient.on("TEXT_MESSAGE", (message) => {
      console.log("RECD: TEXT_MESSAGE", message);
      this.props.textMessageReceived(message);
      isRefreshReqd("sds");
      showMessage({
        header: "SDS",
        content: "New SDS Received",
        type: "notif",
      });
    });

    mcxClient.on("GROUP_TEXT_MESSAGE", (message) => {
      console.log("RECD: GROUP_TEXT_MESSAGE", message);
      this.props.groupTextMessageReceived(message);
      isRefreshReqd("sds");
      showMessage({
        header: "SDS",
        content: "New Group SDS Received",
        type: "notif",
      });
    });

    mcxClient.on("STATE_UPDATE", (message) => {
      console.log("RECD: STATE_UPDATE", message);
      if (message.stateType === "FAILED")
        showMessage({
          header: "SDS",
          content: "Failed to send Text message",
          type: "error",
        });
      // if (message.sdsType === "TEXT_MESSAGE") {
      //   this.props.updateTextMessageState(message)
      // } else {
      //   this.props.updateGroupTextMessageState(message)
      // }
      isRefreshReqd("sds");
    });

    //Alarms
    mcxClient.on("STATUS_MESSAGE", (message) => {
      if (message && message.tetraCode == "65500") {
        return;
      }
      console.log("RECD: STATUS_MESSAGE", message);
      this.props.textMessageReceived(message);
      isRefreshReqd("sds");
      showMessage({
        header: "SDS",
        content: "New User Status Received",
        type: "notif",
      });
    });

    mcxClient.on("GROUP_STATUS_MESSAGE", (message) => {
      if (message && message.tetraCode == "65500") {
        return;
      }
      console.log("RECD: GROUP_STATUS_MESSAGE", message);
      //this.props.groupStatusReceived(message);
      this.props.textMessageReceived(message);
      //this.props.groupTextMessageReceived(message);
      isRefreshReqd("sds");
      showMessage({
        header: "SDS",
        content: "New Group Status Received",
        type: "notif",
      });
    });
    mcxClient.on("REFRESH_TASK_LIST", (message) => {
      console.log("INCOMING TASK EVENT", message);
      let filterData = {
        page: 1,
        filter: {},
      };
      let reqObj = {
        mcxId: user && user.profile.mcptt_id,
        falist: [global.config.faID],
        sort: ["createdAt", "taskPriority"],
        filter: filterData.filter, // des: emergency
        pagination: { page: filterData.page, size: 15 },
      };
      console.log(
        "TASK LIST REQ main page",
        JSON.stringify(reqObj),
        this.props.activeTab
      );
      if (this.props.activeTab !== "alerts") {
        console.log("TASK LIST REQ main page inside");
        this.props.getAllTasks(reqObj);
      }

      let refCountObj = {
        mcxId: user.profile.mcptt_id,
        falist: [global.config.faID],
      };
      this.props.getActiveTaskCount(refCountObj);

      isRefreshReqd("task");
      showMessage({
        header: "SDS",
        content: "New Task Received",
        type: "notif",
      });
    });

    //Call Event Handlers
    mcxClient.on("SIMPLEX_INDIVIDUAL_HOOK_CALL", (call) => {
      console.log("RECD: SIMPLEX_INDIVIDUAL_HOOK_CALL", call);
      this.props.individualCallReceived(call);
      showMessage({
        header: "CALL",
        content: "New Simplex individual hook call received",
        type: "notif",
      });
    });

    mcxClient.on("SIMPLEX_INDIVIDUAL_DIRECT_CALL", (call) => {
      console.log("RECD CALL: SIMPLEX_INDIVIDUAL_DIRECT_CALL", call);
      this.props.individualCallReceived(call);
      showMessage({
        header: "CALL",
        content: "New Simplex individual direct call received",
        type: "notif",
      });
    });

    mcxClient.on("DUPLEX_INDIVIDUAL_CALL", (call) => {
      console.log("RECD CALL: DUPLEX_INDIVIDUAL_CALL", call);
      isRefreshReqd("calls");
      this.props.individualCallReceived(call);
      showMessage({
        header: "CALL",
        content: "New Duplex individual call received",
        type: "notif",
      });
    });

    mcxClient.on("AMBIENT_LISTENING_CALL", (call) => {
      console.log("RECD CALL: AMBIENT_LISTENING_CALL", call);
      this.props.individualCallReceived(call);
    });

    //GROUP CALLS
    mcxClient.on("SIMPLEX_BROADCAST_GROUP_CALL", (call) => {
      console.log("RECD CALL: SIMPLEX_BROADCAST_GROUP_CALL", call);
      this.props.groupCallReceived(call);
      // showMessage({
      //   header: "CALL",
      //   content: "New Broadcast call received",
      //   type: "notif",
      // });
    });

    mcxClient.on("SIMPLEX_GROUP_CALL", (call) => {
      console.log("RECD CALL: SIMPLEX_GROUP_CALL", call);
      this.props.groupCallReceived(call);
      // showMessage({
      //   header: "CALL",
      //   content: "New Group call received",
      //   type: "notif",
      // });
    });

    mcxClient.on("CONFERENCE_CALL", (call) => {
      console.log("RECD CALL: CONFERENCE_CALL", call);
      if (call) {
        this.props.conferenceCallReceived(call);
      }
    });

    //CALL_ON_HOLD //CALL_ON_UNHOLD
    mcxClient.on("CALL_ON_HOLD", (call) => {
      console.log("RECD CALL: CALL_ON_HOLD", call);
      if (call) {
        let callObj = { ...call };
        callObj.isCallOnHold = true;
        this.props.callOnHoldUnHoldReceived(callObj);
      }
    });

    mcxClient.on("CALL_ON_UNHOLD", (call) => {
      console.log("CALL_ON_UNHOLD RECD", call);
      if (call) {
        let callObj = { ...call };
        callObj.isCallOnHold = false;
        this.props.callOnHoldUnHoldReceived(callObj);
      }
    });

    //for testing remote audio media on call answered
    mcxClient.on("ANSWER", (call) => {
      console.log("RECD: ANSWER", call);
      if (call.callType.includes("GROUP")) updateGroupCallAction(call, user);
      else updateIndividualCallAction(call, user);
    });

    //Update Call Action - Recd
    mcxClient.on("CALL_ACTION", (call) => {
      console.log("RECD: CALL_ACTION", call);
      if (call.callActionType === "CALL_FAILURE") {
        //showMessage({ header: "Call", content: "Call busy", type: "notif" });
        return;
      }
      if (call.Disconnectcause) {
        //showMessage({ header: "Call", content: call.Disconnectcause, type: "notif" });
      }
      setTimeout(() => {
        if (call.callType.includes("GROUP")) updateGroupCallAction(call, user);
        else updateIndividualCallAction(call, user);
      }, 500);

      if (call.callActionType === "REJECTED")
        if (call.callActionType === "MEDIA_FAILED")
          //showMessage({ header: "Call", content: "Call cleared", type: "notif" });
          showMessage({
            header: "Media Failed",
            content: "Please ensure mic is working for calls",
            type: "notif",
          });
    });
    // ****** CAD CALL ******* //c NM

    mcxClient.on("CAD_CALL", (call) => {
      console.log("RECD: CAD_CALL", call);
      if (this.props.configCadCall) {
        if (call && call.cadDisconnected) {
          let updatedCadCall = { ...call };
          updatedCadCall.stateType = "DISCONNECTED";
          console.log("INCOMING CAD_CALL updated: ", updatedCadCall);
          updateCADCall(null, updatedCadCall);
        } else {
          console.log("INCOMING CAD_CALL new: ", call);
          newCADReceived(call);
        }
      }
    });

    mcxClient.on("CAD_CALL_STATE_UPDATE", (call) => {
      console.log("RECD: CAD_CALL_STATE_UPDATE", call);
      if (this.props.configCadCall) {
        cadCallResponse(call);
      }
    });
    // ****** PATCH CALL RESPONSE ******* //
    mcxClient.on("PATCH_CALL_STATE_UPDATE", (call) => {
      console.log("RECD: PATCH_CALL_STATE_UPDATE", call);
      const success = call.stateType === "SUCCESS" ? true : false;
      patchResponseRecd(call, success);
    });

    // ****** MERGE CALL RESPONSE ******* //
    mcxClient.on("MERGE_CALL_STATE_UPDATE", (call) => {
      console.log("RECD: MERGE_CALL_STATE_UPDATE", call);
      const success = call.stateType === "SUCCESS" ? true : false;
      mergeResponseRecd(call, success);
    });

    // ****** DGNA ******* //
    mcxClient.on("DGNA_STATE_RESPONSE", (dg) => {
      console.log("RECD: DGNA_STATE_RESPONSE", dg);
      //updateDGNA(dg);
    });

    mcxClient.on("DGNA_CREATION_STATE", async (dg) => {
      console.log("DGNA_CREATION_STATE: ", dg);
      if (dg.stateType === "SUCCESS") {
        if (mcxClient.cmc) {
          mcxClient.cmc.fetchContactsList();
        }
        showMessage({
          header: "DGNA",
          content: "DG created successfully!",
          type: "success",
        });
      } else {
        if (dg.stateType === "FAILURE") {
          showMessage({
            header: "DGNA",
            content: "DG failed to create!",
            type: "error",
          });
        }
      }
    });
    mcxClient.on("DGNA_UPDATION_STATE", async (dg) => {
      console.log("DGNA_UPDATION_STATE: ", dg);
      if (dg.stateType === "SUCCESS") {
        if (mcxClient.cmc) {
          mcxClient.cmc.fetchContactsList();
        }
        showMessage({
          header: "DGNA",
          content: "DG modified successfully!",
          type: "success",
        });
      } else {
        if (dg.stateType === "FAILURE") {
          showMessage({
            header: "DGNA",
            content: "DG failed to update!",
            type: "error",
          });
        }
      }
    });
    mcxClient.on("DGNA_DELETION_STATE", async (dg) => {
      console.log("DGNA_DELETION_STATE: ", dg);
      if (dg.stateType === "SUCCESS") {
        if (mcxClient.cmc) {
          mcxClient.cmc.fetchContactsList();
        }
        showMessage({
          header: "DGNA",
          content: "DG deleted successfully!",
          type: "success",
        });
      } else {
        if (dg.stateType === "FAILURE") {
          showMessage({
            header: "DGNA",
            content: "DG failed to delete!",
            type: "error",
          });
        }
      }
    });

    mcxClient.on("Profile", (userProfile) => {
      console.log("Profile received ", userProfile);
      this.props.userProfileUpdate(userProfile);
    });
  };

  async _loginSuccess(mcxClient) {
    const {
      // fetchAllLocations,fetchSnailTrails,fetchFences,
      fetchTextMessages,
      fetchIndividualCalls,
      fetchGroupCalls,
      fetchStatuses,
      // fetchAllSubscribers,fetchAllStatusMessages,fetchAllUserMessages,fetchAllGlobalMessages,
      systemStatusReceived,
      user,
      startTimer,
    } = this.props;
    const userId = user.profile.mcptt_id;
    //CONNECTION
    const con = await mcxClient.getData("CON", userId);
    let conStatus = { ...dnCon, systemType: "DAS" };
    if (con && con.success) conStatus = { ...upCon, systemType: "DAS" };
    systemStatusReceived(conStatus);
    //SDS
    const sds = await mcxClient.getPagnData({ apiType: "SDS", id: userId });
    fetchTextMessages({ sds, userId });
    // const groupSds = await mcxClient.getData('SDS_GROUP',userId);
    // fetchGroupTextMessages({groupSds,userId})
    // const allLogs = await mcxClient.getPagnData({apiType:'LOGS',id:userId,type:'calls'});

    //ALerts
    const alerts = await mcxClient.getPagnData({
      apiType: "ALERTS",
      id: userId,
    });
    // console.log('LOGS',sds,alerts)
    fetchStatuses({ alerts, userId });
    // const alerts = await mcxClient.getData('ALERTS',userId);
    // fetchStatuses({alerts,userId})
    // const groupALerts = await mcxClient.getData('ALERTS_GROUP',userId);
    //Calls
    const activeCalls = await mcxClient.getOngoingCalls();
    let calls = await mcxClient.getData("CALLS", userId);
    let groupCalls = await mcxClient.getData("GROUP_CALLS", userId);
    console.log("after login ongoing calls...", activeCalls, calls, groupCalls);
    if (activeCalls && activeCalls.length) {
      const actIndv = activeCalls
        .filter((call) => {
          return !(call && call.callType && call.callType.includes("GROUP"));
        })
        .map((c) => {
          return c && c.callId ? c.callId : null;
        });
      const actGrp = activeCalls
        .filter((call) => {
          return call && call.callType && call.callType.includes("GROUP");
        })
        .map((c) => {
          return c && c.callId ? c.callId : null;
        });
      calls = this.getMappedCalls(actIndv, calls);
      groupCalls = this.getMappedCalls(actGrp, groupCalls);
    } else {
      calls = this.getMappedCalls([], calls);
      groupCalls = this.getMappedCalls([], groupCalls);
    }
    // fetchIndividualCalls({calls,userId})
    // fetchGroupCalls({groupCalls,userId})
    // console.log('SDS API',favConts,userId)

    // startTimer()

    //this.context.router.history.push('/location')
  }

  getMappedCalls = (ongoing, callLog) => {
    //Map active Calls & chnage state to COMPLETED if any log call active and not listed
    try {
      if (ongoing && ongoing.length) {
        return callLog.map((call) => {
          if (
            !(
              call.stateType === "COMPLETED" ||
              call.stateType === "PERSISTED" ||
              call.stateType === "DISCONNECTED"
            )
          ) {
            if (ongoing.includes(call.callId)) return call;
            else return { ...call, stateType: "COMPLETED" };
          }
          return call;
        });
      }
      //Verify if any activecall on log if change to COMPLETED
      else {
        return callLog.map((call) => {
          if (
            !(
              call.stateType === "COMPLETED" ||
              call.stateType === "PERSISTED" ||
              call.stateType === "DISCONNECTED"
            )
          ) {
            return { ...call, stateType: "COMPLETED" };
          }
          return call;
        });
      }
    } catch (e) {
      console.log("ERROR: mapping active calls on refresh", e);
      return [];
    }
  };

  checkMic() {
    const { showMessage } = this.props;
    let inputAccess = 0,
      outputAccess = 0;
    if (navigator.getUserMedia) {
      navigator.getUserMedia(
        { audio: true },
        () => {
          navigator.mediaDevices
            .enumerateDevices()
            .then((devices) => {
              // console.log('DEVICES',devices)
              devices.forEach((device) => {
                if (device.kind === "audioinput") {
                  if (device.label.length > 0) {
                    inputAccess = inputAccess + 1;
                  }
                }
                if (device.kind === "audiooutput") {
                  if (device.label.length > 0) {
                    outputAccess = outputAccess + 1;
                  }
                }
              });
              console.log("DEVICES HASACCESS", inputAccess, outputAccess);
              if (inputAccess > 0 && outputAccess > 0)
                showMessage({
                  header: "Device Check",
                  content: "Mic & Speaker detected successfully!",
                  type: "notif",
                });
              if (inputAccess > 0 && outputAccess === 0)
                showMessage({
                  header: "Device Check",
                  content:
                    "Could not find any output devices! Please attach one",
                  type: "notif",
                });
              if (inputAccess === 0 && outputAccess > 0)
                showMessage({
                  header: "Device Check",
                  content:
                    "Could not find any input devices! Please attach mic.",
                  type: "notif",
                });
            })
            .catch((e) => console.log(e));
        },
        () => {
          showMessage({
            header: "Device Check",
            content: "Could not find any media devices. Please attach.",
            type: "notif",
          });
        }
      );
    }
  }

  getLatestSettings() {
    const { updateMasterPttKey } = this.props;
    updateMasterPttKey(localStorage.getItem("mpttKey"));
  }

  render() {
    return (
      <div>
        {global.config.userConfig.Trains ? (
          <TrainScreen />
        ) : global.config.userConfig.Communication ? (
          <CommunicationScreen />
        ) : global.config.userConfig.Alerts ? (
          <AlertsScreen />
        ) : global.config.userConfig.Admin ? (
          <AdminScreen />
        ) : global.config.userConfig.Recordings ? (
          <RecordingsScreen />
        ) : null}
      </div>
    );
  }
}

const mapStateToProps = ({ logs, auth, enableCadCall }) => {
  const { activeTab, trains, communication, alerts } = logs;
  const { user } = auth;
  const { configCadCall } = enableCadCall;
  return {
    activeTab,
    trains,
    communication,
    alerts,
    user,
    configCadCall,
  };
};

const mapDispatchToProps = (dispatch) =>
  bindActionCreators(
    {
      fetchAllSubscribers,
      fetchAllLocations,
      fetchSnailTrails,
      fetchFences,
      fetchStatuses,
      fetchTextMessages,
      fetchIndividualCalls,
      fetchGroupCalls,
      fetchAllStatusMessages,
      fetchAllUserMessages,
      fetchAllGlobalMessages,
      startTimer,
      systemStatusReceived,
      showMessage,
      fetchContacts,
      //SDS
      textMessageReceived,
      groupTextMessageReceived,
      updateTextMessageState,
      updateGroupTextMessageState,
      //CALL
      individualCallReceived,
      groupCallReceived,
      conferenceCallReceived,
      callOnHoldUnHoldReceived,
      updateIndividualCallAction,
      updateGroupCallAction,
      //Alarms
      statusReceived,
      groupStatusReceived,
      //trainUpdate
      atsMessageReceived,
      fetchTetraId,
      updateSubDetails,
      isRefreshReqd,
      //SETTINGS
      updateMasterPttKey,
      //CAD
      newCADReceived,
      updateCADCall,
      cadCallResponse,
      patchResponseRecd,
      mergeResponseRecd,
      //Train LA
      filterCurrentLA,
      fetchCurrentLocations,
      fetchAllTrainDetails,
      updateBaseStation,
      updateUserLocation,
      onGeoFenceUpdate,
      getGrabbedLines,
      getAllTasks,
      getActiveTaskCount,
      fetchRegisteredUsersList,
      //user Profile Update
      userProfileUpdate,
    },
    dispatch
  );

MainPage.contextTypes = {
  router: PropTypes.object.isRequired,
};

MainPage.propTypes = propTypes;

export default connect(mapStateToProps, mapDispatchToProps)(MainPage);
