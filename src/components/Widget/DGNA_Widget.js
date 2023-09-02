import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux'

//Other
import { } from '../../modules/actions';
import { showMessage } from '../../modules/alerts';
import { subscriberType } from '../../constants/constants';
import { editDGNA, addDGNA, fetchDgna, detachDGNA, exportDGNAList } from '../../modules/common';
import { ContextMenu } from '../commom';
import DgnaEditMembers from './DgnaEditMembers';
import DGNAUserLists from './DGNAUserLists';
import { getCallieIdToShow } from '../../utils/lib';
const axios = require("axios").default;

var colorOption = [
    { name: 'customRadioInline2', value: 1, css: 'radio-primary', prior: 'low' },
    { name: 'customRadioInline2', value: 2, css: 'radio-success', prior: 'med' },
    { name: 'customRadioInline2', value: 3, css: 'radio-danger', prior: 'high' },
]

const DGNAWidget = (props) => {
    const [dgMembers, setDGmembers] = useState([]);
    const [dgnaGroups, setDgnaGroups] = useState([]);
    const [seen1, setSeen1] = useState(true);
    const [seen2, setSeen2] = useState(false);
    const [showUserLists, setShowUserLists] = useState(false);
    const [selectedPrior, setPrior] = useState(null);
    const [groupName, setGroupName] = useState('');
    const [edit, setEditdgna] = useState(false);
    const [currentEdit, setCurrentEdit] = useState(null);

    const { showMessage, editDGNA, addDGNA, user, detachDGNA, exportDGNAList, contactList, userLists, systemDgnaSSI } = props;

    useEffect(() => {
        if (contactList && contactList.length > 0) {
            let filterCont = contactList.filter(cont => cont.subscriber_type === subscriberType['GROUP'] && cont.temporary == 'true' && cont.supervisor == user.profile.mcptt_id)
            //console.log('dgna groups list...', filterCont)
            let removedSystemDgna = []
            if (systemDgnaSSI && systemDgnaSSI.length > 0) {
                for (const cont of filterCont) {
                    let found = false
                    for (const dgna of systemDgnaSSI) {
                        if (getCallieIdToShow(cont.mcptt_id) == dgna) {
                            found = true
                            break
                        }
                    }
                    if (!found) {
                        removedSystemDgna = [...removedSystemDgna, cont]
                    }
                }
                //console.log('dgna groups list system...', removedSystemDgna, systemDgnaSSI)
                setDgnaGroups(removedSystemDgna)
            } else {
                setDgnaGroups(filterCont)
            }
        }
    }, [contactList])

    const hideit = () => {
        setSeen1(!seen1)
        setSeen2(!seen2)
    }

    const editDgna = (dgna) => {
        try {
            fetchUserLists(dgna)
        }
        catch (e) {
            console.log('CRASH: EDIT DGNA', e)
        }
    }

    const fetchUserLists = async (dgna) => {
        let userForDgnaAPI = `https://${global.config.ipConfig.host}:${global.config.ipConfig.cmcPort}/consort/getUsersByGroup/${dgna.mcptt_id}`
        const res = await axios.get(userForDgnaAPI)
        console.log('dgna users from api..', res)
        if (res.data && res.data.length > 0) {
            let users = []
            for (const userId of res.data) {
                let userMcptt = getCallieIdToShow(userId)
                const subDetails = contactList.filter(cont =>
                    //cont.mcptt_id.includes(userMcptt)
                    getCallieIdToShow(cont.mcptt_id) === userMcptt
                );
                console.log('dgna users userMcptt..', userMcptt, subDetails)
                if (subDetails.length > 0) {
                    let user = {
                        contactName: subDetails[0].contactName,
                        mcptt_id: subDetails[0].mcptt_id,
                        mcptt_uri: subDetails[0].mcptt_uri
                    }
                    users = [...users, user]
                }
            }
            if (users.length > 0) {
                const userLists = users.map((dg, id) => { return { 'contactName': dg.contactName, 'mcptt_id': dg.mcptt_id, 'mcptt_uri': dg.mcptt_uri } })
                let filterCont = userLists.filter(cont => cont.mcptt_id != user.profile.mcptt_id)
                console.log('dgna users memberss..', filterCont)
                setDGmembers(filterCont)
                setGroupName(dgna.contactName);
                setEditdgna(true)
                setCurrentEdit(dgna)
                hideit();
            }
        }
    }

    const cancelDgna = () => {
        hideit();
        setGroupName('');
        setPrior(null);
        setDGmembers([]);
        setCurrentEdit(null)
        setEditdgna(false)
    }

    const saveDgna = () => {
        let gnameVal, colorVal, memVal = false;
        let err = '';
        if (groupName) gnameVal = true;
        else { gnameVal = false; err = 'Please enter DGNA Group Name'; }
        if (selectedPrior) colorVal = true;
        else { colorVal = false; err = 'Please select color for the DGNA'; }
        if (dgMembers && dgMembers.length) memVal = true;
        else { memVal = false; err = 'Please add members to the DGNA' }

        if (gnameVal && colorVal && memVal) {
            const dgnaData = {
                ...currentEdit,
                name: groupName,
                color: selectedPrior,
                grpMembers: dgMembers
            }
            if (!edit) {
                addDGNA(dgnaData);
                cancelDgna()
            }
            else {
                console.log('dgna users selected members', dgnaData, dgMembers)
                editDGNA(dgnaData)
                cancelDgna()
            }
        }
        else showMessage({ header: 'DGNA', content: err, type: 'error' })
    }

    const showExportedList = () => {
        setSeen1(!seen1);
        setShowUserLists(!showUserLists)
    }

    const useDGNA = (dgna) => {
        hideit();
        setCurrentEdit(dgna)
    }

    const delDGNA = (dgna) => {
        detachDGNA(dgna.mcptt_id)
    }

    const exportMemList = (dgna) => {
        exportDGNAList(dgna)
    }

    const setName = (grpName) => {
        const GpName = grpName.replace(/\s*/g, "");
        if (GpName.length <= 15) setGroupName(GpName);
    }

    return (
        <div>
            {seen1 ?
                <div class="wrap-2 pad-0" id="dgna1" v-if="seen1">
                    <div class="main-widg-grid">
                        <div class="widg-header">
                            <div class="title-grid-2 m-b-5">
                                <div class="title al-center">
                                    <p class="f-title-m white in-blc">DGNA</p>
                                </div>
                                <div class="search al-center">
                                    {/* <div class="in-blc">
                                        <button class="sq-icon-btn in-blc">
                                            <i class="feather icon-trash-2 f-14"></i>
                                            <span class="f-12 m-l-6 p-r-5 p-b-5">Clear All</span>
                                        </button>
                                        <button class="sq-icon-btn m-l-5" onClick={showExportedList}>
                                            <i class="feather icon-users f-14"></i>
                                            <span class="f-12 m-l-6 p-r-5 p-b-5">User Lists</span>
                                        </button>
                                        <button
                                            class="btn btn-rgba-quick-link btn-rounded btn-sm white muli"
                                            id="new_dgna"
                                            onClick={hideit}
                                        >
                                            Create DG
                                        </button>
                                    </div> */}
                                    {/* <button class={"sq-icon-btn in-blc wx32 m-r-5"} 
                                        onClick={cancelDgna}>
                                        <i class={'feather icon-x'}></i>
                                    </button> */}
                                    <button class="sq-icon-btn in-blc wx32 m-r-5" onClick={showExportedList}>
                                        <i class="feather icon-folder f-14"></i>
                                        {/* <span class="f-12 m-l-6 p-r-5 p-b-5">User Lists</span> */}
                                    </button>
                                    <button
                                        class="btn btn-rgba-quick-link btn-rounded btn-sm white muli"
                                        id="new_dgna"
                                        onClick={hideit}
                                    >
                                        Create DG
                                    </button>
                                </div>
                            </div>
                            <p class="f-text-10 all-caps ml-1" style={{ color: '#8A98AC' }}>Available Dynamic Groups</p>
                        </div>
                        <div class="widg-body m-t-12">
                            <div class="dgna-sq-card-grid ovr-scr-y" style={{ height: '290px' }}>
                                {dgnaGroups && dgnaGroups.map((dgna, id) => {
                                    return (
                                        <ContextMenu
                                            subr={dgna.mcptt_id}
                                            key={id}
                                            id={dgna.mcptt_id}
                                            Class={"dgna-card " + ("attached")}
                                            type={'DGNA'}
                                            // subr={id} 
                                            clickOpen={true}
                                            onEdit={() => editDgna(dgna)}
                                            // onUse={() => useDGNA(dgna)}
                                            onFree={() => delDGNA(dgna)}
                                            // onExport={() => exportMemList(dgna)}
                                            attached={true}
                                        >
                                            <div class="">
                                                <img class="mr-8" src="assets/images/ic_baseline-group.svg" alt="dgna-group" />
                                            </div>
                                            <div class=""><p class="lim-30">{dgna.contactName}</p></div>
                                            {/* {dgna.attached ?
                                                <React.Fragment>
                                                    <div class={"dgna-clr " + (dgna.color === 1 ? "low" : dgna.color === 2 ? "med" : dgna.color === 3 ? "high" : "")} />
                                                    <div class=""><p class="lim-30">{`( ${dgna.grpMembers.length} )`}</p></div>
                                                </React.Fragment>
                                                : null} */}
                                        </ContextMenu>
                                    )
                                })}
                                {dgnaGroups && dgnaGroups.length === 0 ?
                                    <div
                                        class="pt-6 pb-6 pr-6 pl-6 f-18 f-reg white"
                                        style={{ height: '290px', display: 'flex', justifyContent: 'center', alignItems: 'center', whiteSpace: 'pre-wrap' }}
                                    >{'No DGNA found!'}
                                    </div>
                                    : null}
                            </div>
                        </div>
                        {/* <div class="widg-footer"></div> */}
                    </div>
                </div> : null}
            {seen2 ?
                <div class="" id="call2">
                    <div class="main-widg-grid">
                        <div class="widg-header">
                            <div class="title-grid-2">
                                <div class="title">
                                    <p class="f-title-m white in-blc">{edit ? 'EDIT DGNA' : 'NEW DGNA'}</p>
                                </div>
                                <div class="search al-center">
                                    <button class={"sq-icon-btn in-blc wx32 m-r-5"}
                                        onClick={cancelDgna}>
                                        <i class={'feather icon-x'}></i>
                                    </button>
                                    <button class="btn btn-success" id="new_dgna"
                                        onClick={saveDgna}>
                                        Save DG
                                    </button>
                                </div>
                            </div>
                        </div>
                        <div class="widg-body">
                            <div class="input-group m-t-10">
                                <input
                                    class="textinput"
                                    type="text"
                                    placeholder="Group Name"
                                    style={{ padding: '8px 8px' }}
                                    onChange={(e) => setName(e.target.value)}
                                    value={groupName}
                                />
                                <div class="custom-radio-button ml-8" style={{ marginTop: '-40px' }}>
                                    {colorOption.map((clr, id) => {
                                        return (
                                            <div class={"form-check-inline ml-8 " + (clr.css)} key={id}>
                                                <input
                                                    type="radio"
                                                    id={clr.prior}
                                                    value={clr.value}
                                                    name={clr.name}
                                                    checked={selectedPrior === clr.value}
                                                    onClick={(e) => setPrior(parseInt(e.target.value))}
                                                />
                                                <label for={clr.prior} class='ct-point'></label>
                                            </div>
                                        )
                                    })}
                                </div>
                            </div>
                            <DgnaEditMembers
                                members={dgMembers}
                                updateMembers={(mem) => setDGmembers(mem)}
                            />
                        </div>
                        <div class="widg-footer"></div>
                    </div>
                </div> : null}
            {showUserLists ? <DGNAUserLists close={showExportedList} /> : null}
        </div>
    )
}

const mapStateToProps = ({ communication, auth, common, systemdgnassi }) => {
    const { user } = auth;
    const { contactList } = communication;
    const { userLists } = common;
    const { systemDgnaSSI } = systemdgnassi;
    return {
        contactList,
        user,
        userLists,
        systemDgnaSSI
    };
};

export default connect(mapStateToProps, {
    showMessage, editDGNA, addDGNA, fetchDgna, detachDGNA, exportDGNAList
})(DGNAWidget);
