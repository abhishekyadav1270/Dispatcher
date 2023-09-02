import React, { useState } from 'react'
import { connect } from 'react-redux'
import { Modal, Button } from 'react-bootstrap'
import { updateUserAdmin } from '../modules/adminstate'
import { User } from 'oidc-client'
//import { userCustomMessageText } from '../MCXclient/endpoints'

const ChangePassword = (props) => {
    const { updateUserAdmin, user } = props
    const [enableSave, setEnable] = useState(false);
    const [password, setPassword] = useState('')
    const { open, closeModal } = props;

    const passwordChangeHandler = (e) => {
        setPassword(e.target.value)
        if (e.target.value.length > 0) {
            setEnable(true)
        } else {
            setEnable(false)
        }
    }

    const saveSettings = () => {
        console.log('password ', password, user)
        if (user) {
            let tetrauser = false
            if (user.profile.tetraUser === 'true') {
                tetrauser = true
            }
            let mcpttId = user.profile.mcptt_id
            if (mcpttId.includes('@')) {
                let mcArr = mcpttId.split("@");
                if (mcArr.length > 0) {
                    mcpttId = mcArr[0];
                }
            }
            let email = user.mcpttId + '@cons.org'
            const payload = {
                id: user.profile.sub,
                password: password,
                mcpttId: mcpttId,
                Role: user.profile.Role,
                TetraUser: tetrauser,
                userName: user.UserName,
                Email: email,
                mcxDataIdText: '',
                mcxVideoIdText: '',
                mcxDataID: false,
                mcxVideoID: false
            }
            updateUserAdmin(payload)
        }
        props.closeModal(false)
    }

    const renderPassword = () => {
        return (
            <div class="form-group">
                <label class="attribute-heading" style={{ margin: 10 }}>Password</label>
                <input
                    type="text"
                    class="input-control"
                    id="password"
                    value={password}
                    onChange={passwordChangeHandler}
                />
            </div>
        )
    }

    return (
        <Modal
            show={open}
            onHide={() => closeModal(false)}
            size={props.size ? props.size : "lg"}
            aria-labelledby="contained-modal-title-vcenter"
            centered
            style={{ backgroundColor: ' rgba(0,0,0,0.5)' }}
        >
            <Modal.Header closeButton style={{ border: '0px', backgroundColor: '#282828' }}>
                <Modal.Title>Change Password</Modal.Title>
            </Modal.Header>
            <Modal.Body style={{ padding: '5px' }} scrollable={false}>
                {renderPassword()}
            </Modal.Body>
            <Modal.Footer>
                <Button variant="success" disabled={!enableSave} onClick={saveSettings}>Save & Close</Button>
                <Button variant="light" onClick={() => props.closeModal(false)}>Close</Button>
            </Modal.Footer>
        </Modal>
    )
}
const mapStateToProps = state => ({
    user: state.auth.user
})
export default connect(mapStateToProps, {
    updateUserAdmin
})(ChangePassword)