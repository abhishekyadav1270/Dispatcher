import React, { useState, useEffect } from 'react'
import { TextField, Button, Box, FormControl, FormLabel, FormControlLabel, RadioGroup, Radio, Checkbox } from '@material-ui/core'
import Typography from "@material-ui/core/Typography"
import { connect } from 'react-redux'
import { fetchUserListAdmin } from '../../modules/adminstate';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { Input, Modal } from "@material-ui/core";

import AddUserModal from './modals/addusermodal'
import {getAllAlerts,getAlertTypes} from '../../modules/adminstate'
import AlertModal from './modals/alertmodal';
const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 600,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
};


const LocationAlertComp = (props) => {
    const { allAlertList,getAllAlerts, setAlertForm, setAlertUserList, setAlertDetectionType, setAlertreceiverId, setSelectedAlertCode,contactList } = props;

    const [form, setForm] = useState("all")

    const [detectionType, setdetectionType] = useState("both")
    const [selectedReceiver, setselectedReceiver] = useState(null)
    const [isAddUserPopupOen, setisAddUserPopupOen] = useState(false)
    const [isAddAlertOpen, setisAddAlertOpen] = useState(false)
    const [selectedAlert,setSelectedAlert] =useState(null)


    const onAlertFormChange = (event) => {
        setForm(event.target.value)
        setAlertForm(event.target.value)
    }
    const onDetectionTypeChange = (event) => {
        setdetectionType(event.target.value)
        setAlertDetectionType(event.target.value)
    }
    const userSelectHanmdler = (e, v) => {
        console.log("SEL ", v)
        if (v) {
            setselectedReceiver(v)
            setAlertreceiverId(v.mcptt_id)

        }
    };
    const alertSelectHanmdler = (e, v) => {
        console.log("SELECTED ALERT", v)
        if (v) {
            setSelectedAlert(v)
            setSelectedAlertCode(v.code)

        }
    };
    const handleAddUserPopupClose = () => {
        setisAddUserPopupOen(false)
    }
    const handleAddAlertPopupClose = () => {
        setisAddAlertOpen(false)
    }

    const onAddUserClick = () => {
        setisAddUserPopupOen(true)

    }
    const onAddAlertClick = () => {
        setisAddAlertOpen(true)

    }
    const onUserSubmit = (users) => {
        setAlertUserList(users)
        setisAddUserPopupOen(false)
    }
    useEffect(() => {
        console.log("ALL ALERTS", allAlertList)

    }, [allAlertList])

    useEffect(() => {
        getAllAlerts()
    }, [])
    return (
        <div >
            <div style={{ display: 'flex', flexDirection: 'column', paddingRight: '30px' }}>
                {/* <div style={{ width:'300px',display: 'flex', flexDirection: 'row'}}> */}
                {/* <Autocomplete
                    sx={{ width: 300 }}
                    disablePortal
                    style={{ paddingLeft: 5, marginTop: 10 }}
                    options={allAlertList}
                    value={selectedAlert ? selectedAlert : ""}
                    getOptionLabel={(option) =>
                        (option && option.desc) ? option.desc  : ""
                    }
                    renderInput={(params) => (
                        <TextField {...params} label="Select an alert" />
                    )}
                    onChange={alertSelectHanmdler}
                />
                <Button onClick={onAddAlertClick} style={{ marginLeft: '10px' }}>Create New Alert</Button> */}
                {/* </div> */}
                <FormControl>
                    <FormLabel >Alert form</FormLabel>
                    <RadioGroup
                        row
                        aria-labelledby="demo-radio-buttons-group-label"
                        defaultValue="all"
                        value={form}
                        onChange={onAlertFormChange}
                        name="radio-buttons-group"
                    >
                        <FormControlLabel value="all" control={<Radio />} label="All Users" />
                        <FormControlLabel value="inclusive" control={<Radio />} label="Inclusive" />
                        <FormControlLabel value="exclusive" control={<Radio />} label="Exclusive" />
                    </RadioGroup>
                </FormControl>
                {form==="all"?null :
                <div style={{ justifyContent: "flex-end", justifySelf: "end" }}>
                <Button onClick={onAddUserClick} style={{ borderRadius: '8px', borderColor: "#273ec6", padding: '15px', borderWidth: 2, height: '50ps', width: '150px' }}>
                    {/* {users.si} */}
                    Add User
                    </Button>
            </div>

                }
                
                <FormControl>
                    <FormLabel >Detection type</FormLabel>
                    <RadioGroup
                        row
                        aria-labelledby="demo-radio-buttons-group-label"
                        defaultValue="both"
                        value={detectionType}
                        onChange={onDetectionTypeChange}
                        name="radio-buttons-group"
                    >
                        <FormControlLabel value="enter" control={<Radio />} label="Enter" />
                        <FormControlLabel value="exit" control={<Radio />} label="Exit" />
                        <FormControlLabel value="both" control={<Radio />} label="Both" />
                    </RadioGroup>
                </FormControl>
                <Autocomplete
                    sx={{ width: 300 }}
                    disablePortal
                    style={{ paddingLeft: 5, marginTop: 10 }}
                    options={contactList}
                    value={selectedReceiver ? selectedReceiver : ""}
                    getOptionLabel={(option) =>
                        (option && option.contactName) ? option.contactName + " - " + option.mcptt_id : ""
                    }
                    renderInput={(params) => (
                        <TextField {...params} label="Select Receiver" />
                    )}
                    onChange={userSelectHanmdler}
                />
            </div>
            <Modal
                open={isAddUserPopupOen}
                onClose={handleAddUserPopupClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <AddUserModal onUserSubmit={onUserSubmit} userlist={contactList} />
            </Modal>
            <Modal
                open={isAddAlertOpen}
                onClose={handleAddAlertPopupClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
             

                <AlertModal hideModal={handleAddAlertPopupClose} />

            </Modal>
        </div>
    )
}
const mapStateToProps = ({ communication, adminstate }) => {
    const { contactList } = communication;
    const { allAlertList } = adminstate

    console.log('contactList reducer', JSON.stringify(contactList))

    return {
        contactList,allAlertList
    };
};

export default connect(mapStateToProps, {
    getAllAlerts
})(LocationAlertComp);
