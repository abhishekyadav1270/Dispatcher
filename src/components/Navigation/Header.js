import React from 'react'
import PropTypes from 'prop-types'
import { push } from 'react-router-redux'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { NavLink, Link } from 'react-router-dom'
import moment from 'moment'
import { Modal, Button } from 'react-bootstrap'
import axios from 'axios'
// import { hasPermission } from '../../utils/lib'
// import Count from '../../containers/app/count'
import DeviceTesting from '../../containers/deviceTesting'
import DeviceTestingSetting from '../../containers/deviceTesting/Setting'
import { stopTimer } from '../../modules/connection'
import { updateTab } from '../../modules/activityLog'
import { logoutUser } from '../../modules/actions'
import UserDetails from '../commom/userDetails'
// import { globalConfig } from '../../constants/verConfig';
import '../../constants/verConfig';
import Settings from '../Settings'
import CallForwarding from '../CallForwarding'
import ChangePassword from '../changepassword'
// import '../../styles/header.scss'
import { speakerOnOrOffCalls, muteOrUnmuteCalls, sendGroupCall, initiateDefaultGrpCall } from '../../modules/communication'
import { GroupCall } from '../../models/call'
import { getActiveTaskCount } from '../../modules/task'
import { Badge } from '@mui/material'
import { newAlertBeep, emgCall } from '../../constants/constants'

const emgAlertBeep = new Audio(newAlertBeep)
emgAlertBeep.loop = true

const emgInComCall = new Audio(emgCall)
emgInComCall.loop = true

const propTypes = {
  statuses: PropTypes.array,
  groupStatuses: PropTypes.array,
  activities: PropTypes.array,
  navigateToLogin: PropTypes.func.isRequired,
  stopTimer: PropTypes.func.isRequired,
  isAuthenticated: PropTypes.bool,
  logoutUser: PropTypes.func.isRequired
}

var fired = false;

class Header extends React.Component {

  state = {
    password: '',
    showProfile: false,
    showTesting: false,
    showLogoutConfirm: false,
    showSettings: false,
    showPassword: false,
    showCallForwarding:false,
    mute: false,
    speaker: false,
    curTime: null,
    Tab2: false,
    Tab3: false,
    Tab4: false,
    Tab5: false,
    Tab1: false,
    taskCountData: { emergencyTaskCount: 0, hasEmergencyTask: false },
    isEmgCallRunning: false,
    prevTab: '',
    menuOptions: [
      { text: 'My Profile', value: 1, img: "assets/images/svg-icon/user.svg" },
      { text: 'Change Password', value: 2, img: "assets/images/svg-icon/email.svg" },
      { text: 'Settings', value: 3, img: "assets/images/svg-icon/settings.svg" },
      {text: 'Call Forwarding', value: 4, img: "assets/images/svg-icon/call-forwarding.svg" },
      { text: 'Logout', value: 5, img: "assets/images/svg-icon/logout.svg" },
    ],
    Tabs: [
      { text: 'Trains', value: 'Tab1', to: '/trains', iconClass: 'la la-subway m-r-8' },
      { text: 'Location', value: 'Tab2', to: '/location', iconClass: 'feather icon-map-pin m-r-8' },
      { text: 'Communication', value: 'Tab3', to: '/communication', iconClass: 'feather icon-phone m-r-8' },
      { text: 'Alerts', value: 'Tab4', to: '/alerts', iconClass: 'feather icon-alert-triangle m-r-8' },
      { text: 'Admin', value: 'Tab5', to: '/admin', iconClass: 'feather icon-user-plus m-r-8' },
      { text: 'Recordings', value: 'Tab6', to: '/recordings', iconClass: 'feather icon-play-circle m-r-8' },
    ],
    subrData: '',
  }

  logout = async () => {
    if (global.config.userConfig['pswLogout']) {
      this.logoutAuth();
    }
    else {
      this.props.stopTimer()
      await this.props.logoutUser()
      window.location.reload();
      this.props.navigateToLogin()
    }
  }

