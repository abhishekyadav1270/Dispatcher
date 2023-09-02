import React, { Component, useState, useEffect } from "react";
import { makeStyles, withStyles } from "@material-ui/core/styles";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import "../../../Admin/styles/commonStyle.css"
import {Box} from '@material-ui/core'

const AddUserModal= (props)=>{
    const {onUserSubmit,userlist}=props
    const [emptyMemberSelection, setMemberSelection] = useState(false)
    
    const [newOrUpdateProfile, setNewOrUpdateProfile] = useState(true)
    const [selectedMembers, setSelectedMembers] = useState([])
    const [searchText, setSearchText] = React.useState("")
    const style = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 700,
        bgcolor: 'background.paper',
        border: '2px solid #000',
        boxShadow: 24,
        p: 4,
    };
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
        tetraSwitch: {
          fontFamily: 'Muli',
          marginTop: '2px',
          marginRight: '1px'
        },
    
      }));  
      const handleOnSelect = (item) => {
        let exist = false;
        for (const user of selectedMembers) {  
          if (user.mcptt_id === item.mcptt_id) {
            exist = true
            setMemberSelection(true)
            break            // exits the loop early
          }
        }
        if(!exist)  
        {
          const newData=[
            ...selectedMembers,
            item
          ]
         
         setSelectedMembers(newData)
         setMemberSelection(false)
        }
      }

      const deleteMember = (member) => {
        console.log(member)
        const newList = selectedMembers.filter((mem) => mem.mcptt_id !== member.mcptt_id)
        setSelectedMembers(newList)
    
      }

      const submitUsers=()=>{
          console.log("SELECTED MEM",selectedMembers)
          if(selectedMembers.length>0){
             let members=[] 
            selectedMembers.forEach((member)=>{
                members.push(member.mcptt_id)
            }) 
            onUserSubmit(members)

          }

      }
      const classes = useStyles();

      return(
        <Box sx={style}>

        <div>
                <div className="member-container" >
          <div  style={{marginRight:50}}>
            <input  className="textinput" style={{marginLeft:10, padding:10, borderRadius:5,borderColor:"#345234"}} type="text" placeholder="Search.."  onChange={event => { setSearchText(event.target.value) }}></input>
            <div style={{  height: 350, overflowY: 'scroll',marginTop:10 }}>
              <List className={classes.listMember_all}>
                {userlist.filter((member) => {
                  if(searchText===""){
                    return member
                  }
                  else if(member.contactName.toLowerCase().includes(searchText.toLowerCase())){
                    return member
                  }

              }).map((member) => {
                    return (
                      <ListItem onClick={()=>handleOnSelect(member)}  class="add-members-list" key={member.mcptt_id}>
                        <ListItemText className={classes.listItemFA} primary={member.contactName} />

                      </ListItem>
                    );
                  })}
              </List>
            </div>
          </div>
          <div >
           <label class="tab1-heading">Selected Members</label>
          <div style={{  height: 350, overflowY: 'scroll' }}>
            <List className={classes.listMember}>
              {selectedMembers.map((member) => {
             
                  return (
                    <ListItem class="add-members-list" key={member.mcptt_id}>
                      <ListItemText className={classes.listItemFA} primary={member.contactName} />
  
                      <button
                        class="editBtn"
                        style={{marginRight:30, paddingRight:10}}
                        onClick={() => deleteMember(member)}
                        type="button"
                        name=""
                      >
                        <img
                          src="/assets/images/deleteimg.svg"
                          class="delete-user-img-fa"
                          alt=""
                        />
                      </button>
                    </ListItem>
                  );
                }
             
              )}
            </List>
            {/* {
                emptyMemberSelection === true ?
                  (
                    <label class="error-handling-lbl">Please select member</label>
                  )
                  :
                  null
              } */}
          </div>
          </div>

      </div>
      <button
        class="update-btn-profile"
        type="button"
        onClick={submitUsers}
      >
        SUBMIT
        {/* {newOrUpdateProfile ? 'SUBMIT' : 'UPDATE'} */}
      </button>
       </div>
       </Box>
      )

}

export default AddUserModal;