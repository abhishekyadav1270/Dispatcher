import React, { useRef, useState } from 'react'

import { Grid, makeStyles, Typography } from '@material-ui/core';
import { Box } from '@mui/material'
import './player.css'
import { showTime, changeBoolValue, showDuration } from './definedFunction';
import { otherStatus, SdsStatus, paAlerts } from '../../constants/constants';

const useStyles = makeStyles({
    checkBoxColor: {
        '&.MuiCheckbox-root': {
            color: "#ffb01f",
        }
    }
});

const SdsRecordInfoTab = (props) => {
    const { data } = props;
    console.log("---Callrecordinfo data---", data)
    const classes = useStyles();
    const showCalleeName = () => {
        if (data) {
            if (data.calleeDisplayName) {
                return data.calleeDisplayName;
            }
        }
        return ""
    }

    const getEncodedMessage = (data) => {
        if (data.sessionType === 'STATUS') {
            return getAlert(data.sdsPayloadData)
        } else {
            return data.sdsPayloadData;
        }
    }
    const getAlert = (code) => {
        const alert = [...SdsStatus, ...otherStatus, ...paAlerts].filter(status => Number(status.code) === Number(code));
        if (alert && alert.length > 0) return alert[0].desc
        else return code
    }
    const showCallerName = () => {
        if (data) {
            if (data.callerDisplayName) {
                return data.callerDisplayName;
            }
        }
        return ""
    }
    const showGroupName = () => {
        if (data) {
            if (data.displayGroupName) {
                return data.displayGroupName;
            }
        }
        return ""
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
                                <Typography variant="h6" className='color-white'>{data.sessionType == "TEXT_MESSAGE" ? "Text Message" : "Status"} Call Information</Typography>
                            </Grid>

                            <Grid item xs={4}>
                                <Grid container item spacing={2}>
                                    <Grid item xs={4}>
                                        <span className='header-name'>Record Type </span>
                                    </Grid>
                                    <Grid item xs={6}>
                                        <span className='content-style'>{data.recordType}</span>
                                    </Grid>
                                </Grid>
                            </Grid>

                            <Grid item xs={4} >
                                <Grid container item spacing={2}>
                                    <Grid item xs={4}>
                                        <span className='header-name'>SDS Type </span>
                                    </Grid>
                                    <Grid item xs={6}>
                                        <span className='content-style'>{data && data.sessionType?data.sessionType:""}</span>
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
                                        <span className='header-name'>Message </span>
                                    </Grid>
                                    <Grid item xs={6}>
                                        <span className='content-style'>{data && data.sdsPayloadData?getEncodedMessage(data):""}</span>
                                    </Grid>
                                </Grid>
                            </Grid>

                            <Grid item xs={4}>
                                <Grid container item spacing={2}>
                                    <Grid item xs={4}>
                                        <span className='header-name'>From</span>
                                    </Grid>
                                    <Grid item xs={6}>
                                        <span className='content-style'>{showCallerName()}</span>
                                    </Grid>
                                </Grid>
                            </Grid>

                            <Grid item xs={4} >
                                <Grid container item spacing={2}>
                                    <Grid item xs={4}>
                                        <span className='header-name'>From McpttId </span>
                                    </Grid>
                                    <Grid item xs={6}>
                                        <span className='content-style'>{data && data.callerMcpttId ?data.callerMcpttId:""}</span>
                                    </Grid>
                                </Grid>
                            </Grid>
                            <Grid item xs={4} >
                                <Grid container item spacing={2}>
                                    <Grid item xs={4}>
                                        <span className='header-name'>From Ueid </span>
                                    </Grid>
                                    <Grid item xs={6}>
                                        <span className='content-style'>{data && data.callerUeId ?data.callerUeId:""}</span>
                                    </Grid>
                                </Grid>
                            </Grid>
                            <Grid item xs={4} >
                                <Grid container item spacing={2}>
                                    <Grid item xs={4}>
                                        <span className='header-name'> From IMPU </span>
                                    </Grid>
                                    <Grid item xs={6}>
                                        <span className='content-style'>{data && data.callerIMPU ?data.callerIMPU:""}</span>
                                    </Grid>
                                </Grid>
                            </Grid>
                            <Grid item xs={4} >
                                <Grid container item spacing={2}>
                                    <Grid item xs={4}>
                                        <span className='header-name'>From UA </span>
                                    </Grid>
                                    <Grid item xs={6}>
                                        <span className='content-style'>{data?data.callerUA:""}</span>
                                    </Grid>
                                </Grid>
                            </Grid>
                            <Grid item xs={4}>
                                <Grid container item spacing={2}>
                                    <Grid item xs={4}>
                                        <span className='header-name'>To </span>
                                    </Grid>
                                    <Grid item xs={6}>
                                        <span className='content-style'>{showCalleeName()}</span>
                                    </Grid>
                                </Grid>
                            </Grid>

                            <Grid item xs={4} >
                                <Grid container item spacing={2}>
                                    <Grid item xs={4}>
                                        <span className='header-name'>To McpttId </span>
                                    </Grid>
                                    <Grid item xs={6}>
                                        <span className='content-style'>{data?data.calleeMcpttIdURI:""}</span>
                                    </Grid>
                                </Grid>
                            </Grid>
                            <Grid item xs={4} >
                                <Grid container item spacing={2}>
                                    <Grid item xs={4}>
                                        <span className='header-name'>To Ueid </span>
                                    </Grid>
                                    <Grid item xs={6}>
                                        <span className='content-style'>{data ?data.calleeUeId:""}</span>
                                    </Grid>
                                </Grid>
                            </Grid>
                            <Grid item xs={4} >
                                <Grid container item spacing={2}>
                                    <Grid item xs={4}>
                                        <span className='header-name'> To IMPU </span>
                                    </Grid>
                                    <Grid item xs={6}>
                                        <span className='content-style'>{data?data.calleeIMPU:""}</span>
                                    </Grid>
                                </Grid>
                            </Grid>
                            <Grid item xs={4} >
                                <Grid container item spacing={2}>
                                    <Grid item xs={4}>
                                        <span className='header-name'>To UA </span>
                                    </Grid>
                                    <Grid item xs={6}>
                                        <span className='content-style'>{data?data.calleeUA:""}</span>
                                    </Grid>
                                </Grid>
                            </Grid>
                            <Grid item xs={4} >
                                <Grid container item spacing={2}>
                                    <Grid item xs={4}>
                                        <span className='header-name'>Group </span>
                                    </Grid>
                                    <Grid item xs={6}>
                                        <span className='content-style'>{data.displayGroupName}</span>
                                    </Grid>
                                </Grid>
                            </Grid>
                            <Grid item xs={4} >
                                <Grid container item spacing={2}>
                                    <Grid item xs={4}>
                                        <span className='header-name'>Group Id</span>
                                    </Grid>
                                    <Grid item xs={6}>
                                        <span className='content-style'>{data.groupIdUri}</span>
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

export default SdsRecordInfoTab