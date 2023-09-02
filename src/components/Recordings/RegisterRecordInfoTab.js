import React, { useRef, useState } from 'react'

import { Grid, makeStyles, Typography } from '@material-ui/core';
import { Box } from '@mui/material'
import './player.css'
import { showTime, changeBoolValue, showDuration } from './definedFunction';
const useStyles = makeStyles({
    checkBoxColor: {
        '&.MuiCheckbox-root': {
            color: "#ffb01f",
        }
    }
});

const RegisterRecordInfoTab = (props) => {
    const { data } = props;
    console.log("---Callrecordinfo data---", data)
    const classes = useStyles();
    const showUser = () => {
        if (data) {
            if (data.callerDisplayName)
                return data.callerDisplayName;
        }
        return "";
    }
    const showUA = () => {
        if (data) {
            if (data.callerUA)
                return data.callerUA;
        }
        return "";
    }
    const showUserType = () => {
        if (data) {
            if (data.callerUserType)
                return data.callerUserType;
        }
        return "";
    }

    return (
        <div >
            {data ? (
                <div>
                    <Box
                        sx={{
                            // boxShadow: '0 3px 10px rgb(0 0 0 / 20%)',
                            borderRadius: '12px',
                            padding: '16px',
                            overflowWrap: "break-word",
                            paddingLeft: '2%',
                            backgroundColor: 'rgba(255,255,255,0.07)',
                            marginTop: '5px',
                            color: 'white'
                        }}
                    >
                        <Grid container direction="row"
                            spacing={2}
                            columns={8}
                        >
                            <Grid item xs={12}>
                                <Typography variant="h6" className='color-white'>{data.sessionType == "Registered" ? "Register" : "DeRegister"} Call Information</Typography>
                            </Grid>

                            <Grid item xs={4}>
                                <Grid container item spacing={2}>
                                    <Grid item xs={4}>
                                        <span className='header-name'>User </span>
                                    </Grid>
                                    <Grid item xs={6}>
                                        <span className='content-style'>{showUser()}</span>
                                    </Grid>
                                </Grid>
                            </Grid>
                            <Grid item xs={4}>
                                <Grid container item spacing={2}>
                                    <Grid item xs={4}>
                                        <span className='header-name'>User Agent</span>
                                    </Grid>
                                    <Grid item xs={6}>
                                        <span className='content-style'>{showUA()}</span>
                                    </Grid>
                                </Grid>
                            </Grid>
                            <Grid item xs={4}>
                                <Grid container item spacing={2}>
                                    <Grid item xs={4}>
                                        <span className='header-name'>User Type</span>
                                    </Grid>
                                    <Grid item xs={6}>
                                        <span className='content-style'>{showUserType()}</span>
                                    </Grid>
                                </Grid>
                            </Grid>
                            <Grid item xs={4} classes={classes.dateLabel}>
                                <Grid container item spacing={2}>
                                    <Grid item xs={4}>
                                        <span className='header-name'>Time </span>
                                    </Grid>
                                    <Grid item xs={6}>
                                        <span className='content-style'>{showTime(data.recordStartTime)}</span>
                                    </Grid>
                                </Grid>
                            </Grid>
                            <Grid item xs={4} >
                                <Grid container item spacing={2}>
                                    <Grid item xs={4}>
                                        <span className='header-name'>Call Type </span>
                                    </Grid>
                                    <Grid item xs={6}>
                                        <span className='content-style'>{data && data.sessionType?data.sessionType:""}</span>
                                    </Grid>
                                </Grid>
                            </Grid>
                            <Grid item xs={4} >
                                <Grid container item spacing={2}>
                                    <Grid item xs={4}>
                                        <span className='header-name'>User-McpttId </span>
                                    </Grid>
                                    <Grid item xs={6}>
                                        <span className='content-style'>{data && data.callerMcpttId ?data.callerMcpttId.split('@')[0]:""}</span>
                                    </Grid>
                                </Grid>
                            </Grid>
                            <Grid item xs={4} >
                                <Grid container item spacing={2}>
                                    <Grid item xs={4}>
                                        <span className='header-name'>Ueid </span>
                                    </Grid>
                                    <Grid item xs={6}>
                                        <span className='content-style'>{data && data.callerUeId ?data.callerUeId:""}</span>
                                    </Grid>
                                </Grid>
                            </Grid>
                            <Grid item xs={4} >
                                <Grid container item spacing={2}>
                                    <Grid item xs={4}>
                                        <span className='header-name'>IMPU </span>
                                    </Grid>
                                    <Grid item xs={6}>
                                        <span className='content-style'>{data && data.callerIMPU ?data.callerIMPU:""}</span>
                                    </Grid>
                                </Grid>
                            </Grid>
                        </Grid>
                </Box>
                </div>
    ) : ""
}
        </div >
    )
}

export default RegisterRecordInfoTab