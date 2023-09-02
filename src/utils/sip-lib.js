import {UserAgent, SessionState, Registerer, Publisher, Inviter, Messager, RegistererState} from 'sip.js'
import {sipGroupCallTypes,sipIndividualCallTypes,sessionTypes} from './sipConfig'
import { CallAction } from '../models/callAction'
import {toXML} from 'jstoxml'
import {parseString} from 'xml2js'
import io  from 'socket.io-client'
export default class Sip{
    
    
    constructor(
        config,
        mcdxHost,
        mcptt_id,
        authToken,
        remoteAudioElement,
        localAudioElement,
        handlers,
        dispatch){
            this.config = config;
            this.mcdxHost = mcdxHost;
            this.mcptt_id = mcptt_id;
            this.authToken = authToken;
            this.remoteAudio = remoteAudioElement;
            this.localAudio = localAudioElement;
            this.dispatch = dispatch;
            if(handlers){
                this.connectionOpenHandler              = handlers['OPEN']
                this.connectionErrorHandler             = handlers['ERROR']
                this.connectionCloseHandler             = handlers['CLOSE']
                this.sdsLocationMessageHandler          = handlers['SDS_LOCATION_MESSAGE']
                this.textMessageMessageHandler          = handlers['TEXT_MESSAGE_MESSAGE']
                this.groupTextMessageHandler            = handlers['GROUP_TEXT_MESSAGE_MESSAGE']
                this.textMessageStateUpdateHandler      = handlers['TEXT_MESSAGE_STATE_UPDATE']
                this.groupTextMessageStateUpdateHandler = handlers['GROUP_TEXT_MESSAGE_STATE_UPDATE']
                this.statusMessageHandler               = handlers['STATUS_MESSAGE']
                this.groupStatusMessageHandler          = handlers['GROUP_STATUS_MESSAGE']
                this.individualCallMessageHandler       = handlers['INDIVIDUAL_CALL_MESSAGE']
                this.individualCallActionMessageHandler = handlers['INDIVIDUAL_CALL_ACTION_MESSAGE']
                this.groupCallMessageHandler            = handlers['GROUP_CALL_MESSAGE']
                this.groupCallActionMessageHandler      = handlers['GROUP_CALL_ACTION_MESSAGE']
                this.pipelineActiveMessageHandler       = handlers['PIPELINE_ACTIVE_MESSAGE']
                this.pipelineDestroyMessageHandler      = handlers['PIPELINE_DESTROY_MESSAGE']
                this.atsMessageHandler                  = handlers['ATS_MESSAGE']
                this.systemStatusMessageHandler         = handlers['SYSTEM_STATUS_MESSAGE']
                this.updateSubscribersListHandler       = handlers['FETCH_SUBSCRIBERS_SUCCESS']
                this.updateGroupsListHandler            = handlers['FETCH_GROUPS_SUCCESS']
            };
            this.userAgent = null;
            this.mcdxURI=null;
            this.registerer = null;
            this.publisher = null;
            this.session={};
            this.incomingMessage=null;
            this.remoteStream = new MediaStream();
            this.floorPort = 0;
            this.incoming = false;
            this.gropuPersistedId=1;
            this.individualPersistedId=1;
            this.socket = io.connect('http://127.0.0.1:8090'); //RIS Socket
        }

