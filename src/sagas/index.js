import { func } from "prop-types";
import { takeEvery, put, takeLatest, call } from "redux-saga/effects";
import {
  FETCH_SDS_TEXT,
  LOG,
  MCX_PATCH_CALLS,
  PATCH_RESPONSE,
  MCX_MERGE_CALLS,
  MERGE_RESPONSE,
  SEND_CAD_UPDATE,
  SEND_GROUP_CALL,
  SEND_GROUP_CALL_ACTION,
  SEND_INDIVIDUAL_CALL,
  SEND_INDIVIDUAL_CALL_ACTION,
  SEND_TEXT_MESSAGE,
  SEND_TEXT_MESSAGE_STATE,
  UPDATE_SDS_TEXT,
  FETCH_DGNA,
  EDIT_DGNA,
  FREE_DGNA,
  EXPORT_DGNA,
  ATTACH_DGNA,
  FETCH_USERLIST,
  DELETE_USERLIST,
  EDIT_USERLIST,
  FETCH_USERLIST_ADMIN,
  UPDATE_USERLIST_ADMIN,
  FETCH_FALIST_ADMIN,
  UPDATE_FALIST_ADMIN,
  CREATE_USER_ADMIN,
  DELETE_USER_ADMIN,
  UPDATE_USER_ADMIN,
  ADD_FA_ADMIN,
  UPDATE_FA_ADMIN,
  UPDATE_FADETAIL_ADMIN,
  FA_DETAIL_ADMIN,
  DELETE_FA_ADMIN,
  FETCH_PROFILE_FA_ADMIN,
  UPDATE_PROFILE_FA_ADMIN,
  FETCH_MCPTTID_URI,
  UPDATE_MCPTTID_URI,
  UPDATE_USERPROFILE_ATTACHED_FA_ADMIN,
  RESET_PROFILE_FA_ADMIN,
  FETCH_GROUP_ADMIN,
  UPDATE_GROUP_ADMIN,
  FETCH_ORG_ADMIN,
  UPDATE_ORG_ADMIN,
  CREATE_ORG_ADMIN,
  DELETE_ORG_ADMIN,
  UPDATE_EXISTING_ORG_ADMIN,
  CREATE_GROUP_ADMIN,
  DELETE_GROUP_ADMIN,
  UPDATE_EXISTING_GROUP_ADMIN,
  AFFILIATE_GROUP_TO_USER,
  USER_DEFAULT_GROUP,
  FETCH_IWF_MAP_ADMIN,
  CREATE_IWF_MAP_ADMIN,
  UPDATE_IWF_MAP_ADMIN,
  DELETE_IWF_MAP_ADMIN,
  UPDATE_EXISTING_IWF_MAP_ADMIN,
  FETCH_IWF_TYPE_ADMIN,
  UPDATE_IWF_TYPE_ADMIN,
  UPDATE_GROUP_TYPE_ADMIN,
  FETCH_GROUP_TYPE_ADMIN,
  UPDATE_GROUP_DETAIL_ADMIN,
  FETCH_GROUP_DETAIL_ADMIN,
  UPDATE_ORG_GROUP_ADMIN,
  FETCH_ORG_GROUP_ADMIN,
  RESET_ORG_GROUP_ADMIN,
  SEND_ACK_EMERGENCY_CALL,
  UPDATE_ACK_EMERGENCY_CALL,
  UPDATE_USER_SDS_TEXT, FETCH_USER_SDS_TEXT,
  UPLOAD_SDS_FILE,
  UPDATE_IWFBYFA_ADMIN,
  FETCH_IWFBYFA_ADMIN,
  UPDATE_IWFBYMCPTTID_ADMIN,
  FETCH_IWFBYMCPTTID_ADMIN,
  GET_ALL_ALERT_LIST,
  GET_ALL_ALERT_LIST_TYPES,
  UPDATE_ALL_ALERT_LIST,
  UPDATE_ALL_ALERT_LIST_TYPES,
  EDIT_ALERT_LIST,
  DELETE_ALERT_LIST,
  ADD_ALERT_LIST,
  FETCH_GROUP_ACTIVE_MEMBERS,
  UPDATE_GROUP_ACTIVE_MEMBERS,
  FETCH_USERS_GROUPS,
  UPDATE_USERS_GROUPS,
  UPDATE_TASK_LIST,
  FETCH_TASK_LIST,
  FETCH_ACTIVE_TASK_COUNT,
  UPDATE_ACTIVE_TASK_COUNT,
  UPDATE_TASK_CALL,
  FETCH_CALL_RECORD,
  UPDATE_CALL_RECORD,
  GET_CHAT_USERLIST,
  SET_CHAT_USERLIST,
  SET_CALL_FORWARD
} from "../modules/actions/type";
import {
  groupMockData,
  orgMockData,
  NewOrgMock,
  DeleteOrgMock,
  UpdateOrgMock,
  NewGroupMock,
  DeleteGroupMock,
  UpdateGroupMock,
} from "../constants/groupMockData";


import { FETCH_ACTIVITY_LOG, UPDATE_ACTIVITY_LOG } from '../modules/activityLog'
import { ACKNOWLEDGE_STATUS, ADD_ALERTS, getAlerts, GET_ALERTS, IGNORE_STATUS, SEND_STATUS } from '../modules/alarm'
import { showMessage } from '../modules/alerts'
import { fetchDgna, fetchUserLists, updateDGNA, updateUserLists } from '../modules/common'
import { logSentCall, patchResponseRecd, successGroupCallAction, successIndvCallAction, mergeResponseRecd } from '../modules/communication'
import { initialCallState } from '../constants/constants';
import { getCallActionState } from '../utils/lib';
import moment from 'moment'


