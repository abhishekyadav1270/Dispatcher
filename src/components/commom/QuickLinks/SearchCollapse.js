import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import {Tooltip, OverlayTrigger } from 'react-bootstrap'

import {  } from "../../../utils/lib"
import './styles.css'

//Other files

const propTypes = {
    propData: PropTypes.array
}

const SearchCollapse = (props) => {
    
    const [seen1, setSeen1] = useState(true);
    const [seen2, setSeen2] = useState(false);
    const [serchText, setSearchText] = useState('');

    const { search, data, contactList,phoneBook,indvGrp,sds,log,filtr,active } = props;

    // useEffect(() => {
    //     console.log('UPDT',serchText)
    //     search(serchText)
    // }, [phoneBook])

    const collapse = () => {
        setSeen1(!seen1);
        setSeen2(!seen2)
        search('');
    }

    const searchEntered = (text) =>{
        setSearchText(text)
        search(text);
    }

        return (
            <div class="flt-l">
                {seen1 ?
                <div class="in-blc">
                    {contactList?
                    <React.Fragment>
                        {/* <FilterButton iconClass={'feather icon-database f-16 text-success'} filtr={indvGrp} info={'TETRA'} type={'tetra'} active={active}/> */}
                        <FilterButton iconClass={'feather icon-user mr-2'} filtr={indvGrp} info={'Individual'} type={'indv'} active={active}/>
                        <FilterButton iconClass={'feather icon-users mr-2'} filtr={indvGrp} info={'Group'} type={'grp'} active={active}/>
                    </React.Fragment>
                    :null
                    // <React.Fragment>
                    //     <button class="sq-icon-btn in-blc wx32"><i class="feather icon-phone-incoming f-16"></i></button>
                    //     <button class="sq-icon-btn in-blc wx32"><i class="feather icon-mail f-16"></i></button>
                    //     <button class="sq-icon-btn in-blc wx32"><i class="feather icon-alert-circle f-16"></i></button>
                    // </React.Fragment>
                    }
                    {log?
                     <React.Fragment>
                        <FilterButton iconClass={'feather icon-refresh-cw mr-2 text-success'}filtr={filtr} info={'Refresh'} type={0} active={active}/>
                        <FilterButton iconClass={'feather icon-phone'} filtr={filtr} info={'Calls'} type={1} active={active}/>
                        <FilterButton iconClass={'feather icon-mail mr-2'} filtr={filtr} info={'SDS'} type={2} active={active}/>
                        {/* <FilterButton iconClass={'feather icon-alert-triangle mr-2'} filtr={filtr} info={'Alerts'} type={3} active={active}/> */}
                        {/* <FilterButton iconClass={'feather icon-database'} filtr={filtr} info={'All'} type={4} active={active}/> */}
                        <FilterButton iconClass={'feather icon-download'} filtr={filtr} info={'Export'} type={5} active={active}/> 

                    </React.Fragment>
                    :null}
                    {sds?
                    <React.Fragment>
                        <FilterButton iconClass={'feather icon-refresh-cw mr-2 text-success'}filtr={filtr} info={'Refresh'} type={0} active={active}/>
                    </React.Fragment>
                    :null}
                    {contactList?
                        <button class="sq-icon-btn in-blc m-r-5 wx32"  onClick={collapse} type="button" id=""><i class="fa fa-search f-16"> </i></button>
                    :null}
                    {log?
                        <button class="sq-icon-btn in-blc m-r-5 wx32"  onClick={collapse} type="button" id=""><i class="fa fa-search f-16"> </i></button>
                    :null}
                </div> : null}

                {seen2 ?
                     <div class="input-group in-blc">
                        <input 
                            type="text"  
                            class="textinput searchinput w80 in-blc" 
                            autoFocus
                            placeholder="Search" 
                            aria-label="Search" 
                            aria-describedby="button-addon2"
                            onChange={(e)=> searchEntered(e.target.value)}
                        />
                        <button class="btnsearch in-blc" onClick={collapse} type="submit" id="button-addon2">
                            <i class="feather icon-chevron-right"> </i>
                        </button>
                    </div> : null}
            </div>
        )
}

const FilterButton = (props) => {
    const { info, filtr, btnClass, iconClass,type, active } = props;
    const filtrType= info==='TETRA'?'tetra':info==='Individual'?'indv':'grp';
    return (
        <OverlayTrigger
            placement="bottom"
            delay={{ show: 250, hide: 400 }}
            overlay={renderTooltip({ info: info})}
        >
            <button class={btnClass?btnClass:"sq-icon-btn in-blc wx32 "+(active===type?'active':'')} onClick={()=> filtr(type)}>
                <i class={iconClass}></i>
            </button>
        </OverlayTrigger>
    )
}
const renderTooltip = (props) => (
    <Tooltip id="button-tooltip" {...props}>
        {props.info}
    </Tooltip>
);

const mapStateToProps = ({ communication }) => {
    // const { contactList } = communication;
    return {
        // phoneBook: contactList
    };
  };

const mapDispatchToProps = dispatch => bindActionCreators({
}, dispatch)

SearchCollapse.propTypes = propTypes

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(SearchCollapse)