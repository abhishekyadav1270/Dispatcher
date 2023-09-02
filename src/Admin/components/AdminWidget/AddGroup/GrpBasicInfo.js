import React, { Component, useState, useEffect, Fragment } from "react";
import Autocomplete from '@material-ui/lab/Autocomplete';
import TextField from '@material-ui/core/TextField';
import { FormControl, InputLabel, MenuItem, Select } from "@material-ui/core";
import { makeStyles } from "@material-ui/core";

const GrpBasicInfo = (props) => {
  const { basicInfohandler, grpBasicInfo, purpose, orglist, groupTypes } = props
  const [newOrUpdateProfile, setNewOrUpdateProfile] = useState(true)
  const [emptyGroupPriority, setGroupPriority] = useState(false)
  const [emptyGroupName, setEmptyGroupName] = useState(false)
  const [emptyGroupType, setEmptyGroupType] = useState(false)
  const [emptyOrgId, setEmptyOrgId] = useState(false)
  const [basicinfo, SetbasicInfo] = useState(grpBasicInfo)
  const [selectedGroupType, setSelectedGroupType] = useState("")

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
    listMember_all: {
      // width: 250,
      maxHeight: 200
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
  const handleOrgChange = (value) => {
    SetbasicInfo({
      ...basicinfo,
      orgId: value,
    });
    setEmptyOrgId(false)
    console.log("on Select Org", value)

  };
  useEffect(() => {
    console.log("GrpBasicInfo group data", grpBasicInfo, orglist)
    if (purpose === "edit") {
      SetbasicInfo(grpBasicInfo)
    }
  }, [])
  const UpdateBasicDetails = () => {
    if ((basicinfo.groupType.length === 0)) {
      setEmptyGroupType(true)

    }
    else if ((basicinfo.groupname.length === 0)) {
      setEmptyGroupName(true)

    }
    else if (basicinfo.priority.length === 0) {
      setGroupPriority(true)
    }
    else if (basicinfo.groupType === "ORG" && basicinfo.orgId.length === 0) {
      setEmptyOrgId(true)
    }
    else {
      basicInfohandler(basicinfo)
    }


  }
  const groupNameChangeHandler = (e) => {

    SetbasicInfo({
      ...basicinfo,
      groupname: e.target.value,
    });
    if (e.target.value.length !== 0) {
      setEmptyGroupName(false)
    } else {
      setEmptyGroupName(true)
    }
    console.log("update group name", basicinfo);

  };
  const priorityChangeHandler = (e) => {
    SetbasicInfo({
      ...basicinfo,
      priority: e.target.value,
    });
    if (e.target.value.length !== 0) {
      setGroupPriority(false)
    } else {
      setGroupPriority(true)
    }
    console.log("update priority", basicinfo);

  };
  const handleGroupTypeChange = (e) => {
    console.log("eeee", e.target.value)
    SetbasicInfo({
      ...basicinfo,
      groupType: e.target.value,
    });
    if (e.target.value.length !== 0) {
      setEmptyGroupType(false)
    } else {
      setEmptyGroupType(true)
    }
  }
  return (
    <div>
      <div class="tab1-account">
        <FormControl variant="filled" className={classes.formControl}>
          <InputLabel id="demo-simple-select-filled-label" className={classes.listItemFA}>GROUP TYPE</InputLabel>
          <Select
            className={classes.listItemFA}
            labelId="demo-simple-select-filled-label"
            id="demo-simple-select-filled"
            value={basicinfo.groupType}
            onChange={handleGroupTypeChange}
          >
            {groupTypes && groupTypes.map((groupType) => {
              return (
                <MenuItem value={groupType.value}>{groupType.text}</MenuItem>
              )
            })}
          </Select>
        </FormControl>
        {
          emptyGroupType === true ?
            (
              <label class="error-handling-lbl">Please select the group type</label>
            )
            :
            null
        }
        <div class="form-group">
          <label class="attribute-heading" >Group Name</label>
          <input type="text" class="form-control" value={basicinfo.groupname} id="name" onChange={groupNameChangeHandler} />
          {
            emptyGroupName === true ?
              (
                <label class="error-handling-lbl">Please enter the group name</label>
              )
              :
              null
          }
        </div>
        <div class="form-group">
          <label for="priority">Priority</label>
          <input type="text" class="form-control" value={basicinfo.priority} id="priority" onChange={priorityChangeHandler} />
          {
            emptyGroupPriority === true ?
              (
                <label class="error-handling-lbl">Please enter the group priority </label>
              )
              :
              null
          }
        </div>
        {
          basicinfo.groupType === "ORG" ?
            <div class="form-group">
              <label class="tab2-heading">Add Org</label>

              <Autocomplete
                id="free-solo-demo"
                freeSolo
                options={orglist ? orglist : []}
                value={orglist ? orglist.find(v => v.orgId === basicinfo.orgId) || '' : ''}
                style={{ marginBottom: 25, paddingLeft: 5 }}
                renderOption={option => <Fragment>{option.hasOwnProperty('orgName') ? option.orgName : ''}</Fragment>}
                getOptionLabel={option => option.hasOwnProperty('orgName') ? option.orgName : ''}
                renderInput={(params) => <TextField  {...params} label="Search Org" />}
                onChange={(e, v) => {

                  if (v && v.hasOwnProperty('orgId') && v.orgId) {
                    handleOrgChange(v.orgId)
                  }
                  else {
                    SetbasicInfo({
                      ...basicinfo,
                      orgId: "",
                    });
                    setEmptyOrgId(true)
                  }
                }
                }
              />
            </div> : null
        }
        {
          emptyOrgId === true && basicinfo.groupType === "ORG" ?
            (
              <label class="error-handling-lbl">Please select the organisation</label>
            )
            :
            null
        }

      </div>

      <button
        class="update-btn-profile"
        type="button"
        onClick={UpdateBasicDetails}
      >NEXT
        {/* {newOrUpdateProfile ? 'SUBMIT' : 'UPDATE'} */}
      </button>
    </div>
  );
};
export default GrpBasicInfo;
