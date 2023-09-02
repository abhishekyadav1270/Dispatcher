import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux'
import { Menu, Submenu } from 'react-contexify';
//Other
import ContextItem from './ContextItem';
import { } from '../../../modules/actions';


const TDSMenu = (props) => {

    //PROPS
    const { id, onSelect } = props;

    //STYLE
    const submenustyle = {
        backgroundColor: 'black',
        borderRadius: 5,
        marginLeft: '5px',
        border: '0px'
    }

    useEffect(() => {
    }, [])
    //functions

    return (
        <Menu id={id} style={{ backgroundColor: 'black', borderRadius: 5, zIndex: 3000 }}>
            <Submenu label={<ContextItem submenu={true} iconClass={'icon-phone-call'} text={'Call'} />} style={submenustyle} className='context-submenu1'>
                <ContextItem iconClass={'icon-phone-incoming'} text={'Hook Call'} onClick={() => onSelect('hookCall')} />
                <ContextItem iconClass={'icon-phone-forwarded'} text={'Direct Call'} onClick={() => onSelect('directCall')} />
                <ContextItem iconClass={'icon-phone-call'} text={'Duplex Call'} onClick={() => onSelect('duplexCall')} />
                <ContextItem iconClass={'icon-phone-call'} text={'Group Call'} onClick={() => onSelect('groupCall')} />
            </Submenu>
            <Submenu label={<ContextItem submenu={true} iconClass={'icon-message-square'} text={'Message'} />} style={submenustyle} className='context-submenu1'>
                <ContextItem iconClass={'icon-mail'} text={'Status SDS'} onClick={() => onSelect('sdsStatus')} />
                <ContextItem iconClass={'icon-mail'} text={'Text SDS'} onClick={() => onSelect('sdsText')} />
            </Submenu>
        </Menu>
    )
}

export default TDSMenu;
