/**
 *  Endpoints
 */

export let host = ""
export let mcxHost = ""
host = process.env.REACT_APP_HOST;
if (process.env.NODE_ENV === 'development') {
  // host = "192.168.1.50";
  host = process.env.REACT_APP_HOST;
  mcxHost = process.env.REACT_APP_MCX_HOST
}
if (process.env.NODE_ENV === 'production') {
  host = process.env.REACT_APP_HOST;
  mcxHost = process.env.REACT_APP_MCX_HOST
}
export const defaultPort = "30809"
export const dispatcherServerPort = "30301"

export const cmsPort = "30555"


export const wsPort = "30506"
export const wssPort = "30043"
export const mysqlPath = "service/base/mysql"
export const systemPath = "service/base/system"
export const wsPath = "client/dispatcher"
export const authPath = "service/signaling/utility"

export const BaseURLDispatcher = `https://${host}:${dispatcherServerPort}`;
export const websocketURL =  `https://${host}:30809` //`https://${host}:5060`

export const endpoints = {
  healthCheck:              `https://${host}:${wsPort}/${systemPath}/health`,
  sdsLocation:              `http://${host}:${defaultPort}/${mysqlPath}/sdsLocation`,
  snailTrail:               `http://${host}:${defaultPort}/${mysqlPath}/snailTrail`,
  fence:                    `http://${host}:${defaultPort}/${mysqlPath}/geoFence`,
  geoFenceActivity:         `http://${host}:${defaultPort}/${mysqlPath}/geoFenceActivity`,
  discreetCall:             `http://${host}:${defaultPort}/${mysqlPath}/discreetCall`,
  authenticate:             `http://${host}:${defaultPort}/${authPath}/authenticate`,
  user:                     `http://${host}:${defaultPort}/${mysqlPath}/user`,
  role:                     `http://${host}:${defaultPort}/${mysqlPath}/role`,
  access:                   `http://${host}:${defaultPort}/${mysqlPath}/access`,
  subscribers:              `http://${host}:${defaultPort}/${authPath}/getSubscribers`,
  subscriber:               `http://${host}:${defaultPort}/${mysqlPath}`,
  property:                 `http://${host}:${defaultPort}/${mysqlPath}/property`,
  statusMessage:            `http://${host}:${defaultPort}/${mysqlPath}/statusType`,
  globalCustomMessageText:  `http://${host}:${defaultPort}/${mysqlPath}/globalCustomMessageText`,
  userCustomMessageText:    `http://${host}:${defaultPort}/${mysqlPath}/userCustomMessageText`,
  //*****RIS
  currentpositions:         `https://${host}:${defaultPort}/currentpositions`,
  trainmap:                 `https://${host}:${defaultPort}/trainmap`,
  getAllLocs:               `https://${host}:${defaultPort}/GetLOCs`,
  currentLA:                `https://${host}:${defaultPort}/currentLA`,
  updateLA:                 `https://${host}:${defaultPort}/updateLA`,
  getAllBaseStations:       `https://${host}:${defaultPort}/basestation`,
  getGrabbedLines:          `https://${host}:${defaultPort}/controllerInfo`,
  trainInfo:                `http://${host}:${defaultPort}/${mysqlPath}/trainInfo`,
  cacheReload:              `http://${host}:${defaultPort}/${mysqlPath}/reloadCache`,
  getAlertAllList:          `https://${host}:${defaultPort}/getAllAlertList`,
  getAlertTypes:            `https://${host}:${defaultPort}/getAlertTypes`,
  updateAlert:              `https://${host}:${defaultPort}/updateAlert`,
  addAlert:                 `https://${host}:${defaultPort}/addAlert`,
  deleteAlertByCode:        `https://${host}:${defaultPort}/deleteAlertByCode`,
  //*****Dispatcher Server
  favContacts:              `${BaseURLDispatcher}/contactlists/`,
  addFav:                   `${BaseURLDispatcher}/addtofav/`,
  //sdsTextMessage:           `${BaseURLDispatcher}/sdsTextMessage/`,
  sdsGroupMessage:          `${BaseURLDispatcher}/sdsGroupMessage/`,
  sdsAlerts:                `${BaseURLDispatcher}/sdsAlerts/`,
  sdsGroupAlerts:           `${BaseURLDispatcher}/getGroupAlerts/`,
  pinAlert:                 `${BaseURLDispatcher}/pinAlert/`,
  individualCall:           `${BaseURLDispatcher}/individualCall/`,
  groupCall:                `${BaseURLDispatcher}/groupCall/`,
  calls:                     `${BaseURLDispatcher}/calls/`,
  conn:                     `${BaseURLDispatcher}/connectionStatus/`,
  // PAGINATION
  logs:                     `${BaseURLDispatcher}/getAllLogs/`,
  alertLogs:                `${BaseURLDispatcher}/getAlerts/`,
  sdsLogs:                  `${BaseURLDispatcher}/getSdsMessages/`,
  remoteLog:                `${BaseURLDispatcher}/log/`,
  //LIST
  userLists:                `${BaseURLDispatcher}/lists/`,
  //DGNA
  dgna:                     `${BaseURLDispatcher}/dgna/`,

  //POI

  // getPOI:                 `https://${host}:${defaultPort}/POI`,
  getObject:                 `https://${host}:${defaultPort}/getObject`,

  getPOI:                 `https://${host}:${defaultPort}/POI`,
  createPOI:              `https://${host}:${defaultPort}/createPOI`,
  updatePOI:              `https://${host}:${defaultPort}/updatePOI`,
  delPOI:                 `https://${host}:${defaultPort}/delPOI`,
  
  getFence:                 `https://${host}:${defaultPort}/fence`,
  createFence:               `https://${host}:${defaultPort}/createFence`,
  delFence:                 `https://${host}:${defaultPort}/delFence`,
  updateFence:               `https://${host}:${defaultPort}/updateFence`,

  
  getLayers:                 `https://${host}:${defaultPort}/getLayers`,
  createLayer:              `https://${host}:${defaultPort}/createLayer`,
  updateLayer:              `https://${host}:${defaultPort}/updateLayer`,
  delLayer:                 `https://${host}:${defaultPort}/delLayer`,
  getLayerEntities:          `https://${host}:${defaultPort}/Layer`,

  createUser:                 `https://${host}:${defaultPort}/createUser`,
  deleteUser:                 `https://${host}:${defaultPort}/deleteUser`,
  getAllUser:                 `https://${host}:${defaultPort}/getAllUser`,
  getUserCountInFence:        `https://${host}:${defaultPort}/userCountInsideFence`,
  quickFence:                    `https://${host}:${defaultPort}/quickFence`,


// TASK RELATED APIs   
   taskList:                       `https://${host}:${defaultPort}/taskList`,
   taskType:                       `https://${host}:${defaultPort}/taskType`, 
   updateTask:                     `https://${host}:${defaultPort}/task`,
   acknowledgeAllTask:             `https://${host}:${defaultPort}/acknowledgeAll`,

   

}
