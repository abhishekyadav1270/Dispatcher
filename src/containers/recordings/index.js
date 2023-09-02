import React, { useEffect } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { push } from 'react-router-redux'
import Header from '../../components/Navigation/Header'
import Card from '../../components/Recordings/Card'
import SearchOptions from '../../components/Recordings/SearchOptions'
import CallRecordTable from '../../components/Recordings/CallRecordTable'
import ArchiveRecordings from '../../components/Recordings/ArchiveRecordings'

import './player.css'
import RecordPage from '../../components/Recordings/RecordPage'
import SdsTable from '../../components/Recordings/SdsTable'

const Recordings = (props) => {
    const { isAuthenticated,navigateToLogin } = props;
  useEffect(() => {
    console.log('LOG ALERT',props,navigateToLogin,isAuthenticated)
    if(!isAuthenticated) navigateToLogin()
  }, [isAuthenticated])
    return (
        <div>
            <Header page={'recordings'} />
            <div className='main-div'>
                <Card className="w20 p20">
                    <SearchOptions/>
                    {/* <div className='sub-div'>
                    
                    </div>
                    <div className='sub-div mt-5'>
                        <ArchiveRecordings/>
                    </div> */}
                </Card>
                <Card className="w79_5 p20">
                    <RecordPage/>
                   {/* <CallRecordTable/> */}
                   {/* <SdsTable/> */}
                </Card>
            </div>
        </div>
    )
}

const mapStateToProps = ({auth})=>{
    const { isAuthenticated } = auth;
    return { isAuthenticated };
}

const mapDispatchToProps = (dispatch)=>
    bindActionCreators({
        navigateToLogin: () => push('/')
    }, dispatch)
export default connect(mapStateToProps, mapDispatchToProps)(Recordings);