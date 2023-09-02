import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux'
import { Header, Icon, Dropdown,Grid } from 'semantic-ui-react'
import { Modal, Button } from 'react-bootstrap'

import { mpttOptions } from '../constants/constants'
import { updateMasterPttKey } from '../modules/settings'
const Settings = (props) => {
    // const [open, handleClose] = useState(true);
    const [Key, setMpttKey] = useState('');
    const [enableSave, setEnable] = useState(false);

    const { open, closeModal,mpttKey,updateMasterPttKey } = props;

    useEffect(() => {
        console.log('SETTINGS',mpttKey)
        setMpttKey(mpttKey)
    }, [mpttKey])

    //functions
    const setMpttFunKey = async (e,{value}) =>{
        console.log('SELCETED INPUT DEVICE',value)
        if(mpttKey !== value) setEnable(true)
        else setEnable(false)
        setMpttKey(value);
    }

    const saveSettings = async () =>{
        await localStorage.setItem('mpttKey',Key);
        props.closeModal(false)
        updateMasterPttKey(Key)
    }

    const renderDetails = () => {
        return (
          <div id="device-testing" class="m-t-15 m-l-10 m-r-10">
          </div>
        );
    };

    const renderSettings = () =>{
        return(
            <div class='m-t-10 m-b-10 m-l-10 m-r-10'>
                <div class='setting-row-grid'>
                    <div class='set-text'>
                        <div class='f-text-header-18b' style={{ fontWeight:'700'}}>MPTT function key config</div>
                    </div>
                    <div class='set-opt'>
                        <Dropdown
                            fluid
                            selection
                            defaultValue={Key}
                            options={mpttOptions}
                            onChange={setMpttFunKey}
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
                <Modal.Title>Settings</Modal.Title>
            </Modal.Header>
            <Modal.Body style={{ padding:'5px'}} scrollable={true}>
                {renderSettings()}
                {/* {renderDetails()} */}
            </Modal.Body>
            <Modal.Footer>
                <Button variant="success" disabled={!enableSave} onClick={saveSettings}>Save & Close</Button>
                <Button variant="light" onClick={()=>props.closeModal(false)}>Close</Button>
            </Modal.Footer>
        </Modal>
    )
}

const mapStateToProps = ({ settings }) => {
    const { mpttKey } = settings;
    return {
        mpttKey
    };
};

export default connect(mapStateToProps, {
    updateMasterPttKey,
 })(Settings);