import React, { useState, useEffect, useRef } from "react";
import PropTypes, { func } from "prop-types";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";

// import '../../styles/train.scss'
import Header from "../../components/Navigation/Header";
import { Title, NetworkStatus } from "../../components/commom";
import { Widget } from "../../components/Widget";
import ActivityLogTable from "../../components/ActivityLog/ActivityLogTable";
import ContactListTable from "../../components/ContactList/ContactListTable";
//leaflet libraries
import {
  MapContainer as Map,
  TileLayer,
  Marker,
  Popup,
  Polygon,
  FeatureGroup,
  LayersControl,
  LayerGroup,
  useMapEvents
} from "react-leaflet";
import L from "leaflet";
// import "leaflet/dist/leaflet.css";
// import { updateUserLocation} from '../../modules/actions/locationAction'

import Accordion from "@material-ui/core/Accordion";
import AccordionDetails from "@material-ui/core/AccordionDetails";
import AccordionSummary from "@material-ui/core/AccordionSummary";
import Typography from "@material-ui/core/Typography";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import axios from "axios";
import { EndPoints } from "../../MCXclient/endpoints";
import { EditControl } from "react-leaflet-draw";
// import "leaflet-draw/dist/leaflet.draw.css";
import {
  TextField,
  Modal,
  Button,
  Box,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  FormGroup,
  FormControlLabel,
  Switch,
  Radio,
  RadioGroup,
  FormLabel,
  Checkbox,
  Divider,
} from "@material-ui/core";
import DeleteDialog from "./DeleteDialog";
import LayerListItem from "./LayerListItem";
import Autocomplete from "@material-ui/lab/Autocomplete";
import EntityListItem from "./EntityListItem";

//icons
import AddCircleOutline from "@material-ui/icons/AddCircleOutline";
import DeleteIcon from "@material-ui/icons/Delete";
import Tooltip from "@material-ui/core/Tooltip";
import EditLocIcon from "@material-ui/icons/EditLocationSharp";

// import userWidget from "./users/userWidget"
//Redux actions
import { } from "../../modules/actions";
import { json } from "body-parser";
import { latLng } from "leaflet";
import AddLayerPopup from "./AddLayerPopup";
import CreateUser from "./CreateUser";
import AskForDGNAPopup from "./AskForDGNAPopup";
import MapUserListItem from "./MapUserListItem";
import { SignalCellularNullOutlined } from "@material-ui/icons";

import { sendGroupCall } from "../../modules/communication";
import { GroupCall } from "../../models/call";
import { updateTab } from "../../modules/activityLog";
import { push } from "react-router-redux";
import LocationAlertComp from "./locationAlertComp";
import { addDGNA } from "../../modules/common";
import { sendIndividualCall, sendIndividualCallAction } from '../../modules/communication';
import { IndividualCall } from '../../models/call';
import { getCallieIdToShow } from '../../utils/lib'
import UserFilterBody from "./UserFilterBody";
import { setZoomLevel, setMapCenterPosition, onFenceHighlight, onPOIHighlight } from '../../modules/actions/locationAction'
import { Modal as ModalBootStrap } from "react-bootstrap";
import registeredUsersList from "../../modules/registeredUsersList";
import { HotKeys } from '../../components/commom';
const { BaseLayer, Overlay } = LayersControl;
const propTypes = {
  trains: PropTypes.array,
};
const DefaultAlertRuleObj = {
  form: {
    type: "all",
    userList: [],
  },
  detectionType: "both",
  alertId: "",
  receiverId: "",
};
const DefaultPOIIbject = {
  // id:1,
  title: "",
  leafletId: 0,
  description: "",
  layerType: "POI",
  presenceRadius: 10,
  radiusUnit: "m",
  markerIcon: "",
  layerID: "",
  createdBy: "",
  alert: false,
  alertRule: DefaultAlertRuleObj,
};
var defLayerConfigObj = {
  user: false,
  fence: false,
  snailTrail: false,
  POI: false,
};
const DefaultFenceObject = {
  title: "",
  leafletId: 0,
  description: "",
  layerType: "fence",
  markerIcon: "",
  layerID: "",
  createdBy: "",
  alert: false,
  alertRule: DefaultAlertRuleObj,
};

var markerIcon = L.icon({
  iconUrl:
    "https://www.pngall.com/wp-content/uploads/2017/05/Map-Marker-PNG-HD.png",
  iconSize: [32, 41],
  iconAnchor: [12.5, 41],
  popupAnchor: [0, -41],
});
// var userMarkerIcon = L.icon({
//   iconUrl:
//     "https://pngset.com/images/yellow-map-marker-drop-pin-icon-light-plectrum-heart-lightbulb-transparent-png-1362020.png",
//   iconSize: [32, 41],
//   iconAnchor: [12.5, 41],
//   popupAnchor: [0, -41],
// });

// var activeUserMarkerIcon = L.icon({
//   iconUrl: "assets/images/location/marker-icon-green.png",
//   iconSize: [32, 41],
//   iconAnchor: [12.5, 41],
//   popupAnchor: [0, -41],
// });

// var inActiveUserMarkerIcon = L.icon({
//   iconUrl: "assets/images/location/marker-icon-grey.png",
//   iconSize: [32, 41],
//   iconAnchor: [12.5, 41],
//   popupAnchor: [0, -41],
// });

const faIcon = [
  {
    fa: "TR-DRIVER",
    activeIcon: "train-driver-active.png",
    inactiveIcon: "train-driver-inactive.png"
  },
  {
    fa: "TR-ASSTDRIVER",
    activeIcon: "assistant-driver-active.png",
    inactiveIcon: "assistant-driver-inactive.png"
  }
  , {
    fa: "TR-GUARD",
    activeIcon: "guard-active.png",
    inactiveIcon: "guard-inactive.png"
  }
  ,
  {
    fa: "TR-FRONTTRCP",
    activeIcon: "front-trcp-active.png",
    inactiveIcon: "front-trcp-inactive.png"
  },
  {
    fa: "TR-REARTRCP",
    activeIcon: "rear-trcp-active.png",
    inactiveIcon: "rear-trcp-inactive.png"
  }

]
const MapUEUsertype = [
  {
    ueType: "Consort-Handset",
    userType: "Driver",
    activeIcon: "handset-driver-active.png",
    inactiveIcon: "handset-driver-inactive.png"
  },
  {
    ueType: "Consort-Handset",
    userType: "Guard",
    activeIcon: "handset-guard-active.png",
    inactiveIcon: "handset-guard-inactive.png"
  },
  {
    ueType: "Consort-TRCP",
    userType: "Driver",
    activeIcon: "trcp-driver-active.png",
    inactiveIcon: "trcp-driver-inactive.png"
  }
]


const myIcon = L.icon({
  iconUrl: 'https://cdn0.iconfinder.com/data/icons/transportation-and-logistics/50/Transportation_and_Logistics-34-512.png',
  iconSize: [32, 41],
  //iconAnchor: [12.5, 41],
  //popupAnchor: [0, -41],
  shadowUrl: 'https://toppng.com/uploads/preview/hd-green-dot-circle-icon-11642066802ysgbn4cpvp.png',
  shadowSize: [15, 18],
  //iconAnchor: [22, 94],
  shadowAnchor: [22, 21],
});

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 600,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

