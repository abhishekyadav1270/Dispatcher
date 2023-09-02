/**
 *  Component: Signal
 */

import React from 'react'
import PropTypes from 'prop-types'

import '../styles/signal.scss'

const propTypes = {
  status: PropTypes.bool,
  secStatus: PropTypes.bool,
  name: PropTypes.string
}

const Signal = (props) => {
  let connectionStatus = props.status || props.secStatus;
  return (
    <div style={{ width: '100px', flexDirection: 'row', display: 'flex', justifyContent: 'center'}}>
      <div class={`in-blc ${connectionStatus ? 'dot-green' : 'dot-red'}`}></div>
      <div class="white m-b-5" style={{ marginLeft: '3px', marginTop: '1px' }}>{props.name}</div>
      {/* :
        <div>
            <div class={`in-blc ${props.status ? 'dot-green' : 'dot-red'}`}></div>
            <p class="white in-blc m-l-2 f-12 mrg-0">Primary</p>
        </div>
        } */}
    </div>
  )
}

Signal.propTypes = propTypes

export default Signal