    connect()
    {
        console.log("in sip-lib")
        this.socket.on('connect',(sock)=>{
          console.log('connected to RIS websocket')
        })
        this.socket.on('dummySigData',(atsMsg)=>{
          console.log(atsMsg);
          this.dispatch(this.atsMessageHandler(JSON.parse(atsMsg)))
        })
        //console.log('sipConfig=',this.config);
        this.userAgent = new UserAgent(this.config);
        this.userAgent.contact.uri.user = this.mcptt_id;//+'@'+this.mcdxHost;
        this.mcdxURI =  UserAgent.makeURI("sip:mcdx@"+this.mcdxHost);
        const registererOptions = {            
            expires: 20,
            extraHeaders:[
              'X-MCX-Access-Token: '+this.authToken,
            ]
        };
        this.registerer = new Registerer(this.userAgent,registererOptions);

        const publisherOptions = {
            // extraHeaders:[
            //     'X-MCX-Access-Token: '+this.authToken,
            // ]
        };
        this.publisher = new Publisher(this.userAgent,this.mcdxURI,"presence",publisherOptions)
          
        this.userAgent.start().then(()=>{
            this.registerer.register().then(()=>{
                this.dispatch(this.connectionOpenHandler());
                
            }).catch((e)=>{
                console.log(e)
                this.dispatch(this.connectionErrorHandler());
                return
            });
            
        }).catch((e)=>{
            //dispatch connection error
            console.log("Error in Register:",e);
            return
        })

        this.registerer.stateChange.addListener((state)=>{
            switch (state) {
                case RegistererState.Initial:
                  break;
                case RegistererState.Registered:
                    this.publisher.publish();
                    this.outgoingMessage({message:'User-List-Req',type:"getSubscribers"})
                    this.outgoingMessage({message:'Group-List-Req',type:"getGroups"})
                  break;
                case RegistererState.Unregistered:
                  break;
                case RegistererState.Terminated:
                  this.registerer = undefined;
                  break;
                default:
                  throw new Error("Unknown registerer state.");
              }
        })

        //this.publisher.publish();

        this.userAgent.delegate= {
            onConnect:()=>{
                //todo
            },
            onDisconnect:()=>{
                this.dispatch(this.connectionCloseHandler());
            },
            onInvite: (invitation)=>{
                this.session = invitation;
                this.incoming = true;            
                console.log(invitation.request.getHeader("X-MCX-Request"));
                console.log(invitation.request.getHeader(""));
                invitation.delegate={
                    onRefer(referral)
                    {

                    },
                    oncancel()
                    {
                      callData.callActionType= "DECLINE";
                      callData.stateType = "MISSED";
                    }
                }
                ///todo improve logic below
                var reqHeader = invitation.request.getHeader("X-MCX-Request").toString();
                if(invitation.request.toString().includes("X-MCX-Indication")){
                  var emergencyHeader = invitation.request.getHeader("X-MCX-Indication").toString();
                }else{
                  emergencyHeader ='';
                }
                
                //const callType = reqHeader[0].substring(reqHeader[0].search('='+1));
                
                const callData = this.getCallInfo(reqHeader,emergencyHeader);
                
                callData.session = invitation;
                //callData.persistentId = 1;
                console.log("incoming call data",callData)
                //this.incomingIndividualCallFunction(callData);
                // console.log("incoming call data",callData)
                if(callData.callingGroup!==''){
                  //callData.fromId = callingGroup;
                  callData.persistentId = Number(1);
                  this.incomingGroupCallFunction(callData);
                  invitation.accept();
                }else{
                  callData.persistentId = Number(1);
                  this.incomingIndividualCallFunction(callData);
                }
                invitation.stateChange.addListener((newState)=>{
                    console.log("SIP SESSION STATE:",newState);
                    switch (newState) {
                            case SessionState.Initial:
                                
                            break;
                            case SessionState.Establishing:
                            // Session is establishing.
                            //Dispatch invitation to call 
                            break;
                            case SessionState.Established:
                                this.setupRemoteMedia(invitation);
                            // Session has been established.
                            break;
                            case SessionState.Terminated:
                            // Session has terminated.
                                if(callData.stateType!=='MISSED'){
                                  callData.callActionType = 'DISCONNECTED'
                                }
                                callData.incomingCall = false;
                                console.log(callData)
                                if(callData.callingGroup!==''){
                                  //callData.fromId = callingGroup;
                                  this.dispatch ? this.dispatch(this.groupCallActionMessageHandler(callData)) : this.groupCallActionMessageHandler(callData);
                                }else{
                                  this.dispatch ? this.dispatch(this.individualCallActionMessageHandler(callData)) : this.individualCallActionMessageHandler(callData)
                                }
                                this.cleanupMedia()
                            break;
                            default:
                            break;
                      }
                });
            },
            onMessage: (message)=>{
                this.incomingMessage = message;
                console.log(message.request.body.toString());
                console.log('SDS Received');

                var incomingMessage = this.incomingMessage.request.body.toString();
                const data = {};
                if(incomingMessage.includes('type="Floor"'))
                {
                  var floorState = {};
                  parseString(incomingMessage,(err,res)=>{
                    if(err){

                    }else{
                      floorState = res;
                      console.log("Parsed JSON:", floorState.message.event[0]["floor-info"][0]);
                    }
                  });
                  var mType = floorState.message.event[0]["floor-info"][0].state[0];
                  var ftime = 0;
                  var callActionType = '';
                  if(mType==='Taken'){
                    var activeUser = floorState.message.event[0]["floor-info"][0].holder[0];
                    callActionType = 'RELEASE_PUSH_TO_TALK';
                    var ptt = true
                  }else
                  if(mType==='Granted'){
                    activeUser=this.mcptt_id;
                    ftime = floorState.message.event[0]["floor-info"][0].duration[0];
                    callActionType = 'ACQUIRE_PUSH_TO_TALK'
                    ptt = false
                  }else
                  if(mType==='IDLE'||mType==='Idle'){
                    activeUser='IDLE'
                    callActionType = 'RELEASE_PUSH_TO_TALK'
                    ptt = true
                    activeUser = 0;
                  }
                  const floorMessage = {
                    callActionType: callActionType,
                    type : 'FLOOR_STATE',
                    conf : floorState.message.event[0]["floor-info"][0].conf[0],
                    talkingPartyId: activeUser,
                    time: ftime ,
                    ptt: ptt                   
                  }
                  console.log('floor object',floorMessage)
                  if(floorMessage.conf.includes('private')){
                    this.dispatch ? this.dispatch(this.individualCallActionMessageHandler(floorMessage)) : this.individualCallActionMessageHandler(floorMessage);
                  }else
                  if(floorMessage.conf.includes('prearranged')){
                    this.dispatch ? this.dispatch(this.groupCallActionMessageHandler(floorMessage)) : this.groupCallActionMessageHandler(floorMessage);
                  }
                  
                }else
                if(incomingMessage.includes('type="User-List-Resp"'))
                {
                  var ulistObject = {};
                  // if(incomingMessage.includes('type="User-List-Resp"subs')){
                  //   var inMessage = "<message>	<event type=\"User-List-Resp\">		<mcptt>			<entry uri=\"mcx.test-222.iitb\" /> <entry uri=\"mcx.test-666.iitb\" />		</mcptt>		<tetra>			<entry ssi=\"4003\">				<kind>Application</kind>			</entry>			<entry ssi=\"10002\">				<kind>Mobile</kind>			</entry>		</tetra>	</event></message>";
                  //   parseString(inMessage,(err,res)=>{ //use incomingMessage once test done
                  //     if(err){
  
                  //     }else{
                  //       ulistObject = res;
                  //       console.log("Parsed JSON:", ulistObject.message.event[0]);
                  //     }
                  //   }); 
                  // }else{
                    parseString(incomingMessage,(err,res)=>{ //use incomingMessage once test done
                      if(err){
                        console.log("error parsing xml");
                      }else{
                        ulistObject = res;
                        console.log("Parsed JSON:", ulistObject.message.event[0]);
                      }
                    }); 
                  
                  
                    var subscribers = [];
                    var mcptt = ulistObject.message.event[0]["mcptt"][0]['entry'];
                    var mSub = mcptt.map((sub,i)=> {return { id:sub.$['uri'], name: 'mcx-'+(i+1), type:'MCX_USER'}});
                    if(ulistObject.message.event[0]["tetra"]){
                      var tetra = ulistObject.message.event[0]["tetra"][0]['entry'];
                      var tSub = tetra.map((sub,i)=>{return{id:sub.$['ssi'], name: 'tetra-'+(i+1), type:sub.kind[0]}});
                      subscribers = mSub.concat(tSub);
                    }else{
                      subscribers=mSub;
                    }                                                          
                    console.log(subscribers)

                    this.dispatch ? this.dispatch(this.updateSubscribersListHandler(subscribers)) : this.updateSubscribersListHandler(subscribers)

                  

                }else 
                if(incomingMessage.includes('type="Group-List-Resp"')){
                  var gListObject = {};
                  incomingMessage = incomingMessage.substring(incomingMessage.search('<event'),incomingMessage.search('</event>')+8)
                  parseString(incomingMessage,(err,res)=>{ //use incomingMessage once test done
                    if(err){
                      console.log("error parsing xml");
                    }else{
                      gListObject = res;
                      console.log("Parsed JSON:", gListObject);
                  }}); 
                  let groups = []
                  var mcpttGroups = gListObject.event["service"][0]['group'];
                  var mcdataGroups = gListObject.event["service"][1]['group'];
                  var mcvideoGroups = gListObject.event["service"][2]['group'];
                  if(mcpttGroups && mcpttGroups.length){
                    groups = mcpttGroups.map((g,i)=>{
                      return{id:g.$['id'], name: 'mcptt-group-'+i+1, type:'MCPTT_GROUP'}
                    })
                  }
                  if(mcdataGroups && mcdataGroups.length){
                    groups = groups.concat(mcdataGroups.map((g,i)=>{
                      return{id:g.$['id'], name: 'mcdata-group-'+i+1, type:'MCDATA_GROUP'}
                    }))
                  }
                  if(mcvideoGroups && mcvideoGroups.length){
                    groups = groups.concat(mcvideoGroups.map((g,i)=>{
                      return{id:g.$['id'], name: 'mcvideo-group-'+i+1, type:'MCVIDEO_GROUP'}
                    }))
                  }
                  console.log("Populated group list",groups);                    
                  this.dispatch ? this.dispatch(this.updateGroupsListHandler(groups)) : this.updateGroupsListHandler(groups)
                  
                }else
                if(incomingMessage.includes('type="sds"'))
                {
                  var sdsObject = {};
                  parseString(incomingMessage,(err,res)=>{
                    if(err){
                      console.log("error parsing xml")
                    }else{
                      sdsObject = res;
                      console.log("Parsed JSON:", sdsObject.message.event[0]);
                    }
                  });
                  const mcDataInfo= sdsObject.message.event[0]["mcdata-info"][0];
                  const mcDataSignal = sdsObject.message.event[0]["mcdata-signal"][0];
                  const sds = sdsObject.message.event[0]["payload"][0];

                  data.toId = mcDataInfo['mcdata-request-uri'][0]['mcpttURI'][0];
                  data.toId = data.toId.substring(data.toId.search(':')+1,data.toId.search('@'));
                  data.fromId = mcDataInfo['mcdata-calling-user-id'][0]['mcpttURI'][0];
                  data.fromId = data.fromId.substring(data.fromId.search(':')+1,data.fromId.search('@'))
                  const sdsType = mcDataInfo['session-type'][0];
                  
                  data.persistentId = mcDataSignal['message-id'][0];
                  data.conversationId = mcDataSignal['conversation-id'][0];
                  if(mcDataSignal['disposition-type']){
                    if(mcDataSignal['disposition-type'][0]==='REQUEST'){
                      data.consumedReportNeeded = mcDataSignal['disposition-value'][0].includes('READ') ? true : false;
                      data.deliveryReportNeeded = mcDataSignal['disposition-value'][0].includes('DELIVERY') ? true : false;
                    }
                    else if(mcDataSignal['disposition-type'][0]==='NOTIFICATION'){
                      data.communicationType = 'STATE_UPDATE'// add support later
                    }
                  }

                  data.message = sds['text'][0];
                  data.communicationType = 'SDS' //sds['type'][0];

                  if(sdsType === 'one-to-one-sds')
                  {
                    if(sds['type'][0]==='SDS'){
                      data.sdsType = 'TEXT_MESSAGE';
                    }else if(sds['type'][0]==='STATUS'){
                      data.sdsType = 'STATUS_MESSAGE';
                      data.signalingStatusId = data.message;
                      data.tetraCode = data.message;
                    }
                  }else if(sdsType === 'group-sds')                  {
                    data.groupId = mcDataInfo['mcdata-calling-group-id'][0]['mcpttURI'][0];
                    if(sds['type'][0]==='SDS'){
                      data.sdsType = 'GROUP_TEXT_MESSAGE';
                    }else if(sds['type'][0]==='STATUS'){
                      data.sdsType = 'GROUP_STATUS_MESSAGE';
                      data.signalingStatusId = data.message;
                      data.tetraCode = data.message;
                    }
                  }

                  console.log("INCOMING DATA",data);
                  this.incomingMessageFunction(data);
                }
                
                ///////////// Convert incoming message into an object ///////////////
                /////////////////Incoming Message format/////////////////////////////
                // SDS:
                // <mcdata-info>
                //   <session-type>group-sds</session-type>
                //   <mcdata-request-uri>
                //     <mcpttURI>sip:mcx.test-111.iitb@ec2-13-126-164-144.ap-south-1.compute.amazonaws.com</mcpttURI>
                //   </mcdata-request-uri>
                //   <mcdata-calling-user-id>
                //     <mcpttURI>sip:mcx.test-111.iitb@ec2-13-126-164-144.ap-south-1.compute.amazonaws.com</mcpttURI>
                //   </mcdata-calling-user-id>
                //   <mcdata-calling-group-id>
                //     <mcpttURI>sip:consort@mclabs.co</mcpttURI>
                //   </mcdata-calling-group-id>
                // </mcdata-info>
                // Data
                // Hi
                /////////////////////////////////////////////////////////////////////
                

                // data.fromId = incomingMessage.substring(incomingMessage.search('<mcdata-calling-user-id>'),incomingMessage.search('</mcdata-calling-user-id>'));
                // data.fromId = data.fromId.substring(data.fromId.search('sip:')+4, data.fromId.search('@'));
                // data.toId = incomingMessage.substring(incomingMessage.search('<mcdata-request-uri>'),incomingMessage.search('</mcdata-request-uri>'));
                // data.toId = data.toId.substring(data.toId.search('sip:')+4,data.toId.search('@'));
                // data.persistentId = '';
                // if(incomingMessage.includes('mcdata-calling-group-id'))
                // {
                //   data.groupId = incomingMessage.substring(incomingMessage.search('<mcdata-calling-group-id>'),incomingMessage.search('</mcdata-calling-group-id>'));
                //   data.groupId = data.groupId.substring(data.groupId.search('sip:')+4,data.groupId.search('</mcpttURI>'));
                // }
                
                // if(incomingMessage.includes('STATUS_MESSAGE'))
                // {
                //   data.communicationType = 'SDS'                  
                //   data.tetraCode = 1; //todo read from incomingMessage
                //   data.signalingStatusId= 1 //todo read from incomingMessage
                //   if(incomingMessage.includes('group-sds'))
                //   {
                //     data.sdsType = 'GROUP_STATUS_MESSAGE';
                //     //this.incomingMessageFunction(data,'GROUP_STATUS_MESSAGE');
                //   }else
                //   if(incomingMessage.includes('one-to-one-sds'))
                //   {
                //     data.sdsType = 'STATUS_MESSAGE';
                //     //this.incomingMessageFunction(data,'STATUS_MESSAGE');
                //   }
                // }else
                // if(incomingMessage.includes('SDS'))
                // {
                //   if(incomingMessage.includes('one-to-one-sds') || incomingMessage.includes('group-sds'))
                //   {
                //     data.communicationType = 'SDS';
                //     data.message = incomingMessage.substring(incomingMessage.search('Data')+4);
                //     data.consumedReportNeeded = false;
                //     data.consumedReportNeeded = false;
                //     data.immediate = false;
                //     if(incomingMessage.includes('group-sds'))
                //     {
                //       data.sdsType = 'GROUP_TEXT_MESSAGE';
                //     }else
                //     if(incomingMessage.includes('one-to-one-sds'))
                //     {
                //       data.sdsType = 'TEXT_MESSAGE';
                //     }
                //   }
                //   /////////////////DUMMY LOCATION ///////////////////////
                //   // if(incomingMessage.includes('location'))
                //   // {
                //   //   data.latitude = 19.132924;
                //   //   data.longitude = 72.918939;
                //   //   data.sdsType = "LOCATION";
                //   //   data.communicationType = 'SDS';
                //   //   //this.incomingMessageFunction(data,'LOCATION');
                //   // }
                //   ////////////////////////////////////////////////////////                  
                // }else
                // if(incomingMessage.includes('STATUS_UPDATE'))
                // {
                //   data.stateType = 'DELIVERED';//STRING (PERSISTED/DELIVERED/CONSUMED) 
                //   data.persistentId = incomingMessage.substring(incomingMessage.search('requestId=')+10)+1;
                //   data.communicationType = "STATUS_UPDATE";
                //   if(incomingMessage.includes('group-sds'))
                //   {
                //     data.sdsType = 'GROUP_TEXT_MESSAGE';
                //   }else
                //   if(incomingMessage.includes('one-to-one-sds'))
                //   {
                //     data.sdsType = 'TEXT_MESSAGE';
                //   }
                // }
                // console.log("INCOMING DATA",data);
                // this.incomingMessageFunction(data);
            },
        };
        //this.session=incomingInvite;
    }

