import React, { useState } from 'react'
import { connect } from 'react-redux'

import { contextMenu } from 'react-contexify';
//import 'react-contexify/dist/ReactContexify.min.css';
import "react-contexify/dist/ReactContexify.css";

//Other
import { } from '../../modules/actions';
import './style.css';
import { SdsMenu, AlarmMenu, PTTMenu, ActiveCallMenu, TrainStationMenu, DGNAMenu, DepoTrainsMenu, TDMenu, TDSMenu, TDGMenu } from './ActionItems';
import UserDetails from './userDetails';
import MenuQuickAction from './MenuQuickAction';


const ContextMenu = (props) => {
    const [show, setShow] = useState(false);
    const [showAction, setShowAction] = useState(false);
    const [actionType, setActionType] = useState('');
    // useEffect(() => {
    //     //code here
    //     //handleData()
    //     // console.log('DEMO FUNCTION COMPONENT',fetchAllLines,props)
    // }, [demo])
    //functions

    const onClick = ({ event, props }) => alert('Hey!');

    const submenustyle = {
        backgroundColor: 'black',
        borderRadius: 5,
        marginLeft: '5px',
        border: '0px'
    }

    const onHandleClick = (e) => {
        e.preventDefault();
        contextMenu.show({
            id: props.id,
            event: e,
        });
    }

    const onProcessBlockClick = (e) => {
        e.preventDefault();
    }

    const onItemSelect = (selected) => {
        if (props.type === 'DGNA') {
            switch (selected) {
                // case 'broadcastCall':
                case 'duplexCall':
                case 'sdsText':
                case 'sdsStatus':
                case 'emergency':
                    setShowAction(true);
                    setActionType(selected)
                    break;
                case 'editDgna':
                    props.onEdit();
                    break;
                case 'useDgna':
                    props.onUse();
                    break;
                case 'freeDgna':
                    props.onFree();
                    break;
                case 'exportDgna':
                    props.onExport();
                    break;
                default:
                    break;
            }
        }
        if (props.type === 'PTT') { }
        else {
            switch (selected) {
                case 'subDetails':
                    setShow(true);
                    break;
                case 'hookCall':
                case 'directCall':
                case 'broadcastCall':
                case 'duplexCall':
                case 'livePA':
                case 'predefinedPA':
                case 'sdsText':
                case 'sdsStatus':
                case 'groupCall':
                case 'emergency':
                    setShowAction(true);
                    setActionType(selected)
                    break;
                default:
                    break;
            }
        }
    }

    const getCallingId = () => {
        if (actionType === 'livePA') {
            return props.paId ? props.paId : ''
        } else if (actionType === 'predefinedPA') {
            return props.inactiveRadio ? props.inactiveRadio : props.subr
        }
        else {
            return props.subr
        }
    }

    return (
        <React.Fragment>
            {props.onProcessState ?
                <div class={props.Class ? props.Class : ''} onContextMenu={onProcessBlockClick} style={props.style ? props.style : {}}>
                    {props.children}
                </div> :
                props.clickOpen ?
                    <div class={props.Class ? props.Class : ''} onClick={onHandleClick} style={props.style ? props.style : {}}>
                        {props.children}
                    </div> :
                    <div class={props.Class ? props.Class : ''} onContextMenu={onHandleClick} style={props.style ? props.style : {}}>
                        {props.children}
                    </div>}

            {props.type === 'PTT' ? <PTTMenu id={props.id} type={props.type} onSelect={(i) => onItemSelect(i)} /> : null}
            {props.type === 'Alert' ? <AlarmMenu {...props} onSelect={(i) => onItemSelect(i)} /> : null}
            {props.type === 'SDS' ? <SdsMenu {...props} onSelect={(i) => onItemSelect(i)} /> : null}
            {props.type === 'AC' ? <ActiveCallMenu {...props} onSelect={(i) => onItemSelect(i)} /> : null}
            {props.type === 'TS' ? <TrainStationMenu {...props} onSelect={(i) => onItemSelect(i)} /> : null}
            {props.type === 'TD' ? <TDMenu {...props} onSelect={(i) => onItemSelect(i)} /> : null}
            {props.type === 'TDS' ? <TDSMenu {...props} onSelect={(i) => onItemSelect(i)} /> : null}
            {props.type === 'TDG' ? <TDGMenu {...props} onSelect={(i) => onItemSelect(i)} /> : null}
            {props.type === 'DGNA' ? <DGNAMenu {...props} onSelect={(i) => onItemSelect(i)} /> : null}
            {props.type === 'DT' ? <DepoTrainsMenu {...props} onSelect={(i) => onItemSelect(i)} /> : null}
            {show ?
                <UserDetails
                    open={show}
                    closeModal={(v) => setShow(v)}
                    type={'SUB'}
                    id={props.inactiveRadio ? props.inactiveRadio : props.subr}
                /> : null}
            {showAction ?
                <MenuQuickAction
                    open={showAction}
                    closeModal={(v) => setShowAction(v)}
                    type={actionType}
                    id={getCallingId()}
                    routeName={props.routeName ? props.routeName : ''}
                    isFACall={props.isFACall ? props.isFACall : false}
                />
                : null}
        </React.Fragment>
    )
}

const mapStateToProps = (state) => {
    const { } = state;
    return {
    };
};

export default connect(mapStateToProps, {})(ContextMenu);