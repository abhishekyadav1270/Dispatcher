/**
 *  Component: Count
 */

import React from 'react'
import PropTypes from 'prop-types'

const propTypes = {
  count: PropTypes.number.isRequired
}

const Count = (props) => (
  <span>
  { 
    props.count>0 && 
      <span>&nbsp;({props.count})</span> 
  }
  </span>
)

Count.propTypes = propTypes

export default Count