    send(type,param){
        switch(type){
            case 'SEND_TEXT_MESSAGE':
              console.log("SEND_TEXT_MESSAGE");
              this.outgoingMessage(param,'TEXT_MESSAGE');
            break;

            case 'SEND_TEXT_MESSAGE_STATE':
              console.log("SEND_TEXT_MESSAGE_STATE");
              //this.outgoingMessage(param,'TEXT_MESSAGE_STATE')
            break;

            case 'SEND_INDIVIDUAL_CALL':
              console.log("SEND_INDIVIDUAL_CALL",param);
              this.outgoingCall(param,'INDIVIDUAL_CALL');
            break;

            case 'SEND_INDIVIDUAL_CALL_ACTION':
              console.log("INDIVIDUAL_CALL_ACTION");
              this.callActionFunction(param,'INDIVIDUAL_ACTION')
            break;

            case 'SEND_GROUP_CALL':
              console.log("SEND_INDIVIDUAL_CALL");
              this.outgoingCall(param,'GROUP_CALL');
            break;

            case 'SEND_GROUP_CALL_ACTION':
              console.log("GROUP_CALL_ACTION");
              this.callActionFunction(param,'GROUP_ACTION')
            break;

            case 'ADD_DISCREET_SUBSCRIBER':
            
            break;

            case 'REMOVE_DISCREET_SUBSCRIBER':
            
            break;

            case 'ALARM/ACKNOWLEDGE_STATUS':
            
            break;

            case 'ALARM/IGNORE_STATUS':
            
            break;

            case 'ALARM/SEND_STATUS':
              console.log("SEND_STATUS_MESSAGE");
              this.outgoingMessage(param,'STATUS_MESSAGE');
            break;

            default:
            break;
        }
    }    

