import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux'
import { Submenu, contextMenu } from 'react-contexify';

//Other
import ContextItem from './ContextItem';
import { } from '../../../modules/actions';

const CommonAction = (props) => {
    // const [show, setShow] = useState(false);

    //STYLE
    const submenustyle = {
        backgroundColor: 'black',
        borderRadius: 5,
        marginLeft: '5px',
        border: '0px'
    }
    //PROPS
    const { onClick, subr, onSelect } = props;


    useEffect(() => {
        // console.log('COMMON',props)
    }, [])
    //functions

    return (
        <React.Fragment>
            <Submenu label={<ContextItem submenu={true} iconClass={'icon-phone-call'} text={'Call'} />} style={submenustyle} className='context-submenu1'>
                <ContextItem iconClass={'icon-phone-incoming'} text={'Hook Call'} onClick={() => onSelect('hookCall')} />
                <ContextItem iconClass={'icon-phone-forwarded'} text={'Direct Call'} onClick={() => onSelect('directCall')} />
                <ContextItem iconClass={'icon-phone'} text={'Broadcast Call'} onClick={() => onSelect('broadcastCall')} />
                <ContextItem iconClass={'icon-phone-call'} text={'Duplex Call'} onClick={() => onSelect('duplexCall')} />
            </Submenu>
            <Submenu label={<ContextItem submenu={true} iconClass={'icon-message-square'} text={'Message'} />} style={submenustyle} className='context-submenu1'>
                <ContextItem iconClass={'icon-mail'} text={'Status SDS'} onClick={() => onSelect('sdsStatus')} />
                {/* <ContextItem iconClass={'icon-mail'} text={'Predefined SDS'} onClick={onClick}/> */}
                <ContextItem iconClass={'icon-mail'} text={'Text SDS'} onClick={() => onSelect('sdsText')} />
            </Submenu>
            <Submenu label={<ContextItem submenu={true} iconClass={'icon-message-square'} text={'Public Announcement'} />} style={submenustyle} className='context-submenu1'>
                <ContextItem iconClass={'icon-phone-incoming'} text={'Live PA'} onClick={() => onSelect('livePA')} />
                <ContextItem iconClass={'icon-phone-forwarded'} text={'Predefined PA'} onClick={() => onSelect('predefinedPA')} />
            </Submenu>
            {/* <ContextItem iconClass={'icon-alert-triangle yellow'} text={'Send Alerts'} onClick={()=>onSelect('sdsText')}/>
                <div class="context-divider"></div> */}
            {/* <ContextItem iconClass={'icon-alert-circle red-5'} text={'Emergency'} onClick={()=>onSelect('emergency')}/> */}
            <div class="context-divider"></div>
            <ContextItem iconClass={'icon-user-check lime-4'} text={'Subscriber Details'} onClick={() => onSelect('subDetails')} />
        </React.Fragment>
    )
}

const mapStateToProps = ({ train }) => {
    const { } = train;
    return {

    };
};

export default connect(mapStateToProps, {})(CommonAction);
