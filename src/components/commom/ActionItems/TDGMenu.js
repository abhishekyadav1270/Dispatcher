import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux'
import { Menu, Submenu } from 'react-contexify';
//Other
import ContextItem from './ContextItem';
import { } from '../../../modules/actions';


const TDGMenu = (props) => {

    //PROPS
    const { id, onSelect } = props;

    //STYLE
    const submenustyle = {
        backgroundColor: 'black',
        borderRadius: 5,
        marginLeft: '5px',
        border: '0px'
    }

    return (
        <Menu id={id} style={{ backgroundColor: 'black', borderRadius: 5, zIndex: 3000 }}>
            <Submenu label={<ContextItem submenu={true} iconClass={'icon-phone-call'} text={'Call'} />} style={submenustyle} className='context-submenu1'>
                <ContextItem iconClass={'icon-phone-incoming'} text={'Group Call'} onClick={() => onSelect('groupCall')} />
                <ContextItem iconClass={'icon-phone-forwarded'} text={'Broadcast Call'} onClick={() => onSelect('broadcastCall')} />
            </Submenu>
            <Submenu label={<ContextItem submenu={true} iconClass={'icon-message-square'} text={'Message'} />} style={submenustyle} className='context-submenu1'>
                <ContextItem iconClass={'icon-mail'} text={'Status SDS'} onClick={() => onSelect('sdsStatus')} />
                <ContextItem iconClass={'icon-mail'} text={'Text SDS'} onClick={() => onSelect('sdsText')} />
            </Submenu>
        </Menu>
    )
}

export default TDGMenu;