    setupRemoteMedia(session){  
      this.remoteAudio.pause(); 
      session.sessionDescriptionHandler.peerConnection.getReceivers().forEach((receiver) => {
        if (receiver.track) {
          this.remoteStream.addTrack(receiver.track);
        }
      });
      this.remoteAudio.load();
      this.remoteAudio.srcObject = this.remoteStream;
      this.remoteAudio.play();        
    }

    cleanupMedia() {
        this.remoteAudio.srcObject = null;
        this.remoteAudio.pause();
    }

    incomingMessageFunction(message){

        if (message.communicationType === 'SDS') {
            switch (message.sdsType) {
              case 'LOCATION':
                /* 
                  'message' object: 
                  {
                    latitude: FLOAT, 
                    longitude: FLOAT,
                    fromId: STRING (id of the subscriber received),
                    toId: STRING (current user),
                    sdsType: "LOCATION",
                    communicationType: "SDS", 
                  }
                */
                if (this.sdsLocationMessageHandler) {
                  this.dispatch ? this.dispatch(this.sdsLocationMessageHandler(message)) : this.sdsLocationMessageHandler(message)
                }
                break
    
              case 'TEXT_MESSAGE':
                /* 
                  'message' object: 
                  {
                    persistentId: String, 
                    message: String, 
                    immediate: Boolean,
                    consumedReportNeeded: Boolean,
                    deliveryReportNeeded: Boolean,
                    fromId: STRING (message sender),
                    toId: STRING (current user),
                    sdsType: "TEXT_MESSAGE",
                    communicationType: "SDS",
                    requestId: STRING
                  }
                */
                if (this.textMessageMessageHandler) {
                  this.dispatch ? this.dispatch(this.textMessageMessageHandler(message)) : this.textMessageMessageHandler(message)
                }
                break
    
              case 'GROUP_TEXT_MESSAGE':
                /* 
                  'message' object: 
                  {
                    message: String, 
                    immediate: Boolean,
                    consumedReportNeeded: Boolean,
                    deliveryReportNeeded: Boolean,
                    groupId: STRING,
                    fromId: STRING (message sender),
                    toId: STRING (current user),
                    sdsType: "TEXT_MESSAGE",
                    communicationType: "SDS", 
                    requestId: STRING
                  }
                */
                if (this.groupTextMessageHandler) {
                  this.dispatch ? this.dispatch(this.groupTextMessageHandler(message)) : this.groupTextMessageHandler(message)
                }
                break
    
              case 'STATUS_MESSAGE':
                /* 
                  'message' object: 
                  {
                    signalingStatusId: Integer, 
                    tetraCode: Long,
                    fromId: STRING (id of the subscriber received),
                    toId: STRING (current user),
                    communicationType: "SDS", 
                    sdsType: "STATUS_MESSAGE"
                  }
                */
                console.log("INDIVIDUAL STATUS MESSAGE received", message)
                if (this.statusMessageHandler) {
                  this.dispatch ? this.dispatch(this.statusMessageHandler(message)) : this.statusMessageHandler(message)
                }
                break
    
              case 'GROUP_STATUS_MESSAGE':
                /* 
                  'message' object: 
                  {
                    signalingStatusId: Integer, 
                    tetraCode: Long,
                    groupId: String,
                    fromId: STRING (id of the subscriber received),
                    toId: STRING (current user),
                    communicationType: "SDS", 
                    sdsType: "STATUS_MESSAGE",
                  }
                */
                console.log("GROUP STATUS MESSAGE received", message)
                if (this.groupStatusMessageHandler) {
                  this.dispatch ? this.dispatch(this.groupStatusMessageHandler(message)) : this.groupStatusMessageHandler(message)
                }
                break
    
              default:
                break
        }
        } else if (message.communicationType === 'STATE_UPDATE') {
            switch (message.sdsType) {
              case 'TEXT_MESSAGE':
                /* 
                  'message' object: 
                  {
                    stateType: STRING (PERSISTED/DELIVERED/CONSUMED), 
                    persistentId: String,
                    fromId: STRING,
                    toId: STRING (current user),
                    sdsType: "TEXT_MESSAGE",
                    communicationType: "STATUS_UPDATE"
                  }
                */
                console.log("INDIVIDUAL MESSAGE received", message)
                if (this.textMessageStateUpdateHandler) {
                  this.dispatch ? this.dispatch(this.textMessageStateUpdateHandler(message)) : this.textMessageStateUpdateHandler(message)
                }
                break
    
              case 'GROUP_TEXT_MESSAGE':
                /* 
                  'message' object: 
                  {
                    stateType: STRING (PERSISTED/DELIVERED/CONSUMED), 
                    persistentId: String,
                    groupId: STRING,
                    fromId: STRING (sender),
                    toId: STRING (current user),
                    sdsType: "GROUP_TEXT_MESSAGE",
                    communicationType: "STATUS_UPDATE"
                  }
                */
                console.log("GROUP MESSAGE received", message)
                if (this.groupTextMessageStateUpdateHandler) {
                  this.dispatch ? this.dispatch(this.groupTextMessageStateUpdateHandler(message)) : this.groupTextMessageStateUpdateHandler(message)
                }
                break
    
              default:
                break
            }
        }

    }

