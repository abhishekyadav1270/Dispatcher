import React from "react";
import { Modal } from 'react-bootstrap'
import AddUser from './AdminWidget/Screens/AddUsers'
import AddGroup from "./AdminWidget/AddGroup/AddGroup";
import AddOrg from "./AdminWidget/AddOrg/AddOrg";
import AddIwfMap from "./AdminWidget/AddIwfMap/AddIwfMap";
// import { getAllAlerts,getAlertTypes } from "../../modules/actions";
import AddAlert from "./AdminWidget/Screens/AddAlert"
import { connect } from "react-redux";

const AddModal = React.memo( (props) => {
const {userlist,userhandleClose,hideModal,userOpen,grouplist,orglist,subscribeType} = props;  
  return (
    <Modal
      show={userOpen}
      onHide={userhandleClose}
      scrollable={false}
      size={"lg"}
      aria-labelledby="contained-modal-title-vcenter"
      centered
      style={{ backgroundColor: " rgba(0,0,0,0.5)" }}
    >
      <Modal.Header
        closeButton
        style={{ border: "0px", backgroundColor: "#282828" }}
      >
        {subscribeType === "single" ? (
          <Modal.Title>ADD USER</Modal.Title>
        ) : subscribeType === "alerts" ? (
          <Modal.Title>ADD Alert</Modal.Title>
        ) : subscribeType === "org" ? (
          <Modal.Title>ADD ORG</Modal.Title>
        ) : subscribeType === "iwf_map" ? (
          <Modal.Title>ADD IWF</Modal.Title>
        ) : (
          <Modal.Title>ADD GROUP</Modal.Title>
        )}
      </Modal.Header>
      <Modal.Body style={{ padding: "0.2px" }}>
         {subscribeType==="single" ?<AddUser grouplist={grouplist} hideModal={hideModal}></AddUser> :subscribeType==="org" ? <AddOrg hideModal={hideModal}/> :subscribeType==="iwf_map" ? <AddIwfMap  userlist = {userlist} hideModal={hideModal}/>: subscribeType==="alerts" ?<AddAlert  hideModal={hideModal}></AddAlert> : <AddGroup orglist={orglist} userlist={userlist} hideModal={hideModal}/>}
      </Modal.Body>
    </Modal>
  );
});

const mapStateToProps = ({ adminstate}) => {
    const { userlist,grouplist,orglist,iwfMaplist } = adminstate;
    const { allAlertList,allAlertListType } = adminstate
    //console.log('userlist reducer', userlist)
    return {
      userlist,grouplist,orglist,iwfMaplist,allAlertList,allAlertListType
    };
  };

export default connect(mapStateToProps, {})(AddModal);