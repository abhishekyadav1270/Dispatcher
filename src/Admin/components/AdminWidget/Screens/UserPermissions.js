import React, { useEffect, useState } from 'react'
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Switch from "@material-ui/core/Switch";
import { makeStyles } from "@material-ui/styles";
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';

const UserPermissions = (props) => {
  const { permissions, updateUserPermissions } = props
  const grabTypes = [
    {
      type: "All LA",
      value: "all"
    },
    {
      type: "Default",
      value: "default"
    },
    {
      type: "None",
      value: "none"
    }
  ]
  const trainMovementsTypes = [
    {
      type: "No movement visible",
      value: "none"
    },
    {
      type: "All train movement visible",
      value: "all"
    },
    {
      type: "Base station only",
      value: "default"
    }
  ]
  const [userPermission, setUserPermission] = useState(permissions)

  useEffect(() => {
    console.log('basicdetails update permissions useeffect..', permissions)
    setUserPermission(permissions)
  }, [permissions])

  const trainTabChangeHandler = (e) => {
    setUserPermission({ ...userPermission, trainTab: e.target.checked })
    updateUserPermissions({ ...userPermission, trainTab: e.target.checked })
  };

  const communicationTabChangeHandler = (e) => {
    setUserPermission({ ...userPermission, communicationTab: e.target.checked })
    updateUserPermissions({ ...userPermission, communicationTab: e.target.checked })
  };

  const alertsTabrChangeHandler = (e) => {
    setUserPermission({ ...userPermission, alertTab: e.target.checked })
    updateUserPermissions({ ...userPermission, alertTab: e.target.checked })
  };
  
  const radioBaseChangeHandler = (e) => {
    setUserPermission({ ...userPermission, baseStation: e.target.checked })
    updateUserPermissions({ ...userPermission, baseStation: e.target.checked })
  };

  const locationTabChangeHandler = (e) => {
    setUserPermission({ ...userPermission, locationTab: e.target.checked })
    updateUserPermissions({ ...userPermission, locationTab: e.target.checked })
  };

  const recordingsTabChangeHandler = (e)=>{
    setUserPermission({...userPermission, recordingsTab: e.target.checked})
    updateUserPermissions({...userPermission, recordingsTab: e.target.checked})
  }

  const handleGrabAllowedTypeChange = (e) => {
    setUserPermission({ ...userPermission, grabAllowed: e.target.value })
    updateUserPermissions({ ...userPermission, grabAllowed: e.target.value })
  }

  const handleTrainMovementsTypeChange = (e) => {
    setUserPermission({ ...userPermission, trainMovement: e.target.value })
    updateUserPermissions({ ...userPermission, trainMovement: e.target.value })
  }

  const useStyle = makeStyles((theme) => ({
    root: {
      width: '100%',
      maxWidth: 360,
    },
    formControl: {
      width: '100%',
      marginTop: '5px',
    },
    formControlFA: {
      width: '80%',
      height: '60px',
      marginTop: '5px',
    },
    listMember_all: {
      // width: 250,
      maxHeight: 200
    },
    listItemFA: {
      padding: '5px',
      fontFamily: 'Muli'
    },
    tetraSwitch: {
      fontFamily: 'Muli',
      marginTop: '2px',
      marginRight: '1px'
    }
  }));
  const classes = useStyle()

  return (
    <div>
      <div class="fa-template-profile" >
        <FormControlLabel className={classes.tetraSwitch}
          value="start"
          control={<Switch color='primary' checked={userPermission.trainTab} onChange={trainTabChangeHandler} />}
          label="Train Tab"
          labelPlacement='start'
          onChange={trainTabChangeHandler}
        />
        <FormControlLabel className={classes.tetraSwitch}
          value="start"
          control={<Switch color="primary" checked={userPermission.communicationTab} onChange={communicationTabChangeHandler} />}
          label="Communication Tab"
          labelPlacement='start'
          onChange={communicationTabChangeHandler}
        />
        <FormControlLabel className={classes.tetraSwitch}
          value="start"
          control={<Switch color="primary" checked={userPermission.alertTab} onChange={alertsTabrChangeHandler} />}
          label="Alerts Tab"
          labelPlacement='start'
          onChange={alertsTabrChangeHandler}
        />
        <FormControlLabel className={classes.tetraSwitch}
          value="start"
          control={<Switch color="primary" checked={userPermission.baseStation} onChange={radioBaseChangeHandler} />}
          label="Radio Base Station"
          labelPlacement='start'
          onChange={radioBaseChangeHandler}
        />

        <FormControlLabel className={classes.tetraSwitch}
          value="start"
          control={<Switch color="primary" checked={userPermission.locationTab} onChange={locationTabChangeHandler} />}
          label="Location Tab"
          labelPlacement='start'
          onChange={locationTabChangeHandler}
        />

        <FormControlLabel className={classes.tetraSwitch}
          value="start"
          control={<Switch color="primary" checked={userPermission.recordingsTab} onChange={recordingsTabChangeHandler} />}
          label="Recordings Tab"
          labelPlacement='start'
          onChange={recordingsTabChangeHandler}
        />
      </div>

      <div style={{ display: "flex", flexDirection: "row", width: "100%", marginTop: "10px" }}>
        <FormControl style={{ marginRight: "8px" }} variant="filled" className={classes.formControl}>
          <InputLabel id="demo-simple-select-filled-label" className={classes.listItemFA}>TRAIN MOVEMENTS</InputLabel>
          <Select
            className={classes.listItemFA}
            labelId="demo-simple-select-filled-label"
            id="demo-simple-select-filled"
            value={userPermission.trainMovement}
            onChange={handleTrainMovementsTypeChange}
          >
            {trainMovementsTypes && trainMovementsTypes.map((trainMovement) => {
              return (
                <MenuItem value={trainMovement.value}>{trainMovement.type}</MenuItem>
              )
            })}
          </Select>
        </FormControl>

        <FormControl style={{ marginLeft: "8px" }} variant="filled" className={classes.formControl}>
          <InputLabel id="demo-simple-select-filled-label" className={classes.listItemFA}>GRAB ALLOWED</InputLabel>
          <Select
            className={classes.listItemFA}
            labelId="demo-simple-select-filled-label"
            id="demo-simple-select-filled"
            value={userPermission.grabAllowed}
            onChange={handleGrabAllowedTypeChange}
          >
            {grabTypes && grabTypes.map((grabType) => {
              return (
                <MenuItem value={grabType.value}>{grabType.type}</MenuItem>
              )
            })}
          </Select>
        </FormControl>
      </div>

      {/* <button
        class="update-btn-profile"
        type="button"
        style={{ marginTop: "16px", marginBottom: "16px" }}
        onClick={UpdateBasicDetails}>
        {purpose === 'edit' ? 'UPDATE' : 'SUBMIT'}
      </button> */}
    </div>
  )
}

export default UserPermissions
