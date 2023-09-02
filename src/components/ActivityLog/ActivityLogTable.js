import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux'
import InfiniteScroll from "react-infinite-scroll-component";
import moment from "moment";
//Other
import { } from '../../modules/actions';
import { fetchActivityLog, setRefresh, updateTabOption } from '../../modules/activityLog';
import { otherStatus, SdsStatus, paAlerts } from '../../constants/constants';
import { showMessage } from '../../modules/alerts';
import { Title } from '../commom/Title';
import TypeCall from './TypeCall';
import AddTimePicker from './AddTimePicker';
import { Modal } from 'react-bootstrap'
import { getCallieIdToShow } from '../../utils/lib'

const ActivityLogTable = ({ fetchActivityLog, user, activityLogs, lastPage, currPage, showMessage, updateTabOption, logsRefresh, setRefresh, total, activeTab, contactList }) => {
    const [Logs, setLogs] = useState([]);
    const [selected, setSelected] = useState(1);
    const [lastFiletered, setLastTab] = useState([]);
    const [isSearch, setSearched] = useState(false);
    const [initialFetch, setFetch] = useState(true);
    const [currentPage, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [loading, setLoader] = useState(false);
    const [modelPopUpOpen, setPopUpModelOpen] = useState(false);

    useEffect(() => {
        //code here
        if (initialFetch) {
            fetchLogs(1)
            setFetch(false)
        }
        console.log('logs refresh...', logsRefresh, activityLogs)
        if (logsRefresh) {
            setTimeout(() => {
                fetchLogs(selected)
                setRefresh('logs', false)
            }, 500);
        }
        if (activityLogs) {
            const modifiedLogs = activityLogs.map(actlog => ({ ...actlog, contactName: getCallieName(getDisplayId(actlog)) }))
            setLogs(modifiedLogs);
            setLastTab(modifiedLogs);
        }
    }, [activityLogs, logsRefresh])

    const getDisplayId = (actlog) => {
        const userId = user && user.profile.mcptt_id;
        if (actlog.fromId === userId) {
            return actlog.toId
        } else {
            if (actlog.groupId && actlog.groupId.length > 0) {
                return actlog.groupId
            } else {
                return actlog.fromId
            }
        }
    }

    //functions
    const fetchLogs = (tab) => {
        let filtr = []
        if (tab === 5) {
            setPopUpModelOpen(true);
        } else {
            if (tab !== 0) {
                const tabType = getTab(tab);
                filtr = {
                    type: tabType,
                    id: user && user.profile.mcptt_id,
                    current_page: 1,
                    tabChanged: true
                }
                setSelected(tab)
                updateTabOption('log', tabType)
            }
            else {
                filtr = {
                    type: getTab(selected),
                    id: user && user.profile.mcptt_id,
                    current_page: 1,
                    tabChanged: true
                }
                setLoader(true);
                setTimeout(() => {
                    setLoader(false)
                }, 500);
                // showMessage({header: 'LOGS', content: 'Tab refreshed successfully', type: 'notif'})
            }
            setPage(1)
            fetchActivityLog(filtr)
            setHasMore(true);
        }
    }

    const fetchPage = (page) => {
        const filtr = {
            type: getTab(selected),
            id: user && user.profile.mcptt_id,
            current_page: page,
        }
        setPage(page)
        fetchActivityLog(filtr)
    }

    const getMoreData = () => {
        if (currPage === lastPage) {
            setHasMore(false);
            return;
        }
        fetchPage(currentPage + 1)
    }

    const getTab = (tab) => {
        if (tab === 4) return 'all'
        if (tab === 1) return 'calls'
        if (tab === 2) return 'sds'
        if (tab === 3) return 'alerts'
        else return 'all'
    }

    const searchLog = (searchData) => {
        let filteredLog;
        if (searchData.length > 0) {
            filteredLog = lastFiletered.filter(cont =>
                cont.contactName.toLowerCase().includes(searchData.toLowerCase()))
            //console.log('filteredLog',filteredLog)
            setLogs(filteredLog);
            setSearched(true);
            setHasMore(false);
        }
        else {
            setLogs(lastFiletered);
            setSearched(false);
            setHasMore(true);
        }
    }

    const downloadCSV = (durl) => {
        let hiddenElement = document.createElement('a');
        hiddenElement.href = durl;
        hiddenElement.target = '_blank';
        hiddenElement.download = 'ActivityLog.csv';
        hiddenElement.click();
    }

    const getAlertFromCode = (code) => {
        const alert = [...SdsStatus, ...otherStatus, ...paAlerts].filter(status => Number(status.code) === Number(code));
        if (alert && alert.length > 0) return alert[0].desc
        else return ''
    }

    const callbackDateTimeRange = (from, to) => {
        setPopUpModelOpen(false);
        let fromDate = moment(from).format('L')
        let toDate = moment(to).format('L')
        let path = `https://${global.config.ipConfig.dispatcherHost}:${global.config.ipConfig.dispatcherServerPort}/exportLogs/`
        let baseUrl = `${path}?id=${user.profile.mcptt_id}&type=${'all'}&fromDate=${fromDate}&toDate=${toDate}`
        console.log('logs export baseUrl', baseUrl)
        // axios({
        //     method: "get",
        //     url: baseUrl,
        // }).then(function (res) {
        //     console.log("msgg downloadfile API res ", res)

        // }).catch(function (err) {
        //     console.log("msgg file API err ", err)
        // })
        downloadCSV(baseUrl)
    }

    const modelPopUpHandleClose = () => {
        setPopUpModelOpen(false);
    };

    const getCallieName = (id) => {
        let contactName = getDisplayName(id)
        if (contactName.length > 0) {
            if (contactName == getCallieIdToShow(id)) {
                return contactName
              } else {
                return contactName + '(' + getCallieIdToShow(id) + ')'
              }
        } else {
            return getCallieIdToShow(id)
        }
    };

    const getDisplayName = (id) => {
        //const callerId = getCallieIdToShow(id)
        const subDetails = contactList.filter(cont =>
            //getCallieIdToShow(cont.mcptt_id) === callerId
            cont.mcptt_id == id
        );
        if (subDetails.length > 0) return subDetails[0].contactName
        else return ''
    }

    return (
        <div>
            <Title title="Activity Logs" type="collapseLog" active={selected} search={searchLog} filtrTab={fetchLogs} />
            <div class="act-row-grid-head">
                {/* <div class="act1"><input type="checkbox"/></div> */}
                <div class="act3"></div>
                <div class="act5 f-act-head">Subscriber</div>
                <div class="act7 f-act-head">Time</div>
                <div class="act9 f-act-head">Type</div>
                {/* <div class="act11 f-act-head">Action</div> */}
            </div >
            <div id={'scrollableDiv' + activeTab} class="ovr-scr-y" style={{ height: '370px' }}>
                {Logs && Logs.length > 0 && !loading ?
                    <InfiniteScroll
                        dataLength={Logs.length}
                        next={getMoreData}
                        hasMore={hasMore}
                        loader={<div class='al-center'><p class='white'>Loading</p></div>}
                        scrollableTarget={'scrollableDiv' + activeTab}
                        refreshFunction={() => fetchLogs(0)}
                        pullDownToRefresh
                        pullDownToRefreshThreshold={50}
                        pullDownToRefreshContent={
                            <div class=" pt-6 pb-6 pr-6 pl-6 f-18 f-reg white" style={{ textAlign: 'center' }}>Pull down to refresh</div>
                        }
                        releaseToRefreshContent={
                            <div class=" pt-6 pb-6 pr-6 pl-6 f-18 f-reg white" style={{ textAlign: 'center' }}>Release to refresh</div>
                        }
                    >
                        {Logs && Logs.map((log, id) => (
                            <TypeCall log={log} key={id} />
                        ))}
                    </InfiniteScroll>
                    : null}
                {loading ?
                    <div
                        class="pt-6 pb-6 pr-6 pl-6 f-18 f-reg white"
                        style={{ height: '400px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}
                    >{'Loading...'}
                    </div>
                    : null}
                {Logs && Logs.length === 0 ?
                    <div
                        class="pt-6 pb-6 pr-6 pl-6 f-18 f-reg white"
                        style={{ height: '400px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}
                    >{isSearch ? 'No match found' : 'No logs availabble'}
                    </div>
                    : null}
            </div>
            <div class='m-t-5 flt-r'>
            </div>
            <div>
                <Modal
                    show={modelPopUpOpen}
                    onHide={modelPopUpHandleClose}
                    scrollable={false}
                    size={"lg"}
                    aria-labelledby="contained-modal-title-vcenter"
                    centered
                    style={{ backgroundColor: ' rgba(0,0,0,0.5)' }}
                >
                    <Modal.Header closeButton style={{ border: '0px', backgroundColor: '#282828' }}>
                        {<Modal.Title>Select Date Range </Modal.Title>}

                    </Modal.Header>
                    <Modal.Body style={{ padding: '0.2px' }}>
                        <AddTimePicker exportBtnClick={callbackDateTimeRange}></AddTimePicker>
                    </Modal.Body>
                </Modal>
            </div>
        </div>
    )
}

const mapStateToProps = ({ auth, logs, communication }) => {
    const { user } = auth;
    const { activityLogs, lastPage, logsRefresh, total, currentPage, activeTab } = logs;
    const currPage = currentPage;
    const { contactList } = communication;
    return {
        activityLogs, lastPage, logsRefresh, total, currPage, activeTab,
        user,
        contactList
    };
};

export default connect(mapStateToProps, { fetchActivityLog, showMessage, updateTabOption, setRefresh })(ActivityLogTable);
