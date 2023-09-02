import React, { useState, useEffect } from 'react'
import { Title } from "../commom/Title";
import { Grid, Button} from '@material-ui/core';
import { Modal as ModalBootStrap } from "react-bootstrap";
import { getCallRecord } from "../../modules/actions/playerAction";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import CallRecordTable from './CallRecordTable';
import SdsTable from './SdsTable';
import ArchiveRecordings from './ArchiveRecordings';
import RegisterTable from './RegisterTable';

const RecordPage = (props) => {

    const [isArchiveModalOpen, setIsArchiveModalOpen] = useState(false);
    const {
        callRecordReqObj
    } = props;

    const handleShowArchiveButton = () => {
        setIsArchiveModalOpen(true);
    }

    const archiveModalhandleClose = () => {
        setIsArchiveModalOpen(false);
    };

    return (
        <React.Fragment>
            <Grid container direction="row">
                <Grid item xs={10}>
                    <Title title="Recordings" type="TD" />
                </Grid>
                <Grid item xs={2} style={{ display: "flex", justifyContent: "end" }} >
                    <Button style={{ backgroundColor: "#ffb01f", color: "black", width: "80%" }} variant="container" onClick={handleShowArchiveButton}>Show Archives</Button>
                </Grid>
            </Grid>
            {
                callRecordReqObj && callRecordReqObj.recordType=="Call"?(
                    <CallRecordTable/>
                ):callRecordReqObj && callRecordReqObj.recordType=="SDS"?(
                    <SdsTable/>
                ):callRecordReqObj && callRecordReqObj.recordType=="Registration"?(
                <RegisterTable/>):null
            }

            <ModalBootStrap
                show={isArchiveModalOpen}
                onHide={archiveModalhandleClose}
                scrollable={true}
                size={"lg"}
                aria-labelledby="contained-modal-title-vcenter"
                // dialogClassName="modal-65w"
                centered
                style={{ backgroundColor: " rgba(0,0,0,0.5)" }}
                className="special_modal"
            >
                <ModalBootStrap.Header
                    closeButton
                    style={{ border: "0px", backgroundColor: "#282828" }}
                >
                    <ModalBootStrap.Title>Archival Management</ModalBootStrap.Title>
                </ModalBootStrap.Header>
                <ModalBootStrap.Body
                    style={{
                        bgcolor: "background.paper",
                        minHeight: "45vh",
                        boxShadow: 1,
                        border: 2,
                        margin: "8px",
                        backgroundColor: "#121212",
                        borderRadius: "16px",
                        padding: "0px"
                    }}
                >
                    <ArchiveRecordings />
                </ModalBootStrap.Body>
            </ModalBootStrap>
        </React.Fragment>
    )
}


const mapStateToProps = ({ player }) => {
    const { callRecordReqObj } = player;
    return {
        callRecordReqObj
    };
};

const mapDispatchToProps = (dispatch) =>
    bindActionCreators(
        {
            getCallRecord
        },
        dispatch
    );

export default connect(mapStateToProps, mapDispatchToProps)(RecordPage)