const Location = (props) => {
  const {
    user,
    userlocation,
    geoFenceUpdate,
    activeTab,
    sendGroupCall,
    updateTab,
    navigateToCom,
    contactList,
    addDGNA,
    sendIndividualCallAction,
    sendIndividualCall,
    setZoomLevel,
    setMapCenterPosition,
    zoomLevel,
    mapCenterPosition,
    POIHighlight,
    fenceHighlight,
    onFenceHighlight,
    onPOIHighlight,
    regUsersList
  } = props;
  const [expanded, setExpanded] = useState(false);
  const [POIrenderingList, setPOIrenderingList] = useState(null);

  const [trainNoList, setTrainNoList] = useState([]);
  let [fenceList, setFenceList] = useState([]);
  const [layersList, setLayersList] = useState(null);
  const [fenceRes, setFenceRes] = useState([]);
  const [allUsersList, setAllUsersList] = useState([]);
  const [filteredUsersList, setFilteredUsersList] = useState([]);
  const [isUserFilterChecked, setIsUserFilterChecked] = useState(false);
  const [isUserFilterModalOpen, setIsUserFilterModalOpen] = useState(false);
  const [locatingUsersList, setLocatingUsersList] = useState([]);
  const [POIList, setPOIList] = useState([]);
  // const [geoFenceUpdate, setGeoFenceUpdate] =useState(null)

  const [selectedAccordian, setSelectedAccordian] = useState("users"); // "users","fences",""
  const [isAddPopupOpen, setisAddPopupOpen] = useState(false);
  const [isAddLayerOpen, setisAddLayerOpen] = useState(false);

  const [isAskDGNAPopup, setisAskDGNAPopup] = useState(false);
  const defaultCoordinate = process.env.REACT_APP_DEFAULT_COORDINATE ? JSON.parse(process.env.REACT_APP_DEFAULT_COORDINATE) : [28.6830, 77.5060];

  //console.log("reading from env:- ", typeof defaultCoordinate);
  // const [mapCenterPosition, setMapCenterPosition] = useState([
  //   28.6830,
  //   77.5060,
  // ]);
  const [leafletObj, setLeafletObj] = useState(null);
  const [newPOIObj, setNewPOIObj] = useState(DefaultPOIIbject);
  const [newFenceObj, setNewFenceObj] = useState(DefaultFenceObject);
  const [newAlertRuleObj, setNewAlertRuleObj] = useState(DefaultAlertRuleObj);
  const [isForUpdate, setisForUpdate] = useState(false);
  const [addedLayerType, setAddedLayerType] = useState("");
  const [fencesCoords, setFencesCoords] = useState(null);
  const [isOpenDelDialog, setIsOpenDelDialog] = useState(false);
  const [selectedLayerObj, setSelectedLayerObj] = useState(null);
  const [layerConfigObj, setLayerConfigObj] = useState(defLayerConfigObj);
  const [layerObj, setLayerObj] = useState(null);
  const [isShowAllChecked, setIsShowAllChecked] = useState(false);
  const [selectedLayer, setSelectedLayer] = useState(null);
  const [isAddUserOpen, setIsAddUserOpen] = useState(false);

  const [selLayerIndex, setSelLayerIndex] = useState(-1);
  const [selPOIIndex, setSelPOIIndex] = useState(-1);
  const [selectedUser, setSelectedUser] = useState(null);
  const [enableAlert, setEnableAlert] = useState(false);
  const [risTime, setRisTime] = useState(0);
  //  const listSelectedColor="#e8e8e8"

  const [userFilter, setUserFilter] = useState({
    activeUser: {
      isActiveUser: false,
      lastUpdatedSec: "0"
    },
    userInsideGeoFence: false,
    userIconFilter: {
      isUserIconFilterSelected: false,
      userIconArr: []
    },
    // trainNoFilter:{
    //   isTrainNoSelected : false,
    //   trainNoArr:[]
    // }
  });
  const listItemColor = "grey";
  const listSelectedColor = "grey";

  function MapSetPosComponent() {
    const mapEvents = useMapEvents({
      zoomend: () => {
        if (zoomLevel != mapEvents.getZoom().toString()){
          console.log("Inside Center", mapEvents.getZoom());
          setZoomLevel(mapEvents.getZoom().toString());
        }
        if (mapCenterPosition[0] != mapEvents.getCenter().lat || mapCenterPosition[1] != mapEvents.getCenter().lng){
          let arr=[];
          arr.push(mapEvents.getCenter().lat);
          arr.push(mapEvents.getCenter().lng);
          setMapCenterPosition(arr);
        }
      },
      dragend:()=>{
        if (mapCenterPosition[0] != mapEvents.getCenter().lat || mapCenterPosition[1] != mapEvents.getCenter().lng){
          let arr=[];
          arr.push(mapEvents.getCenter().lat);
          arr.push(mapEvents.getCenter().lng);
          setMapCenterPosition(arr);
        }
      }
    });
    mapEvents.setView(mapCenterPosition,zoomLevel);
    return null
  }

  const handleChange = (panel) => (event, isExpanded) => {
    setSelectedAccordian(panel);
    setExpanded(isExpanded ? panel : false);
  };

  const startGroupCall = (dgnaGroupId) => {
    console.log("GROUP CALL ID", dgnaGroupId);
    console.log("GROUP CALL from user", user);
    const call = new GroupCall("SIMPLEX_GROUP_CALL", dgnaGroupId, "LOW");

    sendGroupCall(user, call);
    if (activeTab !== "communication") {
      navigateToCom();
      updateTab("communication");
    }
  };

  const titleChangeHandler = (e) => {
    if (addedLayerType === "marker") {
      setNewPOIObj({
        ...newPOIObj,
        title: e.target.value,
      });
      console.log("update POI ", newPOIObj);
    } else {
      setNewFenceObj({
        ...newFenceObj,
        title: e.target.value,
      });
      console.log("update POI ", newPOIObj);
    }
  };
  const descriptionChangeHandler = (e) => {
    if (addedLayerType === "marker") {
      setNewPOIObj({
        ...newPOIObj,
        description: e.target.value,
      });
    } else {
      setNewFenceObj({
        ...newFenceObj,
        description: e.target.value,
      });
      console.log("update POI ", newPOIObj);
    }
  };
  const presenceRadiusChangeHandler = (e) => {
    setNewPOIObj({
      ...newPOIObj,
      presenceRadius: e.target.value,
    });
  };

  const radiusUnitChangeHandler = (e) => {
    setNewPOIObj({
      ...newPOIObj,
      radiusUnit: e.target.value,
    });
  };
  const layerChangeHandler = (e, v) => {
    setSelectedLayer(v);
    if (addedLayerType === "marker") {
      setNewPOIObj({
        ...newPOIObj,
        layerID: v.id,
        createdBy: v.createdBy,
      });
    } else {
      setNewFenceObj({
        ...newFenceObj,
        layerID: v.id,
        createdBy: v.createdBy,
      });
    }
  };
  const onMapOptionSelection = (panel) => {
    handleChange(panel);
    console.log("POI select");
  };

  const getAllPOI = () => {
    if (user && user.profile && user.profile.mcptt_id) {
      var reqObject = {
        userId: user.profile.mcptt_id,
        FAList: [global.config.faID],
      };
      const res = axios
        .post(EndPoints.getConfig().getPOI, reqObject)
        .then(
          (res) => {
            if (res && res.data) {
              console.log("POI RES ", JSON.stringify(res.data));
              const data = res.data;
              setPOIList(data);
              setPOIrenderingList(data)
            }
          },
          (err) => {
            console.log("POI ER ", err);
          }
        )
        .catch((err) => {
          console.log("POI ER", err);
        });
    }
  };
  const getAllLayers = () => {
    if (user) {
      var reqObject = {
        userId: user.profile.mcptt_id,
        FAList: [global.config.faID],
      };
      console.log("ALL LAYERS REQ ", JSON.stringify(reqObject));

      const res = axios
        .post(EndPoints.getConfig().getLayers, reqObject)
        .then(
          (res) => {
            console.log("LAYERS RES ", JSON.stringify(res.data));
            const data = res.data;
            var allLayers = [];
            allLayers = [...data.global, ...data.user, ...data.FA];
            console.log("ALL LAYERS RES ", allLayers);
            allLayers = allLayers.map(data => {
              return { ...data, ownershipId: (data.ownershipId).split(",") }
            })
            setLayersList(allLayers);
          },
          (err) => {
            console.log("ALL LAYERS ER ", err);
          }
        )
        .catch((err) => {
          console.log("ALL LAYERS ER", err);
        });
    }
  };
  const getAllUsers = () => {
    console.log("ALL USERS URL ", EndPoints.getConfig().getAllUser);

    const res = axios
      .post(EndPoints.getConfig().getAllUser, {})
      .then(
        (res) => {
          console.log("ALL USERS RES ", JSON.stringify(res.data));
          var data = res.data;
          data = data.map((item) => {
            if (item.message !== "") {
              const updatedItem = {
                ...item,
                message: JSON.parse(item.message),
              };

              return updatedItem;
            }

            return item;
          });

          console.log("NOW USERS  ", data);
          if (data.length > 0) {
            setAllUsersList(data);
          }
        },
        (err) => {
          console.log("ALL USERS ER ", err);
        }
      )
      .catch((err) => {
        console.log("ALL USERS ER", err);
      });
  };

  // const trainNo =() => {
  //   let tempTrainList=[];
  //   if (allUsersList && Array.isArray(allUsersList) ) {
  //         tempTrainList=allUsersList.map(({ obj }) => {

  //         const tempArr = obj.ActiveFA.split(",");
  //         const len=tempArr.length;
  //         return (tempArr[len-2]+tempArr[len-1]);
  //        })
  //   }
  // }

  const isUserRegistered = (user)=>{
    if(user && regUsersList){
      for (const regUsers of regUsersList) {
        if(regUsers.mcpttId === user.userId && regUsers.ueId === user.ueID)
        return true;
      }
      return false;
    }
  }

  const userFilterHandler = () => {
    let time = new Date();
    if (allUsersList && Array.isArray(allUsersList)) {
      let filteredUser = []
      // console.log("regUsersList", regUsersList, filteredUser);
      filteredUser = allUsersList.filter(value => {
        for (let i = 0; i < regUsersList.length; i++) {
          // console.log("condition---", value.userId == regUsersList[i].mcpttId && value.ueID == regUsersList[i].ueId, value, regUsersList[i]);
          if (value.userId == regUsersList[i].mcpttId && value.ueID == regUsersList[i].ueId)
            return value;
        }
      });
      if (isUserFilterChecked) {
        // if (userFilter.activeUser.isActiveUser && userFilter.activeUser.lastUpdatedSec) {
        //   filteredUser = filteredUser.filter((data) => Math.floor((new Date() - data.lastUpdated) / 1000) < userFilter.activeUser.lastUpdatedSec)
        // }
        if (userFilter.userInsideGeoFence) {
          filteredUser = filteredUser.filter((data) => {
            for (let fence of fenceList) {
              console.log("fence--", data);
              if (fence.userID.includes(data.userId)) return 1
            }
          })
        }
        else if (userFilter.userIconFilter.isUserIconFilterSelected) {

          filteredUser = (userFilter.userIconFilter.userIconArr.length != 0) ? filteredUser.filter((data) => {
            console.log("userIcon Filter filtered User List 1:", data);
            //  userFilter.userIconFilter.userIconArr.forEach( ( iconVal ) =>{
            for (let iconVal of userFilter.userIconFilter.userIconArr) {
              if (data.ActiveFA.includes(iconVal.value)) {
                return true;
              }
              else if (iconVal.value.includes(data.ueType) && iconVal.value.includes(data.userType)) {
                return true;
              }
            }
            //  )
          }) : filteredUser;
        }

      }
      console.log("geofence filter:--", filteredUser, fenceList);
      setFilteredUsersList(filteredUser);
      console.log("Filtered Userr:", filteredUser);
      setTimeout(() => {
        if ((new Date() - time) >= 60000)
          getAllUsers();
      }, 60000)
    }
  }

  const prepareFencesArray = (fences) => {
    const fencesCoordinates = [];
    if (fences && fences.length > 0) {
      fences.map((item) => {
        const innerCoords = [];
        const coords = JSON.parse(item.coordinates);
        coords.map((coord) => {
          innerCoords.push([coord.lat, coord.lng]);
        });
        fencesCoordinates.push(innerCoords);
      });
      console.log("fences coords", JSON.stringify(fencesCoordinates));
      setFencesCoords(fencesCoordinates);
    } else {
      console.log("fences coords are empty");
      setFencesCoords([]);
    }
  };
  const getAllFences = () => {
    if (user && user.profile && user.profile.mcptt_id) {
      var reqObject = {
        userId: user.profile.mcptt_id,
        FAList: [global.config.faID],
      };
      const res = axios
        .post(EndPoints.getConfig().getFence, reqObject)
        .then(
          (res) => {
            if (res && res.data) {
              console.log("fence RES ", JSON.stringify(res.data));
              let data = res.data;
              data = data.map(element => { return { ...element, userCount: 0, userID: [] ,activeUserCount: 0, activeUser: []} })
              // setFenceList(data);
              setFenceRes(data);
              console.log("fence list api res set",data);
              if (data.length > 0) {
                // getUserCountInsideFence();
                prepareFencesArray(data);
              }
            }
          },
          (err) => {
            console.log("fence ER ", err);
          }
        )
        .catch((err) => {
          console.log("fence ER", err);
        });
    }
  };
  const getUserCountInsideFence = () => {
    const res = axios
      .get(EndPoints.getConfig().getuserCountInsideFence)
      .then(
        (res) => {
          console.log("fence user count RES ", JSON.stringify(res.data),fenceList, fenceRes);
          const data = res.data;
          if (data.length > 0 && fenceRes) {
            let newList = fenceRes.map((item) => {
              for (let index = 0; index < data.length; index++) {
                if (data[index].fenceId == item.id){
                  let activeUser = [];
                  for(let user of data[index].userID ){
                    if(isUserRegistered(user)){
                      activeUser.push(user)
                    }
                  }
                  return { ...item, userCount: data[index].userCount, userID: data[index].userID, activeUserCount: activeUser.length, activeUser: activeUser }
                } 
              }
              return { ...item }
            })
            console.log("fence list user count", newList);
            setFenceList(newList)
          }

          // if (data.length > 0) {
          //   data.forEach((element) => {
          //     if (fenceList) {
          //       var newList = fenceList.map((item) => {
          //         if (item.id === element.fenceId) {
          //           const updatedItem = {
          //             ...item,
          //             userCount: element.userCount,
          //           };

          //           return updatedItem;
          //         }

          //         return item;
          //       });
          //       setFenceList(newList);
          //     }
          //   });
          // }
        },
        (err) => {
          console.log("fence user count ER ", err);
        }
      )
      .catch((err) => {
        console.log("fence user count ER in catxh ", err);
      });
  };
  useEffect(() => {
    getAllUsers();
    getAllLayers();
    getAllPOI();
    getAllFences();

    // updateUserLocation();
  }, []);
  useEffect(() => {
    console.log("USER_LOCATION_UPDATE enter useEffect");
    if (userlocation) {
      console.log("USER_LOCATION_UPDATE enter if");
      if (typeof userlocation.message !== "undefined") {
        console.log("USER_LOCATION_UPDATE enter type of");
        var parsedJSON = {
          ...userlocation,
          message: JSON.parse(userlocation.message),
        };
        console.log("USER_LOCATION_UPDATE parsed ", parsedJSON);
        onUserLocationUpdate(parsedJSON);
      }
    }
  }, [userlocation]);

  useEffect(() => {
    //{"fenceId":12,"count":1}
    console.log("GEOFENCE UPDATE enter useEffect");
    if (geoFenceUpdate) {
      console.log("GEOFENCE UPDATE enter if");
      if (typeof geoFenceUpdate.fenceId !== "undefined") {
        if (fenceList) {
          var newList = fenceList.map((item) => {
            if (item.id === geoFenceUpdate.fenceId) {
              const updatedItem = {
                ...item,
                userCount: geoFenceUpdate.count,
                userID: geoFenceUpdate.users
              };

              return updatedItem;
            }

            return item;
          });
          setFenceList(newList);
        }
      }
    }
  }, [geoFenceUpdate]);
  useEffect(() => {
    console.log("userfilter calling");
    userFilterHandler();
  }, [allUsersList, isUserFilterChecked, fenceList]);

  useEffect(() => {
    if (fenceList) {
      console.log("userInside fence is working");
      getUserCountInsideFence();
    }
  }, [fenceRes, regUsersList]);

  const onUserLocationUpdate = (updatedLocationData) => {
    console.log("USER_LOCATION_UPDATE onUserLocationUpdate");
    if (allUsersList) {
      var found = false;
      var newList = allUsersList.map((item) => {
        if (item.userId === updatedLocationData.userId && item.ueID === updatedLocationData.ueID) {
          found = true;
          // const updatedItem = {
          //   ...item,
          //   message: updatedLocationData.message,
          // };

          return updatedLocationData;
        }

        return item;
      });
      if (found) {
        console.log("USER_LOCATION_UPDATE UPDATED USER LIST", newList);
        setAllUsersList(newList);
      } else {
        getAllUsers();
      }
    }
  };

  function updateLayer(data) {
    //return await axios.post(path,data);
    console.log("LAYER UPDATE REQ ", JSON.stringify(data));
    const res = axios
      .post(EndPoints.getConfig().updateLayer, data)
      .then(
        (res) => {
          console.log("LAYER UPDATE RES ", res);
          setLayerObj(null);
          setisAddLayerOpen(false);

          if (res.status === 200) {
            getAllLayers();
          }
        },
        (err) => {
          setLayerObj(null);
          setisAddLayerOpen(false);

          console.log("LAYER UPDATE ERROR", err);
        }
      )
      .catch((err) => {
        setLayerObj(null);
        setisAddLayerOpen(false);
        console.log("LAYER UPDATE ERROR", err);
      });
  }
  function createLayer(data) {
    console.log("LAYER CREATE REQ ", JSON.stringify(data));
    const res = axios
      .post(EndPoints.getConfig().createLayer, data)
      .then(
        (res) => {
          console.log("LAYER CREATE RES ", res);
          setisAddLayerOpen(false);
          if (res.status === 200) {
            getAllLayers();
          }
        },
        (err) => {
          setisAddLayerOpen(false);

          console.log("LAYER ERROR", err);
        }
      )
      .catch((err) => {
        setisAddLayerOpen(false);
        console.log("LAYER ERROR", err);
      });
  }
  function createUser(data) {
    console.log("USER CREATE REQ ", JSON.stringify(data));
    const res = axios
      .post(EndPoints.getConfig().createUser, data)
      .then(
        (res) => {
          console.log("USER CREATE RES ", res);
          setIsAddUserOpen(false);
          if (res.status === 200) {
            getAllUsers();
          }
        },
        (err) => {
          setIsAddUserOpen(false);

          console.log("USER ERROR", err);
        }
      )
      .catch((err) => {
        setIsAddUserOpen(false);
        console.log("USER ERROR", err);
      });
  }
  function createFence(data) {
    //return await axios.post(path,data);
    console.log("fence CREATE REQ ", JSON.stringify(data));
    const res = axios
      .post(EndPoints.getConfig().createFence, data)
      .then(
        (res) => {
          console.log("fence CREATE RES ", res);
          setisAddPopupOpen(false);
          setNewFenceObj(DefaultFenceObject);
          if (res.status === 200) {
            getAllFences();
          }
        },
        (err) => {
          setisAddPopupOpen(false);
          setNewFenceObj(DefaultFenceObject);
          console.log("fence ERROR", err);
        }
      )
      .catch((err) => {
        setisAddPopupOpen(false);
        setNewFenceObj(DefaultFenceObject);
        console.log("fence ERROR", err);
      });
  }

  function createPOI(data) {
    //return await axios.post(path,data);
    console.log("POI CREATE REQ ", JSON.stringify(data));
    const res = axios
      .post(EndPoints.getConfig().createPOI, data)
      .then(
        (res) => {
          console.log("POI CREATE RES ", res);
          setisAddPopupOpen(false);
          setNewPOIObj(DefaultPOIIbject);
          if (res.status === 200) {
            getAllPOI();
          }
        },
        (err) => {
          setisAddPopupOpen(false);
          setNewPOIObj(DefaultPOIIbject);
          console.log("POI ERROR", err);
        }
      )
      .catch((err) => {
        setisAddPopupOpen(false);
        setNewPOIObj(DefaultPOIIbject);
        console.log("POI ERROR", err);
        const f = [...POIList, data];
      });
  }
  function updatePOI(data) {
    //return await axios.post(path,data);
    console.log("POI UPDATE REQ ", data);
    const res = axios
      .post(EndPoints.getConfig().updatePOI, data)
      .then(
        (res) => {
          setisAddPopupOpen(false);
          setNewPOIObj(DefaultPOIIbject);
          console.log("POI UPDATE RES ", res);
          if (res.status === 200) {
            getAllPOI();
          }
        },
        (err) => {
          setisAddPopupOpen(false);
          setNewPOIObj(DefaultPOIIbject);
        }
      )
      .catch((err) => {
        setisAddPopupOpen(false);
        setNewPOIObj(DefaultPOIIbject);
      });
  }
  function updateFence(data) {
    //return await axios.post(path,data);
    console.log("FENCE UPDATE REQ ", data);
    const res = axios
      .post(EndPoints.getConfig().updateFence, data)
      .then(
        (res) => {
          setisAddPopupOpen(false);
          setNewFenceObj(DefaultFenceObject);
          console.log("FENCE UPDATE RES ", res);
          if (res.status === 200) {
            getAllFences();
          }
        },
        (err) => {
          setisAddPopupOpen(false);
          setNewFenceObj(DefaultFenceObject);
        }
      )
      .catch((err) => {
        setisAddPopupOpen(false);
        setNewFenceObj(DefaultFenceObject);
      });
  }

  const showDeleteDialog = (delObj) => {
    console.log("layerObject-----", delObj);
    setSelectedLayerObj(delObj);
    setIsOpenDelDialog(true);
  };

  const deletePOI = (data) => {
    const reqObj = {
      id: data,
    };
    console.log("POI DELETE REQ ", reqObj);
    const res = axios
      .post(EndPoints.getConfig().delPOI, reqObj)
      .then(
        (res) => {
          setisAddPopupOpen(false);
          console.log("POI DELETE RES ", res);
          if (res.status === 200) {
            getAllPOI();
            onPOIHighlight(-1);
          }
        },
        (err) => {
          setisAddPopupOpen(false);
          console.log("POI DELETE error", err);
        }
      )
      .catch((err) => {
        setisAddPopupOpen(false);
        console.log("POI DELETE error", err);
      });
  };

  const deleteFence = (data) => {
    const reqObj = {
      id: data,
    };
    console.log("fence DELETE REQ ", reqObj);
    const res = axios
      .post(EndPoints.getConfig().delFence, reqObj)
      .then(
        (res) => {
          setisAddPopupOpen(false);
          console.log("fence DELETE RES ", res);
          if (res.status === 200) {
            getAllFences();
            onFenceHighlight(-1);
          }
        },
        (err) => {
          setisAddPopupOpen(false);
          console.log("fence DELETE error", err);
        }
      )
      .catch((err) => {
        setisAddPopupOpen(false);
        console.log("fence DELETE error", err);
      });
  };
  const deleteLayer = (data) => {
    const reqObj = {
      id: data,
    };
    console.log("LAYER DELETE REQ ", reqObj);
    const res = axios
      .post(EndPoints.getConfig().delLayer, reqObj)
      .then(
        (res) => {
          setisAddPopupOpen(false);
          console.log("LAYER DELETE RES ", res);
          if (res.status === 200) {
            getAllLayers();
          }
        },
        (err) => {
          setisAddPopupOpen(false);
          console.log("LAYER DELETE error", err);
        }
      )
      .catch((err) => {
        setisAddPopupOpen(false);
        console.log("LAYER DELETE error", err);
      });
  };
  const deleteUser = (data) => {
    const reqObj = {
      id: data,
    };
    console.log("USER DELETE REQ ", reqObj);
    const res = axios
      .post(EndPoints.getConfig().deleteUser, reqObj)
      .then(
        (res) => {
          // setisAddPopupOpen(false)
          console.log("USER DELETE RES ", res);
          if (res.status === 200) {
            getAllUsers();
          }
        },
        (err) => {
          // setisAddPopupOpen(false)
          console.log("USER DELETE error", err);
        }
      )
      .catch((err) => {
        // setisAddPopupOpen(false)
        console.log("USER DELETE error", err);
      });
  };

  const restoreAllLayer = () => {
    setSelLayerIndex(-2);
    if (fenceList) {
      var defFences = fenceList.filter((fennce) => {
        return fennce.layerID === null || fennce.layerID === "";
      });
      prepareFencesArray(defFences);
    }
    if (POIList) {
      var defPOI = POIList.filter((poi) => {
        return poi.layerID === null || poi.layerID === "";
      });
      console.log("FILTER POI", defPOI);
      setPOIrenderingList(defPOI);
    }
  };
  const onLayerSelectHandler = (data, index) => {
    console.log("LAYER SELECTED", data);
    setIsShowAllChecked(false);
    setSelLayerIndex(index);
    let selectedId = data.id;
    const reqObj = {
      id: selectedId,
    };
    console.log("LAYER ENTITY REQ ", reqObj);

    const res = axios
      .post(EndPoints.getConfig().getLayerEntities, reqObj)
      .then(
        (res) => {
          // console.log("LAYER ENTITY RES ", JSON.stringify(res.data))
          if (res.status === 200) {
            var data = res.data;
            console.log("LAYER ENTITY RES ", JSON.stringify(data));
            prepareFencesArray(data.fence);
            setPOIrenderingList(data.POI);
          }
        },
        (err) => {
          console.log("LAYER ENTITY error", err);
        }
      )
      .catch((err) => {
        console.log("LAYER ENTITY error", err);
      });

    //  setLayerConfigObj(tempLayerConfigObj)
  };
  const onPOIDataSubmit = () => {
    console.log("POI entered onSubmit ", isForUpdate);
    if (isForUpdate) {
      if (addedLayerType === "marker") {
        updatePOI(newPOIObj);
      } else {
        updateFence(newFenceObj);
      }
    } else {
      if (addedLayerType === "marker") {
        createPOI(newPOIObj);
      } else {
        createFence(newFenceObj);
      }
    }
  };
  const onPOIClickHandler = (data, index) => {
    const coordinates = JSON.parse(data.coordinates);
    let latlong = [coordinates[0].lat, coordinates[0].lng];

    setMapCenterPosition(latlong);
    onPOIHighlight(index)
    console.log("POI click", latlong);
  };

  const onFenceClickHandler = (data, index) => {
    const coordinates = JSON.parse(data.coordinates);
    let latlong = [coordinates[0].lat, coordinates[0].lng];
    setMapCenterPosition(latlong);
    onFenceHighlight(index);
    console.log("POI click onFenceClick latlong", latlong, data, index);
  };
  const onUserClickHandler = (data) => {
    if (data.message !== "") {
      let latlong = [
        data.message.latitude.location,
        data.message.longitude.location,
      ];
      setMapCenterPosition(latlong);
      console.log("USER click", latlong);
    }
  };
  function onMarkerClick(clickedCordinate) {
    // setSelectedLocation(clickedCordinate)
    console.log("CLICKEDMARKER", clickedCordinate);
  }
  const _onEditPath = (e) => {
    console.log("ON POI EDIT", e);
  };

  const editLayerHandler = (layerData) => {
    setLayerObj(layerData);
    setisAddLayerOpen(true);
  };
  const editPOI = (poiData) => {
    const coordinates = JSON.parse(poiData.coordinates);
    poiData = {
      ...poiData,
      coordinates: coordinates,
    };
    if (poiData.layerType === "POI") {
      setAddedLayerType("marker");
      setNewPOIObj(poiData);
    } else {
      setAddedLayerType("polygon");
      setNewFenceObj(poiData);
    }
    console.log("EDIT CALL", poiData);

    setisForUpdate(true);
    setisAddPopupOpen(true);
  };
  const editObject = (objData) => {
    const coordinates = JSON.parse(objData.coordinates);
    objData = {
      ...objData,
      coordinates: coordinates,
    };
    var reqObj = {
      objectId: objData.id,
      userId: user.profile.mcptt_id,
      FAList: [global.config.faID],
      objectType: objData.layerType,
    };
    console.log("OBJECT REQ ", JSON.stringify(reqObj));

    const res = axios
      .post(EndPoints.getConfig().getObject, reqObj)
      .then(
        (res) => {
          if (res.status === 200) {
            var data = res.data;
            console.log("OBJECT RES ", JSON.stringify(data));
            var poiData = data.object;
            poiData = {
              ...poiData,
              layerID: data.layerID,
              createdBy: data.createdBy,
            };
            const coordinates = JSON.parse(poiData.coordinates);
            poiData = {
              ...poiData,
              coordinates: coordinates,
            };
            if (data.createdBy === user.profile.mcptt_id) {
              if (layersList !== null) {
                var foundedElement = {};
                layersList.forEach((element) => {
                  console.log("OBJECT loop", element);
                  if (element.id === data.layerID) {
                    foundedElement = element;
                    return;
                  }
                });
                setSelectedLayer(foundedElement);
                console.log("OBJECT loop ended", foundedElement);
              }
            }
            if (poiData.layerType === "POI") {
              setAddedLayerType("marker");
              setNewPOIObj(poiData);
              onPOIHighlight(-1)
            } else {
              setAddedLayerType("polygon");
              setNewFenceObj(poiData);
              onFenceHighlight(-1)
            }
            console.log("EDIT CALL", poiData);

            setisForUpdate(true);
            setisAddPopupOpen(true);
          }
        },
        (err) => {
          console.log("OBJECT error", err);
        }
      )
      .catch((err) => {
        console.log("OBJECT error", err);
      });
  };
  const _onCreate = (e) => {
    console.log(e);
    const { layerType, layer } = e;
    setAddedLayerType(layerType);
    if (layerType === "polygon") {
      const { _leaflet_id, _latlngs } = layer;
      console.log("fence latlngs", _latlngs);
      const leafletObj = {
        _leaflet_id: _leaflet_id,
        _latlng: _latlngs[0],
      };
      onAddLayerClick(leafletObj, layerType);
    }
    if (layerType === "marker") {
      const { _leaflet_id, _latlng } = layer;
      console.log("POI marker", _latlng);
      const leafletObj = {
        _leaflet_id: _leaflet_id,
        _latlng: _latlng,
      };
      onAddLayerClick(leafletObj, layerType);
      // setMapLayers(layers => [...layers,
      // { id: _leaflet_id, latlngs: layer.getLatLngs()[0] }])
    }
  };
  const _onDelete = (e) => {
    console.log(e, "On Fence Delete");
  };
  const handleAddPopupOpen = () => setisAddPopupOpen(true);
  const handleAddPopupClose = () => {
    console.log("called popup close");
    setisAskDGNAPopup(false);
    setisAddPopupOpen(false);
    setNewFenceObj(DefaultFenceObject);
    setNewPOIObj(DefaultPOIIbject);
    setSelectedLayer("");
  };
  const handleAskDGNAPopup = () => {
    setisAskDGNAPopup(false);
    setNewFenceObj(DefaultFenceObject);
    setNewPOIObj(DefaultPOIIbject);
    setSelectedLayer("");
  };
  const handleAddLayerClose = () => setisAddLayerOpen(false);
  const handleAddUserPopupClose = () => {
    setIsAddUserOpen(false);
    setSelectedUser(null);
  };
  const onMapPolygonClick = (clickIndex) => {
    if (fenceList[clickIndex]) {
      let selectedFence = fenceList[clickIndex];
      console.log(`Clicked on polygon ${JSON.stringify(selectedFence)}`);
      if (selectedFence.DGNA === 1 && selectedFence.groupID) {
        startGroupCall(selectedFence.groupID);
      } else {
        console.log("DGNA not enabled for this fence");
      }
    }
  };

  const onAddNewLayerClick = () => setisAddLayerOpen(true);
  const onAddUserClick = () => {
    // onUserLocationUpdate()
    setIsAddUserOpen(true);
  };

  const onEditUserClick = (data) => {
    setSelectedUser(data);
    setIsAddUserOpen(true);
  };
  const onFenceActionSelection = (selectedAction) => {
    console.log("FENCE SEL ACTION- ", selectedAction);
    if (selectedAction === "call") {
      // CALL THE API FOR SENDING COORDINATE TO START A QUICK CALL
      let data = {
        coordinates: newFenceObj.coordinates,
      };
      createQuickDGNA(data);
    } else {
      setisAddPopupOpen(true);
    }
    setisAskDGNAPopup(false);
  };
  function createQuickDGNA(data) {
    //return await axios.post(path,data);
    console.log("QUICK FENCE  REQ ", JSON.stringify(data));
    const res = axios
      .post(EndPoints.getConfig().quickFence, data)
      .then(
        (res) => {
          console.log("QUICK FENCE RES ", res);
          if (res.status === 200) {
            // start call with DGNA group Id rcvd in res

            var data = res.data;
            // data.userID = ["5001-consort"];
            data.userID = data.userID ? data.userID : [];
            if (data.userID.length > 0) {
              //creating DGNA req data
              let grpMems = [];
              data.userID.forEach((id) => {
                for (let i = 0; i < contactList.length; i++) {
                  if (contactList[i].mcptt_id === id) {
                    let member = {
                      contactName: contactList[i].contactName,
                      mcptt_id: contactList[i].mcptt_id,
                      mcptt_uri: contactList[i].mcptt_uri,
                    };
                    grpMems.push(member);
                    break;
                  }
                }
              });
              let currentTime = new Date().getTime();
              let createDGNAReqData = {
                fromId: user.profile.mcptt_id,
                // name:`quick_grp_call-${currentTime}`,
                name: `test_DGNA_AS`,
                color: 1,
                grpMembers: grpMems,
              };
              addDGNA(createDGNAReqData);
            }

            let dgnaGroupId = data.groupID;
            if (dgnaGroupId) {
              startGroupCall(dgnaGroupId);
            }
          }
          setisAskDGNAPopup(false);
          setNewFenceObj(DefaultFenceObject);
        },
        (err) => {
          setisAskDGNAPopup(false);
          setNewFenceObj(DefaultFenceObject);

          console.log("QUICK FENCE ERROR", err);
        }
      )
      .catch((err) => {
        setisAskDGNAPopup(false);
        setNewFenceObj(DefaultFenceObject);
        console.log("QUICK FENCE ERROR", err);
      });
  }
  const onAddLayerClick = (leafletData, layerType) => {
    var { _leaflet_id, _latlng } = leafletData;
    if (layerType === "polygon") {
      console.log("POLYGON LEAFLET DATA", JSON.stringify(_latlng));

      setNewFenceObj({
        ...newFenceObj,
        leafletId: _leaflet_id,
        coordinates: _latlng,
      });
      setisAskDGNAPopup(true);
    } else if (layerType === "marker") {
      console.log("POI LEAFLET DATA", JSON.stringify([_latlng]));

      setNewPOIObj({
        ...newPOIObj,
        leafletId: _leaflet_id,
        coordinates: [_latlng],
      });
      setisAddPopupOpen(true);
    }

    setLeafletObj(leafletData);
  };
  const deleteDailogHandler = (val) => {
    setIsOpenDelDialog(false);
    if (val) {
      const selLayer = selectedLayerObj.layerType;
      console.log("LAYER DEL setLayer", selLayer);
      if (selLayer === undefined) {
        console.log("LAYER DEL started");

        deleteLayer(selectedLayerObj.id);
      } else {
        console.log("LAYER DEL not started");

        if (selLayer === "POI") {
          deletePOI(selectedLayerObj.id);
        } else {
          deleteFence(selectedLayerObj.id);
        }
      }
    }
  };
  //Handle User Filter-------------------------------
  const handleUserFilter = (e) => {
    console.log("userfilterChecked ", e.target.checked);
    setIsUserFilterChecked(e.target.checked);
    setIsUserFilterModalOpen(e.target.checked);
  };

  const userFilterModalhandleClose = () => {
    setIsUserFilterModalOpen(false);
  };


  //--------------------------------------------------
  const handleShowAllLayer = (e) => {
    if (e.target.checked) {
      prepareFencesArray(fenceList);
      setPOIrenderingList(POIList);
    }
    setIsShowAllChecked(e.target.checked);
  };
  const handleDGNAChange = (e) => {
    if (addedLayerType === "marker") {
      setNewPOIObj({
        ...newPOIObj,
        DGNA: e.target.checked,
      });
    } else {
      setNewFenceObj({
        ...newFenceObj,
        DGNA: e.target.checked,
      });
    }
  };

  const handleAlertChange = (e) => {
    setEnableAlert(e.target.checked);
    if (addedLayerType === "marker") {
      setNewPOIObj({
        ...newPOIObj,
        alert: e.target.checked,
      });
    } else {
      setNewFenceObj({
        ...newFenceObj,
        alert: e.target.checked,
      });
    }
  };
  const setAlertForm = (alertForm) => {
    if (addedLayerType === "marker") {
      setNewPOIObj({
        ...newPOIObj,
        alertRule: {
          ...newPOIObj.alertRule,
          form: {
            ...newPOIObj.alertRule.form,
            type: alertForm,
          },
        },
      });
    } else {
      setNewFenceObj({
        ...newFenceObj,
        alertRule: {
          ...newPOIObj.alertRule,
          form: {
            ...newPOIObj.alertRule.form,
            type: alertForm,
          },
        },
      });
    }
  };
  const setAlertUserList = (users) => {
    if (addedLayerType === "marker") {
      setNewPOIObj({
        ...newPOIObj,
        alertRule: {
          ...newPOIObj.alertRule,
          form: {
            ...newPOIObj.alertRule.form,
            userList: users,
          },
        },
      });
    } else {
      setNewFenceObj({
        ...newFenceObj,
        alertRule: {
          ...newPOIObj.alertRule,
          form: {
            ...newPOIObj.alertRule.form,
            userList: users,
          },
        },
      });
    }
  };
  const setAlertDetectionType = (type) => {
    if (addedLayerType === "marker") {
      setNewPOIObj({
        ...newPOIObj,
        alertRule: {
          ...newPOIObj.alertRule,
          detectionType: type,
        },
      });
    } else {
      setNewFenceObj({
        ...newFenceObj,
        alertRule: {
          ...newPOIObj.alertRule,
          detectionType: type,
        },
      });
    }
  };

  const setAlertreceiverId = (mcpttId) => {
    if (addedLayerType === "marker") {
      setNewPOIObj({
        ...newPOIObj,
        alertRule: {
          ...newPOIObj.alertRule,
          receiverId: mcpttId,
        },
      });
    } else {
      setNewFenceObj({
        ...newFenceObj,
        alertRule: {
          ...newPOIObj.alertRule,
          receiverId: mcpttId,
        },
      });
    }
  };
  const setSelectedAlertCode = (selAlertCode) => {
    if (addedLayerType === "marker") {
      setNewPOIObj({
        ...newPOIObj,
        alertRule: {
          ...newPOIObj.alertRule,
          alertId: selAlertCode,
        },
      });
    } else {
      setNewFenceObj({
        ...newFenceObj,
        alertRule: {
          ...newPOIObj.alertRule,
          alertId: selAlertCode,
        },
      });
    }
  };

  const lastSeen = (date) => {
    var seconds = Math.floor((new Date() - date) / 1000);

    var interval = seconds / 31536000;

    if (interval > 1) {
      return Math.floor(interval) + " years ago";
    }
    interval = seconds / 2592000;
    if (interval > 1) {
      return Math.floor(interval) + " months ago";
    }
    interval = seconds / 86400;
    if (interval > 1) {
      return Math.floor(interval) + " days ago";
    }
    interval = seconds / 3600;
    if (interval > 1) {
      return Math.floor(interval) + " hours ago";
    }
    interval = seconds / 60;
    if (interval > 1) {
      return Math.floor(interval) + " minutes ago";
    }
    if (seconds > 0)
      return Math.floor(seconds) + " seconds";
    return "Just Now"
  }
  const startCall = (userID) => {
    console.log("Calling to ", userID);
    if (userID) {
      let call = new IndividualCall('DUPLEX_INDIVIDUAL_CALL', userID, 'MEDIUM');
      sendIndividualCall(user, call)
      navigateToCom()
      // updateTab('communication')
    }
  }

  const isActive = (reportingInterval, lastUpdated) => {
    let timedeff = Math.floor((new Date() - lastUpdated) / 1000);
    if (timedeff > 5 * reportingInterval) {
      return false;
    }
    return true;
  }


  const getIconUrl = (userData) => {

    if (userData && userData.ActiveFA) {
      const faListIcon = userData.ActiveFA.split(',');
      for (let index = 0; index < faListIcon.length; index++) {
        const data = faListIcon[index];
        for (let index2 = 0; index2 < faIcon.length; index2++) {
          const fas = faIcon[index2];
          if (data.includes(fas.fa)) {
            console.log("faIcon Insdide fas", fas);
            if (isActive(userData.reportingInterval, userData.lastUpdated)) {
              return `assets/images/location/${fas.activeIcon}`;
            }
            else {
              return `assets/images/location/${fas.inactiveIcon}`;
            }

          }
        }
      }
    }

    if (userData && userData.ueType && userData.userType) {

      for (let index = 0; index < MapUEUsertype.length; index++) {
        const user = MapUEUsertype[index];
        if (user.ueType == userData.ueType && user.userType == userData.userType) {
          if (isActive(userData.reportingInterval, userData.lastUpdated)) {
            return `assets/images/location/${user.activeIcon}`;
          }
          else {
            return `assets/images/location/${user.inactiveIcon}`;
          }

        }

      }
    }
    if (isActive(userData.reportingInterval, userData.lastUpdated)) {
      return `assets/images/location/green-marker.png`;
    }
    else {
      return `assets/images/location/gray-marker.png`;
    }
  }
  
  const getUeType = (ueType) => {
    if (ueType.includes('Handset')) {
      return 'Handset';
    }
    if (ueType.includes('TRCP')) {
      return 'TRCP';
    }
    return ueType;
  }



  const getLayerValue = {
    id: 15,
    title: "Ashish Layer",
    createdBy: "4006-consort",
    description: "kljnlk",
    ownership: "user",
    ownershipId: "4006-consort",
  };
  const position = [28.6, 77.2];
  const tileUrl = "http://192.168.1.50:8082/{z}/{x}/{y}.png";

  return (
    <div>
      <Header page={"location"} />
      <div class="main-nav-body">
        <div class="loc-grid" style={{ width: "100%" }}>
          <div class="l1 wrap-1">
            <Modal
              open={isAskDGNAPopup}
              onClose={handleAskDGNAPopup}
              aria-labelledby="modal-modal-title"
              aria-describedby="modal-modal-description"
            >
              <AskForDGNAPopup askDGNAAction={onFenceActionSelection} />
            </Modal>
            <Modal
              open={isAddPopupOpen}
              onClose={handleAddPopupClose}
              aria-labelledby="modal-modal-title"
              aria-describedby="modal-modal-description"
            >
              <Box sx={style}>
                {addedLayerType === "marker" ? (
                  <Typography
                    id="modal-modal-title"
                    variant="h6"
                    component="h2"
                  >
                    {isForUpdate
                      ? "Update Point Of Interest"
                      : "Add Point Of Interest"}
                  </Typography>
                ) : (
                  <Typography
                    id="modal-modal-title"
                    variant="h6"
                    component="h2"
                  >
                    {isForUpdate ? "Update Fence" : "Add Fence"}
                  </Typography>
                )}
                <div>
                  <div class="tab1-account">
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        paddingRight: "30px",
                      }}
                    >
                      <TextField
                        required
                        id="standard-basic"
                        label="Title"
                        variant="standard"
                        value={
                          addedLayerType === "marker"
                            ? newPOIObj.title
                            : addedLayerType === "polygon"
                              ? newFenceObj.title
                              : ""
                        }
                        onChange={titleChangeHandler}
                      />
                      <TextField
                        required
                        id="outlined-multiline-flexible"
                        label="Description"
                        multiline
                        maxRows={4}
                        style={{ marginTop: "15px" }}
                        value={
                          addedLayerType === "marker"
                            ? newPOIObj
                              ? newPOIObj.description
                              : ""
                            : newFenceObj
                              ? newFenceObj.description
                              : ""
                        }
                        onChange={descriptionChangeHandler}
                      // value={value}
                      // onChange={handleChange}
                      />
                    </div>
                    {/* {addedLayerType === "marker" ?
                      (
                        <div style={{ marginTop: '15px', addingRight: '30px' }}>

                          <TextField id="standard-basic" label="Coordinates" variant="standard"
                            // value={isForUpdate ? newPOIObj.coordinates[0].lat : leafletObj ? leafletObj._latlng.lat : ""}
                            value={newPOIObj.coordinates ? newPOIObj.coordinates[0].lat : ""}

                            required disabled />
                          <TextField
                            id="outlined-multiline-flexible"
                            // value={isForUpdate ? newPOIObj.coordinates[0].lng : leafletObj ? leafletObj._latlng.lng : ""}
                            value={newPOIObj.coordinates ? newPOIObj.coordinates[0].lng : ""}

                            label=" "
                            required disabled
                            style={{ marginLeft: '17px' }}
                          // onChange={handleChange}
                          />
                        </div>
                      ) :
                      (newFenceObj.coordinates && newFenceObj.coordinates.map((item, index) => (
                        <div style={{ marginTop: '15px', addingRight: '30px' }}>

                          <TextField id="standard-basic" label="Coordinates" variant="standard"
                            // value={isForUpdate ? newPOIObj.coordinates[0].lat : leafletObj ? leafletObj._latlng.lat : ""}
                            value={item.lat}

                            required disabled />
                          <TextField
                            id="outlined-multiline-flexible"
                            // value={isForUpdate ? newPOIObj.coordinates[0].lng : leafletObj ? leafletObj._latlng.lng : ""}
                            value={item.lng}

                            label=" "
                            required disabled
                            style={{ marginLeft: '17px' }}
                          // onChange={handleChange}
                          />
                        </div>
                      )))


                    } */}

                    {addedLayerType === "marker" ? (
                      <div
                        style={{
                          marginTop: "15px",
                          alignItems: "center",
                          justifyContent: "flex-start",
                        }}
                      >
                        <TextField
                          required
                          id="standard-basic"
                          label="Presence Radius"
                          variant="standard"
                          type="number"
                          //value="10"
                          value={newPOIObj ? newPOIObj.presenceRadius : ""}
                          onChange={presenceRadiusChangeHandler}
                          InputLabelProps={{
                            shrink: true,
                          }}
                        />
                        <FormControl
                          variant="standard"
                          sx={{ m: 1, minWidth: 120 }}
                          style={{ width: "60px", marginLeft: "10px" }}
                        >
                          <InputLabel id="demo-simple-select-label">
                            Unit
                          </InputLabel>

                          <Select
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            label="m"
                            value={newPOIObj ? newPOIObj.radiusUnit : ""}
                            onChange={radiusUnitChangeHandler}
                          >
                            <MenuItem value="m">m</MenuItem>
                            <MenuItem value="km">km</MenuItem>
                            <MenuItem value="mi">mi</MenuItem>
                          </Select>
                        </FormControl>
                      </div>
                    ) : null}
                  </div>
                  {layersList && (
                    <Autocomplete
                      sx={{ width: 300 }}
                      disablePortal
                      style={{
                        marginBottom: 25,
                        paddingLeft: 5,
                        marginTop: 10,
                      }}
                      options={layersList}
                      value={selectedLayer ? selectedLayer : ""}
                      // value={userlist.find(v => v.mcptt_id === iwfInfo.mcpttId) || {}}
                      // renderOption={(option) => <TextField>{option.title}</TextField>}
                      getOptionLabel={(option) =>
                        option && option.title ? option.title : ""
                      }
                      renderInput={(params) => (
                        <TextField {...params} label="Add Layer" />
                      )}
                      onChange={layerChangeHandler}
                    />
                  )}
                  <div
                    style={{
                      width: "100%",
                      marginTop: "12px",
                      display: "flex",
                      flexDirection: "row",
                    }}
                  >
                    <label style={{ flex: 1, marginTop: "2px" }}>
                      Enable Dynamic Group
                    </label>

                    <Switch
                      style={{ flex: 0.2 }}
                      color="primary"
                      checked={
                        addedLayerType === "marker"
                          ? newPOIObj.DGNA
                          : addedLayerType === "polygon"
                            ? newFenceObj.DGNA
                            : 0
                      }
                      onChange={handleDGNAChange}
                    />
                  </div>
                  {/* <div
                    style={{
                      width: "100%",
                      marginTop: "8px",
                      display: "flex",
                      flexDirection: "row",
                    }}
                  >
                    <label style={{ flex: 1, marginTop: "2px" }}>Alert</label>

                    <Switch
                      style={{ flex: 0.2 }}
                      color="primary"
                      checked={enableAlert}
                      onChange={handleAlertChange}
                    />
                  </div> */}
                  <div></div>
                  {enableAlert ? (
                    <div>
                      <LocationAlertComp
                        setAlertForm={setAlertForm}
                        setAlertUserList={setAlertUserList}
                        setAlertDetectionType={setAlertDetectionType}
                        setAlertreceiverId={setAlertreceiverId}
                        setSelectedAlertCode={setSelectedAlertCode}
                      />
                      {/* <div style={{ display: 'flex', flexDirection: 'column', paddingRight: '30px' }}>
                        <FormControl>
                          <FormLabel >Alert form</FormLabel>
                          <RadioGroup
                            row
                            aria-labelledby="demo-radio-buttons-group-label"
                            defaultValue="all"
                            // value={alertForm}
                            // onChange={onAlertFormChange}
                            name="radio-buttons-group"
                          >
                            <FormControlLabel value="all" control={<Radio />} label="All Users" />
                            <FormControlLabel value="inclusive" control={<Radio />} label="Inclusive" />
                            <FormControlLabel value="exclusive" control={<Radio />} label="Exclusive" />
                          </RadioGroup>
                        </FormControl>
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', paddingRight: '30px' }}>
                        <FormControl>
                          <FormLabel >Detection type</FormLabel>
                          <RadioGroup
                            row
                            aria-labelledby="demo-radio-buttons-group-label"
                            defaultValue="both"
                            // value={alertForm}
                            // onChange={onAlertFormChange}
                            name="radio-buttons-group"
                          >
                            <FormControlLabel value="enter" control={<Radio />} label="Enter" />
                            <FormControlLabel value="exit" control={<Radio />} label="Exit" />
                            <FormControlLabel value="both" control={<Radio />} label="Both" />
                          </RadioGroup>
                        </FormControl>
                      </div> */}
                    </div>
                  ) : null}

                  <button
                    class="update-btn-profile"
                    type="button"
                    onClick={onPOIDataSubmit}
                  >
                    {isForUpdate ? "UPDATE" : "SUBMIT"}
                    {/* {newOrUpdateProfile ? 'SUBMIT' : 'UPDATE'} */}
                  </button>
                </div>
              </Box>
            </Modal>
            <Modal
              open={isAddLayerOpen}
              onClose={handleAddLayerClose}
              aria-labelledby="modal-modal-title"
              aria-describedby="modal-modal-description"
            >
              <AddLayerPopup
                createLayer={createLayer}
                layerData={layerObj}
                updateLayer={updateLayer}
              />
            </Modal>
            <Modal
              open={isAddUserOpen}
              onClose={handleAddUserPopupClose}
              aria-labelledby="modal-modal-title"
              aria-describedby="modal-modal-description"
            >
              <CreateUser userData={selectedUser} createUser={createUser} />
            </Modal>
            <Map
              zoom={zoomLevel}
              center={mapCenterPosition}
              scrollWheelZoom={true}
              maxZoom={18}
              minZoom={4}
              style={{ height: "100vh", width: "100%" }}
            >
              {/* <FeatureGroup>
<EditControl position ="topright"></EditControl>

          </FeatureGroup> */}
              <MapSetPosComponent/>
              <TileLayer
                url={`https://${process.env.REACT_APP_OSM_HOST}:${process.env.REACT_APP_OSM_PORT}/tile/{z}/{x}/{y}.png`}
                //url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                //url="https://192.168.1.220:30802/tile/{z}/{x}/{y}.png"
                attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
              />
              <LayersControl>
                <Overlay checked name="Fences">
                  <FeatureGroup>
                    <EditControl
                      position="bottomright"
                      //onEdited={_onEditPath}
                      onCreated={_onCreate}
                      //onDeleted={_onDelete}
                      draw={{
                        rectangle: false,
                        circle: false,
                        polyline: false,
                        circlemarker: false,
                      }}
                      edit={{
                        remove: false,
                        edit: false
                      }}
                    />
                    {/* {fencesCoords &&

                      (
                        <Polygon color="green" fillColor="green" positions={fencesCoords}
                                                    onClick={() => console.log("...................................")}

                        ></Polygon>


                      )
                    } */}

                    {fencesCoords &&
                      fencesCoords.map((fence, index) => {
                        return (
                          <Polygon
                            color={fenceHighlight == index ? 'red' : 'green'}
                            key={index}
                            fillColor="yellow"
                            positions={fence}
                            onClick={() => onMapPolygonClick(index)}
                          ></Polygon>
                        );
                      })}
                  </FeatureGroup>
                </Overlay>

                <Overlay checked name="Users">
                  <LayerGroup>
                    {filteredUsersList &&
                      filteredUsersList.map((userData, index) => {
                        if (userData.message !== "") {
                          return (
                            <Marker
                              key={index}
                              icon={L.icon({
                                iconUrl: getIconUrl(userData),
                                iconSize: [45, 45],
                              })}
                              position={[
                                userData.message.latitude.location,
                                userData.message.longitude.location,
                              ]}
                            >
                              <Popup>
                                <div>
                                  <h2>{getCallieIdToShow(userData.userName)} {userData.userType} {getUeType(userData.ueType)}</h2>
                                  {(userData.ActiveFA != "") ? <h2>{userData.ActiveFA}</h2> : null}
                                  <h2>Last Seen:- {lastSeen(userData.lastUpdated)}</h2>
                                  <div class="loctn-PopUp-Communicatn-Card">
                                    <button onClick={() => startCall(userData.mcpttUri)} >Start call</button>  
                                          
                                    <button> 
                                        <HotKeys
                                          divclass='f4'
                                          // Icon='feather icon-mail'
                                          title='Send SDS'
                                          type='SDS'
                                          sub={{contactName:userData.userName , mcptt_uri:userData.mcpttUri ,tetra_id: userData.userId ,  mcptt_id:userData.mcpttUri}}
                                        />
                                   </button>
                                  </div>
                                  {filteredUsersList.map((user, idx) => {
                                    if (idx != index) {
                                      if (zoomLevel == 20 && ((Math.abs(user.message.latitude.location - userData.message.latitude.location) <= 0.000025) && (Math.abs(user.message.longitude.location - userData.message.longitude.location) <= 0.000025))) {
                                        return <div>
                                          <h2>{getCallieIdToShow(user.userName)} {user.userType} {getUeType(user.ueType)}</h2>
                                          {(user.ActiveFA != "") ? <h2>{user.ActiveFA}</h2> : null}
                                          <h2>Last Seen:- {lastSeen(user.lastUpdated)}</h2>
                                          <div class="loctn-PopUp-Communicatn-Card">
                                            <button onClick={() => startCall(user.mcpttUri)} >Start call</button>  
                                          
                                            <button> 
                                              <HotKeys
                                                 divclass='f4'
                                                 // Icon='feather icon-mail'
                                                 title='Send SDS'
                                                 type='SDS'
                                                 sub={{contactName:user.userName , mcptt_uri:user.mcpttUri ,tetra_id: user.userId ,  mcptt_id:user.mcpttUri}}
                                              />
                                            </button>
                                          </div>
                                        </div>
                                      }
                                      if (zoomLevel == 19 && ((Math.abs(user.message.latitude.location - userData.message.latitude.location) <= 0.00005) && (Math.abs(user.message.longitude.location - userData.message.longitude.location) <= 0.00005))) {
                                        return <div>
                                          <h2>{getCallieIdToShow(user.userName)} {user.userType} {getUeType(user.ueType)}</h2>
                                          {(user.ActiveFA != "") ? <h2>{user.ActiveFA}</h2> : null}
                                          <h2>Last Seen:- {lastSeen(user.lastUpdated)}</h2>
                                          <div class="loctn-PopUp-Communicatn-Card">
                                            <button onClick={() => startCall(user.mcpttUri)} >Start call</button>  
                                          
                                            <button> 
                                              <HotKeys
                                                 divclass='f4'
                                                 // Icon='feather icon-mail'
                                                 title='Send SDS'
                                                 type='SDS'
                                                 sub={{contactName:user.userName , mcptt_uri:user.mcpttUri ,tetra_id: user.userId ,  mcptt_id:user.mcpttUri}}
                                              />
                                            </button>
                                          </div>
                                        </div>
                                      }
                                      if (zoomLevel == 18 && ((Math.abs(user.message.latitude.location - userData.message.latitude.location) <= 0.000125) && (Math.abs(user.message.longitude.location - userData.message.longitude.location) <= 0.000125))) {
                                        return <div>
                                          <h2>{getCallieIdToShow(user.userName)} {user.userType} {getUeType(user.ueType)}</h2>
                                          {(user.ActiveFA != "") ? <h2>{user.ActiveFA}</h2> : null}
                                          <h2>Last Seen:- {lastSeen(user.lastUpdated)}</h2>
                                          <div class="loctn-PopUp-Communicatn-Card">
                                            <button onClick={() => startCall(user.mcpttUri)} >Start call</button>  
                                          
                                            <button> 
                                              <HotKeys
                                                 divclass='f4'
                                                 // Icon='feather icon-mail'
                                                 title='Send SDS'
                                                 type='SDS'
                                                 sub={{contactName:user.userName , mcptt_uri:user.mcpttUri ,tetra_id: user.userId ,  mcptt_id:user.mcpttUri}}
                                              />
                                            </button>
                                          </div>
                                        </div>
                                      }
                                      if (zoomLevel == 17 && ((Math.abs(user.message.latitude.location - userData.message.latitude.location) <= 0.00025) && (Math.abs(user.message.longitude.location - userData.message.longitude.location) <= 0.00025))) {
                                        return <div>
                                          <h2>{getCallieIdToShow(user.userName)} {user.userType} {getUeType(user.ueType)}</h2>
                                          {(user.ActiveFA != "") ? <h2>{user.ActiveFA}</h2> : null}
                                          <h2>Last Seen:- {lastSeen(user.lastUpdated)}</h2>
                                          <div class="loctn-PopUp-Communicatn-Card">
                                            <button onClick={() => startCall(user.mcpttUri)} >Start call</button>  
                                          
                                            <button> 
                                              <HotKeys
                                                 divclass='f4'
                                                 // Icon='feather icon-mail'
                                                 title='Send SDS'
                                                 type='SDS'
                                                 sub={{contactName:user.userName , mcptt_uri:user.mcpttUri ,tetra_id: user.userId ,  mcptt_id:user.mcpttUri}}
                                              />
                                            </button>
                                          </div>
                                        </div>
                                      }
                                      if (zoomLevel == 16 && ((Math.abs(user.message.latitude.location - userData.message.latitude.location) <= 0.0005) && (Math.abs(user.message.longitude.location - userData.message.longitude.location) <= 0.0005))) {
                                        return <div>
                                          <h2>{getCallieIdToShow(user.userName)} {user.userType} {getUeType(user.ueType)}</h2>
                                          {(user.ActiveFA != "") ? <h2>{user.ActiveFA}</h2> : null}
                                          <h2>Last Seen:- {lastSeen(user.lastUpdated)}</h2>
                                          <div class="loctn-PopUp-Communicatn-Card">
                                            <button onClick={() => startCall(user.mcpttUri)} >Start call</button>  
                                          
                                            <button> 
                                              <HotKeys
                                                 divclass='f4'
                                                 // Icon='feather icon-mail'
                                                 title='Send SDS'
                                                 type='SDS'
                                                 sub={{contactName:user.userName , mcptt_uri:user.mcpttUri ,tetra_id: user.userId ,  mcptt_id:user.mcpttUri}}
                                              />
                                            </button>
                                          </div>
                                        </div>
                                      }
                                      if (zoomLevel == 15 && ((Math.abs(user.message.latitude.location - userData.message.latitude.location) <= 0.001) && (Math.abs(user.message.longitude.location - userData.message.longitude.location) <= 0.001))) {
                                        return <div>
                                          <h2>{getCallieIdToShow(user.userName)} {user.userType} {getUeType(user.ueType)}</h2>
                                          {(user.ActiveFA != "") ? <h2>{user.ActiveFA}</h2> : null}
                                          <h2>Last Seen:- {lastSeen(user.lastUpdated)}</h2>
                                          <Button style={{ marginLeft: "100px", backgroundColor: "#1FAC4C", color: "white" }} variant="contained" onClick={() => startCall(user.mcpttUri)} >Start call</Button>
                                          <div class="loctn-PopUp-Communicatn-Card">
                                            <button onClick={() => startCall(user.mcpttUri)} >Start call</button>  
                                          
                                            <button> 
                                              <HotKeys
                                                 divclass='f4'
                                                 // Icon='feather icon-mail'
                                                 title='Send SDS'
                                                 type='SDS'
                                                 sub={{contactName:user.userName , mcptt_uri:user.mcpttUri ,tetra_id: user.userId ,  mcptt_id:user.mcpttUri}}
                                              />
                                            </button>
                                          </div>
                                        </div>
                                      }
                                      if (zoomLevel == 14 && ((Math.abs(user.message.latitude.location - userData.message.latitude.location) <= 0.0025) && (Math.abs(user.message.longitude.location - userData.message.longitude.location) <= 0.0025))) {
                                        return <div>
                                          <h2>{getCallieIdToShow(user.userName)} {user.userType} {getUeType(user.ueType)}</h2>
                                          {(user.ActiveFA != "") ? <h2>{user.ActiveFA}</h2> : null}
                                          <h2>Last Seen:- {lastSeen(user.lastUpdated)}</h2>
                                          <Button style={{ marginLeft: "100px", backgroundColor: "#1FAC4C", color: "white" }} variant="contained" onClick={() => startCall(user.mcpttUri)} >Start call</Button>
                                          <div class="loctn-PopUp-Communicatn-Card">
                                            <button onClick={() => startCall(user.mcpttUri)} >Start call</button>  
                                          
                                            <button> 
                                              <HotKeys
                                                 divclass='f4'
                                                 // Icon='feather icon-mail'
                                                 title='Send SDS'
                                                 type='SDS'
                                                 sub={{contactName:user.userName , mcptt_uri:user.mcpttUri ,tetra_id: user.userId ,  mcptt_id:user.mcpttUri}}
                                              />
                                            </button>
                                          </div>
                                        </div>
                                      }
                                      if (zoomLevel == 13 && ((Math.abs(user.message.latitude.location - userData.message.latitude.location) <= 0.005) && (Math.abs(user.message.longitude.location - userData.message.longitude.location) <= 0.005))) {
                                        return <div>
                                          <h2>{getCallieIdToShow(user.userName)} {user.userType} {getUeType(user.ueType)}</h2>
                                          {(user.ActiveFA != "") ? <h2>{user.ActiveFA}</h2> : null}
                                          <h2>Last Seen:- {lastSeen(user.lastUpdated)}</h2>
                                          <Button style={{ marginLeft: "100px", backgroundColor: "#1FAC4C", color: "white" }} variant="contained" onClick={() => startCall(user.mcpttUri)} >Start call</Button>
                                          <div class="loctn-PopUp-Communicatn-Card">
                                            <button onClick={() => startCall(user.mcpttUri)} >Start call</button>  
                                          
                                            <button> 
                                              <HotKeys
                                                 divclass='f4'
                                                 // Icon='feather icon-mail'
                                                 title='Send SDS'
                                                 type='SDS'
                                                 sub={{contactName:user.userName , mcptt_uri:user.mcpttUri ,tetra_id: user.userId ,  mcptt_id:user.mcpttUri}}
                                              />
                                            </button>
                                          </div>
                                        </div>
                                      }
                                      if (zoomLevel == 12 && ((Math.abs(user.message.latitude.location - userData.message.latitude.location) <= 0.011) && (Math.abs(user.message.longitude.location - userData.message.longitude.location) <= 0.011))) {
                                        return <div>
                                          <h2>{getCallieIdToShow(user.userName)} {user.userType} {getUeType(user.ueType)}</h2>
                                          {(user.ActiveFA != "") ? <h2>{user.ActiveFA}</h2> : null}
                                          <h2>Last Seen:- {lastSeen(user.lastUpdated)}</h2>
                                          <Button style={{ marginLeft: "100px", backgroundColor: "#1FAC4C", color: "white" }} variant="contained" onClick={() => startCall(user.mcpttUri)} >Start call</Button>
                                          <div class="loctn-PopUp-Communicatn-Card">
                                            <button onClick={() => startCall(user.mcpttUri)} >Start call</button>  
                                          
                                            <button> 
                                              <HotKeys
                                                 divclass='f4'
                                                 // Icon='feather icon-mail'
                                                 title='Send SDS'
                                                 type='SDS'
                                                 sub={{contactName:user.userName , mcptt_uri:user.mcpttUri ,tetra_id: user.userId ,  mcptt_id:user.mcpttUri}}
                                              />
                                            </button>
                                          </div>
                                        </div>
                                      }
                                      return null
                                    }
                                  })}
                                </div>
                              </Popup>
                            </Marker>
                          );
                        }
                      })}
                  </LayerGroup>
                </Overlay>
                <Overlay checked name="POI">
                  <LayerGroup>
                    {POIrenderingList &&
                      POIrenderingList.map((poiData, index) => (
                        <Marker
                          key={index}
                          icon={markerIcon}
                          // onClick={() => onMarkerClick(coordinate)}
                          position={[
                            JSON.parse(poiData.coordinates)[0].lat,
                            JSON.parse(poiData.coordinates)[0].lng,
                          ]}
                        >
                          <Popup>
                            <div>
                              <h2>{poiData.title}</h2>
                              {/* <p>{coordinate.address}</p> */}
                            </div>
                          </Popup>
                        </Marker>
                      ))}
                  </LayerGroup>
                </Overlay>
              </LayersControl>
            </Map>
          </div>

          <div class="l2 wrap-1" style={{ flex: 2, height: "100vh" }}>
            {/* <label>{userlocation?userlocation:"NA"}</label> */}
            <Accordion
              style={{ backgroundColor: "#f5f5f528" }}
              expanded={expanded === "layers"}
              onChange={handleChange("layers")}
            >
              <AccordionSummary
                style={{ backgroundColor: "#ffb01f", borderRadius: 8 }}
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel1bh-content"
                id="panel1bh-header"
              >
                <div
                  style={{
                    width: "100%",
                    justifyContent: "flex-start",
                    alignItems: "center",
                    display: "flex",
                    flexDirection: "row",
                  }}
                >
                  <Typography sx={{ flexShrink: 0 }}>LAYERS</Typography>
                </div>
              </AccordionSummary>
              <AccordionDetails>
                <div style={{ width: "100%" }}>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      alignItems: "center",
                      width: "100%",
                      justifyContent: "space-between",
                    }}
                  >
                    <FormGroup>
                      <FormControlLabel
                        control={<Switch color="primary" />}
                        label={
                          <label style={{ color: "white" }}>Show all</label>
                        }
                        checked={isShowAllChecked}
                        onChange={handleShowAllLayer}
                      />
                    </FormGroup>

                    <Tooltip title="Add Layer">
                      <Button onClick={onAddNewLayerClick}>
                        <AddCircleOutline htmlColor="#4ddc4d" />
                      </Button>
                    </Tooltip>
                  </div>
                  <div
                    style={{
                      alignItems: "center",
                      justifyContent: "flex-start",
                      marginTop: 8,
                      borderRadius: 8,
                      width: "100%",
                      display: "flex",
                      flexDirection: "row",
                      backgroundColor:
                        selLayerIndex === -2
                          ? listSelectedColor
                          : listItemColor,
                      paddingTop: 20,
                      paddingBottom: 20,
                    }}
                  >
                    <label
                      style={{ flex: 1, paddingLeft: 10 }}
                      onClick={restoreAllLayer}
                    >
                      Default Layers
                    </label>
                  </div>

                  {layersList && (
                    <div
                      style={{
                        width: "100%",
                        display: "flex",
                        flexDirection: "column",
                        paddingTop: 10,
                        paddingBottom: 10,
                      }}
                    >
                      {layersList.map((item, index) => (
                        <LayerListItem
                          item={item}
                          itemIndex={index}
                          bgColor={
                            index === selLayerIndex
                              ? listSelectedColor
                              : listItemColor
                          }
                          deleteHandler={() => showDeleteDialog(item)}
                          editHandler={editLayerHandler}
                          onClick={onLayerSelectHandler}
                        />
                      ))}
                    </div>
                  )}
                </div>
              </AccordionDetails>
            </Accordion>

            <Accordion
              style={{ marginTop: 8, backgroundColor: "#f5f5f528" }}
              expanded={expanded === "users"}
              onChange={handleChange("users")}
            >
              <AccordionSummary
                style={{ backgroundColor: "#ffb01f", borderRadius: 8 }}
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel1bh-content"
                id="panel1bh-header"
              >
                <Typography sx={{ width: "33%", flexShrink: 0 }}>
                  USERS
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <div style={{ width: "100%" }}>
                  <div
                    style={{
                      width: "100%",
                      display: "flex",
                      flexDirection: "row",
                      alignItems: "center",
                      justifyContent: "flex-start",
                    }}
                  >
                    <FormGroup>
                      <FormControlLabel
                        control={<Switch color="primary" />}
                        label={<label style={{ color: "white" }}>User Filter</label>}
                        labelPlacement="start"
                        checked={isUserFilterChecked}
                        onChange={handleUserFilter}
                      />
                    </FormGroup>

                    <ModalBootStrap
                      show={isUserFilterModalOpen}
                      onHide={userFilterModalhandleClose}
                      scrollable={false}
                      size={"lg"}
                      aria-labelledby="contained-modal-title-vcenter"
                      centered
                      style={{ backgroundColor: " rgba(0,0,0,0.5)" }}
                    >
                      <ModalBootStrap.Header
                        closeButton
                        style={{ border: "0px", backgroundColor: "#282828" }}
                      >
                      <ModalBootStrap.Title>USER FILTER</ModalBootStrap.Title>
                      </ModalBootStrap.Header>
                      <ModalBootStrap.Body
                        style={{
                          bgcolor: "background.paper",
                          boxShadow: 1,
                          border: 2,
                          p: 1,
                          padding: "8px",
                          margin: "2px",
                          marginLeft: "20px",
                          marginRight: "20px"

                        }}
                        scrollable={true}
                      >
                        <UserFilterBody userFilter={userFilter}
                          setUserFilter={setUserFilter}
                          userFilterHandler={userFilterHandler}
                          setIsUserFilterModalOpen={setIsUserFilterModalOpen}
                          iconOptions={
                            faIcon.map((obj) =>
                            ({
                              value: obj.fa,
                              label: obj.fa,
                              icon: `assets/images/location/${obj.inactiveIcon}`
                            })
                            ).concat(
                              MapUEUsertype.map((obj) => (
                                {
                                  value: obj.ueType + "-" + obj.userType,
                                  label: obj.ueType + "-" + obj.userType,
                                  icon: `assets/images/location/${obj.inactiveIcon}`
                                }
                              ))
                            )
                          }
                        />
                      </ModalBootStrap.Body>
                    </ModalBootStrap>

                    {/* <Tooltip title="Add User">
                     <Button onClick={onAddUserClick}>
                       <AddCircleOutline htmlColor="#4ddc4d" />
                     </Button>
                   </Tooltip> */}
                  </div>
                  {filteredUsersList && (
                    <div
                      style={{
                        width: "100%",
                        display: "flex",
                        flexDirection: "column",
                        paddingTop: 10,
                        paddingBottom: 10,
                      }}
                    >
                      {filteredUsersList.map((item, index) => (
                        <MapUserListItem
                          item={item}
                          deleteUser={deleteUser}
                          edituser={onEditUserClick}
                          onClick={onUserClickHandler}
                        />
                      ))}
                    </div>
                  )}
                </div>
              </AccordionDetails>
            </Accordion>

            <Accordion
              style={{ marginTop: 8, backgroundColor: "#f5f5f528" }}
              expanded={expanded === "fences"}
              onChange={handleChange("fences")}
            >
              <AccordionSummary
                style={{ backgroundColor: "#ffb01f", borderRadius: 8 }}
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel1bh-content"
                id="panel1bh-header"
              >
                <Typography sx={{ width: "33%", flexShrink: 0 }}>
                  FENCES
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                {fenceList && (
                  <div
                    style={{
                      width: "100%",
                      display: "flex",
                      flexDirection: "column",
                      paddingTop: 10,
                      paddingBottom: 10,
                    }}
                  >
                    {fenceList.map((item, index) => (
                      <EntityListItem
                        item={item}
                        index={index}
                        deletePOI={showDeleteDialog}
                        editPOI={editObject}
                        onClick={() => onFenceClickHandler(item, index)}
                      />
                    ))}
                  </div>
                )}
              </AccordionDetails>
            </Accordion>

            <Accordion
              style={{ marginTop: 8, backgroundColor: "#f5f5f528" }}
              expanded={expanded === "poi"}
              onChange={handleChange("poi")}
            >
              <AccordionSummary
                style={{ backgroundColor: "#ffb01f", borderRadius: 8 }}
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel1bh-content"
                id="panel1bh-header"
              >
                <div
                  style={{
                    borderRadius: 8,
                    width: "100%",
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "flex-start",
                  }}
                >
                  <Typography>POI</Typography>
                </div>
              </AccordionSummary>
              <AccordionDetails>
                {POIList && (
                  <div
                    style={{
                      width: "100%",
                      display: "flex",
                      flexDirection: "column",
                      paddingTop: 10,
                      paddingBottom: 10,
                    }}
                  >
                    {POIList.map((item, index) => (
                      <EntityListItem
                        item={item}
                        index={index}
                        deletePOI={showDeleteDialog}
                        editPOI={editObject}
                        onClick={() => onPOIClickHandler(item, index)}
                      />
                    ))}
                  </div>
                )}
              </AccordionDetails>
            </Accordion>
          </div>
        </div>
      </div>
      {selectedLayerObj && (
        <DeleteDialog
          open={isOpenDelDialog}
          deleteDailogHandler={deleteDailogHandler}
          layerType={selectedLayerObj.layerType ? selectedLayerObj.layerType : selectedLayerObj.title ? selectedLayerObj.title : ""}
        />
      )}
    </div>
  );
};

// const mapDispatchToProps = dispatch => bindActionCreators({
//   // updateUserLocation
// }, dispatch)

Location.propTypes = propTypes;

const mapStateToProps = ({ auth, location, logs, communication, registeredUsersList }) => {
  const { user } = auth;
  const { contactList } = communication;
  const { userlocation, geoFenceUpdate, zoomLevel, mapCenterPosition, fenceHighlight, POIHighlight } = location;
  const { activeTab } = logs;
  const { regUsersList } = registeredUsersList;

  console.log('zoomLevel and mapCenterPosition', zoomLevel, mapCenterPosition)
  return {
    user,
    userlocation,
    geoFenceUpdate,
    activeTab,
    contactList,
    zoomLevel,
    mapCenterPosition,
    fenceHighlight,
    POIHighlight,
    regUsersList
  };
};

export default connect(mapStateToProps, {
  // showMessage,
  addDGNA,
  sendGroupCall,
  updateTab,
  sendIndividualCall,
  sendIndividualCallAction,
  navigateToCom: () => push("/communication"),
  setMapCenterPosition,
  setZoomLevel,
  onFenceHighlight,
  onPOIHighlight
})(Location);