const DOMParser = require("xmldom").DOMParser;
const parser = new DOMParser();
const handleNewMessage = function* handleNewMessage(params) {
  try {
    yield takeLatest(SEND_TEXT_MESSAGE, (data) => sendSDS(data, params))
    yield takeLatest(UPLOAD_SDS_FILE, (data) => uploadSDSFile(data, params))
    yield takeLatest(SEND_STATUS, (data) => sendStatus(data, params))

    yield takeEvery(SEND_TEXT_MESSAGE_STATE, (data) => {
      console.log('SDS msg SEND_TEXT_MESSAGE_STATE', data.data, JSON.stringify(data.data))
      params.mcxClient.sendSDS(data.data)
    })

    yield takeLatest(SEND_INDIVIDUAL_CALL, (data) => sentCall(data, params));
    yield takeLatest(SEND_GROUP_CALL, (data) => sentGroupCall(data, params));

    // yield takeEvery(SEND_INDIVIDUAL_CALL_ACTION, (data) => {
    //   console.log('SEND_INDIVIDUAL_CALL_ACTION', data.data)
    //   params.mcxClient.sendCallAction(data.data)
    // })
    yield takeLatest(SEND_INDIVIDUAL_CALL_ACTION, (data) => sendIndvCallAPI(data.data, params))

    yield takeEvery(SEND_GROUP_CALL_ACTION, (data) => sendCallAPI(data.data, params))

    yield takeEvery(UPDATE_TASK_CALL, (data) => updateTaskCall(data.data, params))

    yield takeEvery(SEND_ACK_EMERGENCY_CALL, (data) => sendAckEmergencyCallAPI(data, params))

    yield takeEvery('COMMUNICATION/ADD_DISCREET_SUBSCRIBER', (data) => {
      // console.log('ADD_DISCREET_SUBSCRIBER', data.data)
      params.delegates.sendMessage("ADD_DISCREET_SUBSCRIBER", data.data);
    });

    yield takeEvery("COMMUNICATION/REMOVE_DISCREET_SUBSCRIBER", (data) => {
      // console.log('REMOVE_DISCREET_SUBSCRIBER', data.data)
      params.delegates.sendMessage("REMOVE_DISCREET_SUBSCRIBER", data.data);
    });

    yield takeEvery(ACKNOWLEDGE_STATUS, (data) => {
      // console.log('ALARM/ACKNOWLEDGE_STATUS', data.data)
      params.delegates.sendMessage("ALARM/ACKNOWLEDGE_STATUS", data.data);
    });

    yield takeEvery(IGNORE_STATUS, (data) => {
      // console.log('ALARM/IGNORE_STATUS', data.data)
      params.delegates.sendMessage("ALARM/IGNORE_STATUS", data.data);
    });

    yield takeEvery("AUTH/LOGOUT", () => {
      params.mcxClient.logoutAuth()
    })

    // MCX UPDATE API's
    yield takeEvery("COMMUNICATION/MCX_ADD_FAV", (data) =>
      addToFav(data, params)
    );

    yield takeEvery("COMMUNICATION/MCX_REMOVE_FAV", (data) =>
      remFav(data, params)
    );

    yield takeEvery("COMMUNICATION/MCX_PIN_ALERT", (data) =>
      pinAlert(data, params)
    );

    yield takeEvery("COMMUNICATION/MCX_ACK_ALERT", (data) =>
      ackAlert(data, params)
    );

    //PAGINATION
    yield takeEvery(GET_ALERTS, (data) => fetchMoreAlerts(data, params));

    yield takeEvery(FETCH_ACTIVITY_LOG, (data) => fetchLogs(data, params));

    yield takeEvery(FETCH_SDS_TEXT, (data) => fetchSDS(data, params))
    yield takeEvery(FETCH_USER_SDS_TEXT, (data) => fetchUserSDSMessage(data, params))

    //ADMIN
    yield takeEvery(FETCH_USERLIST_ADMIN, () => fetchUsersAdmin(params));
    yield takeEvery(FETCH_GROUP_ADMIN, () => fetchGroupAdmin(params));
    yield takeEvery(FETCH_ORG_ADMIN, () => fetchOrgAdmin(params));
    yield takeEvery(FETCH_IWF_MAP_ADMIN, () => fetchIWFMapAdmin(params));
    yield takeEvery(FETCH_IWF_TYPE_ADMIN, () => fetchIWFTypeAdmin(params));

    yield takeEvery(FETCH_FALIST_ADMIN, () => fetchFAsAdmin(params));
    yield takeEvery(CREATE_USER_ADMIN, (data) => createUserAdmin(data, params));
    yield takeEvery(CREATE_ORG_ADMIN, (data) => createOrgAdmin(data, params));
    yield takeEvery(CREATE_GROUP_ADMIN, (data) =>
      createGroupAdmin(data, params)
    );
    yield takeEvery(AFFILIATE_GROUP_TO_USER, (data) =>
      affiliateGroupToUser(data, params)
    );
    yield takeEvery(USER_DEFAULT_GROUP, (data) =>
      userDefaultGroup(data, params)
    );
    yield takeEvery(CREATE_IWF_MAP_ADMIN, (data) =>
      createIWFMapAdmin(data, params)
    );

    yield takeEvery(UPDATE_EXISTING_ORG_ADMIN, (data) =>
      updateOrgAdmin(data, params)
    );
    yield takeEvery(UPDATE_EXISTING_GROUP_ADMIN, (data) =>
      updateGroupAdmin(data, params)
    );
    yield takeEvery(FETCH_GROUP_TYPE_ADMIN, () => fetchGroupTypeAdmin(params));
    yield takeEvery(FETCH_ORG_GROUP_ADMIN, (data) => getMembersForOrgGroup(data, params));
    yield takeEvery(FETCH_GROUP_DETAIL_ADMIN, (data) => getGroupDetail(data, params));
    yield takeEvery(RESET_ORG_GROUP_ADMIN, () => resetOrgGroupAdmin(params));
    yield takeEvery(UPDATE_EXISTING_IWF_MAP_ADMIN, (data) =>
      updateIWFMapAdmin(data, params)
    );

    yield takeEvery(UPDATE_USER_ADMIN, (data) => updateUserAdmin(data, params));
    yield takeEvery(DELETE_USER_ADMIN, (data) => deleteUserAdmin(data, params));
    yield takeEvery(DELETE_ORG_ADMIN, (data) => deleteOrgAdmin(data, params));
    yield takeEvery(DELETE_GROUP_ADMIN, (data) =>
      deleteGroupAdmin(data, params)
    );
    yield takeEvery(DELETE_IWF_MAP_ADMIN, (data) =>
      deletIWFMapAdmin(data, params)
    );

    yield takeEvery(ADD_FA_ADMIN, (data) => addFAAdmin(data, params));
    yield takeEvery(UPDATE_FA_ADMIN, (data) => updateFAAdmin(data, params));
    yield takeEvery(FA_DETAIL_ADMIN, (data) =>
      fetchFAAdminDetail(data, params)
    );
    yield takeEvery(DELETE_FA_ADMIN, (data) => deleteFAAdmin(data, params));
    yield takeEvery(FETCH_PROFILE_FA_ADMIN, (data) =>
      fetchUserProfileWithAttachedFAS(data, params)
    );
    yield takeEvery(UPDATE_USERPROFILE_ATTACHED_FA_ADMIN, (data) =>
      updateUserProfileWithAttachedFAS(data, params)
    );
    yield takeEvery(FETCH_MCPTTID_URI, () =>
      fetchMcpttIdAndUri(params)
    );

    //LOG
    yield takeEvery(LOG, (data) => {
      console.log(LOG, data.msg, data.data);
      if (data.data) params.mcxClient.log(data.msg, data.data);
      else params.mcxClient.log(data.msg);
    });

    //CAD
    yield takeLatest(SEND_CAD_UPDATE, (data) => sendCADUpdate(data, params));

    //PATCH
    yield takeLatest(MCX_PATCH_CALLS, (data) => sendPatchCallReq(data, params));
    //MERGE
    yield takeLatest(MCX_MERGE_CALLS, (data) => sendMergeCallReq(data, params));

    //DGNA
    yield takeLatest(FETCH_DGNA, (data) => getDGNA(data, params));
    yield takeLatest(EDIT_DGNA, (data) => editDGNA(data, params));
    yield takeLatest(FREE_DGNA, (data) => freeDGNA(data, params));
    yield takeLatest(ATTACH_DGNA, (data) => attachDGNA(data, params));

    //USERLISTS
    yield takeLatest(EXPORT_DGNA, (data) => exportDGNA(data, params));
    yield takeLatest(FETCH_USERLIST, (data) => getUserLists(data, params));
    yield takeLatest(DELETE_USERLIST, (data) => delUserLists(data, params));
    yield takeLatest(EDIT_USERLIST, (data) => editUserLists(data, params));
    //IWFIN FA DETAIL ADMIN
    yield takeEvery(FETCH_IWFBYFA_ADMIN, (data) => getIWFMapByFa(data, params));
    yield takeEvery(FETCH_IWFBYMCPTTID_ADMIN, (data) => getIWFMapByMCPTTID(data, params));
    //ALERT ADMIN
    yield takeEvery(GET_ALL_ALERT_LIST, () => getAllAlerts(params));
    yield takeEvery(GET_ALL_ALERT_LIST_TYPES, () => getAlertTypes(params));
    yield takeEvery(EDIT_ALERT_LIST, (data) => editAlert(data, params));
    yield takeEvery(ADD_ALERT_LIST, (data) => addAlert(data, params));
    yield takeEvery(DELETE_ALERT_LIST, (data) => deleteAlert(data, params));

    // TASK
    yield takeEvery(FETCH_TASK_LIST, (data) => getAllTasks(data, params));
    yield takeEvery(FETCH_ACTIVE_TASK_COUNT, (data) => getActiveTaskCount(data, params));


    //Group Active Members and User Groups
    yield takeEvery(FETCH_GROUP_ACTIVE_MEMBERS, (data) => getGroupActiveMembers(data, params));
    yield takeEvery(FETCH_USERS_GROUPS, (data) => getUserAttachedGroups(data, params));

    // Player
    yield takeEvery(FETCH_CALL_RECORD, (data)=> getCallRecord(data, params));

    // CHAT LIST
    yield takeEvery(GET_CHAT_USERLIST, (data)=>getChatUserList(data,params));

    yield takeEvery(SET_CALL_FORWARD, (data)=>setCallForward(data,params));
  } catch (error) {
    console.log("saga error ", error);
  }
};

function* getGroupActiveMembers(data, params) {
  try {
    console.log('group active members saga data', data.groupId)
    const res = yield params.mcxClient.admin.getActiveGroupsForUser(data.groupId)
    console.log('group active members saga response', res)
    if (res.data && res.data.userList) {
      yield put({ type: UPDATE_GROUP_ACTIVE_MEMBERS, data: res.data.userList })
    }
  } catch (error) {
    console.log('getGroupActiveMembers error..', error)
  }
}

function* getUserAttachedGroups(data, params) {
  try {
    console.log('user attached members saga data', data.userMcpttId)
    const res = yield params.mcxClient.admin.getActiveGroupsForUser(data.userMcpttId)
    console.log('user attached members saga response', res)
    if (res.data && res.data.userList) {
      yield put({ type: UPDATE_USERS_GROUPS, data: res.data.userList })
    }
  } catch (error) {
    console.log('getUserAttachedGroups error..', error)
  }

}

