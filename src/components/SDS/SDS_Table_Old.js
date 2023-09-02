import React, { useState, useEffect, useLayoutEffect } from 'react'
import { connect } from 'react-redux'
import InfiniteScroll from "react-infinite-scroll-component";
//Other
import { } from '../../modules/actions';
import SDSMessage from './SDS_Message';
import ChatWidget from './Chat_Widget';
import ChatPreview from './Chat_Preview';
//Data format
import { StatusUpdate } from '../../models/status'

//Redux Actions
import { showMessage } from '../../modules/alerts'
import { sendTextMessageState, updateTextMessageState, updateGroupTextMessageState, fetchSdsTextLog } from '../../modules/communication'
import ForwardSDS from './ForwardSDS';
import { Title } from '../commom/Title';
import { setRefresh, updateTabOption } from '../../modules/activityLog';
import { getAlerts } from '../../modules/alarm';

const SDS_Table_Old = (props) => {
    const [Menuoptions, setMenuOptions] = useState([
        { name: "Inbox", value: 1, id: "pills-contact-tab", href: "#pills-read", aria: "pills-contact" },
        { name: "Sent", value: 2, id: "pills-contact-tab", href: "#pills-read", aria: "pills-contact" },
        { name: "Read", value: 3, id: "pills-contact-tab", href: "#pills-read", aria: "pills-contact" },
    ]);
    const [previewChat, setPreview] = useState(false);
    const [prevMsg, setPrevMsg] = useState({});
    const [forwardMsg, setforwardMsg] = useState({});
    const [showforward, setshowforward] = useState(false);
    const [selected, setSelected] = useState(1);
    const [filteredSDS, setfilteredSDS] = useState([]);
    const [lastFileteredSDS, setLastTabSDS] = useState([]);
    const { updateTabOption, showMessage, fetchSdsTextLog, user, textMessages, groupTextMessages, sendTextMessageState,
        updateTextMessageState, updateGroupTextMessageState,
        lastPage, sdsRefresh, setRefresh } = props;
    const [isSearch, setSearched] = useState(false);
    const [currentPage, setPage] = useState(1);
    const [initialFetch, setFetch] = useState(true);

    const [sdsMessages, setSdsMessages] = useState([])
    const [hasMore, setHasMore] = useState(true);
    const [loading, setLoader] = useState(false);
    const [showingNextData, setShowingNextData] = useState(false);

    useEffect(() => {
        console.log('msggg textMessages', textMessages, lastPage, currentPage, groupTextMessages)
        if (selected === 1 && initialFetch) {
            fetchSDS(1)
            setFetch(false)
        }
        if (sdsRefresh) {
            setTimeout(() => {
                fetchSDS(selected)
                setRefresh('sds', false)
            }, 1000);
        }
        setLoader(false)
        if (showingNextData) {
            // append data
            if (textMessages && textMessages.length > 0) {
                let msgs = [...sdsMessages, ...textMessages]
                setSdsMessages(msgs)
            }
        } else {
            if (textMessages && textMessages.length > 0) {
                setSdsMessages(textMessages)
            } else {
                setSdsMessages([])
            }
        }
        setShowingNextData(false)

    }, [textMessages, groupTextMessages, sdsRefresh])

    //functions
    const fetchSDS = (tab) => {
        if (selected != tab) {
            setSdsMessages([])
        }
        let filtr = []
        if (tab !== 0) {
            const tabType = getTab(tab);
            filtr = {
                type: tabType,
                id: user && user.profile.mcptt_id,
                current_page: 1,
            }
            setSelected(tab)
            updateTabOption('sds', tabType)
        }
        else {
            filtr = {
                type: getTab(selected),
                id: user && user.profile.mcptt_id,
                current_page: 1,
            }
            showMessage({ header: 'SDS', content: 'Tab refreshed successfully', type: 'notif' })
        }
        resetPages()
        fetchSdsTextLog(filtr)
    }

    const fetchPage = (page) => {
        const filtr = {
            type: getTab(selected),
            id: user && user.profile.mcptt_id,
            current_page: page,
        }
        setPage(page)
        fetchSdsTextLog(filtr)
    }

    const getTab = (activeTab) => {
        if (activeTab === 1) return 'inbox'
        if (activeTab === 2) return 'sent'
        if (activeTab === 3) return 'read'
        else return ''
    }

    const resetPages = () => {
        setPage(1)
        setHasMore(true)
        setLoader(true)
        setShowingNextData(false)
    }

    const sendTextMessageStateUpdate = (message) => {
        /*if (message.consumedReportNeeded) {
            sendTextMessageState(new StatusUpdate(message, 'CONSUMED'))
        }
        const data = new StatusUpdate(message, 'READ')
        sendTextMessageState(data)
        if (data.sdsType === 'TEXT_MESSAGE') {
            updateTextMessageState(data)
        } else {
            updateGroupTextMessageState(data)
        }*/
    }

    const showMsgPreview = (msg) => {
        setPreview(true);
        setPrevMsg(msg);
        if ((msg.stateType !== 'READ') && (selected === 1)) {
           // sendTextMessageStateUpdate(msg)
        }
    }

    const showForwardScreen = (msg) => {
        setshowforward(true);
        setforwardMsg(msg)
    }

    const searchSDS = (search) => {
        let filterSDS;
        if (search) {
            filterSDS = lastFileteredSDS.filter(cont =>
                cont.toId.includes(search) ||
                cont.fromId.includes(search))
            setfilteredSDS(filterSDS);
            setSearched(true);
        }
        else {
            setfilteredSDS(lastFileteredSDS);
            setSearched(false);
        }
    }

    const getMoreData = () => {
        console.log('msggg textMessages get more data..', currentPage, lastPage)
        if (currentPage === lastPage) {
            setHasMore(false);
            return;
        }
        setLoader(true)
        setShowingNextData(true)
        fetchPage(currentPage + 1)
    }

    return (
        <div>
            <Title title="SDS Messages" type="collapseSDS" filtr={fetchSDS} search={() => { }} />
            <ul class="nav nav-pills m-t-12 m-b-12" id="pills-tab" role="tablist">
                {Menuoptions.map((opt, id) => {
                    return (
                        <li class="tabs-pills" key={opt.name + id}>
                            <a
                                class={selected === opt.value ? "pill-tabs active muli" : "pill-tabs muli"}
                                id={opt.id}
                                data-toggle="pill"
                                href=''
                                role="tab"
                                aria-controls={opt.aria}
                                aria-selected={selected === opt.value ? true : false}
                                onClick={() => { fetchSDS(opt.value); setPreview(false); setshowforward(false) }}
                            >{opt.name}</a>
                        </li>
                    )
                })}
            </ul>
            {selected !== 4 && !previewChat && !showforward ?
                <div
                    id={'scrollableDivSDSMsg'}
                    class="tab-pane fade show active ovr-scr-y"
                    style={{ height: '400px', marginTop: '12px' }}
                    //id="pills-unread"
                    role="tabpanel"
                    aria-labelledby="pills-home-tab"
                >
                    {sdsMessages && sdsMessages.length > 0 ?
                        <InfiniteScroll
                            dataLength={sdsMessages.length}
                            next={getMoreData}
                            hasMore={hasMore}
                            loader={loading ? <div class='al-center'><p class='white'>Loading</p></div> : <div></div>}
                            scrollableTarget={'scrollableDivSDSMsg'}
                            refreshFunction={() => fetchSDS(selected)}
                            pullDownToRefresh
                            pullDownToRefreshThreshold={50}
                            pullDownToRefreshContent={
                                <div class=" pt-6 pb-6 pr-6 pl-6 f-18 f-reg white" style={{ textAlign: 'center' }}>Pull down to refresh</div>
                            }
                            releaseToRefreshContent={
                                <div class=" pt-6 pb-6 pr-6 pl-6 f-18 f-reg white" style={{ textAlign: 'center' }}>Release to refresh</div>
                            }
                        >
                            {sdsMessages.map((sds, id) => {
                                return (
                                    <SDSMessage
                                        data={sds}
                                        key={id}
                                        setMsg={(msg) => showMsgPreview(msg)}
                                        forwardMsg={(msg) => showForwardScreen(msg)}
                                        markasRead={(sds) => sendTextMessageStateUpdate(sds)}
                                        Class={selected === 1 && sds.stateType === 'READ' ? 'msgRead' : 'unread'}
                                        msgType={selected === 3 ? 'READ' : selected === 2 ? 'SENT' : 'INBOX'}
                                        read={selected === 1 && sds.stateType === 'READ' ? true : false}
                                    />)
                            })}
                        </InfiniteScroll>
                        : null}
                    {sdsMessages && sdsMessages.length === 0 ?
                        <div
                            class="pt-6 pb-6 pr-6 pl-6 f-18 f-reg white"
                            style={{ height: '400px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}
                        >{isSearch ? 'No match found' : loading ? '' : 'No sds availabble'}
                        </div>
                        : null}
                </div>
                : null}

            {selected !== 4 && previewChat ?
                <ChatPreview
                    data={prevMsg}
                    closePrev={() => { setPreview(false) }}
                    msgType={selected === 3 ? 'READ' : selected === 2 ? 'SENT' : 'INBOX'}
                /> : null}
            {selected !== 4 && showforward ? <ForwardSDS data={forwardMsg} closePrev={() => { setshowforward(false) }} /> : null}
        </div>
    )
}

const mapStateToProps = ({ communication, auth, logs, alarm }) => {
    const { textMessages, groupTextMessages, lastPage } = communication;
    const { user } = auth;
    const { sdsRefresh } = logs;
    return {
        textMessages, groupTextMessages, lastPage,
        user,
        sdsRefresh
    };
};

export default connect(mapStateToProps, {
    sendTextMessageState,
    showMessage,
    updateTextMessageState,
    updateGroupTextMessageState,
    fetchSdsTextLog,
    updateTabOption,
    setRefresh,
    getAlerts
})(SDS_Table_Old);
