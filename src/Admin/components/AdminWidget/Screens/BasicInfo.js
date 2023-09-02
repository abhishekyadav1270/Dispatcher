/** @format */

import React, { useState, useEffect, Fragment } from "react";
import { createTheme } from "@material-ui/core/styles";
import { makeStyles, ThemeProvider } from "@material-ui/styles";
import Checkbox from "@material-ui/core/Checkbox";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Switch from "@material-ui/core/Switch";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import { connect } from "react-redux";
import Autocomplete from "@material-ui/lab/Autocomplete";
import TextField from "@material-ui/core/TextField";
import { fetchOrgListAdmin } from "../../../../modules/adminstate";
import UserPermissions from "./UserPermissions";
import {
  fetchUserProfileWithAttachedFAS,
  updateUserProfileWithAttachedFAS,
  getIWFMapByMCPTTID,
  resetIWFMapByMCPTTID,
  fetchMcpttIdAndUri,
} from "../../../../modules/adminstate";
import { DefaultBasicInfoData } from "../../../basicinfodata";
import IwFMapView from "../AddIwfMap/IwFMapView";
import CADCallConfig from "./CADCallConfig";
import CallForwardingConfig from "./CallForwardingConfig";

const BasicInfo = (props) => {
  const {
    falist,
    orglist,
    userProfileWithAttachedFA,
    fetchUserProfileWithAttachedFAS,
    updateUserProfileWithAttachedFAS,
    fetchOrgListAdmin,
    purpose,
    configDomain,
    configCadCall,
    configCallForwarding,
    getIWFMapByMCPTTID,
    mcpttidIWFMap,
    iwfMaplist,
    resetIWFMapByMCPTTID,
    mcpttidAndUri,
    fetchMcpttIdAndUri,
  } = props;
  let basicInfoObj = React.useRef(null);
  const [addedFAs, setaddedFAs] = useState([]);
  const [vlFunctionalAlias, setvlFunctionalAlias] = useState("");
  const [selectedUserType, setSelectedUserType] = useState("Dispatcher");
  const [selectedPriority, setSelectedPriority] = useState("1");
  const [emptyCallForwardTarget, setEmptyCallForwardTarget] = useState(false);
  const [selectedRoleType, setSelectedRoleType] = useState("Dispatcher");
  const [emptyMCXId, setEmptyMCXId] = useState(false);
  const [emptyPassword, setEmptyPassword] = useState(false);
  const [passwordMitchMatch, setPasswordMitchMatch] = useState(false);
  const [basicdetails, setbasicdetails] = useState(DefaultBasicInfoData);
  const [newOrUpdateProfile, setNewOrUpdateProfile] = useState(true);
  const [tetraDisable, settetraDisable] = useState(false);
  const [fullyIWF, setFullyIWF] = useState(false);
  //------------------------------------------------------
  const [selectedUEType, setSelectedUEType] = useState("");
  const [addedUEInfo, setaddedInfo] = useState([]);

  const [isMCXDataIdDisabled, setIsMCXDataIdDisabled] = useState(true);
  const [isMCXVideoIdDisabled, setIsMCXVideoIdDisabled] = useState(true);
  const [emptyDefaultAuthorizer, setEmptyDefaultAuthorizer] = useState(false);
  //------------------------------------------------------

  const RoleTypeOptions = [
    { text: "ADMIN", value: "Admin" },
    { text: "DISPATCHER", value: "Dispatcher" },
  ];

  const UserTypeOptions = [
    { text: "DISPATCHER", value: "Dispatcher" },
    { text: "STATION MASTER", value: "stationMaster" },
    { text: "CONTROLLLER", value: "controller" },
    { text: "DRIVER", value: "Driver" },
    { text: "GUARD", value: "Guard" },
    { text: "CABINUSER-POST PoC", value: "cabinUser" },
    { text: "CROSSINGUSER-POST PoC", value: "crossingUser" },
  ];

  const UETypeOptions = [
    { text: "TRCP", value: "Consort-TRCP" },
    { text: "HANDSET", value: "Consort-Handset" },
    { text: "RCP", value: "Consort-RCP" },
    { text: "DISPATCHER", value: "Dispatcher" },
  ];

  const priorityArr = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

  const isEmptyObject = (obj) => {
    return (
      obj &&
      Object.keys(obj).length === 0 &&
      Object.getPrototypeOf(obj) === Object.prototype
    );
  };

  // console.lof("mcpttId&URI --" ,mcpttidAndUri)

  useEffect(() => {
    fetchMcpttIdAndUri();
    console.log(
      "basicInfo basic",
      props.basicInfoData,
      configDomain,
      mcpttidAndUri,
      configCadCall,
      configCallForwarding
    );
    resetIWFMapByMCPTTID();
    if (props.basicInfoData) {
      basicInfoObj.current = props.basicInfoData;
      setbasicdetails(props.basicInfoData);
      if (props.basicInfoData.id && props.basicInfoData.id.length !== 0) {
        setNewOrUpdateProfile(false);
      } else {
        setNewOrUpdateProfile(true);
      }
      if (
        props.basicInfoData.mcpttId &&
        props.basicInfoData.mcpttId.length !== 0
      ) {
        setTimeout(() => {
          fetchUserProfileWithAttachedFAS(props.basicInfoData.mcpttId);
        }, 1000);

        setTimeout(() => {
          getIWFMapByMCPTTID(props.basicInfoData.mcpttId);
        }, 1500);
      }
    } else {
      setSelectedRoleType("Dispatcher");
      setNewOrUpdateProfile(true);

      let ttUser = false;
      if (
        configDomain &&
        configDomain.iwfs &&
        configDomain.iwfs.length > 0 &&
        configDomain.mcxDomain &&
        configDomain.mcxDomain !== ""
      ) {
        // Enable tetra in this case
        console.log("tetra domain check running ", " COND 1");
      } else {
        console.log("tetra domain check running ", " else");
        settetraDisable(true);
        if (configDomain && configDomain.iwfs && configDomain.iwfs.length > 0) {
          ttUser = true;
          console.log("tetra domain check running ", " COND 2");
        } else if (configDomain.mcxDomain && configDomain.mcxDomain !== "") {
          console.log("tetra domain check running ", " COND 3");
          ttUser = false;
        }
      }
      let defDetail = {
        ...DefaultBasicInfoData,
        TetraUser: ttUser,
      };
      basicInfoObj.current = defDetail;
      setbasicdetails(defDetail);
    }
  }, []);

  useEffect(() => {
    console.log("iwfmap basicInfo...", mcpttidIWFMap);
    if (purpose === "edit" && mcpttidIWFMap && basicdetails) {
      if (!isEmptyObject(mcpttidIWFMap)) {
        console.log("iwfmap basicInfo inside...", mcpttidIWFMap);
        setbasicdetails({
          ...basicInfoObj.current,
          iwf: mcpttidIWFMap,
        });
        basicInfoObj.current.iwf = mcpttidIWFMap;

        if (configDomain && configDomain.iwfs && configDomain.iwfs.length > 0) {
          for (let index = 0; index < configDomain.iwfs.length; index++) {
            const element = configDomain.iwfs[index];
            if (
              element.type &&
              element.type.toLocaleUpperCase() ==
                mcpttidIWFMap.type.toLocaleUpperCase()
            ) {
              if (
                element.type &&
                element.type.toLocaleUpperCase().includes("PBX")
              ) {
                setFullyIWF(false);
              } else {
                setFullyIWF(true);
              }
              break;
            }
          }
        } else {
          setFullyIWF(false);
        }
      }
    }
  }, [mcpttidIWFMap]);

  useEffect(() => {
    console.log(
      "userProfileWithAttachedFA useeffect...",
      userProfileWithAttachedFA
    );
    if (userProfileWithAttachedFA && isEmptyObject(userProfileWithAttachedFA)) {
      console.log("userProfileWithAttachedFA useeffect empty");
      return;
    }

    if (props.basicInfoData) {
      if (
        userProfileWithAttachedFA.faList &&
        userProfileWithAttachedFA.faList.length > 0
      ) {
        let updatedFAs = [];
        userProfileWithAttachedFA.faList.forEach((element) => {
          //console.log("useEffect fa added", element)
          let ueType = element.ueType ? element.ueType : "Dispatcher";
          let autoActivate = element.default
            ? JSON.parse(element.default)
            : false;
          let faDefalut = { ...element, default: autoActivate, ueType: ueType };
          updatedFAs = [...updatedFAs, faDefalut];
        });
        setaddedFAs(updatedFAs);
      }
      let orgId = props.basicInfoData.orgId ? props.basicInfoData.orgId : "0";
      let VideoEnable = props.basicInfoData.VideoEnable
        ? props.basicInfoData.VideoEnable
        : false;
      let userType = props.basicInfoData.userType
        ? props.basicInfoData.userType
        : "Dispatcher";
      let broadCastCall = props.basicInfoData.broadCastCall
        ? props.basicInfoData.broadCastCall
        : false;
      let priority = props.basicInfoData.priority
        ? props.basicInfoData.priority
        : "1";
      let mcxDataIdText = props.basicInfoData.mcxDataIdText
        ? props.basicInfoData.mcxDataIdText
        : "";
      let mcxDataID = props.basicInfoData.mcxDataID
        ? props.basicInfoData.mcxDataID
        : false;
      let mcxVideoIdText = props.basicInfoData.mcxVideoIdText
        ? props.basicInfoData.mcxVideoIdText
        : "";
      let mcxVideoID = props.basicInfoData.mcxVideoID
        ? props.basicInfoData.mcxVideoID
        : false;
      let userName = props.basicInfoData.userName
        ? props.basicInfoData.userName
        : "";
      let TetraUser = props.basicInfoData.tetraUser
        ? props.basicInfoData.tetraUser
        : false;
      let phoneNumber = props.basicInfoData.phoneNumber
        ? props.basicInfoData.phoneNumber
        : "";
      let mcpttId = props.basicInfoData.mcpttId
        ? props.basicInfoData.mcpttId
        : "";
      let Email = props.basicInfoData.Email ? props.basicInfoData.Email : "";
      let Role = "Dispatcher";
      let cadCallData = props.basicInfoData.cadCallData
        ? props.basicInfoData.cadCallData
        : {
            allowPrivateCallParticipation: true,
            incomingAuthorizationRequired: false,
            allowPrivateCallToAnyUser: false,
            outgoingAuthorizationRequired: false,
            defaultAuthorizer: "",
          };
      let callForwardingData = props.basicInfoData.callForwardingData
        ? props.basicInfoData.callForwardingData
        : {
            allowCallForwarding: false,
            allowCallForwardManualInput: false,
            callForwardingTarget: "",
            callForwardingOn: false,
            callForwardingCondition: "",
            callForwardingNoAnswerTimeout: "",
            allowCallForwardManualInputTarget: "",
          };
      let permissions = {
        trainTab: true,
        communicationTab: true,
        alertTab: true,
        baseStation: true,
        locationTab: true,
        recordingsTab: true,
        grabAllowed: "default",
        trainMovement: "default",
      };
      if (props.basicInfoData.Role.count > 0) {
        setSelectedRoleType(props.basicInfoData.Role[0]);
        Role = props.basicInfoData.Role[0];
      } else {
        setSelectedRoleType("Dispatcher");
      }
      if (userProfileWithAttachedFA.orgId) {
        orgId = userProfileWithAttachedFA.orgId;
      }
      if (userProfileWithAttachedFA.hasOwnProperty("VideoEnable")) {
        VideoEnable = userProfileWithAttachedFA.VideoEnable;
      }
      if (userProfileWithAttachedFA.hasOwnProperty("broadCastCall")) {
        broadCastCall = userProfileWithAttachedFA.broadCastCall;
      }
      if (userProfileWithAttachedFA.hasOwnProperty("priority")) {
        priority = userProfileWithAttachedFA.priority;
        setSelectedPriority(priority);
      }
      if (userProfileWithAttachedFA.hasOwnProperty("userType")) {
        userType = userProfileWithAttachedFA.userType;
        setSelectedUserType(userType);
      }
      if (userProfileWithAttachedFA.hasOwnProperty("mcDataId")) {
        mcxDataIdText = userProfileWithAttachedFA.mcDataId;
        if (userProfileWithAttachedFA.mcDataId.length > 0) {
          mcxDataID = true;
          setIsMCXDataIdDisabled(false);
        } else {
          mcxDataID = false;
          setIsMCXDataIdDisabled(true);
        }
      }
      if (userProfileWithAttachedFA.hasOwnProperty("mcVideoId")) {
        mcxVideoIdText = userProfileWithAttachedFA.mcVideoId;
        if (userProfileWithAttachedFA.mcVideoId.length > 0) {
          mcxVideoID = true;
          setIsMCXVideoIdDisabled(false);
        } else {
          mcxVideoID = false;
          setIsMCXVideoIdDisabled(true);
        }
      }
      if (userProfileWithAttachedFA.hasOwnProperty("cadCallData")) {
        cadCallData = { ...userProfileWithAttachedFA.cadCallData };
      }
      if (userProfileWithAttachedFA.hasOwnProperty("callForwardingData")) {
        callForwardingData = {
          ...userProfileWithAttachedFA.callForwardingData,
        };
      }
      if (userProfileWithAttachedFA.hasOwnProperty("permissions")) {
        permissions = { ...userProfileWithAttachedFA.permissions };
      }

      if (userProfileWithAttachedFA.hasOwnProperty("tetra")) {
        TetraUser = userProfileWithAttachedFA.tetra;
      }

      if (userProfileWithAttachedFA.hasOwnProperty("UEInfo")) {
        if (userProfileWithAttachedFA.UEInfo.length > 0) {
          let ueTypeList = [];
          userProfileWithAttachedFA.UEInfo.forEach((element) => {
            let UEInfoData = UETypeOptions.filter(
              (ues) => ues.value === element.value
            );
            if (UEInfoData.length > 0) {
              let elm = UEInfoData[0];
              let isPrimary = false;
              if (element.primary && JSON.parse(element.primary)) {
                isPrimary = JSON.parse(element.primary);
              }
              let UEInfoObj = {
                ...elm,
                noOfReg: element.noOfReg ? element.noOfReg : "1",
                primary: isPrimary,
              };
              ueTypeList = [...ueTypeList, UEInfoObj];
            }
          });
          if (ueTypeList.length > 0) {
            setaddedInfo(ueTypeList);
          }
          console.log("basicdetails ueTypeList...", ueTypeList);
        }
      }
      //console.log('basicdetails tetra out...',userProfileWithAttachedFA, TetraUser) props.basicInfoData
      console.log(
        "basicdetails before update information...",
        basicdetails,
        basicInfoObj.current
      );
      setbasicdetails({
        ...basicInfoObj.current,
        orgId: orgId,
        VideoEnable: VideoEnable,
        userType: userType,
        priority: priority,
        broadCastCall: broadCastCall,
        mcxDataIdText: mcxDataIdText,
        mcxDataID: mcxDataID,
        mcxVideoIdText: mcxVideoIdText,
        mcxVideoID: mcxVideoID,
        Role: Role,
        TetraUser: TetraUser,
        userName: userName,
        phoneNumber: phoneNumber,
        mcpttId: mcpttId,
        Email: Email,
        cadCallData: cadCallData,
        callForwardingData: callForwardingData,
        permissions: permissions,
      });

      basicInfoObj.current = {
        ...basicInfoObj.current,
        orgId: orgId,
        VideoEnable: VideoEnable,
        userType: userType,
        mcxDataIdText: mcxDataIdText,
        mcxDataID: mcxDataID,
        mcxVideoIdText: mcxVideoIdText,
        mcxVideoID: mcxVideoID,
        Role: Role,
        TetraUser: TetraUser,
        userName: userName,
        phoneNumber: phoneNumber,
        mcpttId: mcpttId,
        Email: Email,
        cadCallData: cadCallData,
        callForwardingData: callForwardingData,
        permissions: permissions,
      };
    }
  }, [userProfileWithAttachedFA]);

  const useStyles = makeStyles((theme) => ({
    root: {
      width: "100%",
      maxWidth: 360,
    },
    formControl: {
      width: "100%",
      marginTop: "5px",
    },
    formControlFA: {
      width: "80%",
      height: "60px",
      marginTop: "5px",
    },
    listMember_all: {
      // width: 250,
      maxHeight: 200,
    },
    listItemFA: {
      padding: "5px",
      fontFamily: "Muli",
    },
    tetraSwitch: {
      fontFamily: "Muli",
      marginTop: "2px",
      marginRight: "1px",
      marginLeft: "0px",
    },
    noOfRegTextField: {
      width: "40%",
      height: "25px",
    },
    ueInfoList: {
      padding: "5px",
      fontFamily: "Muli",
    },
    formControlUEType: {
      width: "80%",
      height: "60px",
      marginTop: "5px",
    },
    mcxDataIdInput: {
      backgroundColor: "rgb(232, 232, 232) !important",
    },
    tickSize: {
      transform: "scale(1.3)",
      marginLeft: "20px",
    },
    ml0: {
      marginTop: "10px",
    },
    mleft0: {
      marginLeft: "0px",
    },
    errorIndicator: {
      background: "#ffeded",
    },
  }));

  const theme = createTheme({
    palette: {
      primary: {
        main: "#006400",
      },
      secondary: {
        main: "#fdce2a",
      },
    },
  });

  const userNameChangeHandler = (e) => {
    setbasicdetails({
      ...basicdetails,
      userName: e.target.value,
      mcpttId: e.target.value,
    });

    if (e.target.value.length > 0) {
      setEmptyMCXId(false);
    } else {
      setEmptyMCXId(true);
    }
  };

  const userPwdChangeHandler = (e) => {
    setbasicdetails({
      ...basicdetails,
      password: e.target.value,
    });
    if (e.target.value.length > 7) {
      setEmptyPassword(false);
    } else {
      setEmptyPassword(true);
    }
  };

  const userCnfPwdChangeHandler = (e) => {
    setbasicdetails({
      ...basicdetails,
      confirmpassword: e.target.value,
    });
    if (e.target.value.length > 0 && e.target.value === basicdetails.password) {
      setPasswordMitchMatch(false);
    } else {
      setPasswordMitchMatch(true);
    }
  };

  const tetraUserChangeHandler = (e) => {
    setbasicdetails({
      ...basicdetails,
      TetraUser: e.target.checked,
    });

    if (e.target.checked == false) {
      setFullyIWF(false);
    } else {
      if (configDomain && configDomain.iwfs && configDomain.iwfs.length > 0) {
        for (let index = 0; index < configDomain.iwfs.length; index++) {
          const element = configDomain.iwfs[index];
          if (basicdetails && basicdetails.iwf && basicdetails.iwf.type) {
            if (
              element.type &&
              element.type.toLocaleUpperCase() ==
                basicdetails.iwf.type.toLocaleUpperCase()
            ) {
              if (
                element.type &&
                element.type.toLocaleUpperCase().includes("PBX")
              ) {
                setFullyIWF(false);
              } else {
                setFullyIWF(true);
              }
              break;
            }
          } else {
            setFullyIWF(false);
          }
        }
      } else {
        setFullyIWF(false);
      }
    }
  };

  const videoEnableChangeHandler = (e) => {
    setbasicdetails({
      ...basicdetails,
      VideoEnable: e.target.checked,
    });
  };

  const broadCastCallChangeHandler = (e) => {
    setbasicdetails({
      ...basicdetails,
      broadCastCall: e.target.checked,
    });
  };

  const handlePriorityChange = (e) => {
    setSelectedPriority(e.target.value);
    setbasicdetails({
      ...basicdetails,
      priority: e.target.value,
    });
  };

  const userContactNumberChangeHandler = (e) => {
    setbasicdetails({
      ...basicdetails,
      phoneNumber: e.target.value,
    });
  };

  const userMacxidChangeHandler = (e) => {
    setbasicdetails({
      ...basicdetails,
      mcpttId: e.target.value,
    });
    if (e.target.value.length > 0) {
      setEmptyMCXId(false);
    } else {
      setEmptyMCXId(true);
    }
  };

  const handleRoleTypeChange = (e) => {
    setSelectedRoleType(e.target.value);
    setbasicdetails({
      ...basicdetails,
      Role: e.target.value,
    });
  };

  const handleUserTypeChange = (e) => {
    setSelectedUserType(e.target.value);
    setbasicdetails({
      ...basicdetails,
      userType: e.target.value,
    });
  };

  // ---------------------------------------UE TYPE------------------

  const handleUETypeChangeHandler = (e) => {
    setSelectedUEType(e.target.value);
  };

  const handleUETypeChange = (e) => {
    let checkAlreadyAddedUEInfo = addedUEInfo.filter(
      (ues) => ues.value === selectedUEType
    );
    if (checkAlreadyAddedUEInfo.length === 0) {
      let UEInfoData = UETypeOptions.filter(
        (ues) => ues.value === selectedUEType
      );
      if (UEInfoData.length > 0) {
        let element = UEInfoData[0];
        let UEInfoObj = { ...element, noOfReg: "1", primary: false };
        let tempUEInfoArr = [...addedUEInfo, UEInfoObj];
        setaddedInfo(tempUEInfoArr);
      }
    }
  };

  const deleteUEInfo = (ue) => {
    let deleteUEs = addedUEInfo.filter((ues) => ues.text !== ue.text);
    setaddedInfo(deleteUEs);
  };

  const changeUEPrimary = (e, ue) => {
    let updatedUEInfo = [];
    addedUEInfo.forEach((element) => {
      if (ue.text === element.text) {
        let updatedElement = { ...element };
        updatedElement.primary = !ue.primary;
        updatedUEInfo = [...updatedUEInfo, updatedElement];
      } else {
        let updatedElement = { ...element };
        updatedElement.primary = false;
        updatedUEInfo = [...updatedUEInfo, updatedElement];
      }
    });
    setaddedInfo(updatedUEInfo);
  };

  const noOfRegChangeHandler = (e, ue) => {
    let updatedUEInfo = [];
    addedUEInfo.forEach((element) => {
      if (ue.text === element.text) {
        let updatedElement = { ...element };
        updatedElement.noOfReg = e.target.value;
        updatedUEInfo = [...updatedUEInfo, updatedElement];
      } else {
        updatedUEInfo = [...updatedUEInfo, element];
      }
    });
    setaddedInfo(updatedUEInfo);
  };

  //  --------------------MCXVIDEO & MCXDATA-------------------------
  const mcxDataIDEnableChangeHandler = (e) => {
    setbasicdetails({
      ...basicdetails,
      mcxDataID: e.target.checked,
    });
    setIsMCXDataIdDisabled((prev) => !prev);
  };

  const mcxDataIDChangeHandler = (e) => {
    setbasicdetails({
      ...basicdetails,
      mcxDataIdText: e.target.value,
    });
  };

  const mcxVideoIDEnableChangeHandler = (e) => {
    setbasicdetails({
      ...basicdetails,
      mcxVideoID: e.target.checked,
    });
    setIsMCXVideoIdDisabled((prev) => !prev);
  };

  const mcxVideoIDChangeHandler = (e) => {
    setbasicdetails({
      ...basicdetails,
      mcxVideoIdText: e.target.value,
    });
  };

  // ---------------------------------------------------------------------------

  const userEmailChangeHandler = (e) => {
    setbasicdetails({
      ...basicdetails,
      Email: e.target.value,
    });
  };

  const userOrgIdChangeHandler = (orgId) => {
    setbasicdetails({
      ...basicdetails,
      orgId: orgId,
    });
  };
  const functionalAliasChangeHandler = (e) => {
    setvlFunctionalAlias(e.target.value);
  };

  const OnAddFunctionalAlias = () => {
    let checkAlreadyAddedFA = addedFAs.filter(
      (fas) => fas.name === vlFunctionalAlias
    );
    if (checkAlreadyAddedFA.length === 0) {
      // get object from falist
      let faData = falist.filter((fas) => fas.name === vlFunctionalAlias);
      if (faData.length > 0) {
        let element = faData[0];
        console.log("OnAddFunctionalAlias", element);
        let faDefalut = { ...element, default: false };
        let addedFAsC = [...addedFAs, faDefalut];
        setaddedFAs(addedFAsC);
      }
    }
  };

  const deleteFAlias = (fa) => {
    let deleteFAs = addedFAs.filter((fas) => fas.name !== fa.name);
    setaddedFAs(deleteFAs);
  };

  const makeDefaultFA = (fa) => {
    let updatedFAs = [];
    addedFAs.forEach((element) => {
      if (fa.name === element.name) {
        let updatedElement = { ...element };
        updatedElement.default = !fa.default;
        updatedFAs = [...updatedFAs, updatedElement];
      } else {
        updatedFAs = [...updatedFAs, element];
      }
    });
    setaddedFAs(updatedFAs);
  };

  const handleFAUETypeChangeHandler = (e, fa) => {
    let updatedFAs = [];
    addedFAs.forEach((element) => {
      if (fa.name === element.name) {
        let updatedElement = { ...element };
        updatedElement.ueType = e.target.value;
        updatedFAs = [...updatedFAs, updatedElement];
      } else {
        updatedFAs = [...updatedFAs, element];
      }
    });
    setaddedFAs(updatedFAs);
  };

  let errors = {};
  const UpdateBasicDetails = (e) => {
    //console.log('basicInfo basicdetail s', basicdetails)
    e.preventDefault();
    console.log("basicInfo basicdetail s 00", basicdetails);

    if (basicdetails.cadCallData.allowPrivateCallParticipation === false) {
      // basicdetails.callForwardingData = {
      //   ...basicdetails.callForwardingData,
      //   allowCallForwarding: false,
      //   allowCallForwardManualInput: false,
      //   callForwardingTarget: "",
      // };
      basicdetails.cadCallData.incomingAuthorizationRequired = false;
      // setEmptyCallForwardTarget(false);
      setEmptyDefaultAuthorizer(false);
    }

    if (basicdetails.callForwardingData.allowCallForwarding === false) {
      basicdetails.callForwardingData = {
        ...basicdetails.callForwardingData,
        allowCallForwarding: false,
        allowCallForwardManualInput: false,
        callForwardingTarget: "",
      };
      setEmptyCallForwardTarget(false);
    }
    if (basicdetails.mcpttId.length === 0) {
      setEmptyMCXId(true);
    } else if (emptyDefaultAuthorizer) {
      return;
    } else if (emptyCallForwardTarget) {
      return;
    } else if (basicdetails.password.length === 0) {
      setEmptyPassword(true);
    } else if (basicdetails.password !== basicdetails.confirmpassword) {
      setPasswordMitchMatch(true);
    } else if (fullyIWF && !basicdetails.iwf.id && addedFA.length == 0) {
      console.log("basicInfo basicdetail s 1");
      errors["id"] = "Please enter iwf id";
      setbasicdetails({
        ...basicdetails,
        iwf: { ...basicdetails.iwf, errors: errors },
      });
    } else if (
      fullyIWF &&
      purpose !== "edit" &&
      iwfMaplist.some((obj) => obj.id === basicdetails.iwf.id) &&
      addedFA.length == 0
    ) {
      console.log("basicInfo basicdetail s 2");
      errors["id"] = "SSI already exits";
      setbasicdetails({
        ...basicdetails,
        iwf: { ...basicdetails.iwf, errors: errors },
      });
    } else if (
      fullyIWF &&
      (!basicdetails.iwf.type ||
        (basicdetails.iwf.type && basicdetails.iwf.type.length === 0)) &&
      addedFA.length == 0
    ) {
      // e.preventDefault()
      console.log("basicInfo basicdetail s 3");
      errors["type"] = "Please select iwf type";
      setbasicdetails({
        ...basicdetails,
        iwf: { ...basicdetails.iwf, errors: errors },
      });
    } else if (
      basicdetails &&
      basicdetails.iwf.type &&
      basicdetails.iwf.type.toLocaleUpperCase().includes("PBX") &&
      basicdetails.iwf.id &&
      basicdetails.iwf.id.length == 0
    ) {
      console.log('"Please add pbx mapping iwf id"');
    } else {
      console.log("userProfile before", userProfileWithAttachedFA);
      let fullDetail = { ...basicdetails };
      let userProfile = { ...userProfileWithAttachedFA };
      let tetra = false;
      if (
        basicdetails &&
        basicdetails.iwf.type &&
        basicdetails.iwf.type.toLocaleUpperCase().includes("PBX")
      ) {
        tetra = false;
        fullDetail.TetraUser = false;
      } else {
        if (basicdetails.TetraUser) {
          tetra = basicdetails.TetraUser;
        }
      }
      userProfile = {
        ...userProfile,
        profileName: basicdetails.mcpttId,
        mcpttId: basicdetails.mcpttId,
        CallerDescr: basicdetails.userName,
        orgId: basicdetails.orgId,
        subscriberType: basicdetails.Role,
        faList: [...addedFA],
        tetra: tetra,
        VideoEnable: basicdetails.VideoEnable,
        mcxDataIdText: basicdetails.mcxDataIdText,
        mcxVideoIdText: basicdetails.mcxVideoIdText,
        broadCastCall: basicdetails.broadCastCall,
        priority: basicdetails.priority,
        UEInfo: [...addedUEInfo],
        userType: basicdetails.userType,
        callForwardingData: basicdetails.callForwardingData,
        cadCallData: basicdetails.cadCallData,
        permissions: basicdetails.permissions,
      };

      if (configDomain && configDomain.iwfs && configDomain.iwfs.length > 0) {
        let mappedDomain = null;
        for (let index = 0; index < configDomain.iwfs.length; index++) {
          const element = configDomain.iwfs[index];
          if (basicdetails && basicdetails.iwf && basicdetails.iwf.type) {
            if (
              element.type &&
              element.type.toLocaleUpperCase() ==
                basicdetails.iwf.type.toLocaleUpperCase()
            ) {
              if (
                element.type &&
                element.type.toLocaleUpperCase().includes("PBX")
              ) {
                mappedDomain = configDomain.mcxDomain;
              } else {
                mappedDomain = element.mappedDomain;
              }
            }
          }
        }
        if (mappedDomain) {
          userProfile = { ...userProfile, domain: mappedDomain };
        } else {
          userProfile = {
            ...userProfile,
            domain: configDomain.mcxDomain ? configDomain.mcxDomain : "",
          };
        }
      } else {
        userProfile = {
          ...userProfile,
          domain: configDomain.mcxDomain ? configDomain.mcxDomain : "",
        };
      }
      if (
        basicdetails &&
        basicdetails.iwf.type &&
        basicdetails.iwf.type.toLocaleUpperCase().includes("PBX")
      ) {
        userProfile = {
          ...userProfile,
          iwf: {
            ...basicdetails.iwf,
            mcpttId: basicdetails.mcpttId,
            fa: "",
            iwfMapPurpose,
          },
        };
      } else {
        if (basicdetails.TetraUser && addedFA.length == 0) {
          //delete basicdetails.iwf.errors
          userProfile = {
            ...userProfile,
            iwf: {
              ...basicdetails.iwf,
              mcpttId: basicdetails.mcpttId,
              fa: "",
              iwfMapPurpose,
            },
          };
        }
      }

      console.log("basicInfo update userProfile after ", userProfile);
      updateUserProfileWithAttachedFAS(userProfile);

      console.log("basicInfo update basicdetails", fullDetail);
      resetIWFMapByMCPTTID();
      props.onBasicInfoUpdate(fullDetail);

      basicInfoObj.current = null;
      console.log("basicInfo current value", basicInfoObj.current);
    }
  };

  const iwfMapHandler = (value) => {
    console.log(
      "faSupportArray basicInfo iwfMapHandler...",
      basicdetails,
      value
    );
    setbasicdetails({
      ...basicdetails,
      iwf: value,
    });
    setaddedFAs([]);
    setvlFunctionalAlias("");
    if (configDomain && configDomain.iwfs && configDomain.iwfs.length > 0) {
      for (let index = 0; index < configDomain.iwfs.length; index++) {
        const element = configDomain.iwfs[index];
        if (value && value.type) {
          if (
            element.type &&
            element.type.toLocaleUpperCase() == value.type.toLocaleUpperCase()
          ) {
            if (
              element.type &&
              element.type.toLocaleUpperCase().includes("PBX")
            ) {
              setFullyIWF(false);
            } else {
              setFullyIWF(true);
            }
            break;
          }
        } else {
          setFullyIWF(false);
        }
      }
    } else {
      setFullyIWF(false);
    }
  };

  const updateUserPermissions = (permission) => {
    // console.log('permission update...', permission)
    setbasicdetails({
      ...basicdetails,
      permissions: permission,
    });
  };

  const updateUserCadCallData = (cadCallData) => {
    console.log("cadCall  update...", cadCallData);
    setbasicdetails({
      ...basicdetails,
      cadCallData: cadCallData,
    });
  };

  const updateCallForwardingData = (callForwardingData) => {
    console.log("callForwardData  update...", callForwardingData);
    setbasicdetails({
      ...basicdetails,
      callForwardingData: callForwardingData,
    });
  };

  const updateDefaultAuthorizerErr = (val) => {
    setEmptyDefaultAuthorizer(val);
  };

  const updateCallForwardTargetErr = (val) => {
    setEmptyCallForwardTarget(val);
  };

  const classes = useStyles();
  let domain = "";
  if (configDomain && configDomain.iwfs && configDomain.iwfs.length > 0) {
    for (let index = 0; index < configDomain.iwfs.length; index++) {
      const element = configDomain.iwfs[index];
      if (basicdetails && basicdetails.iwf && basicdetails.iwf.type) {
        if (
          element.type &&
          element.type.toLocaleUpperCase() ==
            basicdetails.iwf.type.toLocaleUpperCase()
        ) {
          if (
            element.type &&
            element.type.toLocaleUpperCase().includes("PBX")
          ) {
            domain = configDomain.mcxDomain;
          } else {
            domain = element.mappedDomain;
          }
          break;
        }
      } else {
        domain = configDomain.mcxDomain;
      }
    }
  } else {
    domain = configDomain.mcxDomain;
  }
  let faList = falist
    ? falist.filter((obj) => (obj.uri ? obj.uri.includes(domain) : false))
    : falist;
  let addedFA =
    addedFAs && basicdetails && basicdetails.TetraUser === true
      ? addedFAs.filter((obj) =>
          faList.some((faObj) => faObj.name === obj.name)
        )
      : addedFAs;
  let iwfMapPurpose =
    props.basicInfoData &&
    props.basicInfoData.TetraUser ===
      (basicdetails ? basicdetails.TetraUser : false)
      ? "edit"
      : "create";
  let orgList =
    basicdetails && basicdetails.TetraUser === true
      ? orglist.filter((obj) => obj.orgId !== "0")
      : orglist;

  const getIWfSwitchEnable = () => {
    let iwfSwitchEnable = false;
    if (basicdetails && basicdetails.TetraUser) {
      iwfSwitchEnable = true;
    } else {
      if (
        basicdetails &&
        basicdetails.iwf &&
        basicdetails.iwf.type &&
        basicdetails.iwf.type.toLocaleUpperCase().includes("PBX")
      ) {
        iwfSwitchEnable = true;
      }
    }
    return iwfSwitchEnable;
  };

  let isIwfSwitchEnable = getIWfSwitchEnable();
  //console.log('isIwfSwitchEnable..',isIwfSwitchEnable)

  return (
    <div>
      <div class="addUserInfo" style={{ height: "600px", overflowY: "scroll" }}>
        <ThemeProvider theme={theme}>
          <div class="tab1-account">
            <label class="tab1-heading"> Account</label>
            <div class="form-group">
              <label class="attribute-heading">User Name</label>
              <input
                type="text"
                class="input-control"
                id="firstName"
                value={basicdetails && basicdetails.userName}
                onChange={userNameChangeHandler}
              />
            </div>
            <div class="form-group">
              <label class="attribute-heading">Password*</label>
              <input
                type="password"
                class="input-control"
                id="password"
                value={basicdetails && basicdetails.password}
                onChange={userPwdChangeHandler}
                disabled={false}
              />
              {emptyPassword === true ? (
                <label class="error-handling-lbl">
                  Password should be atleast 8 characters
                </label>
              ) : null}
            </div>
            <div class="form-group">
              <label class="attribute-heading">Confirm Password*</label>
              <input
                type="password"
                class="input-control"
                id="confirmPassword"
                value={basicdetails && basicdetails.confirmpassword}
                onChange={userCnfPwdChangeHandler}
                disabled={false}
              />
              {passwordMitchMatch === true ? (
                <label class="error-handling-lbl">Password mismatching</label>
              ) : null}
            </div>
          </div>
          <div class="tab1-basicinfo">
            <div>
              <div className="tab1-basicinfo-header">
                <label class="tab1-heading"> User Info</label>
                {/* <div class="form-group">
              <label class="attribute-heading">Contact Number</label>
              <input
                type="text"
                class="input-control"
                id="contactnumber"
                value={basicdetails && basicdetails.phoneNumber}
                onChange={userContactNumberChangeHandler}
              />
            </div> */}
                {configDomain &&
                configDomain.iwfs &&
                configDomain.iwfs.length > 0 ? (
                  <FormControlLabel
                    className={classes.tetraSwitch}
                    value="start"
                    control={
                      <Switch
                        color="primary"
                        checked={isIwfSwitchEnable}
                        onChange={tetraUserChangeHandler}
                      />
                    }
                    label="Iwf"
                    labelPlacement="start"
                    onChange={tetraUserChangeHandler}
                    disabled={purpose === "edit" ? purpose : tetraDisable}
                  />
                ) : null}
              </div>
              {basicdetails.iwf &&
              basicdetails.iwf.type &&
              basicdetails.iwf.type.toLocaleUpperCase().includes("PBX") ? (
                <IwFMapView
                  class="input-control"
                  fromFA={false}
                  iwfMapHandler={iwfMapHandler}
                  infoData={basicdetails.iwf ? basicdetails.iwf : {}}
                  falist={faList}
                  purpose={iwfMapPurpose}
                  mappedFilter={false}
                  hideIwfIdView={false}
                ></IwFMapView>
              ) : basicdetails &&
                basicdetails.TetraUser === true &&
                addedFA.length == 0 ? (
                <IwFMapView
                  class="input-control"
                  fromFA={false}
                  iwfMapHandler={iwfMapHandler}
                  infoData={basicdetails.iwf ? basicdetails.iwf : {}}
                  falist={faList}
                  purpose={iwfMapPurpose}
                  mappedFilter={false}
                  hideIwfIdView={false}
                ></IwFMapView>
              ) : basicdetails &&
                basicdetails.TetraUser === true &&
                addedFA.length != 0 ? (
                <IwFMapView
                  class="input-control"
                  fromFA={false}
                  iwfMapHandler={iwfMapHandler}
                  infoData={basicdetails.iwf ? basicdetails.iwf : {}}
                  falist={faList}
                  purpose={iwfMapPurpose}
                  mappedFilter={false}
                  hideIwfIdView={true}
                ></IwFMapView>
              ) : null}
            </div>
            <div class="form-group">
              <label class="attribute-heading">Email</label>
              <input
                type="text"
                class="input-control"
                id="email"
                value={basicdetails && basicdetails.Email}
                onChange={userEmailChangeHandler}
              />
            </div>

            {/* ---------------------------------------------UE TYPE------------------------------- */}
            <div>
              <FormControl
                variant="filled"
                className={classes.formControlUEType}
              >
                <InputLabel id="ueTypeID" className={classes.ueInfoList}>
                  UE Type
                </InputLabel>
                <Select
                  className={classes.ueInfoList}
                  id="ueType-select-filled"
                  value={selectedUEType}
                  onChange={handleUETypeChangeHandler}
                >
                  {UETypeOptions &&
                    UETypeOptions.map((uetype) => {
                      return (
                        <MenuItem value={uetype.value}>{uetype.text}</MenuItem>
                      );
                    })}
                </Select>
              </FormControl>
              <button
                class="add-btn-fa"
                type="button"
                onClick={handleUETypeChange}
              >
                Add UE
              </button>

              <div style={{ width: "100%" }}>
                {addedUEInfo.length > 0 ? (
                  <List style={{ width: "100%" }}>
                    <ListItem
                      class="add-ueInfo-list"
                      style={{ backgroundColor: "rgb(232, 232, 232)" }}
                    >
                      <ListItemText
                        className={classes.ueInfoList}
                        primary="UE Type"
                      />

                      <ListItemText
                        className={classes.ueInfoList}
                        primary="No. Of Registration"
                      />

                      <ListItemText
                        className={classes.ueInfoList}
                        primary="Primary"
                      />

                      <ListItemText
                        className={classes.ueInfoList}
                        primary="Delete"
                      />
                    </ListItem>
                  </List>
                ) : null}

                <List style={{ width: "100%" }}>
                  {addedUEInfo.map((ue) => {
                    return (
                      <ListItem class="add-ueInfo-list" key={ue.text}>
                        <ListItemText
                          className={classes.ueInfoList}
                          primary={ue.text}
                        />
                        <input
                          type="text"
                          className={`input-control ${classes.noOfRegTextField}`}
                          id="noOfReg"
                          // value={ue.noOfReg}
                          defaultValue={ue.noOfReg}
                          onChange={(e) => noOfRegChangeHandler(e, ue)}
                        />
                        <Checkbox
                          color="primary"
                          edge="start"
                          onChange={(e) => changeUEPrimary(e, ue)}
                          checked={ue.primary}
                        />
                        <button
                          class="editBtn"
                          onClick={() => deleteUEInfo(ue)}
                          type="button"
                          name=""
                        >
                          <img
                            src="/assets/images/deleteimg.svg"
                            class="delete-user-img-fa"
                            alt=""
                          />
                        </button>
                      </ListItem>
                    );
                  })}
                </List>
              </div>
            </div>

            {/* ---------------------------------------------MCPTT-ID------------------------------- */}
            <div class="form-group">
              <label class="attribute-heading">MCPTT ID*</label>
              {/* <input
                type="text"
                class="input-control"
                id="mcxid"
                value={basicdetails && basicdetails.mcpttId}
                onChange={userMacxidChangeHandler}
                disabled={newOrUpdateProfile ? false : true}
              /> */}
              <input
                type="text"
                className={`input-control ${classes.mcxDataIdInput}`}
                id="mcxid"
                value={basicdetails && basicdetails.userName}
                onChange={userMacxidChangeHandler}
                disabled={true}
              />
              {emptyMCXId === true ? (
                <p class="error-handling-lbl">Please enter the MCXId</p>
              ) : null}
            </div>

            {/* ------------------------MCX-DATA-ID----------------------------- */}
            {fullyIWF ? null : (
              <div class="form-group">
                <label class="attribute-heading">MCXData ID</label>
                <FormControlLabel
                  value="mcxDataIDCheckBox"
                  className={classes.tickSize}
                  control={
                    <Checkbox
                      color="primary"
                      checked={basicdetails && basicdetails.mcxDataID}
                      onChange={mcxDataIDEnableChangeHandler}
                    />
                  }
                />
                <input
                  type="text"
                  className={
                    isMCXDataIdDisabled
                      ? `input-control ${classes.mcxDataIdInput}`
                      : `input-control`
                  }
                  id="mcxDataID"
                  value={basicdetails && basicdetails.mcxDataIdText}
                  onChange={mcxDataIDChangeHandler}
                  disabled={isMCXDataIdDisabled}
                />
              </div>
            )}

            {/* ------------------------MCX-VIDEO-ID----------------------------- */}

            {fullyIWF ? null : (
              <div class="form-group">
                <label class="attribute-heading">MCXVideo ID</label>
                <FormControlLabel
                  className={classes.tickSize}
                  value="mcxVideoIDCheckBox"
                  control={
                    <Checkbox
                      color="primary"
                      checked={basicdetails && basicdetails.mcxVideoID}
                      onChange={mcxVideoIDEnableChangeHandler}
                    />
                  }
                />
                <input
                  type="text"
                  className={
                    isMCXVideoIdDisabled
                      ? `input-control ${classes.mcxDataIdInput} `
                      : `input-control`
                  }
                  id="mcxVideoID"
                  value={basicdetails && basicdetails.mcxVideoIdText}
                  onChange={mcxVideoIDChangeHandler}
                  disabled={isMCXVideoIdDisabled}
                />
              </div>
            )}

            {/* ---------------------------------ROLE TYPE----------------------------------- */}
            <div class="form-group">
              <FormControl variant="filled" className={classes.formControl}>
                <InputLabel
                  id="demo-simple-select-filled-label"
                  className={classes.listItemFA}
                >
                  ROLE TYPE
                </InputLabel>
                <Select
                  className={classes.listItemFA}
                  labelId="demo-simple-select-filled-label"
                  id="demo-simple-select-filled"
                  value={selectedRoleType}
                  onChange={handleRoleTypeChange}
                >
                  {RoleTypeOptions &&
                    RoleTypeOptions.map((roletype) => {
                      return (
                        <MenuItem value={roletype.value}>
                          {roletype.text}
                        </MenuItem>
                      );
                    })}
                </Select>
              </FormControl>
            </div>

            {/* ---------------------------------USER TYPE----------------------------------- */}
            <div class="form-group">
              <FormControl variant="filled" className={classes.formControl}>
                <InputLabel
                  id="demo-simple-select-filled-label"
                  className={classes.listItemFA}
                >
                  USER TYPE
                </InputLabel>
                <Select
                  className={classes.listItemFA}
                  labelId="demo-simple-select-filled-label"
                  id="demo-simple-select-filled"
                  value={selectedUserType}
                  onChange={handleUserTypeChange}
                >
                  {UserTypeOptions &&
                    UserTypeOptions.map((usertype) => {
                      return (
                        <MenuItem value={usertype.value}>
                          {usertype.text}
                        </MenuItem>
                      );
                    })}
                </Select>
              </FormControl>
            </div>

            {/* ---------------------------------Video and BroadCast Enable----------------------------------- */}
            <div className="form-group basicInfo-enable-container">
              <div className="basicInfo-enabler">
                {fullyIWF ? null : (
                  <FormControlLabel
                    className={classes.tetraSwitch}
                    value="start"
                    control={
                      <Switch
                        color="primary"
                        checked={basicdetails && basicdetails.VideoEnable}
                        onChange={videoEnableChangeHandler}
                      />
                    }
                    label="Enable Video Calling"
                    labelPlacement="start"
                    onChange={videoEnableChangeHandler}
                    // disabled={purpose}
                  />
                )}
                <FormControlLabel
                  // className={classes.tetraSwitch}
                  className={classes.ml0}
                  value="start"
                  control={
                    <Switch
                      color="primary"
                      checked={basicdetails && basicdetails.broadCastCall}
                      onChange={broadCastCallChangeHandler}
                    />
                  }
                  label="Broadcast Call"
                  labelPlacement="start"
                  onChange={broadCastCallChangeHandler}
                  // disabled={purpose}
                />
              </div>
            </div>

            {/* -----------------------------FA DROP DOWN--------------------------------------- */}

            <div class="form-group">
              <div>
                <FormControl variant="filled" className={classes.formControlFA}>
                  <InputLabel
                    id="demo-simple-select-filled-label"
                    className={classes.listItemFA}
                  >
                    FUNCTIONAL ALIAS
                  </InputLabel>
                  <Select
                    className={classes.listItemFA}
                    labelId="demo-simple-select-filled-label"
                    id="demo-simple-select-filled"
                    value={vlFunctionalAlias}
                    onChange={functionalAliasChangeHandler}
                  >
                    {faList &&
                      faList.map((fatype) => {
                        return (
                          <MenuItem value={fatype.name}>
                            {fatype.CallerDescr}
                          </MenuItem>
                        );
                      })}
                  </Select>
                </FormControl>
                <button
                  class="add-btn-fa"
                  type="button"
                  onClick={OnAddFunctionalAlias}
                >
                  Add FA
                </button>
                <div style={{ width: "100%" }}>
                  <List style={{ width: "100%" }}>
                    {addedFA.map((fa) => {
                      return (
                        <ListItem class="add-fa-list" key={fa.profileName}>
                          <ListItemText
                            className={classes.listItemFA}
                            primary={fa.CallerDescr}
                          />
                          {fullyIWF ? null : (
                            <TextField
                              label="UE Type"
                              select
                              value={fa.ueType}
                              onChange={(e) =>
                                handleFAUETypeChangeHandler(e, fa)
                              }
                              style={{ width: "60%" }}
                              size="small"
                            >
                              {UETypeOptions &&
                                UETypeOptions.map((uetype) => {
                                  return (
                                    <MenuItem value={uetype.value}>
                                      {uetype.text}
                                    </MenuItem>
                                  );
                                })}
                            </TextField>
                          )}
                          <Checkbox
                            color="primary"
                            edge="start"
                            onChange={() => makeDefaultFA(fa)}
                            checked={fa.default}
                          />
                          <button
                            class="editBtn"
                            onClick={() => deleteFAlias(fa)}
                            type="button"
                            name=""
                          >
                            <img
                              src="/assets/images/deleteimg.svg"
                              class="delete-user-img-fa"
                              alt=""
                            />
                          </button>
                        </ListItem>
                      );
                    })}
                  </List>
                </div>
              </div>
            </div>

            {/* -----------------------------Priority--------------------------------------- */}
            {/* <div class="form-group">
            <FormControl variant="filled" className={classes.formControl}>
              <InputLabel
                id="demo-simple-select-filled-label"
                className={classes.listItemFA}
              >
                Priority
              </InputLabel>
              <Select
                className={classes.listItemFA}
                labelId="demo-simple-select-filled-label"
                id="demo-simple-select-filled"
                value={selectedPriority}
                onChange={handlePriorityChange}
              >
                {priorityArr &&
                      priorityArr.map((ele) => {
                        return (
                          <MenuItem value={ele}>
                            {ele}
                          </MenuItem>
                        );
                      })}
              </Select>
            </FormControl>
            </div> */}

            {/* -----------------------------CAD CALL--------------------------------------- */}
            { configCadCall===true?
            <fieldset className="form-group call-forwading-container">
              <legend>CAD CALL</legend>
              <CADCallConfig
                cadCall={
                  basicdetails && basicdetails.cadCallData
                    ? basicdetails.cadCallData
                    : null
                }
                updateDefaultAuthorizerErr={updateDefaultAuthorizerErr}
                updateUserCadCallData={updateUserCadCallData}
                faList={faList}
                mcpttidAndUri={mcpttidAndUri}
                emptyDefaultAuthorizer={emptyDefaultAuthorizer}
              />
            </fieldset>
           : null }

            {/* -----------------------------Call Forwarding--------------------------------------- */}

            {basicdetails
            &&
            // basicdetails.cadCallData &&
            // basicdetails.cadCallData.allowPrivateCallParticipation === true &&
            // configCadCall===true 
              configCallForwarding ===true
            ? (
              <CallForwardingConfig
                callForwardData={basicdetails.callForwardingData}
                updateCallForwardingData={updateCallForwardingData}
                newOrUpdateProfile={newOrUpdateProfile}
                userName={basicdetails.userName}
                mcpttidAndUri={mcpttidAndUri}
                updateCallForwardTargetErr={updateCallForwardTargetErr}
              />
            ) : null}

            {/* ---------------------------- Permissions --------------------------------------- */}
            <div class="form-group">
              <label class="tab2-heading">Permissions</label>
              <UserPermissions
                permissions={
                  basicdetails && basicdetails.permissions
                    ? basicdetails.permissions
                    : null
                }
                updateUserPermissions={updateUserPermissions}
              ></UserPermissions>
            </div>

            <React.Fragment>
              <label class="tab2-heading">Add Org</label>
              <Autocomplete
                id="auto-highlight"
                autoHighlight
                style={{ marginBottom: 25, paddingLeft: 5 }}
                options={orgList ? orgList : []}
                value={
                  basicdetails && orgList
                    ? orgList.find((v) => v.orgId === basicdetails.orgId) || ""
                    : ""
                }
                renderOption={(option) => (
                  <Fragment>
                    {option.hasOwnProperty("orgName") ? option.orgName : ""}
                  </Fragment>
                )}
                getOptionLabel={(option) =>
                  option.hasOwnProperty("orgName") ? option.orgName : ""
                }
                renderInput={(params) => (
                  <TextField {...params} label="Search Org" />
                )}
                onChange={(e, v) => {
                  if (v && v.hasOwnProperty("orgId") && v.orgId)
                    userOrgIdChangeHandler(v.orgId);
                }}
              />
            </React.Fragment>
          </div>
        </ThemeProvider>
      </div>
      <button
        class="update-btn-profile"
        type="button"
        onClick={UpdateBasicDetails}
      >
        {newOrUpdateProfile ? "SUBMIT" : "UPDATE"}
      </button>
    </div>
  );
};

const mapStateToProps = ({ adminstate, domains, enableCadCall,enableCallForwarding }) => {
  const { falist } = adminstate;
  const {
    userProfileWithAttachedFA,
    mcpttidIWFMap,
    iwfMaplist,
    mcpttidAndUri,
  } = adminstate;
  const { orglist } = adminstate;
  const { configDomain } = domains;
  const { configCadCall} = enableCadCall;
  const {configCallForwarding}= enableCallForwarding;
  //console.log('userlist reducer', userlist)
  return {
    falist,
    userProfileWithAttachedFA,
    orglist,
    configDomain,
    configCadCall,
    configCallForwarding,
    mcpttidIWFMap,
    iwfMaplist,
    mcpttidAndUri,
  };
};

export default connect(mapStateToProps, {
  fetchUserProfileWithAttachedFAS,
  updateUserProfileWithAttachedFAS,
  fetchOrgListAdmin,
  getIWFMapByMCPTTID,
  resetIWFMapByMCPTTID,
  fetchMcpttIdAndUri,
})(BasicInfo);