  logoutAuth = async () => {
    if (this.state.password) {
      let axiosConfig = {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Host': 'cms1.example.com'
        },
        auth: {
          username: "js",
          password: ""
        }
      };
      try {
        const { user } = this.props;
        const psw = this.state.password;
        let userId = user.UserName ? user.UserName : user.profile.mcptt_id ? user.profile.mcptt_id : ''
        console.log('username userId... ', userId)
        const params = new URLSearchParams();
        params.append('grant_type', 'password')
        params.append('ClientId', 'js')
        params.append('username', userId)
        params.append('password', psw)
        params.append('scope', '3gpp:IWF:Tetra 3gpp:mcptt:ptt_server 3gpp:mcptt:key_management_server')
        console.log('logout credential..', userId, psw, user.profile.mcptt_id)
        let loginApi = `https://${global.config.ipConfig.idmsHost}:${global.config.ipConfig.idmsPort}/connect/token`
        const response = await axios.post(loginApi, params, axiosConfig);
        console.log('logout response idms..', response)
        if (response.status === 200) {
          if (response.data && response.data.access_token) {
            this.props.stopTimer()
            await this.props.logoutUser()
            console.log('logout response mainpage..')
            window.location.reload();
            this.props.navigateToLogin()
          }
          else this.setState({ pswErr: 'Password does not match.Please try again!' })
        }
        else this.setState({ pswErr: 'Oops! Something went wrong.' })
      }
      catch (e) {
        console.log('ERR: ', e);
        this.setState({ pswErr: 'Invalid password!' })
      }
    }
    else this.setState({ pswErr: 'Please enter password to logout.' })
  }

  menuACtion = (type) => {
    if (type === 1) {
      this.setState({ showProfile: true })
    }
    if (type === 2) {
      this.setState({ showPassword: true })
    }
    if (type === 3) {
      this.setState({ showSettings: true })
    }
    if (type === 4) {
      // this.logout();
      this.setState({ showCallForwarding: true })
    }
    if (type === 5) {
      // this.logout();
      this.setState({ showLogoutConfirm: true })
    }
  }

  componentDidMount() {
    setInterval(() => {
      this.setState({
        // curTime: new Date().toLocaleTimeString('en-GB').slice(0, -3)
        curTime: moment().format('HH:mm:ss')
      })
    }, 1000)
    const screen = this.props && this.props.page;
    if (screen === 'trains') this.setState({ Tab1: true });
    else if (screen === 'location') this.setState({ Tab2: true });
    else if (screen === 'communication') this.setState({ Tab3: true });
    else if (screen === 'alerts') this.setState({ Tab4: true });
    else if (screen === 'admin') this.setState({ Tab5: true });
    else if (screen === 'recordings') this.setState({ Tab6: true });
    this.props.updateTab(screen)

    if (this.props.user && this.props.user.profile) {
      let reqObj = {
        mcxId: this.props.user.profile.mcptt_id,
        falist: [global.config.faID]
      }
      this.props.getActiveTaskCount(reqObj)
      // setInterval(() => {
      //   this.props.getActiveTaskCount(reqObj)
      // }, 15000)
    }

    this.setState({ showTesting: !JSON.parse(localStorage.getItem('deviceSet')) })
    // const subr = JSON.parse(localStorage.getItem('userDetails')); 
    // this.setState({ subrData: subr });
    if (this.props.userDetail && this.props.userDetail.length) {
      this.setState({ subrData: this.props.userDetail[0] })
    }
    this.setState({ mute: this.props.muteAllCall });
    this.setState({ activeTaskCount: this.props.activeTaskCount });

    this.setState({ speaker: this.props.speakerOnOffAllCall });

    if (this.props.groupCalls.length > 0) {
      let emgCalls = this.props.groupCalls.filter(call => Number(call.callPriority) == 15)
      if (emgCalls.length > 0) {
        this.setState({ isEmgCallRunning: true })
      } else {
        emgInComCall.pause()
        emgInComCall.currentTime = 0
      }
    } else {
      emgInComCall.pause()
      emgInComCall.currentTime = 0
    }
    if (this.props.activeTab == 'communication') {
      emgInComCall.pause()
      emgInComCall.currentTime = 0
    }
    console.log('header active tab did mount..', this.props.activeTab)
  }

  componentDidUpdate(prevProps) {
    if(this.props.user && this.props.user.profile && this.props.user.profile.Role=='Admin'){
      return;
    }
    if (prevProps.userDetail !== this.props.userDetail) {
      if (this.props.userDetail && this.props.userDetail.length && !this.state.subrData) {
        this.setState({ subrData: this.props.userDetail[0] })
      }
    }
  
    if (prevProps.defaultGroupId !== this.props.defaultGroupId) {
      // const _this = this;
      fired = false;
      console.log('default grp id...', prevProps.defaultGroupId, this.props.defaultGroupId, this.props.activeTab);
      document.removeEventListener('keydown', this.keydownHandler);
      document.removeEventListener('keyup', this.keyupHandler);
      document.addEventListener("keydown", (event) => this.keydownHandler(event))
      document.addEventListener("keyup", (event) => this.keyupHandler(event))
    }
    //console.log('activeTaskCount....', this.props.activeTaskCount, prevProps.activeTaskCount)
    if (prevProps.activeTaskCount !== this.props.activeTaskCount) {
      if (this.props.activeTaskCount && this.props.activeTaskCount.data && this.props.activeTaskCount.data.length > 0) {
        let TotalPendingTaskCount = 0
        let hasEMerTask = false
        this.props.activeTaskCount.data.map((e) => {
          if (e.taskPriority === "0" && e.unAcknowledgedTask > 0) {
            hasEMerTask = true
          }
          TotalPendingTaskCount = TotalPendingTaskCount + e.unAcknowledgedTask
        })
        this.setState({ taskCountData: { emergencyTaskCount: TotalPendingTaskCount, hasEmergencyTask: hasEMerTask } })
      } else {
        this.setState({ taskCountData: { emergencyTaskCount: 0, hasEmergencyTask: false } })
      }
      //console.log('activeTab action task for beep sound', this.props.beepTask)
      if (this.props.beepTask) {
        // ring alarm 
        emgAlertBeep.pause()
        emgAlertBeep.currentTime = 0
        emgAlertBeep.play()
      } else {
        emgAlertBeep.pause()
        emgAlertBeep.currentTime = 0
      }

      if (prevProps.taskRefresh !== this.props.taskRefresh) {
        //console.log("taskRefresh event in header")
        if (this.props.taskRefresh) {
          setTimeout(() => {
            if (this.props.user && this.props.user.profile) {
              let reqObj = {
                mcxId: this.props.user.profile.mcptt_id,
                falist: [global.config.faID]
              }
              this.props.getActiveTaskCount(reqObj)
            }
          }, 1000);
        }
      }
    }
    //console.log('header active tab isEmgCallRunning..', this.state.isEmgCallRunning, this.props.activeTab)
    if (prevProps.groupCalls !== this.props.groupCalls) {
      //console.log('header active tab..', this.props.activeTab, this.props.groupCalls, prevProps.activeTab, this.state.prevTab, this.state.isEmgCallRunning)
      let emgCalls = []
      let playEmgBeep = false
      if (this.props.groupCalls.length > 0) {
        emgCalls = this.props.groupCalls.filter(call => Number(call.callPriority) == 15)
        if (emgCalls.length > 0) {
          //console.log('header active tab emg..', emgCalls)
          if (this.state.prevTab == 'communication' && this.state.isEmgCallRunning) {
            playEmgBeep = false
          } else if (this.props.activeTab !== 'communication') {
            playEmgBeep = true
          }
          this.setState({ isEmgCallRunning: true })
        } else {
          this.setState({ isEmgCallRunning: false })
        }
      } else {
        this.setState({ isEmgCallRunning: false })
      }
      if (playEmgBeep) {
        emgInComCall.pause()
        emgInComCall.currentTime = 0
        emgInComCall.play()
      } else {
        emgInComCall.pause()
        emgInComCall.currentTime = 0
      }
      this.setState({ prevTab: prevProps.activeTab })
    }

    if (prevProps.activeTab !== this.props.activeTab) {
      this.setState({ prevTab: prevProps.activeTab })
      //console.log('header active tab changed..', this.props.activeTab, prevProps.activeTab)
      if (this.props.activeTab == 'communication') {
        emgInComCall.pause()
        emgInComCall.currentTime = 0
      }
    }
  }


  keydownHandler(event) {
    const { sendGroupCall, navigateToCom, updateTab, user, mpttKey } = this.props;
    switch (event.key) {
      // case 116 : // 'F5'
      case mpttKey: // 'F13'
        if (!fired) {
          fired = true
          let grpObj = initiateDefaultGrpCall();
          if (grpObj && grpObj.groupId && grpObj.groupId.length > 0) {
            //console.log('keytest down pressed true call...', grpObj.groupId, grpObj.activeTab, fired)
            let call = new GroupCall('SIMPLEX_GROUP_CALL', grpObj.groupId, 'MEDIUM');
            sendGroupCall(user, call)
            if (grpObj.activeTab !== 'communication') {
              navigateToCom()
              updateTab('communication')
            }
          }
        }
        break;
      default:
        break;
    }
  }

  getActiveTab() {
    return this.props.activeTab;
  }

  keyupHandler(event) {
    fired = false;
    document.removeEventListener('keydown', this.keydownHandler);
    document.removeEventListener('keyup', this.keyupHandler);
  }

  handleClose = () => {
    this.setState({ showLogoutConfirm: false })
  }

  muteUnmuteBtnClick = () => {
    this.setState({ mute: !this.state.mute })
    this.props.muteOrUnmuteCalls(!this.state.mute)
  }

  speakerOnOffBtnClick = () => {
    this.setState({ speaker: !this.state.speaker })
    this.props.speakerOnOrOffCalls(!this.state.speaker)
  }

  getAppLogo = () => {
    switch (global.config.project) {
      case 'mumbai':
        return 'mmrda-latest'
      case 'nagpur':
        return 'metro'
      case 'dhaka':
        return 'Dhaka'
      case 'cdot':
        return 'cdot'
      case 'tata':
          return 'tata'  
      default:
        return 'Pune'
    }
  }

  getBgColr = () => {
    switch (global.config.project) {
      case 'mumbai':
        return '#393939'
      case 'nagpur':
        return '#393939'
      default:
        return '#393939'
    }
  }

  render() {
    const { user,userProfile, isAuthenticated, statuses, groupStatuses, activities, individualCalls, tetraId, userDetail, activeTaskCount, taskRefresh } = this.props
    const { curTime, Tab1, Tab2, Tab3, Tab4, showProfile, showLogoutConfirm, showCallForwarding, showTesting, showSettings, subrData, mute, speaker, showPassword } = this.state
    const alarmsCount = [...statuses, ...groupStatuses].filter(status => status.stateType === 'PERSISTED').length
    const communicationCount = individualCalls.length
    const activitiesCount = activities.length
    return isAuthenticated ? (
      <div>
        <div style={{ backgroundColor: this.getBgColr(), paddingTop: '12px' }}>
          <div class="header-grid in-blc">
            <div class="mmrda-logo">
              {/* <img src={`assets/config/${this.getAppLogo()}.png`} alt='logo' */}
              <img src={`assets/config/logo.png`} alt='logo'
                style={{ width: '150px', height: 'auto', objectFit: 'contain' }} />
            </div>
            <ul class="nav nav-tabs custom-tab-line bg_gray-3 in_blc" id="defaultTabLine" role="tablist">
              {this.state.Tabs.map((tab, id) => {
                if (global.config.userConfig[tab.text]) { //
                  return (
                    <li
                      class={tab.text === "Communication" && this.state.isEmgCallRunning ? "nav-item screen-tab " + "bg-emg-color"
                        : "nav-item screen-tab " + (this.state[tab.value] ? "bg-active-color" : "bg-transp")
                      } key={id}>
                      <Link
                        to={tab.to}
                        class={"screen-tab-option " + (this.state[tab.value] ? "white" : "tab-color")}
                        id="home-tab-line"
                      >
                        <i class={tab.iconClass}></i>{tab.text}
                        {/* {(tab.value ==='Tab3' || tab.value ==='Tab4')?<span class="badge badge-danger f-12 m-l-5">1</span>:null} */}
                      </Link>
                      {tab.text === "Alerts" && this.state.taskCountData.emergencyTaskCount > 0 ?
                        <dev style={{ marginRight: "12px" }}>
                          <Badge color="error" variant="dot" invisible={!this.state.taskCountData.hasEmergencyTask}>
                            <label style={{ color: 'white', backgroundColor: '#3661AC', padding: "5px", borderRadius: "4px", marginLeft: "-9px", fontSize: "13px" }}>
                              {this.state.taskCountData.emergencyTaskCount}
                            </label>
                          </Badge>
                        </dev>
                        : null
                      }
                    </li>
                  )
                }
              })}
            </ul>
            <div class="header-time-grid">
              <div class="date f-28 text-muted">{curTime}</div>
              {global.config.userConfig.Communication === true ?
                (
                  <div class="time f-bold f-12">
                    {/* mic_btn mut_btn */}
                    <button slot="reference" class="btn btn-primary" onClick={this.muteUnmuteBtnClick}>
                      <i class={"black feather icon-" + (mute ? 'mic-off' : 'mic')}></i>
                    </button>
                    <button slot="reference" class="btn btn-primary m-l-20" onClick={this.speakerOnOffBtnClick}>
                      <i class={"black feather icon-" + (speaker ? 'volume-x' : 'volume')}></i>
                    </button>

                    <button slot="reference" class="btn btn-primary m-l-20" onClick={() => { this.setState({ showTesting: !showTesting }) }}>
                      <i class="black dripicons-headset"></i>
                    </button>
                    <button slot="reference" class="btn btn-primary m-l-20" onClick={() => { }}>
                      <i class="black dripicons-question"></i>
                    </button>
                    {/* {true ?
                  <div id='PopperClassHere'>
                    <DeviceTesting trigger={
                      <button slot="reference" class="btn btn-primary">
                        <i class="dripicons-headset"></i>
                      </button>
                    } />
                  </div> : null} */}
                  </div>
                ) : null
              }
            </div>
            {/* <div class="header-muteall-grid">
              
            </div> */}
            <div class="m-center">
              <div class="date in-blc dispatcher-name f-bold f-12 m-r-10">
                <strong>{tetraId ? tetraId + ' : ' : ''}{subrData && subrData.contactName}
                  <br />{user && user.profile.Role ? user.profile.Role.toUpperCase() : ''}</strong>
                {/* {global.config.project != 'dhaka' ? user && user.profile.mcptt_id ? ' ( ' + user.profile.mcptt_id + ' )' : '----' : ''} */}
              </div>
            </div>

            <div>
              <div class="in-blc x30 m-r-30">
                <div class="dropdown">
                  <a
                    class="dropdown-toggle"
                    role="button"
                    id="profilelink"
                    data-toggle="dropdown"
                    aria-haspopup="true"
                    aria-expanded="false"
                  ><img
                      src="assets/images/users/profile.svg"
                      class="img-fluid"
                      alt="profile"
                    /></a>
                  <div
                    class="dropdown-menu dropdown-menu-right bg-white"
                    aria-labelledby="profilelink"
                  >
                    <div class="dropdown-item">
                      <div class="profilename">
                        <h5>{user && user.profile.name ? user.profile.name : 'Dispatcher'}</h5>
                      </div>
                    </div>
                    <div class="userbox">
                      <ul class="list-unstyled mb-0">
                        {this.state.menuOptions.reduce((acc,item)=>{
                          if(userProfile && userProfile.hasOwnProperty("callForwardingData") && userProfile.callForwardingData.allowCallForwarding===true){
                             acc.push(item);
                          }
                          else{
                              if(item.value!=4){
                                acc.push(item); 
                              }
                          }
                          return acc;
                        },[]).map((item, id) => {
                          return (
                            <li class="media dropdown-item" key={id} onClick={() => this.menuACtion(item.value)}>
                              <a class="profile-icon">
                                <img
                                  src={item.img}
                                  class="img-fluid"
                                  alt={item.text}
                                  style={{ verticalAlign: 'middle' }}
                                />{item.text}</a>
                            </li>
                          )
                        })}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div >
        <ChangePassword open={showPassword} closeModal={(c) => this.setState({ showPassword: c })} />
        <Settings open={showSettings} closeModal={(c) => this.setState({ showSettings: c })} />
        <CallForwarding open={showCallForwarding} closeModal={(c) => this.setState({ showCallForwarding: c })} />
        <DeviceTestingSetting open={showTesting} closeModal={(c) => this.setState({ showTesting: c })} />
        {showProfile ? <UserDetails open={showProfile} closeModal={(v) => this.setState({ showProfile: v })} type={'DSP'} /> : null}
        {showLogoutConfirm ?
          <Modal show={showLogoutConfirm} onHide={this.handleClose} style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
            <Modal.Header closeButton style={{ backgroundColor: '#414141', border: '0px' }}>
              <Modal.Title>Logout</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <div class='p-l-10 p-r-10 m-b-10'>
                <p class="f-16 black m-b-10">Do you really want to Logout ?</p>
                {global.config.userConfig['pswLogout'] ?
                  <React.Fragment>
                    <p class="f-widg-label gray-8">Enter your password</p>
                    <input
                      type="password"
                      autoFocus
                      class="textinput-white w100"
                      autocomplete="off"
                      placeholder="Enter password"
                      onChange={(e) => this.setState({ password: e.target.value, pswErr: '' })}
                    />
                    <p class="f-widg-label red-7">{this.state.pswErr}</p>
                  </React.Fragment>
                  : null}
              </div>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="light" onClick={this.handleClose}>
                Close
              </Button>
              <Button variant="success" onClick={this.logout}>
                Logout
              </Button>
            </Modal.Footer>
          </Modal>
          : null}
      </div>
    ) : <div />
  }
}

