import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux'
//Other
import { } from '../../modules/actions';
import SDSWidget from '../Widget/SDS_Widget';


const ForwardSDS = (props) => {
    // const [msgs, setMsgs] = useState([]);

    useEffect(() => {
    }, [])
    //functions

    const { data,closePrev } = props;
    return (
        <div class="wrap-3 border-2 m-t-10" style={{padding:'20px'}}>
             <div style={{height:'350px'}}>
                <div class="main-widg-grid">
                    <div class="widg-header">
                        <div class="title-grid-4">
                            {/* <div class="title1">
                                <p class="f-14 inter white">{data.fromId}</p>
                            </div> */}
                            <div class="search" onClick={()=>closePrev()}>
                                <i class="feather icon-x white f-24"></i>
                            </div>
                        </div>
                    </div>
                    <div class="widg-body">
                        <SDSWidget forward={true} msg={data} closeForwardView={()=>closePrev()}/>
                    </div>
                </div>
             </div>
        </div>
    )
}

const mapStateToProps = ({ train }) => {
    const { } = train;
    return {

    };
};

export default connect(mapStateToProps, {})(ForwardSDS);