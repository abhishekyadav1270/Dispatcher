import React, { useState } from "react";
import { connect } from "react-redux";
import { Modal, Button } from "react-bootstrap";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Switch from "@material-ui/core/Switch";
// import Autocomplete from "@material-ui/lab/Autocomplete";
import TextField from "@material-ui/core/TextField";
import Checkbox from "@material-ui/core/Checkbox";

// import {
//   updateUserProfileWithAttachedFAS,
//   fetchUserProfileWithAttachedFAS,
// } from "./../modules/adminstate";

import { setCallForward } from "./../modules/actions";
// import TextField from "@mui/material/TextField";
// import Autocomplete from "@mui/material/Autocomplete";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
  },
  subHeading: {
    color: "#7e7e7e",
    margin: "5px",
    fontSize: "15px",
  },
  callForwardBodyContainer: {
    display: "flex",
    flexDirection: "column",
    width: "100%",
    padding: "10px",
    // "& > input": {
    //   border: "none",
    //   borderBottom: "1px solid #d2cbcb",
    //   width: "75%",
    //   fontSize: "large",
    // },
  },
  callForwardBodySubContainer: {
    display: "flex",
    flexDirection: "column",
    gap: "20px",
    padding: "20px",
    border: "1px solid lightgray",
  },
  callForwardSwitch: {
    justifyContent: "start",
    marginLeft: "2px",
    paddingLeft: "10px",
  },
}));

// const callForwadCondOptions = [
//   "immediate",
//   "immediate:unreachable",
//   "unreachable",
//   "no-answer",
//   "no-answer:unreachable",
//   "busy",
//   "busy:unreachable",
//   "no-answer:busy:unreachable",
//   "no-answer:busy",
// ];

