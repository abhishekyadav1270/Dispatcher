import React, { useState,useEffect } from 'react'
import { connect } from 'react-redux'
import { Menu } from 'react-contexify';

//Other
import ContextItem from './ContextItem';
import { } from '../../../modules/actions';


const DGNAMenu = (props) => {
    const [demo, setDemo] = useState('');

    //PROPS
    const { id,onClick } = props;


    useEffect(() => {
    }, [])
    //functions

    return (
        <Menu id={id} style={{backgroundColor:'black',borderRadius:5,zIndex:3000}}>
           <span class="context-title gray-3 muli">Call Options</span>
           <div class='context-menu'>
                <ContextItem iconClass={'icon-phone-call'} text={'Voice Call'} onClick={onClick}/>
                <ContextItem iconClass={'icon-alert-circle'} text={'Emergency Call'} onClick={onClick}/>
                <ContextItem iconClass={'icon-lock'} text={'Send SDS'} onClick={onClick}/>
                <ContextItem iconClass={'icon-lock'} text={'Send Alerts'} onClick={onClick}/>
                <div class="context-divider"></div>
                <ContextItem iconClass={'icon-lock'} text={'Edit DGNA'} onClick={onClick}/>
           </div>
        </Menu>
    )
}

const mapStateToProps = ({ train }) => {
    const {  } = train;
    return {

    };
  };
  
export default connect(mapStateToProps, {  })(DGNAMenu);
