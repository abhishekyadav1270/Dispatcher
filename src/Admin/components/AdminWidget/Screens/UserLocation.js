import React, { useEffect, useState } from 'react'
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Switch from "@material-ui/core/Switch";
import { createTheme } from '@material-ui/core/styles';
import { makeStyles, ThemeProvider } from "@material-ui/styles";
import { connect } from "react-redux";
// import TaskCard from "../../../../components/Tasks/TaskCards/taskcard"
import {
  updateUserProfileWithAttachedFAS,
} from '../../../../modules/adminstate';

const UserLocation = (props) => {
  const { purpose, updateUserProfileWithAttachedFAS, userProfileWithAttachedFA } = props
  const initialState = {
    timerOnOFF: false,
    hour: '0',
    min: '0',
    sec: '0'
  }
  const [state, setstate] = useState(initialState)

  const [emptyHour, setEmptyHour] = useState(false)

  useEffect(() => {
    if (purpose === 'edit') {
      setstate({
        ...state,
        timerOnOFF: userProfileWithAttachedFA.locationEnable,
        hour: userProfileWithAttachedFA.locationHour,
        min: userProfileWithAttachedFA.locationMin,
        sec: userProfileWithAttachedFA.locationSec,
      })
    }
  }, [])

  const tetraUserChangeHandler = (e) => {
    setstate({ ...state, timerOnOFF: e.target.checked })
  }
  const hourChangeHandler = (e) => {
    setstate({ ...state, hour: e.target.value })
  }

  const minChangeHandler = (e) => {
    setstate({ ...state, min: e.target.value })
  }

  const secChangeHandler = (e) => {
    setstate({ ...state, sec: e.target.value })
  }

  const UpdateBasicDetails = (e) => {
    e.preventDefault();
    userProfileWithAttachedFA['location'] = state.timerOnOFF
    userProfileWithAttachedFA['hour'] = state.hour
    userProfileWithAttachedFA['min'] = state.min
    userProfileWithAttachedFA['sec'] = state.sec
    updateUserProfileWithAttachedFAS(userProfileWithAttachedFA)
    props.locationUpdateHandler();
  };


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
      <FormControlLabel className={classes.tetraSwitch}
        value="start"
        control={<Switch color="primary" checked={state && state.timerOnOFF} onChange={tetraUserChangeHandler} />}
        label="Location ON/OFF"
        labelPlacement='start'
        onChange={tetraUserChangeHandler}

      />

      <div class="form-group">
        <label class="attribute-heading">Hang Timer</label>
        <div class="hang-time-conatiner">
          {/* <input
            type="text"
            class="hang-time-input"
            id="_hrs"
            maxLength="2"
            pattern="[0-9]*"
            value={state.hour}
            onChange={hourChangeHandler}
          />
          <label class="hang-time-label">Hr</label>
          <input
            type="text"
            class="hang-time-input"
            id="hangtimer_min"
            maxLength="2"
            pattern="[0-9]*"
            value={state.min}
            onChange={minChangeHandler}
          />
          <label class="hang-time-label">Min</label> */}
          <input
            type="text"
            class="hang-time-input"
            id="hangtimer_sec"
            maxLength="2"
            pattern="[0-9]*"
            value={state.sec}
            onChange={secChangeHandler}
          />
          <label class="hang-time-label">Sec</label>
        </div>
        {
          emptyHour === true ?
            (
              <label class="error-handling-lbl">Please enter timer</label>
            )
            :
            null
        }
      </div>
      <button
        class="update-btn-profile"
        type="button"
        onClick={UpdateBasicDetails}>
        {purpose === 'edit' ? 'UPDATE' : 'SUBMIT'}
      </button>
    </div>
  )
}

const mapStateToProps = ({ adminstate }) => {

  const { userProfileWithAttachedFA } = adminstate;
  //console.log('userlist reducer', userlist)
  return {
    userProfileWithAttachedFA
  };
}

export default connect(mapStateToProps, {
  updateUserProfileWithAttachedFAS
})(UserLocation);
