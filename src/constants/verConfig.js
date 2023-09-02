/*let globalConfig = {
    //Tabs
    Trains: true,
    Location: false,
    Communication: true,
    Alerts: true,
    Admin: true,
    //functionalities
    sds: true,
    alerts: true,
    calls: true,
    dgna: true,
    //Logout
    pswLogout: true,
}

module.exports = { globalConfig }*/

module.exports = global.config = {
    userConfig: {
        Trains: true,
        Location: false,
        Communication: true,
        Alerts: true,
        Recordings: true,
        Admin: false,
        //functionalities
        sds: true,
        alerts: true,
        calls: true,
        dgna: true,
        //Logout
        pswLogout: true,
        //Train Grab
        RadioBaseStation: true,
        TrainMovement: "none",
        Grab: "none",
    },
    trainConfig: {
        minlteCount: 0,
        maxlteCount: 100,
        lteSize: 5, //LTE size
        lteGap: 5,  //LTE gap between 2 LTE in same trackcircuit
        singleLTE: 15,  // lteGap + lteSize + lteGap
        trackCtGap: 2,  //Gap between track circuit
        startGap: 80,  //initial gap before LTE plotting starts
        endGap: 80,  //end gap after LTE plotting ends
        downRev: true
    },
    mumbaiTrainConfig: {
        minlteCount: 0,
        maxlteCount: 100,
        lteSize: 7,
        lteGap: 5,
        singleLTE: 17,
        trackCtGap: 2,
        startGap: 80,
        endGap: 80,
        svgX:100,  //area to draw a line  value is taken wrt uptrack
        svgY:150,   //area to draw a line  value is taken wrt uptrack
        svgWidth:1500,
        svgHeight:420,
        gapBwTracks:90,
        up1TrackY: -90-21,   //wrt to uptrack
        up1TrackX:-50,
        upTrackY:0,           // wrt upTrack
        upTrackX:0,
        up1TrackPl:56,
        down1TrackPl:50,
        midTrackPl:40,
        downTrackY:90+21,         //wrt upTrack
        downTrackX:0,  
        down1TrackY:90+21+90+21,    //wrt upTrack
        down1TrackX:-50,
        midTrackY:(90+21)/2,         //wrt upTrack
        midTrackX:1100,               //wrt upTrack
        downRev: true,
        trainIcon:90.72
    },
    puneTrainConfig: {
        minlteCount: 0,
        maxlteCount: 100,
        lteSize: 5,
        lteGap: 4,
        singleLTE: 12,
        trackCtGap: 2,
        startGap: 80,
        endGap: 80,
        downRev: false
    },
    cdotTrainConfig: {
        minlteCount: 0,
        maxlteCount: 100,
        lteSize: 60,
        lteGap: 5,
        singleLTE: 80,
        trackCtGap: 10,
        startGap: 80,
        endGap: 80,
        trackCtGap: 2,
        startGap: 80,
        endGap: 80,
        svgX:100,  //area to draw a line  value is taken wrt uptrack
        svgY:150,   //area to draw a line  value is taken wrt uptrack
        svgWidth:1500,
        svgHeight:420,
        gapBwTracks:90,
        up1TrackY: -90-21,   //wrt to uptrack
        up1TrackX:-50,
        upTrackY:0,           // wrt upTrack
        upTrackX:0,
        up1TrackPl:56,
        downTrackY:90+21,         //wrt upTrack
        downTrackX:0,  
        down1TrackY:90+21+90+21,    //wrt upTrack
        down1TrackX:-50,
        midTrackY:(90+21)/2,         //wrt upTrack
        midTrackX:1100,               //wrt upTrack
        downRev: true,
        trainIcon:94.05
    },
    isTrainConfigSet: false,
    currentLAId: "",
    faID: '',
    activatedFA: '',
    project: 'nagpur', //default nagpur    //values: mumbai, nagpur
    // other global config variables you wish
    message_config: process.env.REACT_APP_MESSAGE.toLowerCase(),
    sds_chat_config : process.env.REACT_APP_SDS_CHAT.toLowerCase(),
    video_call_config: process.env.REACT_APP_ENABLE_VIDEO_CALL.toLowerCase(),
    DISPACTHER_LOGS_ENABLE: process.env.REACT_APP_LOGS_ENABLE,
    CALL_ON_HOLD: process.env.REACT_APP_CALL_ON_HOLD,
    ipConfig: {
        host: process.env.REACT_APP_MCX_HOST,
        dispatcherHost: process.env.REACT_APP_HOST,
        idmsHost: process.env.REACT_APP_IDMS_HOST,
        drachtioHost: process.env.REACT_APP_DRACHTIO_HOST,
        risHost: process.env.REACT_APP_RIS_HOST,
        defaultPort: "30809",
        dispatcherServerPort: "30301",
        wsPort: "30506",
        wssPort: "30043",
        idmsPort: "30501",
        cmcPort: process.env.REACT_APP_CMS_PORT,
        gmcPort: "30555",
        iwfPort: "30556",
        userApiPort: "30557",
    },
    // ipConfig: {
    //     host: process.env.REACT_APP_MCX_HOST,
    //     dispatcherHost: process.env.REACT_APP_HOST,
    //     idmsHost: process.env.REACT_APP_IDMS_HOST,
    //     defaultPort: "30809", 
    //     dispatcherServerPort: "30301", 
    //     wsPort: "5060", 
    //     wssPort: "30043", 
    //     idmsPort: "30501", 
    //     cmcPort: process.env.REACT_APP_CMS_PORT, 
    //     gmcPort: "30556", 
    //     iwfPort: "30557",
    // },
};

