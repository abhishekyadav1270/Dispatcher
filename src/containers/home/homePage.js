import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import Login from "../login";
import '../../constants/verConfig';
import { SplashScreen } from '../../components/commom';
import { MCXClientConfig } from '../../utils/mcxclientConfig';
import { updateDomain } from '../../modules/domains';
import { updateSystemDgnaSSI } from '../../modules/systemdgnassi';

import { updateDGNA } from '../../modules/enableDgna';
import { updateAmbienceListening } from '../../modules/enableAmbienceListening'
import { updatePatchCall } from '../../modules/enablePatchCall';
import { updateMergeCall } from "../../modules/enableMergeCall";
import { updateCadCall } from '../../modules/enableCadCall'
import { updateCallForward } from "../../modules/enableCallForwarding";

const userManager = require('../../utils/userManager');

const HomePage = (props) => {
  const [isLoading, setLoading] = useState(true)
  const [mcxClient, setMcxClient] = useState(null)

  useEffect(() => {
    document.title = getAppTitle();
    validateLoginMethod()
  }, [])


  const getAppTitle = () => {
    switch (global.config.project) {
      case 'mumbai':
        return 'Mumbai Metro'
      case 'nagpur':
        return 'Nagpur Metro'
      case 'dhaka':
        return 'Dhaka Metro'
      case 'pune':
        return 'Pune Metro'
      case 'cdot':
        return 'Indian Railways'
      case 'tata':
        return 'Tata'
      default:
        return 'Metro'
    }
  }

  const validateLoginMethod = () => {
    let loginMethod = process.env.REACT_APP_LOGIN_METHOD
    if (loginMethod === 'idms') {
      userManager.default.signinRedirect();
      return
    }
    createInitialConfig()
  }

  const createInitialConfig = () => {
    console.log('disp hostt', global.config.ipConfig.dispatcherHost, global.config.ipConfig.idmsHost, global.config.ipConfig.host, global.config.ipConfig.cmcPort)
    if (process.env.REACT_APP_HOST) {
      global.config.ipConfig.dispatcherHost = process.env.REACT_APP_HOST;
    }
    if (process.env.REACT_APP_IDMS_HOST) {
      global.config.ipConfig.idmsHost = process.env.REACT_APP_IDMS_HOST;
    }
    if (process.env.REACT_APP_MCX_HOST) {
      global.config.ipConfig.host = process.env.REACT_APP_MCX_HOST;
    }
    global.config.ipConfig.cmcPort = process.env.REACT_APP_CMS_PORT;

    let mcxClientConfig = new MCXClientConfig()
    mcxClientConfig.getConfig().then(response => {
      if (response.domains) {
        //console.log('update domains home..',response.domains)
        props.updateDomain(response.domains)
        props.updateSystemDgnaSSI(response.systemDgnaSSIs)
        props.updateDGNA(response.enableDgna)
        props.updateAmbienceListening(response.enableAmbienceListening)
        props.updateCadCall(response.enableCadCall)
        props.updatePatchCall(response.enablePatchCall)
        props.updateMergeCall(response.enableMergeCall)
        props.updateCallForward(response.enableCallForwarding)
      }
      //console.log('MCX MCXClientConfig home', response.mcx)
      setMcxClient(response.mcx)
      setLoading(false)
    })
  }
  return (
    isLoading === true ?
      (
        <SplashScreen />
      )
      :
      (
        <Login mcxClient={mcxClient} />
      )
  )
}

export default connect(null, {
  updateDomain,
  updateSystemDgnaSSI,
  updateDGNA,
  updateAmbienceListening,
  updateCadCall,
  updatePatchCall,
  updateMergeCall,
  updateCallForward
})(HomePage)