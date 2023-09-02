import React, { } from 'react'
import { connect } from 'react-redux'

import { } from '../../components/commom';
import Signal from '../signal';

export const NetworkStatus = (props) => {
    const { ris, mcx, das, ats, user } = props;

    const getUserType = () => {
        let userType = 'TIS'
        if (user && user.profile && user.profile.tetraUser) {
            if (JSON.parse(user.profile.tetraUser) == false) {
                userType = 'MCX'
            }
        }
        console.log('user_profile_mcx.. ', user, userType)
        return userType
    }

    return (
        <div class="row" style={{ justifyContent: 'center', marginTop: '23px' }}>
            <Signal status={ris.primary} secStatus={ris.secondary} name={'RIS'} />
            {/* <Signal status={das.primary} secStatus={das.secondary} name={'DAS'} /> */}
            <Signal status={mcx.primary} secStatus={mcx.secondary} name={getUserType()} />
            <Signal status={ats.primary} secStatus={ats.secondary} name={'ATS'} />
        </div>
    )
}

const mapStateToProps = ({ auth, connection }) => {
    const { isAuthenticated, user } = auth;
    const { ris, mcx, das, ats } = connection;

    return { isAuthenticated, ris, mcx, das, ats, user }
}

const mapDispatchToProps = {

}

export default connect(mapStateToProps, mapDispatchToProps)(NetworkStatus)
