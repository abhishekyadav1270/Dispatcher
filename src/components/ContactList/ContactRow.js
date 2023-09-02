import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux'
//Other
import { } from '../../modules/actions';
import { CustomModal, HotKeys } from '../../components/commom';
import './contactRow.css';
import { addRemoveFav, addRemoveDefaultGroup } from '../../modules/communication';
import { subscriberType, domain, subscriberStatus } from '../../constants/constants';
import { RenderIcon } from '../../utils/lib';
import ChatMessage from '../Chat/ChatMessage'
import { Modal } from 'react-bootstrap'
import { getCallieIdToShow } from '../../utils/lib'
const axios = require("axios").default;

const ContactRow = (props) => {
    const [openChat, handleCloseChat] = useState(false);
    const [open, handleClose] = useState(false);
    const [usersInGroup, setUsersInGroup] = useState([])
    const [activeMembers, setActiveGroupMembers] = useState([])

    const getSubscriberDetails = async () => {
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
        handleClose(true)
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

    const getCellTypeRender = () => {
        if (props.inActiveCall) {
            if (props.default) {
                return "fav-card-grid2-default-call"
            } else {
                return "fav-card-grid2-call"
            }
        } else {
            if (props.default) {
                return "fav-card-grid2-default"
            } else {
                return "fav-card-grid2"
            }
        }
    }


    //functions
    const { data, Class, id, style, type, addRemoveFav, iconColor, addRemoveDefaultGroup, contactList, stationRadios, basestations, mcx } = props;
    const renderCell = getCellTypeRender()
    const connectionStatus = mcx && (mcx.primary || mcx.secondary);
    return (
        <div class={renderCell} style={style}>
            <div class="fav-icon">
                {RenderIcon(type, iconColor, connectionStatus)}
            </div>
            <div class="fav-name">
                <span class={"f-contact-name white blc " + (data.contactName.length > 15 ? 'f-12' : '')}>{data.contactName}</span>
                <span class="f-subs-id white blc">{getCallieIdToShow(data.mcptt_id)}</span>
            </div>
            {type === subscriberType['GROUP'] ?
                <React.Fragment>
                    <HotKeys
                        divclass='f1'
                        Icon='feather icon-zap red'
                        title='Emergency Group Call'
                        subheader='Simplex Group Call'
                        type='emgGroupCall'
                        sub={data}
                        defPrior={true}
                    />
                    <HotKeys
                        divclass='f2'
                        Icon='feather icon-zap'
                        title='Group Call'
                        subheader='Simplex Group Call'
                        type='groupCall'
                        sub={data}
                        defPrior={true}
                    />
                    <HotKeys
                        divclass='f3'
                        Icon='la la-bullhorn'
                        title='Broadcast Call'
                        subheader='Broadcast Call'
                        type='broadcast'
                        sub={data}
                        defPrior={true}
                    />
                </React.Fragment>
                :
                <React.Fragment>
                    <HotKeys
                        divclass='f1'
                        Icon='feather icon-phone-call'
                        title='Duplex Call'
                        type='duplex'
                        sub={data}
                        defPrior={true}
                    />
                    <HotKeys
                        divclass='f2'
                        Icon='feather icon-phone'
                        title='Hook Call'
                        subheader='Simplex (Hook) Call'
                        type='simplexHook'
                        sub={data}
                        defPrior={true}
                    />
                    <HotKeys
                        divclass='f3'
                        Icon='feather icon-phone-outgoing'
                        title='Simplex Call'
                        subheader='Simplex (Direct) Call'
                        type='simplexDirect'
                        sub={data}
                        defPrior={true}
                    />
                </React.Fragment>
            }
            {
                // global.config.message_config === 'inbox' ?
                    <React.Fragment>
                        <HotKeys
                            divclass='f4'
                            Icon='feather icon-mail'
                            title='Send SDS'
                            type='SDS'
                            sub={data}
                        />
                    </React.Fragment>
                    // :
                    // <div class="f4">
                    //     <button className='sq-icon-btn'
                    //         onClick={() => handleCloseChat(!openChat)}
                    //     >
                    //         <i class="feather icon-mail"></i>
                    //     </button>
                    // </div>
            }

            <div class="f5">
                <div class="dropdown">
                    <button
                        class="sq-icon-btn"
                        type="button"
                        id="CustomdropdownMenuButton7"
                        data-toggle="dropdown"
                        aria-haspopup="true"
                        aria-expanded="false"
                    >
                        <i class="feather icon-more-vertical"></i>
                    </button>
                    <div class="dropdown-menu" aria-labelledby="CustomdropdownMenuButton7">
                        <div class="dropdown-title">Contact Options</div>
                        {/* <a class="dropdown-item" href="#">
                                <i class="feather icon-phone-call mr-8"></i>Call
                            </a>
                            <a class="dropdown-item" href="#">
                                <i class="feather icon-message-square mr-8"></i>Send SDS
                            </a>
                            <a class="dropdown-item" href="#">
                                <i class="feather icon-alert-triangle mr-8"></i>Send Alerts
                            </a>
                            <div class="dropdown-divider"></div> */}
                        <a class="dropdown-item" onClick={getSubscriberDetails}>
                            <i class="feather icon-info mr-8"></i>Subscriber Details
                        </a>
                        {/* <a class="dropdown-item" href="#">
                                <i class="feather icon-settings mr-8"></i>User Setting
                            </a> */}
                        <a class="dropdown-item"
                            onClick={() => addRemoveFav(data, !data.fav)}
                        >
                            <i class="feather icon-star mr-8"></i>{data.fav && data.fav ? 'Remove Favourite' : 'Add Favourite'}
                        </a>
                        {type === subscriberType['GROUP'] ?
                            (
                                <a class="dropdown-item"
                                    onClick={() => addRemoveDefaultGroup(data.mcptt_id, !props.default)}
                                >
                                    <i class={props.default ? 'feather icon-minus-circle mr-8' : 'feather icon-plus-circle mr-8'}></i>{props.default ? 'Remove Default' : 'Make Default'}
                                </a>
                            ) : null
                        }
                    </div>
                </div>
            </div>
            <CustomModal
                open={open}
                handleClose={handleClose}
                header={'Subscriber Details'}
                headerTitle={
                    <div class="fav-card-grid2">
                        <div class="fav-icon">
                            {RenderIcon(type, iconColor)}
                        </div>
                        <div class="fav-name">
                            <span class="f-contact-name black blc">{data.contactName}</span>
                            <span class="f-subs-id black blc">{getCallieIdToShow(data.mcptt_id)}</span>
                        </div>
                    </div>
                }
                body={renderDetails(data)}
            />
            <div>
                <Modal
                    show={openChat}
                    onHide={handleCloseChat}
                    scrollable={false}
                    size={"lg"}
                    aria-labelledby="contained-modal-title-vcenter"
                    centered
                    style={{ backgroundColor: ' rgba(0,0,0,0.5)' }}
                >
                    <Modal.Header closeButton style={{ border: '0px', backgroundColor: '#282828' }}>
                        {<Modal.Title>{data && data.contactName ? data.contactName : getCallieIdToShow(data.mcptt_id)}</Modal.Title>}
                    </Modal.Header>
                    <Modal.Body style={{ padding: '0.2px', backgroundColor: '#2D2D2E' ,height:'500px' }}>
                        <ChatMessage data={data}></ChatMessage>
                    </Modal.Body>
                </Modal>
            </div>
        </div>
    )
}

const mapStateToProps = ({ train, connection }) => {
    const { stationRadios, basestations } = train;
    const { mcx } = connection;
    return {
        stationRadios, basestations, mcx
    };
};

export default connect(mapStateToProps, {
    addRemoveFav, addRemoveDefaultGroup
})(ContactRow);