//FUNCTIONS TO UPDATE REDUX STATE

function* sendCallAPI(data, params) {
  try {
    console.log('group call found saga data', data)
    params.mcxClient.log("SEND_GROUP_CALL_ACTION data: ", data)
    const res = yield params.mcxClient.sendCallAction(data);
    params.mcxClient.log("SEND_GROUP_CALL_ACTION response: ", res)
    console.log('group call found saga res', res)
    if (res && data.callActionType === 'ANSWER') {
      let recdGrpCall = {
        ...data,
        stateType: data.indexId ? 'INITIATED' : 'WAITING',
        created: moment(new Date()).format('YYYY-MM-DD hh:mm:ss'),
        stream: data && data.stream ? data.stream[0].id : '',
        actionItem: getCallActionState("ANSWER", initialCallState)
      }
      yield put(successGroupCallAction(recdGrpCall));
    }
  } catch (err) {
    //console.log('GROUP CALL ERROR', err)
    params.mcxClient.log("SEND_GROUP_CALL_ACTION error: ", err)
    //yield put(showMessage({ header: 'Error', content: 'Failed to update Group Call', type: 'error' }))
  }
}

function* updateTaskCall(data, params) {
  try {
    if (data) {
      let taskDataReq = { ...data }
      taskDataReq = {
        ...taskDataReq,
        taskStatus: 'STARTED',
        taskOutput: {
          ...taskDataReq.taskOutput,
          action: 'COMPLETED',
        }
      }
      console.log('update alertTask after call disconnected...', taskDataReq)
      params.mcxClient.task.acknowledgeTask(taskDataReq)
    }
  } catch (err) {
    params.mcxClient.log("updateTaskCall error: ", err)
  }
}

function* sendIndvCallAPI(data, params) {
  try {
    console.log('SEND_INDIVIDUAL_CALL_ACTION data', data)
    params.mcxClient.log("SEND_INDIVIDUAL_CALL_ACTION data: ", data)
    const res = yield params.mcxClient.sendCallAction(data);
    console.log('SEND_INDIVIDUAL_CALL_ACTION res', res)
    params.mcxClient.log("SEND_INDIVIDUAL_CALL_ACTION response: ", res)
    if (res && data.callActionType === 'ANSWER') {
      let recdCall = {
        ...data,
        stateType: data.indexId ? "INITIATED" : "WAITING",
        created: moment(new Date()).format("YYYY-MM-DD hh:mm:ss"),
        stream: data && data.stream ? data.stream[0].id : "",
        actionItem: getCallActionState("ANSWER", initialCallState),
      };
      yield put(successIndvCallAction(recdCall));
    }
  }
  catch (err) {
    //console.log('INDIVIDUAL CALL ERROR', err)
    params.mcxClient.log("SEND_INDIVIDUAL_CALL_ACTION error: ", err)
    //yield put(showMessage({ header: 'Error', content: 'Failed to update Individual Call', type: 'error' }))
  }
}

function* sendAckEmergencyCallAPI(data, params) {
  try {
    const modifyData = { ...data.data, stateType: 'ACKNOWLEDGED' }
    //console.log('emergency modified data..', modifyData)
    yield params.mcxClient.addData('ACK_CALL', modifyData);
    yield put({ type: UPDATE_ACK_EMERGENCY_CALL, data: modifyData })
  } catch (err) {
    params.mcxClient.log("UPDATE_ACK_EMERGENCY_CALL error: ", err)
  }
}

function* fetchSDS(data, params) {
  try {
    const res = yield params.mcxClient.getPagnData(
      {
        apiType: 'SDS',
        id: data.data.id,
        type: data.data.type,
        current_page: data.data.current_page
      });
    console.log('FETCH_SDS_TEXT', res)
    yield put({ type: UPDATE_SDS_TEXT, data: res })
  } catch (err) {
    params.mcxClient.log("FETCH_SDS_TEXT error: ", err)
  }
}

function* fetchUserSDSMessage(data, params) {
  try {
    const res = yield params.mcxClient.getUserSDSMesage(data.data);
    console.log('msgg FETCH_USER_SDS_TEXT', res)
    yield put({ type: UPDATE_USER_SDS_TEXT, data: res })
  } catch (err) {
    params.mcxClient.log("FETCH_USER_SDS_TEXT error: ", err)
  }
}

function* fetchLogs(data, params) {
  try {
    const res = yield params.mcxClient.getPagnData(
      {
        apiType: 'LOGS',
        id: data.data.id,
        type: data.data.type,
        current_page: data.data.current_page
      });
    let isNew = false;
    if (data.data.tabChanged) isNew = true;
    console.log('FETCH_ACTIVITY_LOG', res)
    yield put({ type: UPDATE_ACTIVITY_LOG, data: res, isNew: isNew })
  } catch (err) {
    params.mcxClient.log("FETCH_ACTIVITY_LOG error: ", err)
  }
}

function* fetchMoreAlerts(data, params) {
  try {
    const res = yield params.mcxClient.getPagnData(
      {
        apiType: 'ALERTS',
        id: data.data.id,
        type: data.data.type,
        current_page: data.data.current_page
      });
    console.log('ADD_ALERTS', data, res)
    yield put({ type: ADD_ALERTS, data: res })
  } catch (err) {
    params.mcxClient.log("ADD_ALERTS error: ", err)
  }
}

/*     SDS     */
function* sendSDS(data, params) {
  try {
    console.log('sendSDS data', data.message)
    const res = params.mcxClient.sendSDS(data.message)
    console.log('msggg SEND_TEXT_MESSAGE resp', res)
    if (res) {
      yield put(showMessage({ header: 'SDS', content: 'SDS is sent successfully!', type: 'success' }))
    }
    else {
      yield put(showMessage({ header: 'Error', content: 'Failed to send SDS', type: 'error' }))
    }
  } catch (err) {
    params.mcxClient.log("SEND_TEXT_MESSAGE error: ", err)
  }
}

function* uploadSDSFile(data, params) {
  try {
    console.log('msggg upload SDS File', data.data)
    const res = params.mcxClient.uploadFile(data.data.formData)
    console.log('msggg upload SDSFile response', res.data, res.data.File)
    if (res.data.File) {
      let messageObj = { ...data.data.message, fileURL: res.data.File.fileId }
      console.log('msggg after uploading image message', messageObj)
      const resp = params.mcxClient.sendSDS(messageObj)
      console.log('msggg SEND_TEXT_MESSAGE resp', resp)
      if (resp) {
        yield put(showMessage({ header: 'SDS', content: 'SDS is sent successfully!', type: 'success' }))
      }
      else {
        yield put(showMessage({ header: 'Error', content: 'Failed to send SDS', type: 'error' }))
      }
    }
    else {
      yield put(showMessage({ header: 'Error', content: 'Failed to send SDS', type: 'error' }))
    }
  } catch (err) {
    params.mcxClient.log("SEND_TEXT_MESSAGE error: ", err)
  }

}

function* sendStatus(data, params) {
  try {
    const res = params.mcxClient.sendSDS(data.data)
    if (res) {
      yield put(showMessage({ header: 'Alert', content: 'Status message successfully sent!', type: 'success' }))
    }
    else {
      yield put(showMessage({ header: 'Error', content: 'Failed to send Status message!', type: 'error' }))
    }
  } catch (err) {
    params.mcxClient.log("SEND_STATUS error: ", err)
  }
}
/*     CALL     */
function* sentCall(data, params) {
  try {
    params.mcxClient.log("SEND_INDIVIDUAL_CALL initiate data: ", data.call)
    console.log("SEND_INDIVIDUAL_CALL initiate data: ", data.call)
    const res = params.mcxClient.initiateCall(data.call);
    params.mcxClient.log("SEND_INDIVIDUAL_CALL initiate response: ", res)
    console.log("SEND_INDIVIDUAL_CALL initiate response: ", res)
    if (res) {
      const sentCall = data.call;
      sentCall.callId = res;
      console.log('SEND_INDIVIDUAL_CALL RES', res, sentCall)
      if (data.call.alertTask) {
        let taskDataReq = data.call.alertTask
        taskDataReq = {
          ...taskDataReq,
          taskOutput: {
            ...taskDataReq.taskOutput,
            action: 'CALL_STARTED',
            callId: res
          }
        }
        params.mcxClient.task.acknowledgeTask(taskDataReq)
        sentCall.alertTask = taskDataReq
        yield put({ type: 'COMMUNICATION/SENT_CALL', data: sentCall })
        yield put(showMessage({ header: 'Call', content: 'Call successfully initiated!', type: 'success' }))
      } else {
        yield put({ type: 'COMMUNICATION/SENT_CALL', data: sentCall })
        yield put(showMessage({ header: 'Call', content: 'Call successfully initiated!', type: 'success' }))
      }
    }
    else {
      yield put(showMessage({ header: 'Error', content: 'Failed to initiate call', type: 'error' }))
    }
  } catch (err) {
    params.mcxClient.log("SEND_INDIVIDUAL_CALL initiate error: ", err)
  }
}

