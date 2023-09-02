import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import SwipeableViews from "react-swipeable-views";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";
import { bindActionCreators } from "redux";
import { push } from "react-router-redux";
import Switch from "@material-ui/core/Switch";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import GrpBasicInfo from "./GrpBasicInfo";
import GrpMembers from "./GrpMembers";
import GrpMCPTTConfig from "./GrpMCPTTConfig";
import GrpSupervisor from "./GrpSupervisor";
import {
  resetOrgGroupAdmin,
  createGroupAdmin,
  updateGroupAdmin,
  fetchGroupTypeAdmin,
  getGroupDetail
} from "../../../../modules/adminstate";
import { connect } from "react-redux";
const DOMParser = require("xmldom").DOMParser;

const defaultAddGroupData = {
  basicinfo: {
    groupname: "",
    priority: "",
    orgId: "",
    groupType: "",
    source: "MCX",
  },
  supervisorId: '',
  members: [],
  mcpttConfig: {
    groupType: "",
    hangTimer: {
      hour: "",
      min: "",
      sec: "",
    },
  },
};
const AddGroup = (props) => {
  const {
    createGroupAdmin,
    updateGroupAdmin,
    groupData,
    infoData,
    purpose,
    orglist,
    userlist,
    groupTypes,
    fetchGroupTypeAdmin,
    getGroupDetail,
    groupDetail,
    resetOrgGroupAdmin
  } = props;
  const [addGroupData, SetAddGroupData] = useState(defaultAddGroupData);
  const parser = new DOMParser();

  //console.log("Add Groudp userlist and orglist", orglist, userlist);
  function TabPanel(tabprops) {
    const { children, value, index, ...other } = tabprops;

    //console.log("Add Group infodata", infoData, orglist, userlist);
    return (
      <div
        role="tabpanel"
        hidden={value !== index}
        id={`full-width-tabpanel-${index}`}
        aria-labelledby={`full-width-tab-${index}`}
        {...other}
      >
        {value === index && (
          <Box p={4}>
            <Typography>{children}</Typography>
          </Box>
        )}
      </div>
    );
  }

  useEffect(() => {
    try {

      if (purpose === "edit" && groupDetail) {
        console.log("groupDetail", groupDetail)
        var xml = parser.parseFromString(groupDetail);
        var groupInfo = xml.getElementsByTagName('list-service').item(0);
        var groupId = groupInfo.getAttribute('uri');
        console.log('List is 1111: ', groupId);
        const list = xml.getElementsByTagName("entry");
        // getGroupDetail(groupId)
        console.log('Group List member is: ', list.item, userlist);
        var cont = [];
        try {
          for (let i = 0; i < list.length; i++) {
            let element = list.item(i);
            console.log("Element in list is: ", element);
            let id = element
              .getElementsByTagName("mcpttgi:tetra-id")
              .item(0).textContent;
            let display_name = element
              .getElementsByTagName("rl:display-name")
              .item(0).textContent;
            let user = userlist.filter(user => (id === user.mcptt_id && user.tetraUser == false))
            cont = [...cont, { userName: user[0].userName, mcptt_id: id }];
          }
        } catch (e) {
          console.log("Error creating map user group list ", e);
        }

        SetAddGroupData({
          ...addGroupData,
          basicinfo: {
            groupname: infoData.groupName,
            priority: xml
              .getElementsByTagName("mcpttgi:on-network-group-priority")
              .item(0) ? xml
                .getElementsByTagName("mcpttgi:on-network-group-priority")
                .item(0).textContent : '',
            orgId: xml.getElementsByTagName("organization-id").item(0) ? xml.getElementsByTagName("organization-id").item(0)
              .textContent : '',
            groupType: xml.getElementsByTagName("members-type").item(0) ? xml.getElementsByTagName("members-type").item(0).textContent : '',
            source: xml.getElementsByTagName("source").item(0) ? xml.getElementsByTagName("source").item(0).textContent : '',
          },
          members: cont,
          supervisorId: xml.getElementsByTagName("supervisorId").item(0) ? xml.getElementsByTagName("supervisorId").item(0).textContent : '',
          mcpttConfig: {
            groupType: xml.getElementsByTagName("group-type").item(0) ? xml.getElementsByTagName("group-type").item(0).textContent : '',
            hangTimer: {
              hour: xml.getElementsByTagName("hour").item(0) ? xml.getElementsByTagName("hour").item(0).textContent : '0',
              min: xml.getElementsByTagName("min").item(0) ? xml.getElementsByTagName("min").item(0).textContent : '0',
              sec: xml.getElementsByTagName("sec").item(0) ? xml.getElementsByTagName("sec").item(0).textContent : '0',
            },
          },
        });
      }
    } catch (ex) {
      console.log("Exceptions  " + ex)
    }
  }, [groupDetail])

  useEffect(() => {
    resetOrgGroupAdmin()
    fetchGroupTypeAdmin()
    if (purpose === "edit") {
      // var xml = parser.parseFromString(infoData.groupDocument);
      // const list = xml.getElementsByTagName("entry");
      // var groupInfo = xml.getElementsByTagName('list-service').item(0);
      // var groupId = groupInfo.getAttribute('uri');
      getGroupDetail(infoData.groupId)
      //console.log('List is: ', list);
      // var cont = [];
      // try {
      //   for (let i = 0; i < list.length; i++) {
      //     let element = list.item(i);
      //     //console.log("Element in list is: ",element);
      //     let id = element
      //       .getElementsByTagName("mcpttgi:tetra-id")
      //       .item(0).textContent;
      //     let display_name = element
      //       .getElementsByTagName("rl:display-name")
      //       .item(0).textContent;
      //       getGroupDetail(id)  
      //     cont = [...cont, { userName: display_name, mcptt_id: id }];
      //   }
      // } catch (e) {
      //   console.log("Error creating map user group list ", e);
      // }

      // SetAddGroupData({
      //   ...addGroupData,
      //   basicinfo: {
      //     groupname: infoData.groupName,
      //     priority: xml
      //       .getElementsByTagName("mcpttgi:on-network-group-priority")
      //       .item(0).textContent,
      //     orgId: xml.getElementsByTagName("organization-id").item(0)
      //       .textContent,
      //     groupType: xml.getElementsByTagName("members-type").item(0).textContent,
      //   },
      //   members: cont,
      //   mcpttConfig: {
      //     groupType: xml.getElementsByTagName("group-type").item(0).textContent,
      //     hangTimer: {
      //       hour: xml.getElementsByTagName("hour").item(0).textContent,
      //       min: xml.getElementsByTagName("min").item(0).textContent,
      //       sec: xml.getElementsByTagName("sec").item(0).textContent,
      //     },
      //   },
      // });
    }
  }, []);

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

  const GroupAddUpdateHandler = (dataSend) => {
    console.log("Group DATA before submit", dataSend);
    if (purpose === "edit") {
      updateGroupAdmin(dataSend);
    } else {
      createGroupAdmin(dataSend);
    }
    props.hideModal();
  };
  const GroupBasicInfoHandler = (data) => {
    console.log("Group Basic before", addGroupData);
    console.log("data", data, data.groupType && data.groupType === "USER_LIST");
    SetAddGroupData({
      ...addGroupData,
      basicinfo: data,
    });
    if (data.groupType && data.groupType === "USER_LIST")
      setValue(1);
    else
      setValue(2);
  };
  const GroupMembersHandler = (data) => {
    console.log("Group Member CONFIG data", data);
    SetAddGroupData({
      ...addGroupData,
      members: data,
    });
    setValue(2);
  };
  const McpttConfigHandler = (data) => {
    console.log("Group MCPTT CONFIG data", data);
    console.log("Group data", addGroupData);
    var dataSend = addGroupData;
    dataSend.mcpttConfig = data;
    SetAddGroupData({
      ...addGroupData,
      mcpttConfig: data,
    });

    GroupAddUpdateHandler(dataSend);
  };
  const supervisorHandler = (data) => {
    console.log("supervisorHandler", data);
    console.log("supervisorHandler", addGroupData);


    SetAddGroupData({
      ...addGroupData,
      supervisorId: data,
    });
    setValue(3);
  };
  console.log("GROUP DETAIL 1111111", addGroupData)
  return (
    <div class={classes.root} id="addUser-Main">
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
          <Tab label="Basic Info" {...a11yProps(0)} disabled={true} />
          <Tab label="Members" {...a11yProps(1)} disabled={true} />
          <Tab label="Supervisor" {...a11yProps(2)} disabled={true} />
          <Tab label="MCPTT Config" {...a11yProps(3)} disabled={true} />
          {/* <Tab label="MCData Config" {...a11yProps(3)} /> */}
        </Tabs>
      </AppBar>
      <SwipeableViews
        axis={theme.direction === "rtl" ? "x-reverse" : "x"}
        index={value}
        onChangeIndex={handleChangeIndex}
      >
        <div class="group-tabs">
          <TabPanel value={value} index={0} dir={theme.direction}>
            <GrpBasicInfo
              purpose={purpose}
              groupTypes={groupTypes}
              grpBasicInfo={addGroupData.basicinfo}
              orglist={orglist}
              basicInfohandler={GroupBasicInfoHandler}
            ></GrpBasicInfo>
          </TabPanel>
        </div>
        <TabPanel value={value} index={1} dir={theme.direction}>
          <GrpMembers
            purpose={purpose}
            grpMembers={addGroupData}
            userlist={userlist}
            membersHandler={GroupMembersHandler}
          ></GrpMembers>
        </TabPanel>
        <TabPanel value={value} index={2} dir={theme.direction}>
          <GrpSupervisor
            purpose={purpose}
            memebers={addGroupData.members}
            grpBasicInfo={addGroupData.basicinfo}
            supervisorIDProps={addGroupData.supervisorId}
            supervisorHandler={supervisorHandler}
          ></GrpSupervisor>
        </TabPanel>

        <TabPanel value={value} index={3} dir={theme.direction}>
          <GrpMCPTTConfig
            purpose={purpose}
            grpMcpttConfigData={addGroupData.mcpttConfig}
            mcpttconfihHandler={McpttConfigHandler}
          ></GrpMCPTTConfig>
        </TabPanel>
        {/* <TabPanel value={value} index={3} dir={theme.direction}>
          <GrpMCDataConfig></GrpMCDataConfig>
        </TabPanel> */}
      </SwipeableViews>
    </div>
  );
};
const mapStateToProps = ({ adminstate }) => {
  const { groupTypes, groupDetail } = adminstate;
  return {
    groupTypes, groupDetail
  };
};
export default connect(mapStateToProps, {
  createGroupAdmin,
  updateGroupAdmin,
  fetchGroupTypeAdmin,
  getGroupDetail,
  resetOrgGroupAdmin
})(AddGroup);
