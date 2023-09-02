import React, { useEffect, useState, useRef } from 'react'
import { connect } from 'react-redux'
import { Pagination } from "semantic-ui-react";
import { setRefresh, updateTabOption } from '../../modules/activityLog';
// import { Pagination } from 'react-bootstrap'
import { getAlerts } from '../../modules/alarm';
import { otherStatus, SdsStatus, subscriberType, paAlerts } from '../../constants/constants';
import { Title } from '../commom';
import AlertCard from './AlertCard';
import AlertList from './AlertList';
import ViewListIcon from '@mui/icons-material/ViewList';
import ViewModuleIcon from '@mui/icons-material/ViewModule';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';

const IncomingALerts = (props) => {
    const [Menuoptions, setMenuOptions] = useState([
        { name: "Incoming Alerts", value: 1, id: "pills-contact-tab", href: "#pills-read", aria: "pills-contact" },
        { name: "Acknowledged Alerts", value: 2, id: "pills-contact-tab", href: "#pills-read", aria: "pills-contact" },
        // { name: "Sent Alerts", value: 3, id: "pills-contact-tab", href: "#pills-read", aria: "pills-contact" },
        // { name: "Ignored Alerts", value:4, id:"pills-contact-tab", href:"#pills-marked", aria:"pills-contact"},
        // { name: "RTT Alerts", value:5, id:"pills-contact-tab", href:"#pills-marked", aria:"pills-contact"},
        // { name: "PEA Alerts", value:6, id:"pills-contact-tab", href:"#pills-marked", aria:"pills-contact"},
        { name: "Emergency Alerts", value: 4, id: "pills-contact-tab", href: "#pills-marked", aria: "pills-contact" },
        // { name: "Task Lists", value: 5, id: "pills-contact-tab", href: "#pills-marked", aria: "pills-contact" }
    ]);
    const [selected, setSelected] = useState(1);
    const [isSearch, setSearched] = useState(false);
    const [currentPage, setPage] = useState(1);
    const [initialFetch, setFetch] = useState(true);
    const [alerts, setAlerts] = useState([])
    const [incomingAlertsCount, setIncomingAlertsCount] = useState(0)
    const { statuses, groupStatuses, user, getAlerts, total, lastPage, updateTabOption, alertsRefresh, setRefresh, trains, radioData } = props;
    const [selectedDisplay, setSelectedDisplay] = useState('list');

    const handleChange = (event, nextView) => {
        setSelectedDisplay(nextView);
    };
    useEffect(() => {
        if (selected === 1 && initialFetch) {
            fetchAlerts(1)
            setFetch(false)
        }
        if (alertsRefresh) {
            setTimeout(() => {
                fetchAlerts(selected)
                setRefresh('alerts', false)
            }, 1000);
        }
    }, [])

    useEffect(() => {
        console.log('alerts data...', statuses)
        setAlerts([])
        setTimeout(() => {
            if (selected === 4) {
                setAlerts(sortAlertsOnlyEmergency(statuses))
            } else {
                setAlerts(sortAlerts(statuses))
            }
        }, 200)
    }, [statuses, groupStatuses])

    useEffect(() => {
        if (selected === 1 && initialFetch) {
            fetchAlerts(1)
            setFetch(false)
        }
        if (alertsRefresh) {
            setTimeout(() => {
                fetchAlerts(selected)
                setRefresh('alerts', false)
            }, 1000);
        }
    }, [alertsRefresh])

    const sortAlerts = (alertsData) => {
        //const modifiedAlerts = alertsData.filter(alrt => !(alrt.tetraCode === '65024' || alrt.tetraCode === '65025')).map(alertObj => ({ ...alertObj, priority: getAlert(alertObj.tetraCode) }))
        const alertsWithRakeIds = getTrainRakeId(alertsData)
        const modifiedAlerts = alertsWithRakeIds.map(alertObj => ({ ...alertObj, priority: getAlert(alertObj.tetraCode) }))
        //const sortedData = modifiedAlerts.sort((a, b) => (Number(a.priority) >= Number(b.priority) ? 1 : -1))
        if (selected === 1) {
            setIncomingAlertsCount(modifiedAlerts.length)
        }
        return modifiedAlerts
    }

    const sortAlertsOnlyEmergency = (alertsData) => {
        // const modifiedAlerts = alertsData.filter(alrt => !(alrt.tetraCode === '65024' || alrt.tetraCode === '65025')).map(alertObj => ({ ...alertObj, priority: getAlert(alertObj.tetraCode) }))
        //     .filter(alrt => (alrt.priority === '0' || alrt.tetraCode === '0'))
        const alertsWithRakeIds = getTrainRakeId(alertsData)
        const modifiedAlerts = alertsWithRakeIds.map(alertObj => ({ ...alertObj, priority: getAlert(alertObj.tetraCode) }))
            .filter(alrt => (alrt.priority === '0' || alrt.tetraCode === '0'))
        const sortedData = modifiedAlerts.sort((a, b) => (Number(a.priority) >= Number(b.priority) ? 1 : -1))
        return sortedData
    }

    const getAlert = (code) => {
        const alert = [...SdsStatus, ...otherStatus, ...paAlerts].filter(status => Number(status.code) === Number(code));
        if (alert && alert.length > 0) return alert[0].priority
        else return '1'
    }

    const getTrainRakeId = (alertsData) => {
        let rakeId = ''
        let trainNum = ''
        let modifiedAlerts = []
        for (const data of alertsData) {
            rakeId = ''
            trainNum = ''
            const sent = data.fromId === user.profile.mcptt_id;
            const radioId = sent === true ? data.toId : data.fromId
            const radios = radioData.filter(radio => radio.RadioID_A === radioId || radio.RadioID_B === radioId)
            if (radios.length > 0) {
                let radio = radios[0]
                if (radio.rakeId) {
                    rakeId = radio.rakeId
                }
                if (rakeId.length > 0) {
                    const trainss = trains.filter(train => train.rakeId === rakeId)
                    if (trainss.length > 0) {
                        let train = trainss[0]
                        if (train.trainNumber) {
                            trainNum = train.trainNumber
                        }
                    }
                }
            }
            let modifiedData = {...data, "rakeId": rakeId, "trainNum": trainNum}
            //console.log('modifiedAlerts data..', modifiedData)
            modifiedAlerts = [...modifiedAlerts, modifiedData]
        }
        //console.log('rakeAndTrainId modifiedAlerts..', modifiedAlerts)
        return modifiedAlerts
    }


    const filterData = (type) => {
        if (type === 'SENT') {
            return [...statuses, ...groupStatuses]
                .filter(status =>
                    status.stateType !== 'IGNORED' && status.stateType !== 'ACKNOWLEDGED' &&
                    status.fromId === (user && user.profile.mcptt_id)
                ).sort((a, b) => new Date(b.created) - new Date(a.created))
        }
        else {
            return [...statuses, ...groupStatuses]
                .filter(status =>
                    status.stateType === type && status.fromId !== (user && user.profile.mcptt_id)
                ).sort((a, b) => new Date(b.created) - new Date(a.created))
        }

    }

    const fetchAlerts = (tab) => {
        const tabType = tab === 1 ? 'inc' : tab === 2 ? 'ack' : tab === 3 ? 'sent' : 'inc'
        const filtr = {
            type: tabType,
            id: user && user.profile.mcptt_id,
            current_page: 1,
        }
        setSelected(tab)
        getAlerts(filtr)
        updateTabOption('alerts', tabType)
    }

    const fetchPage = (page) => {
        const filtr = {
            type: selected === 1 ? 'inc' : selected === 2 ? 'ack' : selected === 3 ? 'sent' : 'inc',
            id: user && user.profile.mcptt_id,
            current_page: page,
        }
        setPage(page)
        getAlerts(filtr)
    }

    return (
        <div style={{ position: 'relative' }}>
            <div class="title-grid-list">
                <Title title="Incoming Alerts" type="Alerts" search={() => { }} />
                <div class="grid-list-view-icon">
                    <ToggleButtonGroup
                        orientation="horizontal"
                        value={selectedDisplay}
                        exclusive
                        onChange={handleChange}
                        size="small"
                        color="primary"
                    >
                        <ToggleButton value="list" aria-label="list" size="small">
                            <ViewListIcon />
                        </ToggleButton>
                        <ToggleButton value="module" aria-label="module" size="small">
                            <ViewModuleIcon />
                        </ToggleButton>
                    </ToggleButtonGroup>
                </div>
            </div>
            <div class="title-grid-4">
                <div class="title">
                    <ul class="nav nav-pills m-t-12 m-b-12" id="pills-tab" role="tablist">
                        {Menuoptions.map((opt, id) => {
                            return (
                                <li class="tabs-pills m-r-10" key={opt.name + id}>
                                    <a
                                        class={selected === opt.value ? "pill-tabs active muli" : "pill-tabs muli"}
                                        id={opt.id}
                                        data-toggle="pill"
                                        href=''
                                        role="tab"
                                        aria-controls={opt.aria}
                                        aria-selected={selected === opt.value ? true : false}
                                        onClick={() => { fetchAlerts(opt.value) }}
                                    >{opt.value === 1 ? opt.name + "(" + incomingAlertsCount + ")" : opt.name}</a>
                                </li>
                            )
                        })}
                    </ul>
                </div>
                <div class="search">
                    {total ?
                        <div >
                            <Pagination
                                boundaryRange={0}
                                defaultActivePage={1}
                                ellipsisItem={null}
                                firstItem={null}
                                lastItem={null}
                                siblingRange={1}
                                totalPages={lastPage}
                                size='mini'
                                onPageChange={(e, { activePage }) => fetchPage(activePage)}
                            />
                            {/* <Pagination size="sm">
                            <Pagination.Prev />
                            {items}
                            <Pagination.Next />
                        </Pagination> */}
                        </div>
                        : null}
                </div>
            </div>
            <div class="tab-content" id="pills-tabContent">
                <div style={selectedDisplay === 'list' ? {
                    height: '750px', width: '100%', marginTop: '10px', marginLeft: '20px', marginRight: '20px',
                    borderRadius: '14px',
                    backgroundColor: "#363636",
                    overflowY: 'scroll'
                } : { height: '0px' }}>
                    {selectedDisplay === 'list' ? alerts && alerts.map(alert => {
                        return (
                            <AlertList
                                id={'rt56'}
                                data={alert}
                                sent={selected === 3 ? true : false}
                                key={alert.created}
                            />)
                    }) : null}
                </div>
                <div class="tab-pane fade show active ovr-scr-y" style={selectedDisplay !== 'list' ? { height: '750px' } : { height: '0px' }} id="pills-inc-alerts" role="tabpanel" aria-labelledby="pills-home-tab">
                    <div class="a2-grid m-t-15">
                        {alerts && alerts.map(alert => {
                            return (
                                <AlertCard
                                    id={'rt56'}
                                    data={alert}
                                    sent={selected === 3 ? true : false}
                                    key={alert.created}
                                />)
                        })}
                    </div>
                    {statuses && statuses.length === 0 ?
                        <div
                            class="pt-6 pb-6 pr-6 pl-6 f-18 f-reg white"
                            style={{ height: '445px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}
                        >{isSearch ? 'No match found' : 'No alerts available'}
                        </div>
                        : null}
                </div>
            </div>

            {/* <div class="title-grid-4">
                <div class="title"></div>
                <div class="search">
                    <div >
                        <Pagination
                            boundaryRange={0}
                            defaultActivePage={1}
                            ellipsisItem={null}
                            firstItem={null}
                            lastItem={null}
                            siblingRange={1}
                            totalPages={10}
                        />
                    </div>
                </div>
            </div> */}
        </div>
    )
}

const mapStateToProps = ({ alarm, auth, logs, train }) => {
    const { statuses, groupStatuses, total, currentPage, lastPage } = alarm;
    const { user } = auth;
    const { alertsRefresh } = logs;
    const { trains, radioData } = train;
    return {
        statuses,
        groupStatuses,
        total,
        currentPage,
        lastPage,
        user,
        alertsRefresh,
        trains,
        radioData
    };
};

export default connect(mapStateToProps, { getAlerts, updateTabOption, setRefresh })(IncomingALerts)
