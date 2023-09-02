import React, { Component, useState, useEffect } from "react";
import NativeSelect from "@material-ui/core/NativeSelect";
import InputBase from "@material-ui/core/InputBase";
import { makeStyles, withStyles } from "@material-ui/core/styles";

const PrivateCalls = (props) => {
  const [groups, setgroup] = useState({
    privateCalls: "",
    emergencyContact: "",
  });

  const [grp1, setgrp1] = React.useState("");

  const [grp2, setgrp2] = React.useState("");

  const privateCallsChangeHandler = (e) => {
    setgroup({
      ...groups,
      privateCalls: e.target.value,
    });
    setgrp1(e.target.value);
  };
  const emergencyContactChangeHandler = (e) => {
    setgroup({
      ...groups,
      emergencyContact: e.target.value,
    });
    setgrp2(e.target.value);
  };

  const BootstrapInput = withStyles((theme) => ({
    root: {
      "label + &": {
        marginTop: theme.spacing(3),
      },
    },
    input: {
      borderRadius: 4,
      position: "relative",
      backgroundColor: theme.palette.background.paper,
      border: "1px solid #ced4da",
      fontSize: 16,
      padding: "10px 26px 10px 12px",
      transition: theme.transitions.create(["border-color", "box-shadow"]),
      // Use the system font instead of the default Roboto font.
      fontFamily: [
        "-apple-system",
        "BlinkMacSystemFont",
        '"Segoe UI"',
        "Roboto",
        '"Helvetica Neue"',
        "Arial",
        "sans-serif",
        '"Apple Color Emoji"',
        '"Segoe UI Emoji"',
        '"Segoe UI Symbol"',
      ].join(","),
      "&:focus": {
        borderRadius: 4,
        borderColor: "#80bdff",
        boxShadow: "0 0 0 0.2rem rgba(0,123,255,.25)",
      },
    },
  }))(InputBase);

  const PrivateCallList = [
    { text: "Call1", value: "Call1" },
    { text: "Call2", value: "Call2" },
    { text: "Call3", value: "Call3" },
  ];
  const EmergencyContact = [
    { text: "Call1", value: "Call1" },
    { text: "Call2", value: "Call2" },
    { text: "Call3", value: "Call3" },
  ];

  const UpdatePrivateCalls = (e) => {
    e.preventDefault();
    console.log(groups);
    props.onPrivateCallsUpdate(groups);
  };

  return (
    <div>
      <label class="tab1-heading"> Private Call List</label>
      <div class="form-group">
        <div class="form-group">
          <NativeSelect
            id="Group-native-select4"
            value={grp1}
            onChange={privateCallsChangeHandler}
            input={<BootstrapInput />}
          >
            {PrivateCallList.map((grpobj, index) => (
              <option
                key={index}
                name={grpobj.value}
                // variant="outline-el-b-dark"
                value={grpobj.value}
                // onChange={(e) => setSelectedPrior(e.target.value)}
              >
                {grpobj.text}
              </option>
            ))}
          </NativeSelect>
        </div>
      </div>
      <label> Member 1</label>
      <br></br>
      Member 2<br></br>
      <div class="main-control-grid ctl-bottom-gap">
        <div>
          <label for="member3">Member 3</label>
        </div>
      </div>
      <br></br>
      <label class="tab1-heading">Emergency Contact</label>
      <div class="form-group">
        <NativeSelect
          id="Group-native-select1"
          value={grp2}
          onChange={emergencyContactChangeHandler}
          input={<BootstrapInput />}
        >
          {EmergencyContact.map((grpobj, index) => (
            <option
              key={index}
              name={grpobj.value}
              // variant="outline-el-b-dark"
              value={grpobj.value}
              // onChange={(e) => setSelectedPrior(e.target.value)}
            >
              {grpobj.text}
            </option>
          ))}
        </NativeSelect>
      </div>
      <br></br>
      <button
        class="btn update-button"
        onClick={UpdatePrivateCalls}
        type="button"
      >
        Update
      </button>
    </div>
  );
};

export default PrivateCalls;
