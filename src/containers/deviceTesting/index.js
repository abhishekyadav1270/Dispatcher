/**
 *  Component: DeviceTesting
 */

import React from 'react'
import { Modal, Header, Icon, Button } from 'semantic-ui-react'
import { ReactMic } from 'react-mic'
import { testAudio } from '../../constants/constants'

import '../../styles/deviceTesting.scss'

class DeviceTesting extends React.Component {

  state = {
    record: false,
    audio: null
  }

  startRecording = () => {
    this.setState({
      record: true
    })
  }

  stopRecording = () => {
    this.setState({
      record: false
    })
  }

  onStop = (recordedBlob) => {
    this.setState({audio: recordedBlob})
    console.log('recordedBlob is: ', recordedBlob)
  }

  render () {
    const {record, audio} = this.state
    return(
      <Modal id="device-testing" size='tiny' trigger={this.props.trigger} closeIcon>
        <Header content='Device Testing' />
        <Modal.Content>
          <div>
            <Header as='h4'>
              <Icon name='volume up' />Speakers
            </Header>
            <div className='center'>
              <audio
                controls='controls'
                src={testAudio}
                autoplay>
                Your browser does not support the <code>audio</code> element.
              </audio>
              {
                // <Button size='mini' positive>Test Now</Button>
              }
            </div>
          </div>
          <hr/>
          <div>
            <Header as='h4'>
              <Icon name='microphone' />Microphone
            </Header>
            <div className='center'>
              <ReactMic
                record={record}
                className="sound-wave"
                onStop={this.onStop}
                strokeColor="#000000"
                backgroundColor="#FF4081" />
                {
                  audio && <audio
                    controls='controls'
                    src={audio.blobURL}
                    autoplay>
                    Your browser does not support the <code>audio</code> element.
                  </audio>
                }
                {
                  record ?  
                    <Button onClick={this.stopRecording} size='mini' negative>Stop</Button>
                    :
                    <Button onClick={this.startRecording} size='mini' positive>Test Now</Button>
                }
            </div>
          </div>
        </Modal.Content>
      </Modal>
    )
  }
} 

export default DeviceTesting