import React from "react";
import PropTypes from "prop-types";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";
import { connect } from "react-redux";
import IWFMapForm from "./IWFMapForm";
const IwfMapView = (props) => {
  const { infoData, purpose, userlist, fromFA, iwfMapHandler, falist, mappedFilter, hideIwfIdView } = props;

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

  const useStyles = makeStyles((theme) => ({
    root: {
      backgroundColor: theme.palette.background.paper,
      width: 700,
    },
  }));

  const classes = useStyles();

  const infoUpdateHandler = (iwfinfo) => {
    iwfMapHandler(iwfinfo)
  };
  return (
    <div class={classes.root} id="addUser-Main">
      <IWFMapForm
        userlist={userlist}
        infoData={infoData}
        fromFA={fromFA}
        falist={falist}
        infoHandler={infoUpdateHandler}
        purpose={purpose}
        mappedFilter={mappedFilter}
        hideIwfIdView={hideIwfIdView}
      ></IWFMapForm>
    </div>
  );
};
const mapStateToProps = ({ adminstate }) => {
  const { userlist } = adminstate;
  //console.log('userlist reducer', userlist)
  return {
    userlist
  };
};
export default connect(mapStateToProps, null)(IwfMapView);