    incomingIndividualCallFunction(call){
        console.log("INDIVIDUAL CALL received", call)
        if (this.individualCallMessageHandler) {
        this.dispatch ? this.dispatch(this.individualCallMessageHandler(call)) : this.individualCallMessageHandler(call)
        }
    }

    incomingGroupCallFunction(call){
        console.log("GROUP CALL received", call)
        if (this.groupCallMessageHandler) {
        this.dispatch ? this.dispatch(this.groupCallMessageHandler(call)) : this.groupCallMessageHandler(call)
        }
    }
    outgoingMessage(data, type){
      if(data.type==='getSubscribers'){
        var json = {
          message:{
            _name:'event',
            _attrs:{type:data.message},
            _content:{
              "origin-mcx-id":this.mcptt_id+'@'+this.mcdxHost // add sip: ???
            }
          }
        }
      }else if(data.type==='getGroups'){
        json ={
          message:{
            _name:'event',
            _attrs:{type:data.message},
            _content:{
              "origin-mcx-id":'sip:'+this.mcptt_id+'@'+this.mcdxHost,
              'mcx-info': 'MCX'
               
            }
          }
        }
      } 
      else
      {
        if(data.groupId){
          var session = 'group-sds'
          var toId = 'sip:'+data.toId;
        }else
        {
          session = 'one-to-one-sds'
          toId = 'sip:'+data.toId+'@'+this.mcdxHost;
        }
        if(type==='TEXT_MESSAGE'){
          var typ='SDS'
        }else
        if(type ==='STATUS_MESSAGE'){
          typ = 'STATUS';
          data.message = data.tetraCode;
        }
        json = {
          message:{
            _name:'event',
            _attrs:{type:'sds'},
            _content:{
              'mcdata-info': {
                'session-type': session,
                'mcdata-request-uri':{mcpttURI:toId}
              },
              'mcdata-signal': {
                'message-id' : data.requestId*this.getFloorPort(),
                'conversation-id': 2*this.getFloorPort()
              },
              'payload':{
                'type': typ,
                'text':data.message
              }
            }
          }
        };
      }
      var xml = toXML(json,{indent:'  '});
      //var message = 'SDS:\n'+xml+'\nData\n'+data.message
      console.log("outgoing message:", xml)
      this.requestPTT(xml);
      ///////////////////////////////TEST FOR STATUS//////////////
      // data.communicationType='SDS';
      // data.tetraCode = 1;
      // data.sdsType= 'STATUS_MESSAGE'
      // data.signalingStatusId = 1;
      // data.toId = this.mcptt_id;
      // this.incomingMessageFunction(data)
      ////////////////////////////////////////////////////////////
    }
    outgoingCall(data, type){

      var sessionType = this.getSessiontype(data.callType);
      var floor_port = this.getFloorPort();
      var sessionHeader = this.getSessionHeader(data.callType)
      this.incoming = false;

      var extra_headers = [
          'X-MCX-Request: '+sessionType+'; sip:'+data.toId+'@'+this.mcdxHost,
          'X-MCX-Floor: UDP=' + floor_port + '; mc_priority = 15'+sessionHeader
      ];
      if(type === 'GROUP_CALL')
      {
        extra_headers[0]= 'X-MCX-Request: '+sessionType+'; sip:'+data.toId;
      }

      switch (data.callType)
      {
        case sipIndividualCallTypes.privateWithoutFloorControl:
          extra_headers = [].concat('X-Answer-Mode: Auto',extra_headers);
          extra_headers.pop();
          break;
        case sipIndividualCallTypes.private:
          break;
        case sipIndividualCallTypes.privateEmergency:
          extra_headers.push('X-MCX-Indication: Emergency; No-Alert; resource_priority = P.8');
          break;
        case sipIndividualCallTypes.ambientListening:
          extra_headers.pop();
          extra_headers = extra_headers.concat('X-MCX-Floor: UDP; mc_granted');
          break;
        case sipGroupCallTypes.prearranged:
          break;
        case sipGroupCallTypes.emergency:
          extra_headers.push('X-MCX-Indication: Emergency; No-Alert; resource_priority = P.8');
          break;
        case sipGroupCallTypes.broadcast:
          extra_headers.push('X-MCX-Indication: Broadcast; No-Alert; resource_priority = P.8');
          break;
        default:
          break;
      }
      console.log(extra_headers);
      var options = {
          extraHeaders: extra_headers,
          sessionDescriptionHandlerOptions: {
              constraints: {
                  audio: true,
                  video: false
              }
          }
      };

      const inviter = new Inviter(this.userAgent, this.mcdxURI, options);
      data.session = inviter;
      data.persistentId = data.requestId;
      if(type === 'GROUP_CALL')
      {
        data.conf = this.getSessiontype(data.callType)+':sip:'+data.groupId;
        console.log("outgoing group call action", data)
        this.dispatch ? this.dispatch(this.groupCallActionMessageHandler(data)) : this.groupCallActionMessageHandler(data);
      }else
      {
        data.conf = this.getSessiontype(data.callType)+':sip:'+data.toId+'@'+this.mcdxHost
        console.log("outgoing individual call action", data)
        this.dispatch ? this.dispatch(this.individualCallActionMessageHandler(data)) : this.individualCallActionMessageHandler(data)
      }
      
     
      inviter.stateChange.addListener((state)=>{
        switch (state) {
          case SessionState.Establishing:
            // Session is establishing.
            break;
          case SessionState.Established:
            //data.stateType = "ANSWER";
            //data.callActionType = ''
            //data.requestId = 0;
            //data.persistentId = data.requestId+1;
            var callData = new CallAction(data,'ANSWER')
            callData.ptt= true;
            if(type === 'GROUP_CALL')
            {
              this.dispatch ? this.dispatch(this.groupCallActionMessageHandler(callData)) : this.groupCallActionMessageHandler(callData);
            }else
            {              
              console.log("outgoing call action", data)
              this.dispatch ? this.dispatch(this.individualCallActionMessageHandler(callData)) : this.individualCallActionMessageHandler(callData)
            }
            this.setupRemoteMedia(inviter);
            // Session has been established.
            break;
          case SessionState.Terminated:

            //data.callActionType = 'DISCONNECTED';
            //data.stateType = "DISCONNECTED";
            //data.persistentId = data.requestId+1;
            callData = new CallAction(data,'DISCONNECTED')
            if(type === 'GROUP_CALL')
            {
              this.dispatch ? this.dispatch(this.groupCallActionMessageHandler(callData)) : this.groupCallActionMessageHandler(callData);
            }else
            {
              console.log("inviter data");
              console.log(data);
              this.dispatch ? this.dispatch(this.individualCallActionMessageHandler(callData)) : this.individualCallActionMessageHandler(callData)
            }
            this.cleanupMedia();
            // Session has terminated.
            break;
          default:
            break;
        }
      });
      inviter.invite();
      //this.session = inviter;
    }
    getFloorPort()
    {
      this.floorPort = Math.floor(Math.random() * (1001)) + 8000;
      return this.floorPort;
    }
    getSessiontype(calltype){
      const obj = sessionTypes.find(el=> el.name === calltype);
      return obj ? obj.sessionType : null;
    }
    getSessionHeader(calltype){
      const obj = sessionTypes.find(el=> el.name === calltype);
      return obj ? obj.extraHeader : null;
    }

