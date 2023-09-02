import Switch from "@material-ui/core/Switch";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import React, { Component, useState, useEffect } from "react";

const AddFunctionalAlias = () => {
  return (
    <div id="mainfunAlias">
      <br></br>
      <label class="tab1-heading"> Functonal Alias</label>

      <br></br>
      <br></br>
      <div class="main-control-grid ctl-bottom-gap">
        <div>
          <label for="aliasName" class="lblAlias">
            Alias Name
          </label>
        </div>
        <div>
          <input type="text" class="form-control" id="aliasName" />
        </div>
      </div>

      <br></br>

      <FormControlLabel
        value="start"
        control={<Switch color="primary" />}
        label="Functinal Alias Switch"
        labelPlacement="start"
      />

      <div>
        <button class="btn update-button" type="button">
          Update
        </button>
      </div>
    </div>
  );
};
export default AddFunctionalAlias;
