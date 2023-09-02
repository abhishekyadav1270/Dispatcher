import React, {useState, useEffect,useCallback} from "react";
import { connect } from "react-redux";
import TitleTab from "./TitleTab";
import { fetchUserListAdmin,fetchGroupListAdmin,fetchOrgListAdmin, resetFADetails, resetUserProfileWithAttachedFAS,fetchIwfMapListAdmin, getAllAlerts,getAlertTypes } from '../../modules/adminstate';
import UsersListRow from "./UsersListRow";
import AddUser from '../components/AdminWidget/Screens/AddUsers'
import { Modal } from 'react-bootstrap'
import AddGroup from "./AdminWidget/AddGroup/AddGroup";
import AddOrg from "./AdminWidget/AddOrg/AddOrg";
import AddIwfMap from "./AdminWidget/AddIwfMap/AddIwfMap";
// import { getAllAlerts,getAlertTypes } from "../../modules/actions";
import AddAlert from "./AdminWidget/Screens/AddAlert"
import AddModal from "./AddModal";

const UsersList = (props) => {
  const {allAlertList,allAlertListType, userlist,grouplist,orglist, fetchUserListAdmin,fetchGroupListAdmin,fetchOrgListAdmin, resetFADetails, resetUserProfileWithAttachedFAS, iwfMaplist, fetchIwfMapListAdmin,getAllAlerts, getAlertTypes} = props;
  const [indvlOrGrp, setIndvlOrGrp] = useState(true)
  const [users, setUsers] = useState([])
  const [filterName, setFilterName] = useState('USERS LIST')
  const [subscribeType, setSubscribeType] = useState('single')
  const [userOpen, setUserOpen] = React.useState(false);

  // const Grouplistusers = [
  //   {
  //     gname: "Group User A",
  //     gid: "multi_client_user_a@consort.digital",
  //     members: "4",
  //   },
  //   {
  //     gname: "Group User B",
  //     gid: "multi_client_user_a@consort.digital",
  //     members: "6",
  //   },
  //   {
  //     gname: "Group User C",
  //     gid: "multi_client_user_a@consort.digital",
  //     members: "8",
  //   },
  //   {
  //     gname: "Group User D",
  //     gid: "multi_client_user_a@consort.digital",
  //     members: "18",
  //   },
  //   {
  //     gname: "Group User E",
  //     gid: "multi_client_user_a@consort.digital",
  //     members: "10",
  //   },
  // ];
  // const OrgListUsers = [
  //   {
  //     oname: "Org User A",
  //     oid: "123skksnkjnskk654",
  //     description: "multi_client_user_a",
  //   },
  //   {
  //     oname: "Org User B",
  //     oid: "564ashjhubnj84879",
  //     description: "multi_client_user_a",
  //   },
  //   {
  //     oname: "Org User C",
  //     oid: "1236skjnksjnkkks545",
  //     description: "multi_client_user_a",
  //   },
  //   {
  //     oname: "Org User D",
  //     oid: "6549sjbjhjhjhdjjd878",
  //     description: "multi_client_user_a",
  //   }
  // ];

  // useEffect(()=>{
  //   console.log("allAlertList 1",allAlertList)
  //   if (subscribeType === "alerts" ) {
  //     setUsers(allAlertList)
  //   }
  // },[allAlertList])
  
  // useEffect(()=>{
  //   console.log("allAlertListType 1",allAlertListType)
  //   if (subscribeType === "alerts" ) {
  //     //setUsers(allAlertList)
  //   }
  // },[allAlertListType])
  
  // useEffect(()=>{
  //   console.log("allAlertList 2",allAlertList)
  //   if (subscribeType === "alerts" ) {
  //     setUsers(allAlertList)
  //   }
  // },[subscribeType])
  useEffect(() => {
    fetchUserListAdmin();
    fetchGroupListAdmin();
    fetchOrgListAdmin();
    fetchIwfMapListAdmin();
    getAllAlerts();
    getAlertTypes();
  }, [])

  // useEffect(() => {
  //   switch (subscribeType) {
  //     case "single":
  //       // console.log("single>>")
  //       if (!userlist.length) {
  //         console.log("single>>")
  //         fetchUserListAdmin();
  //       }
  //       break;
  //     case "grp":
  //       // console.log("grp>>")
  //       if (!grouplist.length) {
  //         fetchGroupListAdmin();
  //       }
  //       break;
  //     case "org":
  //       // console.log("org>>")
  //       if (!orglist.length) {
  //         fetchOrgListAdmin();
  //       }
  //       break;
  //     case "iwf_map":
  //       // console.log("iwf_map>>")
  //       if (!iwfMaplist.length) {
  //         fetchIwfMapListAdmin();
  //       }
  //       break;
  //     case "alerts":
  //       // console.log("alerts>>")
  //       if (!allAlertList.length) {
  //         getAllAlerts();
  //       }
  //       break;
  //     default:
  //       // console.log("alertstype>>")
  //       if (!allAlertListType.length) {
  //         getAlertTypes();
  //       }
  //       break;
  //   }
  // }, [subscribeType]);


  // useEffect(() => {
  //   console.log("-------------------------USER LIST-----------------------------")
  //   if (userlist) {
  //     if (subscribeType==="single") {
  //       console.log("userList --->",userlist);
  //       setUsers(userlist)
  //     } 
  //     else if(subscribeType==="org"){
  //       setUsers(orglist)

  //     }
  //     else if(subscribeType==="iwf_map"){
  //       console.log("update iwf_map data", iwfMaplist);
  //       setUsers(iwfMaplist)

  //     }
  //     else {
  //       setUsers(grouplist)
  //     }
  //   }
  // }, [userlist])
  // useEffect(() => {
  //   console.log("group data came", grouplist);
  //   if (grouplist) {
  //     if (subscribeType==="single") {
  //       setUsers(userlist)
  //     } 
  //     else if(subscribeType==="org"){
  //       setUsers(orglist)

  //     }
  //     else if(subscribeType==="iwf_map"){
  //       console.log("update iwf_map data", iwfMaplist);
  //       setUsers(iwfMaplist)

  //     }
  //     else {
  //       setUsers(grouplist)
  //     }
  //   }
  // }, [grouplist])
  // useEffect(() => {
  //   console.log("Org data came", orglist);
  //   if (userlist) {
  //     if (subscribeType==="single") {
  //       setUsers(userlist)
  //     } 
  //     else if(subscribeType==="org"){
  //       console.log("update org data", orglist);
  //       setUsers(orglist)

  //     }
  //     else if(subscribeType==="iwf_map"){
  //       console.log("update iwf_map data", iwfMaplist);
  //       setUsers(iwfMaplist)

  //     }
  //     else {
  //       setUsers(grouplist)
  //     }
  //   }
  // }, [orglist])
  // useEffect(() => {
  //   console.log(iwfMaplist)
  //   if (userlist) {
  //     if (subscribeType==="single") {
  //       setUsers(userlist)
  //     } 
  //     else if(subscribeType==="org"){
  //       console.log("update org data", orglist);
  //       setUsers(orglist)

  //     }
  //     else if(subscribeType==="iwf_map"){
  //       console.log("update iwf_map data", iwfMaplist);
  //       setUsers(iwfMaplist)

  //     }
  //     else {
  //       setUsers(grouplist)
  //     }
  //   }
  // }, [iwfMaplist])

  const setUsersByType = (type) => {
    switch (type) {
      case "single":
        setUsers(userlist);
        break;
      case "grp":
        setUsers(grouplist);
        break;
      case "org":
        setUsers(orglist);
        break;
      case "iwf_map":
        setUsers(iwfMaplist);
        break;
      case "alerts":
        setUsers(allAlertList);
        break;
      default:
        setUsers(allAlertListType);
        break;
    }
  };
  
  // Fetch data based on subscribeType
  // useEffect(() => {
  //   switch (subscribeType) {
  //     case "single":
  //       if (!userlist.length) {
  //           fetchUserListAdmin();  
  //       }
  //       break;
  //     case "grp":
  //       if (!grouplist.length) {
  //         fetchGroupListAdmin();
  //       }
  //       break;
  //     case "org":
  //       if (!orglist.length) {
  //         fetchOrgListAdmin();
  //       }
  //       break;
  //     case "iwf_map":
  //       if (!iwfMaplist.length) {
  //         fetchIwfMapListAdmin();
  //       }
  //       break;
  //     case "alerts":
  //       if (!allAlertList.length) {
  //         getAllAlerts();
  //       }
  //       break;
  //     default:
  //       if (!allAlertListType.length) {
  //         getAlertTypes();
  //       }
  //       break;
  //   }
  // }, [subscribeType]);
  
  // Update users when data is fetched
  useEffect(() => {
    console.log("-------------------------USER LIST-----------------------------");
    switch (subscribeType) {
      case "single":
        setUsersByType("single");
        break;
      case "grp":
        setUsersByType("grp");
        break;
      case "org":
        setUsersByType("org");
        break;
      case "iwf_map":
        setUsersByType("iwf_map");
        break;
      case "alerts":
        setUsersByType("alerts");
        break;
      default:
        setUsersByType("allAlertListType")
        break;
    }
  }, [userlist, grouplist, orglist, iwfMaplist,allAlertList, allAlertListType]);

  // const userhandleClose = () => {
  //   resetFADetails()
  //   resetUserProfileWithAttachedFAS()
  //   setUserOpen(false);
  // };

  const userhandleClose = useCallback(() => {
    resetFADetails();
    resetUserProfileWithAttachedFAS();
    setUserOpen(false);
  }, []);

  const filterData = (type) => {
    if (type === 'indv') {
      setFilterName('USERS LIST')
      setSubscribeType('single')
      setIndvlOrGrp(true)
      setUsers(userlist)
      fetchUserListAdmin()
    } else if (type === 'grp') {
      setFilterName('GROUP LIST')
      setSubscribeType('grp')
      setIndvlOrGrp(false)
      setUsers(grouplist)
      fetchGroupListAdmin()
    }
    else if (type === 'org') {
      setFilterName('ORG LIST')
      setSubscribeType('org')
      setIndvlOrGrp(false)
      setUsers(orglist)
      fetchOrgListAdmin()
    }
    else if (type === 'iwf_map') {
      setFilterName('IWF MAP LIST')
      setSubscribeType('iwf_map')
      setIndvlOrGrp(false)
      setUsers(iwfMaplist)
      fetchIwfMapListAdmin()
    }
    else if (type === 'alerts') {
      setFilterName('Alerts')
      setSubscribeType('alerts')
      setIndvlOrGrp(false)
      setUsers(allAlertList)
      getAllAlerts()
    }
    else{
      resetUserProfileWithAttachedFAS()
      if('iwf_map' !== subscribeType)
      setUserOpen(true);
    }
  }

  const searchedData = (searchCont) => {
    let filterCont;
    if (searchCont.length > 0) {
      if (subscribeType==="single") {
        filterCont = userlist.filter(cont =>
          cont.userid && cont.userid.toLowerCase().includes(searchCont.toLowerCase()) ||
          cont.userName && cont.userName.includes(searchCont) ||
          cont.mcptt_id && cont.mcptt_id.toLowerCase().includes(searchCont.toLowerCase()))
      }
      else if(subscribeType==="iwf_map")
      {
        filterCont = iwfMaplist.filter(cont =>
          cont.id && cont.id.toLowerCase().includes(searchCont.toLowerCase()) ||
          cont.fa && cont.fa.includes(searchCont) ||
          cont.mcpttId && cont.mcpttId.toLowerCase().includes(searchCont.toLowerCase()))
      }
      else if(subscribeType==="org")
      {
        filterCont = orglist.filter(cont =>
          cont.orgName && cont.orgName.toLowerCase().includes(searchCont.toLowerCase()) ||
          cont.orgId && cont.orgId.includes(searchCont) )
      }
      else if(subscribeType==="grp")
      {
        filterCont = grouplist.filter(cont =>
          cont.groupName && cont.groupName.toLowerCase().includes(searchCont.toLowerCase()) ||
          cont.groupId && cont.groupId.includes(searchCont) )
      }
      else {
        filterCont = grouplist.filter(cont =>
          cont.basicinfo.groupname && cont.basicinfo.groupname.toLowerCase().includes(searchCont.toLowerCase()) 
          // ||
          // cont.members && cont.members.includes(searchCont) ||
          // cont.gid && cont.gid.toLowerCase().includes(searchCont.toLowerCase())
          )
      }
      setUsers(filterCont)
    } else {
      if (subscribeType==="single") {
        setUsers(userlist)
      }
      else if(subscribeType==="iwf_map")
      {
        setUsers(iwfMaplist)
      }
      else if(subscribeType==="org"){
        setUsers(orglist)
      }
      else if(subscribeType==="grp"){
        setUsers(grouplist)
      }
      else {
        setUsers(grouplist)
      }
    }
  }
  // const hideModal = () => {
  //   setUserOpen(false)
  //   resetFADetails()
  //   resetUserProfileWithAttachedFAS()
  // }

  const hideModal = useCallback(() => {
    setUserOpen(false);
    resetFADetails();
    resetUserProfileWithAttachedFAS();
  }, [])

  return (
    <div>
      <TitleTab
        title={filterName}
        type={"userListTab"}
        search={(txt) => {
          //console.log("search text", txt);
          searchedData(txt)
        }}
        filtr={(x) => {
          console.log("TYPE", x);
          filterData(x)
        }}
      />
      <div class="tab-content" id="pills-tabContent">
        <div
          class="tab-pane fade show active"
          id="pills-home"
          role="tabpanel"
          aria-labelledby="pills-home-tab"
        >
          {subscribeType === "single" ?
            (
              <div class="single-user-row-grid-head">
                <div class="tr-tb-icon"></div>
                <div class="tr-tb-uname">
                  <span>USER NAME</span>
                </div>
                <div class="tr-tb-uid">
                  <span>USER TYPE</span>
                </div>
                <div class="tr-tb-mxid">
                  <span>MCX ID</span>
                </div>
                <div class="tr-tb-edit">
                  <span></span>
                </div>
                <div class="tr-tb-delete">
                  <span></span>
                </div>
              </div>
            )  : subscribeType === "org" ? (
              <div class="single-user-row-grid-head">
              <div class="tr-tb-icon"></div>
              <div class="tr-tb-uname">
                <span>ORG NAME</span>
              </div>
              <div class="tr-tb-uid">
                <span>ORG ID</span>
              </div>
              <div class="tr-tb-mxid">
                <span>DESCRIPTION</span>
              </div>
              <div class="tr-tb-edit">
                <span></span>
              </div>
              <div class="tr-tb-delete">
                <span></span>
              </div>
            </div>
            ) 
            : subscribeType === "iwf_map" ? (
              <div class="iwf-map-user-row-grid-head">
              <div class="tr-tb-icon"></div>
              <div class="tr-tb-uname">
                <span>SSI</span>
              </div>
              <div class="tr-tb-uid">
                <span>Connection Mode</span>
              </div>
              <div class="tr-tb-mxid">
                <span>TYPE</span>
              </div>
              <div class="tr-tb-gid">
                <span>ID</span>
              </div>
              <div class="tr-tb-edit">
                <span></span>
              </div>
              <div class="tr-tb-delete">
                <span></span>
              </div>
            </div>
            ) :subscribeType === "alerts" ? (
              <div class="iwf-map-user-row-grid-head">
              <div class="tr-tb-icon"></div>
              <div class="tr-tb-uname">
                <span>CODE</span>
              </div>
              <div class="tr-tb-uid">
                <span>DESC</span>
              </div>
              <div class="tr-tb-mxid">
                <span>PRIORITY</span>
              </div>
              <div class="tr-tb-gid">
                <span>TYPE</span>
              </div>
              <div class="tr-tb-edit">
                <span></span>
              </div>
              <div class="tr-tb-delete">
                <span></span>
              </div>
            </div>
            ) :
            (
              <div class="group-user-row-grid-head">
                <div class="tr-tb-icon"></div>
                <div class="tr-tb-gname">
                  <span>GROUP NAME</span>
                </div>
                <div class="tr-tb-gid">
                  <span>GROUP ID</span>
                </div>
                <div class="tr-tb-members">
                  <span>Type</span>
                </div>
                <div class="tr-tb-edit">
                  <span></span>
                </div>
                <div class="tr-tb-delete">
                  <span></span>
                </div>
              </div>
              // <div class="tr-tb-edit">
              //   <span></span>
              // </div>
              // <div class="tr-tb-delete">
              //   <span></span>
              // </div>
            )

              // : (
              //   <div class="group-user-row-grid-head">
              //     <div class="tr-tb-icon"></div>
              //     <div class="tr-tb-gname">
              //       <span>GROUP NAME</span>
              //     </div>
              //     <div class="tr-tb-gid">
              //       <span>GROUP ID</span>
              //     </div>
              //     <div class="tr-tb-members">
              //       <span>MEMBERS</span>
              //     </div>
              //     <div class="tr-tb-edit">
              //       <span></span>
              //     </div>
              //     <div class="tr-tb-delete">
              //       <span></span>
              //     </div>
              //   </div>
              // )
          }

          <div style={{ height: '880px', marginTop: '10px', overflowY: 'scroll' }}>
            {users &&
              users.map((data, i) => {
                return (
                  <UsersListRow
                    key = {i}
                    grouplist={grouplist}
                    userData={data}
                    userlist = {userlist}
                    orglist={orglist} 
                    tetraUser={props.tetraUser}
                    SubscribeType={subscribeType}
                  />
                );
              })}
          </div>
        </div>
      </div>

      <AddModal userhandleClose={userhandleClose} hideModal={hideModal} userOpen={userOpen} subscribeType={subscribeType}></AddModal>
      {/* <Modal
      show={userOpen}
      onHide={userhandleClose}
      scrollable={false}
      size={"lg"}
      aria-labelledby="contained-modal-title-vcenter"
      centered
      style={{ backgroundColor: ' rgba(0,0,0,0.5)' }}
    >
      <Modal.Header closeButton style={{ border: '0px', backgroundColor: '#282828' }}>
        {subscribeType==="single" ? <Modal.Title>ADD USER</Modal.Title>: subscribeType==="alerts" ? <Modal.Title>ADD Alert</Modal.Title> : subscribeType==="org" ?<Modal.Title>ADD ORG</Modal.Title> : subscribeType==="iwf_map" ?<Modal.Title>ADD IWF</Modal.Title> : <Modal.Title>ADD GROUP</Modal.Title>}
      </Modal.Header>
      <Modal.Body style={{ padding: '0.2px' }}>
        {subscribeType==="single" ?<AddUser grouplist={grouplist} tetraUser={props.tetraUser} hideModal={hideModal}></AddUser> :subscribeType==="org" ? <AddOrg hideModal={hideModal}/> :subscribeType==="iwf_map" ? <AddIwfMap  userlist = {userlist} hideModal={hideModal}/>: subscribeType==="alerts" ?<AddAlert  hideModal={hideModal}></AddAlert> : <AddGroup orglist={orglist} userlist={userlist} hideModal={hideModal}/>}
      </Modal.Body>
      
    </Modal> */}
    </div>
  )
};


const mapStateToProps = ({ adminstate}) => {
  const { userlist,grouplist,orglist,iwfMaplist } = adminstate;
  const { allAlertList,allAlertListType } = adminstate
  //console.log('userlist reducer', userlist)
  return {
    userlist,grouplist,orglist,iwfMaplist,allAlertList,allAlertListType
  };
};

export default connect(mapStateToProps, {
  fetchUserListAdmin,
  fetchGroupListAdmin,
  fetchOrgListAdmin,
  fetchIwfMapListAdmin,
  resetFADetails,
  resetUserProfileWithAttachedFAS,
  getAllAlerts,
  getAlertTypes
})(UsersList);