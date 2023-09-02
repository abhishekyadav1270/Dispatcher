import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { makeStyles } from "@material-ui/core/styles";
//import Modal from "@material-ui/core/Modal";
import { Modal } from 'react-bootstrap'
import AddUser from "./Screens/AddUsers";
import AddGroup from "./AddGroup/AddGroup";
import AddFunctionalAlias from "./AddFunctionalAlias/AddFuntionalAlias";

export const AdminWidget = (props) => {
  // getModalStyle is not a pure function, we roll the style only on the first render
  const [menuOptions, setMenuOptions] = useState([]);
  const [selected, setSelected] = useState();
  const [groupOpen, setGroupOpen] = React.useState(false);
  const [userOpen, setUserOpen] = React.useState(false);
  //const { open, closeModal } = props;
  // below code is to open and close Add User Modal
  const addUserOnClick = () => {
    setUserOpen(true);
  };

  const userhandleClose = () => {
    setUserOpen(false);
  };

  // below code is to open and close Add Group Modal

  const addGroupOnClick = () => {
    setGroupOpen(true);
  };

  const grouphandleClose = () => {
    setGroupOpen(false);
  };

  // below code is to open and close Functional Alias Modal

  const [funAliasOpen, setfunAliasOpen] = React.useState(false);

  const addFunAliasClick = () => {
    setfunAliasOpen(true);
  };

  const funAliashandleClose = () => {
    setfunAliasOpen(false);
  };

  // below is to handle on click event of Admin widget

  const clickHandler = (e) => {
    if (
      e.target.parentElement.className == "nav-link tbs adminwidgettbs 1 active"
    ) {
      addUserOnClick();
    } else if (
      e.target.parentElement.className == "nav-link tbs adminwidgettbs 2 active"
    ) {
      addGroupOnClick();
    } else if (
      e.target.parentElement.className == "nav-link tbs adminwidgettbs 7 active"
    ) {
      addFunAliasClick();
    }
  };

  useEffect(() => {
    if (props.tetraUser) {
      setMenuOptions([
        {
          text: "Add User",
          value: 1,
          eventName: "addUserOnClick",
          IconSrc: "/assets/images/single-user.jpg",
          id: "v-pills-add-user",
          aria: "v-pills-user",
          disable: false,
        },
        {
          text: "User Template",
          value: 4,
          eventName: "addTemplateOnClick",
          IconSrc: "/assets/images/svg-main/todo.svg",
          id: "v-pills-user-template",
          aria: "v-pills-user-template",
          disable: false,
        },
        // {text:'',value:7, IconSrc:"feather icon-hash f-22",id:"v-pills-settings-tab",aria:"v-pills-settings",disable:true },
      ]);
    } else {
      setMenuOptions([
        {
          text: "Add User",
          value: 1,
          eventName: "addUserOnClick",
          IconSrc: "/assets/images/single-user.jpg",
          id: "v-pills-add-user",
          aria: "v-pills-user",
          disable: false,
        },
        {
          text: "Add Group",
          value: 2,
          eventName: "addGroupOnClick",
          IconSrc: "/assets/images/group-user.jpg",
          id: "v-pills-add-group",
          aria: "v-pills-group",
          disable: false,
        },
        {
          text: "Add UE",
          value: 3,
          eventName: "addUeOnClick",
          IconSrc: "/assets/images/svg-main/dgna.svg",
          id: "v-pills-add-ue",
          aria: "v-pills-ue",
          disable: false,
        },
        {
          text: "User Template",
          value: 4,
          eventName: "addTemplateOnClick",
          IconSrc: "/assets/images/svg-main/todo.svg",
          id: "v-pills-user-template",
          aria: "v-pills-user-template",
          disable: false,
        },
        {
          text: "Group Template",
          value: 5,
          eventName: "addGrpTemplateOnClick",
          IconSrc: "/assets/images/svg-main/todo.svg",
          id: "v-pills-group-template",
          aria: "v-pills-group-template",
          disable: false,
        },
        {
          text: "UE Template",
          value: 6,
          eventName: "addUeTemplateOnClick",
          IconSrc: "/assets/images/svg-main/todo.svg",
          id: "v-pills-ue-template",
          aria: "v-pills-ue-template",
          disable: false,
        },
        {
          text: "Add functional Alias",
          value: 7,
          eventName: "addFunctionalAliasClick",
          IconSrc: "/assets/images/svg-main/todo.svg",
          id: "v-pills-functional-alias",
          aria: "v-pills-functional-alias",
          disable: false,
        },
        // {text:'',value:7, IconSrc:"feather icon-hash f-22",id:"v-pills-settings-tab",aria:"v-pills-settings",disable:true },
      ]);
    }
  }, []);

  return (
    <div>
      <div class="">
        <div class="">
          <center>
            <div
              className={
                props.tetraUser
                  ? "nav flex-column nav-pills Widget-grid-5"
                  : "nav flex-column nav-pills Widget-grid"
              }
              id="v-pills-tab"
              role="tablist"
              aria-orientation="vertical"
            >
              {menuOptions.map((tab, id) => {
                return (
                  <a
                    class={
                      "nav-link tbs adminwidgettbs " +
                      tab.value +
                      (tab.disable ? "opacity-30 disabled " : "") +
                      (tab.value === selected ? "active" : "")
                    }
                    style={tab.disable ? { paddingTop: "22px" } : {}}
                    id={tab.id}
                    data-toggle="pill"
                    // href={tab.aria}
                    role="tab"
                    aria-controls={tab.aria}
                    aria-selected={selected === tab.value}
                    value={tab.value}
                    onClick={clickHandler}
                    key={id}
                  >
                    {!tab.disable ? (
                      <React.Fragment>
                        <div class="icons-svg w-embed">
                          <img
                            class="icons-svg w-embed"
                            src={tab.IconSrc}
                            alt={tab.value}
                          />
                        </div>{" "}
                        {tab.text}
                      </React.Fragment>
                    ) : (
                      <i class="feather icon-hash f-22"></i>
                    )}
                  </a>
                );
              })}
            </div>
          </center>
        </div>
      </div>
      <Modal
        show={userOpen}
        onHide={userhandleClose}
        scrollable = {false}
        size={"lg"}
        aria-labelledby="contained-modal-title-vcenter"
        centered
        style={{ backgroundColor: ' rgba(0,0,0,0.5)' }}
      >
        <Modal.Header closeButton style={{ border: '0px', backgroundColor: '#282828' }}>
          <Modal.Title>ADD USER</Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ padding: '0.2px' }}>
          <AddUser tetraUser={props.tetraUser}></AddUser>
        </Modal.Body>
      </Modal>

      <Modal
        show={groupOpen}
        onHide={grouphandleClose}
        size={props.size ? props.size : "lg"}
        aria-labelledby="contained-modal-title-vcenter"
        centered
        style={{ backgroundColor: ' rgba(0,0,0,0.5)' }}
      >
        <Modal.Header closeButton style={{ border: '0px', backgroundColor: '#282828' }}>
          <Modal.Title>ADD GROUP</Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ padding: '0.2px' }}>
          <AddGroup></AddGroup>
        </Modal.Body>
      </Modal>
    </div>
  );
};

const mapStateToProps = (state) => ({});

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(AdminWidget);
