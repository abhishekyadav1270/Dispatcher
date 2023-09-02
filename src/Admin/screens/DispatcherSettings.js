import React, { useEffect } from "react";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { push } from "react-router-redux";
import Header from "../components/Header";

// import '../../styles/communication.scss'
// import Header from '../../components/Navigation/Header'
// import { NetworkStatus } from '../../components/commom'
// import { Widget } from '../../components/Widget';
// import ContactListTable from '../../components/ContactList/ContactListTable';
// import ActivityLogTable from '../../components/ActivityLog/ActivityLogTable';

//Redux actions

const DispatcherSettings = (props) => {
  const { isAuthenticated, navigateToLogin } = props;
  //   useEffect(() => {
  //     if(!isAuthenticated) navigateToLogin()
  //   }, [isAuthenticated])

  return (
    <div>
      <Header page={"dispatcher"} />
      <div class="main-nav-body">
        <div class="admin-grid">
          <div class="l1 wrap-1"></div>
          <div class="l2 wrap-1 pad-0"></div>
          <div class="l3 wrap-1"></div>
        </div>
      </div>
    </div>
  );
};

const mapStateToProps = ({ auth }) => {
  const { user, isAuthenticated } = auth;
  return {
    user,
    isAuthenticated,
  };
};

const mapDispatchToProps = (dispatch) =>
  bindActionCreators(
    {
      navigateToLogin: () => push("/"),
    },
    dispatch
  );

export default connect(mapStateToProps, mapDispatchToProps)(DispatcherSettings);
