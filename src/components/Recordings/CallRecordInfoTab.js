import React, { useRef, useState } from 'react'

import { Grid, makeStyles, Typography } from '@material-ui/core';
import { Box } from '@mui/material'
import ReactPlayer from 'react-player'
import './player.css'
import GroupCallPttTable from './GroupCallPttTable';
import { showTime, changeBoolValue, showDuration } from './definedFunction';
import { EndPoints } from '../../MCXclient/endpoints';
const useStyles = makeStyles({
    checkBoxColor: {
        '&.MuiCheckbox-root': {
            color: "#ffb01f",
        }
    }
});
const CallRecordInfoTab = (props) => {
    const { data } = props;
    console.log("---Callrecordinfo data---", data)
    const classes = useStyles();
    const player = useRef();
    const playerSeek = (duration) => {
        console.log("seekto --", duration);
        player.current.seekTo(duration);
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
                            marginTop:'5px',
                            color:'white'
                        }}
                    >
                        <Grid container direction="row"
                            spacing={2}
                            columns={8}
                        >
                            <Grid item xs={12}>
                                <Typography variant="h6" className='color-white'>{data.sessionType == "private" ? "Individual" : "Group"} Call Information</Typography>
                            </Grid>
                            
                            <Grid item xs={4}>
                                <Grid container item spacing={2}>
                                    <Grid item xs={4}>
                                        <span className='header-name'>Call Start Time </span>
                                    </Grid>
                                    <Grid item xs={6}>
                                        <span className='content-style'>{showTime(data.recordStartTime)}</span>
                                    </Grid>
                                </Grid>
                            </Grid>
                            <Grid item xs={4} classes={classes.dateLabel}>
                                <Grid container item spacing={2}>
                                    <Grid item xs={4}>
                                        <span className='header-name'>Call End Time </span>
                                    </Grid>
                                    <Grid item xs={6}>
                                        <span className='content-style'>{showTime(data.recordEndTime)}</span>
                                    </Grid>
                                </Grid>
                            </Grid>
                            <Grid item xs={4}>
                                <Grid container item spacing={2}>
                                    <Grid item xs={4}>
                                        <span className='header-name'>Call Duration </span>
                                    </Grid>
                                    <Grid item xs={6}>
                                        <span className='content-style'>{showDuration(data.recordStartTime, data.recordEndTime)}</span>
                                    </Grid>
                                </Grid>
                            </Grid>
                            <Grid item xs={4} >
                                <Grid container item spacing={2}>
                                    <Grid item xs={4}>
                                        <span className='header-name'>Call Type </span>
                                    </Grid>
                                    <Grid item xs={6}>
                                        <span className='content-style'>{data.sessionType}</span>
                                    </Grid>
                                </Grid>
                            </Grid>
                            <Grid item xs={4} >
                                <Grid container item spacing={2}>
                                    <Grid item xs={4}>
                                        <span className='header-name'>Answer Mode </span>
                                    </Grid>
                                    <Grid item xs={6}>
                                        <span className='content-style'>{data.answerMode}</span>
                                    </Grid>
                                </Grid>
                            </Grid>
                            <Grid item xs={4} >
                                <Grid container item spacing={2}>
                                    <Grid item xs={4}>
                                        <span className='header-name'>Floor Control </span>
                                    </Grid>
                                    <Grid item xs={6}>
                                        <span className='content-style'>{changeBoolValue(data.floorControl)}</span>
                                    </Grid>
                                </Grid>
                            </Grid>
                            <Grid item xs={4} >
                                <Grid container item spacing={2}>
                                    <Grid item xs={4}>
                                        <span className='header-name'>Caller</span>
                                    </Grid>
                                    <Grid item xs={6}>
                                        <span className='content-style'>{data.callerDisplayName}</span>
                                    </Grid>
                                </Grid>
                            </Grid>
                            <Grid item xs={4} >
                                <Grid container item spacing={2}>
                                    <Grid item xs={4}>
                                        <span className='header-name'>Caller-McpttId </span>
                                    </Grid>
                                    <Grid item xs={6}>
                                        <span className='content-style'>{data.callerMcpttId ?data.callerMcpttId.split('@')[0]:"" }</span>
                                    </Grid>
                                </Grid>
                            </Grid>
                            <Grid item xs={4} >
                                <Grid container item spacing={2}>
                                    <Grid item xs={4}>
                                        <span className='header-name'>Callee</span>
                                    </Grid>
                                    <Grid item xs={6}>
                                        <span className='content-style'>{data.calleeDisplayName}</span>
                                    </Grid>
                                </Grid>
                            </Grid>
                            <Grid item xs={4} >
                                <Grid container item spacing={2}>
                                    <Grid item xs={4}>
                                        <span className='header-name'>Callee-McpttId </span>
                                    </Grid>
                                    <Grid item xs={6}>
                                        <span className='content-style'>{data.calleeMcpttIdURI ? data.calleeMcpttIdURI.split('@')[0]:""}</span>
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
                                        <span className='header-name'>Group Id </span>
                                    </Grid>
                                    <Grid item xs={6}>
                                        <span className='content-style'>{data.groupIdUri ? data.groupIdUri.split('@')[0]:""}</span>
                                    </Grid>
                                </Grid>
                            </Grid>
                           <Grid item xs={4} >
                                <Grid container item spacing={2}>
                                    <Grid item xs={4}>
                                        <span className='header-name'>Emergency </span>
                                    </Grid>
                                    <Grid item xs={6}>
                                        <span className='content-style'>{changeBoolValue(data.emergency)}</span>
                                    </Grid>
                                </Grid>
                            </Grid>

                            <Grid item xs={4} >
                                <Grid container item spacing={2}>
                                    <Grid item xs={4}>
                                        <span className='header-name'>Broadcast </span>
                                    </Grid>
                                    <Grid item xs={6}>
                                        <span className='content-style'>{changeBoolValue(data.broadcast)}</span>
                                    </Grid>
                                </Grid>
                            </Grid>

                        </Grid>
                    </Box>
                    <Box
                        sx={{
                            // boxShadow: '0 3px 10px rgb(0 0 0 / 20%)',
                            borderRadius: '12px',
                            padding: '20px',
                            display: 'flex',
                            justifyContent: 'center',
                            backgroundColor: 'rgba(255,255,255,0.07)',
                            marginTop:'5px',
                            color:'white'
                        }}
                    >
                        <ReactPlayer
                            // url='https://iandevlin.github.io/mdn/video-player-with-captions/video/sintel-short.mp4'
                            // url={videoStream}
                            url={`${EndPoints.getConfig().getmp4File}?callId=${data.callId}&startTime=${data.startTime}`}
                            controls={true}
                            width="100%"
                            // height="150px"
                            ref={player}

                            config={{
                                file: {
                                    attributes: {
                                        crossOrigin: "anonymous",
                                        controlsList: "nodownload"
                                    },
                                    tracks: [
                                        data.sessionType && (data.sessionType.toLowerCase() == "private" && data.floorControl == "1") || data.sessionType.toLowerCase() != "private" ?
                                            { kind:'subtitles', src: `${EndPoints.getConfig().getSubtitleFile}?callId=${data.callId}&startTime=${data.startTime}`, srcLang: 'en', default: true, mode: 'showing' } : {}
                                        // { kind: 'subtitles', src: 'subtitle.vtt' , srcLang: 'en', default: true, mode: 'showing' }
                                    ]
                                }
                            }}
                        />
                    </Box>
                </div>
            ) : ""}
            {data.sessionType && (data.sessionType.toLowerCase() == "private" && data.floorControl == "1") || data.sessionType.toLowerCase() != "private" ?
                (<Box
                    sx={{
                        // boxShadow: '0 3px 10px rgb(0 0 0 / 20%)',
                        borderRadius: '12px',
                        padding: '20px',
                        display: 'flex',
                        justifyContent: 'center',
                        backgroundColor: 'rgba(255,255,255,0.07)',
                        marginTop:'5px',
                        color:'white'
                    }}
                >
                    <GroupCallPttTable callStartTime={data.recordStartTime} seekHandler={playerSeek} callId={data.callId} />
                </Box>) : ""}
        </div >
    )
}

export default CallRecordInfoTab