    callActionFunction(action,type){
      var conf = '';
      console.log("call action", action);
      switch(action.callActionType)
        {
          case 'DISCONNECTED':
            if(action.session.state===SessionState.Initial){
              action.session.reject();
            }else if(action.session.state===SessionState.Establishing){
              console.log('Terminating call')
              action.session.cancel();
            }else if(action.session.state===SessionState.Established){
              action.session.bye()
            }
            break;

          case 'ANSWER':
            action.session.accept();
          break;

          case 'DECLINE':
            action.session.reject();
            break;

          case 'UNMUTE_SPEAKER':
            break;
          case 'MUTE_SPEAKER':
            break;
          case 'UNMUTE_MIC':
            break;
          case 'MUTE_MIC':
            break;

          case 'RELEASE_PUSH_TO_TALK':
            conf = this.getXml(action.conf,'RELEASE',15);
            this.requestPTT(conf);
            break;

          case 'ACQUIRE_PUSH_TO_TALK':
            conf = this.getXml(action.conf,'REQUEST',15);
            this.requestPTT(conf);
            // if(type==='INDIVIDUAL_ACTION'){
              
            //   // if(action.toId===this.mcptt_id){
            //   //   conf = 'FLOOR REQUEST '+action.conf+'; mc_priority=15;user='+this.mcptt_id+';';
            //   //   this.requestPTT(conf)
            //   // }else{
            //   //   conf = 'FLOOR REQUEST conf='+this.getSessiontype(action.callType)
            //   //   +':sip:'+action.toId+'@'+this.mcdxHost+'; mc_priority=15;user='+this.mcptt_id+';';
            //   //   this.requestPTT(conf)
            //   // }
            // }else
            // if(type==='GROUP_ACTION')
            // {

            //   // if(action.toId===this.mcptt_id){
            //   //   conf = 'FLOOR REQUEST '+action.conf+'; mc_priority=15;user='+this.mcptt_id+';';
            //   //   this.requestPTT(conf);
            //   // }else{
            //   //   conf = 'FLOOR REQUEST conf='+this.getSessiontype(action.callType)
            //   //   +':sip:'+action.toId+'; mc_priority=15;user='+this.mcptt_id+';';
            //   //   this.requestPTT(conf)
            //   // }
            // }
            break;
          default:
            break;
        }
        console.log('conf is',conf);
    }

