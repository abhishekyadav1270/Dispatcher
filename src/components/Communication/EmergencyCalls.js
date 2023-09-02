import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux'

//Other
import { ActiveCallCard, Activeindvcall, EmergencyCallCard, IncomingEmergencyCard, PendingEmergencyCallCard } from '.';
import { sipIndividualCallTypes } from '../../utils/sipConfig';
import { Title } from '../commom/Title';
import { newAlertBeep } from '../../constants/constants'
const emgBeep = new Audio(newAlertBeep)
emgBeep.loop = true

const EmergencyCalls = ({ individualCalls, groupCalls, pendingAckEmergCallls, user }) => {
    const [incoming, setIncoming] = useState('');
    const [ongoing, setOngoing] = useState('');
    const [ackCalls, setAckCall] = useState([]);
    const [onProcess, setOnProcess] = useState('');
    useEffect(() => {
        const calls = [...individualCalls, ...groupCalls]
        const inc = calls.filter(call => (call.stateType === 'PERSISTED' || call.stateType === 'WAITING') && parseInt(call.callPriority) === 15 && call.toId === (user && user.profile.mcptt_id)).sort((a, b) => new Date(b.created) - new Date(a.created));
        const ong = calls.filter(call => !(call.stateType === 'COMPLETED' || call.stateType === 'PERSISTED' || call.stateType === 'WAITING' || call.stateType === 'DISCONNECTED') && parseInt(call.callPriority) === 15).sort((a, b) => new Date(b.created) - new Date(a.created));
        const emgOnprocess = calls.filter(call => (call.stateType === 'PERSISTED' || call.stateType === 'WAITING') && parseInt(call.callPriority) === 15 && (call.fromId === (user && user.profile.mcptt_id))).sort((a, b) => new Date(b.created) - new Date(a.created));
        setIncoming(inc);
        setOngoing(ong);
        setOnProcess(emgOnprocess)
    }, [individualCalls, groupCalls])
    
    useEffect(() => {
        console.log('pendingAckEmergCallls...', pendingAckEmergCallls)
        setAckCall(pendingAckEmergCallls);
        if (global.config.project === 'mumbai') {
            if (pendingAckEmergCallls.length > 0) {
                stopEmgAckBeep()
                playEmgAckBeep()
            } else {
                stopEmgAckBeep()
            }
        }
    }, [pendingAckEmergCallls])

    const playEmgAckBeep = () => {
        emgBeep.play()
    }

    const stopEmgAckBeep = () => {
        emgBeep.pause()
        emgBeep.currentTime = 0
    }

    return (
        <React.Fragment>
            {/* <Title title={"Inc Emg Calls ( "+incoming.length+" )"} type="none"/> */}
            <Title title={"Emergency Calls ( " + ongoing.length + " )"} type="none" />
            {incoming && incoming.map((emg, id) => {
                return (
                    <IncomingEmergencyCard
                        data={emg}
                        key={id}
                    />
                )
            })}

            {/* <div class="pt-6 pb-6 pr-6 pl-6 f-18 f-reg white muli m-t-5">{'Ongoing Calls ( '+ongoing.length+' )'}</div> */}
            <div class='call-divider m-t-2 m-b-10' style={{ backgroundColor: '#e9e9e936' }}></div>
            {onProcess && onProcess.map((emg, id) => {
                return (
                    <EmergencyCallCard
                        data={emg}
                        key={id}
                        dial={true}
                    />
                )
            })}
            {ongoing && ongoing.map((emg, id) => {
                if (emg.callType === sipIndividualCallTypes.duplex) {
                    return (
                        <Activeindvcall
                            data={emg}
                            key={id}
                            isEmg={true}
                        />
                    )
                }
                else {
                    return (
                        // <EmergencyCallCard   
                        //     data={emg} 
                        //     key={id}
                        // />
                        <ActiveCallCard
                            data={emg}
                            key={id}
                            isEmg={true}
                        />
                    )
                }
            })}
            {ackCalls && ackCalls.map((emg, id) => {
                return (
                    <PendingEmergencyCallCard
                        data={emg}
                        key={id}
                    />
                )
            })}
        </React.Fragment>
    )
}

const mapStateToProps = ({ communication, auth }) => {
    const { individualCalls, groupCalls, pendingAckEmergCallls } = communication;
    const { user } = auth;
    return {
        individualCalls,
        groupCalls,
        pendingAckEmergCallls,
        user
    };
};

export default connect(mapStateToProps, {})(EmergencyCalls);