function* sentGroupCall(data, params) {
  try {
    params.mcxClient.log("SEND_GROUP_CALL initiate data: ", data.call)
    const res = params.mcxClient.initiateCall(data.call)
    console.log('SEND_GROUP_CALL REQ', res)
    params.mcxClient.log("SEND_GROUP_CALL initiate response: ", res)
    if (res) {
      const sentCall = data.call;
      sentCall.callId = res;
      console.log('SEND_GROUP_CALL RES', res, sentCall)
      yield put({ type: 'COMMUNICATION/SENT_CALL', data: sentCall })
      yield put(showMessage({ header: 'Call', content: 'Group call successfully initiated!', type: 'success' }))
    }
    else {
      yield put(showMessage({ header: 'Error', content: 'Failed to initiate group call', type: 'error' }))
    }
  } catch (err) {
    params.mcxClient.log("SEND_GROUP_CALL initiate error: ", err)
  }
}

function* addToFav(data, params) {
  try {
    //console.log('COMMUNICATION/MCX_ADD_FAV', data.data)
    params.mcxClient.log("ADD_FAV data: ", data.data)
    yield params.mcxClient.updateData('ADD_FAV', data.data)
  } catch (err) {
    params.mcxClient.log("ADD_FAV error: ", err)
  }
}

function* remFav(data, params) {
  console.log('REM_FAV data:', data.data)
  try {
    params.mcxClient.log("REM_FAV data: ", data.data)
    yield params.mcxClient.updateData('REM_FAV', data.data)
  } catch (err) {
    params.mcxClient.log("REM_FAV error: ", err)
  }
}

function* pinAlert(data, params) {
  // console.log('COMMUNICATION/MCX_PIN_ALERT', data.data)
  try {
    params.mcxClient.log("PIN_ALERT data: ", data.data)
    yield params.mcxClient.updateData('PIN_ALERT', data.data)
  } catch (err) {
    params.mcxClient.log("PIN_ALERT error: ", err)
  }
}

function* ackAlert(data, params) {
  // console.log('COMMUNICATION/MCX_ACK_ALERT', data.data)
  try {
    params.mcxClient.log("ACK_ALERT data: ", data.data)
    yield params.mcxClient.updateData('ACK_ALERT', data.data)
  } catch (err) {
    params.mcxClient.log("ACK_ALERT error: ", err)
  }
}

function* sendCADUpdate(data, params) {
  //console.log(SEND_CAD_UPDATE, data.data)
  try {
    //params.mcxClient.log("CAD_ACTION data: ", data.data)
    yield params.mcxClient.sendCADAction(data.data)
  }
  catch (err) {
    //console.log('ERR CAD_ACTION', err);
    params.mcxClient.log("CAD_ACTION error: ", err)
  }
}

function* sendPatchCallReq(data, params) {
  try {
    //console.log('Patch log Call data', data.data)
    params.mcxClient.log("Patch log Call data: ", data.data)
    const res = params.mcxClient.patchCalls(data.data)
    params.mcxClient.log("Patch log Call response: ", res)
    if (res) {
      const updatedPatch = {
        ...data.data,
        stateType: "WAITING_RES",
        requestId: res,
      };
      yield put(
        showMessage({
          header: "Patch Call",
          content: "Patch call initiated!",
          type: "notif",
        })
      );
      yield put(patchResponseRecd(updatedPatch, true));
    }
  }
  catch (err) {
    //console.log('ERR MCX PATCH', err)
    params.mcxClient.log("Patch Call error: ", err)
    yield put(showMessage({ header: 'Patch Call', content: 'Failed to patch call!', type: 'error' }))
    yield put(patchResponseRecd(data.data, false))
  }
}

function* sendMergeCallReq(data, params) {
  try {
    //console.log('Patch log Call data', data.data)
    params.mcxClient.log("Merge log Call data: ", data.data)
    const res = params.mcxClient.mergeCalls(data.data)
    params.mcxClient.log("Merge log Call response: ", res)
    if (res) {
      const updatedPatch = {
        ...data.data,
        stateType: "WAITING_RES",
        requestId: res,
      };
      yield put(
        showMessage({
          header: "Merge Call",
          content: "Merge call initiated!",
          type: "notif",
        })
      );
      yield put(mergeResponseRecd(updatedPatch, true));
    }
  }
  catch (err) {
    //console.log('ERR MCX PATCH', err)
    params.mcxClient.log("Patch Call error: ", err)
    yield put(showMessage({ header: 'Merge Call', content: 'Failed to merge call!', type: 'error' }))
    yield put(mergeResponseRecd(data.data, false))
  }
}

//DGNA
function* getDGNA(data, params) {
  try {
    //console.log(FETCH_DGNA, data)
    params.mcxClient.log("GET DGNA LIST data: ", data.id)
    const res = yield params.mcxClient.getData('DGNA', data.id)
    params.mcxClient.log("GET DGNA LIST response: ", res)
    if (res) {
      // console.log('DGNA RES',res)
      yield put(updateDGNA(res));
    }
  }
  catch (err) {
    //console.log('FAILED TO GET DGNA LIST', err)
    params.mcxClient.log("GET DGNA LIST error: ", err)
  }
}

function* editDGNA(data, params) {
  console.log('EDIT_DGNA', data.data)
  try {
    params.mcxClient.log("EDIT DGNA data: ", data.data)
    yield params.mcxClient.editDGNA(data.data)
    //yield localStorage.setItem('dgnaEdit', JSON.stringify(data.data))
  }
  catch (err) {
    //console.log('FAILED TO EDIT DGNA', err)
    params.mcxClient.log("EDIT DGNA error: ", err)
  }
}

function* freeDGNA(data, params) {
  try {
    //detach dgna group api here
    console.log('delete dgna', data.data);
    params.mcxClient.log("FREE DGNA data: ", data.data)
    yield params.mcxClient.deleteDGNA(data.data)
  }
  catch (err) {
    //console.log('FAILED TO FREE DGNA', err)
    params.mcxClient.log("FREE DGNA error: ", err)
  }
}

function* attachDGNA(data, params) {
  try {
    //attach dgna group api here
    const param = {
      fromId: data.id,
      ...data.data
    }
    console.log('dgna ATTACH_DGNA', data, param)
    params.mcxClient.log("ATTACH DGNA data: ", param)
    yield params.mcxClient.createDGNA(param)
  }
  catch (err) {
    //console.log('FAILED TO ATTACH DGNA', err)
    params.mcxClient.log("ATTACH DGNA error: ", err)
  }
}

function* exportDGNA(data, params) {
  //console.log(EXPORT_DGNA, data, param)
  try {
    const param = {
      name: data.data.name,
      grpMembers: data.data.grpMembers,
      id: data.id
    }

    params.mcxClient.log("EXPORT DGNA data: ", param)
    const res = yield params.mcxClient.addData('LISTS', param);
    params.mcxClient.log("EXPORT DGNA response: ", res)
    if (res.success) {
      yield put(
        showMessage({ header: "DGNA", content: res.data.msg, type: "success" })
      );
    }
  }
  catch (err) {
    params.mcxClient.log("EXPORT DGNA error: ", err)
    //console.log('FAILED TO EXPORT DGNA', err)
    yield put(showMessage({ header: 'DGNA', content: 'Failed to export!', type: 'error' }))
  }
}

//USERLISTS
function* getUserLists(data, params) {
  try {
    console.log('user dgna members saga data', data.groupId)
    const res = yield params.mcxClient.cmc.getUsersOfGroups(data.groupId);
    console.log('user dgna members saga response', res)
    if (res.data && res.data.length > 0) {
      yield put(updateUserLists(res.data))
    }
  }
  catch (err) {
    //console.log('FAILED TO GET DGNA LIST', err)
    params.mcxClient.log("Get User List error: ", err)
  }
}

function* delUserLists(data, params) {
  const delData = {
    id: data.data.id,
    dispId: data.id,
  };
  try {
    const res = yield params.mcxClient.deleteData("LISTS", delData);
    if (res.status === 200) {
      yield put(fetchUserLists());
    }
  }
  catch (err) {
    //console.log('FAILED TO DELETE LIST', err)
    params.mcxClient.log("Delete User List error: ", err)
  }
}

