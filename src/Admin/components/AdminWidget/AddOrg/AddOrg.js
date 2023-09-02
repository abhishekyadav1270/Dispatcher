import React from "react";
import PropTypes from "prop-types";
import SwipeableViews from "react-swipeable-views";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";
import CreateOrg from "../../CreateOrg";
import { createOrgAdmin,updateOrgAdmin } from '../../../../modules/adminstate';
import { connect } from "react-redux";
const AddOrg = (props) => {
  const { createOrgAdmin,updateOrgAdmin,infoData,purpose } = props


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
          <Box p={4}>
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
  const infoUpdateHandler = (orginfo) => {
    // SetAddUserObj({
    //   ...adduserObj,
    //   basicInfoObj: {
    //     ...updatedBasicDetails,
    //   },
    // });
    // console.log("basicInfo After Update", updatedBasicDetails);
    // if (updatedBasicDetails.id && updatedBasicDetails.id.length > 0) {
    //   console.log('api called update')
    //   updateUserAdmin(updatedBasicDetails)
    // } else {

      
      if (purpose==="edit") {
        console.log('api called update')
        console.log(orginfo)
        updateOrgAdmin(orginfo)
      }
      else{
        console.log('api called create')
        console.log(orginfo)
        createOrgAdmin(orginfo)
      }
    
    // }
    props.hideModal()
  };

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
          <Tab label="Basic Info" {...a11yProps(0)} />
        </Tabs>
      </AppBar>
      <SwipeableViews
        axis={theme.direction === "rtl" ? "x-reverse" : "x"}
        index={value}
        onChangeIndex={handleChangeIndex}
      >
        <div class="group-tabs">
          <TabPanel value={value} index={0} dir={theme.direction}>
            <CreateOrg infoData={infoData}infoHandler={infoUpdateHandler}></CreateOrg>
          </TabPanel>
        </div>
      </SwipeableViews>
    </div>
  );
};

export default connect(null, {
  createOrgAdmin,
  updateOrgAdmin
})(AddOrg);
