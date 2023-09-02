import React, { Component, useState, useEffect, Fragment } from "react";
import { connect } from "react-redux";
import NativeSelect from "@material-ui/core/NativeSelect";
import { createTheme } from '@material-ui/core/styles';
import InputBase from "@material-ui/core/InputBase";
import Checkbox from "@material-ui/core/Checkbox";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';
import { makeStyles, withStyles } from "@material-ui/core/styles";
import MenuItem from '@material-ui/core/MenuItem';
import Autocomplete from "@material-ui/lab/Autocomplete";
import TextField from "@material-ui/core/TextField";
import {
  updateUserProfileWithAttachedFAS,
} from '../../../../modules/adminstate';

const Groups = (props) => {
  const { userProfileWithAttachedFA, updateUserProfileWithAttachedFAS, propGroupList } = props;
  const [groups, setgroup] = useState({
    Membership1: "",
    Membership2: "",
    EmergencyGroup: "",
  });
  const [groupList, setGroupList] = useState([])
  const [selectedDefaultGroup, SetselectedDefaultGroup] = useState("")

  const [grp1, setgrp1] = React.useState("");
  const [grp2, setgrp2] = React.useState("");
  const [grpToAdd, setGrpToAdd] = React.useState();
  const [grpToAddExists, setGrpToAddExists] = React.useState(false);
  const handleDefaultGroupChange = (e) => {
    //alert(e.target.value)
    let deafult = e.target.value ? e.target.value : ""
    SetselectedDefaultGroup(deafult)
  }

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
      fontFamily: 'Muli',
      marginBottom: 10
    },
    tetraSwitch: {
      fontFamily: 'Muli',
      marginTop: '2px',
      marginRight: '1px'
    }
  }));

  const theme = createTheme({
    palette: {
      primary: {
        main: '#006400',
      },
      secondary: {
        main: '#fdce2a',
      },
    },
  });
  const classes = useStyles();

  const membership1ChangeHandler = (e) => {
    setgroup({
      ...groups,
      Membership1: e.target.value,
    });
    setgrp1(e.target.value);
  };
  const membership2ChangeHandler = (e) => {
    setgroup({
      ...groups,
      Membership2: e.target.value,
    });
    setgrp2(e.target.value);
  };
  const addGroupChangeHandler = (value) => {
    let groupExist = groupList.filter((obj) => obj.name == value.groupId)
    if (groupExist.length == 0) {
      setGrpToAddExists(false)
      setGrpToAdd(value);
    }
    else {
      setGrpToAdd({});
      setGrpToAddExists(true)
    }
  };
  const OnAddGroup = () => {
    if (grpToAdd.groupId) {
      setGroupList([...groupList, { "name": grpToAdd.groupId, "CallerDescr": grpToAdd.groupName, "autoAffiliate": false }])
    }
  }
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

  const deleteButtonClick = (groupToDeleteFromList) => {
    let updatedGroupList = groupList.filter((groupObj) => {
      return groupToDeleteFromList.name !== groupObj.name
    })
    setGroupList(updatedGroupList)
  }
  const createUserProfile = (groupListNew) => {
    userProfileWithAttachedFA["implicitGroupList"] = []
    userProfileWithAttachedFA["groupList"] = []
    let searchDefaultInGroupList = false
    groupListNew.forEach((obj) => {
      if (obj.autoAffiliate) {
        userProfileWithAttachedFA["implicitGroupList"].push(obj)
      }
      else {
        userProfileWithAttachedFA["groupList"].push(obj)
      }

      if (obj.name === selectedDefaultGroup) {
        searchDefaultInGroupList = true
      }
    })
    if (searchDefaultInGroupList) {
      userProfileWithAttachedFA['defaultGroup'] = selectedDefaultGroup
    } else {
      userProfileWithAttachedFA['defaultGroup'] = ""
    }
  }
  const UpdateGroups = (e) => {
    e.preventDefault();
    console.log('created groups...', groups);
    createUserProfile(groupList);
    // if(userProfileWithAttachedFA.defaultgroup!==userProfileWithAttachedFA.defaultGroup){

    //   for(let i=0; i<userProfileWithAttachedFA.implicitGroupList.length ;i++){
    //     if(userProfileWithAttachedFA.defaultgroup=== userProfileWithAttachedFA.implicitGroupList[i].name){
    //       userProfileWithAttachedFA.implicitGroupList[i].autoAffiliate=false;
    //       userProfileWithAttachedFA.groupList.push(userProfileWithAttachedFA.implicitGroupList[i]);
    //       userProfileWithAttachedFA.implicitGroupList.splice(i,1);
    //       break;
    //     }
    //   }
    // }
    updateUserProfileWithAttachedFAS(userProfileWithAttachedFA)
    props.groupDataUpdateHandler();
  };

  useEffect(() => {
    let updatedGroups = []
    if (userProfileWithAttachedFA.groupList && userProfileWithAttachedFA.groupList.length > 0) {
      userProfileWithAttachedFA.groupList.forEach((element) => {
        element = { ...element, autoAffiliate: false }
        updatedGroups = [...updatedGroups, element]
      })
      setGroupList(updatedGroups)
    }
    if (userProfileWithAttachedFA.implicitGroupList && userProfileWithAttachedFA.implicitGroupList.length > 0) {
      userProfileWithAttachedFA.implicitGroupList.forEach((element) => {
        element = { ...element, autoAffiliate: true }
        updatedGroups = [...updatedGroups, element]
      })
      setGroupList(updatedGroups)
    }
    console.log("GROUP 3", userProfileWithAttachedFA['defaultgroup'])
    if (userProfileWithAttachedFA['defaultgroup']) {
      SetselectedDefaultGroup(userProfileWithAttachedFA['defaultgroup'])
    }
  }, [userProfileWithAttachedFA])

  const groupCheckChange = (checked, groupSelected) => {
    let groupListNew = groupList.map((groupObj) => {
      if (groupSelected.name == groupObj.name) {
        groupObj.autoAffiliate = checked;
        return groupObj
      }
      return groupObj
    })
    console.log(groupListNew)
    //createUserProfile(groupListNew)
    setGroupList(groupListNew)
  }

  return (
    <div>
      {/* <label class="tab1-heading">Add Group</label>
        <div>
                   <Autocomplete
                    autoSelect
                    style={{ marginBottom: 25, paddingLeft: 5 }}
                    options={propGroupList}
                    value={""}
                    renderOption={(option) => (
                      <Fragment>{option.groupId}</Fragment>
                    )}
                    getOptionLabel={(option) =>
                      (option && option.groupId) ? option.groupId : ""
                    }
                    renderInput={(params) => (
                      <TextField {...params} label="  Add group"/>
                    )}
                    onChange={(e, v) => {
                      
                      if(v)
                      addGroupChangeHandler(v);
                      else
                      setGrpToAddExists(false)
                    }}
                  >
                   
                  </Autocomplete>
                  {
                    grpToAddExists === true ?
                      (
                        <label class="error-handling-lbl">Group already in list</label>
                      )
                      :
                      null
                  }  
                <button
                  class="add-btn-fa"
                  type="button"
                  onClick={OnAddGroup}
                  >
                  Add Group
                </button>
        </div>
      
           */}

      <label class="tab1-heading">Groups</label>
      <div style={{ width: '100%' }}>
        <List style={{ width: '100%' }}>
          {groupList.map((group) => {
            return (
              <ListItem class="add-fa-list" key={group.name}>
                <ListItemText className={classes.listItemFA} primary={group.name} />
                <Checkbox
                  color='primary'
                  edge="start"
                  onChange={(event, checked) => groupCheckChange(checked, group)}
                  checked={group.autoAffiliate}
                />
                {/* <button
                              class="editBtn"
                              onClick={()=>deleteButtonClick(group)}
                              type="button"
                              name=""
                            >
                              <img
                                src="/assets/images/deleteimg.svg"
                                class="delete-user-img"
                                alt=""
                              />
                            </button> */}
              </ListItem>
            );
          })}
        </List>
      </div>

      <label class="tab1-heading"> Select Default Group</label>
      <div class="form-group">
        {/* <NativeSelect
          id="Group-native-select3"
          value={grp3}
          onChange={emergencyGrpChangeHandler}
          input={<BootstrapInput />}
        >
          {grp3TypeOptions.map((grpobj, index) => (
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
        </NativeSelect> */}
        <FormControl variant="filled" className={classes.formControl}>
          <InputLabel id="demo-simple-select-filled-label" className={classes.listItemFA}>Default Group</InputLabel>
          <Select
            className={classes.listItemFA}
            labelId="demo-simple-select-filled-label"
            id="demo-simple-select-filled"
            value={selectedDefaultGroup}
            onChange={handleDefaultGroupChange}
          >
            {groupList && groupList.map((group) => {
              return (
                <MenuItem value={group.name}>{group.name}</MenuItem>
              )
            })}
          </Select>
        </FormControl>
      </div>
      <br></br>
      <button class="update-btn-profile"
        type="button"
        onClick={UpdateGroups}
      >
        Update
      </button>
    </div>
  );
};

const mapStateToProps = ({ adminstate }) => {

  const { userProfileWithAttachedFA } = adminstate;
  //console.log('userlist reducer', userlist)
  return {
    userProfileWithAttachedFA
  };
}

export default connect(mapStateToProps, {
  updateUserProfileWithAttachedFAS
})(Groups);
//export default Groups;
