import { connect } from "react-redux";

import { atsMessageReceived, updateLocation } from "../modules/actions";
import {
  textMessageReceived,
  groupTextMessageReceived,
  updateTextMessageState,
  updateGroupTextMessageState,
  individualCallReceived,
  updateIndividualCallAction,
  groupCallReceived,
  updateGroupCallAction,
} from "../modules/communication";
import {
  fetchAllSubscribersSuccess,
  fetchAllGroupsSuccess,
} from "../modules/user";
import { statusReceived, groupStatusReceived } from "../modules/alarm";
import {
  connectionOpened,
  connectionClosed,
  pipelineActive,
  pipelineDestroyed,
  systemStatusReceived,
} from "../modules/connection";
import { host } from "../constants/endpoints";

import io  from 'socket.io-client'

const remoteAudio = document.getElementById("remoteAudio");
const localAudio = document.getElementById("localAudio");

class setupMCX {
    constructor(user){
        this.user=user;
    };

    mcxConnect = ()=>{
          if (!this.user) {
            return;
          }
          console.log("in mcx Setup", this);
          remoteAudio.addEventListener(
            "error",
            (ev) => {
              if (ev) {
                alert(ev.error);
                console.log("ElementError", ev.error);
              }
            },
            false
          );
        };
}

export default setupMCX