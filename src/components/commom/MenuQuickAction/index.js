import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux'

//Other
import CustomModal from '../CustomModal';
import SdsQuickAction from './SDS'
import CallsQuickAction from './Calls'
import { RenderIcon, setIconColor, getCallieIdToShow } from '../../../utils/lib';
import { domain, subscriberStatus, subscriberType } from '../../../constants/constants';
import { showMessage } from '../../../modules/alerts';

const QuickAction = (props) => {
    const [subData, setSubData] = useState(null);
    const [modalSmall, setModalSmall] = useState(false);
    const [isCallType, setType] = useState(null);

    //PROPS
    const {
        type,
        contactList,
        id,
        open,
        closeModal,
        showMessage,
        configDomain
    } = props;

    useEffect(() => {
        try {
            if (props.routeName && props.routeName === 'trn') {
                let subDetail = {
                    'mcptt_id': id.toString(),
                    'subscriber_type' : 'INDIVIDUAL'
                }
                if (props.isFACall) {
                    subDetail.isFACall = true
                } 
                console.log('isFACall started...',subDetail)
                setSubData(subDetail)
                setType(true)
            } else if (props.routeName && props.routeName === 'trnGrp') {
                let subDetail = {
                    'mcptt_id': id.toString(),
                    'subscriber_type' : 'GROUP'
                }
                setSubData(subDetail)
                setType(true)
            } else {
                if (contactList && contactList.length > 0) {
                    const subDetails = contactList.filter(cont =>
                        getCallieIdToShow(cont.mcptt_id) == getCallieIdToShow(id)
                    );
                    console.log('USER QUICKACTION', subDetails, id.toString())
                    if (subDetails && subDetails.length === 0) {
                        showMessage({ header: 'Subscriber', content: 'Oops! Could not fetch details. Try again.', type: 'error' })

                    }
                    else {
                        const subr = subDetails[0]
                        if (subr.Reg_status === subscriberStatus['REGISTERED'] || subr.subscriber_type === subscriberType['GROUP']) {
                            setSubData(subDetails[0]);
                            setType(false)
                            if (type.includes('Call') || type.includes('livePA')) setType(true)
                        }
                        else showMessage({ header: 'Subscriber', content: 'Oops! Subscriber is not registered. Please try again after some time.', type: 'error' })
                    }
                }
                else {
                    showMessage({ header: 'Subscriber', content: 'Oops! Could not fetch details. Try again.', type: 'error' })
                }
            }
        }
        catch (e) {
            console.log(e);
        }
    }, [type])
    //functions

    const getType = (type) => {
        switch (type) {
            case 'hookCall':
                return 'HOOK CALL';
            case 'directCall':
                return 'DIRECT CALL';
            case 'broadcastCall':
                return 'BROADCAST CALL';
            case 'duplexCall':
                return 'DUPLEX CALL';
            case 'groupCall':
                return 'GROUP CALL';
            case 'livePA':
                return 'LIVE PUBLIC ANOUNCEMENT';
            case 'predefinedPA':
                return 'PREDEFINED PUBLIC ANOUNCEMENT';
            case 'sdsText':
                return 'SDS TEXT MESSAGE';
            case 'sdsStatus':
                return 'SDS STATUS';
            case 'emergency':
                return 'EMERGENCY';
            default:
                return 'HEADER';
        }
    }

    const renderDetails = (type) => {
        switch (type) {
            case 'livePA':
                // return <SdsQuickAction close={closeModal} sdsType={'LivePA'} sub={subData}/>
                //console.log('train tab routeName', props.routeName, props)
                if (props.routeName && props.routeName === 'stn') {
                    //console.log('train tab routeName inside', props.routeName)
                    return <CallsQuickAction close={closeModal} callType={'LivePAStn'} prior={"MEDIUM"} sub={subData}>{getUserTitle()}</CallsQuickAction>;
                } else {
                    //console.log('train tab routeName outside', props.routeName)
                    return <CallsQuickAction close={closeModal} callType={'LivePA'} prior={"MEDIUM"} sub={subData}>{getUserTitle()}</CallsQuickAction>;
                }
            case 'predefinedPA':
                return <SdsQuickAction close={closeModal} sdsType={'PA'} sub={subData} />
            case 'sdsText':
                return <SdsQuickAction close={closeModal} sdsType={'Text'} sub={subData} />
            case 'sdsStatus':
                return <SdsQuickAction close={closeModal} sdsType={'Status'} sub={subData} />
            case 'hookCall':
                return <CallsQuickAction close={closeModal} callType={'simplexHook'} sub={subData}>{getUserTitle()}</CallsQuickAction>;
            case 'directCall':
                return <CallsQuickAction close={closeModal} callType={'simplexDirect'} sub={subData}>{getUserTitle()}</CallsQuickAction>;
            case 'duplexCall':
                return <CallsQuickAction close={closeModal} callType={'duplex'} sub={subData}>{getUserTitle()}</CallsQuickAction>;
            case 'groupCall':
                if (props.routeName && props.routeName === 'trn') {
                    let groupId = subData.mcptt_id 
                    let dir = 'UP'
                    if (subData.mcptt_id) {
                        let idds = subData.mcptt_id.split('-')
                        if (idds.length > 2) {
                            groupId = idds[2]
                            dir = idds[3]
                        }
                    }
                    let mcxDomain = ''
                    if (configDomain && configDomain.mcxDomain && configDomain.mcxDomain.length > 0) {
                        mcxDomain = configDomain.mcxDomain
                    }
                    let grpId = `${groupId}-${dir}@${mcxDomain}`
                    let modifiedData = {
                        'mcptt_id': grpId,
                        'subscriber_type' : 'GROUP'
                    }
                    return <CallsQuickAction close={closeModal} callType={'groupCall'} sub={modifiedData}>{getUserTitle()}</CallsQuickAction>;
                } else {
                    return <CallsQuickAction close={closeModal} callType={'groupCall'} sub={subData}>{getUserTitle()}</CallsQuickAction>;
                }
            case 'broadcastCall':
                if (props.routeName && props.routeName === 'trn') {
                    let groupId = subData.mcptt_id 
                    let dir = 'UP'
                    if (subData.mcptt_id) {
                        let idds = subData.mcptt_id.split('-')
                        if (idds.length > 2) {
                            groupId = idds[2]
                            dir = idds[3]
                        }
                    }
                    let mcxDomain = ''
                    if (configDomain && configDomain.mcxDomain && configDomain.mcxDomain.length > 0) {
                        mcxDomain = configDomain.mcxDomain
                    }
                    let grpId = `${groupId}-${dir}@${mcxDomain}`
                    let modifiedData = {
                        'mcptt_id': grpId,
                        'subscriber_type' : 'GROUP'
                    }
                    return <CallsQuickAction close={closeModal} callType={'broadcast'} prior={"MEDIUM"} sub={modifiedData}>{getUserTitle()}</CallsQuickAction>;
                } else {
                    return <CallsQuickAction close={closeModal} callType={'broadcast'} prior={"MEDIUM"} sub={subData}>{getUserTitle()}</CallsQuickAction>;
                }
            case 'emergency':
                return null;
            default:
                return null;
        }
    }

    const getUserTitle = () => {
        return (
            <div class="title-modal">
                <div class="m-icon">
                    {RenderIcon(subData.subscriber_type, setIconColor(subData))}
                </div>
                <div class="m-name">
                    <span class="f-contact-name black blc">{subData.contactName}</span>
                    <span class="f-subs-id black blc">{getCallieIdToShow(subData.mcptt_id)}</span>
                </div>
            </div>
        )
    }


    return (
        <React.Fragment>
            {(subData && !isCallType) ?
                <CustomModal
                    open={open}
                    size={modalSmall ? 'sm' : null}
                    handleClose={(x) => closeModal(x)}
                    header={'Subscriber Details'}
                    headerTitle={
                        <div class="fav-card-grid">
                            <div class="c2-subname" style={{ display: 'flex', alignItems: 'center' }}>
                                <div class="f-pop-text m-l-10" style={{ marginLeft: '10px' }}>{getType(type)}</div>
                            </div>
                            <div class="c2-subid">
                                {getUserTitle()}
                            </div>
                            <div class="c2-icon"></div>
                        </div>
                    }
                    body={renderDetails(type)}
                /> : null}
            {(subData && isCallType) ?
                <CustomModal
                    open={open}
                    size={'sm'}
                    handleClose={(x) => closeModal(x)}
                    header={'Subscriber Details'}
                    headerTitle={
                        <div class="fav-card-grid m-t-5 m-b-5 m-l-5">
                            <div class="c2-subname" style={{ display: 'flex', alignItems: 'center' }}>
                                <div class="f-pop-text m-l-10">{getType(type)}</div>
                            </div>
                        </div>
                    }
                    body={renderDetails(type)}
                /> : null}
        </React.Fragment>
    )
}

const mapStateToProps = ({ communication, domains }) => {
    const { contactList } = communication;
    const { configDomain } = domains;
    return {
        contactList,
        configDomain
    };
};

export default connect(mapStateToProps, { showMessage })(QuickAction);