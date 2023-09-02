/**
 *  Constants
 */
const axios = require('axios').default;
const https = require('https-browserify');
export const axiosHttps = axios.create({
  httpsAgent: new https.Agent({
    rejectUnauthorized: false
  })
})

export const GOOGLE_MAPS_AP_KEY = "AIzaSyD29BpQCieiwzvTPbK3uUONrIuwdAY9Yto"
export const tisMaster = "81201"

export const onprocessCallState = ['PERSISTED', 'WAITING', 'TRYING', 'RINGING'];
export const completedCallState = ['COMPLETED', 'DISCONNECTED', 'RECENT', 'CALL_FAILURE', 'REJECTED', 'MEDIA_FAILED'];

export const supportedPatchCallType = ['DUPLEX_INDIVIDUAL_CALL', 'SIMPLEX_INDIVIDUAL_DIRECT_CALL', 'SIMPLEX_INDIVIDUAL_HOOK_CALL'];
export const supportedMergeCallType = ['DUPLEX_INDIVIDUAL_CALL'];
export const supportedMasterPTT = ['SIMPLEX_GROUP_CALL'];

export const MESSAGES = {
  authenticationError: "Authentication Failed!",
  defaultError: "Something went wrong!",
  noResults: "Sorry, we couldn't find any results!",
  validationError: "Validation errors occurred. Please confirm the fields and save it again."
}

export const initialCallState = {
  hold: false,
  mic: true,
  speaker: true,
  ptt: false,
  disconnectDis: false,
  holdDis: false,
  micDis: false,
  speakerDis: false,
  pttDis: false,
  pttReq: false,
  highlight: true,
  isPatchTick: false,
  isMergeTick: false
}

export const TIMEOUTS = {
  alert: 3500
}

export const MAP_DEFAULTS = {
  latitude: 21.1458,
  longitude: 79.0882,
  zoom: 15
}

export const COLORS = [
  'royalblue',
  'darkkhaki',
  'green',
  'deepskyblue',
  'mediumturquoise',
  'olivedrab',
  'darkslategray'
]

export const resolvePriority = {
  'EMERGENCY': 15,
  'HIGH': 14, //12
  'HELPPOINT': 12,
  'MEDIUM': 11, //6
  'LOW': 5 //1
}

export const decodeCallPriority = (val) =>{ 
  let valInt = parseInt(val)
  if (valInt >= 0 && valInt < 6) { // 0 - 5
    return 'LOW'
  } else if (valInt >= 6 && valInt < 12) { // 6 - 11
    return 'MEDIUM'
  } else if (valInt >= 12 && valInt < 14) { // 12 - 13
    return 'HIGH'
  } else if (valInt == 14) { // 14
    return 'RTT'
  } else {
    return 'EMERGENCY' // 15
  }
}

export const testAudio = 'https://www.kozco.com/tech/WAV-MP3.wav'
export const ringtoneAudio = '/audio/ringtone.mp3'
export const dialAudio = '/audio/dialing_tone.mp3'
export const callConnect = '/audio/newMessageTone.mp3'
export const callEnd = '/audio/newMessageTone.mp3'
export const pttRelease = '/audio/newMessageTone.mp3'
export const pttAcquire = '/audio/newMessageTone.mp3'
//SDS
export const newMsgBeep = '/audio/newMessageTone.mp3'
export const newAlertBeep = '/audio/newMessageTone.mp3'
export const emgCall = '/audio/emgCall.mp3'

export const subscriberApiAlias = {
  'APPLICATION': 'applicationSubscriber',
  'GROUP': 'groupSubscriber',
  'EMERGENCY': 'emergencySubscriber',
  'TERMINAL': 'terminalSubscriber',
  'DIALIN': 'dialInSubscriber',
  'MOBILE': 'mobileSubscriber',
  'UNIFIED': 'unifiedSubscriber'
}

export const subscriberStatus = {
  'REGISTERED': '3'
}

