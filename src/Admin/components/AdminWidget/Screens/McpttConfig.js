import React, { Component, useState, useEffect } from "react";
import Switch from "@material-ui/core/Switch";
import FormControlLabel from "@material-ui/core/FormControlLabel";

const McpttConfig = (props) => {
  const [mcpttConfig, setmcpttConfig] = useState({
    MaxSimCall: "",
    Priority: "",
    PrivateCall: false,
    MannualCommancement: false,
    ForceAutoAnswer: false,
    AutomaticCommancement: false,
    EmergencyGrpCall: false,
    CancelGrpEmergency: false,
    EmergencyPrivateCall: false,
    CancelPrivateEmergency: false,
    ActivateEmergencyAlert: false,
    crtDltUserAlias: false,
    MaxAllocation: "",
    MaxSimTransmission: "",
    CancelEmergencyAlert: false,
    PrivateMediaCallProtection: false,
    PrivateCallForProtection: false,
    ReqAffiliatedGrps: false,
    PrivateCallToUser: false,
    PrivateCallParticipation: false,
    ReqRemoteInitiated: false,
    ReqLocallyInitiated: false,
  });

  const maxSimChangeHandler = (e) => {
    setmcpttConfig({
      ...mcpttConfig,
      MaxSimCall: e.target.value,
    });
  };
  const priorityChangeHandler = (e) => {
    setmcpttConfig({
      ...mcpttConfig,
      Priority: e.target.value,
    });
  };
  const privateCallChangeHandler = (e) => {
    setmcpttConfig({
      ...mcpttConfig,
      PrivateCall: e.target.checked,
    });
  };
  const manComChangeHandler = (e) => {
    setmcpttConfig({
      ...mcpttConfig,
      MannualCommancement: e.target.checked,
    });
  };
  const forceAnsChangeHandler = (e) => {
    setmcpttConfig({
      ...mcpttConfig,
      ForceAutoAnswer: e.target.checked,
    });
  };
  const autoComChangeHandler = (e) => {
    setmcpttConfig({
      ...mcpttConfig,
      AutomaticCommancement: e.target.checked,
    });
  };
  const emerGrpCallChangeHandler = (e) => {
    setmcpttConfig({
      ...mcpttConfig,
      EmergencyGrpCall: e.target.checked,
    });
  };
  const cancGrpChangeHandler = (e) => {
    setmcpttConfig({
      ...mcpttConfig,
      CancelGrpEmergency: e.target.checked,
    });
  };
  const emerPrivateCallChangeHandler = (e) => {
    setmcpttConfig({
      ...mcpttConfig,
      EmergencyPrivateCall: e.target.checked,
    });
  };
  const cancPrivateEmerChangeHandler = (e) => {
    setmcpttConfig({
      ...mcpttConfig,
      CancelPrivateEmergency: e.target.checked,
    });
  };
  const activEmerAlertChangeHandler = (e) => {
    setmcpttConfig({
      ...mcpttConfig,
      ActivateEmergencyAlert: e.target.checked,
    });
  };
  const allowCrtDltUserAliasChangeHandler = (e) => {
    setmcpttConfig({
      ...mcpttConfig,
      crtDltUserAlias: e.target.checked,
    });
  };
  const maxAllocChangeHandler = (e) => {
    setmcpttConfig({
      ...mcpttConfig,
      MaxAllocation: e.target.value,
    });
  };
  const maxSimTransChangeHandler = (e) => {
    setmcpttConfig({
      ...mcpttConfig,
      MaxSimTransmission: e.target.value,
    });
  };
  const cancEmerAlertChangeHandler = (e) => {
    setmcpttConfig({
      ...mcpttConfig,
      CancelEmergencyAlert: e.target.checked,
    });
  };
  const privMedCallProtChangeHandler = (e) => {
    setmcpttConfig({
      ...mcpttConfig,
      PrivateMediaCallProtection: e.target.checked,
    });
  };
  const privCallProtChangeHandler = (e) => {
    setmcpttConfig({
      ...mcpttConfig,
      PrivateCallForProtection: e.target.checked,
    });
  };
  const reqAffGrpChangeHandler = (e) => {
    setmcpttConfig({
      ...mcpttConfig,
      ReqAffiliatedGrps: e.target.checked,
    });
  };
  const privCallToUsrChangeHandler = (e) => {
    setmcpttConfig({
      ...mcpttConfig,
      PrivateCallToUser: e.target.checked,
    });
  };
  const privCallPartChangeHandler = (e) => {
    setmcpttConfig({
      ...mcpttConfig,
      PrivateCallParticipation: e.target.checked,
    });
  };
  const reqRemotIniChangeHandler = (e) => {
    setmcpttConfig({
      ...mcpttConfig,
      ReqRemoteInitiated: e.target.checked,
    });
  };
  const reqLocIniChangeHandler = (e) => {
    setmcpttConfig({
      ...mcpttConfig,
      ReqLocallyInitiated: e.target.checked,
    });
  };

  const UpdateMcpttConfig = (e) => {
    e.preventDefault();
    console.log(mcpttConfig);
    props.onMcPttConfigUpdate(mcpttConfig);
  };

  return (
    <div>
      <label class="tab1-heading"> Group Calls</label>

      <div>
        <div class="main-control-grid ctl-bottom-gap">
          <div>
            <label for="maxsimcall">Max sim call</label>
          </div>
          <div>
            <input
              type="text"
              class="form-control"
              id="maxsimcall"
              value={mcpttConfig.MaxSimCall}
              onChange={maxSimChangeHandler}
            />
          </div>
        </div>

        <div class="main-control-grid ctl-bottom-gap">
          <div>
            <label for="priority">Priority</label>
          </div>
          <div>
            <input
              type="text"
              class="form-control"
              id="priority"
              value={mcpttConfig.Priority}
              onChange={priorityChangeHandler}
            />
          </div>
        </div>
      </div>
      <div class="main-control-grid">
        <div>
          <FormControlLabel
            value="start"
            control={<Switch color="primary" />}
            label="Private Call"
            labelPlacement="start"
            onChange={privateCallChangeHandler}
          />
        </div>
        <div>
          <FormControlLabel
            value="start"
            control={<Switch color="primary" />}
            label="Mannual Commancement"
            labelPlacement="start"
            onChange={manComChangeHandler}
          />
        </div>
      </div>
      <div class="main-control-grid">
        <div>
          <FormControlLabel
            value="start"
            control={<Switch color="primary" />}
            label="Force Auto Answer"
            labelPlacement="start"
            onChange={forceAnsChangeHandler}
          />
        </div>
        <div>
          <FormControlLabel
            value="start"
            control={<Switch color="primary" />}
            label="Automatic Commancement"
            labelPlacement="start"
            onChange={autoComChangeHandler}
          />
        </div>
      </div>
      <div class="main-control-grid">
        <div>
          <FormControlLabel
            value="start"
            control={<Switch color="primary" />}
            label="Emergency Group Call"
            labelPlacement="start"
            onChange={emerGrpCallChangeHandler}
          />
        </div>
        <div>
          <FormControlLabel
            value="start"
            control={<Switch color="primary" />}
            label="Cancel Group Emergency"
            labelPlacement="start"
            onChange={cancGrpChangeHandler}
          />
        </div>
      </div>
      <div class="main-control-grid">
        <div>
          <FormControlLabel
            value="start"
            control={<Switch color="primary" />}
            label="Emergency Private Call"
            labelPlacement="start"
            onChange={emerPrivateCallChangeHandler}
          />
        </div>
        <div>
          <FormControlLabel
            value="start"
            control={<Switch color="primary" />}
            label="Cancel Private Emergency"
            labelPlacement="start"
            onChange={cancPrivateEmerChangeHandler}
          />
        </div>
      </div>
      <div class="main-control-grid">
        <div>
          <FormControlLabel
            value="start"
            control={<Switch color="primary" />}
            label="Activate emergency alert"
            labelPlacement="start"
            onChange={activEmerAlertChangeHandler}
          />
        </div>
        <div>
          <FormControlLabel
            value="start"
            control={<Switch color="primary" />}
            label="Allow create/ delete user alias"
            labelPlacement="start"
            onChange={allowCrtDltUserAliasChangeHandler}
          />
        </div>
      </div>

      <label class="tab1-heading"> On network</label>

      <div class="main-control-grid ctl-bottom-gap">
        <div>
          <label for="maxsimcall">Max Allocation</label>
        </div>
        <div>
          <input
            type="text"
            class="form-control"
            id="maxallocation"
            value={mcpttConfig.MaxAllocation}
            onChange={maxAllocChangeHandler}
          />
        </div>
      </div>

      <div class="main-control-grid ctl-bottom-gap">
        <div>
          <label for="maxsimcall">Max Sim Transmision</label>
        </div>
        <div>
          <input
            type="text"
            class="form-control"
            id="maxsimtrans"
            value={mcpttConfig.MaxSimTransmission}
            onChange={maxSimTransChangeHandler}
          />
        </div>
      </div>

      <div class="main-control-grid">
        <div>
          <FormControlLabel
            value="start"
            control={<Switch color="primary" />}
            label="Cancel Emergency Alert"
            labelPlacement="start"
            onChange={cancEmerAlertChangeHandler}
          />
        </div>
        <div>
          <FormControlLabel
            value="start"
            control={<Switch color="primary" />}
            label="Private Media Call Protection"
            labelPlacement="start"
            onChange={privMedCallProtChangeHandler}
          />
        </div>
      </div>
      <div class="main-control-grid">
        <div>
          <FormControlLabel
            value="start"
            control={<Switch color="primary" />}
            label="Private Call For Protection"
            labelPlacement="start"
            onChange={privCallProtChangeHandler}
          />
        </div>
        <div>
          <FormControlLabel
            value="start"
            control={<Switch color="primary" />}
            label="Request Affiliated Groups"
            labelPlacement="start"
            onChange={reqAffGrpChangeHandler}
          />
        </div>
      </div>
      <div class="main-control-grid">
        <div>
          <FormControlLabel
            value="start"
            control={<Switch color="primary" />}
            label="Private Call To Any User"
            labelPlacement="start"
            onChange={privCallToUsrChangeHandler}
          />
        </div>
        <div>
          <FormControlLabel
            value="start"
            control={<Switch color="primary" />}
            label="Private Call Participation"
            labelPlacement="start"
            onChange={privCallPartChangeHandler}
          />
        </div>
      </div>
      <div class="main-control-grid">
        <div>
          <FormControlLabel
            value="start"
            control={<Switch color="primary" />}
            label="Request Remot Initiated"
            labelPlacement="start"
            onChange={reqRemotIniChangeHandler}
          />
        </div>
        <div>
          <FormControlLabel
            value="start"
            control={<Switch color="primary" />}
            label="Request Locally Initiated"
            labelPlacement="start"
            onChange={reqLocIniChangeHandler}
          />
        </div>
      </div>
      <button
        class="btn update-button"
        type="button"
        onClick={UpdateMcpttConfig}
      >
        Update
      </button>
    </div>
  );
};

export default McpttConfig;
