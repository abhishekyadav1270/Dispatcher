import React, { Component, useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import "../../../styles/commonStyle.css"
// import { ReactSearchAutocomplete } from 'react-search-autocomplete'


const GrpMembers = (props) => {
  const { membersHandler, purpose, grpMembers, userlist } = props
  const [emptyMemberSelection, setMemberSelection] = useState(false)

  const [newOrUpdateProfile, setNewOrUpdateProfile] = useState(true)
  const [selectedMembers, setSelectedMembers] = useState(grpMembers.members)
  const [searchText, setSearchText] = useState("")
  const [allMembers, setAllMembers] = useState([])

  useEffect(() => {
    let allGrpM = userlist.filter(user => (user.tetraUser == false && user.mcptt_id !== 'admin-consort')) 
    console.log('grp members admin', allGrpM)
    setAllMembers(allGrpM)
    if (purpose === "edit") {
      setSelectedMembers(grpMembers.members)
    }
  }, [])

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

  const submitMembers = () => {
    if (selectedMembers.length === 0) {
      setMemberSelection(true)
      membersHandler(selectedMembers)
    }
    else {
      membersHandler(selectedMembers)
    }
  }

  const [grp1, setgrp1] = React.useState("");
  const handleChangegrp1 = (event) => {
    setgrp1(event.target.value);
  };
  const [grp2, setgrp2] = React.useState("");
  const handleChangegrp2 = (event) => {
    setgrp2(event.target.value);
  };

  const _Change = (event, value) => {
    //update the value here
  }

  const deleteMember = (member) => {
    console.log(member)
    const newList = selectedMembers.filter((mem) => mem.mcptt_id !== member.mcptt_id)
    setSelectedMembers(newList)

  }
  const classes = useStyles();
  const handleOnSearch = (string, results) => {
    // onSearch will have as the first callback parameter
    // the string searched and for the second the results.
    console.log(string, results)
  }

  const handleOnHover = (result) => {
    // the item hovered
    console.log(result)
  }

  const handleOnSelect = (item) => {
    let exist = false;
    for (const user of selectedMembers) {
      if (user.mcptt_id === item.mcptt_id) {
        exist = true
        setMemberSelection(true)
        break            // exits the loop early
      }
    }
    if (!exist) {
      const newData = [
        ...selectedMembers,
        item
      ]
      setSelectedMembers(newData)
      setMemberSelection(false)
    }
  }

  const handleOnFocus = () => {
    console.log('Focused')
  }

  const formatResult = (item) => {
    return item;
    // return (<p dangerouslySetInnerHTML={{__html: '<strong>'+item+'</strong>'}}></p>); //To format result as html
  }
  return (
    <div>
      <div className="member-container" >
        <div style={{ marginRight: 50 }}>
          <input className="textinput" style={{ marginLeft: 10, padding: 10, borderRadius: 5, borderColor: "#345234" }} type="text" placeholder="Search.." onChange={event => { setSearchText(event.target.value) }}></input>
          <div style={{ height: 350, overflowY: 'scroll', marginTop: 10 }}>
            <List className={classes.listMember_all}>
              {allMembers.filter((member) => {
                if (searchText === "") {
                  return member
                }
                else if (member.userName.toLowerCase().includes(searchText.toLowerCase())) {
                  return member
                } 
              }).map((member) => {
                return (
                  <ListItem onClick={() => handleOnSelect(member)} class="add-members-list" key={member.mcptt_id}>
                    <ListItemText className={classes.listItemFA} primary={member.userName} />
                  </ListItem>
                );
              })}
            </List>
          </div>
        </div>
        <div >
          <label class="tab1-heading">Selected Members</label>
          <div style={{ height: 350, overflowY: 'scroll' }}>
            <List className={classes.listMember}>
              {selectedMembers.map((member) => {
                if (grpMembers.supervisorId != member.mcptt_id) {
                  return (
                    <ListItem class="add-members-list" key={member.mcptt_id}>
                      <ListItemText className={classes.listItemFA} primary={member.userName} />
                      <button
                        class="editBtn"
                        style={{ marginRight: 30, paddingRight: 10 }}
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
                else {
                  return (
                    <ListItem class="add-members-list" key={member.mcptt_id}>
                      <ListItemText className={classes.listItemFA} primary={member.userName} />
                    </ListItem>
                  );
                }
              })}
            </List>
            {
              emptyMemberSelection === true ?
                (
                  <label class="error-handling-lbl">Please select member</label>
                )
                :
                null
            }
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
        onClick={submitMembers}
      >
        NEXT
        {/* {newOrUpdateProfile ? 'SUBMIT' : 'UPDATE'} */}
      </button>
    </div>
  );
};
export default GrpMembers;