// export const subscriberType = {
//   'GROUP':'Group',
//   'INDIVIDUAL':'Individual',
//   'MOBILE':'TRCP',
//   'UNIFIED':'Unified',
//   'APPLICATION':'Dispatcher',
//   'TERMINAL':'Terminal'
// }
export const subscriberType = {
  'GROUP': 'GROUP',
  'INDIVIDUAL': 'INDIVIDUAL',
  'MOBILE': 'MOBILE',
  'UNIFIED': 'UNIFIED',
  'APPLICATION': 'APPLICATION',
  'TERMINAL': 'TERMINAL',
  'Dispatcher': 'Dispatcher'
}

export const domain = {
  'MCX': 'MCX',
  'Tetra': 'Tetra'
}

export const SdsStatus = [
  /*
   { code: '65280', desc: 'RM ON', priority: '1' },
   { code: '65281', desc: 'RM OFF', priority: '1' },
   { code: '65282', desc: 'DL CUT OUT OP', priority: '1' },
   { code: '65283', desc: 'DL CUT OUT NOT OP', priority: '1' },
   { code: '65284', desc: 'DM STATUS OP', priority: '1' },
   { code: '65285', desc: 'DM STATUS NOT OP', priority: '1' },
   { code: '65286', desc: 'EB STATUS OP', priority: '1' },
   { code: '65287', desc: 'EB STATUS NOT OP', priority: '1' },
   { code: '65288', desc: 'SAF CUT OUT OP', priority: '1' },
   { code: '65289', desc: 'SAF CUT OUT NOT OP', priority: '1' },
   { code: '65290', desc: 'PEA ALARM AC', priority: '1' },
   { code: '65291', desc: 'PEA ALARM NOT AC', priority: '1' },
   { code: '65292', desc: 'EB LOOP CUT OUT OP', priority: '1' },
   { code: '65293', desc: 'EB LOOP CUT OUT NOT OP', priority: '1' },
   { code: '65294', desc: 'RAKE ID VALID', priority: '1' },
   { code: '65295', desc: 'RAKE ID NOT VALID', priority: '1' },
   { code: '0', desc: 'EMERGENCY',  priority: '0'}, 
   */

  // Mumbai
  /*{ code: '65280', desc: 'PEC Alarm ac', priority: '0' },
  { code: '65281', desc: 'PEC Alarm not ac', priority: '0' },
  { code: '65282', desc: 'EB Appl', priority: '0' },
  { code: '65283', desc: 'EB not Appl', priority: '0' },
  { code: '65284', desc: 'Dead man sts op', priority: '0' },
  { code: '65285', desc: 'Dead man sts not op', priority: '0' },
  { code: '65286', desc: 'Safety cut_out op', priority: '0' },
  { code: '65287', desc: 'Safety cut out not op', priority: '0' },
  { code: '65288', desc: 'Detr door Not closed', priority: '1' },
  { code: '65289', desc: 'Detr door closed', priority: '1' },
  { code: '65290', desc: 'Detr door cover broken', priority: '1' },
  { code: '65291', desc: 'Detr door cover not broken', priority: '1' },
  { code: '65292', desc: 'Drive cons cvr', priority: '1' },
  { code: '65293', desc: 'Drive cons cvr not op', priority: '1' },
  { code: '65294', desc: 'Active cab status', priority: '1' },
  { code: '65295', desc: 'Active cab status not op', priority: '1' },
  { code: '65296', desc: 'Internal fire smoke', priority: '0' },
  { code: '65297', desc: 'Internal fire smoke not det', priority: '0' },
  { code: '65298', desc: 'External fire smoke', priority: '1' },
  { code: '65299', desc: 'External fire smoke not det', priority: '1' },
  { code: '65300', desc: 'Odd activation', priority: '1' },
  { code: '65301', desc: 'Odd activation not op', priority: '1' },
  { code: '65302', desc: 'Rail fracture', priority: '1' },
  { code: '65303', desc: 'Rail fracture not det', priority: '1' },
  { code: '65304', desc: 'Train parting', priority: '1' },
  { code: '65305', desc: 'Train parting not detected', priority: '1' },
  
  //new changes
  { code: '65306', desc: 'TCMS Link UP', priority: '1' },
  { code: '65307', desc: 'TCMS Link Fail', priority: '1' },
  { code: '65308', desc: 'PA Link UP', priority: '1' },
  { code: '65309', desc: 'PA Link Fail', priority: '1' },
  { code: '65310', desc: 'RMF Mode On', priority: '1' },
  { code: '65311', desc: 'RMR Mode On', priority: '1' },
  { code: '65312', desc: 'RM Mode Off', priority: '1' },*/
  { code: '0', desc: 'EMERGENCY',  priority: '0'},
  
]

