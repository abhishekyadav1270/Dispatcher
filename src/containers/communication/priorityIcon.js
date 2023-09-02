/**
 *  Component: PriorityIcon
 */

import React from 'react'
import PropTypes from 'prop-types'
import { Icon } from 'semantic-ui-react'

const propTypes = {
  callPriority: PropTypes.string
}

const PriorityIcon = props => (
  <span {...props}>
    {
      props.callPriority==='HIGH' && <span className='ico'><Icon color='red' name='exclamation triangle' /></span>
    }
    {
      props.callPriority==='MEDIUM' && <span className='ico'><Icon color='orange' name='exclamation triangle' /></span>
    }
    {
      props.callPriority==='LOW' && <span className='ico'><Icon color='yellow' name='exclamation triangle' /></span>
    }
  </span>
)

PriorityIcon.propTypes = propTypes
export default PriorityIcon