/**
 *  Component: Activity
 */

import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { Message } from 'semantic-ui-react'

import { showMessage } from '../../../modules/alerts' 
import { removeGeoFenceActvity } from '../../../modules/actions' 
import '../../../styles/alert.scss'

const propTypes = {
  activities: PropTypes.array,
  showMessage: PropTypes.func.isRequired
}

class Activity extends React.Component {

  state = {

  }

  componentDidMount() {

  }

  removeActivity = async (id) => {
    const {removeGeoFenceActvity, showMessage} = this.props
    const res = await removeGeoFenceActvity(id)
    if(res.type !== 'success'){
        showMessage(res)
      }
  }

  render () {
    const {activities} = this.props
    return (
      activities.length ? 
        <div className="alert left">
          {
            activities.map(activity => (
              <Message 
                onDismiss={() => this.removeActivity(activity.id)}
                compact
                size='mini'
                key={activity.id} 
                style={{background: activity.color}}
                header={activity.activityType}
                content={`${activity.subscriberId} ${(activity.activityType === 'IN') ? 'enter in' : 'exited the' } ${activity.fenceName}` }
                />
            ))
          }
        </div>
        : 
        <span />
    )
  }
}

const mapStateToProps = state => ({
  activities: state.location.activities
})

const mapDispatchToProps = dispatch => bindActionCreators({
  removeGeoFenceActvity,
  showMessage
}, dispatch)

Activity.propTypes = propTypes

export default connect(
  mapStateToProps, mapDispatchToProps
)(Activity)