import React, { Component, useState, useEffect } from "react";
import { connect } from "react-redux";
import TitleTab from "./TitleTab";
import TemplateRow from "./TemplateRow.js";
import { fetchFAListAdmin, resetFADetails } from '../../modules/adminstate';
import { Modal } from 'react-bootstrap'
import FATemplates from './fatemplates';

const Templates = (props) => {
  const { falist, fetchFAListAdmin, resetFADetails } = props
  const [faTemplates, setFaTemplates] = useState([])
  const [showFA, setShowFA] = useState(false);
  useEffect(() => {
    fetchFAListAdmin()
  }, [])

  useEffect(() => {
    if (falist) {
      setFaTemplates(falist)
    }
  }, [falist])

  const userhandleClose = () => {
    resetFADetails()
    setShowFA(false);
  };

  const filterData = (type) => {
    resetFADetails()
    setShowFA(true);
  }

  const hideModal = () => {
    resetFADetails()
    setShowFA(false);
    //fetchFAListAdmin()
  }
  
  return (
    <div>
      <TitleTab
        title={`FA LIST`}
        type={"template"}
        search={() => { }}
        filtr={(x) => {
          //console.log("TYPE", x);
          filterData(x)
        }}
      />
      <div class="tab-content" id="pills-tabContent">
        <div
          class="tab-pane fade show active"
          id="pills-home"
          role="tabpanel"
          aria-labelledby="pills-home-tab"
        >
          <div style={{ height: '900px', marginTop: '5px', overflowY: 'scroll' }}>
            {faTemplates &&
              faTemplates.map((data, i) => {
                return <TemplateRow faUser={data} tetraUser={props.tetraUser} />;
              })}
          </div>
        </div>
      </div>
      <Modal
        show={showFA}
        onHide={userhandleClose}
        scrollable={false}
        size={"lg"}
        aria-labelledby="contained-modal-title-vcenter"
        centered
        style={{ backgroundColor: ' rgba(0,0,0,0.5)' }}
      >
        <Modal.Header closeButton style={{ border: '0px', backgroundColor: '#282828' }}>
          <Modal.Title>ADD FA Profile</Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ padding: '5px' }}>
          <FATemplates hideModal={hideModal}/>
        </Modal.Body>
      </Modal>
    </div>
  );
};

const mapStateToProps = ({ adminstate }) => {
  const { falist } = adminstate;
  //console.log('userlist reducer', userlist)
  return {
    falist
  };
};

export default connect(mapStateToProps, {
  fetchFAListAdmin,
  resetFADetails
})(Templates);

