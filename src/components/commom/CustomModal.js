import React, { useEffect } from 'react'
import { Divider} from 'semantic-ui-react'
import { Modal, Button } from 'react-bootstrap'

const CustomModal = (props) => {
  const [open, setOpen] = React.useState(false);

  useEffect(() => {
  }, [])

  return (
    <Modal
      show={props.open}
      onHide={()=>props.handleClose(false)}
      size={props.size?props.size:"lg"}
      aria-labelledby="contained-modal-title-vcenter"
      centered
      style={{ backgroundColor:' rgba(0,0,0,0.5)' ,zIndex:2000}}
    >
      <Modal.Body style={{ padding:'5px'}} scrollable={true}>
        {props.headerTitle}
        <div class="context-divider m-b-10" style={{ borderBottomColor:'rgba(0,0,0,0.3'}}></div>
        {props.body}
      </Modal.Body>
      <Modal.Footer>
        <Button style={{ backgroundColor: "#FFB01F", color: 'black' }} onClick={()=>props.handleClose(false)}>
          Close
      </Button>
        {/* <Button variant="primary" onClick={()=>props.handleClose(false)}>
          Save Changes
      </Button> */}
      </Modal.Footer>
    </Modal>

  )
}

export default CustomModal