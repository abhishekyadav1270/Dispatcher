import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux'

//Other
import { IncomingCallCard, IncomingCAD } from '.';
// import user from '../../modules/user';
import { Title } from '../commom/Title';
import { setIndvdCallCount } from '../../modules/communication';

const IncomingCalls = ({ individualCalls, groupCalls, user, CADcalls,setIndvdCallCount }) => {
    const [incomingCalls, setIncomingCalls] = useState('');

    useEffect(() => {
        const incoming = [...individualCalls]
            .filter(call => (call.stateType === 'PERSISTED' || call.stateType === 'WAITING') && parseInt(call.callPriority) !== 15 && (call.toId === (user && user.profile.mcptt_id)))
            .sort((a, b) => new Date(b.created) - new Date(a.created));
            
        setIncomingCalls(incoming);
        setIndvdCallCount(incoming.length)
        console.log('CALL INCOMING', incoming, user, individualCalls)
    }, [individualCalls])

    //functions

    return (
        <React.Fragment>
           
            <div style={{position: 'sticky',top: '0'}}> 
                <Title title="Incoming Calls" type="none" />
            </div>
            <div className='ovr-scr-y' style={{ maxHeight: "calc(100% - 30px)",position:"relative"}}>
            {incomingCalls && incomingCalls.map((call, id) => {
                return (
                    <IncomingCallCard
                        data={call}
                        key={id}
                    />
                )
            })}
            {CADcalls.length > 0 && CADcalls.map((call, id) => {
                return (
                    <IncomingCAD
                        data={call}
                        key={id}
                    />
                )
            })}
            </div>
        </React.Fragment>
    )
}

const mapStateToProps = ({ communication, auth, other }) => {
    const { individualCalls, groupCalls } = communication;
    const { user } = auth;
    const { CADcalls } = other;

    return {
        individualCalls,
        groupCalls,
        user,
        CADcalls
    };
};

export default connect(mapStateToProps, {setIndvdCallCount})(IncomingCalls);
