import React from "react";
import { connect } from "react-redux";
import { CallbackComponent } from "redux-oidc";
import { errorLogin } from '../../modules/actions'
import { bindActionCreators } from 'redux'
import { SplashScreen } from '../../components/commom';
import userManager from '../../utils/userManager'
import { MCXClientConfig } from '../../utils/mcxclientConfig';
import { updateDomain } from '../../modules/domains';
import Login from "../login";

class CallbackPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      authToken: null,
      mcxClient: null
    };
  }

  componentDidMount() {

  }

  render() {
    // just redirect to '/' in both cases
    return (
      <CallbackComponent
        userManager={userManager}
        successCallback={(res) => {
          console.error('callback user mm..', res);
          let mcxClientConfig = new MCXClientConfig()
          mcxClientConfig.getConfig().then(response => {
            if (response.domains) {
              this.props.updateDomain(response.domains)
            }
            console.log('MCX MCXClientConfig callback', response.mcx)
            this.setState({ authToken: res.access_token })
            this.setState({ mcxClient: response.mcx })
            this.setState({ loading: false })
          })
        }}
        errorCallback={error => {
          this.props.errorLogin();
          console.error('redirect callback error..', error);
        }}
      >
        {
          this.state.loading ?
            (
              <SplashScreen />
            )
            :
            (
              <Login mcxClient={this.state.mcxClient} tokenId={this.state.authToken} />
            )
        }

      </CallbackComponent>
    );
  }
}

const mapDispatchToProps = dispatch => bindActionCreators({
  errorLogin,
  updateDomain
}, dispatch)

export default connect(null, mapDispatchToProps)(CallbackPage);