export const otherStatus = [
  /*{ code: '33001', desc: "On Duty", priority: '1' },
  { code: '33002', desc: "On Patrol", priority: '1' },
  { code: '33003', desc: "On Standby", priority: '1' },
  { code: '33004', desc: "Call Back Request", priority: '1' },
  { code: '33005', desc: "Status", priority: '1' },
  { code: '33006', desc: "Refreshment", priority: '1' },
  { code: '33007', desc: "Enroute", priority: '1' },
  { code: '33008', desc: "Unavailable", priority: '1' },
  { code: '33009', desc: "At Scene", priority: '1' },
  { code: '33010', desc: "Received", priority: '1' },
  { code: '33011', desc: "Off Duty", priority: '1' },
  { code: '33012', desc: "Start Mission", priority: '1' },
  { code: '33013', desc: "Stop Mission", priority: '1' },
  { code: '33014', desc: "Urgent Call", priority: '1' },

  { code: '33050', desc: "Test", priority: '1' },
  { code: '33051', desc: "Authentication / Start of Run", priority: '1' },
  { code: '33052', desc: "Running Late", priority: '1' },
  { code: '33053', desc: "Running Early", priority: '1' },
  { code: '33054', desc: "Trouble on Run", priority: '1' },
  { code: '33055', desc: "End of Run", priority: '1' },

  { code: '65024', desc: "ACK", priority: '1' },
  { code: '65025', desc: "General negative acknowledgement", priority: '1' },
  { code: '65026', desc: "Not Authorised", priority: '1' },
  { code: '65027', desc: "Unrecognised address", priority: '1' },
  { code: '65028', desc: "Destination does not exist", priority: '1' },
  { code: '65029', desc: "Destination not reachable", priority: '1' },
  { code: '65030', desc: "Destination not authorized", priority: '1' },
  { code: '65031', desc: "Destination busy", priority: '1' },*/



  { code: '33001', desc: "On Duty", priority: '1' },
  { code: '33002', desc: "On Patrol", priority: '1' },
  { code: '33003', desc: "On Standby", priority: '1' },
  { code: '33004', desc: "Call Back Request", priority: '1' },
  { code: '33005', desc: "Status", priority: '1' },
  { code: '33006', desc: "Refreshment", priority: '1' },
  { code: '33007', desc: "Enroute", priority: '1' },
  { code: '33008', desc: "Unavailable", priority: '1' },
  { code: '33009', desc: "At Scope", priority: '1' },
  { code: '33010', desc: "Received", priority: '1' },
  { code: '33011', desc: "Off Duty", priority: '1' },
  { code: '33012', desc: "Start Mission", priority: '1' },
  { code: '33013', desc: "Stop Mission", priority: '1' },
  { code: '33014', desc: "Urgent Call", priority: '1' },

  { code: '33050', desc: "Test", priority: '1' },
  { code: '33051', desc: "Authentication / Start of Run", priority: '1' },
  { code: '33052', desc: "Running Late", priority: '1' },
  { code: '33053', desc: "Running Early", priority: '1' },
  { code: '33054', desc: "Trouble on Train", priority: '1' },
  { code: '33055', desc: "End of Run", priority: '1' },

  { code: '65024', desc: "ACK", priority: '1' },
  { code: '65025', desc: "General negative acknowledgement", priority: '1' },
  { code: '65026', desc: "Not Authorised", priority: '1' },
  { code: '65027', desc: "Unrecognised address", priority: '1' },
  { code: '65028', desc: "Destination does not exist", priority: '1' },
  { code: '65029', desc: "Destination not reachable", priority: '1' },
  { code: '65030', desc: "Destination not authorized", priority: '1' },
  { code: '65031', desc: "Destination busy", priority: '1' },
]
//section 7.A, 
export const paAlerts = [
  //Mumbai
  /*{ code: "64211", desc: "CLEAN" , priority: '1'},
  { code: "64212", desc: "VACATE" , priority: '1'},
  { code: "64213", desc: "CARD" , priority: '1'},
  { code: "64214", desc: "ATTN 1" , priority: '1'},
  { code: "64215", desc: "ATTN 2" , priority: '1'},
  { code: "64216", desc: "ATTN 3" , priority: '1'},
  { code: "64217", desc: "LIABLE" , priority: '1'},
  { code: "64218", desc: "KEEP LEFT " , priority: '1'},
  { code: "64219", desc: "SOCKET" , priority: '1'},
  { code: "64220", desc: "CCTV" , priority: '1'},
  { code: "64221", desc: "CENTRE" , priority: '1'},
  { code: "64222", desc: "MUSIC" , priority: '1'},
  { code: "64223", desc: "SMOKING" , priority: '1'},
  { code: "64224", desc: "FIRST" , priority: '1'},
  { code: "64225", desc: "SECURITY" , priority: '1'},
  { code: "64226", desc: "LINE", priority: '1' },
  { code: "64227", desc: "LADY SEAT", priority: '1' },
  { code: "64228", desc: "DOOR" , priority: '1'},
  { code: "64229", desc: "KEEP AWAY", priority: '1' },
  { code: "64230", desc: "FLOOR" , priority: '1'},
  { code: "64231", desc: "THIEF" , priority: '1'},
  { code: "64232", desc: "SPIT" , priority: '1'},
  { code: "64233", desc: "GUM" , priority: '1'},
  { code: "64234", desc: "LEAN ON" , priority: '1'},
  { code: "64235", desc: "SKIP" , priority: '1'},
  { code: "64236", desc: "DEPOT" , priority: '1'},
  { code: "64237", desc: "WELCOME 1" , priority: '1'},
  { code: "64238", desc: "WELCOME 2", priority: '1' },
  { code: "64239", desc: "CLOSE", priority: '1' },
  { code: "64240", desc: "FAILED" , priority: '1'},
  { code: "64241", desc: "LISTEN", priority: '1' },
  { code: "64242", desc: "CLOSED" , priority: '1'},
  { code: "64243", desc: "FEEDER" , priority: '1'},
  { code: "64244", desc: "HOLD" , priority: '1'},
  { code: "64245", desc: "END TRIP" , priority: '1'},
  { code: "64246", desc: "2 MIN" , priority: '1'},
  { code: "64247", desc: "FAIL DR" , priority: '1'},
  { code: "64248", desc: "SHORT LOOP" , priority: '1'},

  //Emergency Code(20) 64311- 64410

  { code: "64311", desc: "STAND 2" , priority: '1'},
  { code: "64312", desc: "MIND GAP" , priority: '1'},
  { code: "64313", desc: "RUBBISH" , priority: '1'},
  { code: "64314", desc: "DELAY 1" , priority: '1'},
  { code: "64315", desc: "DELAY 2" , priority: '1'},
  { code: "64316", desc: "DELAY 3" , priority: '1'},
  { code: "64317", desc: "SLOW" , priority: '1'},
  { code: "64318", desc: "DELAY 4 " , priority: '1'},
  { code: "64319", desc: "AHEAD" , priority: '1'},
  { code: "64320", desc: "SUPPLY" , priority: '1'},
  { code: "64321", desc: "PUSH" , priority: '1'},
  { code: "64322", desc: "RESCUE" , priority: '1'},
  { code: "64323", desc: "FRONT" , priority: '1'},
  { code: "64324", desc: "REAR" , priority: '1'},
  { code: "64325", desc: "EXIT" , priority: '1'},
  { code: "64326", desc: "STATION", priority: '1' },
  { code: "64327", desc: "CHANGE", priority: '1' },
  { code: "64328", desc: "DUSTBIN" , priority: '1'},
  { code: "64329", desc: "OOS", priority: '1' },
  { code: "64330", desc: "EVAC" , priority: '1'},

  //pre recorded code(5) 64411 -64415

  { code: "64411", desc: "OUT OF SERVICE" , priority: '1'},
  { code: "64412", desc: "STATIONARY" , priority: '1'},
  { code: "64413", desc: "EVACUATION" , priority: '1'},
  { code: "64414", desc: "FIRE" , priority: '1'},
  { code: "64415", desc: "START AGAIN" , priority: '1'},*/


  //Dhaka
  { code: "64211", desc: "Out Of Service - Change to Next Train" , priority: '1'},
  { code: "64212", desc: "Skip - Not Stop at Next Station" , priority: '1'},
  { code: "64213", desc: "Depot - Train Going to Depot" , priority: '1'},
  { code: "64214", desc: "Closed - Train Doors not Open at Next Station" , priority: '1'},
  { code: "64215", desc: "Failed - Apologies not stopped at previous station" , priority: '1'},
  { code: "64216", desc: "Delay 1 - Short Delay" , priority: '1'},
  { code: "64217", desc: "Delay 2 - Ongoing Delay" , priority: '1'},
  { code: "64218", desc: "Delay 3 - Short Delay before Door Opening " , priority: '1'},
  { code: "64219", desc: "Delay 4 - Due to Slow Speed of Train" , priority: '1'},
  { code: "64220", desc: "Delay 5 - Due to Technical Reasons" , priority: '1'},
  { code: "64221", desc: "Delay 6 - Technical Problem in Train Ahead" , priority: '1'},
  { code: "64222", desc: "End Trip - Terminating at Next Station" , priority: '1'},
  { code: "64223", desc: "Clean - Help to keep Train n Stations Clean" , priority: '1'},
  { code: "64224", desc: "Priority seat - for Sr Citizen Ladies Physically Challenged" , priority: '1'},
  { code: "64225", desc: "Unattended - Do not Touch" , priority: '1'},
  { code: "64226", desc: "Check seat - unattended suspicious", priority: '1' },
  { code: "64227", desc: "Do not Music - inside the train", priority: '1' },
  { code: "64228", desc: "No Smoking" , priority: '1'},
  { code: "64229", desc: "Make Line - while boarding de-boarding ", priority: '1' },
  { code: "64230", desc: "Door - not to obstruct closing" , priority: '1'},
  { code: "64231", desc: "Keep away - stand away from the door" , priority: '1'},
  { code: "64232", desc: "Floor - not sit on the floor" , priority: '1'},
  { code: "64233", desc: "Thief - Beware of Pick-Pockets" , priority: '1'},
  { code: "64234", desc: "Spit - Do not Spit in Train Station" , priority: '1'},
  { code: "64235", desc: "Gum - Do not Spit Chew Gum Tobacco" , priority: '1'},
  { code: "64236", desc: "Lean On - Do not Lean on Doors" , priority: '1'},
  { code: "64237", desc: "Welcome 1 - to Dhaka Metro" , priority: '1'},
  { code: "64238", desc: "Welcome 2 - Dhaka Metro Welcomes you", priority: '1' },
  { code: "64239", desc: "Stand - Stand away from the Doors", priority: '1' },
  { code: "64240", desc: "Mind Gap - Between the Train and Platform" , priority: '1'},
  { code: "64241", desc: "Rubbish - Keep Environment Tidy Use Dustbin", priority: '1' },

  //Emergency Code(20) 64311- 64410

  { code: "64311", desc: "Push - This Train push the Train ahead" , priority: '1'},
  { code: "64312", desc: "Rescue - Another Train push this train to next station" , priority: '1'},
  { code: "64313", desc: "Front - Evacuate from Front" , priority: '1'},
  { code: "64314", desc: "Rear - Evacuate from Rear" , priority: '1'},
  { code: "64315", desc: "Exit - Evacuate from the Doors" , priority: '1'},
  { code: "64316", desc: "Change - Evaculate this train Change to next Train" , priority: '1'},
]

