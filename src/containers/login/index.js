import React, { Component } from "react";
import { push } from "react-router-redux";
import { bindActionCreators } from 'redux'
import { connect } from "react-redux";
import { Popup } from 'semantic-ui-react'
import './login.css';
import { SplashScreen } from '../../components/commom';
import { errorLogin, successLogin, fetchDialerPadOptions } from '../../modules/actions'
import { fetchContacts } from '../../modules/communication'
import { systemStatusReceived } from '../../modules/connection'
import { network_config } from "../../constants/constants";

import MainPage from "../home/mainPage";

let tabConfiguration = {
  Trains: true,
  Communication: true,
  Alerts: true,
  Admin: false,
  Recordings: true,
  RadioBaseStation: false,
  TrainMovement: "none",
  Grab: "default",
}

class Login_page extends Component {
  constructor(props) {
    super(props);
    this.state = {
      company_name: "",
      name: "",
      password: "",
      auth: [
        { id: "ConsortDigital@India", password: "ConsortDigital" },
        { id: "Alstom@India", password: "AlstomIndia" },
        { id: "DMRC@India", password: "DMRCIndia" }
      ],

      seen: false,
      status: "",
      forgotPsd: false,
      loading: true,
      navigateToMain: false,
    };
    this.requestRef = React.createRef();
    this.optionRef = React.createRef();
  }