function* editUserLists(data, params) {
  const updateData = {
    ...data.data,
    dispId: data.id
  }
  //console.log(EDIT_USERLIST, updateData)
  try {
    const res = yield params.mcxClient.updateData("LISTS", updateData);
    if (res) {
      yield put(
        showMessage({
          header: "DGNA",
          content: "User list updated successfully!",
          type: "success",
        })
      );
      yield put(fetchUserLists());
    }
  }
  catch (err) {
    //console.log('FAILED TO EDIT LIST', err)
    params.mcxClient.log("Edit User List error: ", err)
  }
}

/* ADMIN API and Update Reducer */
function* fetchUsersAdmin(params) {
  try {
    const res = yield params.mcxClient.admin.getUsers();
    console.log("user response.. ", res);
    yield put({ type: UPDATE_USERLIST_ADMIN, data: res });
  } catch (err) {
    params.mcxClient.log("Fetch User Admin error: ", err)
    //console.log("saga error fetch user ", err);
    yield put(
      showMessage({
        header: "Admin Error",
        content: "Failed to fetch users",
        type: "error",
      })
    );
  }
}
function* fetchGroupAdmin(params) {
  try {
    const res = yield params.mcxClient.admin.getGroup(groupMockData);
    console.log("group response.. ", res);
    yield put({ type: UPDATE_GROUP_ADMIN, data: res });
  } catch (error) {
    console.log("saga error fetch group ", error);
    yield put(
      showMessage({
        header: "Admin Error",
        content: "Failed to fetch group",
        type: "error",
      })
    );
  }
}
function* fetchOrgAdmin(params) {
  try {
    const res = yield params.mcxClient.admin.getOrg(orgMockData);
    console.log("org response.. ", res);
    yield put({ type: UPDATE_ORG_ADMIN, data: res });
  } catch (error) {
    console.log("saga error fetch org ", error);
    yield put(
      showMessage({
        header: "Admin Error",
        content: "Failed to fetch org",
        type: "error",
      })
    );

  }
}
// function* fetchGroupAdmin(params) {
//   try {
//     const res = yield params.mcxClient.admin.getGroup(groupMockData);
//     console.log('group response.. ', res)
//     yield put({ type: UPDATE_GROUP_ADMIN, data: res })
//   } catch (error) {
//     console.log('saga error fetch group ', error)
//     yield put(showMessage({ header: 'Admin Error', content: 'Failed to fetch group', type: 'error' }))
//   }
// }
// function* fetchOrgAdmin(params) {
//   try {
//     const res = yield params.mcxClient.admin.getOrg(orgMockData);
//     console.log('org response.. ', res)
//     yield put({ type: UPDATE_ORG_ADMIN, data: res })
//   } catch (error) {
//     console.log('saga error fetch org ', error)
//     yield put(showMessage({ header: 'Admin Error', content: 'Failed to fetch org', type: 'error' }))
//   }
// }


function* fetchFAsAdmin(params) {
  try {
    console.log('fa users call')
    const res = yield params.mcxClient.cmc.getAllUserProfiles();
    console.log('fa user response ', res)
    const falist = res.filter((obj) => {
      if (obj.profile) {
        try {
          let xml = parser.parseFromString(obj.profile.toString())
          let mcptt = xml.getElementsByTagName('mcptt-user-profile').item(0)
          let type = mcptt.getAttribute("xmlns:type");
          return type === "urn:consort:faprofile:1.0"
        } catch (e) {
          return false
        }
      }
    })
    yield put({ type: UPDATE_FALIST_ADMIN, data: falist })
  } catch (err) {
    console.log('saga error fetch fa ', err)
    params.mcxClient.log("Fetch FA List error: ", err)
    yield put(showMessage({ header: 'Admin Error', content: 'Failed to fetch FAs', type: 'error' }))
  }
}

function* createUserAdmin(data, params) {

  try {
    const res = yield params.mcxClient.admin.createUser(data.data);
    if (res.success) {
      const resOut = yield params.mcxClient.admin.getUsers();
      yield put({ type: UPDATE_USERLIST_ADMIN, data: resOut });
      yield put(
        showMessage({
          header: "Admin",
          content: "user created successfully!",
          type: "success",
        })
      );
    }
  } catch (err) {
    params.mcxClient.log("Create User error: ", err)
    yield put(
      showMessage({
        header: "Admin Error",
        content: "Failed to create user",
        type: "error",
      })
    );
  }
}

function* createOrgAdmin(data, params) {
  try {
    const res = yield params.mcxClient.admin.createOrg(data.data);
    const newData = NewOrgMock(data.data);
    if (res) {
      const resOut = yield params.mcxClient.admin.getOrg(newData);
      console.log("org response.. ", resOut);
      yield put({ type: UPDATE_ORG_ADMIN, data: resOut });
    }
  } catch (error) {
    console.log("saga error create user ", error);
    yield put(
      showMessage({
        header: "Admin Error",
        content: "Failed to create user",
        type: "error",
      })
    );
  }
}

function* updateOrgAdmin(data, params) {
  try {
    const res = yield params.mcxClient.admin.updateOrg(data.data);
    const newData = UpdateOrgMock(data.data);
    if (res) {
      const resOut = yield params.mcxClient.admin.getOrg(newData);
      console.log("org response.. ", resOut);
      yield put({ type: UPDATE_ORG_ADMIN, data: resOut });
    }
  } catch (error) {
    console.log("saga error create user ", error);
    yield put(
      showMessage({
        header: "Admin Error",
        content: "Failed to create user",
        type: "error",
      })
    );
  }
}
function* deleteOrgAdmin(data, params) {
  try {
    const res = yield params.mcxClient.admin.deleteOrg(data.data);
    const newData = DeleteOrgMock(data.data);
    if (res) {
      const resOut = yield params.mcxClient.admin.getOrg(newData);
      console.log("org response.. ", resOut);
      yield put({ type: UPDATE_ORG_ADMIN, data: resOut });
    }
  } catch (error) {
    console.log("saga error create user ", error);
    yield put(
      showMessage({
        header: "Admin Error",
        content: "Failed to create user",
        type: "error",
      })
    );
  }
}

function* affiliateGroupToUser(data, params) {
  try {
    const res = yield params.mcxClient.admin.affiliateGroupToUser(data.data);
    if (res) {
      // const res = yield params.mcxClient.admin.getGroup(newData);
      // console.log('group response.. ', res)
      // yield put({ type: UPDATE_GROUP_ADMIN, data: res })
    }
  } catch (error) {
    console.log("saga error affiliate group ", error);
    yield put(
      showMessage({
        header: "Admin Error",
        content: "Failed to affiliate group",
        type: "error",
      })
    );
  }
}
function* userDefaultGroup(data, params) {
  try {
    const res = yield params.mcxClient.admin.userDefaultGroup(data.data);
    if (res) {
      // const res = yield params.mcxClient.admin.getGroup(newData);
      // console.log('group response.. ', res)
      // yield put({ type: UPDATE_GROUP_ADMIN, data: res })
    }
  } catch (error) {
    console.log("saga error affiliate group ", error);
    yield put(
      showMessage({
        header: "Admin Error",
        content: "Failed to affiliate group",
        type: "error",
      })
    );
  }
}
//Group crud
function* createGroupAdmin(data, params) {
  try {
    console.log('create group data..', data)
    const res = yield params.mcxClient.admin.createGroup(data.data);
    const newData = NewGroupMock(data.data);
    if (res) {
      const res = yield params.mcxClient.admin.getGroup(newData);
      console.log("group response.. ", res);
      yield put({ type: UPDATE_GROUP_ADMIN, data: res });
    }
  } catch (error) {
    console.log("saga error fetch group ", error);
    yield put(
      showMessage({
        header: "Admin Error",
        content: "Failed to fetch group",
        type: "error",
      })
    );
  }
}

function* updateGroupAdmin(data, params) {
  try {
    const res = yield params.mcxClient.admin.updateGroup(data.data);
    const newData = UpdateGroupMock(data.data);
    if (res) {
      const resOut = yield params.mcxClient.admin.getGroup(newData);
      console.log("group response.. ", resOut);
      yield put({ type: UPDATE_GROUP_ADMIN, data: resOut });
    }
  } catch (error) {
    console.log("saga error update group ", error);
    yield put(
      showMessage({
        header: "Admin Error",
        content: "Failed to update group",
        type: "error",
      })
    );
  }
}
function* deleteGroupAdmin(data, params) {
  try {
    const res = yield params.mcxClient.admin.deleteGroup(data.data);

    if (res) {
      const resOut = yield params.mcxClient.admin.getGroup();
      console.log("org response.. ", resOut);
      yield put({ type: UPDATE_GROUP_ADMIN, data: resOut });
    }
  } catch (error) {
    console.log("saga error delete group ", error);
    yield put(
      showMessage({
        header: "Admin Error",
        content: "Failed to delete group",
        type: "error",
      })
    );
  }
}

