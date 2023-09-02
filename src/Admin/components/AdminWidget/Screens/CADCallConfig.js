import React, { useEffect, useState, Fragment } from "react";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Switch from "@material-ui/core/Switch";
import { makeStyles } from "@material-ui/styles";
import Autocomplete from "@material-ui/lab/Autocomplete";
import TextField from "@material-ui/core/TextField";

const CADCallConfig = (props) => {
  const {
    cadCall,
    updateUserCadCallData,
    faList,
    mcpttidAndUri,
    updateDefaultAuthorizerErr,
  } = props;
  const [cadCallData, setCadCallData] = useState(cadCall);

  useEffect(() => {
    console.log("basicdetails update CadCall useeffect..", cadCall);
    setCadCallData(cadCall);
  }, [cadCall]);

  const allowPrivateCallChangeHandler = (e) => {
    setCadCallData({
      ...cadCallData,
      allowPrivateCallParticipation: e.target.checked,
    });
    updateUserCadCallData({
      ...cadCallData,
      allowPrivateCallParticipation: e.target.checked,
    });
  };

  const incomingAuthorizationChangeHandler = (e) => {
    setCadCallData({
      ...cadCallData,
      incomingAuthorizationRequired: e.target.checked,
    });
    updateUserCadCallData({
      ...cadCallData,
      incomingAuthorizationRequired: e.target.checked,
    });

    if (e.target.checked && cadCallData.defaultAuthorizer.length===0) {
      updateDefaultAuthorizerErr(true);
    } else {
      updateDefaultAuthorizerErr(false);
    }
  };

  const allowPrivateCallToAnyUserChangeHandler = (e) => {
    setCadCallData({
      ...cadCallData,
      allowPrivateCallToAnyUser: e.target.checked,
    });
    updateUserCadCallData({
      ...cadCallData,
      allowPrivateCallToAnyUser: e.target.checked,
    });
  };

  const outgoingAuthorizationChangeHandler = (e) => {
    setCadCallData({
      ...cadCallData,
      outgoingAuthorizationRequired: e.target.checked,
    });
    updateUserCadCallData({
      ...cadCallData,
      outgoingAuthorizationRequired: e.target.checked,
    });

    if (e.target.checked && cadCallData.defaultAuthorizer.length===0) {
      updateDefaultAuthorizerErr(true);
    } else {
      updateDefaultAuthorizerErr(false);
    }
  };

  const getOptionsArray = (e) => {
    let defaultAuthorizerArr = [];
    if (faList) {
      faList.forEach((e) => defaultAuthorizerArr.push(e.CallerDescr));
    }
    if (mcpttidAndUri) {
      mcpttidAndUri.forEach((e) => defaultAuthorizerArr.push(e.displayName));
    }
    return defaultAuthorizerArr;
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
    incomingAuthContainier: {
      backgroundColor: "#f6f5f5",
      borderRadius: "8px",
      padding: "5px 10px",
    },
    errorIndicator:{
      background:"#ffeded"
    },
  }));
  const classes = useStyle();

  return (
    <>
      <div>
        <FormControlLabel
          className={classes.mleft0}
          value="start"
          control={
            <Switch
              color="primary"
              checked={cadCallData.allowPrivateCallParticipation}
              onChange={allowPrivateCallChangeHandler}
            />
          }
          label="Allow Private Call Participation"
          labelPlacement="start"
          onChange={allowPrivateCallChangeHandler}
        />
      </div>
      {cadCallData && cadCallData.allowPrivateCallParticipation ? (
        <div className={classes.incomingAuthContainier}>
          <FormControlLabel
            className={classes.mleft0}
            value="start"
            control={
              <Switch
                color="primary"
                checked={cadCallData.incomingAuthorizationRequired}
                onChange={incomingAuthorizationChangeHandler}
              />
            }
            label="Incoming Private call Authorization Required"
            labelPlacement="start"
            onChange={incomingAuthorizationChangeHandler}
          />
        </div>
      ) : null}
      <div>
        <FormControlLabel
          className={classes.mleft0}
          value="start"
          control={
            <Switch
              color="primary"
              checked={cadCallData.allowPrivateCallToAnyUser}
              onChange={allowPrivateCallToAnyUserChangeHandler}
            />
          }
          label="Allow private calls to any user"
          labelPlacement="start"
          onChange={allowPrivateCallToAnyUserChangeHandler}
        />
      </div>
      <div>
        <FormControlLabel
          className={classes.mleft0}
          value="start"
          control={
            <Switch
              color="primary"
              checked={cadCallData.outgoingAuthorizationRequired}
              onChange={outgoingAuthorizationChangeHandler}
            />
          }
          label="Outgoing private call Authorization required"
          labelPlacement="start"
          onChange={outgoingAuthorizationChangeHandler}
        />
      </div>
      <div>
        <Autocomplete
          id="auto-highlight"
          className={cadCallData.defaultAuthorizer.length===0 && ( cadCallData.outgoingAuthorizationRequired || cadCallData.incomingAuthorizationRequired)? classes.errorIndicator:null}
          autoHighlight
          style={{ marginBottom: 5 }}
          options={getOptionsArray()}
          value={cadCallData.defaultAuthorizer}
          getOptionLabel={(option) => option}
          renderOption={(option) => <Fragment>{option}</Fragment>}
          getOptionSelected={(option, value) => option.value === value.value}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Default Authorizer"
              variant="standard"
            />
          )}
          onChange={(e, v) => {
            if (v) {
              setCadCallData({
                ...cadCallData,
                defaultAuthorizer: v,
              });
              updateUserCadCallData({
                ...cadCallData,
                defaultAuthorizer: v,
              });
              updateDefaultAuthorizerErr(false);
            }
            else{
              setCadCallData({
                ...cadCallData,
                defaultAuthorizer: "",
              });
              updateUserCadCallData({
                ...cadCallData,
                defaultAuthorizer: "",
              });

              if( cadCallData.outgoingAuthorizationRequired || cadCallData.incomingAuthorizationRequired){
                updateDefaultAuthorizerErr(true);
              }

            }
          }}
        />

        {cadCallData.defaultAuthorizer.length===0 && ( cadCallData.outgoingAuthorizationRequired || cadCallData.incomingAuthorizationRequired) ? (
          <label class="error-handling-lbl" style={{ width: "auto" }}>
            default authorizer cannot be empty
          </label>
        ) : null}
      </div>
    </>
  );
};

export default CADCallConfig;
