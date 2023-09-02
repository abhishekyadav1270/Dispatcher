import React, { Component, useState, useEffect } from "react";
import NativeSelect from "@material-ui/core/NativeSelect";
import InputBase from "@material-ui/core/InputBase";
import { makeStyles, withStyles } from "@material-ui/core/styles";
import { Height } from "@material-ui/icons";
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import "../../../styles/commonStyle.css"
import { connect } from "react-redux";
// import { ReactSearchAutocomplete } from 'react-search-autocomplete'
import {
  getMembersForOrgGroup
} from "../../../../modules/adminstate";

const GrpSupervisor = (props) => {
  const {supervisorHandler,purpose,orgGroupList,grpBasicInfo,getMembersForOrgGroup,memebers,supervisorIDProps}=props
  

  const [selectedMembers, setSelectedMembers] = React.useState(orgGroupList)
  const [supervisorId, setSupervisorId] = React.useState('')
  
console.log("GroupSupervisor",memebers)
  useEffect(()=>{
    if (purpose==="edit" && grpBasicInfo.groupType === 'ORG') {
       getMembersForOrgGroup(grpBasicInfo.orgId)
    }else if(purpose==="edit" ){
      setSelectedMembers(memebers)
    }
    setSupervisorId(supervisorIDProps)
  },[])
  useEffect(()=>{
    if (purpose==="edit" && grpBasicInfo.groupType === 'ORG') {
      setSelectedMembers(orgGroupList)
    }
    
  },[orgGroupList])

  const useStyles = makeStyles((theme) => ({
    root: {
      width: '100%',
      maxWidth: 360,
      maxHeight: 100
    },
    listMember: {
      // width: 250,
      maxHeight: 200
    },
    listMember_all: {
      // width: 250,
      maxHeight: 200
    },
    listItemFA: {
      padding: '15px',
      fontFamily: 'Muli'
    },
    listItemFASelected: {
      padding: '15px',
      fontFamily: 'Muli',
      background : '#909090'
    },
    tetraSwitch: {
      fontFamily: 'Muli',
      marginTop: '2px',
      marginRight: '1px'
    },

  }));
  const submitSupervisor = () => {
    supervisorHandler(supervisorId)
   
  }

  const handleOnSelect = (member) => {
    setSupervisorId(member.userId ? member.userId : member.mcptt_id)
  }
  const classes = useStyles();


  return (
    <div>

        <div className="member-container" >
          
          <div >
           <label class="tab1-heading">Group Members</label>
          <div style={{  height: 350, overflowY: 'scroll' }}>
            <List className={classes.listMember}>
              {selectedMembers.map((member) => {
                let id= member.userId ? member.userId : member.mcptt_id
                return (
                  <ListItem onClick={()=>handleOnSelect(member)}  class="add-members-list" key={id}>
                    <ListItemText className={ id === supervisorId ? classes.listItemFASelected  :classes.listItemFA} primary={member.displayName ? member.displayName  : member.userName} />
                  </ListItem>
                );
              })}
            </List>
            
          </div>
          </div>

      </div>
      {/* <div >
        {members.map}
      </div>

      <br></br> */}
      <button
        class="update-btn-profile"
        type="button"
        onClick={submitSupervisor}
      >
        NEXT
        {/* {newOrUpdateProfile ? 'SUBMIT' : 'UPDATE'} */}
      </button>
    </div>
  );
};

const mapStateToProps = ({ adminstate }) => {
  const { orgGroupList } = adminstate;
  return {
    orgGroupList
  };
};
export default connect(mapStateToProps, {
  getMembersForOrgGroup
})(GrpSupervisor);


