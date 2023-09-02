import React, { Component, useState, useEffect } from "react";
import Switch from "@material-ui/core/Switch";
import FormControlLabel from "@material-ui/core/FormControlLabel";

const McdataConfig = (props) => {
  const [mcDataConfig, setmcDataConfig] = useState({
    MaxData1: "",
    MaxTime1: "",
    MaxOfiliation: "",
    ReqGroup: false,
    ReqOtherGroup: false,
  });

  const maxDataChangeHandler = (e) => {
    setmcDataConfig({
      ...mcDataConfig,
      MaxData1: e.target.value,
    });
  };
  const maxTimeChangeHandler = (e) => {
    setmcDataConfig({
      ...mcDataConfig,
      MaxTime1: e.target.value,
    });
  };
  const maxOfiliationChangeHandler = (e) => {
    setmcDataConfig({
      ...mcDataConfig,
      MaxOfiliation: e.target.value,
    });
  };
  const reqGrpChangeHandler = (e) => {
    setmcDataConfig({
      ...mcDataConfig,
      ReqGroup: e.target.checked,
    });
  };
  const reqOthrGrpChangeHandler = (e) => {
    setmcDataConfig({
      ...mcDataConfig,
      ReqOtherGroup: e.target.checked,
    });
  };

  const UpdateMCDataConfig = (e) => {
    e.preventDefault();
    console.log(mcDataConfig);
    props.onMcDataUpdate(mcDataConfig);
  };

  return (
    <div>
      <label class="tab1-heading"> Tx Rx Control</label>

      <div class="main-control-grid ctl-bottom-gap">
        <div>
          <label for="maxdata">Max Data 1 to 1</label>
        </div>
        <div>
          <input
            type="text"
            class="form-control"
            id="maxdata"
            value={mcDataConfig.MaxData1}
            onChange={maxDataChangeHandler}
          />
        </div>
      </div>

      <div class="main-control-grid ctl-bottom-gap">
        <div>
          <label for="maxtime1">Max Time 1 to 1</label>
        </div>
        <div>
          <input
            type="text"
            class="form-control"
            id="maxtime1"
            value={mcDataConfig.MaxTime1}
            onChange={maxTimeChangeHandler}
          />
        </div>
      </div>

      <label class="tab1-heading">On Network</label>

      <div class="main-control-grid ctl-bottom-gap">
        <div>
          <label for="maxofiliation">Max Ofiliation</label>
        </div>
        <div>
          <input
            type="text"
            class="form-control"
            id="maxofiliation"
            value={mcDataConfig.MaxOfiliation}
            onChange={maxOfiliationChangeHandler}
          />
        </div>
      </div>
      <br></br>
      <label class="tab1-heading"> Allows</label>
      <br></br>
      <FormControlLabel
        value="start"
        control={<Switch color="primary" />}
        label="Request ofiliated group"
        labelPlacement="start"
        onChange={reqGrpChangeHandler}
      />
      <br></br>
      <FormControlLabel
        value="start"
        control={<Switch color="primary" />}
        label="Request to ofiliated other user"
        labelPlacement="start"
        onChange={reqOthrGrpChangeHandler}
      />
      <br></br>
      <button
        class="btn update-button"
        type="button"
        onClick={UpdateMCDataConfig}
      >
        Update
      </button>
    </div>
  );
};

export default McdataConfig;
