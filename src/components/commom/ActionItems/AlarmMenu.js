import React, { useState,useEffect } from 'react'
import { connect } from 'react-redux'
import { Menu } from 'react-contexify';

//Other
import ContextItem from './ContextItem';
import { } from '../../../modules/actions';
import CommomAction from './CommomAction';


const AlarmMenu = (props) => {
    const [demo, setDemo] = useState('');

    //STYLE
    const submenustyle ={
        backgroundColor:'black',
        borderRadius:5,
        marginLeft:'5px',
        border:'0px'
    }
    //PROPS
    const { id,onClick,pin } = props;


    useEffect(() => {
    }, [])
    //functions

    return (
        <Menu id={id} style={{backgroundColor:'black',borderRadius:5,zIndex:3000}}>
           <span class="context-title gray-3 muli">Call Options</span>
           <div class='context-menu'>
                <CommomAction {...props}/>
                {/* <ContextItem iconClass={'icon-settings lime-4'} text={'Manage Group Settings'} onClick={onClick}/> */}
                <div class="context-divider"></div>
                <ContextItem iconClass={'dripicons-pin lime-4'} text={'Pin/unpin to Top'} onClick={pin}/>
           </div>
        </Menu>
    )
}

const mapStateToProps = ({ train }) => {
    const {  } = train;
    return {

    };
  };
  
export default connect(mapStateToProps, {  })(AlarmMenu);
