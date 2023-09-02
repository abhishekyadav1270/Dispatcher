import React, { Component } from 'react'
import { connect } from 'react-redux'

import TrainQUickLinks from '../Train/TrainQUickLinks'
import { SearchCollapse,AlertsQuickLink, ActiveIndvcallQuicklinks, ActiveGrpCallQuickLinks } from '../../components/commom';

export const Title = (props) => {
    return (
        <div class={props.class?props.class:''}>
            {props.type ==='none'?
            <div class="title-grid-1">
                <div class="title">
                    <div class="pt-6 pb-6 pr-6 pl-6 f-18 f-reg white muli">{ props.title }</div>
                </div>
            </div>:null}

            {props.type !=='none'?
            <div class="title-grid-2">
                <div class="title">
                    <div class="pt-6 pb-6 pr-6 pl-6 f-18 f-reg white">{ props.title }</div>
                </div>
                <div class="search">
                    {props.type==='AGC'?<ActiveGrpCallQuickLinks search={props.search}/>:null}
                    {props.type==='AIC'?<ActiveIndvcallQuicklinks search={props.search}/>:null}
                    {props.type==='collapseLog'?
                        <SearchCollapse 
                            search={props.search}
                            filtr={props.filtrTab}
                            log={true}
                            active={props.active}
                            refresh={props.refresh}
                        />:null}
                    {props.type==='collapseSDS'?
                        <SearchCollapse 
                            search={props.search}
                            sds={true}
                            refresh={props.refresh}
                            {...props}
                        />:null}
                    {props.type==='collapseCont'?
                        <SearchCollapse 
                            search={props.search}
                            indvGrp={props.indvGrp}
                            contactList={true}
                            active={props.active}
                        />:null}
                    {props.type==='TD'?<TrainQUickLinks search={props.search}/>:null}
                    {props.type==='Alerts'?<AlertsQuickLink search={props.search}/>:null}
                </div>
            </div>:null}
        </div>
    )
}

const mapStateToProps = (state) => ({

})

const mapDispatchToProps = {

}

export default connect(mapStateToProps, mapDispatchToProps)(Title)
