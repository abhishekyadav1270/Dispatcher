import React, { Component, useState, useEffect } from "react";
import PropTypes from "prop-types";
import SwipeableViews from "react-swipeable-views";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";
import { createUserAdmin, updateUserAdmin } from '../../../../modules/adminstate';
import { connect } from "react-redux";
import BasicInfo from "./BasicInfo";
import Groups from "./Groups";
import McpttConfig from "./McpttConfig";
import McdataConfig from "./McdataConfig";
import PrivateCalls from "./PrivateCalls";
import { DefaultBasicInfoData } from '../../../basicinfodata';
import UserLocation from "./UserLocation";
//import UserPermissions from "./UserPermissions";

const AddUser = (props) => {
  const { createUserAdmin, updateUserAdmin, purpose, grouplist } = props
  const [adduserObj, SetAddUserObj] = useState({
    basicInfoObj: DefaultBasicInfoData,
    mcpttConfigObj: {
      MaxSimCall: "",
      Priority: "",
      PrivateCall: false,
      MannualCommancement: false,
      ForceAutoAnswer: false,
      AutomaticCommancement: false,
      EmergencyGrpCall: false,
      CancelGrpEmergency: false,
      EmergencyPrivateCall: false,
      CancelPrivateEmergency: false,
      ActivateEmergencyAlert: false,
      crtDltUserAlias: false,
      MaxAllocation: "",
      MaxSimTransmission: "",
      CancelEmergencyAlert: false,
      PrivateMediaCallProtection: false,
      PrivateCallForProtection: false,
      ReqAffiliatedGrps: false,
      PrivateCallToUser: false,
      PrivateCallParticipation: false,
      ReqRemoteInitiated: false,
      ReqLocallyInitiated: false,
    },
    mcDataConfigObj: {
      MaxData1: "",
      MaxTime1: "",
      MaxOfiliation: "",
      ReqGroup: false,
      ReqOtherGroup: false,
    },
    groupsObj: {
      Membership1: "",
      Membership2: "",
      EmergencyGroup: "",
    },
    privateCallsObj: {
      privateCalls: "",
      emergencyContact: "",
    },
  });

  useEffect(() => {
    if (props.basicInfoData) {
      //console.log('basicInfo basic add user', props.basicInfoData)
      SetAddUserObj({
        ...adduserObj,
        basicInfoObj: {
          ...props.basicInfoData,
        },
      });
    }
  }, [])

  function TabPanel(tabprops) {
    const { children, value, index, ...other } = tabprops;

    return (
      <div
        role="tabpanel"
        hidden={value !== index}
        id={`full-width-tabpanel-${index}`}
        aria-labelledby={`full-width-tab-${index}`}
        {...other}
      >
        {value === index && (
          <Box p={5}>
            <Typography>{children}</Typography>
          </Box>
        )}
      </div>
    );
  }

  TabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.any.isRequired,
    value: PropTypes.any.isRequired,
    index2: PropTypes.any.isRequired,
    index3: PropTypes.any.isRequired,
  };

  function a11yProps(index) {
    return {
      id: `full-width-tab-${index}`,
      "aria-controls": `full-width-tabpanel-${index}`,
    };
  }

  const useStyles = makeStyles((theme) => ({
    root: {
      backgroundColor: theme.palette.background.paper,
      width: 800,
    },
  }));

  const classes = useStyles();
  const theme = useTheme();
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleChangeIndex = (index) => {
    setValue(index);
  };

  const basicInfoUpdateHandler = (updatedBasicDetails) => {
    SetAddUserObj({
      ...adduserObj,
      basicInfoObj: {
        ...updatedBasicDetails,
      },
    });
    console.log("basicInfo After Update", updatedBasicDetails);
    if (updatedBasicDetails.id && updatedBasicDetails.id.length > 0) {
      console.log('api called update')
      updateUserAdmin(updatedBasicDetails)
    } else {
      console.log('api called create')
      createUserAdmin(updatedBasicDetails)
    }
    props.hideModal()
  };

  const groupDataUpdateHandler = () => {
    props.hideModal()
  }
  const mcPttConfigUpdateHandler = (updatedMcPtt) => {
    SetAddUserObj({
      ...adduserObj,
      mcpttConfigObj: { ...updatedMcPtt },
    });
  };

  const mcDataConfigUpdateHandler = (updatedMcData) => {
    SetAddUserObj({
      ...adduserObj,
      mcDataConfigObj: { ...updatedMcData },
    });
  };

  const groupsUpdateHandler = (updatedGroups) => {
    SetAddUserObj({
      ...adduserObj,
      groupsObj: { ...updatedGroups },
    });
  };

  const privateCallUpdateHandler = (updatedPrivateCall) => {
    SetAddUserObj({
      ...adduserObj,
      privateCallsObj: { ...updatedPrivateCall },
    });
  };

  return (
    <div class={classes.root}>
      <AppBar position="static" color="default">
        <Tabs
          value={value}
          onChange={handleChange}
          indicatorColor="primary"
          textColor="primary"
          variant="scrollable"
          scrollButtons="auto"
          aria-label="scrollable auto tabs example"
        >
          <Tab label="Basic Info" {...a11yProps(0)} />
          <Tab label="Groups" {...a11yProps(1)} />
          <Tab label="Location" {...a11yProps(2)} />
          {/* <Tab label="Permission" {...a11yProps(3)} /> */}
        </Tabs>
      </AppBar>
      <div class="tab1">
        <TabPanel value={value} index={0} dir={theme.direction}>
          <BasicInfo onBasicInfoUpdate={basicInfoUpdateHandler} basicInfoData={props.basicInfoData} purpose={purpose}></BasicInfo>
        </TabPanel>

        <TabPanel value={value} index={1} dir={theme.direction}>
          <Groups groupDataUpdateHandler={groupDataUpdateHandler} propGroupList={grouplist}></Groups>
        </TabPanel>

        <TabPanel value={value} index={2} dir={theme.direction}>
          <UserLocation locationUpdateHandler={groupDataUpdateHandler} purpose={purpose}></UserLocation>
        </TabPanel>

        {/* <TabPanel value={value} index={3} dir={theme.direction}>
          <UserPermissions purpose={purpose}></UserPermissions>
        </TabPanel> */}

      </div>
    </div>
  );
};

export default connect(null, {
  createUserAdmin,
  updateUserAdmin
})(AddUser);

