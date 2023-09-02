/**
 *  Component: TrainPage
 */

import React, { useEffect } from 'react'
import PropTypes from 'prop-types'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { push } from 'react-router-redux'

import '../../styles/train.scss'
import Header from '../../components/Navigation/Header'
import Train_map from '../../components/Train/train_map'
import { NetworkStatus } from '../../components/commom'
import TrainDetailsName from '../../components/Train/TrainDetailsTable'
import TrainTable from '../../components/Train/TrainTable'
import { Widget } from '../../components/Widget';

//Redux actions
import { fetchAllLines, fetchAllTrainDetails, fetchAllLocations, fetchCurrentLocations, fetchAllBaseStations, getGrabbedLines } from '../../modules/actions'
import ActivityLogTable from '../../components/ActivityLog/ActivityLogTable'
import '../../constants/verConfig'
const propTypes = {
  trains: PropTypes.array
}

const TrainPage = (props) => {

  const { isAuthenticated, navigateToLogin, fetchAllLines, fetchAllTrainDetails, fetchAllLocations, fetchCurrentLocations, fetchAllBaseStations, getGrabbedLines } = props;
  useEffect(() => {
    fetchCurrentLocations({ 'LA': global.config.currentLAId })
    getGrabbedLines({ 'LA': global.config.currentLAId })
    fetchAllLocations()
    setTimeout(() => {
      fetchAllLines()
      fetchAllTrainDetails()
      fetchAllBaseStations()
    }, 300);
  }, [])

  useEffect(() => {
    if (!isAuthenticated) navigateToLogin()
  }, [isAuthenticated])

  return (
    <div>
      <Header page={'trains'} />
      {/* Body Start */}
      <div class="main-nav-body">
        {/* Train Page starts here */}
        <div class="train-grid">
          {/* Map Start */}
          <div class="t1 wrap-1 bg_white">
            <Train_map />
          </div>
          {/* Widget */}
          <div class="t2 wrap-1 pad-0">
            <Widget />
            {/* <Widget/> */}
          </div>
          {/* Network Status */}
          <div class="t3 wrap-1">
            {/* <ContextMenu id='demo'><h2>CONTEXT MENU HERE</h2></ContextMenu> */}
            <NetworkStatus />
          </div>
          {/*  Active Trains Table Start */}
          <div class="t4 wrap-1"> 
            {/* <TrainDetailsName /> */}
            {/* <toptitle title="Train Details" type="TD" /> */}
            {/* <train_details_name /> */}
            {/* Trains Data */}
            {(process.env.REACT_APP_ISRAILWAY).toLowerCase()=="true" ? <TrainTable/>: <TrainDetailsName /> }
          </div>
          <div class="t5 wrap-1">
            <ActivityLogTable />

          </div>
        </div>
      </div>

    </div>
  )
}

const mapStateToProps = ({ auth }) => {
  const { user, isAuthenticated } = auth;
  return {
    user, isAuthenticated
  };
};

const mapDispatchToProps = dispatch => bindActionCreators({
  fetchAllLines,
  fetchAllTrainDetails,
  fetchAllLocations,
  fetchCurrentLocations,
  fetchAllBaseStations,
  getGrabbedLines,
  navigateToLogin: () => push('/')
}, dispatch)

TrainPage.propTypes = propTypes

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(TrainPage)