import React, { useState, useEffect } from 'react'
import { TextField, Button, Box, FormControl, InputLabel, Select, MenuItem } from '@material-ui/core'
import Typography from "@material-ui/core/Typography"
import { Description } from '@material-ui/icons'
import { connect } from 'react-redux'
import { fetchUserListAdmin } from '../../modules/adminstate';
import Autocomplete from '@material-ui/lab/Autocomplete';

const DefaultUserObj = {
    userName: "",
    reportingInterval: "",
    userId: ""

}
const CreateUser = (props) => {
    const userData = props.userData
    
    const { userlist, fetchUserListAdmin,contactList } = props;
    const [selectedUser, setSelectedUser] = useState(null)
    const [currentUserInfo, setCurrentUserInfo] = useState(userData ? userData : DefaultUserObj)

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
    useEffect(() => {
        fetchUserListAdmin()
    }, [])

    const userSelectHanmdler = (e, v) => {
        console.log("SEL ", v)
        if(v){
        setSelectedUser(v)
        var userObj = {
            ...currentUserInfo,
            userName: v.contactName,
            userId: v.mcptt_id,
            userCreated: true
        }
        setCurrentUserInfo(userObj)
}
    };
    const onSubmitClicked = (e) => {
        console.log("CREATE USER REQ", currentUserInfo)

        props.createUser(currentUserInfo)
    }


    const reportIntervalHandler = (e) => {
        var userObj = {
            ...currentUserInfo,
            reportingInterval: parseInt(e.target.value, 10)
        }
        setCurrentUserInfo(userObj)
    };
    return (
        <Box sx={style}>
            {userData ? 
            (<Typography id="modal-modal-title" variant="h6" component="h2">
                Update User
            </Typography>) :
             (<Typography id="modal-modal-title" variant="h6" component="h2">
                Add User
            </Typography>)
            }

            <div>
                <div class="tab1-account">
                    <div style={{ display: 'flex', flexDirection: 'column', paddingRight: '30px' }}>
                    {userData ? (
                    <div style={{ display: 'flex', flexDirection: 'column',marginLeft: '10px',marginTop:"10px" }}>
                    <InputLabel style={{fontSize:"13px"}} id="demo-simple-select-label">User Name</InputLabel>
                        <label style={{marginTop:"5px"}}>{userData.userName}</label>

                    </div>)
                    :
                    (  <Autocomplete
                        sx={{ width: 300 }}
                        disablePortal
                        style={{  paddingLeft: 5, marginTop: 10 }}
                        options={contactList}
                        value={selectedUser ? selectedUser : ""}
                        getOptionLabel={(option) =>
                            (option && option.contactName) ? option.contactName +" - " + option.mcptt_id : ""
                        }
                        renderInput={(params) => (
                            <TextField {...params} label="Select User" />
                        )}
                        onChange={userSelectHanmdler}
                    />)

}
                      

                        <FormControl variant="standard" sx={{ m: 1, minWidth: 250 }} style={{ marginTop:"18px",width: '200px', marginLeft: '10px' }}>
                            <InputLabel id="demo-simple-select-label">Reporting Interval</InputLabel>

                            <Select
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                label="m"
                                value={currentUserInfo.reportingInterval}

                                onChange={reportIntervalHandler}
                            >
                                <MenuItem value="30000">30 seconds</MenuItem>
                                <MenuItem value="60000">1 minute</MenuItem>
                                <MenuItem value="120000">2 minute</MenuItem>
                                <MenuItem value="180000">3 minute</MenuItem>
                                <MenuItem value="240000">4 minute</MenuItem>
                                <MenuItem value="300000">5 minute</MenuItem>


                            </Select>
                        </FormControl>
                    </div>


                </div>
                {/* {
                    layerData ?
                        <button
                            class="update-btn-profile"
                            type="button"
                            onClick={onUpdateClicked}
                        >
                            UPDATE
                        </button>
                        : */}
                    {userData? (   <button
                    class="update-btn-profile"
                    type="button"
                    onClick={onSubmitClicked}
                >
                    UPDATE
                </button>):(   <button
                    class="update-btn-profile"
                    type="button"
                    onClick={onSubmitClicked}
                >
                    SUBMIT
                </button>)}    
             
                {/* } */}

            </div>
        </Box>)

}
const mapStateToProps = ({ adminstate,communication }) => {
    const { userlist } = adminstate;
    const { contactList } = communication;

    console.log('userlist reducer', userlist)
    console.log('contactList reducer', JSON.stringify(contactList))

    return {
        userlist,contactList
    };
};

export default connect(mapStateToProps, {
    fetchUserListAdmin
})(CreateUser);