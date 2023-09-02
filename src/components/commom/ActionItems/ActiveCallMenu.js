import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux'
import { Menu } from 'react-contexify';

//Other
import ContextItem from './ContextItem';
import { } from '../../../modules/actions';
import CommomAction from './CommomAction';
import { supportedMasterPTT, supportedPatchCallType ,supportedMergeCallType} from '../../../constants/constants';
import { getCallieIdToShow } from '../../../utils/lib';

const ActiveCallMenu = (props) => {
    const [patchSupported, setPatchSupport] = useState(false);
    const [mergeSupported, setMergeSupport] = useState(false);
    const [MpttSupported, setPTTSupport] = useState(false);

    //PROPS
    const { id, onClick, setMptt, setCurrent, subr, callType, initPatch, patchEnabled, addToPatch, patchCalls, user, individualCalls, configPatchCall,configMergeCall, initMerge, mergeCalls, addToMerge, mergeEnabled } = props;
    const isPatchable = individualCalls && individualCalls.length > 1 && individualCalls.filter(call => call.callType === callType).length > 1;
    const isMergable = individualCalls && individualCalls.length > 1 && individualCalls.filter(call => call.callType === callType).length > 1;

    useEffect(() => {
        // console.log('AC MENU',props);
        if (configPatchCall) {
            if (supportedPatchCallType.includes(callType)) setPatchSupport(true);
            if (supportedMasterPTT.includes(callType)) setPTTSupport(true);
        }
        if(configMergeCall){
            if (supportedMergeCallType.includes(callType)) setMergeSupport(true);
        }
    }, [callType])
    //functions

    const patchWith = patchCalls && patchCalls.length > 0 ? patchCalls[0].fromId === (user && user.profile.mcptt_id) ? patchCalls[0].toId : patchCalls[0].fromId : null;
    const isPatched = patchWith && patchWith === subr;

    const mergeWith = mergeCalls && mergeCalls.length > 0 ? mergeCalls[0].fromId === (user && user.profile.mcptt_id) ? mergeCalls[0].toId : mergeCalls[0].fromId : null;
    const isMerged = mergeWith && mergeWith === subr;
    return (
        <Menu id={id} style={{ backgroundColor: 'black', borderRadius: 5, zIndex: 3000 }}>
            <span class="context-title gray-3 muli">Call Options</span>
            <div class='context-menu'>
                <CommomAction {...props} />
                {MpttSupported ? <ContextItem iconClass={'icon-settings lime-4'} text={'Master PTT'} onClick={setMptt} /> : null}
                {/* <ContextItem iconClass={'icon-settings lime-4'} text={'Manage Group Settings'} onClick={onClick}/> */}
                <ContextItem iconClass={'icon-zap lime-4'} text={'Set as Current call'} onClick={setCurrent} />
                <div class="context-divider"></div>
                {patchSupported && props.disableCallPatchMerge == false ?
                    <ContextItem
                        iconClass={'icon-git-merge yellow'}
                        text={patchEnabled ? `Patch with ${getCallieIdToShow(patchWith)}` : 'Patch Call'}
                        onClick={patchEnabled ? addToPatch : initPatch}
                        Style={(isPatchable && !isPatched) ? {} : { pointerEvents: 'none', opacity: '0.5' }}
                    /> : null}
                {mergeSupported && props.disableCallPatchMerge == false ?    
                    <ContextItem
                            iconClass={'icon-git-merge yellow'}
                            text={mergeEnabled ? `Merge with ${getCallieIdToShow(mergeWith)}` : 'Merge Call'}
                            onClick={mergeEnabled ? addToMerge : initMerge}
                            Style={(isMergable && !isMerged) ? {} : { pointerEvents: 'none', opacity: '0.5' }}
                        />:null}
                {/* <ContextItem iconClass={'icon-star yellow'} text={'Add/Remove Favourites'} onClick={onClick}/> */}
                {/* <div class="context-divider"></div> */}
                {/* <ContextItem iconClass={'dripicons-pin lime-4'} text={'Pin/unpin to Top'} onClick={onClick}/> */}
            </div>
        </Menu>
    )
}

const mapStateToProps = ({ auth, communication, enablePatchCall, enableMergeCall }) => {
    const { user } = auth;
    const { initPatch, patchCalls, mergeCalls, initMerge, individualCalls } = communication;
    const patchEnabled = initPatch;
    const mergeEnabled = initMerge;
    const { configPatchCall } = enablePatchCall
    const { configMergeCall } = enableMergeCall
    return {
        patchEnabled, patchCalls, user, individualCalls, configPatchCall,configMergeCall, mergeCalls, mergeEnabled
    };
};

export default connect(mapStateToProps, {})(ActiveCallMenu);
