/**
 *  Starting point of the app
 */

import React from 'react'
import ReactDOM from "react-dom";
import store from "./store";

import {history} from './store'
 import { Provider } from 'react-redux'
//import { ConnectedRouter } from 'react-router-redux'
 //import {ConnectedRouter} from 'connected-react-router'

//import store from './store'
import App from './containers/app'

//import store from "./store";

import { OidcProvider } from 'redux-oidc'
import userManager from './utils/userManager'

import 'semantic-ui-css/semantic.min.css'
import './styles/theme.scss'
import './styles/reset.scss'
import './styles/common.scss'
import './styles/adjustStyles.css'

import './styles/main/csd_styles.css'
import './styles/main/styles.css'
import './styles/main/config_style.scss'
import '../src/constants/verConfig'

import { createRoot } from "react-dom/client";
//import  store from "./store";
//import { Router } from "react-router-dom";

//import { HistoryRouter as Router } from "redux-first-history/rr6";
import { Router } from "react-router-dom";


//import history from "./store";

//const rootElement = document.getElementById("root");

const target = document.querySelector('#root')
const root = createRoot(target);




//ReactDOM.render(
  root.render(
  <Provider store={store}>
     <OidcProvider store={store} userManager={userManager}>
      {/* <ConnectedRouter history={history}>  */}
      <Router history={history}  location={history.location}>
        <div>
          <App />
         </div>
      </Router>
       
      {/* </ConnectedRouter> */}
    </OidcProvider> 
  </Provider>
  // ,
  // target
)
