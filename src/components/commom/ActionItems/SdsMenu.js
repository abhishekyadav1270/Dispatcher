import React, { useState,useEffect } from 'react'
import { connect } from 'react-redux'
import { Menu } from 'react-contexify';

//Other
import ContextItem from './ContextItem';
import { } from '../../../modules/actions';
import CommomAction from './CommomAction';


const SdsMenu = (props) => {
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
                <CommomAction {...props}/>
           </div>
        </Menu>
    )
}

const mapStateToProps = ({ train }) => {
    const {  } = train;
    return {

    };
  };
  
export default connect(mapStateToProps, {  })(SdsMenu);
