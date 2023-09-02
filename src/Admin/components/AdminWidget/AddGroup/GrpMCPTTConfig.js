import React, { Component, useState, useEffect } from "react";
import Switch from "@material-ui/core/Switch";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import { makeStyles, ThemeProvider } from "@material-ui/styles";
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';
const DefaultmcpttConfigData = {
  groupType: "Prearranged",
  hangTimer: {
    hour: 0,
    min: 0,
    sec: 0
  }
}
const GrpMCPTTConfig = (props) => {
  const { mcpttconfihHandler,grpMcpttConfigData,purpose } = props
  const [newOrUpdateProfile, setNewOrUpdateProfile] = useState(true)
  const [emptyHour, setEmptyHour] = useState(true)
  const [emptyMinute, setEmptyMinute] = useState(true)
  const [emptySecond, setEmptySecond] = useState(true)

  const [selectedGroupType, setSelectedGroupType] = useState("Prearranged")
  const [mcpttConfigData, SetmcpttConfigData] = useState(DefaultmcpttConfigData)


  useEffect(()=>{
    if(purpose==="edit"){
      SetmcpttConfigData(grpMcpttConfigData)
      setSelectedGroupType(grpMcpttConfigData.groupType)
      setEmptyHour(false)
    }
    else{
      SetmcpttConfigData(DefaultmcpttConfigData)
    }
  },[])
  const UpdateBasicDetails = () => {
    //console.log(mcpttConfigData.hangTimer.hour===0 && mcpttConfigData.hangTimer.min===0 && mcpttConfigData.hangTimer.sec===0,mcpttConfigData.hangTimer)
     if(parseInt(mcpttConfigData.hangTimer.hour) === 0 && parseInt(mcpttConfigData.hangTimer.min)===0 && parseInt(mcpttConfigData.hangTimer.sec)===0){
      setEmptyHour(true)
     }
    else{
      console.log("mcptt config data", mcpttConfigData);

      mcpttconfihHandler(mcpttConfigData)
    }
    

  }
  const GroupTypeOptions = [
    { text: "PREARRANGED", value: "Prearranged" },
    { text: "TEMPORARY", value: "TEMPORARY" },
  ];
  const handleUserTypeChange = (e) => {
    setSelectedGroupType(e.target.value)
    SetmcpttConfigData({
      ...mcpttConfigData,
      groupType: e.target.value
    })
    console.log("Group Type change", mcpttConfigData)

  };

  const hourChangeHandler = (e) => {
    SetmcpttConfigData({
      ...mcpttConfigData,
      hangTimer: {
        ...mcpttConfigData.hangTimer,
        hour: e.target.value ? parseInt(e.target.value) : 0
      }

    });
    if (e.target.value.length!==0) {
      setEmptyHour(false)
    } 
    console.log("update hang hour", mcpttConfigData);

  };
  const minuteChangeHandler = (e) => {
    SetmcpttConfigData({
      ...mcpttConfigData,
      hangTimer: {
        ...mcpttConfigData.hangTimer,
        min: e.target.value ? parseInt(e.target.value) : 0
      }

    });
    if (e.target.value.length!==0) {
      setEmptyHour(false)
    } 
    console.log("update hang hour", mcpttConfigData);

  };
  const secondChangeHandler = (e) => {
    SetmcpttConfigData({
      ...mcpttConfigData,
      hangTimer: {
        ...mcpttConfigData.hangTimer,
        sec: e.target.value ? parseInt(e.target.value) : 0
      }

    });
    if (e.target.value.length!==0) {
      setEmptyHour(false)
    } 
    console.log("update hang hour", mcpttConfigData);
    

  };
  

  const useStyles = makeStyles((theme) => ({
    root: {
      width: '100%',
      maxWidth: 360,
    },
    formControl: {
      width: '100%',
      marginTop: '5px',
    },
    formControlFA: {
      width: '80%',
      height: '60px',
      marginTop: '5px',
    },
    listItemFA: {
      padding: '5px',
      fontFamily: 'Muli'
    },
    tetraSwitch: {
      fontFamily: 'Muli',
      marginTop: '2px',
      marginRight: '1px'
    }
  }));
  const classes = useStyles();

  return (
    <div>
      {/* <label class="tab1-heading"> Tx Rx Control</label>

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
        label="Protect Floor Control Signaling"
        labelPlacement="start"
      />
      <br></br>
      <FormControlLabel
        value="start"
        control={<Switch color="primary" />}
        label="Req. Multicast Floor Control Signaling"
        labelPlacement="start"
      />
      <br></br>
      <label class="tab1-heading">On Network</label> */}

      {/* <div class="main-control-grid ctl-bottom-gap">
        <div>
          <label for="grptype">Group Type</label>
        </div>
        <div>
          <input type="text" class="form-control" id="grptype" />
        </div>
      </div> */}
      <div class="form-group">
        <label class="attribute-heading">Group Type</label>
        {/* <input
                type="text"
                class="input-control"
                id="grptype"
                // value={basicdetails && basicdetails.userName}
                // onChange={userNameChangeHandler}
              /> */}
        <FormControl variant="filled" className={classes.formControl}>
          <InputLabel id="demo-simple-select-filled-label" className={classes.listItemFA}>Group Type</InputLabel>
          <Select
            className={classes.listItemFA}
            labelId="demo-simple-select-filled-label"
            id="demo-simple-select-filled"
            value={selectedGroupType}
            onChange={handleUserTypeChange}
          >
            {GroupTypeOptions && GroupTypeOptions.map((grouptype) => {
              return (
                <MenuItem value={grouptype.value}>{grouptype.text}</MenuItem>
              )
            })}
          </Select>
        </FormControl>
      </div>
      {/* <div class="main-control-grid ctl-bottom-gap">
        <div>
          <label for="maxcount">Max Participant Count</label>
        </div>
        <div>
          <input type="text" class="form-control" id="maxcount" />
        </div>
      </div> */}
      {/* <div class="main-control-grid ctl-bottom-gap">
        <div>
          <label for="hangtimer">Hang Timer</label>
        </div>
        <div>
          <input type="text" class="form-control" id="hangtimer" />
        </div>
      </div> */}
      <div class="form-group">
        <label class="attribute-heading">Hang Timer</label>
        <div class="hang-time-conatiner">
          {/* <input
            type="text"
            class="hang-time-input"
            id="hangtimer_hrs"
            maxLength="2"
            pattern="[0-9]*"
            value={mcpttConfigData.hangTimer.hour}
            onChange={hourChangeHandler}
          />
          <label class="hang-time-label">Hr</label>
          <input
            type="text"
            class="hang-time-input"
            id="hangtimer_min"
            maxLength="2"
            pattern="[0-9]*"
            value={mcpttConfigData.hangTimer.min}
            onChange={minuteChangeHandler}
          />
          <label class="hang-time-label">Min</label> */}
          <input
            type="text"
            class="hang-time-input"
            id="hangtimer_sec"
            maxLength="2"
            pattern="[0-9]*"
            value={mcpttConfigData.hangTimer.sec}
            onChange={secondChangeHandler}
          />
          <label class="hang-time-label">Sec</label>
        </div>
        {
                emptyHour === true ?
                  (
                    <label class="error-handling-lbl">Please enter timer</label>
                  )
                  :
                  null
              }
      </div>
      {/* <div class="main-control-grid ctl-bottom-gap">
        <div>
          <label for="maxduration">Max Duration</label>
        </div>
        <div>
          <input type="text" class="form-control" id="maxduration" />
        </div>
      </div>
      <div class="main-control-grid ctl-bottom-gap">
        <div>
          <label for="minstart">Min number to start</label>
        </div>
        <div>
          <input type="text" class="form-control" id="minstart" />
        </div>
      </div>
      <br></br>
      <label class="tab1-heading">Timeout For ACK of required members</label>
      <div class="main-control-grid ctl-bottom-gap">
        <div>
          <label for="duration">Duration</label>
        </div>
        <div>
          <input type="text" class="form-control" id="duration" />
        </div>
      </div>
      <div class="main-control-grid ctl-bottom-gap">
        <div>
          <label for="action">Action</label>
        </div>
        <div>
          <input type="text" class="form-control" id="action" />
        </div>
      </div> */}

      <div>
        <button
          class="update-btn-profile"
          type="button"
          onClick={UpdateBasicDetails}
        >
          {newOrUpdateProfile ? 'SUBMIT' : 'UPDATE'}
        </button>
      </div>
    </div>
  );
};
export default GrpMCPTTConfig;
