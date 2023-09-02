export const BasicInfoData = (userData) => {
    let basicUserInfo = {}
    return {
        ...basicUserInfo,
        id: userData.id ? userData.id : "",
        userName: userData.userName ? userData.userName : "",
        password: "",
        confirmpassword: "",
        TetraUser: userData.tetraUser,
        phoneNumber: userData.phoneNumber ? userData.phoneNumber : "",
        mcpttId: userData.mcptt_id ? userData.mcptt_id : "",
        Role: userData.userRoles && userData.userRoles.length > 0 ? userData.userRoles : ['Dispatcher'],
        Email: userData.email ? userData.email : "",
        iwf: {},
        VideoEnable: false,
        broadCastCall:false,
        mcxDataIdText: userData.mcDataId ? userData.mcDataId : "",
        mcxVideoIdText: userData.mcVideoId ? userData.mcVideoId : "",
        mcxVideoID: userData.mcxVideoID ? userData.mcxVideoID : false,
        mcxDataID: userData.mcxDataID ? userData.mcxDataID : false,
        userType: userData.userType ? userData.userType : "Dispatcher",
        priority: userData.priority ? userData.priority : "1",
        orgId: userData.orgId ? userData.orgId : "0",
        cadCallData: userData.cadCallData ? userData.cadCallData :{
            allowPrivateCallParticipation:false,
            incomingAuthorizationRequired:false,
            allowPrivateCallToAnyUser: false,
            outgoingAuthorizationRequired:false,
            defaultAuthorizer:""
        },
        callForwardingData : userData.callForwardingData ? userData.callForwardingData : {
            allowCallForwarding: false,
            allowCallForwardManualInput: false,
            callForwardingTarget: "",
            callForwardingOn: false,
            callForwardingCondition: "",
            callForwardingNoAnswerTimeout: "",
            allowCallForwardManualInputTarget: "",
          },  
        permissions: userData.permissions ? userData.permissions : {
            trainTab: true,
            communicationTab: true,
            alertTab: true,
            baseStation: true,
            locationTab: true,
            recordingsTab: true,
            grabAllowed: 'default',
            trainMovement: 'default'
        }
    }
}

export const DefaultBasicInfoData = {
    id: "",
    userName: "",
    password: "",
    confirmpassword: "",
    TetraUser: false,
    phoneNumber: "",
    mcpttId: "",
    Role: ['Dispatcher'],
    userType: 'Dispatcher',
    priority:"1",
    Email: "",
    subscriberType: 'Dispatcher',
    iwf: {},
    VideoEnable: false,
    broadCastCall:false,
    mcxDataIdText: "",
    mcxVideoIdText: "",
    mcxVideoID: false,
    mcxDataID: false,
    orgId: '0',
    cadCallData:{
        allowPrivateCallParticipation:true,
        incomingAuthorizationRequired:false,
        allowPrivateCallToAnyUser: false,
        outgoingAuthorizationRequired:false,
        defaultAuthorizer:""
    },
    callForwardingData : {
        allowCallForwarding: false,
        allowCallForwardManualInput: false,
        callForwardingTarget: "",
        callForwardingOn: false,
        callForwardingCondition: "",
        callForwardingNoAnswerTimeout: "",
        allowCallForwardManualInputTarget: "",
    },
    permissions: {
        trainTab: true,
        communicationTab: true,
        alertTab: true,
        baseStation: true,
        locationTab: true,
        recordingsTab: true,
        grabAllowed: 'default',
        trainMovement: 'default'
    }
}