const mapStateToProps = state => ({
  user: state.auth.user,
  userProfile: state.auth.userProfile,
  userDetail: state.auth.userDetail,
  isAuthenticated: state.auth.isAuthenticated,
  statuses: state.alarm.statuses,
  groupStatuses: state.alarm.groupStatuses,
  activities: state.location.activities,
  individualCalls: state.communication.individualCalls,
  defaultGroupId: state.communication.defaultGroupId,
  groupCalls: state.communication.groupCalls,
  tetraId: state.auth.userTetraId,
  muteAllCall: state.communication.muteAllCall,
  speakerOnOffAllCall: state.communication.speakerOnOffAllCall,
  activeTaskCount: state.task.activeTaskCount,
  taskRefresh: state.logs.taskRefresh,
  beepTask: state.task.beepTask,
  activeTab: state.logs.activeTab,
  mpttKey: state.settings.mpttKey
})

const mapDispatchToProps = dispatch => bindActionCreators({
  stopTimer,
  logoutUser,
  updateTab,
  navigateToLogin: () => push('/login'),
  muteOrUnmuteCalls,
  speakerOnOrOffCalls,
  getActiveTaskCount,
  sendGroupCall,
  navigateToCom: () => push('/communication')
}, dispatch)

Header.propTypes = propTypes

export default connect(
  mapStateToProps, mapDispatchToProps, null, {
  pure: false
}
)(Header)