// function* createOrgAdmin(data, params) {
//   try {
//     const res = yield params.mcxClient.admin.createOrg(data.data);
//     const newData = NewOrgMock(data.data)
//     if (res) {
//       const resOut = yield params.mcxClient.admin.getOrg(newData);
//       console.log('org response.. ', resOut)
//       yield put({ type: UPDATE_ORG_ADMIN, data: resOut })
//     }
//   } catch (error) {
//     console.log('saga error create user ', error)
//     yield put(showMessage({ header: 'Admin Error', content: 'Failed to create user', type: 'error' }))
//   }
// }


// function* updateOrgAdmin(data, params) {
//   try {
//     const res = yield params.mcxClient.admin.updateOrg(data.data);
//     const newData = UpdateOrgMock(data.data)
//     if (res) {
//       const resOut = yield params.mcxClient.admin.getOrg(newData);
//       console.log('org response.. ', resOut)
//       yield put({ type: UPDATE_ORG_ADMIN, data: resOut })
//     }
//   } catch (error) {
//     console.log('saga error create user ', error)
//     yield put(showMessage({ header: 'Admin Error', content: 'Failed to create user', type: 'error' }))
//   }
// }
// function* deleteOrgAdmin(data, params) {
//   try {
//     const res = yield params.mcxClient.admin.deleteOrg(data.data);
//     const newData = DeleteOrgMock(data.data)
//     if (res) {
//       const resOut = yield params.mcxClient.admin.getOrg(newData);
//       console.log('org response.. ', resOut)
//       yield put({ type: UPDATE_ORG_ADMIN, data: resOut })
//     }
//   } catch (error) {
//     console.log('saga error create user ', error)
//     yield put(showMessage({ header: 'Admin Error', content: 'Failed to create user', type: 'error' }))
//   }
// }

// function* affiliateGroupToUser(data, params) {
//   try {
//     const res = yield params.mcxClient.admin.affiliateGroupToUser(data.data);
//     if (res) {
//       // const res = yield params.mcxClient.admin.getGroup(newData);
//       // console.log('group response.. ', res)
//       // yield put({ type: UPDATE_GROUP_ADMIN, data: res })
//     }
//   } catch (error) {
//     console.log('saga error affiliate group ', error)
//     yield put(showMessage({ header: 'Admin Error', content: 'Failed to affiliate group', type: 'error' }))
//   }
// }


// function* userDefaultGroup(data, params) {
//   try {
//     const res = yield params.mcxClient.admin.userDefaultGroup(data.data);
//     if (res) {
//       // const res = yield params.mcxClient.admin.getGroup(newData);
//       // console.log('group response.. ', res)
//       // yield put({ type: UPDATE_GROUP_ADMIN, data: res })
//     }
//   } catch (error) {
//     console.log('saga error affiliate group ', error)
//     yield put(showMessage({ header: 'Admin Error', content: 'Failed to affiliate group', type: 'error' }))
//   }
// }
//Group crud 
// function* createGroupAdmin(data, params) {
//   try {
//     const res = yield params.mcxClient.admin.createGroup(data.data);
//     const newData = NewGroupMock(data.data)
//     if (res) {
//       const res = yield params.mcxClient.admin.getGroup(newData);
//       console.log('group response.. ', res)
//       yield put({ type: UPDATE_GROUP_ADMIN, data: res })
//     }
//   } catch (error) {
//     console.log('saga error fetch group ', error)
//     yield put(showMessage({ header: 'Admin Error', content: 'Failed to fetch group', type: 'error' }))
//   }
// }


// function* updateGroupAdmin(data, params) {
//   try {
//     const res = yield params.mcxClient.admin.updateGroup(data.data);
//     const newData = UpdateGroupMock(data.data)
//     if (res) {
//       const resOut = yield params.mcxClient.admin.getGroup(newData);
//       console.log('group response.. ', resOut)
//       yield put({ type: UPDATE_GROUP_ADMIN, data: resOut })
//     }
//   } catch (error) {
//     console.log('saga error update group ', error)
//     yield put(showMessage({ header: 'Admin Error', content: 'Failed to update group', type: 'error' }))
//   }
// }
// function* deleteGroupAdmin(data, params) {
//   try {
//     const res = yield params.mcxClient.admin.deleteGroup(data.data);
//     const newData = DeleteGroupMock(data.data)
//     if (res) {
//       const resOut = yield params.mcxClient.admin.getGroup(newData);
//       console.log('org response.. ', resOut)
//       yield put({ type: UPDATE_GROUP_ADMIN, data: resOut })
//     }
//   } catch (error) {
//     console.log('saga error delete group ', error)
//     yield put(showMessage({ header: 'Admin Error', content: 'Failed to delete group', type: 'error' }))
//   }
// }


function* updateUserAdmin(data, params) {
  try {
    console.log("updateUserAdmin", data.data)
    const res = yield params.mcxClient.admin.updateUser(data.data);
    //console.log('update user saga resp', res)
    if (res.success) {
      const resOut = yield params.mcxClient.admin.getUsers();
      yield put({ type: UPDATE_USERLIST_ADMIN, data: resOut });
      yield put(
        showMessage({
          header: "Admin",
          content: "update user successfully!",
          type: "success",
        })
      );
    }
  } catch (err) {
    //console.log('saga error update user ', err)
    params.mcxClient.log("Update User error: ", err)
    yield put(showMessage({ header: 'Admin Error', content: 'Failed to update user', type: 'error' }))
  }
}

function* deleteUserAdmin(data, params) {

  try {
    console.log("delete fa api data sagaa", data);
    const res1 = yield params.mcxClient.cmc.deleteProfile(data.data.mcptt_id);
    console.log('delete fa api resp sagaa', res1)
    if (res1) {
      const res = yield params.mcxClient.admin.deleteUser(data.data.id);
      console.log('delete user api resp sagaa', res)
      if (res) {
        const resOut = yield params.mcxClient.admin.getUsers();
        yield put({ type: UPDATE_USERLIST_ADMIN, data: resOut });
        yield put(
          showMessage({
            header: "Admin",
            content: "Delete user successfully!",
            type: "success",
          })
        );
      }
    }
  } catch (err) {
    //console.log('saga error delete FA ', err)
    params.mcxClient.log("Delete user error: ", err)
    yield put(showMessage({ header: 'Admin Error', content: 'Failed to delete user', type: 'error' }))
  }

}

function* deleteFAAdmin(data, params) {
  try {
    console.log("delete fa api data sagaa", data);
    const res = yield params.mcxClient.cmc.deleteProfile(data.data);
    //console.log('delete fa api resp sagaa', res)
    if (res) {
      // const resP = yield params.mcxClient.cmc.getAllUserProfiles();
      // //console.log('add fa list saga res', resP)
      // yield put({ type: UPDATE_FALIST_ADMIN, data: resP })
      yield call(fetchFAsAdmin, params)
      yield put(showMessage({ header: 'Admin', content: 'FA deleted successfully!', type: 'success' }))
    }
  } catch (err) {
    //console.log('saga error delete FA ', err)
    params.mcxClient.log("Delete FA error: ", err)
    yield put(showMessage({ header: 'Admin Error', content: 'Failed to delete FA', type: 'error' }))
  }
}

function* addFAAdmin(data, params) {
  try {
    console.log('add fa saga', data)
    const resp = yield params.mcxClient.cmc.addFaProfile(data.data);
    console.log('add fa saga resp', resp)
    if (resp) {
      yield put(
        showMessage({
          header: "Admin",
          content: "FA added successfully!",
          type: "success",
        })
      );
      if (data.data.faList.iwf && data.data.faList.iwf.errors) {
        delete data.data.faList.iwf.errors
      }
      if (data.data.faList.iwf && data.data.faList.iwf.fa_mcpttid) {
        delete data.data.faList.iwf.fa_mcpttid
      }
      if (data.data.faList.iwf && data.data.faList.iwf.id && data.data.faList.iwf.id.length) {
        if (data.data.faList.iwf.edit === true) {
          if (data.data.faList.iwf.hasOwnProperty("edit")) {
            delete data.data.faList.iwf["edit"]
          }
          yield call(updateIWFMapAdmin, { data: data.data.faList.iwf }, params)
        }
        else {
          if (data.data.faList.iwf.hasOwnProperty("edit")) {
            delete data.data.faList.iwf["edit"]
          }
          yield call(createIWFMapAdmin, { data: data.data.faList.iwf }, params)
        }
      }

      // const res = yield params.mcxClient.cmc.getAllUserProfiles();
      // yield put({ type: UPDATE_FALIST_ADMIN, data: res });
      yield call(fetchFAsAdmin, params)
    }
  } catch (err) {
    console.log('saga error add FA ', err)
    params.mcxClient.log("Add FA error: ", err)
    yield put(showMessage({ header: 'Admin Error', content: 'Failed to add FA Dat', type: 'error' }))
  }
}

