import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux'
import InfiniteScroll from "react-infinite-scroll-component";

//Other
import { } from '../../modules/actions';
import ContactRow from './ContactRow';
import { Title } from '../../components/commom';
import { subscriberStatus, subscriberType, domain } from '../../constants/constants';
import { setIconColor } from '../../utils/lib';
import { getCallieIdToShow } from '../../utils/lib'
import { checkMcpttIdIsInRunningCalls } from '../../modules/communication';

const ContactListTable = ({ contactList, defaultGroupId, groupCalls, individualCalls }) => {
    const [lastFileteredCont, setLastTabCont] = useState([]);
    const [filteredContacts, setfiltered] = useState([]);
    const [activeTab, setActiveTab] = useState('phonebook');
    const [isSearch, setSearched] = useState(false);
    const [serchText, setSearchText] = useState('');
    const [Menuoptions, setMenuOptions] = useState([
        { name: "Favourites", value: 'fav', id: "pills-home-tab", aria: "pills-home" },
        { name: "Phonebook", value: 'phonebook', id: "pills-profile-tab", aria: "pills-profile" },
        //{ name: "Emergency", value: 'emergency', id: "pills-contact-tab", aria: "pills-contact" },
        // { name: "Chat View", value:4, id:"pills-contact-tab", href:"#pills-marked", aria:"pills-contact"},
    ]);
    //PAGINATION
    const [count, setCount] = useState({
        prev: 0,
        next: 50
    })
    const [hasMore, setHasMore] = useState(true);
    const [current, setCurrent] = useState([]);
    const [activeFilter, setActiveFilter] = useState('indv');

    useEffect(() => {
        if (serchText) {
            autoFilterOnUpdate(true)
        }
        else {
            autoFilterOnUpdate(false)
        }
    }, [contactList, defaultGroupId, groupCalls, individualCalls])
    
    const autoFilterOnUpdate = async () => {
        await filterTabData(activeTab);
    }

    const filterData = (array) => {
        const disabled = array.filter(x => x.Reg_status != subscriberStatus['REGISTERED'] && x.subscriber_type !== subscriberType['GROUP'])
        const enabled = array.filter(x => x.Reg_status == subscriberStatus['REGISTERED'] || x.subscriber_type === subscriberType['GROUP'])
        const rebuilt = [...enabled, ...disabled];
        return rebuilt;
    };

    const filterTabData = async (activeTab) => {
        let filteredContact = applyMainFilter(contactList)
        if (activeTab === 'fav') {
            if (activeFilter === 'indv') {
                filteredContact = filterData(filteredContact.filter(cont => cont.fav === true));
            } else {
                const favConts = filterData(filteredContact.filter(cont => cont.fav === true || getCallieIdToShow(cont.mcptt_id) === getCallieIdToShow(defaultGroupId)));
                const defaultGrps = favConts.filter(cont => getCallieIdToShow(cont.mcptt_id) === getCallieIdToShow(defaultGroupId));
                const onlyFavConts = favConts.filter(cont => cont.fav === true && !checkContInDefaultGroup(cont, defaultGrps));
                filteredContact = [...defaultGrps, ...onlyFavConts];
            }
            
        }
        if (activeTab === 'phonebook') {
        }
        if (activeTab === 'emergency') {
            filteredContact = filterData(filteredContact.filter(cont => cont.emergency === true));
        }
        setTimeout(() => {
            setActiveTab(activeTab)
            setLastTabCont(filteredContact)
            if (serchText) {
                searchContact(serchText, filteredContact)
            } else {
                setfiltered(filteredContact);
                setCurrent(filteredContact.slice(0, 50))
            }
            setCount({ prev: 0, next: 50 })
            if(current.length<filteredContacts.length){
                setHasMore(true);
            }   
        }, 300)
    };

    const applyMainFilter = (filterArr) => {
        let filterCont;
        if (activeFilter === 'indv') {
            filterCont = filterData(filterArr.filter(cont => cont.subscriber_type !== subscriberType['GROUP']))
        } else if (activeFilter === 'grp') {
            filterCont = filterData(filterArr.filter(cont => cont.subscriber_type === subscriberType['GROUP'] && cont.temporary === 'false'))
        } else if (activeFilter === 'tetra') {
            filterCont = filterData(filterArr.filter(cont => cont.Domain === domain['Tetra']))
        } else {
            filterCont = filterData(filterArr);
        }
        return filterCont
    }

    const checkContInDefaultGroup = (cont, defaultGrps) => {
        const filterData = defaultGrps.filter(contf => getCallieIdToShow(contf.mcptt_id) === getCallieIdToShow(cont.mcptt_id))
        if (filterData.length) {
            return true
        } else {
            return false
        }
    }

    const getMoreData = () => {
        // console.log('ADD MORE',current.length,filteredContacts.length,count,hasMore)
        if (current.length >= filteredContacts.length) {
            setHasMore(false);
            return;
        }
        setTimeout(() => {
            setCurrent(current.concat(filteredContacts.slice(count.prev + 50, count.next + 50)))
        }, 300)
        setCount((prevState) => ({ prev: prevState.prev + 50, next: prevState.next + 50 }))
    }

    const searchContact = (searchCont, filterArr = lastFileteredCont) => {
        let filterCont;
        setSearchText(searchCont);
        if (searchCont) {
            filterCont = filterArr.filter(cont =>
                cont.contactName.toLowerCase().includes(searchCont.toLowerCase()) ||
                cont.mcptt_id.includes(searchCont))
            setfiltered(filterCont);
            setCurrent(filterCont.slice(0, 50))
            setCount({ prev: 0, next: 50 })
            setSearched(true)
        }
        else {
            setfiltered(lastFileteredCont);
            setCurrent(lastFileteredCont.slice(0, 50))
            setCount({ prev: 0, next: 50 })
            setSearched(false)
            //if (activeFilter) indvOrGrpFilter(activeFilter)
        }
    }

    const indvOrGrpFilter = (type) => {
        let filterCont = []
        if (type === 'indv') {
            filterCont = filterData(contactList.filter(cont => cont.subscriber_type !== subscriberType['GROUP']))
        }
        //&& cont.temporary === 'false'
        if (type === 'grp') {
            filterCont = filterData(contactList.filter(cont => cont.subscriber_type === subscriberType['GROUP'] && cont.temporary === 'false'))
        }
        if (type === 'tetra') {
            filterCont = filterData(contactList.filter(cont => cont.Domain === domain['Tetra']))
        }
        filterCont = applySubFilter(filterCont, type)
        setTimeout(() => {
            setActiveFilter(type);
            setfiltered(filterCont);
            setLastTabCont(filterCont)
            setCurrent(filterCont.slice(0, 50))
            setCount({ prev: 0, next: 50 })
            setHasMore(true)
        }, 300)
    }

    const applySubFilter = (filterArr, type) => {
        if (activeTab === 'fav') {
            if (type === 'indv') {
                return filterData(filterArr.filter(cont => cont.fav === true));
            } else {
                const favConts = filterData(filterArr.filter(cont => cont.fav === true || getCallieIdToShow(cont.mcptt_id) === getCallieIdToShow(defaultGroupId)));
                const defaultGrps = favConts.filter(cont => getCallieIdToShow(cont.mcptt_id) === getCallieIdToShow(defaultGroupId));
                const onlyFavConts = favConts.filter(cont => cont.fav === true && !checkContInDefaultGroup(cont, defaultGrps));
                return [...defaultGrps, ...onlyFavConts];
            }
        } else if (activeTab === 'phonebook') {
            return filterArr
        } else if (activeTab === 'emergency') {
            return filterData(filterArr.filter(cont => cont.emergency === true));
        } else {
            return filterArr
        }
    }

    const setVisibility = (data, opacity = false) => {
        // {(data.Reg_status!=='Registered' || data.subscriber_type!=='Group')?{ pointerEvents:'none'}:{}}
        return opacity ? true : {}
        // if (data.subscriber_type !== subscriberType['GROUP']) {
        //     if (data.Reg_status !== subscriberStatus['REGISTERED']) {
        //         return opacity ? false : { pointerEvents: 'none' };
        //     }
        //     else return opacity ? true : {}
        // }
        // if (data.subscriber_type === subscriberType['GROUP']) return opacity ? true : {}
    }
    
    const checkMcxIdISInRunningCall = (mcxId) => {
        if (mcxId) {
            return checkMcpttIdIsInRunningCalls(mcxId);
        }
        return false;
    }

    return (
        <div>
            <Title title="Contact List" type="collapseCont" search={searchContact} indvGrp={indvOrGrpFilter} active={activeFilter} />
            <ul class="nav nav-pills m-t-15 m-b-12" id="pills-tab" role="tablist">
                {Menuoptions.map((opt, id) => {
                    return (
                        <li class="tabs-pills" key={opt.name + id}>
                            <a
                                class={activeTab === opt.value ? "pill-tabs active muli" : "pill-tabs muli"}
                                id={opt.id}
                                data-toggle="pill"
                                href=''
                                role="tab"
                                aria-controls={opt.aria}
                                aria-selected={activeTab === opt.value ? true : false}
                                onClick={() => { filterTabData(opt.value); }}
                            >{opt.value === 'phonebook' ? opt.name + ' (' + (contactList && contactList.length) + ') ' : opt.name}</a>
                            {/* >{opt.value==='phonebook'?opt.name+' ('+(current && current.length)+'-'+(filteredContacts && filteredContacts.length)+') ':opt.name}</a> */}
                        </li>
                    )
                })}
                {/* <div class="dropdown">
                    <button class="btn btn btn-rgba-quick-link m-l-15 white" style={{ marginTop:'-5px'}} type="button" id="CustomdropdownMenuButton7" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"><i class="feather icon-more-vertical"></i></button>
                    <div class="dropdown-menu" aria-labelledby="CustomdropdownMenuButton7">
                        <a class="dropdown-item" href="#" onClick={()=>indvOrGrpFilter('indv')}><i class="feather icon-user mr-2"></i> Individual</a>
                        <a class="dropdown-item bg" href="#" onClick={()=>indvOrGrpFilter('grp')}><i class="feather icon-users mr-2"></i> Group</a>
                    </div>
                </div> */}
            </ul>

            <div class="tab-content" id="pills-tabContent">
                <div class="tab-pane fade show active" id="pills-home" role="tabpanel" aria-labelledby="pills-home-tab">
                    <div id={'scrollableCont' + activeTab} class="ovr-scr-y" style={{ height: '400px' }}>
                        {filteredContacts && filteredContacts.length > 0 ?
                            <InfiniteScroll
                                dataLength={current.length}
                                next={getMoreData}
                                hasMore={hasMore}
                                loader={<div class='al-center'><p class='white'>Loading</p></div>}
                                scrollableTarget={'scrollableCont' + activeTab}
                                style={current.length < 7 ? { height: '400px' } : {}}
                            >
                                {current && current.map((data, id) => (
                                    <ContactRow
                                        key={id}
                                        id={data.id}
                                        data={data}
                                        contactList={contactList}
                                        Class={!setVisibility(data, true) ? "opacity-50" : "lightgreen"}
                                        iconColor={setIconColor(data)}
                                        style={setVisibility(data)}
                                        type={data.subscriber_type}
                                        default={data.subscriber_type !== subscriberType['GROUP'] ? false : getCallieIdToShow(data.mcptt_id) ===  getCallieIdToShow(defaultGroupId)}
                                        inActiveCall={checkMcxIdISInRunningCall(data.mcptt_id)}
                                    />
                                ))}
                            </InfiniteScroll>
                            : null}
                        {filteredContacts && filteredContacts.length === 0 ?
                            <div
                                class="pt-6 pb-6 pr-6 pl-6 f-18 f-reg white"
                                style={{ height: '440px', display: 'flex', justifyContent: 'center', alignItems: 'center', whiteSpace: 'pre-wrap' }}
                            >{isSearch ? 'No match found' :
                                activeTab === 'fav' ? 'Oops! No favourites available\nLets "ADD TO FAVOURITE"' :
                                    activeTab === 'phonebook' ? 'Oops! No contacts available' :
                                        activeTab === 'emergency' ? 'Oops! No emergency contacts available' : ''}
                            </div>
                            : null}
                    </div>
                </div>
            </div>
        </div>
    )
}

const mapStateToProps = ({ communication }) => {
    const { contactList, defaultGroupId, groupCalls, individualCalls } = communication;
    return {
        contactList,
        defaultGroupId,
        groupCalls,
        individualCalls
    };
};

export default connect(mapStateToProps, {})(ContactListTable);