    getXml(conf,req,priority){
      const json={
        message:{
          _name:'event',
          _attrs:{type:'Floor'},
          _content:{
            'floor-info':{
              state:req,
              conf:conf,
              impu:this.mcptt_id,
              'mc-priority': priority
            }
          }
        }
      }
      var object = toXML(json,{indent: '  '});
      console.log('outgoing floor message: ',object);
      return object;
    }
    
    requestPTT(conf){
      const messager = new Messager(this.userAgent,this.mcdxURI,conf);
      var result = messager.message();
      if(result){

      }
    }

    getCallInfo(message,eHeader)
    {
      const callData= {};
      var calltype = message.substring(message.search('call_type=')+10,message.search(';'));
      if(message.includes('conf=')){
        var conf = message.substring(message.search("conf="));
        conf = conf.substring(conf.search('=')+1,conf.search(';'));
      }else{
        conf=''
      }
      var caller = message.substring(message.search('calling_user'));
      caller = caller.substring(caller.search('=')+1);
      callData.fromId = caller;
      callData.conf=conf;
      callData.toId = this.mcptt_id;
      callData.callPriority = 1;
      callData.messageSource=  'MCX_Server';
      callData.communicationType= 'call';
      //callData.callActionType='UNANSWERED';
      callData.stateType='PERSISTED';
      if(message.includes('calling_group')){
        var callingGroup = message.substring(message.search('calling_group'));
        callingGroup = callingGroup.substring(callingGroup.search(':')+1,callingGroup.search(';'))
        callData.groupId = callingGroup;
        if(calltype ==="prearranged"){
          if(eHeader.includes('Broadcast'))
          {
            callData.callType = sipGroupCallTypes.broadcast;
          }else
          if(eHeader.includes('Emergency')){
            callData.callType= sipGroupCallTypes.emergency;
          }else{
            callData.callType = sipGroupCallTypes.prearranged;
          }
        }
      }else{
        callData.callingGroup='';
        if(calltype==='private')
        {
          if(eHeader.includes("Emergency;true")){
            callData.callType=sipIndividualCallTypes.privateEmergency;
          }else{
            if(conf!==''){
              callData.callType=sipIndividualCallTypes.private;
            }else{
              callData.callType=sipIndividualCallTypes.privateWithoutFloorControl;
            }
          }          
        }else
        if(calltype==='ambient-listening'){
          callData.callType=sipIndividualCallTypes.ambientListening;
        }
      }      
      return callData;
    }
}