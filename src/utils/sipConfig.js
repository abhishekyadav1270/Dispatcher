//import {UserAgent} from 'sip.js'
import { host, wsPort, wssPort } from '../constants/endpoints';
//export const sipPrivateId = 'mcx.test-666.iitb'; //test 50, iitb/82
//const sipPublicId = '010105006660820';
// export const host = '192.168.1.50';
// const wsPort = '5060'
//export const impu = sipPrivateId+'@'+host;
//export const impi = sipPublicId+'@'+host;

//export const mcURI = UserAgent.makeURI("sip:mcdx@"+host);

// const uri = UserAgent.makeURI("sip:"+impu);
// if (!uri) {
//   throw new Error("Failed to create URI");
// }

// export const sipConfig= {
//     wsServer: "ws://"+host+':'+wsPort,
//     //uri: "sip:"+impu,
//     uri,
//     authorizationUsername: impi,
//     authorizationPassword: "12345678",
//     displayName: impu,
//     traceSIP: true,
//     contactName: impu,
//     hackIpInContact: host,
//     userAgentString: 'MClabs Dispatcher Client',
//     transportOptions: {
//         wsServers: "ws://"+host+':'+wsPort,
//     },
//     register: true
// }

export const sipConfig = (mcptt_id)=>{
    return{
        wsServer:"ws://"+host+':'+wssPort,
       // uri:  UserAgent.makeURI("sip:"+mcptt_id+'@'+host),
        authorizationUsername: "010105006660820@"+host,  //getSipPublicId(mcptt_id)+'@'+host,
        authorizationPassword:  "12345678",
        displayName: mcptt_id+'@'+host,
        traceSIP: true,
        contactName: mcptt_id+'@'+host,
        hackIpInContact: "consort.mcx",
        userAgentString: 'MClabs Dispatcher Client',
        transportOptions: {
            wsServers: "ws://"+host+':'+wssPort,
        },
        register: true
    }
}

const getSipPublicId = (mcptt_id)=>{
    let id = mcptt_id.toString().substring(9,12); //mcx.test-555.iitb
    console.log('id=',id);
    let pubId='0101'
    let var1 = mcptt_id.toString().substring(4,8);
    let var2 = mcptt_id.toString().substring(13);
    console.log("Var1=",var1);
    console.log("Var2=",var2)
    switch(var1)
    {
        case 'iitb': 
            pubId = pubId.concat('0820');
        break;
        case 'test': 
            pubId = pubId.concat('0500');
        break;
        case 'cons': 
            pubId = pubId.concat('0470');
        break;
        case 'mcla': 
            pubId = pubId.concat('0260');
        break;
        case 'mumm': 
            pubId = pubId.concat('0120');
        break;
        case 'nagm': 
            pubId = pubId.concat('0020');
        break;
        default:
        break;
    }
    pubId = pubId.concat(id);

    switch(var2)
    {
        case 'iitb': 
            pubId = pubId.concat('0820');
        break;
        case 'test': 
            pubId = pubId.concat('0500');
        break;
        case 'cons': 
            pubId = pubId.concat('0470');
        break;
        case 'mcla': 
            pubId = pubId.concat('0260');
        break;
        case 'mumm': 
            pubId = pubId.concat('0120');
        break;
        case 'nagm': 
            pubId = pubId.concat('0020');
        break;
        default:
        break;
    }
    console.log("pubId=",pubId)
    return pubId; //010105006660820
}

export const sipGroupCallTypes ={
    // prearranged:'PREARRANGED_GROUP_CALL',
    // chat:'CHAT_GROUP_CALL',
    // emergency:'EMERGENCY_GROUP_CALL',
    groupCall:'SIMPLEX_GROUP_CALL',
    broadcast:'SIMPLEX_BROADCAST_GROUP_CALL'
}

export const sipIndividualCallTypes = {
    // private:'PRIVATE_CALL_WITH_FLOOR_CONTROL',
    // privateWithoutFloorControl:'PRIVATE_CALL_WITHOUT_FLOOR_CONTROL',
    ambientListening:'AMBIENT_LISTENING_CALL',
    // privateEmergency:'PRIVATE_EMERGENCY_CALL',
    hookCall:'SIMPLEX_INDIVIDUAL_HOOK_CALL',
    directCall:'SIMPLEX_INDIVIDUAL_DIRECT_CALL',
    duplex:'DUPLEX_INDIVIDUAL_CALL'
}

export const sessionTypes = [
    {   name: sipGroupCallTypes.prearranged, 
        sessionType:'prearranged', 
        extraHeader:'; mc_implicit; mc_queueing'
    },
    {   name: sipGroupCallTypes.chat, 
        sessionType:'chat', 
        extraHeader:'; mc_queueing'
    },
    {
        name: sipGroupCallTypes.emergency, 
        sessionType:'prearranged', 
        extraHeader:'; mc_implicit; mc_queueing'
    },
    {
        name: sipGroupCallTypes.broadcast, 
        sessionType:'prearranged', 
        extraHeader:'; mc_implicit; mc_queueing'
    },
    {
        name: sipIndividualCallTypes.private, 
        sessionType:'private',
        extraHeader:'; mc_implicit; mc_queueing'
    },
    {
        name: sipIndividualCallTypes.privateWithoutFloorControl, 
        sessionType:'private', 
        extraHeader:'; mc_implicit; mc_queueing'},
    {
        name: sipIndividualCallTypes.ambientListening, 
        sessionType:'ambient-remote', 
        extraHeader:'; mc_implicit; mc_queueing'
    },
    {
        name: sipIndividualCallTypes.privateEmergency, 
        sessionType:'private', 
        extraHeader:'; mc_implicit; mc_queueing'
    }
]







//export default userAgent;

