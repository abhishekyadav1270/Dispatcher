import React, { useEffect, useState } from 'react'

import { Grid, Checkbox, FormControlLabel, makeStyles, Typography, Button, RadioGroup, Radio } from '@material-ui/core';
import FormControl from '@mui/material/FormControl';
import Select from 'react-select';
import makeAnimated from 'react-select/animated';
import './player.css'
import { getCallRecord } from "../../modules/actions/playerAction";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import DateTimePicker from 'react-datetime-picker'
import 'react-datetime-picker/dist/DateTimePicker.css';
import 'react-calendar/dist/Calendar.css';
import 'react-clock/dist/Clock.css';

const animatedComponents = makeAnimated();


const useStyles = makeStyles({
  checkBoxColor: {
    '&.MuiCheckbox-root': {
      color: "#ffb01f",
    }
  },
  formGroupDirection: {
    '&.MuiFormGroup-root': {
      flexDirection: "row",
      justifyContent: "space-between"
    }
  },
  radioColor: {
    '&.MuiRadio-colorSecondary': {
      color: "#ffb01f"
    }
  },
  dateTimePicker :{
    '&react-datetime-picker':{
      backgroundColor:"red"
    }
  }
});

const selectStyle = {
  option: provided => ({
    ...provided,
    color: 'black',
    fontFamily: ["Roboto", "Helvetica", "Arial", "sans-serif"],
    ':hover': {
      backgroundColor: "lightgray",
    },
  })
}


