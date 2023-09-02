/**
 *  Component: Alerts Screen
 */

import React, { useEffect} from 'react'
import PropTypes from 'prop-types'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { push } from 'react-router-redux'

// import '../../styles/train.scss'
import Header from '../../components/Navigation/Header'
import { Title, NetworkStatus } from '../../components/commom'
import { Widget } from '../../components/Widget';
import ActivityLogTable from '../../components/ActivityLog/ActivityLogTable';
import { AlertCard, IncomingAlerts, PinnedTab } from '../../components/Alerts';

//Redux actions
import {  } from '../../modules/actions'
import { globalConfig } from '../../constants/verConfig'
import SDSTable from '../../components/SDS/SDS_Table'
import IncomingTasks from '../../components/Alerts/IncomingTasks'

const propTypes = {
  trains: PropTypes.array
}

const Alerts = (props) => {
  const { isAuthenticated,navigateToLogin } = props;
  useEffect(() => {
    console.log('LOG ALERT',props,navigateToLogin,isAuthenticated)
    if(!isAuthenticated) navigateToLogin()
  }, [isAuthenticated])
    
    return (
      <div>
        <Header page={'alerts'}/>
        <div class="main-nav-body">
          <div class="alerts-grid">
            {/* <div class="a1 wrap-1">
              <PinnedTab/>
            </div> 
         */}
            <div class="a1 wrap-1" >
                <IncomingTasks/>
            </div>
            <div class="a4">
                <div class="a0">
                    <div class="wrap-1 b1 pad-0">
                        <Widget />
                    </div>
                    <div class="b2 wrap-1">
                      {/* {globalConfig['calls']?
                        <ActivityLogTable/>
                      :
                        <SDSTable/>
                      } */}
                       <ActivityLogTable/>
                    </div>
                    <div class="c2 wrap-1">
                        <NetworkStatus />
                    </div>
                </div>
            </div>
          </div>
        </div>
      </div>
    )
} 

const mapStateToProps = ({ auth }) => {
  const { user, isAuthenticated } = auth;
  return {
      user,isAuthenticated
  };
};

const mapDispatchToProps = dispatch => bindActionCreators({
  navigateToLogin: () => push('/')
}, dispatch)
Alerts.propTypes = propTypes

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Alerts)