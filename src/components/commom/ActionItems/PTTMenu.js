import React, { useState,useEffect } from 'react'
import { connect } from 'react-redux'
import { Menu } from 'react-contexify';

//Other
import ContextItem from './ContextItem';
import { } from '../../../modules/actions';


const PTTMenu = (props) => {
    const [demo, setDemo] = useState('');

    //PROPS
    const { id,onClick } = props;


    useEffect(() => {
    }, [])
    //functions

    return (
        <Menu id={id} style={{backgroundColor:'black',borderRadius:5,zIndex:3000}}>
           <span class="context-title gray-3 muli">PTT Options</span>
           <div class='context-menu'>
                <ContextItem iconClass={'icon-lock'} text={'Lock/Unlock PTT'} onClick={onClick}/>
                <ContextItem iconClass={'icon-arrow-up-circle'} text={'Increase Priority'} onClick={onClick}/>
                <ContextItem iconClass={'icon-alert-circle red-5'} text={'Emergency'} onClick={onClick}/>
           </div>
        </Menu>
    )
}

const mapStateToProps = ({ train }) => {
    const {  } = train;
    return {

    };
  };
  
export default connect(mapStateToProps, {  })(PTTMenu);
