import React,{ useEffect} from 'react'
import PropTypes from 'prop-types'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { push } from 'react-router-redux'

import { getCircuitCords } from "../../utils/lib"

// import '../../styles/communication.scss'
import Header from '../../components/Navigation/Header'
import { NetworkStatus } from '../../components/commom'
import {  EmergencyCalls, IncomingCalls, ActiveCalls } from '../../components/Communication'
import { Widget } from '../../components/Widget';
import ContactListTable from '../../components/ContactList/ContactListTable';
import ActivityLogTable from '../../components/ActivityLog/ActivityLogTable';

//Redux actions
import SDSTable from '../../components/SDS/SDS_Table'
import SDS_Table_Old from '../../components/SDS/SDS_Table_Old'

const propTypes = {
  trains: PropTypes.array
}

const contact =[
  {mcptt_id:'iwf@consort.com1', contactName:'Traffic Dispatcher1', tetra_id:'4022', subscriber_type:'Individual', Reg_status:'Registered', Organization:'Consort',PTID:'',TrainNumber:'',Domain:'MCX',disable:true, RegNode:'1', Reg_date_time:'1393096968',
    Groups:[
      {Always_scanned:'true', Attached:'false', GroupSSI:'327681'},
      {Always_scanned:'false', Attached:'false', GroupSSI:'327682'},
      {Always_scanned:'true', Attached:'false', GroupSSI:'327683'},
    ]
  },
  {mcptt_id:'iwf@consort.com2', contactName:'Traffic Dispatcher2', tetra_id:'4022', subscriber_type:'Individual', Reg_status:'Registered', Organization:'Consort',PTID:'',TrainNumber:'',Domain:'Tetra',disable:false, RegNode:'2', Reg_date_time:'1393096969',
  Groups:[
    {Always_scanned:'true', Attached:'false', GroupSSI:'327689'},
    {Always_scanned:'true', Attached:'false', GroupSSI:'327687'},
    {Always_scanned:'true', Attached:'false', GroupSSI:'327680'},
  ]},
  {mcptt_id:'iwf@consort.com3', contactName:'Signaling', tetra_id:'4022', subscriber_type:'Group', Organization:'1',disable:false},
  {mcptt_id:'iwf@consort.com4', contactName:'Traffic Dispatcher4', tetra_id:'4022', subscriber_type:'Individual', Reg_status:'Registered', Organization:'Consort',PTID:'',TrainNumber:'',Domain:'MCX',disable:true},
  {mcptt_id:'iwf@consort.com5', contactName:'Traffic Dispatcher5', tetra_id:'4022', subscriber_type:'Individual', Reg_status:'TempDisabled', Organization:'Consort',PTID:'',TrainNumber:'',Domain:'Tetra',disable:false},
  {mcptt_id:'iwf@consort.com6', contactName:'Train 80413', tetra_id:'4022', subscriber_type:'TRCP', Reg_status:'Registered', Organization:'Consort',PTID:'8965',TrainNumber:'4367',Domain:'Tetra',disable:false},
  {mcptt_id:'iwf@consort.com7', contactName:'Unified 123', tetra_id:'4022', subscriber_type:'Unified', Reg_status:'Registered', Organization:'Consort',PTID:'8965',TrainNumber:'4367',Domain:'Tetra',disable:false},
  {mcptt_id:'iwf@consort.com', contactName:'Unified 124', tetra_id:'4056', subscriber_type:'Unified', Reg_status:'TempDisabled', Organization:'Consort',PTID:'',TrainNumber:'',Domain:'Tetra',disable:false},
  {mcptt_id:'iwf@consort.com8', contactName:'Dispatcher 12', tetra_id:'4023', subscriber_type:'Dispatcher', Reg_status:'Registered', Organization:'Consort',PTID:'',TrainNumber:'',Domain:'MCX',disable:false},
  {mcptt_id:'iwf@consort.com9', contactName:'Terminal', tetra_id:'4023', subscriber_type:'Terminal', Reg_status:'Registered', Organization:'Consort',PTID:'',TrainNumber:'',Domain:'MCX',disable:false},
  {mcptt_id:'iwf@consort.co12', contactName:'Dispatcher 14', tetra_id:'4057', subscriber_type:'Dispatcher', Reg_status:'TempDisabled', Organization:'Consort',PTID:'',TrainNumber:'',Domain:'MCX',disable:false},
  {mcptt_id:'iwf@consort.com0', contactName:'Terminal2', tetra_id:'4090', subscriber_type:'Terminal', Reg_status:'TempDisabled', Organization:'Consort',PTID:'',TrainNumber:'',Domain:'MCX',disable:false},
]

const Communication = (props) =>{
  const { isAuthenticated,navigateToLogin } = props;
  useEffect(() => {
    if(!isAuthenticated) navigateToLogin()
  }, [isAuthenticated])

  return (
    <div>
    <Header page={'communication'}/>
    {/* Body Start */}
    <div class="main-nav-body">
      {/* Train Page starts here */}
      <div class="comm-grid">
        <div class="c1 wrap-1 pad-0">
          <Widget/>
        </div>
        <div class="c2 wrap-1">
          <ContactListTable/>
        </div>
        <div class="c4 wrap-1">
          <IncomingCalls/>
        </div>
        <div class="c3 wrap-1 ovr-scr-y">
          <EmergencyCalls/>
        </div>
        <div class="c5 wrap-1">
          <NetworkStatus/>
        </div>
        <div class="c6 wrap-1">
          <ActiveCalls/>
        </div>
        <div class="c7 wrap-1">
          {global.config.sds_chat_config==="chatbox"?<SDSTable/>:<SDS_Table_Old/>}
        </div>
        <div class="c8 wrap-1">
          <ActivityLogTable/>
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

Communication.propTypes = propTypes

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Communication)