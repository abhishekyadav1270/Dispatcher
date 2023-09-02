import React, { useEffect, useState, Fragment } from "react";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Switch from "@material-ui/core/Switch";
import { makeStyles } from "@material-ui/styles";
import Autocomplete from "@material-ui/lab/Autocomplete";
import TextField from "@material-ui/core/TextField";

const CallForwardingConfig = (props) => {
  const {
    callForwardData,
    updateCallForwardingData,
    newOrUpdateProfile,
    userName,
    mcpttidAndUri,
    updateCallForwardTargetErr,
  } = props;
  const [callForwardingData, setCallForwardingData] = useState(callForwardData);

  useEffect(() => {
    console.log(
      "basicdetails update callForwardData useeffect..",
      callForwardData
    );
    setCallForwardingData(callForwardData);
  }, [callForwardData]);

  const allowCallForwardChangeHandler = (e) => {
    setCallForwardingData({
      ...callForwardingData,
      allowCallForwarding: e.target.checked,
    });
    updateCallForwardingData({
        ...callForwardingData,
        allowCallForwarding: e.target.checked,
    });
  };

  const allowCallForwardManualInputHandler = (e) => {
    setCallForwardingData({
      ...callForwardingData,
      allowCallForwardManualInput: e.target.checked,
    });
    updateCallForwardingData({
      ...callForwardingData,
      allowCallForwardManualInput: e.target.checked,
    });
    // let callForwardingObj = {
    //   ...basicdetails.callForwardingData,
    //   allowCallForwardManualInput: e.target.checked,
    // };
    // setbasicdetails({
    //   ...basicdetails,
    //   callForwardingData: { ...callForwardingObj },
    // });
    // setbasicdetails({
    //   ...basicdetails,
    //   allowCallForwardManualInput: e.target.checked,
    // });
  };

  const useStyle = makeStyles((theme) => ({
    root: {
      width: "100%",
      maxWidth: 360,
    },
    formControl: {
      width: "100%",
      marginTop: "5px",
    },
    mleft0: {
      marginLeft: "0px",
    },
    errorIndicator: {
      background: "#ffeded",
    },
    callForwardAllowContainier: {
      backgroundColor: "#f6f5f5",
      borderRadius: "8px",
      padding: "5px 10px",
    },
  }));
  const classes = useStyle();
  return (
    <fieldset className="form-group call-forwading-container">
      <legend>Call Forwarding</legend>
      <div>
        <FormControlLabel
          className={classes.mleft0}
          value="start"
          control={
            <Switch
              color="primary"
              checked={callForwardingData.allowCallForwarding}
              onChange={allowCallForwardChangeHandler}
            />
          }
          label="Allow Call Forwarding"
          labelPlacement="start"
          onChange={allowCallForwardChangeHandler}
          // disabled={purpose}
        />
      </div>
      {callForwardingData.allowCallForwarding === true ? (
        <div className={classes.callForwardAllowContainier}>
          <Autocomplete
            id="auto-highlight"
            autoHighlight
            style={{ marginBottom: 5 }}
            className={
              callForwardingData &&
              callForwardData.allowCallForwarding &&
              callForwardData.callForwardingTarget.length === 0
                ? classes.errorIndicator
                : null
            }
            options={
              mcpttidAndUri
                ? newOrUpdateProfile
                  ? mcpttidAndUri
                  : mcpttidAndUri.filter((e) => e.displayName !== userName)
                : []
            }
            value={
              callForwardingData.callForwardingTarget.length > 0
                ? // ?  callForwardingData.callForwardingTarget
                  mcpttidAndUri.find(
                    (data) =>
                      data.subscriberID ===
                      callForwardingData.callForwardingTarget
                  )
                : ""
            }
            getOptionLabel={(option) =>
              option.hasOwnProperty("displayName") ? option.displayName : ""
            }
            getOptionSelected={(option, value) => option.value === value.value}
            renderOption={(option) => (
              <Fragment>
                {option.hasOwnProperty("displayName") ? option.displayName : ""}
              </Fragment>
            )}
            renderInput={(params) => (
              <TextField
                {...params}
                label=" Call forwarding Target"
                variant="standard"
              />
            )}
            onChange={(e, v) => {
              if (v && v.hasOwnProperty("subscriberID") && v.subscriberID) {
                updateCallForwardTargetErr(false);
                setCallForwardingData({
                  ...callForwardingData,
                  callForwardingTarget: v.subscriberID,
                });
                updateCallForwardingData({
                  ...callForwardingData,
                  callForwardingTarget: v.subscriberID,
                });
              } else {
                updateCallForwardTargetErr(true);
                setCallForwardingData({
                  ...callForwardingData,
                  callForwardingTarget: "",
                });
                updateCallForwardingData({
                  ...callForwardingData,
                  callForwardingTarget: "",
                });
              }
            }}
          />
          {callForwardingData &&
          callForwardData.allowCallForwarding &&
          callForwardData.callForwardingTarget.length === 0 ? (
            <label class="error-handling-lbl" style={{ width: "auto" }}>
              Call forwarding target cannot be empty
            </label>
          ) : null}

          <div>
            <FormControlLabel
              className={classes.mleft0}
              value="start"
              control={
                <Switch
                  color="primary"
                  checked={callForwardingData.allowCallForwardManualInput}
                  onChange={allowCallForwardManualInputHandler}
                />
              }
              label="Allow Call Forwarding Manual Input"
              labelPlacement="start"
              onChange={allowCallForwardManualInputHandler}
            />
          </div>
        </div>
      ) : null}
    </fieldset>
  );
};

export default CallForwardingConfig;
