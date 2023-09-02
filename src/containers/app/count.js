/**
 *  Component: Count
 */

import React from 'react'
import PropTypes from 'prop-types'
import { Label } from 'semantic-ui-react'

const propTypes = {
  count: PropTypes.number.isRequired
}

const Count = (props) => (
  <span>
  { 
    props.count>0 && 
      <span>&nbsp;
        <Label size='tiny' color='red'>
          {props.count}
        </Label>
      </span> 
  }
  </span>
)

Count.propTypes = propTypes

export default Count