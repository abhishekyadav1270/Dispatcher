/**
 *  Component: Marker
 */

import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { Image, Popup, Confirm } from 'semantic-ui-react'

import { removeSnailTrail } from '../../../modules/actions' 
import { cacheReload } from '../../../modules/common' 
import { showMessage } from '../../../modules/alerts'
import '../../../styles/location.scss'

const propTypes = {
  removeSnailTrail: PropTypes.func.isRequired,
  showMessage: PropTypes.func.isRequired,
  cacheReload: PropTypes.func.isRequired,
  color:  PropTypes.string.isRequired
}

class Marker extends React.Component {

  state = {
    isRemoveClicked: false
  }

  componentDidMount() {
  }

  showConfirm = snailTrailId => this.setState({ isRemoveClicked: true })
  handleRemove = snailTrailId => this.removeSnailTrail(snailTrailId)
  handleCancel = () => this.setState({ isRemoveClicked: false })

  removeSnailTrail = async (id) => {
    const {removeSnailTrail, showMessage, cacheReload} = this.props
    const res = await removeSnailTrail(id)
    showMessage(res)
    if(res.type === 'success'){
      cacheReload()
    }
  }

  render () {
    const {isRemoveClicked} = this.state
    const {text, snailTrailId, color} = this.props
    return (
      <div className="location-marker">
        <Popup
          className='marker-popup'
          trigger={
            <div>
              <div className='label' style={{background: color}}>{text}</div>
              <Image className='marker pointer' src='/images/location.svg' />
            </div>
          }
          content={
            <div>
              <div className='name'>{text}</div>
              <div>
                <div className='action pointer' onClick={() => this.showConfirm(snailTrailId)}>
                  <Image src='/images/snail_trail.svg' /> Remove Snail Trail
                </div>
                <Confirm
                    size='mini'
                    open={isRemoveClicked}
                    header={`Remove '${text}' snailTrail`}
                    onCancel={this.handleCancel}
                    onConfirm={() => this.handleRemove(snailTrailId)}
                    />
              </div>
            </div>
          }
          on='click'
          position='top right'
        />
      </div>
    )
  }
}

const mapDispatchToProps = dispatch => bindActionCreators({
  removeSnailTrail,
  cacheReload,
  showMessage
}, dispatch)

Marker.propTypes = propTypes

export default connect(
  null,
  mapDispatchToProps
)(Marker)