const CallForwarding = (props) => {
  const {
    open,
    closeModal,
    userProfile,
    userProfileWithAttachedFA,
    setCallForward,
  } = props;

  const initialCallForwardingObj = {
    allowCallForwarding:
      userProfile &&
      userProfile.hasOwnProperty("callForwardingData") &&
      userProfile.callForwardingData.hasOwnProperty("allowCallForwarding")
        ? userProfile.callForwardingData.allowCallForwarding
        : false,
    allowCallForwardManualInput:
      userProfile &&
      userProfile.hasOwnProperty("callForwardingData") &&
      userProfile.callForwardingData.hasOwnProperty(
        "allowCallForwardManualInput"
      )
        ? userProfile.callForwardingData.allowCallForwardManualInput
        : true,
    callForwardingTarget:
      userProfile &&
      userProfile.hasOwnProperty("callForwardingData") &&
      userProfile.callForwardingData.hasOwnProperty("callForwardingTarget")
        ? userProfile.callForwardingData.callForwardingTarget
        : "",
    callForwardingOn:
      userProfile &&
      userProfile.hasOwnProperty("callForwardingData") &&
      userProfile.callForwardingData.hasOwnProperty("callForwardingOn")
        ? userProfile.callForwardingData.callForwardingOn
        : false,
    callForwardingCondition:
      userProfile &&
      userProfile.hasOwnProperty("callForwardingData") &&
      userProfile.callForwardingData.hasOwnProperty("callForwardingCondition")
        ? userProfile.callForwardingData.callForwardingCondition.toLowerCase()
        : "",
    callForwardingNoAnswerTimeout:
      userProfile &&
      userProfile.hasOwnProperty("callForwardingData") &&
      userProfile.callForwardingData.hasOwnProperty(
        "callForwardingNoAnswerTimeout"
      )
        ? userProfile.callForwardingData.callForwardingNoAnswerTimeout
        : "",
    allowCallForwardManualInputTarget:
      userProfile &&
      userProfile.hasOwnProperty("callForwardingData") &&
      userProfile.callForwardingData.hasOwnProperty(
        "allowCallForwardManualInputTarget"
      )
        ? userProfile.callForwardingData.allowCallForwardManualInputTarget
        : "",
  };
  const classes = useStyles();

  const [enableSave, setEnable] = useState(false);
  // const [expanded, setExpanded] = useState(false);
  // const [cfcInputValue, setCFCInputValue] = useState("");
  const [callForwardingObj, setCallFordwardingObj] = useState(
    initialCallForwardingObj
  );
  const [emptyCallForwardNoAnsTO, setEmptyCallForwardNoAnsTO] = useState(false);

  const [alwaysForward, setAlwaysForward] = useState(
    callForwardingObj.callForwardingCondition.includes("immediate")
  );
  const [forwardWhenUnanswered, setForwardWhenUnanswered] = useState(
    callForwardingObj.callForwardingCondition.includes("no-answer")
  );
  const [forwardWhenBusy, setForwardWhenBusy] = useState(
    callForwardingObj.callForwardingCondition.includes("busy")
  );
  const [forwadWhenUnreachable, setForwadWhenUnreachable] = useState(
    callForwardingObj.callForwardingCondition.includes("unreachable")
  );

  const [condErrorMsg, setCondErrorMsg] = useState("");
  const [showErrorMsg, setShowErrorMsg] = useState(false);

  const conditionError = (condition) => {
    // let conditionString = callForwardingCondition;
    let returnError = "";

    switch (condition) {
      // "Immediate:Unreachable",
      // "Unreachable",
      // "No-Answer",
      // "No-Answer:Unreachable",
      // "Busy",
      // "Busy:Unreachable",
      // "No-Answer:Busy:Unreachable",
      // "No-Answer:Busy",
      case "Immediate":
        if (forwardWhenUnanswered) {
          returnError =
            "Cannot enable Immediate call forward when Unanswered is enabled";
        } else if (forwardWhenBusy) {
          returnError =
            "Cannot enable Immediate call forward when Busy is enabled";
        }
        break;
      case "Unreachable":
        break;

      case "No-Answer":
        if (alwaysForward) {
          returnError =
            "Cannot enable No-Answer call forward when Immediate call is enabled";
        }
        break;

      case "Busy":
        if (alwaysForward) {
          returnError =
            "Cannot enable Busy call forward when Immediate call is enabled";
        }
        break;

      default:
        return "";
    }
    // console.log("returnError......", returnError);
    return returnError;
  };

  const alwaysForwardChangeHandler = (e) => {
    let errorMsg = conditionError("Immediate");
    if (errorMsg.length > 0) {
      setCondErrorMsg(errorMsg);
      setShowErrorMsg(true);
      setEnable(false);
    } else {
      setShowErrorMsg(false);
      setEnable(true);
      setAlwaysForward(e.target.checked);
    }
  };

  const forwardWhenUnansweredChangeHandler = (e) => {
    let errorMsg = conditionError("No-Answer");
    if (errorMsg.length > 0) {
      setCondErrorMsg(errorMsg);
      setShowErrorMsg(true);
      setEnable(false);
    } else {
      setShowErrorMsg(false);
      setEnable(true);
      setForwardWhenUnanswered(e.target.checked);
      if (!e.target.checked) {
        callForwardingObj.callForwardingNoAnswerTimeout = "";
      }
    }
  };

  const forwardWhenUnreachableChangeHandler = (e) => {
    let errorMsg = conditionError("Unreachable");
    if (errorMsg.length > 0) {
      setCondErrorMsg(errorMsg);
      setShowErrorMsg(true);
      setEnable(false);
    } else {
      setShowErrorMsg(false);
      setEnable(true);
      setForwadWhenUnreachable(e.target.checked);
    }
  };

  const forwardWhenBusyChangeHandler = (e) => {
    let errorMsg = conditionError("Busy");
    if (errorMsg.length > 0) {
      setCondErrorMsg(errorMsg);
      setShowErrorMsg(true);
      setEnable(false);
    } else {
      setShowErrorMsg(false);
      setEnable(true);
      setForwardWhenBusy(e.target.checked);
    }
  };

  const callForwardingOnChangeHandler = (e) => {
    if (!e.target.checked) {
      // console.log("callForwardingOnChangeHandler",e.target.checked);
      setCallFordwardingObj({
        ...callForwardingObj,
        callForwardingOn: e.target.checked,
        callForwardingCondition: "",
        callForwardingNoAnswerTimeout: "",
        allowCallForwardManualInputTarget: "",
      });
      setAlwaysForward(false);
      setForwadWhenUnreachable(false);
      setForwardWhenUnanswered(false);
      setForwardWhenBusy(false);
    } else {
      setCallFordwardingObj({
        ...callForwardingObj,
        callForwardingOn: e.target.checked,
      });
    }
    setEnable(true);
  };

  const renderCallForwardingBody = () => {
    return (
      <div className={classes.callForwardBodyContainer}>
        <div>
          <FormControlLabel
            className={classes.callForwardSwitch}
            value="start"
            control={
              <Switch
                color="primary"
                checked={callForwardingObj.callForwardingOn}
                onChange={callForwardingOnChangeHandler}
              />
            }
            label="Call Forwarding On"
            labelPlacement="start"
            // onChange={callForwardingOnChangeHandler}
            // disabled={purpose}
          />
        </div>
        <div>
          {callForwardingObj.callForwardingOn ? (
            <div className={classes.callForwardBodySubContainer}>
              {/* <Autocomplete
                id="auto-highlight"
                autoHighlight
                options={callForwadCondOptions}
                value={
                  callForwardingObj.callForwardingCondition
                  // callForwardingObj.callForwardingCondition.length > 0
                  //   ? callForwardingObj.callForwardingCondition
                  //   : cfcInputValue
                }
                // inputValue={cfcInputValue}
                getOptionLabel={(option) => option}
                getOptionSelected={(option, value) => true}
                // onInputChange={(event, newInputValue) => {
                //   setCFCInputValue(newInputValue);
                //   setCallFordwardingObj({
                //     ...callForwardingObj,
                //     callForwardingCondition: "",
                //   });
                // }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label=" Call forwarding Conditions"
                    variant="standard"
                  />
                )}
                onChange={(e, v) => {
                  if (v) {
                    setCallFordwardingObj({
                      ...callForwardingObj,
                      callForwardingCondition: v,
                      callForwardingNoAnswerTimeout: "",
                    });
                    setEnable(true);
                  }
                }}
              /> */}

              <div className="call-forward-condition-grid">
                <FormControlLabel
                  className="immediate"
                  control={
                    <Checkbox
                      color="primary"
                      checked={alwaysForward}
                      onChange={alwaysForwardChangeHandler}
                    />
                  }
                  label="immediate"
                />
                <FormControlLabel
                  className="unreachable"
                  control={
                    <Checkbox
                      color="primary"
                      checked={forwadWhenUnreachable}
                      onChange={forwardWhenUnreachableChangeHandler}
                    />
                  }
                  label="unreachable"
                />
                <FormControlLabel
                  className="no-answer"
                  control={
                    <Checkbox
                      color="primary"
                      checked={forwardWhenUnanswered}
                      onChange={forwardWhenUnansweredChangeHandler}
                    />
                  }
                  label="no-answer"
                />
                <FormControlLabel
                  className="busy"
                  control={
                    <Checkbox
                      color="primary"
                      checked={forwardWhenBusy}
                      onChange={forwardWhenBusyChangeHandler}
                    />
                  }
                  label="busy"
                />
              </div>

              {forwardWhenUnanswered ? (
                <>
                  <TextField
                    id="outlined-number"
                    label="Call Forwarding No Answer Timeout (sec)"
                    type="number"
                    value={callForwardingObj.callForwardingNoAnswerTimeout}
                    // InputLabelProps={{
                    //   shrink: true,
                    // }}
                    inputProps={{ min: 1 }}
                    onChange={(e) => {
                      let val = parseInt(e.target.value);
                      if (val > 0) {
                        setCallFordwardingObj({
                          ...callForwardingObj,
                          callForwardingNoAnswerTimeout: e.target.value,
                        });
                      } else {
                        setCallFordwardingObj({
                          ...callForwardingObj,
                          callForwardingNoAnswerTimeout: "",
                        });
                      }

                      setEnable(true);
                      setEmptyCallForwardNoAnsTO(false);
                    }}
                  />
                  {emptyCallForwardNoAnsTO === true ? (
                    <label class="error-handling-lbl" style={{ width: "auto" }}>
                      Call forwarding No Answer Timeout cannt be empty
                    </label>
                  ) : null}
                </>
              ) : null}

              {callForwardingObj.allowCallForwardManualInput ? (
                <TextField
                  style={{ width: "100%" }}
                  id="outlined-basic"
                  label="Add Call Forward Manual Input Target"
                  value={callForwardingObj.allowCallForwardManualInputTarget}
                  onChange={(e) => {
                    setCallFordwardingObj({
                      ...callForwardingObj,
                      allowCallForwardManualInputTarget: e.target.value,
                    });
                    setEnable(true);
                  }}
                />
              ) : null}
            </div>
          ) : null}
        </div>
        <div>
          {showErrorMsg ? (
            <span style={{ color: "red", fontSize: "small" }}>
              {condErrorMsg}{" "}
            </span>
          ) : null}
        </div>
      </div>
    );
  };

  const saveSettings = () => {
    if (
      // callForwardingObj.callForwardingCondition.length > 0 &&
      // callForwardingObj.callForwardingCondition.split(":")[0] === "no-answer" &&
      // callForwardingObj.callForwardingNoAnswerTimeout.length === 0
      callForwardingObj.callForwardingOn &&  forwardWhenUnanswered &&
      callForwardingObj.callForwardingNoAnswerTimeout.length === 0
    ) {
      setEmptyCallForwardNoAnsTO(true);
      setEnable(false);
      return;
    }

    let conditionString = "";
    if (alwaysForward) {
      conditionString = `${conditionString}:immediate`;
    }
    if (forwadWhenUnreachable) {
      conditionString = `${conditionString}:unreachable`;
    }
    if (forwardWhenBusy) {
      conditionString = `${conditionString}:busy`;
    }
    if (forwardWhenUnanswered) {
      conditionString = `${conditionString}:no-answer`;
    }
    if (conditionString.length > 0) {
      callForwardingObj.callForwardingCondition = conditionString.substring(1);
    }
    setCallForward(callForwardingObj);
    // let userProfile = { ...userProfileWithAttachedFA };
    // userProfile.callForwardingData = {
    //   ...callForwardingObj,

    //   // callForwardingCondition:
    //   //   callForwardingObj.callForwardingCondition.length > 0
    //   //     ? callForwardingObj.callForwardingCondition
    //   //     : cfcInputValue,
    // };
    // console.log("Callforwarding ---->", userProfile);
    props.closeModal(false);
  };
  return (
    <Modal
      show={open}
      onHide={() => closeModal(false)}
      size={props.size ? props.size : "md"}
      aria-labelledby="contained-modal-title-vcenter"
      centered
      style={{ backgroundColor: " rgba(0,0,0,0.5)" }}
    >
      <Modal.Header
        closeButton
        style={{ border: "0px", backgroundColor: "#282828" }}
      >
        <Modal.Title>Call Forwarding</Modal.Title>
      </Modal.Header>
      <Modal.Body style={{ padding: "5px" }} scrollable={false}>
        {renderCallForwardingBody()}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="success" disabled={!enableSave} onClick={saveSettings}>
          Save & Close
        </Button>
        <Button variant="light" onClick={() => props.closeModal(false)}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

// export default CallForwarding;
const mapStateToProps = ({ auth, adminstate }) => {
  const { userProfile } = auth;
  const { userProfileWithAttachedFA } = adminstate;
  return {
    userProfile,
    userProfileWithAttachedFA,
  };
};

export default connect(mapStateToProps, {
  setCallForward,
})(CallForwarding);