//STATUS OPTIONS
export const sdsTypes = [
  { text: "Status", value: "Status Alerts" },
  // { text: "Predefined", value: "Predefined Alerts" },
  { text: "Text", value: "Custom" },
]

export const statusOption = [
  { text: "Other", value: "Other", iconClass: 'feather icon-alert-triangle m-r-8' },
  { text: "PA", value: "PA Anouncement", iconClass: 'la la-bullhorn' },
]

export const priorityOptions = [
  { text: 'Low', value: 'LOW' },
  { text: 'Med', value: 'MEDIUM' },
  { text: 'High', value: 'HIGH' },
  { text: 'Emergency', value: 'EMERGENCY' },
]

export const mpttOptions = [
  { text: 'None', value: '' },
  { text: 'F1', value: 'F1' },
  { text: 'F2', value: 'F2' },
  { text: 'F3', value: 'F3' },
  { text: 'F4', value: 'F4' },
  { text: 'F5', value: 'F5' },
  { text: 'F6', value: 'F6' },
  { text: 'F7', value: 'F7' },
  { text: 'F8', value: 'F8' },
  { text: 'F9', value: 'F9' },
  { text: 'F10', value: 'F10' },
  { text: 'F11', value: 'F11' },
  { text: 'F12', value: 'F12' },
  { text: 'F13', value: 'F13' },
  { text: 'F14', value: 'F14' },
  { text: 'F15', value: 'F15' },
  { text: 'F16', value: 'F16' },
  { text: 'F17', value: 'F17' },
  { text: 'F18', value: 'F18' },
  { text: 'F19', value: 'F19' },
  { text: 'F20', value: 'F20' },
  { text: 'F21', value: 'F13' },
  { text: 'F22', value: 'F22' },
  { text: 'F23', value: 'F23' },
  { text: 'F24', value: 'F24' },
]

