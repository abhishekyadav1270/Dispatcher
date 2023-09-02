import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux'


//Other
import { } from '../../modules/actions';
import { showMessage } from '../../modules/alerts'
import { CustomModal } from '../../components/commom';
import { subscriberType, domain, subscriberStatus } from '../../constants/constants';
import { RenderIcon, setIconColor, getCallieIdToShow } from '../../utils/lib';
const axios = require("axios").default;

const UserDetail = (props) => {
    // const [open, handleClose] = useState(true);
    const [subData, setSubData] = useState(null);
    const [usersInGroup, setUsersInGroup] = useState([])
    const [activeMembers, setActiveGroupMembers] = useState([])
    const { userDetail, type, contactList, id, open, Class, style, stationRadios, basestations } = props;
    useEffect(() => {
        try {
            if (type === "SUB") {
                console.log('subscriber id...', id, getCallieIdToShow(id).toString())
                const subDetails = contactList.filter(cont =>
                    getCallieIdToShow(cont.mcptt_id).toString() === getCallieIdToShow(id).toString()
                );
                if (subDetails && subDetails.length === 0) {
                    props.showMessage({ header: 'Subscriber Details', content: 'Oops! Could not fetch details. Try again.', type: 'error' })
                    props.closeModal(false)
                }
                else {
                    setSubData(subDetails[0])
                    getSubscriberDetails(subDetails[0])
                }
            }
            if (type === "DSP") {
                if (userDetail && userDetail.length === 0) {
                    props.showMessage({ header: 'Subscriber Details', content: 'Oops! Could not fetch details. Try again.', type: 'error' })
                    props.closeModal(false)
                }
                else {
                    setSubData(userDetail[0])
                    getSubscriberDetails(userDetail[0])
                }
            }
        }
        catch (e) {
            console.log(e)
        }
    }, [])

    const getSubscriberDetails = async (data) => {
        const isGroup = data.subscriber_type === subscriberType['GROUP'] ? true : false;
        if (isGroup) {
            let activeGroupsForUserAPI = `https://${global.config.ipConfig.host}:${global.config.ipConfig.userApiPort}/consort/getActiveGroupMembers`
            let bodydata = {
                groupID: data.mcptt_id
            }
            const res = await axios.post(activeGroupsForUserAPI, bodydata)
            console.log("active group members response : ", res);
            if (res.data && res.data.userList.length > 0) {
                let users = []
                for (const userId of res.data.userList) {
                    let userMcptt = getCallieIdToShow(userId)
                    const subDetails = contactList.filter(cont =>
                        //cont.mcptt_id.includes(userMcptt)
                        getCallieIdToShow(cont.mcptt_id) === userMcptt
                    );
                    if (subDetails.length > 0) {
                        let user = {
                            contactName: subDetails[0].contactName,
                            mcptt_id: userMcptt
                        }
                        users = [...users, user]
                    } else {
                        let user = {
                            contactName: '',
                            mcptt_id: userMcptt
                        }
                        users = [...users, user]
                    }
                }
                setActiveGroupMembers(users)
            }
        } else {
            let activeGroupsForUserAPI = `https://${global.config.ipConfig.host}:${global.config.ipConfig.userApiPort}/consort/getActiveGroupsForUser`
            let bodydata = {
                userMcpttId: data.mcptt_id
            }
            const res = await axios.post(activeGroupsForUserAPI, bodydata)
            console.log("getActiveGroupsForUser response : ", res);
            if (res.data && res.data.userList.length > 0) {
                let groups = []
                for (const userId of res.data.userList) {
                    let userMcptt = getCallieIdToShow(userId)
                    const subDetails = contactList.filter(cont =>
                        //cont.mcptt_id.includes(userMcptt)
                        getCallieIdToShow(cont.mcptt_id) === userMcptt
                    );
                    if (subDetails.length > 0) {
                        let group = {
                            contactName: subDetails[0].contactName,
                            mcptt_id: userMcptt
                        }
                        groups = [...groups, group]
                    } else {
                        let group = {
                            contactName: '',
                            mcptt_id: userMcptt
                        }
                        groups = [...groups, group]
                    }
                }
                setUsersInGroup(groups)
            }
        }
    }

    const getBaseStationLocation = (regNode) => {
        if (regNode && regNode.length > 0) {
            let baseStns = basestations.filter((item) => item.nodeNumber == regNode)
            if (baseStns.length > 0) {
                let location = baseStns[0].location
                let stns = stationRadios.filter(stn => stn.stnCode == location) 
                if (stns.length > 0) {
                    return regNode + '(' + stns[0].station + ')'
                } else {
                    return regNode + '(' + location + ')'
                }
            } else {
                return regNode
            }
        } else {
            return ''
        }
    }

    const renderDetails = (props) => {
        const isGroup = props.subscriber_type === subscriberType['GROUP'] ? true : false;
        let regsince = '', count = 0;
        if (props.Reg_date_time) {
            const timestamp = parseInt(props.Reg_date_time);
            const todate = new Date(timestamp).getDate();
            const tomonth = new Date(timestamp).getMonth() + 1;
            const toyear = new Date(timestamp).getFullYear();
            regsince = tomonth + '/' + todate + '/' + toyear;
            regsince = '04/15/2022'
        } else {
            regsince = '04/15/2022'
        }
        const org = props.Organization == '0' ? '1' : props.Organization
        const subcriberType = props.subscriber_type.length == 0 ? "Dispatcher" : props.subscriber_type

        if (!isGroup) {
            return (
                <div style={{ flexDirection: 'row', display: 'flex' }}>
                    <div style={{ width: '45vh', margin: '5px' }}>
                        <div class='f-text-header-18b'>Identity</div>
                        <RenderRow name={'Contact Name'} val={props.contactName} />
                        <RenderRow name={'Type'} val={subcriberType} />
                        <RenderRow name={'MCX ID'} val={getCallieIdToShow(props.mcptt_id)} />
                        <RenderRow name={'Organization'} val={org} />
                        <div class='f-text-header-18b'>Registration</div>
                        <RenderRow name={'Reg. Status'} val={props.Reg_status === subscriberStatus['REGISTERED'] ? 'Registered' : 'Disabled'} />
                        <RenderRow name={'Reg. Node'} val={getBaseStationLocation(props.RegNode)} />
                        <RenderRow name={'Registered Since'} val={regsince} />
                        {/* <RenderRow name={'Registration Updated'} val={''} /> */}
                        {/* <RenderRow name={'IP Address'} val={''} /> */}
                    </div>

                    <div style={{ width: '45vh', margin: '5px' }}>
                        <div class='f-text-header-18b'>Groups</div>
                        {usersInGroup.length > 0 ?
                            <React.Fragment>
                                {usersInGroup.map((grp, id) => {
                                    if (count == 0) {
                                        count = count + 1
                                        return (
                                            <RenderRow
                                                name={'Group Selected  '}
                                                val={grp.contactName + ' (' + grp.mcptt_id + ')'} key={id}
                                                style={{ color: '#30BF69' }}
                                            />
                                        )
                                    } else {
                                        count = count + 1
                                        const updatedCount = count - 1
                                        return (
                                            <RenderRow
                                                name={'Group Scanned ' + updatedCount}
                                                val={grp.contactName + ' (' + grp.mcptt_id + ')'} key={id}
                                            />
                                        )
                                    }

                                })}
                            </React.Fragment>
                            : <RenderRow name={'No Scanned Groups'} val={''} />}
                    </div>
                </div>
            )
        }
        else {
            return (
                <div style={{ flexDirection: 'row', display: 'flex' }}>
                    <div style={{ width: '45vh', margin: '5px' }}>
                        <div class='f-text-header-18b'>Identity</div>
                        <RenderRow name={'Contact Name'} val={props.contactName} />
                        <RenderRow name={'Type'} val={subcriberType} />
                        <RenderRow name={'MCX ID'} val={getCallieIdToShow(props.mcptt_id)} />
                        {/* <RenderRow name={'TETRA ID'} val={props.tetra_id} /> */}
                        {/* <RenderRow name={'Organization'} val={org} /> */}
                    </div>

                    <div style={{ width: '45vh', margin: '5px' }}>
                        <div class='f-text-header-18b'>Active Members</div>
                        {activeMembers.length > 0 ?
                            <React.Fragment>
                                {activeMembers.map((actmem) => {
                                    count = count + 1;
                                    const mem_id = actmem.mcptt_id;
                                    return (
                                        <RenderRow
                                            name={'Member ' + count}
                                            val={actmem.contactName + ' (' + mem_id + ')'} key={mem_id}
                                        />
                                    )
                                })}
                            </React.Fragment>
                            : <RenderRow name={'No Active Members'} val={''} />}
                    </div>
                </div>)
        }
    };
    const RenderRow = (props) => (
        <div class='contactView subcriber-details-row-grid'>
            <div class='textVal d1' style={props.style ? props.style : {}}>{props.name}{props.val ? ' :' : ''}</div>
            <div class='headerText d2'>{props.val}</div>
        </div>
    );

    //functions

    return (
        <React.Fragment>
            {subData ?
                <CustomModal
                    open={open}
                    handleClose={(x) => props.closeModal(x)}
                    header={'Subscriber Details'}
                    headerTitle={
                        <div class="fav-card-grid2">
                            <div class="fav-icon">
                                {RenderIcon(subData.subscriber_type, setIconColor(subData))}
                            </div>
                            <div class="fav-name">
                                <span class="f-contact-name black blc">{subData.contactName}</span>
                                <span class="f-subs-id black blc">{getCallieIdToShow(subData.mcptt_id)}</span>
                            </div>
                        </div>
                    }
                    body={renderDetails(subData)}
                /> : null}
        </React.Fragment>
    )
}

const mapStateToProps = ({ auth, communication, train }) => {
    const { userDetail } = auth;
    const { contactList } = communication;
    const { stationRadios, basestations } = train;
    return {
        userDetail, contactList, stationRadios, basestations
    };
};

export default connect(mapStateToProps, { showMessage })(UserDetail);