function* updateFAAdmin(data, params) {
  try {
    console.log('update fa saga', data)
    const resp = yield params.mcxClient.cmc.addFaProfile(data.data);
    console.log('update fa saga resp', resp)
    if (resp) {
      if (data.data.faList.iwf && data.data.faList.iwf.errors) {
        delete data.data.faList.iwf.errors

      }
      if (data.data.faList.iwf && data.data.faList.iwf.fa_mcpttid) {
        delete data.data.faList.iwf.fa_mcpttid

      }
      if (data.data.faList.iwf && data.data.faList.iwf.edit) {
        delete data.data.faList.iwf.edit

      }
      if (data.data.faList.iwf && data.data.faList.iwf.id && data.data.faList.iwf.id.length)
        yield call(updateIWFMapAdmin, { data: data.data.faList.iwf }, params)
      // const res = yield params.mcxClient.cmc.getAllUserProfiles();
      // yield put({ type: UPDATE_FALIST_ADMIN, data: res });
      yield call(fetchFAsAdmin, params)
      yield put(
        showMessage({
          header: "Admin",
          content: "FA updated successfully!",
          type: "success",
        })
      );
    }
  } catch (err) {
    //console.log('saga error update FA ', err)
    params.mcxClient.log("Update FA error: ", err)
    yield put(showMessage({ header: 'Admin Error', content: 'Failed to update FA', type: 'error' }))
  }
}

function* fetchFAAdminDetail(data, params) {
  try {
    console.log("fetchFAAdminDetail ++++++++=================", data.data)
    const resp = yield params.mcxClient.cmc.getProfileByName(data.data);
    yield put({ type: UPDATE_FADETAIL_ADMIN, data: resp })
  } catch (err) {
    //console.log('saga error delete FA detail', err)
    params.mcxClient.log("Delete FA Detail error: ", err)
    yield put(showMessage({ header: 'Admin Error', content: 'Failed to fetch FA detail', type: 'error' }))
  }
}
function* getIWFMapByFa(data, params) {
  try {
    console.log("getIWFMapByFa ++++++++=================", data.data)
    const resp = yield params.mcxClient.admin.getIWFMapByFa(data.data);
    yield put({ type: UPDATE_IWFBYFA_ADMIN, data: resp })
  } catch (err) {
    //console.log('saga error delete FA detail', err)
    params.mcxClient.log("Get IWFMap Detail error: ", err)
    yield put(showMessage({ header: 'Admin Error', content: 'Failed to fetch IWFMap detail', type: 'error' }))
  }
}
function* getIWFMapByMCPTTID(data, params) {
  try {
    console.log("getIWFMapByMCPTTID ++++++++=================", data.data)
    const resp = yield params.mcxClient.admin.getIWFMapByMCPTTID(data.data);
    console.log("getIWFMapByMCPTTID response ++++++++=================", resp)
    yield put({ type: UPDATE_IWFBYMCPTTID_ADMIN, data: resp })
  } catch (err) {
    //console.log('saga error delete FA detail', err)
    params.mcxClient.log("Get IWFMap Detail error: ", err)
    yield put(showMessage({ header: 'Admin Error', content: 'Failed to fetch IWFMap detail', type: 'error' }))
  }
}
function* fetchUserProfileWithAttachedFAS(data, params) {
  try {
    const resp = yield params.mcxClient.cmc.getProfileByMcpttId(data.data);
    console.log('admin fas..', resp)
    if (resp) {
      yield put({ type: UPDATE_PROFILE_FA_ADMIN, data: resp })
    }
  } catch (err) {
    //console.log('saga error fetch profile with attached FA ', err)
    params.mcxClient.log("Fetch profile with attached FA error: ", err)
    yield put(showMessage({ header: 'Admin Error', content: 'Failed to fetch profile with attached FA', type: 'error' }))
  }
}

function* fetchMcpttIdAndUri(params) {
  // console.log('Fetch mcpttID and Uri response')
  try {
    const resp = yield params.mcxClient.cmc.getMcpttIdAndUri();
    // console.log('Fetch mcpttID and Uri response', resp)
    if (resp) {
      yield put({ type: UPDATE_MCPTTID_URI, data: resp })
    }
  } catch (err) {
    //console.log('saga error fetch profile with attached FA ', err)
    params.mcxClient.log("Fetch mcpttID and Uri error: ", err)
    yield put(showMessage({ header: 'Admin Error', content: 'Failed to Fetch mcpttID and Uri', type: 'error' }))
  }
}

function* updateUserProfileWithAttachedFAS(data, params) {
  try {
    console.log("updateUserProfileWithAttachedFAS", data.data)
    const resp = yield params.mcxClient.cmc.addUserProfile(data.data);
    yield put({ type: RESET_PROFILE_FA_ADMIN, data: resp });

    if (data.data.iwf && data.data.iwf.errors) {
      delete data.data.iwf.errors

    }
    if (data.data.iwf && data.data.iwf.fa_mcpttid) {
      delete data.data.iwf.fa_mcpttid
    }
    if (data.data.iwf && data.data.iwf.iwfMapPurpose) {
      delete data.data.iwf.iwfMapPurpose
    }

    if (data.data.iwf && data.data.iwf.id && data.data.iwf.id.length) {
      if (data.data.iwf.edit == true) {
        if (data.data.iwf.hasOwnProperty("edit")) {
          delete data.data.iwf["edit"]
        }
        console.log("updateUserProfileWithAttachedFAS edit true", data.data)

        yield call(updateIWFMapAdmin, { data: data.data.iwf }, params)
      }
      else {
        if (data.data.iwf.hasOwnProperty("edit")) {
          delete data.data.iwf["edit"]
        }
        console.log("updateUserProfileWithAttachedFAS edit false", data.data)
        yield call(createIWFMapAdmin, { data: data.data.iwf }, params)
      }
    }


  } catch (err) {
    console.log('saga error update profile with attached FA ', err)
    params.mcxClient.log("Update profile with attached FA error: ", err)
    yield put(showMessage({ header: 'Admin Error', content: 'Failed to update profile with attached FA', type: 'error' }))
  }
}

function* createIWFMapAdmin(data, params) {
  try {
    console.log('createIWFMapAdmin', data)
    const res = yield params.mcxClient.admin.createIWFMap(data.data);
    const newData = NewOrgMock(data.data);
    if (res) {
      const resOut = yield params.mcxClient.admin.getIWFMap(newData);
      console.log("Iwf response.. ", resOut);
      yield put({ type: UPDATE_IWF_MAP_ADMIN, data: resOut });
    }
  } catch (error) {
    console.log("saga error create iwf map ", error);
    yield put(
      showMessage({
        header: "Admin Error",
        content: "Failed to create iwf map",
        type: "error",
      })
    );
  }
}

function* updateIWFMapAdmin(data, params) {
  try {
    console.log("iwf data req.. ", data.data);
    const res = yield params.mcxClient.admin.updateIWFMap(data.data);

    if (res) {
      const resOut = yield params.mcxClient.admin.getIWFMap();
      console.log("iwf response.. ", resOut);
      yield put({ type: UPDATE_IWF_MAP_ADMIN, data: resOut });
    }
  } catch (error) {
    console.log("saga error create iwf map ", error);
    yield put(
      showMessage({
        header: "Admin Error",
        content: "Failed to create iwf",
        type: "error",
      })
    );
  }
}
function* deletIWFMapAdmin(data, params) {
  try {
    console.log("Data ", data)
    const res = yield params.mcxClient.admin.deleteIWFMap(data);

    if (res) {
      const resOut = yield params.mcxClient.admin.getIWFMap();
      console.log("iwf response.. ", resOut);
      yield put({ type: UPDATE_IWF_MAP_ADMIN, data: resOut });
    }
  } catch (error) {
    console.log("saga error create iwf map ", error);
    yield put(
      showMessage({
        header: "Admin Error",
        content: "Failed to create iwf map",
        type: "error",
      })
    );
  }
}