// export const systemDGID=[
//   {line:"NS",ids:["1000024","1000026","1000020"]},
//   {line:"EW",ids:["1000025","1000027","1000020"]}
// ]

export const systemDGID = process.env.REACT_APP_SYSTEM_DGNA
export const network_config = process.env.REACT_APP_NETWORK.toUpperCase()
export const PROJECT = process.env.REACT_APP_PROJECT.toLowerCase()
export const pbxDomainConfig = process.env.REACT_APP_PBX_DOMAIN
export const DISPACTHER_MODE = process.env.REACT_APP_DISPACTHER_MODE.toUpperCase() ? process.env.REACT_APP_DISPACTHER_MODE.toUpperCase() : 'TETRA';


export const trainMapConfig = [
  {
    minlteCount: 0,
    maxlteCount: 100,
    lteSize: 5, //LTE size
    lteGap: 5,  //LTE gap between 2 LTE in same trackcircuit
    singleLTE: 15,  //Single LTE size with gap
    trackCtGap: 2,  //Gap between track circuit
    startGap: 80,  //initial gap before LTE plotting starts
    endGap: 80,  //end gap after LTE plotting ends
  },
  //100 - 132 LTE's
  {
    minlteCount: 101,
    maxlteCount: 132,
    lteSize: 5,
    lteGap: 3.8,
    singleLTE: 12.6,
    trackCtGap: 1,
    startGap: 50,
    endGap: 20,
  },
  //LTE 132 - 150
  {
    minlteCount: 133,
    maxlteCount: 150,
    lteSize: 5,
    lteGap: 3,
    singleLTE: 11,
    trackCtGap: 1,
    startGap: 50,
    endGap: 20,
  },
  //LTE 150 - 200
  {
    minlteCount: 151,
    maxlteCount: 200,
    lteSize: 5,
    lteGap: 1.75,
    singleLTE: 8.5,
    trackCtGap: 1,
    startGap: 50,
    endGap: 20,
  },
  //LTE 200 - 250
  {
    minlteCount: 201,
    maxlteCount: 250,
    lteSize: 4,
    lteGap: 1.5,
    singleLTE: 7,
    trackCtGap: 1,
    startGap: 50,
    endGap: 20,
  },
  //LTE 250 - 300
  {
    minlteCount: 251,
    maxlteCount: 300,
    lteSize: 4,
    lteGap: 1,
    singleLTE: 6,
    trackCtGap: 1,
    startGap: 50,
    endGap: 20,
  }
]
export const iwf_type = [
  { text: "Terta Intergration Server", value: "TIS" },
  { text: "Terminal Gateway", value: "TERM" },
  { text: "Extended-Terminal Gateway", value: "EX_TERM" },
];

export const DISPACTHER_MODES = {
  MCX: "MCX",
  TETRA: "TETRA"
}