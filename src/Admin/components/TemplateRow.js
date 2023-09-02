import React, { useState, useEffect } from "react";
import { } from "../../modules/actions";
import { Modal } from 'react-bootstrap'
import FATemplates from './fatemplates';
import { resetFADetails, deleteFAAdmin } from '../../modules/adminstate';
import { connect } from "react-redux";
import AlertDialog from './DeleteUserDialog'

const TemplateRow = (props) => {
  const { resetFADetails, deleteFAAdmin } = props;
  const [userOpen, setUserOpen] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);

  useEffect(() => {
  }, [])

  const hideModal = () => {
    setUserOpen(false);
    resetFADetails()
  }
  
  const userhandleClose = () => {
    setUserOpen(false)
    resetFADetails()
  }
  const editButtonClick = () => {
    setUserOpen(true)
  }
  const deleteButtonClick = () => {
    if (props.faUser.name && props.faUser.CallerDescr) {
      setDialogOpen(true)
    }
  }
  const deleteDailogHandler = (val) => {
    setDialogOpen(false)
    if (val) {
      deleteFAAdmin(props.faUser.name)
    }
  }

  return (
    /* This div returns the jsx to create single user list row elements*/
    <div style={{ width: "100%", margin: "5px" }}>
      <div class="template-row-grid">
        <div class="tr-tb-icon">
          <img
            src="/assets/images/Vector-7.svg"
            class="single-user-img"
            alt=""
          />
        </div>
        <div class="tr-tb-tname">
          <span>{props.faUser && props.faUser.CallerDescr} </span>
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
          <Modal.Title>UPDATE FA Profile</Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ padding: '0.2px' }}>
          <FATemplates hideModal={hideModal} faName={props.faUser.name} propsTetra={props.faUser.tetra}/>
        </Modal.Body>
      </Modal>
      <AlertDialog open={dialogOpen} deleteDailogHandler={deleteDailogHandler} userName={props.faUser.CallerDescr}/>
    </div>
  );
}

export default connect(null, {
  resetFADetails,
  deleteFAAdmin
})(TemplateRow);

