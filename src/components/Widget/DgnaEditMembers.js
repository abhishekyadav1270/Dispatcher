import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'

//Other
import { showMessage } from '../../modules/alerts';
import { editDGNA, addDGNA } from '../../modules/common';
import { SearchableDropdown } from '../commom';
import { subscriberType } from '../../constants/constants';
import { getCallieIdToShow } from '../../utils/lib';

const axios = require("axios").default;
const importOptions = [
    { text: 'Individual', type: 'indv', icon: 'icon-user' },
    { text: 'Group', type: 'group', icon: 'icon-users' },
    { text: 'User Lists', type: 'lists', icon: 'icon-download' }
]

const DgnaEditMembers = (props) => {
    const [showOpt, setOpt] = useState(false);
    const [filteredContacts, setfiltered] = useState([]);
    const [selOpt, setSelOpt] = useState('indv');
    const [selectedSubscriber, setSubscriber] = useState(null);
    const [subrInpt, setInput] = useState('');
    const [dgMembers, setDGmembers] = useState([]);

    const { contactList, showMessage, editDGNA, addDGNA, dgnaGroups, members, Class, height, edit, updateMembers, userLists } = props;
    useEffect(() => {
        console.log('dgna users EDIT DGNA ', members)
        filterSubscriberData(selOpt);
        setDGmembers(members);
    }, [])
    //functions

    const filterData = (array) => {
        const disabled = array.filter(x => x.Reg_status !== 'Registered')
        const enabled = array.filter(x => x.Reg_status === 'Registered')
        const rebuilt = [...enabled, ...disabled];
        return rebuilt;
    };

    const filterSubscriberData = (type) => {
        if (contactList.length) {
            let filteredContact;
            if (type === 'indv') {
                filteredContact = (contactList.filter(cont => cont.subscriber_type !== subscriberType['GROUP']));
            }
            if (type === 'group') {
                filteredContact = (contactList.filter(cont => cont.subscriber_type === subscriberType['GROUP']));
            }
            if (type === 'lists') {
                filteredContact = userLists.map((list) => { return { ...list, contactName: list.name, tetra_id: list.id, Reg_status: '3', activeMembers: list.grpMembers } })
            }
            setfiltered(filteredContact);
        }
    };

    const AddDG = async () => {
        const subr = selectedSubscriber;
        if (subr && subr.contactName) {
            if (selOpt === 'indv') {
                const alreadyAdded = dgMembers.filter(dg => dg.mcptt_id === subr.mcptt_id).length;
                if (!alreadyAdded) {
                    const last = dgMembers;
                    const newSubr = { 'contactName': subr.contactName, 'mcptt_id': subr.mcptt_id, 'mcptt_uri': subr.mcptt_uri }
                    const add = [...last, newSubr]
                    setDGmembers(add);
                    updateMembers(add)
                }
                else {
                    showMessage({ header: 'DGNA', content: 'Subscriber is already added.', type: 'error' })
                }
            }
            if (selOpt === 'group' || selOpt === 'lists') {
                let activeGroupsForUserAPI = `https://${global.config.ipConfig.host}:${global.config.ipConfig.userApiPort}/consort/getActiveGroupMembers`
                let bodydata = {
                    groupID: subr.mcptt_id
                }
                console.log('SEL DGNA bodydata', bodydata)
                const res = await axios.post(activeGroupsForUserAPI, bodydata)
                if (res.data && res.data.userList.length > 0) {
                    let users = []
                    for (const userId of res.data.userList) {
                        let userMcptt = getCallieIdToShow(userId)
                        const subDetails = contactList.filter(cont =>
                            getCallieIdToShow(cont.mcptt_id) === userMcptt
                            //cont.mcptt_id.includes(userMcptt)
                        );
                        if (subDetails.length > 0) {
                            let user = {
                                contactName: subDetails[0].contactName,
                                mcptt_id: subDetails[0].mcptt_id,
                                mcptt_uri: subDetails[0].mcptt_uri
                            }
                            users = [...users, user]
                        }
                    }
                    const newSubrs = users.filter((subr, id) => {
                        const alreadyAdded = dgMembers.filter(dg => dg.mcptt_id === subr.mcptt_id).length;
                        return !alreadyAdded
                    })
                    if (newSubrs.length > 0) {
                        const addNew = newSubrs.map((dg, id) => { return { 'contactName': dg.contactName, 'mcptt_id': dg.mcptt_id, 'mcptt_uri': dg.mcptt_uri } })
                        console.log('SEL DGNA ADD', addNew)
                        const add = [...dgMembers, ...addNew]
                        setDGmembers(add);
                        updateMembers(add)
                    }
                    else showMessage({ header: 'DGNA', content: 'Group members already added on DGNA!', type: 'error' })
                } else {
                    showMessage({ header: 'DGNA', content: 'No active members on selected group!', type: 'error' })
                }
            }
            if (selOpt === 'lists') {
                console.log('LISTS SEL DGNA', subr)
            }
            setSubscriber(null);
            setInput('')
        }
    }

    const deleteDG = (dgselected) => {
        const delDG = dgMembers.filter(dg => {
            if (getCallieIdToShow(dg.mcptt_id) !== getCallieIdToShow(dgselected.mcptt_id)) {
                return dg;
            }
        })
        setDGmembers(delDG);
        updateMembers(delDG);
    }

    const selecSubr = (sub) => {
        const data = JSON.parse(sub);
        setSubscriber(data)
        setInput(data && data.contactName)
    }

    const setSelectedType = (type) => {
        setOpt(false);
        setSelOpt(type);
        if (type === 'indv' || type === 'group' || type === 'lists') {
            filterSubscriberData(type)
        }
        // if(type==='lists'){
        //     filterSubscriberData('indv')
        // }
    }

    const getFiltrIcon = (type) => {
        switch (type) {
            case 'indv':
                return 'icon-user'
            case 'group':
                return 'icon-users'
            case 'lists':
                return 'icon-download'
            default:
                break;
        }
    }

    return (
        <div class={Class ? Class : "wrap-2 border-2 m-t-15"}>
            <p class="f-text-10 all-caps ml-1" style={{ color: '#8A98AC' }}>Dynamic Group Members</p>
            <div class="ovr-scr-y" style={{ height: height ? height : '185px', paddingTop: '10px' }}>
                {dgMembers.map((dg, id) => {
                    return (
                        <div class="dgna-row-grid" key={id}>
                            <div class="dgna-grp">
                                <span class="f-text-12">{dg.contactName}</span>
                            </div>
                            <div class="dgna-id">
                                <span class="f-stext-12">{getCallieIdToShow(dg.mcptt_id)}</span>
                            </div>
                            <div class="dgna-act">
                                {edit ?
                                    <button class="icon-btn" onClick={() => deleteDG(dg)}>
                                        <i class="dripicons-cross"></i>
                                    </button>
                                    : null}
                            </div>
                        </div>
                    )
                })}
            </div>
            {edit ?
                <div class="input-group m-t-15">
                    {!showOpt ?
                        <React.Fragment>
                            <SearchableDropdown
                                options={filteredContacts}
                                type={'SearchDropdown'}
                                checkEnable={false}
                                inputStyle={{
                                    width: '180px',
                                    borderTopLeftRadius: '20px',
                                    borderBottomLeftRadius: '20px',
                                    paddingLeft: '16px',
                                    minHeight: '31px',
                                    border: '0px',
                                    backgroundColor: 'rgba(255,255,255,0.5)',
                                }}
                                isAddButton={true}
                                onAddSeln={AddDG}
                                buttonOnRight={true}
                                setSelection={(sub) => selecSubr(sub)}
                                value={subrInpt}
                            />
                            <button class={"sq-icon-btn in-blc wx32 m-r-5 active"}
                                onClick={() => setOpt(true)}>
                                <i class={'feather ' + (getFiltrIcon(selOpt))}></i>
                            </button>
                        </React.Fragment>
                        :
                        <React.Fragment>
                            {importOptions.map((opt, id) => {
                                return (
                                    <button class={"sq-icon-btn in-blc m-r-5" + (selOpt === opt.type ? " active" : "")}
                                        onClick={() => setSelectedType(opt.type)}>
                                        <i class={'feather ' + (opt.icon)}></i>
                                        <span class="f-12 m-l-6 p-r-4 p-b-5">{opt.text}</span>
                                    </button>
                                )
                            })}
                        </React.Fragment>}
                </div>
                : null}
        </div>
    )
}

const mapStateToProps = ({ communication, auth, common }) => {
    const { contactList } = communication;
    const { user } = auth;
    const { userLists } = common;
    return {
        contactList,
        user,
        userLists
    };
};

DgnaEditMembers.defaultProps = {
    edit: true
}

export default connect(mapStateToProps, { showMessage, editDGNA, addDGNA })(DgnaEditMembers);