  componentDidMount() {
    setTimeout(() => {
      this.setState({ loading: false })
    }, 2000);
    localStorage.setItem('deviceSet', false)
    localStorage.setItem('userDetails', JSON.stringify(''))
    this.props.mcxClient.on('LOGIN_COMPLETE', async data => {
      console.log('faObj login successfully', data)
      if (data.userData) {
        data.userData = {...data.userData, UserName: this.state.name}
      }
      this.props.successLogin(data.userData, data.userProfile);
      if (data.userData.profile.Role) {
        if (data.userData.profile.Role === 'Admin') {
          //tabConfiguration = { ...tabConfiguration, Admin: true }
          tabConfiguration = {
            ...tabConfiguration, Trains: false,
            Communication: false,
            Alerts: false,
            Recordings: false,
            Admin: true,
            RadioBaseStation: false,
            TrainMovement: "none",
            Grab: "default",
          }
        } else {
          tabConfiguration = { ...tabConfiguration, Admin: false }
          let favConts = await this.props.mcxClient.getData('FAVS', data.userData.profile.mcptt_id)
          favConts = (favConts && favConts.length) ? favConts : []
          const contList = (data.contactlist && data.contactlist.length) ? data.contactlist : []
          this.props.fetchContacts({ favConts, contList });
        }
      }

      if (data.faConfig && data.faConfig.length > 0) {
        let faConfigure = data.faConfig[0]
        console.log('faObj faConfiguree ', faConfigure)
        let baseStation = faConfigure.permissions.baseStation
        let communicationTab = faConfigure.permissions.communicationTab
        let trainTab = faConfigure.permissions.trainTab
        let alertTab = faConfigure.permissions.alertTab
        let recordingsTab = faConfigure.permissions.recordingsTab
        let trainMovement = faConfigure.permissions.trainMovement
        let grabAllowed = faConfigure.permissions.grabAllowed

        for (let index = 1; index < data.faConfig.length; index++) {
          const element = data.faConfig[index];
          console.log('faObj faConfiguree element', element)
          baseStation = baseStation || element.permissions.baseStation
          communicationTab = communicationTab || element.permissions.communicationTab
          trainTab = trainTab || element.permissions.trainTab
          alertTab = alertTab || element.permissions.alertTab
          recordingsTab = recordingsTab || element.permissions.recordingsTab
          //all/default/none
          if (grabAllowed === 'none') {
            grabAllowed = element.permissions.grabAllowed
          } else if (grabAllowed === 'default') {
            if (element.grabAllowed === 'all') {
              grabAllowed = element.permissions.grabAllowed
            }
          }

          if (trainMovement === 'none') {
            trainMovement = element.permissions.trainMovement
          } else if (trainMovement === 'default') {
            if (element.trainMovement === 'all') {
              trainMovement = element.permissions.trainMovement
            }
          }
        }

        tabConfiguration = {
          ...tabConfiguration, Trains: trainTab,
          Communication: communicationTab,
          Alerts: alertTab,
          RadioBaseStation: baseStation,
          TrainMovement: trainMovement,
          Recordings: recordingsTab,
          Grab: grabAllowed,
        }
        let currentLA = ""
        if (tabConfiguration.Grab === "all") {
          currentLA = "ALLLA"
        } else if (faConfigure.description.length > 0) {
          currentLA = faConfigure.description.replace(/\s+/g, '').toLocaleUpperCase()
        }
        if (faConfigure.description.length > 0) {
          let faID = faConfigure.description.replace(/\s+/g, '').toLocaleUpperCase()
          global.config.faID = faID
        }
        global.config.currentLAId = currentLA
        console.log("Current LA", global.config.faID)
        if (data.activatedFA) {
          global.config.activatedFA = data.activatedFA;
          console.log('activatedFA...', global.config.activatedFA)
        }
        if (faConfigure) {
          /*
            alertTab: false
            baseStation: true
            communicationTab: false
            description: "Chief Controller"
            grabAllowed: "all"
            trainMovement: "all"
            trainTab: true
 
            Trains: true,
            Communication: true,
            Alerts: true,
            Admin: true,
            RadioBaseStation: true,
            TrainMovement: "none",
            Grab: "default",
          */
        }
      }

      if (data.userProfile && data.userProfile.permissions) {
        let baseStation = data.userProfile.permissions.baseStation
        let communicationTab = data.userProfile.permissions.communicationTab
        let trainTab = data.userProfile.permissions.trainTab
        let alertTab = data.userProfile.permissions.alertTab
        let trainMovement = data.userProfile.permissions.trainMovement
        let grabAllowed = data.userProfile.permissions.grabAllowed
        let locationTab = data.userProfile.permissions.locationTab
        let recordingsTab = data.userProfile.permissions.recordingsTab
        tabConfiguration = {
          ...tabConfiguration, Trains: trainTab,
          Communication: communicationTab,
          Alerts: alertTab,
          RadioBaseStation: baseStation,
          TrainMovement: trainMovement,
          Grab: grabAllowed,
          Location: locationTab,
          Recordings: recordingsTab
        }
        console.log('faObj faConfiguree permissions ', data.userProfile.permissions)
      }

      if (data.faList && data.faList.length > 0) {
        let firstFA = data.faList[0]
        let currentLA = ""
        if (tabConfiguration.Grab === "all") {
          currentLA = "ALLLA"
        } else {
          if (firstFA.CallerDescr) {
            currentLA = firstFA.CallerDescr.replace(/\s+/g, '').toLocaleUpperCase()
          }
        }
         global.config.currentLAId = currentLA
         global.config.faID = currentLA
        console.log("Current FA LA", global.config.faID, currentLA, firstFA, data.faList)
      }
      if (data.activatedFA) {
        global.config.activatedFA = data.activatedFA;
        console.log('activatedFA...', global.config.activatedFA)
      }
      global.config.userConfig = {
        ...global.config.userConfig, ...tabConfiguration
      }
      console.log("Current FA LA configration..", global.config.userConfig, tabConfiguration)
      this.setState({ loading: false, navigateToMain: true })
    })

    this.props.mcxClient.on('DIALER_OPTION', data => {
      console.log('mappedOption login...', data);
      this.props.fetchDialerPadOptions(data);
    })

    this.props.mcxClient.on('USER_LOGIN_COMPLETE', data => {
      console.log('user login complete', data)
      if (data.userData.profile.Role) {
        if (data.userData.profile.Role === 'Admin') {
          tabConfiguration = { ...tabConfiguration, Admin: true }
        } else {
          tabConfiguration = { ...tabConfiguration, Admin: false }
        }
        global.config.userConfig = {
          ...global.config.userConfig, ...tabConfiguration
        }
      }
    })

    this.props.mcxClient.on('FA_LOGIN_FAILED', data => {
      if (tabConfiguration.Admin === true) {
        console.log('FA login failed Admin Role', data)
        this.props.successLogin(data.userData, null)
        this.setState({ loading: false, navigateToMain: true })
      } else {
        this.setState({ status: 'FA is not attached.Please try again!', seen: true })
        //this.props.errorLogin()
        this.setState({ loading: false, navigateToMain: false })
      }
    })

    this.props.mcxClient.on('LOGIN_FAILED', data => {
      console.log('login failed', data)
      this.setState({ status: 'Invalid credentials.Please try again!', seen: true })
      //this.props.errorLogin()
      this.setState({ loading: false, navigateToMain: false })
    })

    this.props.mcxClient.on('onRegister', (sock) => {
      console.log('mcxclient connected onRegister login', sock)
      this.props.systemStatusReceived({
        applicationInstanceType: network_config,
        systemStateType: "UP",
        systemType: "MCX",
      })
    })

    if (this.props.tokenId) {
      console.log('login access_token', this.props.tokenId)
      this.setState({ loading: true })
      this.props.mcxClient.loginWithToken(this.props.tokenId)
    } else {
      this.setState({ loading: false })
    }
  }

