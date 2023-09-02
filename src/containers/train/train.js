/**
 *  Component: Train
 */

import React from "react"
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import { Popup } from 'semantic-ui-react'
import { getTrainCords, fetchSubscriberIdFromTrain } from "../../utils/lib"

import MessageModal from '../location/messageModal'
import ActionItems from '../location/actionItems'

const propTypes = {
  subscribers: PropTypes.array
}

class Train extends React.PureComponent {

  state = {
    showMessageModal: false
  }

  closeModal = () => this.setState({showMessageModal: false})
  initiateMessaging = () => this.setState({showMessageModal: true})

  render() {
    const { showMessageModal } = this.state
    const { subscribers, train, coords, isHorizontal } = this.props
    const trainCords = getTrainCords(train, coords)
    
    if (!trainCords) {
      return null
    }

    let transform

    if (!isHorizontal) {
      transform = `translate(${trainCords.x + 15}, ${
        trainCords.y
      }) rotate(${isHorizontal ? "0" : "90"})`
    } else {
      transform = `translate(${trainCords.x}, ${trainCords.y -
        15}) rotate(${isHorizontal ? "0" : "90"})`
    }

    return (
      <g transform={transform}>
        <Popup
          className='train-popup'
          trigger={
            <g className='pointer'>
              <svg width="32px" height="17px" viewBox="0 0 32 17" version="1.1">
                <defs>
                  <linearGradient x1="50%" y1="0%" x2="50%" y2="100%" id="linearGradient-1">
                    <stop stop-color="#F5515F" offset="0%"/>
                    <stop stop-color="#9F041B" offset="100%"/>
                  </linearGradient>
                </defs>
                <g id="Updated" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
                  <g id="01-Train" transform="translate(-86.000000, -149.000000)" fill="url(#linearGradient-1)">
                    <g id="Group" transform="translate(52.000000, 111.000000)">
                      <g id="Group-8-Copy" transform="translate(34.000000, 38.000000)">
                        <path d="M13.9499909,17 C13.9827849,16.838445 14,16.6712329 14,16.5 C14,15.1192881 12.8807119,14 11.5,14 C10.1192881,14 9,15.1192881 9,16.5 C9,16.6712329 9.01721513,16.838445 9.05000906,17 L4,17 C1.790861,17 -3.55476914e-13,15.209139 -3.69482223e-13,13 L-3.45945494e-13,4 C-3.46216036e-13,1.790861 1.790861,-3.14690143e-15 4,-3.55271368e-15 L20.1171249,0 C21.2927592,-2.1596052e-16 22.4088677,0.517180611 23.1688806,1.41411782 L30.7949626,10.4141178 C32.2231059,12.099556 32.0145272,14.6236125 30.329089,16.0517558 C29.6065591,16.663986 28.6902418,17 27.7432068,17 L13.9499909,17 Z" id="Train"/>
                      </g>
                    </g>
                  </g>
                </g>
              </svg>
              <polygon
                points="0,0 30,0 40,15 0,15"
                width="20"
                height="10"
                style={{
                  fill: "#afe459",
                  strokeWidth: 2,
                  stroke: "#539d26"
                }}
              />
              <text style={{fontSize: '12px'}} y={-5} >{train.info.trainNumber}</text>
            </g>
          }
          content={
            <ActionItems subscriberId={fetchSubscriberIdFromTrain(subscribers, train.info)} page='train' initiateMessaging={this.initiateMessaging} />
          }
          on='click'
          position='top right'
        />
        <MessageModal subscriberId={fetchSubscriberIdFromTrain(subscribers, train.info)} closeModal={this.closeModal} showMessageModal={showMessageModal} />
      </g>
    )
  }
}

const mapStateToProps = state => ({
  subscribers: state.user.subscribers
})

Train.propTypes = propTypes

export default connect(
  mapStateToProps
)(Train)