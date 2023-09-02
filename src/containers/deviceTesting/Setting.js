import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux'
import { Header, Icon, Dropdown,Grid } from 'semantic-ui-react'
import { ReactMic } from 'react-mic'
import { Modal, Button } from 'react-bootstrap'

import { testAudio } from '../../constants/constants'
import '../../styles/deviceTesting.scss'
import { getMediaConstraint } from '../../utils/lib'

const remoteAudio = document.getElementById('remoteAudio');
const mictestAudio = document.getElementById('mictestAudio');

const DeviceTesting = (props) => {
    // const [open, handleClose] = useState(true);
    const [record, setRecord] = useState(false);
    const [audio, setAudio] = useState(false);
    const [showRec, setShow] = useState(false);
    const [allDevices, setAllDevices] = useState([]);
    const [inputAudioOptions, setInputAudioOpt] = useState([]);
    const [outputAudioOptions, setOutputAudioOpt] = useState([]);
    const [defInp, setInpDefault] = useState('default');
    const [defOut, setOutDefault] = useState('default');

    const { open, closeModal } = props;
    useEffect(() => {
        // console.log('CONS',navigator.mediaDevices.getUserMedia({audio:true,video:false}),getMediaConstraint())
       setOutDefault(localStorage.getItem('selDevice'))
       setInpDefault(localStorage.getItem('selMic'))
       getDevices();
       navigator.mediaDevices.ondevicechange = function(event){
        console.log('DEVICE CHANGED');
        getDevices();
       }
    }, [])

    //functions
    const addMediatoTest = async (isPlay=false) =>{
        // console.log('TEST MED',getMediaConstraint(),mictestAudio)
        await navigator.getUserMedia(getMediaConstraint(),
            (stream)=>{
                // console.log('TEST MEDIA',stream,stream.getAudioTracks());
                mictestAudio.srcObject = stream;
                mictestAudio.onloadedmetadata = function(e){
                    if(isPlay) mictestAudio.play()
                }
            },
            (e)=>console.log('ERR TEST MEDIA',e)
        )
    }

    const getDevices=()=>{
        let inputAccess=[],outputAccess=[],micFalg=false, spkrFlag=false;
        const curOutput = localStorage.getItem('selDevice');
        const curInput = localStorage.getItem('selMic');
        if(navigator.getUserMedia){
            navigator.getUserMedia({ audio:true },
            ()=>{
                navigator.mediaDevices.enumerateDevices()
                .then((devices)=>{
                    console.log('DEVICES',devices)
                    devices.forEach((device)=>{
                        if(device.kind==='audioinput'){
                            if((device.label).length>0){
                                inputAccess.push({text:device.label,value:device.deviceId})
                            }
                            if(device.deviceId === curInput) micFalg = true
                        }
                        if(device.kind==='audiooutput'){
                            if((device.label).length>0){
                                outputAccess.push({text:device.label,value:device.deviceId})
                            }
                            if(device.deviceId === curOutput) spkrFlag = true
                        }
                    })
                    setInputAudioOpt(inputAccess)
                    setOutputAudioOpt(outputAccess)
                    setAllDevices(devices)
                    if(spkrFlag) {attachRemoteSinkId(curOutput); attachSinkId(curOutput)}
                    if(!spkrFlag) attachRemoteSinkId('default')
                    if((spkrFlag || micFalg) && !JSON.parse(localStorage.getItem('deviceSet'))){
                        localStorage.setItem('deviceSet',true)
                    }
                })
                .catch((e)=>console.log(e))
            },
            ()=>{
                console.log('error')
            }
            )
        }
    }
      
    const startRecording = async () => {
        setRecord(true)
        setShow(false)
        addMediatoTest(true)
    }

    const stopRecording = async () => {
        setRecord(false)
        setShow(true)
        mictestAudio.pause()
    }

    const onStop = (recordedBlob) => {
        setAudio(recordedBlob)
        console.log('recordedBlob is: ', recordedBlob)
    }

    const attachSinkId = async (sinkId) =>{
        if (typeof mictestAudio.sinkId !== 'undefined') {
            await mictestAudio.setSinkId(sinkId)
                .then(() => {
                    setOutDefault(sinkId)
                    console.log(`Success, audio output device attached: ${sinkId} to element.`);
                })
                .catch(error => {
                    if (error.name === 'SecurityError') {
                        console.log(`You need to use HTTPS for selecting audio output device: ${error}`);
                    }
                });
        } else {
            console.warn('Browser does not support output device selection.');
        }
    }

    const attachRemoteSinkId = async (sinkId) =>{
        // console.log('REMOTE BEF :',remoteAudio.captureStream(),remoteAudio.captureStream().getAudioTracks(),remoteAudio.sinkId)
        if (typeof remoteAudio.sinkId !== 'undefined') {
            await remoteAudio.setSinkId(sinkId)
                .then(() => {
                    console.log(`REMOTE : Success, audio output device attached: ${sinkId} to element.`);
                })
                .catch(error => {
                    console.log('REMOTE ERR: '+error.name+' : '+error)
                    if (error.name === 'SecurityError') {
                        console.log(`REMOTE : You need to use HTTPS for selecting audio output device: ${error}`);
                    }
                });
        } else {
            console.warn('REMOTE : Browser does not support output device selection.');
        }
    }

    const selAudioDevice = async (e,{value}) =>{
        console.log('SELCETED DEVICE',value)
        attachSinkId(value);
    }

    const selInputDevice = async (e,{value}) =>{
        console.log('SELCETED INPUT DEVICE',value)
        try{
            setInpDefault(value);
            addMediatoTest();
        }
        catch(e){
            console.log('ERR',e)
        }
    }

    const saveSettings = async () =>{
        await localStorage.setItem('selMic',defInp);
        await localStorage.setItem('selDevice',defOut);
        await localStorage.setItem('deviceSet',true);
        attachRemoteSinkId(defOut);
        closeTestModal()
    }

    const closeTestModal = () =>{
        if(record) stopRecording();
        props.closeModal(false);
    }

    const renderDetails = () => {
        return (
          <div id="device-testing" class="m-t-15 m-l-10 m-r-10">
            <div>
              <Header as="h4">
                <Icon name="volume up" />
                Speakers
              </Header>
              <div className="center">
                <audio controls="controls" src={testAudio} autoplay>
                  Your browser does not support the <code>audio</code> element.
                </audio>
                {
                  // <Button size='mini' positive>Test Now</Button>
                }
              </div>
            </div>
            <hr />
            <div>
              <Header as="h4">
                <Icon name="microphone" />
                Microphone
              </Header>
              <div className="center">
                <ReactMic
                  record={record}
                  className="sound-wave"
                  onStop={onStop}
                  strokeColor="#000000"
                  backgroundColor="#fff"
                />
                {audio && showRec && (
                  <audio controls="controls" src={audio.blobURL} autoplay>
                    Your browser does not support the <code>audio</code>{" "}
                    element.
                  </audio>
                )}
                {record ? (
                  <Button onClick={stopRecording} size="mini" negative>
                    Stop
                  </Button>
                ) : (
                  <Button onClick={startRecording} size="mini" positive>
                    Test Now
                  </Button>
                )}
              </div>
            </div>
          </div>
        );
    };

    const renderSettings = () =>{
        return(
            <div class='m-t-10 m-b-10 m-l-10 m-r-10'>
                {!JSON.parse(localStorage.getItem('deviceSet'))?<p class='muli m-t-15 m-b-15'>Please save audio output and input device settings!</p>:null}
                <div class='setting-row-grid'>
                    <div class='set-text'>
                        <div class='f-text-header-18b' style={{ fontWeight:'700'}}>Audio input source</div>
                    </div>
                    <div class='set-opt'>
                        <Dropdown
                            fluid
                            selection
                            defaultValue={defInp}
                            options={inputAudioOptions}
                            onChange={selInputDevice}
                        />
                    </div>
                </div>
                <div class='setting-row-grid'>
                    <div class='set-text'>
                        <div class='f-text-header-18b' style={{ fontWeight:'700'}}>Audio output source</div>
                    </div>
                    <div class='set-opt'>
                        <Dropdown
                            fluid
                            selection
                            defaultValue={defOut}
                            options={outputAudioOptions}
                            onChange={selAudioDevice}
                        />
                    </div>
                </div>
                <hr />
            </div>
        )
    }

    return (
        <Modal
            show={open}
            onHide={()=>closeModal(false)}
            size={props.size?props.size:"lg"}
            aria-labelledby="contained-modal-title-vcenter"
            centered
            style={{ backgroundColor:' rgba(0,0,0,0.5)'}}
        >
            <Modal.Header closeButton style={{ border:'0px', backgroundColor:'#282828'}}>
                <Modal.Title>Device Testing</Modal.Title>
            </Modal.Header>
            <Modal.Body style={{ padding:'5px'}} scrollable={true}>
                {renderSettings()}
                {renderDetails()}
            </Modal.Body>
            <Modal.Footer>
                <Button variant="success" onClick={saveSettings}>Save & Close</Button>
                <Button variant="light" onClick={closeTestModal}>Close</Button>
            </Modal.Footer>
        </Modal>
    )
}

const mapStateToProps = ({ auth }) => {
    const { userDetail} = auth;
    return {
        userDetail
    };
};

export default connect(mapStateToProps, { })(DeviceTesting);