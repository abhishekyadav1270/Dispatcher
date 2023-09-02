import React, { Component,useState,useEffect } from 'react'
import { connect } from 'react-redux'

//Other
import { fetchAllLines } from '../modules/actions';


const Demo = (fetchAllLines,track,trains) => {
    const [demo, setDemo] = useState('');
    useEffect(() => {
        //code here
        //handleData()
        console.log('DEMO FUNCTION COMPONENT',fetchAllLines,track,trains)
    }, [demo])
    //functions
    const handleData = () => {
        setDemo('HELLO')
    };

    return (
        <div>
            <h2>CONTETX</h2>
        </div>
    )
}

const mapStateToProps = ({ train }) => {
    const { track, trains } = train;
  
    console.log('PROP DEMO',track, trains);
    return {
      track, 
      trains
    };
  };
  
export default connect(mapStateToProps, { fetchAllLines })(Demo);
