import React, { useState, useEffect, Fragment } from "react";

import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
// import { iwf_type } from "../../constants/constants";
import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormLabel from "@material-ui/core/FormLabel";
import { makeStyles, ThemeProvider } from "@material-ui/styles";
import { fetchFAListAdmin,fetchIwfTypeAdmin } from "../../modules/adminstate";
import Autocomplete from "@material-ui/lab/Autocomplete";
import { connect } from "react-redux";
import TextField from "@material-ui/core/TextField";
const DefaultInfoData = {
  id: "",
  type: "",
  fa: "",
  mcpttId: "",
  fa_mcpttid : "FA",
  errors :{}
};

const CreateIwfMap = (props) => {
  const {
    iwfMapType,
    falist,
    userlist,
    fetchFAListAdmin,
    fetchIwfTypeAdmin,
    infoHandler,
    infoData,
  } = props;
  const [iwfInfo, SetIwfInfo] = useState(DefaultInfoData);
 

  useEffect(() => {
    fetchFAListAdmin();
    fetchIwfTypeAdmin();
    //fetchUserListAdmin();
    if (infoData && infoData.id !== "") {
      SetIwfInfo({...infoData,fa_mcpttid : infoData.fa ? "FA" : "MCPTTID",errors :{}});
      console.log("------------useEffect-------------", iwfInfo.fa_mcpttid);
      //setFaMCPTTID(infoData.fa !== "" ? "FA" : "MCPTTID");
    } else {
      console.log("------------useEffect-------------++++++++++++");
     // SetIwfInfo(iwfInfo);
    }
  }, []);


  useEffect(()=>{
    if(iwfMapType && iwfMapType.length >0 && !(infoData && infoData.id !== ""))
    {
      SetIwfInfo({...iwfInfo,type:iwfMapType[0].value})
    }

  },[iwfMapType])




  const UpdateBasicDetails = (e) => {
    console.log("update iwf ", iwfInfo);
      
      let errors ={}
      if(!iwfInfo.id)
      {
        e.preventDefault()
        errors["id"] = "Please enter iwf id"
        SetIwfInfo({
          ...iwfInfo,
          errors: errors,
        });
      }
      else if(iwfInfo.fa_mcpttid == "FA" && !iwfInfo.fa)
      {
        e.preventDefault()
        errors["fa"] = "Please select FA"
        SetIwfInfo({
          ...iwfInfo,
          errors: errors,
        });
      }
      else if(iwfInfo.fa_mcpttid == "MCPTTID" && !iwfInfo.mcpttId)
      {
        e.preventDefault()
        errors["mcpttid"] = "Please select MCPTTID"
        SetIwfInfo({
          ...iwfInfo,
          errors: errors,
        });
      }
      else
      {
        delete iwfInfo['fa_mcpttid'];
        delete iwfInfo['errors'];
        //console.log("DATA",iwfInfo)
        infoHandler(iwfInfo);
      }
  };
  const typeChangeHandler = (e) => {
    SetIwfInfo({
      ...iwfInfo,
      type: e.target.value,
      errors: {},
    });
    console.log("update iwf type name", iwfInfo);
  };
  const idChangeHandler = (e) => {
    console.log("===================idChangeHandler");
    SetIwfInfo({
      ...iwfInfo,
      id: e.target.value,
      errors: {},
    });
  };
  const faChangeHandler = (value) => {
    console.log("===================faChangeHandler" );
    SetIwfInfo({
      ...iwfInfo,
      fa: value,
      errors: {},
    });
  };

  const mcpttidChangeHandler = (e) => {
    console.log("===================mcpttidChangeHandler" );
    SetIwfInfo({
      ...iwfInfo,
      mcpttId: e,
    });
  };

  const faMcpttidChangeHandler = (e) => {
    console.log("On change------------", e.target.value, infoData);
    var fa =  e.target.value === "FA" ? iwfInfo.fa : ""
    var mcpttId =  e.target.value === "MCPTTID" ? iwfInfo.mcpttId : ""
    SetIwfInfo({
      ...iwfInfo,
      fa_mcpttid: e.target.value,
      fa : fa,
      mcpttId : mcpttId

    });
    //setFaMCPTTID(e.target.value);
  };
  const useStyles = makeStyles((theme) => ({
    root: {
      width: "100%",
      maxWidth: 360,
    },
    formControl: {
      width: "100%",
      marginTop: "5px",
    },
    formControlFA: {
      width: "80%",
      height: "60px",
      marginTop: "5px",
    },
    listMember_all: {
      // width: 250,
      maxHeight: 200,
    },
    listItemFA: {
      padding: "5px",
      fontFamily: "Muli",
    },
    tetraSwitch: {
      fontFamily: "Muli",
      marginTop: "2px",
      marginRight: "1px",
    },
  }));
  const classes = useStyles();

  return (
    <div>
      <div class="tab1-account">
        <div class="form-group">
          <label class="attribute-heading">SSI</label>
          <input
            type="text"
            disabled={infoData}
            class="form-control"
            value={iwfInfo.id}
            id="name"
            onChange={idChangeHandler}
          />
          <p class="error-handling-lbl">{iwfInfo.errors.hasOwnProperty("id") ? iwfInfo.errors["id"] : ""}</p>
        </div>
        <div class="form-group">
          <FormControl variant="filled" className={classes.formControl}>
            <InputLabel
              id="demo-simple-select-filled-label"
              className={classes.listItemFA}
            >
              Connection Mode
            </InputLabel>
            <Select
              className={classes.listItemFA}
              labelId="demo-simple-select-filled-label"
              id="demo-simple-select-filled"
              value={iwfInfo.type}
              onChange={typeChangeHandler}
            >
              {iwfMapType &&
                iwfMapType.map((usertype) => {
                  return (
                    <MenuItem value={usertype.value}>{usertype.text}</MenuItem>
                  );
                })}
            </Select>
          </FormControl>
        </div>

        <div>
          <FormControl component="fieldset">
            
            <RadioGroup
              row
              aria-label="fa_mcpttid"
              name="row-radio-buttons-group"
              defaultValue={iwfInfo.fa_mcpttid}
              value={iwfInfo.fa_mcpttid}
              onChange={(e) => faMcpttidChangeHandler(e)}
            >
              <FormControlLabel 
                value="FA" 
                control={<Radio />} 
                label="FA" />
              <FormControlLabel
                value="MCPTTID"
                control={<Radio />}
                label="MCPTTID"
              />
            </RadioGroup>
          </FormControl>
        </div>

        <div class="form-group">
          
          {iwfInfo.fa_mcpttid === "FA" ? (
            <Autocomplete
              id="autocomplete"
              
              autoSelect
              style={{ marginBottom: 25, paddingLeft: 5 }}
              options={falist ? falist : []}
              value={falist.find(v => v.CallerDescr === iwfInfo.fa) || ''}
              renderOption={(option) => (
                <Fragment>{(option && option.CallerDescr) ? option.CallerDescr : ""}</Fragment>
              )}
              getOptionLabel={(option) =>
                (option && option.CallerDescr) ? option.CallerDescr : ""
              }
              renderInput={(params) => (
                <TextField {...params} label="  Search FA"/>
              )}
              onChange={(e, v) => {
                console.log(
                  "faChangeHandler ----------------------------------",
                  v
                );
                if(v && v.hasOwnProperty("CallerDescr") && v.CallerDescr)
                faChangeHandler(v.CallerDescr);
              }}
            />
            
          ) : iwfInfo.fa_mcpttid === "MCPTTID" ? (
            <Autocomplete
              
              style={{ marginBottom: 25, paddingLeft: 5 }}
              options={userlist ? userlist : []}
              value={userlist.find(v => v.mcptt_id === iwfInfo.mcpttId) || ''}
              renderOption={(option) => <Fragment>{(option && option.mcptt_id) ? option.mcptt_id : ""}</Fragment>}
              getOptionLabel={(option) =>
                (option && option.mcptt_id) ? option.mcptt_id : ""
              }
              renderInput={(params) => (
                <TextField {...params} label="  Search MCPTTID" />
              )}
              onChange={(e, v) => {
                console.log(
                  "mcpttidChangeHandler ----------------------------------",
                  v
                );
                if (v && v.hasOwnProperty('mcptt_id') &&v.mcptt_id) mcpttidChangeHandler(v.mcptt_id);
              }}
            />
          ) : null}
          <p class="error-handling-lbl">{ iwfInfo.fa_mcpttid === "FA" ? iwfInfo.errors["fa"] : iwfInfo.errors["mcpttid"]}</p>
        </div>
      </div>
     <div>
     <button
        class="add-btn-iwf-map"
        type="button"
        onClick={UpdateBasicDetails}
      >
       {infoData ? 'UPDATE' : 'SUBMIT' }
      </button>
     </div>
    </div>
  );
};
const mapStateToProps = ({ adminstate }) => {
  const { iwfMapType,falist } = adminstate;
  return {
    iwfMapType,
    falist,
  };
};

export default connect(mapStateToProps, {
  fetchFAListAdmin,
  fetchIwfTypeAdmin,
})(CreateIwfMap);
