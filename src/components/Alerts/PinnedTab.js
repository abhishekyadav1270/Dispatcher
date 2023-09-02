import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux'

import AlertCard from './AlertCard';

const PinnedTab = ({statuses,groupStatuses}) => {
    const [pinnedAlerts, setPinnedAlerts] = useState([]);

    useEffect(() => {
        getPinnedTab()
     }, [statuses,groupStatuses])

    const getPinnedTab =()=>{
        const filterAlerts = [...statuses,...groupStatuses].filter(alert=> alert.pinned);
        setPinnedAlerts(filterAlerts)
    }

    return (
        <React.Fragment>
        <p class="f-subs-name white m-b-10" style={{ alignSelf:'center'}}>Pinned Alerts</p>
        <div class="a1-grid ovr-scr-y" style={pinnedAlerts.length>7?{height:'242px'}:{}}>
            {pinnedAlerts && pinnedAlerts.map(alert=>{
            return(<AlertCard data={alert} key={alert.id+Math.random(3)}/>)
            })}
        </div>
        </React.Fragment>
    )
}

const mapStateToProps = ({ alarm,auth }) => {
    const { statuses, groupStatuses } = alarm;
    const { user } = auth;
    return {
        statuses,
        groupStatuses,
        user
    };
};

export default connect(mapStateToProps, {})(PinnedTab)
