/**
 *  Component: App
 */

// import React, { useEffect, useState } from 'react';
import React from 'react';
 import { Route, Switch } from 'react-router-dom'
// import {BrowserRouter, Route, Routes } from 'react-router-dom'

// import Header from '../app/header';
// import HeaderMenu from '../../components/Navigation/Header';
// import Login from '../login'
import Train from '../train'
import Communication from '../communication'
import Location from '../location'
import AlertsPage from '../alerts'
import Admin from '../../Admin/screens/Admin';
import LocationMap from '../location/map'
import LocationSnailTrail from '../location/snailTrail'
import LocationFencing from '../location/fencing'
import Alerts from '../app/alerts'
import NotFound from '../app/notFound'
import UserSettings from '../settings/user'
import UserDetails from '../settings/user/details'
import TrainSubscriberSettings from '../settings/train'
import PropertySettings from '../settings/property'
import StatusMessages from '../settings/statusMessages'
import PredefinedMessages from '../settings/predefinedMessages'
import DiscreetSubscribers from '../settings/discreetSubscribers'

import requireAuth from '../../utils/requireAuth'
import CallbackPage from '../home/callback'
import HomePage from '../home/homePage'
import Recordings from "../recordings"
//import Admin from '../../Admin/screens/Admin';
// import { Admin, DispatcherSettings } from '../../Admin/screens';
import { PROJECT } from '../../constants/constants'

class App extends React.Component{
  constructor(props) {
    super(props);

    // Store the previous pathname and search strings
    this.currentPathname = null;
    this.currentSearch = null;
  }

  componentDidMount() {
    //DISABLE REFRESH
    document.addEventListener("keydown",this.my_onkeydown_handler)
    document.addEventListener('contextmenu', (e) => {
      e.preventDefault();
    });
    if(PROJECT) global.config.project = PROJECT;
  }

  my_onkeydown_handler( event ) {
      switch (event.keyCode) {
          case 116 : // 'F5'
              event.preventDefault();
              break;
          default:
            break;
      }
  }

  // componentWillUnmount() {
  //   window.onpopstate = null;
  // }

render(){
  return(
    // <BrowserRouter>

    <div>
      {/* <SystemStatus /> */}
      {/* <Header /> */}
      {/* <HeaderMenu page={'communication'}/> */}
      {/* <h1>Inside App</h1> */}
      <main>
      {/* <h1>Inside main</h1> */}

        {/* <Routes> */}
          {/* <Route exact path="/" element={<HomePage/>} />
          <Route exact path="/login" element={<HomePage/>} />
          <Route exact path="/callback" element={<CallbackPage/>} />
          <Route exact path="/trains" element={requireAuth(<Train/>)} />
          <Route exact path="/communication" element={requireAuth(<Communication/>)} />
          <Route exact path="/alerts" element={requireAuth(<AlertsPage/>)} />
          <Route exact path="/location" element={requireAuth(<Location/>)} />
          <Route exact path="/location/map" element={requireAuth(<LocationMap/>)} />
          <Route exact path="/location/snail-trail" element={requireAuth(<LocationSnailTrail/>)} />
          <Route exact path="/location/fencing" element={requireAuth(<LocationFencing/>)} />
          <Route exact path="/settings/users" element={requireAuth(<UserSettings/>)} />
          <Route exact path="/settings/users/user" element={requireAuth(<UserDetails/>)} />
          <Route exact path="/settings/trains" element={requireAuth(<TrainSubscriberSettings/>)} />
          <Route exact path="/settings/properties" element={requireAuth(<PropertySettings/>)} />
          <Route exact path="/settings/statusMessages" element={requireAuth(<StatusMessages/>)} />
          <Route exact path="/settings/predefinedMessages" element={requireAuth(<PredefinedMessages/>)} />
          <Route exact path="/settings/discreetSubscribers" element={requireAuth(<DiscreetSubscribers/>)} />
          <Route exact path="/admin" element={requireAuth(<Admin/>)} />
          {/* <Route exact path="/dispatcher" component={DispatcherSettings} /> */}
          {/* <Route path="*" element={<NotFound/>}/> */}


        {/* </Routes> */}

        <Switch>
          <Route exact path="/" component={HomePage} />
          <Route exact path="/login" component={HomePage} />
          <Route exact path="/callback" component={CallbackPage} />
          <Route exact path="/trains" component={requireAuth(Train)} />
          <Route exact path="/communication" component={requireAuth(Communication)} />
          <Route exact path="/alerts" component={requireAuth(AlertsPage)} />
          <Route exact path="/recordings" component={requireAuth(Recordings)}/>
          <Route exact path="/location" component={requireAuth(Location)} />
          <Route exact path="/location/map" component={requireAuth(LocationMap)} />
          <Route exact path="/location/snail-trail" component={requireAuth(LocationSnailTrail)} />
          <Route exact path="/location/fencing" component={requireAuth(LocationFencing)} />
          <Route exact path="/settings/users" component={requireAuth(UserSettings)} />
          <Route exact path="/settings/users/user" component={requireAuth(UserDetails)} />
          <Route exact path="/settings/trains" component={requireAuth(TrainSubscriberSettings)} />
          <Route exact path="/settings/properties" component={requireAuth(PropertySettings)} />
          <Route exact path="/settings/statusMessages" component={requireAuth(StatusMessages)} />
          <Route exact path="/settings/predefinedMessages" component={requireAuth(PredefinedMessages)} />
          <Route exact path="/settings/discreetSubscribers" component={requireAuth(DiscreetSubscribers)} />
          <Route exact path="/admin" component={requireAuth(Admin)} />
          {/* <Route exact path="/dispatcher" component={DispatcherSettings} /> */}
          <Route path="*" component={NotFound}/>
        </Switch>
      </main>
      <Alerts />
    </div>
    // </BrowserRouter> 
  )
}
}

//export default BrowserRouter(App );
export default App;
