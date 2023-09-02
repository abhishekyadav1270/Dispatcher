import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux'

//Other
import { ActiveCallCard, Activeindvcall } from '.';
import { onprocessCallState, completedCallState, subscriberType } from '../../constants/constants';
import { sipGroupCallTypes, sipIndividualCallTypes } from '../../utils/sipConfig';
import { getCallieIdToShow } from '../../utils/lib'
import { Title } from '../commom/Title';

const ActiveCalls = (props) => {
  const [activeIndvCalls, setActiveIndvCalls] = useState([]);
  const [activeGrpCalls, setActiveGrpCalls] = useState([]);
  const [activeFavGrpCalls, setActiveFavGrpCalls] = useState([]);
  const [indvOnprocess, setIndvOnprocess] = useState([]);
  const [grpOnprocess, setGrpOnprocess] = useState([]);
  const [disableOptionForMergePatchCall, setDisableOptionForMergePatchCall] = useState(true);
  const { individualCalls, groupCalls, user, contactList, defaultGroupId } = props;

  useEffect(() => {
    //Active individual call
    const indv = individualCalls.filter(call => !(onprocessCallState.includes(call.stateType) || completedCallState.includes(call.stateType)) && parseInt(call.callPriority) !== 15).sort((a, b) => new Date(b.created) - new Date(a.created));

    //Ringing/on process individual call
    const indvCallOnprocess = individualCalls.filter(call => (onprocessCallState.includes(call.stateType)) && parseInt(call.callPriority) !== 15 && ((call.fromId === (user && user.profile.mcptt_id)) || (call.fromId === global.config.activatedFA))).sort((a, b) => new Date(b.created) - new Date(a.created));
    
    // if (indvCallOnprocess && indvCallOnprocess.length > 0) {
    //   console.log('disableOptionForMergePatchCall true', indvCallOnprocess);
    //   setDisableOptionForMergePatchCall(true);
    // } else {
    //   if (individualCalls && individualCalls.length > 1) {
    //     console.log('disableOptionForMergePatchCall false', individualCalls);
    //     setDisableOptionForMergePatchCall(false);
    //   } else {
    //     console.log('disableOptionForMergePatchCall true1', individualCalls);
    //     setDisableOptionForMergePatchCall(true);
    //   }
    // }

    filterActiveGroupCalls()
    setActiveIndvCalls(indv);
    setIndvOnprocess(indvCallOnprocess);
    // setGrpOnprocess(grpCallOnprocess);
    //console.log('ACTIVE CALLs', indv, indvCallOnprocess, individualCalls)
  }, [individualCalls, groupCalls])

  useEffect(() => {
    filterActiveGroupCalls()
  }, [contactList])

  const filterActiveGroupCalls = () => {
    let favGroupCalls = []
    let nonFavGroupCalls = []
    let defaultGroupCalls = []
    //Active Group call
    const grps = groupCalls.filter(call => !(completedCallState.includes(call.stateType)) && parseInt(call.callPriority) !== 15).sort((a, b) => new Date(b.created) - new Date(a.created));
    defaultGroupCalls = grps.filter(grp => getCallieIdToShow(grp.groupId) === getCallieIdToShow(defaultGroupId))
    favGroupCalls = grps.filter(grp => checkActiveFavGroup(grp.groupId) === true && getCallieIdToShow(grp.groupId) !== getCallieIdToShow(defaultGroupId))
    const mixedDefaultAndFavGrpCalls = [...defaultGroupCalls, ...favGroupCalls]
    nonFavGroupCalls = grps.filter(grp => checkAlreadyInFavGrpsCall(mixedDefaultAndFavGrpCalls, grp.groupId) === false)
    setActiveFavGrpCalls(mixedDefaultAndFavGrpCalls)
    setActiveGrpCalls(nonFavGroupCalls)
    //console.log('active and fav group calls', grps, defaultGroupCalls, favGroupCalls, defaultGroupId)
  }

  const checkActiveFavGroup = (groupId) => {
    const groupList = contactList.filter(cont => cont.subscriber_type === subscriberType['GROUP'])
    const filterGroup = groupList.filter(grp => getCallieIdToShow(grp.mcptt_id) === getCallieIdToShow(groupId))
    if (filterGroup.length > 0) {
      const grp = filterGroup[0]
      if (grp.fav === true) {
        return true
      } else {
        return false
      }
    } else {
      return false
    }
  }

  const checkAlreadyInFavGrpsCall = (favGrpCalls, groupId) => {
    const filterGroup = favGrpCalls.filter(grp => getCallieIdToShow(grp.groupId) === getCallieIdToShow(groupId))
    return filterGroup.length > 0 ? true : false
  }

  const checkOnProcessCallAny = () => {
    if (individualCalls && individualCalls.length == 0) {
      return true;
    }
    const indvCallOnprocess = individualCalls.filter(call => (onprocessCallState.includes(call.stateType)) && parseInt(call.callPriority) !== 15 && ((call.fromId === (user && user.profile.mcptt_id)) || (call.fromId === global.config.activatedFA))).sort((a, b) => new Date(b.created) - new Date(a.created));
    let proceesscalls = true;
    if (indvCallOnprocess && indvCallOnprocess.length > 0) {
      proceesscalls = true;
    } else {
      if (individualCalls && individualCalls.length > 1) {
        proceesscalls = false;
      } else {
        proceesscalls = true;
      }
    }
    console.log('proceesscalls..', proceesscalls)
    return proceesscalls;
  }


  return (
    <React.Fragment>
      <div >
        <Title title={"Active Group Calls ( " + activeFavGrpCalls.length + " )"} type="AGC" />
        <div class='DGC ovr-scr-y' style={{ height: '278px' }}>
          <div class="c6-l2-grid m-t-15 ovr-scr-y">
            {activeFavGrpCalls.map((data, id) => {
              if (data.callType === sipGroupCallTypes.broadcast) {
                return (
                  <ActiveCallCard
                    data={data}
                    key={id}
                    isBrd={true}
                  />
                )
              }
              else {
                return (
                  <ActiveCallCard
                    data={data}
                    key={id}
                  />
                )
              }
            })}
          </div>
        </div>
      </div>
      <div>
        <Title title={"Other Group Calls ( " + activeGrpCalls.length + " )"} />
        <div class='GC ovr-scr-y' style={{ height: '278px' }}>
          <div class="c6-l2-grid m-t-15 ovr-scr-y">
            {activeGrpCalls.map((data, id) => {
              if (data.callType === sipGroupCallTypes.broadcast) {
                return (
                  <ActiveCallCard
                    data={data}
                    key={id}
                    isBrd={true}
                  />
                )
              }
              else {
                return (
                  <ActiveCallCard
                    data={data}
                    key={id}
                  />
                )
              }
            })}
          </div>
        </div>
      </div>
      <div>
        <Title title={"Active Individual Calls ( " + activeIndvCalls.length + " )"} class="m-t-30" type="AIC" />
        <div class='IC ovr-scr-y' style={{ height: '278px' }}>
          <div class="c6-l2-grid m-t-15 ovr-scr-y">
            {indvOnprocess.map((data, id) => {
              if (data.callType === sipIndividualCallTypes.duplex) {
                return (
                  <Activeindvcall
                    data={data}
                    key={id}
                    dial={true}
                    disableOptionForMergePatchCall={true}
                  />
                )
              }
              else {
                return (
                  <ActiveCallCard
                    data={data}
                    key={id}
                    dial={true}
                    disableOptionForMergePatchCall={true}
                  />
                )
              }
            })}
            {activeIndvCalls.map((data, id) => {
              if (data.callType === sipIndividualCallTypes.duplex) {
                return (
                  <Activeindvcall
                    data={data}
                    key={id}
                    disableOptionForMergePatchCall={checkOnProcessCallAny()}
                  />
                )
              }
              else if (data.callType === sipIndividualCallTypes.ambientListening) {
                return (
                  <ActiveCallCard
                    data={data}
                    key={id}
                    isAmb={true}
                    disableOptionForMergePatchCall={checkOnProcessCallAny()}
                  />
                )
              }
              else {
                return (
                  <ActiveCallCard
                    data={data}
                    key={id}
                    disableOptionForMergePatchCall={checkOnProcessCallAny()}
                  />
                )
              }
            })}
          </div>
        </div>
      </div>
    </React.Fragment>
  )
}

const mapStateToProps = ({ communication, auth }) => {
  const { individualCalls, groupCalls, contactList, defaultGroupId } = communication;
  const { user } = auth;

  return {
    individualCalls,
    groupCalls,
    user,
    contactList,
    defaultGroupId
  };
};

export default connect(mapStateToProps, {})(ActiveCalls);
