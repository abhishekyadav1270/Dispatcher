import React, { useEffect } from "react";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { push } from "react-router-redux";
import Header from "../../components/Navigation/Header";
import TitleTab from "../components/TitleTab";
import { Templates, UsersList } from "../components";
import { AdminWidget } from "../components/AdminWidget";
import '../styles/commonStyle.css'

// import '../../styles/communication.scss'
// import Header from '../../components/Navigation/Header'
// import { NetworkStatus } from '../../components/commom'
// import { Widget } from '../../components/Widget';
// import ContactListTable from '../../components/ContactList/ContactListTable';
// import ActivityLogTable from '../../components/ActivityLog/ActivityLogTable';

//Redux actions

const Admin = (props) => {
  const { isAuthenticated, navigateToLogin } = props;
  //   useEffect(() => {
  //     if(!isAuthenticated) navigateToLogin()
  //   }, [isAuthenticated])

  return (
    <div>
      <Header page={'admin'} />
       {/* Body Start */}
      <div class="main-nav-body">
        <div class="admin-grid">
          <div class="wrap-1 l1">
            <UsersList tetraUser={true} />
          </div>
          <div class="wrap-1 l2">
            <Templates tetraUser={true} />
          </div>
          {/* <div class="wrap-1 l3">
            <AdminWidget tetraUser={true} />
          </div> */}
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

export default connect(mapStateToProps, mapDispatchToProps)(Admin);
