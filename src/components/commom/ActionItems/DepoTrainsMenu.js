import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux'
import { Menu } from 'react-contexify';

//Other
import ContextItem from './ContextItem';
import { } from '../../../modules/actions';
import CommomAction from './CommomAction';


const DepoTrainsMenu = (props) => {
    const [demo, setDemo] = useState('');

    //PROPS
    const { id, onSelect } = props;


    useEffect(() => {
    }, [])
    //functions

    return (
        <Menu id={id} style={{ backgroundColor: 'black', borderRadius: 5, zIndex: 3000 }}>
            <span class="context-title gray-3 muli">Call Options</span>
            <div class='context-menu'>
                <CommomAction {...props} />
                {/* <ContextItem iconClass={'icon-phone-incoming'} text={'Live PA'} onClick={() => onSelect('livePA')} />
                <div class="context-divider"></div>
                <ContextItem iconClass={'icon-user-check lime-4'} text={'Subscriber Details'} onClick={() => onSelect('subDetails')} /> */}
            </div>
        </Menu>
    )
}

const mapStateToProps = ({ train }) => {
    const { } = train;
    return {

    };
};

export default connect(mapStateToProps, {})(DepoTrainsMenu);
