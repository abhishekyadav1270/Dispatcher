import React, { useState,useEffect } from 'react'
import { connect } from 'react-redux'
import { Menu } from 'react-contexify';

//Other
import ContextItem from './ContextItem';
import { } from '../../../modules/actions';


const DGNAMenu = (props) => {
    const [demo, setDemo] = useState('');

    //PROPS
    const { id,onSelect,attached } = props;


    useEffect(() => {
    }, [])
    //functions

    return (
        <Menu id={id} style={{backgroundColor:'black',borderRadius:5,zIndex:3000}}>
           <span class="context-title gray-3 muli">DGNA Options</span>
           <div class='context-menu'>
               {attached?
                <React.Fragment>
                    <ContextItem iconClass={'icon-phone-call'} text={'Voice Call'} onClick={()=>onSelect('groupCall')}/>
                        {/* <ContextItem iconClass={'icon-alert-circle red-5'} text={'Emergency Call'} onClick={()=>onSelect('emergency')}/> */}
                        <ContextItem iconClass={'icon-message-square'} text={'Send SDS'} onClick={()=>onSelect('sdsText')}/>
                        <ContextItem iconClass={'icon-alert-triangle'} text={'Send Alerts'} onClick={()=>onSelect('sdsStatus')}/>
                        <div class="context-divider"></div>
                        <ContextItem iconClass={'icon-trash-2 context-icon'} text={'Delete DGNA'} onClick={()=>onSelect('freeDgna')}/>
                        <ContextItem iconClass={'icon-edit context-icon'} text={'Edit DGNA'} onClick={()=>onSelect('editDgna')}/>
                        {/* <ContextItem iconClass={'icon-upload context-icon'} text={'Export as userlist'} onClick={()=>onSelect('exportDgna')}/> */}
                </React.Fragment>
                :<ContextItem iconClass={'icon-edit context-icon'} text={'Use DGNA'} onClick={()=>onSelect('useDgna')}/>}
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