const SearchOptions = (props) => {
  const classes = useStyles();
  const [startDate, setstartDate] = useState(new Date(Date.now() - 86400000));
  const [endDate, setendDate] = useState(new Date());
  const [recordType, setRecordType] = useState("Call");
  const [callType, setCallType] = useState("private");
  // const [sdsType, setSdsType] = useState("textMessage")
  // const [registerType , setRegisterType]= useState("register");
  const [isOnlyTo, setIsOnlyTo] = useState(false);
  const [onlyTo, setOnlyTo] = useState([]);
  const [isOnlyFrom, setIsOnlyFrom] = useState(false);
  const [onlyFrom, setOnlyFrom] = useState([]);
  const [usersOption, setUsersOption] = useState([]);
  const [groupsOption, setGroupsOption] = useState([]);
  const [isOnlyGroup, setIsOnlyGroup] = useState(false);
  const [onlyGroup, setOnlyGroup] = useState([]);
  const {
    contactList
  } = props;
  const handleCallTypeChanged = (event) => {
    console.log("------calltype--", event.target.value);
    setCallType(event.target.value);
  }

  const handleRecordTypeChanged = (event) => {
    console.log("------Recordtype--", event.target.value);
    setRecordType(event.target.value);
    if (event.target.value == "Call")
      setCallType("private")
    else if (event.target.value == "SDS")
      setCallType("TEXT_MESSAGE")
    else if (event.target.value == "Registration")
      setCallType("Registered")
  }

  // const handleSDSTypeChanged = (event) => {
  //   console.log("------SDStype--", event.target.value);
  //   setSdsType(event.target.value);
  // }

  // const handleRegisterTypeChanged = (event) => {
  //   console.log("------Registertype--", event.target.value);
  //   setRegisterType(event.target.value);
  // }

  const handleShowButton = () => {
    let fromVal = onlyFrom.map((element) => element.label);
    let groupVal = onlyGroup.map((element) => element.label);
    let toVal = onlyTo.map((element) => element.label);

    let params = {
      callType,
      startDate,
      endDate,
      isOnlyFrom,
      onlyFrom: fromVal,
      isOnlyTo,
      onlyTo: toVal,
      isOnlyGroup,
      onlyGroup: groupVal,
      page: 1,
      limit: 20,
      recordType: recordType,
    }
    console.log("show button is clicked", params);
    props.getCallRecord(params);
  }

  const OnlyToCheckHandler = (e) => {
    console.log("checkbox changed", e.target);
    setIsOnlyTo(!isOnlyTo);
  }

  const onlyFromCheckHandler = (e) => {
    console.log("checkbox changed", e.target);
    setIsOnlyFrom(!isOnlyFrom);
  }
  const onlyFromChangeHandler = (e) => {
    console.log("selector handle----", e)
    setOnlyFrom(e);
  }
  const groupCheckHandler = (e) => {
    console.log("checkbox changed", e.target);
    setIsOnlyGroup(!isOnlyGroup);
  }
  const groupChangeHandler = (e) => {
    console.log("selector handle----", e);
    setOnlyGroup(e);
  }

  const onlyToChangeHandler = (e) => {
    console.log("selector handle----", e)
    setOnlyTo(e);
  }
  useEffect(() => {
    let contact = contactList.map((users) => ({ label: users.contactName, value: users.subscriber_type == "GROUP" ? users.mcptt_id : users.mcptt_uri, contactType: users.subscriber_type == "GROUP" ? "GROUP" : "USER" }))
    let user = contact.filter((users) => users.contactType == "USER");
    let group = contact.filter((groups) => groups.contactType == "GROUP");
    setGroupsOption(group);
    setUsersOption(user);
  }, [contactList])

  useEffect(() => {
    if (!isOnlyFrom) {
      setOnlyFrom([]);
    }
  }, [isOnlyFrom])

  useEffect(() => {
    if (!isOnlyTo) {
      setOnlyTo([]);
    }
  }, [isOnlyTo])

  useEffect(() => {
    if (!isOnlyGroup) {
      setOnlyGroup([]);
    }
  }, [isOnlyGroup])

  return (
    <Grid container direction="row"
      justifyContent="center"
      alignItems="center" spacing={1}>

      <Grid item xs={12}>
        <div class="title">
          <div class="pb-6 pr-6 f-18 f-reg white">
            Record Type
          </div>
        </div>
      </Grid>
      <Grid item xs={12} >
        <RadioGroup
          aria-label="RecordType"
          name="controlled-radio-buttons-group"
          value={recordType}
          onChange={handleRecordTypeChanged}
          className={classes.formGroupDirection}
        >
          <FormControlLabel value="Call" control={<Radio className={classes.radioColor} />} label="Call" />
          <FormControlLabel value="SDS" control={<Radio className={classes.radioColor} />} label="SDS" />
          <FormControlLabel value="Registration" control={<Radio className={classes.radioColor} />} label="Register" />
        </RadioGroup>
      </Grid>

      {recordType == "Call" ?
        (<Grid container><Grid item xs={12}>
          <div class="title">
            <div class="pb-6 pr-6 f-18 f-reg white">
              Call Type
            </div>
          </div>
        </Grid>
          <Grid item xs={12} >
            <RadioGroup
              aria-label="CallType"
              name="controlled-radio-buttons-group"
              value={callType}
              onChange={handleCallTypeChanged}
              className={classes.formGroupDirection}
            >
              <FormControlLabel value="private" control={<Radio className={classes.radioColor} />} label="Individual Call" />
              <FormControlLabel value="prearranged" control={<Radio className={classes.radioColor} />} label="Group Call" />
            </RadioGroup>
          </Grid> </Grid>) :
        recordType == "SDS" ?
          (<Grid container><Grid item xs={12}>
            <div class="title">
              <div class="pb-6 pr-6 f-18 f-reg white">
                SDS
              </div>
            </div>
          </Grid>
            <Grid item xs={12} >
              <RadioGroup
                aria-label="SDS"
                name="controlled-radio-buttons-group"
                value={callType}
                onChange={handleCallTypeChanged}
                className={classes.formGroupDirection}
              >
                <FormControlLabel value="TEXT_MESSAGE" control={<Radio className={classes.radioColor} />} label="Text Message" />
                <FormControlLabel value="STATUS" control={<Radio className={classes.radioColor} />} label="Status" />
              </RadioGroup>
            </Grid> </Grid>) : (<Grid container><Grid item xs={12}>
              <div class="title">
                <div class="pb-6 pr-6 f-18 f-reg white">
                  Register
                </div>
              </div>
            </Grid>
              <Grid item xs={12} >
                <RadioGroup
                  aria-label="SDS"
                  name="controlled-radio-buttons-group"
                  value={callType}
                  onChange={handleCallTypeChanged}
                  className={classes.formGroupDirection}
                >
                  <FormControlLabel value="Registered" control={<Radio className={classes.radioColor} />} label="Register" />
                  <FormControlLabel value="De-registered" control={<Radio className={classes.radioColor} />} label="Deregister" />
                </RadioGroup>
              </Grid> </Grid>)
      }
      <Grid item xs={3} classes={classes.dateLabel}>
        <Typography>Start</Typography>
      </Grid>
      <Grid item xs={9}>
        {/* <input type="date" className='date-picker' onChange={e => setstartDate(e.target.value)} /> */}
        <DateTimePicker calendarClassName="react-calendar" className="date-picker-style ml-25" onChange={setstartDate} value={startDate} />
      </Grid>
      {/* <Grid item xs={1}></Grid> */}
      <Grid item xs={3} classes={classes.dateLabel}>
        <Typography>End</Typography>
      </Grid>
      <Grid item xs={9}>
        {/* <input type="date" className='date-picker' onChange={e => setendDate(e.target.value)} /> */}
        <DateTimePicker calendarClassName="react-calendar" className=" date-picker-style ml-25" onChange={setendDate} value={endDate} />
      </Grid>
      {/* <Grid item xs={1}></Grid> */}
      {callType == "private" || callType == "TEXT_MESSAGE" || callType == "STATUS" || callType == "Registered" || callType == "De-registered" ?
        (
          <Grid container direction="row"
            justifyContent="center"
            alignItems="center" spacing={1}>
            <Grid item xs={12}>
              <FormControlLabel control={<Checkbox className={classes.checkBoxColor} checked={isOnlyFrom} onChange={onlyFromCheckHandler} />} label= {callType == "Registered" || callType == "De-registered" ?"User" :"Only From"} />
            </Grid>
            <Grid item xs={12}>
              <FormControl sx={{ minWidth: "95%" }}>
                <Select
                  styles={selectStyle}
                  isDisabled={!isOnlyFrom}
                  closeMenuOnSelect={false}
                  components={animatedComponents}
                  isMulti
                  value={onlyFrom}
                  options={usersOption}
                  onChange={onlyFromChangeHandler}
                  getOptionLabel={e => (
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      <span style={{ marginLeft: 5 }}>{e.label}</span>
                    </div>
                  )}
                />
              </FormControl>
            </Grid>
            {callType == "Registered" || callType == "De-registered" ?
             <></>: (<>
                <Grid item xs={12}>
                  <FormControlLabel control={<Checkbox className={classes.checkBoxColor} checked={isOnlyTo} onChange={OnlyToCheckHandler} />} label={"Only To"} />
                </Grid>
                <Grid item xs={12}>
                  <FormControl sx={{ minWidth: "95%" }}>
                    <Select
                      styles={selectStyle}
                      isDisabled={!isOnlyTo}
                      closeMenuOnSelect={false}
                      components={animatedComponents}
                      value={onlyTo}
                      isMulti
                      options={usersOption}
                      onChange={onlyToChangeHandler}
                      getOptionLabel={e => (
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                          <span style={{ marginLeft: 5 }}>{e.label}</span>
                        </div>
                      )}
                    />
                  </FormControl>
                </Grid>
              </>)}
          </Grid>)
        :
        <Grid container direction="row"
          justifyContent="center"
          alignItems="center" spacing={1}>
          <Grid item xs={12}>
            <FormControlLabel control={<Checkbox className={classes.checkBoxColor} checked={isOnlyGroup} onChange={groupCheckHandler} />} label={"Only Group"} />
          </Grid>
          <Grid item xs={12}>
            <FormControl sx={{ minWidth: "97%" }}>
              <Select
                styles={selectStyle}
                isDisabled={!isOnlyGroup}
                closeMenuOnSelect={false}
                components={animatedComponents}
                value={onlyGroup}
                isMulti
                options={groupsOption}
                onChange={groupChangeHandler}
                getOptionLabel={e => (
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <span style={{ marginLeft: 5 }}>{e.label}</span>
                  </div>
                )}
              />
            </FormControl>
          </Grid>
        </Grid>}
      <Grid item xs={8} />
      <Grid item className="pt-6 ml-20 mt-5" xs={3}>
        <Button style={{ backgroundColor: "#ffb01f", color: "black" }} variant="contained" color="error" onClick={handleShowButton}>Show</Button>
      </Grid>
    </Grid>
  )
}

const mapStateToProps = ({ communication, player }) => {
  const { contactList } = communication;
  const { callRecord } = player;
  return {
    contactList,
    callRecord
  };
};

const mapDispatchToProps = (dispatch) =>
  bindActionCreators(
    {
      getCallRecord
    },
    dispatch
  );

export default connect(mapStateToProps, mapDispatchToProps)(SearchOptions)