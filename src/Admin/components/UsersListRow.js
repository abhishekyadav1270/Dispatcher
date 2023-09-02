import React, { useState, useEffect } from "react";
import { Modal } from 'react-bootstrap'
import AddUser from './AdminWidget/Screens/AddUsers';
import { BasicInfoData } from '../basicinfodata';
import { resetFADetails, deleteUserAdmin, deleteOrgAdmin, deleteGroupAdmin, resetUserProfileWithAttachedFAS, deleteIwfMapAdmin,deleteFAAdmin,deleteAlert } from '../../modules/adminstate';
import { connect } from "react-redux";
import AddOrg from "./AdminWidget/AddOrg/AddOrg";
import AddGroup from "./AdminWidget/AddGroup/AddGroup";
import AlertDialog from '../components/DeleteUserDialog'
import AddIwfMap from "./AdminWidget/AddIwfMap/AddIwfMap";
import AddAlert from "./AdminWidget/Screens/AddAlert"
// import {deleteAlert} from '../../modules/actions'
const DOMParser = require('xmldom').DOMParser;


const UsersListRow = (props) => {
  const {deleteAlert, resetFADetails, deleteUserAdmin, deleteOrgAdmin, deleteGroupAdmin, resetUserProfileWithAttachedFAS, SubscribeType,deleteIwfMapAdmin , userlist,orglist,deleteFAAdmin,grouplist} = props;
  const isGroup = props.SubscribeType == "group" ? true : false;
  const [userOpen, setUserOpen] = useState(false);
  const [orgOpen, setOrgOpen] = useState(false);
  const [iwfOpen, setIwfOpen] = useState(false);
  const [alertOpen, setAlertOpen] = useState(false);
  const [grpOpen, SetgrpOpen] = useState(false);
  const [basicUserInfoData, setBasicUserInfoData] = useState(null)
  const [dialogOpen, setDialogOpen] = useState(false);
  const parser = new DOMParser();
  useEffect(() => {
    if (props.userData) {
      let basicInfo = BasicInfoData(props.userData)
      setBasicUserInfoData(basicInfo)
    }
  }, [])
  useEffect(() => {
    if (props.userData) {
      let basicInfo = BasicInfoData(props.userData)
      setBasicUserInfoData(basicInfo)
    }
  }, [props.userData])

  const editButtonClick = () => {
    if (SubscribeType === "single") {
      resetUserProfileWithAttachedFAS()
      setUserOpen(true)
    }
    else if (SubscribeType === "org") {
      setOrgOpen(true)
    }
    else if (SubscribeType === "iwf_map") {
      setIwfOpen(true)
    }
    else if (SubscribeType === "alerts") {
      setAlertOpen(true)
    }
    else {
      console.log("edit grp", props.userData)
      SetgrpOpen(true)
    }
  }
  const deleteButtonClick = () => {
    console.log('deleting group', SubscribeType,props.userData)

    if (SubscribeType === "single") {
      if (props.userData && props.userData.id) {
        console.log('deleted userId ', props.userData.id)
        setDialogOpen(true)

      }
    }
    else if (SubscribeType === "org") {
      if (props.userData) {
        setDialogOpen(true)
      }
    }
    else if (SubscribeType === "iwf_map") {
      if (props.userData) {
        setDialogOpen(true)
      }
    }
    else if (SubscribeType === "alerts") {
      if (props.userData) {
        setDialogOpen(true)
      }
    }
    else {
      if (props.userData) {
        setDialogOpen(true)
      }
    }

  }
  const deleteDailogHandler = (val) => {
    setDialogOpen(false)
    if (val) {
      if (SubscribeType === "single") {
         deleteUserAdmin({"id":basicUserInfoData.id,"mcptt_id":props.userData.mcptt_id})
         //deleteFAAdmin(props.userData.mcptt_id)
        console.log(basicUserInfoData.id)
      }
      else if (SubscribeType === "org") {
        deleteOrgAdmin(props.userData)

      }
      else if (SubscribeType === "iwf_map") {
        deleteIwfMapAdmin(props.userData)

      }
      else if (SubscribeType === "alerts") {
        deleteAlert(props.userData)

      }
      else {
        deleteGroupAdmin(props.userData.groupId)

      }
    }
  }

  const userhandleClose = () => {
    resetFADetails()
    resetUserProfileWithAttachedFAS()
    setUserOpen(false)
    SetgrpOpen(false)
    setOrgOpen(false)
    setIwfOpen(false)
    setAlertOpen(false)
  }
  const hideModal = () => {
    if (SubscribeType === "single") {
      resetFADetails()
      resetUserProfileWithAttachedFAS()
      setUserOpen(false)
    }
    else if (SubscribeType === "org") {
      setOrgOpen(false)
    }
    else if (SubscribeType === "iwf_map") {
      setIwfOpen(false)
    }
    else if (SubscribeType === "alerts") {
      setAlertOpen(false)
    }
    else {
      SetgrpOpen(false)
    }

  }

  const getUserType = () => {
    if (!isGroup) {
      if (props.userData) {
        if (props.userData.usertype === 'user') {
          return "REGULAR"
        }
        else if (props.userData.usertype === 'admin') {
          return "ADMIN"
        }
      }
    }
    return ""
  }

  //const userType = getUserType()

  if (props.SubscribeType === "single") {
    // Based on Single/ Group user data, load user rows
    let source = props.userData.source
    return (
      /* This div returns the jsx to create single user list row elements*/
      <div style={{ width: "100%", margin: "5px" }}>
        <div class="user-row-grid">
          <div class="tr-tb-icon">
            <img
              src='/assets/images/Vector-7.svg'
              class="single-user-img"
              alt=""
            />
          </div>
          <div class="tr-tb-uname">
            <span>{props.userData.userName} </span>
          </div>
          <div class="tr-tb-uid">
            <span>{props.userData.userRoles === null ? 'REGULAR' : props.userData.userRoles}</span>
          </div>
          <div class="tr-tb-mxid">
            <span>{props.userData.mcptt_id}</span>
          </div>
          <div class="tr-tb-edit">
            <button
              class="editBtn"
              onClick={editButtonClick}
              type="button"
              name=""
            >
              <img
                src="/assets/images/editimg.svg"
                class="edit-user-img"
                alt=""
              />
            </button>
          </div>
          <div class="tr-tb-delete">
            <button
              class="editBtn"
              onClick={deleteButtonClick}
              type="button"
              name=""
            >
              <img
                src="/assets/images/deleteimg.svg"
                class="delete-user-img"
                alt=""
              />
            </button>
          </div>
        </div>
        <Modal
          show={userOpen}
          onHide={userhandleClose}
          size={"lg"}
          aria-labelledby="contained-modal-title-vcenter"
          centered
          style={{ backgroundColor: ' rgba(0,0,0,0.5)' }}
        >
          <Modal.Header closeButton style={{ border: '0px', backgroundColor: '#282828' }}>
            <Modal.Title>UPDATE USER</Modal.Title>
          </Modal.Header>
          <Modal.Body style={{ padding: '0.2px' }}>
            <AddUser purpose="edit" tetraUser={props.tetraUser} basicInfoData={basicUserInfoData} hideModal={hideModal} grouplist={grouplist}></AddUser>
          </Modal.Body>
        </Modal>
        <AlertDialog open={dialogOpen} deleteDailogHandler={deleteDailogHandler} userName={props.userData.userName}/>

      </div>
    );
  }
  else if (props.SubscribeType === "org") {
    return (
      /* This div returns the jsx to create group user list row elements*/
      <div style={{ flexDirection: "row", display: "flex" }}>
        <div style={{ width: "100%", margin: "5px" }}>
          <div class="group-row-grid">
            <div class="tr-tb-icon">
              <img
                src='/assets/images/Vector-6.svg'
                class="group-user-img"
                alt=""
              />
            </div>
            <div class="tr-tb-gname">
              <span>{props.userData.orgName}</span>
            </div>
            <div class="tr-tb-gid">
              <span>{props.userData.orgId}</span>
            </div>
            <div class="tr-tb-members">
              <span>{props.userData.orgProfile}</span>
            </div>
            <div class="tr-tb-edit">
              <button
                class="editBtn"
                onClick={editButtonClick}
                type="button"
                name=""
              >
                <img
                  src="/assets/images/editimg.svg"
                  class="edit-user-img"
                  alt=""
                />
              </button>
            </div>
            <div class="tr-tb-delete">
              <button
                class="editBtn"
                onClick={deleteButtonClick}
                type="button"
                name=""
              >
                <img
                  src="/assets/images/deleteimg.svg"
                  class="delete-user-img"
                  alt=""
                />
              </button>
            </div>
          </div>
        </div>
        <Modal
          show={orgOpen}
          onHide={userhandleClose}
          size={"lg"}
          aria-labelledby="contained-modal-title-vcenter"
          centered
          style={{ backgroundColor: ' rgba(0,0,0,0.5)' }}
        >
          <Modal.Header closeButton style={{ border: '0px', backgroundColor: '#282828' }}>
            <Modal.Title>UPDATE ORG</Modal.Title>
          </Modal.Header>
          <Modal.Body style={{ padding: '0.2px' }}>
            <AddOrg purpose="edit" infoData={props.userData} hideModal={hideModal}></AddOrg>
          </Modal.Body>
        </Modal>
        <AlertDialog open={dialogOpen} deleteDailogHandler={deleteDailogHandler} userName={props.userData.orgName}/>

      </div>
    );
  }
  else if (props.SubscribeType === "iwf_map") {
    return (
      /* This div returns the jsx to create group user list row elements*/
      <div style={{ flexDirection: "row", display: "flex" }}>
        <div style={{ width: "100%", margin: "5px" }}>
          <div class="iwf-row-grid">
            <div class="tr-tb-icon">
              <img
                src='/assets/images/Vector-6.svg'
                class="group-user-img"
                alt=""
              />
            </div>
            <div class="tr-tb-gname">
              <span >{props.userData.id}</span>
            </div>
            <div class="tr-tb-uid">
              <span>{props.userData.type}</span>
            </div>
            <div class="tr-tb-mxid">
              <span >{props.userData.fa ? "FA" : props.userData.mcpttId ? "MCPTTID" : ""}</span>
            </div>
            <div class="tr-tb-gid">
              <span>{props.userData.fa ? props.userData.fa : props.userData.mcpttId ? props.userData.mcpttId : ""}</span>
            </div>
            {/* <div class="tr-tb-edit">
              <button
                class="editBtn"
                onClick={editButtonClick}
                type="button"
                name=""
              >
                <img
                  src="/assets/images/editimg.svg"
                  class="edit-user-img"
                  alt=""
                />
              </button>
            </div> */}
            <div class="tr-tb-delete">
              <button
                class="editBtn"
                onClick={deleteButtonClick}
                type="button"
                name=""
              >
                <img
                  src="/assets/images/deleteimg.svg"
                  class="delete-user-img"
                  alt=""
                />
              </button>
            </div>
          </div>
        </div>
        <Modal
          show={iwfOpen}
          onHide={userhandleClose}
          scrollable={false}
          size={"lg"}
          aria-labelledby="contained-modal-title-vcenter"
          centered
          style={{ backgroundColor: ' rgba(0,0,0,0.5)' }}
        >
          <Modal.Header closeButton style={{ border: '0px', backgroundColor: '#282828' }}>
            <Modal.Title>UPDATE IWF MAP</Modal.Title>
          </Modal.Header>
          <Modal.Body style={{ padding: '0.2px' }}>
            <AddIwfMap purpose="edit" infoData={props.userData} userlist = {userlist} hideModal={hideModal}></AddIwfMap>
          </Modal.Body>
        </Modal>
        <AlertDialog open={dialogOpen} deleteDailogHandler={deleteDailogHandler} userName={props.userData.id}/>

      </div>
    );
  }
  else if (props.SubscribeType === "alerts") {
    return (
      /* This div returns the jsx to create group user list row elements*/
      <div style={{ flexDirection: "row", display: "flex" }}>
        <div style={{ width: "100%", margin: "5px" }}>
          <div class="iwf-row-grid">
            <div class="tr-tb-icon">
              <img
                src='/assets/images/Vector-6.svg'
                class="group-user-img"
                alt=""
              />
            </div>
            <div class="tr-tb-gname">
              <span >{props.userData.code}</span>
            </div>
            <div class="tr-tb-uid">
              <span>{props.userData.desc}</span>
            </div>
            <div class="tr-tb-mxid">
              <span >{props.userData.priority}</span>
            </div>
            <div class="tr-tb-gid">
              <span>{props.userData.type}</span>
            </div>
            <div class="tr-tb-edit">
              <button
                class="editBtn"
                onClick={editButtonClick}
                type="button"
                name=""
              >
                <img
                  src="/assets/images/editimg.svg"
                  class="edit-user-img"
                  alt=""
                />
              </button>
            </div>
            <div class="tr-tb-delete">
              <button
                class="editBtn"
                onClick={deleteButtonClick}
                type="button"
                name=""
              >
                <img
                  src="/assets/images/deleteimg.svg"
                  class="delete-user-img"
                  alt=""
                />
              </button>
            </div>
          </div>
        </div>
        <Modal
          show={alertOpen}
          onHide={userhandleClose}
          scrollable={false}
          size={"lg"}
          aria-labelledby="contained-modal-title-vcenter"
          centered
          style={{ backgroundColor: ' rgba(0,0,0,0.5)' }}
        >
          <Modal.Header closeButton style={{ border: '0px', backgroundColor: '#282828' }}>
            <Modal.Title>UPDATE Alert</Modal.Title>
          </Modal.Header>
          <Modal.Body style={{ padding: '0.2px' }}>
          <AddAlert alert={props.userData} hideModal={hideModal}></AddAlert>
          </Modal.Body>
        </Modal>
        <AlertDialog open={dialogOpen} deleteDailogHandler={deleteDailogHandler} userName={props.userData.code}/>

      </div>
    );
  }
  else {
    console.log("update group data", props.userData.groupName)
    //var xml = parser.parseFromString(props.userData.groupDocument);
    let members = props.userData.membersType 
    let source = props.userData.source
    return (
      /* This div returns the jsx to create group user list row elements*/
      <div style={{ flexDirection: "row", display: "flex" }}>
        <div style={{ width: "100%", margin: "5px" }}>
          <div class="group-row-grid">
            <div class="tr-tb-icon">
              <img
                src='/assets/images/Vector-6.svg'
                class="group-user-img"
                alt=""
              />
            </div>
            <div class="tr-tb-gname">
              <span>{props.userData.groupName}</span>
            </div>
            <div class="tr-tb-gid">
              <span>{props.userData.groupId}</span>
            </div>
            <div class="tr-tb-members">
              <span>{members}</span>
            </div>
            <div class="tr-tb-edit">
              <button
                class="editBtn"
                onClick={source === 'MCX' ? editButtonClick : ()=>{}}
                type="button"
                name=""
              >
                <img
                  src="/assets/images/editimg.svg"
                  class="edit-user-img"
                  alt=""
                />
              </button>
            </div>
            <div class="tr-tb-delete">
              <button
                class="editBtn"
                onClick={source === 'MCX' ? deleteButtonClick : ()=>{}}
                type="button"
                name=""
              >
                <img
                  src="/assets/images/deleteimg.svg"
                  class="delete-user-img"
                  alt=""
                />
              </button>
            </div>
          </div>
        </div>
        <Modal
          show={grpOpen}
          onHide={userhandleClose}
          size={"lg"}
          aria-labelledby="contained-modal-title-vcenter"
          centered
          style={{ backgroundColor: ' rgba(0,0,0,0.5)' }}
        >
          <Modal.Header closeButton style={{ border: '0px', backgroundColor: '#282828' }}>
            <Modal.Title>UPDATE GROUP</Modal.Title>
          </Modal.Header>
          <Modal.Body style={{ padding: '0.2px' }}>
            <AddGroup purpose="edit" infoData={props.userData} userlist = {userlist} orglist = {orglist} hideModal={hideModal}></AddGroup>
          </Modal.Body>
        </Modal>
        <AlertDialog open={dialogOpen} deleteDailogHandler={deleteDailogHandler} userName={props.userData.groupName}/>

      </div>
    );
  }
}
export default connect(null, {
  resetFADetails,
  deleteUserAdmin,
  deleteOrgAdmin,
  deleteGroupAdmin,
  resetUserProfileWithAttachedFAS,
  deleteIwfMapAdmin,
  deleteFAAdmin,
  deleteAlert
})(UsersListRow);
