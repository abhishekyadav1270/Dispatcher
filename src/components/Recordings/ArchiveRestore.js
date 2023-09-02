import { useState } from "react"
import { Container, Row, Col, Form, Button, ProgressBar } from "react-bootstrap"
import axios from 'axios';
import { EndPoints } from '../../MCXclient/endpoints';
import './player.css'


const ArchiveRestore =() =>{
  const [selectedFiles, setSelectedFiles] = useState([])
  const [progress, setProgress] = useState()

  const submitHandler = e => {
    e.preventDefault() //prevent the form from submitting
    let formData = new FormData()

    formData.append("recording", selectedFiles[0])
    axios.post(EndPoints.getConfig().archiveFile, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      onUploadProgress: data => {
        //Set the progress value to show the progress bar
        setProgress(Math.round((100 * data.loaded) / data.total))
      },
    }).then(res=>{
      console.log("File upload res" , res);
      if(res.data){
        setProgress(res.data);
      }
    }).catch(err=>{
      console.log("error in fetching Archive file Upload event--", err);
    })
  }
  return (
    <Container>
      <Row>
        <Col lg={{ span: 12 }} className="archive-restore-box">
          <Form
            encType="multipart/form-data"
            onSubmit={submitHandler}
          >
            <Form.Group>
              <Form.File
                id="exampleFormControlFile1"
                label="Select a File"
                name="recording"
                onChange={e => {
                  setSelectedFiles(e.target.files)
                }}
              />
            </Form.Group>
            <Form.Group>
            <Button style={{ backgroundColor: "#ffb01f", color: "black" ,width:"15%" }} variant="container" type="submit">Upload</Button>
            </Form.Group>
            {progress && <ProgressBar striped variant="SOME_NAME" animated now={progress} label={ `${parseInt(progress)?progress +"%" : progress} `} />}
          </Form>
        </Col>
      </Row>
    </Container>
  )
}

export default ArchiveRestore;