import React, { Component, useState, useEffect } from "react";
import Switch from "@material-ui/core/Switch";
import FormControlLabel from "@material-ui/core/FormControlLabel";

const GrpMCDataConfig = () => {
  return (
    <div>
      <label class="tab1-heading">SDS</label>

      <br></br>
      <FormControlLabel
        value="start"
        control={<Switch color="primary" />}
        label="Allow SDS"
        labelPlacement="start"
      />
      <br></br>
      <FormControlLabel
        value="start"
        control={<Switch color="primary" />}
        label="Protect Media"
        labelPlacement="start"
      />
      <br></br>
      <FormControlLabel
        value="start"
        control={<Switch color="primary" />}
        label="Protect Transmission Control"
        labelPlacement="start"
      />
      <br></br>
      <label class="tab1-heading">On Network</label>

      <div class="main-control-grid ctl-bottom-gap">
        <div>
          <label for="maxsize">Max Data SDS size</label>
        </div>
        <div>
          <input type="text" class="form-control" id="maxsize" />
        </div>
      </div>
      <div>
        <button class="btn update-button" type="button">
          Update
        </button>
      </div>
    </div>
  );
};

export default GrpMCDataConfig;