  login() {
    const { name, password } = this.state;
    if (!name || !password) {
      if (!password) this.setState({ status: "Please enter password", seen: true });
      if (!name) this.setState({ status: "Please enter username", seen: true });
    }
    if (name && password) {
      this.setState({ loading: true })
      this.props.mcxClient.login(name, password)
    }
  }

  loginFailed = () => {
    this.setState({ status: 'Invalid credentials.Please try again!', seen: true })
    //this.props.errorLogin()
  }

  onSubmit = async (e) => {
    e.preventDefault();
  }

  render() {
    if (this.state.navigateToMain) {
      return <MainPage mcxClient={this.props.mcxClient} />;
    }
    return (
      <div className="backg">
        {this.state.loading ? <SplashScreen /> : null}
        {/* <Header page={'alerts'}/> */}
        <div className="row login_input" style={{ width: "100vw", height: "100vh" }}>
          <div className="col-xl-7"></div>
          <div className="col-xl-5">
            <div className="auth">
              <center>
                <div className="card" style={{ width: "420px" }}>
                  <div
                    className="card-body"
                    id="login"
                    style={{ padding: "60px 75px" }}
                  >
                    <h1 className="white mb-12 f-40" id="title">
                      Welcome
                    </h1>
                    <h4 className="f-reg lime-4 f-12 m-b-30" id="title">
                      Press Login to continue
                    </h4>

                    {/* <div className="login_input m-b-16">
                      <input
                        type="text"
                        className="textinput-white blue5 f-semi rounded form-control"
                        name="name"
                        placeholder="Company Name"
                        id="username"
                        required=""
                        v-model="company_name"
                      />
                    </div> */}
                    <div className="login_input m-b-16">
                      <input
                        type="text"
                        className="textinput-white blue5 f-semi rounded form-control"
                        name="name"
                        placeholder="Username"
                        id="password"
                        required=""
                        v-model="name"
                        value={this.state.name}
                        onChange={(e) => this.setState({ name: e.target.value, status: '' })}
                      />
                    </div>

                    <div className="login_input m-b-16">
                      <input
                        type="password"
                        className="textinput-white blue5 f-semi rounded form-control"
                        name="password"
                        placeholder="Password"
                        id="password"
                        required=""
                        v-model="password"
                        value={this.state.password}
                        onChange={(e) => this.setState({ password: e.target.value, status: '' })}
                      />
                    </div>

                    <div className="dropdown-divider"></div>
                    <button
                      type="submit"
                      id="login_btn"
                      name="login_btn"
                      class="btn btn-warning rounded f-semi blue5 btn-lg btn-block font-18 m-t-12 m-b-10"
                      onClick={() => this.login()}
                    >Log in</button>
                    {this.state.seen ? (
                      <div id="status" className="m-t-5 m-b-30">
                        <h6 style={{ color: 'black' }}>{this.state.status}</h6>
                      </div>
                    ) : null}


                    <Popup
                      className='hotkey-popup'
                      hideOnScroll
                      trigger={
                        <a
                          id="forgot-psw"
                          slot="reference"
                          ref={this.requestRef}
                          className="font-14 text-warning m-l-5"
                        >Request Access</a>
                      }
                      style={{ padding: 0 }}
                      content={
                        <div className="popper" ref={this.optionRef}>
                          <div className="popover-grid">
                            <div className="pop-header">
                              <div className="pop-header-grid">
                                <div className="pop-name">
                                  <div>
                                    {" "}
                                    <p className="f-pop-title">Contact</p>{" "}
                                  </div>
                                </div>
                                <div className="pop-icom">
                                  <i className="feather icon-mail blue5"></i>
                                </div>
                              </div>
                            </div>

                            <div className="pop-body">
                              <div>
                                <div className="f-pop-text"> Team Consort</div>
                                <a
                                  className="f-pop-title"
                                //href="mailto:abc@siesgst.ac.in"
                                >
                                  {" "}
                                  1. Devdarsh Jain
                                </a>
                                <br />
                                <a
                                  className="f-pop-title"
                                //href="mailto:abc@siesgst.ac.in"
                                >
                                  {" "}
                                  2. Another member
                                </a>
                              </div>
                            </div>
                            <div className="pop-footer"></div>
                          </div>
                        </div>
                      }
                      on='click'
                      position='bottom center'
                    />
                  </div>
                </div>
              </center>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  user: state.auth.user,
})

const mapDispatchToProps = dispatch => bindActionCreators({
  successLogin,
  errorLogin,
  fetchContacts,
  systemStatusReceived,
  fetchDialerPadOptions,
  navigateToLogin: () => push('/login'),
  navigateToHome: () => push('/')
}, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(Login_page);