function* fetchIWFMapAdmin(params) {
  try {
    const res = yield params.mcxClient.admin.getIWFMap(orgMockData);
    console.log("iwf response.. ", res);
    yield put({ type: UPDATE_IWF_MAP_ADMIN, data: res });
  } catch (error) {
    console.log("saga error fetch iwf map ", error);
    yield put(
      showMessage({
        header: "Admin Error",
        content: "Failed to fetch iwf map",
        type: "error",
      })
    );
  }
}

function* fetchIWFTypeAdmin(params) {
  try {
    console.log("iwf response type.. ");
    const res = yield params.mcxClient.admin.getIWFType();
    console.log("iwf response type.. ", res);
    yield put({ type: UPDATE_IWF_TYPE_ADMIN, data: res });
  } catch (error) {
    console.log("saga error fetch iwf map type", error);
    yield put(
      showMessage({
        header: "Admin Error",
        content: "Failed to fetch iwf map type",
        type: "error",
      })
    );
  }
}


function* fetchGroupTypeAdmin(params) {
  try {
    console.log("fetchGroupTypeAdmin 2");
    const res = yield params.mcxClient.admin.getGroupType();
    console.log("fetchGroupTypeAdmin 2", res);
    yield put({ type: UPDATE_GROUP_TYPE_ADMIN, data: res });
  } catch (error) {
    console.log("saga error fetch group map type", error);
    yield put(
      showMessage({
        header: "Admin Error",
        content: "Failed to fetch group map type",
        type: "error",
      })
    );
  }
}

function* getMembersForOrgGroup(data, params) {
  try {
    console.log("getMembersForOrgGroup 2");
    const res = yield params.mcxClient.admin.getMembersForOrgGroup(data.data);
    console.log("getMembersForOrgGroup 2", res);
    yield put({ type: UPDATE_ORG_GROUP_ADMIN, data: res });
  } catch (error) {
    console.log("saga error fetch getMembersForOrgGroup", error);
    yield put(
      showMessage({
        header: "Admin Error",
        content: "Failed to fetch getMembersForOrgGroup",
        type: "error",
      })
    );
  }
}

function* resetOrgGroupAdmin() {
  yield put({ type: UPDATE_ORG_GROUP_ADMIN, data: [] });
}

function* getGroupDetail(data, params) {
  try {
    console.log("getGroupDetail 2", data);
    const res = yield params.mcxClient.admin.getGroupDetail(data.data);
    console.log("getGroupDetail 2", res);
    yield put({ type: UPDATE_GROUP_DETAIL_ADMIN, data: res });
  } catch (error) {
    console.log("saga error getGroupDetail", error);
    yield put(
      showMessage({
        header: "Admin Error",
        content: "Failed to fetchGroupDetail",
        type: "error",
      })
    );
  }
}



function* getAffiliations(data, params) {
  try {
    console.log("getAffiliations 2", data);
    const res = yield params.mcxClient.cmc.getAffiliations(data.data);
    console.log("getAffiliations 2", res);
    //yield put({ type: UPDATE_GROUP_DETAIL_ADMIN, data: res });
  } catch (error) {
    console.log("saga error getAffiliations", error);
    yield put(
      showMessage({
        header: "Admin Error",
        content: "Failed to getAffiliations",
        type: "error",
      })
    );
  }
}

function* getActiveUsers(data, params) {
  try {
    console.log("getActiveUsers 2", data);
    const res = yield params.mcxClient.cmc.getActiveUsers(data.data);
    console.log("getActiveUsers 2", res);
    //yield put({ type: UPDATE_GROUP_DETAIL_ADMIN, data: res });
  } catch (error) {
    console.log("saga error getActiveUsers", error);
    yield put(
      showMessage({
        header: "Admin Error",
        content: "Failed to getActiveUsers",
        type: "error",
      })
    );
  }
}

function* getAllAlerts(params) {
  console.log("in getAllAlerts")
  try {
    console.log("getActiveUsers 2");
    const res = yield params.mcxClient.admin.getAllAlerts();
    console.log("getActiveUsers 2", res);
    yield put({ type: UPDATE_ALL_ALERT_LIST, data: res });
  } catch (error) {
    console.log("saga error getActiveUsers", error);
    yield put(
      showMessage({
        header: "Admin Error",
        content: "Failed to All Alerts",
        type: "error",
      })
    );
  }
}

function* getAllTasks(data, params) {
  try {
    console.log("TASK LIST REQ getAllTasks params", data.data);
    const res = yield params.mcxClient.task.getAllTasks(data.data);
    console.log("TASK LIST REQ getAllTasks res", res);
    yield put({ type: UPDATE_TASK_LIST, data: res });
  } catch (error) {
    console.log("saga error getAllTasks", error);
    // yield put(
    //   showMessage({
    //     header: "Task Error",
    //     content: "Failed to All Tasks",
    //     type: "error",
    //   })
    // );
  }
}

function* getActiveTaskCount(data, params) {
  try {
    const res = yield params.mcxClient.task.getActiveTasksCount(data.data);
    console.log("getActiveTaskCount res", res);
    yield put({ type: UPDATE_ACTIVE_TASK_COUNT, data: res });
  } catch (error) {
    console.log("saga error getActiveTaskCount", error, params.mcxClient.task);
    // yield put(
    //   showMessage({
    //     header: "Task Error",
    //     content: "Failed to All Tasks",
    //     type: "error",
    //   })
    // );
  }
}

function* getAlertTypes(params) {
  console.log("in getAlertTypes")
  try {
    console.log("getAlertTypes 2");
    const res = yield params.mcxClient.admin.getAlertTypes();
    console.log("getAlertTypes 2", res);
    yield put({ type: UPDATE_ALL_ALERT_LIST_TYPES, data: res });
  } catch (error) {
    console.log("saga error getAlertTypes", error);
    yield put(
      showMessage({
        header: "Admin Error",
        content: "Failed to All Alerts Type",
        type: "error",
      })
    );
  }
}

function* editAlert(data, params) {
  console.log("in getAlertTypes")
  try {
    console.log("getAlertTypes 2");
    const res = yield params.mcxClient.admin.editAlert({ data: data.data });
    console.log("getAlertTypes 2", res);
    if (!res.data.error)
      yield call(getAllAlerts, params);
  } catch (error) {
    console.log("saga error getAlertTypes", error);
    yield put(
      showMessage({
        header: "Admin Error",
        content: "Failed to All Alerts Type",
        type: "error",
      })
    );
  }
}

function* deleteAlert(data, params) {
  console.log("in deleteAlert")
  try {
    console.log("deleteAlert 2");
    const res = yield params.mcxClient.admin.deleteAlert({ data: data.data });
    console.log("deleteAlert 2", res);
    if (!res.data.error)
      yield call(getAllAlerts, params);
  } catch (error) {
    console.log("saga error deleteAlert", error);
    yield put(
      showMessage({
        header: "Admin Error",
        content: "Failed to Delete Alert",
        type: "error",
      })
    );
  }
}

function* addAlert(data, params) {
  console.log("in addAlert")
  try {
    console.log("addAlert 2");
    const res = yield params.mcxClient.admin.addAlert({ data: data.data });
    console.log("addAlert 2", res);
    if (!res.data.error)
      yield call(getAllAlerts, params);
  } catch (error) {
    console.log("saga error addAlert", error);
    yield put(
      showMessage({
        header: "Admin Error",
        content: "Failed to Add Alert",
        type: "error",
      })
    );
  }
}

function* getCallRecord(data, params) {
  try {
    const res = yield params.mcxClient.recordings.getCallRecord(data.data);
   console.log("getCallRecord res", res);
    yield put({ type: UPDATE_CALL_RECORD, data: res });
  } catch (error) {
    console.log("saga error getCallRecord", error);
  }
}

function* getChatUserList(data,params){
  try{
      const res = yield params.mcxClient.store.getChatList(data.data)
     // console.log("SET_CHAT_USERLIST in SAGA",res);
      yield put({type: SET_CHAT_USERLIST, data: res})
  } catch(err){
    console.log("saga error getting chat lsit", err);
  }
}

function* setCallForward(data,params){
  try{
      const res = yield params.mcxClient.setCallForwardingInfo(data.data)
      // console.log("SET_CALL_FORWARD in SAGA",res);
  } catch(err){
    console.log("saga error SETTING CALL FORWARD", err);
  }
}
export default handleNewMessage;
