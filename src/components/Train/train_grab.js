import React, { useState, useEffect } from 'react'
import PropTypes, { element, string } from 'prop-types'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { Modal, Button } from 'react-bootstrap'
import Checkbox from "@material-ui/core/Checkbox";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
//import { mockTrainLocs, mockDefaultLocs, mockCurrentLocs } from './trainMockData'
import { makeStyles } from "@material-ui/styles";
import { updateCurrentLA } from '../../modules/actions';
import '../../constants/verConfig'

const TrainGrab = (props) => {
    const {allLocs, currentLALocs} = props
    const [allModifiedLocs, setAllModifiedLocs] = useState([])
    //const [updateCurLocs, setUpdateCurLocs] = useState([])
    useEffect(() => {
        //console.log('allLocs use', props.allLocs)
        console.log('allLocs current use', props.currentLALocs)
        // let updatedLocs = allModifiedLocs.filter(element => (element.addedLoc === true && element.ungrab === true))
        // let onlyLocIds = updatedLocs.map(element => element.locId)
        // console.log('updatedlocID useeffect... ', onlyLocIds, props.currentLALocs)
        makeLocs()
    }, [currentLALocs, allLocs])

    const useStyles = makeStyles((theme) => ({
        listRow: {
            display: 'flex',
            flexDirection: 'row',
            height: '50px',
            width: '98%',
            margin: '10px',
            borderBottomWidth: '1px',
            borderBottomColor: '#d3d3d3',
            borderBottomStyle: 'solid',
            alignItems: 'center',
            justifyContent: 'center'
        },
        listItemText: {
            padding: '5px',
            fontFamily: 'Muli'
        },
    }));

    const makeLocs = () => {
        let locations = []
        props.allLocs.forEach(loc => {
            if (props.currentLALocs.includes(Number(loc.locId)) || props.currentLALocs.includes(String(loc.locId))) {
                let locElement = {...loc, 'ungrab': false, 'addedLoc': true}
                locations = [...locations, locElement]
            }else{
                let locElement = {...loc, 'ungrab': true, 'addedLoc': false}
                locations = [...locations, locElement]
            }
        })
        setAllModifiedLocs(locations)
    }

    const userhandleClose = () => {
        props.hideModal()
    }

    const grabLoc = (loc) => {
        console.log('grab loc', loc)
        let updatedLocs = []
        allModifiedLocs.forEach(element => {
            if (element.locId === loc.locId) {
                let updatedElement = { ...element }
                updatedElement.addedLoc = !loc.addedLoc
                updatedLocs = [...updatedLocs, updatedElement]
            }else{
                updatedLocs = [...updatedLocs, element]
            }
        })
        setAllModifiedLocs(updatedLocs)
    }

    const updateLoc = () => {
        let updatedLocs = allModifiedLocs.filter(element => (element.addedLoc === true && element.ungrab === true))
        let onlyLocIds = updatedLocs.map(element => element.locId)
        //console.log('updatedloc', updatedLocs)
        console.log('updatedlocID', onlyLocIds)
        const data = {
            'locID': onlyLocIds,
            'laID': global.config.currentLAId 
        }
        props.updateCurrentLA(data)
        props.hideModal()
    }

    const classes = useStyles();

    return (
        <div>
            <Modal
                show={props.showModal}
                onHide={userhandleClose}
                scrollable={false}
                size={"lg"}
                aria-labelledby="contained-modal-title-vcenter"
                centered
                style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
            >
                <Modal.Header closeButton style={{ border: '0px', backgroundColor: '#282828' }}>
                    <Modal.Title>Grab Locations</Modal.Title>
                </Modal.Header>
                <Modal.Body style={{ padding: '0.2px' }}>
                    <div style={{ width: '100%', height: '600px', overflowY: 'scroll' }}>
                        <List style={{ width: '100%' }}>
                            {allModifiedLocs.map((loc) => {
                                return (
                                    <ListItem className={classes.listRow} key={loc.locId}>
                                        <ListItemText className={classes.listItemText} primary={loc.label}/>
                                        <ListItemText className={classes.listItemText} primary={loc.line}/>
                                        <Checkbox
                                            color='secondary'
                                            edge="start"
                                            onChange={() => grabLoc(loc)}
                                            checked={loc.addedLoc}
                                            disabled = {!loc.ungrab}
                                        />
                                    </ListItem>
                                );
                            })}
                        </List>
                    </div>
                </Modal.Body>
                <Modal.Footer style={{ border: '1px', backgroundColor: '#d3d3d3' }}>
                    <Button variant="success" onClick={updateLoc}>
                        Update
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    )
}
const mapStateToProps = state => ({
    allLocs: state.train.allLocs,
    currentLALocs: state.train.currentLALocs
})

const mapDispatchToProps = dispatch => bindActionCreators({
    updateCurrentLA
}, dispatch)

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(TrainGrab)
//export default TrainGrab;
