import React, { useState, useEffect } from 'react'
import { TextField, Button, Box, FormControl, FormGroup, FormControlLabel, RadioGroup, Radio, Checkbox } from '@material-ui/core'
import Typography from "@material-ui/core/Typography"
import { Description } from '@material-ui/icons'
import { connect } from 'react-redux'

const DefaultLayerObject = {
    title: "",
    description: "",
    // layers:["users","fence"]
}
const AddLayerPopup = (props) => {
    const {user, userProfile}=props
    const [title, setTitle] = useState(props.layerData ? props.layerData.title : "")
    const [description, setDescription] = useState(props.layerData ? props.layerData.description : "")
    const [objectOwnership, setObjectOwnership] = useState(props.layerData ? props.layerData.ownership : "global") // global/user/FA
    const [isUserEnable, setisUserEnable] = useState(false)
    const [isFenceEnable, setisFenceEnable] = useState(false)
    const [isPOIEnable, setisPOIEnable] = useState(false)
    const [isSnailTrailEnable, setisSnailTrailEnable] = useState(false)
    const [layerObject, setlayerObject] = useState(DefaultLayerObject)
    const [layers, setLayers] = useState([])
    const [selLayerOwnershipId, setSelLayerOwnershipId] = useState(props.layerData ? props.layerData.ownershipId : "")
    const [ownershipId,setOwnerShipId] = useState(props.layerData ?props.layerData.ownershipId :[]);

    var layerData = props.layerData

    const style = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 600,
        bgcolor: 'background.paper',
        border: '2px solid #000',
        boxShadow: 24,
        p: 4,
    };
    const titleChangeHandler = (e) => {
        setTitle(e.target.value)
    };
    const descriptionChangeHandler = (e) => {
        setDescription(e.target.value)

    };
    const handleUserSwitch = (e) => {
        setisUserEnable(e.target.checked)
    }
    const handlePOISwitch = (e) => {
        setisPOIEnable(e.target.checked)
    }
    const handleFenceSwitch = (e) => {
        setisFenceEnable(e.target.checked)
    }
    const handleSnailTrailSwitch = (e) => {
        setisSnailTrailEnable(e.target.checked)
    }
    const onUpdateClicked = () => {

        if (title !== "") {
            layerData.title = title
            layerData.description = description
            layerData.ownershipId = ownershipId
            layerData.ownership = objectOwnership

            props.updateLayer(layerData)

        }
        else {
            alert("Add title for the layer")

            // alert to add atleast one config ie one layer
        }
    }
    const onSubmitClicked = () => {
        var isAddedSomeProp = false
        if (title !== "") {
            var newLayerObj = {
                title: title,
                description: description,
                ownership:objectOwnership,
                ownershipId:ownershipId,
                createdBy:user.profile.mcptt_id

            }
            props.createLayer(newLayerObj)
            console.log("LAYER ADDED", newLayerObj)

        }
        else {
            alert("Add title for the layer")

            // alert to add atleast one config ie one layer
        }



    }
    const handleOwnerShipChange = (event) => {
        setObjectOwnership(event.target.value);
        var selectedID = []
        // if (event.target.value === "global") {
        // }
        // else if (event.target.value === "user") {
        //     selectedID =[user.profile.mcptt_id]
        //     // send userId in this case
        // }
        // else {
        //     selectedID = [global.config.faID] // send selected FAId list in this case 
        // }
        if(event.target.value === "user"){
            selectedID =[user.profile.mcptt_id]
            setOwnerShipId(selectedID)
        }
    };

    const handleOwnerShipIdChange = (e)=>{
        // console.log("handleOwnerShipIdChange--",e.target.value);
        ownershipId.includes(e.target.value) ? setOwnerShipId(ownershipId.filter(id=>id!=e.target.value)) : setOwnerShipId([...ownershipId,e.target.value]);
        // console.log("falist id--",ownershipId);
    }
    return (
        <Box sx={style}>
            <Typography id="modal-modal-title" variant="h6" component="h2">
                Add Layer
            </Typography>
            <div>
                <div class="tab1-account">
                    <div style={{ display: 'flex', flexDirection: 'column', paddingRight: '30px' }}>
                        <TextField
                            required
                            id="standard-basic"
                            label="Title"
                            variant="standard"
                            // value={addedLayerType === "marker" ? newPOIObj ? newPOIObj.title : "" : newFenceObj ? newFenceObj.title : ""}
                            onChange={titleChangeHandler}
                            value={title}
                        />
                        <TextField
                            required
                            id="outlined-multiline-flexible"
                            label="Description"
                            multiline
                            maxRows={4}
                            style={{ marginTop: '15px' }}
                            value={description}
                            onChange={descriptionChangeHandler}

                        />

                        <h1 style={{ marginTop: 15 }}
                        >Layer Ownership</h1>
                        <FormControl
                            style={{ marginLeft: 20, marginTop: 5 }}
                            component="fieldset">
                            {/* <FormLabel component="legend">Ownership</FormLabel> */}
                            <RadioGroup
                                aria-label="gender"
                                name="controlled-radio-buttons-group"
                                value={objectOwnership}
                                onChange={handleOwnerShipChange}
                            >
                                <FormControlLabel value="global" control={<Radio />} label="Global" />
                                <FormControlLabel value="user" control={<Radio />} label="Personal" />
                                <FormControlLabel value="FA" control={<Radio />} label="FA" />
                            </RadioGroup>
                            {
                                objectOwnership === "FA" ? (
                                    <div style={{ marginLeft: 35 }}>
                                        {/* <FormLabel  color= "black" component="legend">Select FA</FormLabel> */}
                                        {
                                            ( Array.isArray(userProfile.faList) && userProfile.faList.length>0 )? ( (userProfile.faList).map((fa,index)=>{
                                                return  <FormControlLabel key={index} value={fa.name} control={<Checkbox checked={ownershipId.includes(fa.name)} onChange={handleOwnerShipIdChange}/>} label={fa.name} />
                                            })): null 
                                        }
                                    </div>
                                ) : null
                            }
                        </FormControl>
                    </div>

                    {/* <h3 style={{ marginTop: '18px' }}>Configuration</h3>
                    <FormGroup style={{ marginTop: '8px' }}>
                        <FormControlLabel control={<Switch />} label="Users" color="yellow" checked={isUserEnable} onChange={handleUserSwitch} />
                        <FormControlLabel control={<Switch />} label="POI" color="warning" checked={isPOIEnable} onChange={handlePOISwitch} />
                        <FormControlLabel control={<Switch />} label="Fences" color="warning" checked={isFenceEnable} onChange={handleFenceSwitch} />
                        <FormControlLabel control={<Switch />} label="Snail Trail" color="warning" checked={isSnailTrailEnable} onChange={handleSnailTrailSwitch} />

                    </FormGroup> */}
                </div>
                {
                    layerData ?
                        <button
                            class="update-btn-profile"
                            type="button"
                            onClick={onUpdateClicked}
                        >
                            UPDATE
                        </button>
                        :
                        <button
                            class="update-btn-profile"
                            type="button"
                            onClick={onSubmitClicked}
                        >
                            SUBMIT
                        </button>
                }

            </div>
        </Box>)
}
const mapStateToProps = ({ auth }) => {
    const { user, userProfile } = auth;
    return {
      user,userProfile
    };
  };
  
  
  export default connect(
    mapStateToProps,
  )(AddLayerPopup)