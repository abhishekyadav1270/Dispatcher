// import {addAlert,editAlert} from "../../../../modules/actions"
import { useTheme } from "@material-ui/core/styles";
import { connect } from "react-redux";
import React, { useState, useEffect } from "react";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import { makeStyles, withStyles } from "@material-ui/core/styles";
import {addAlert,editAlert} from "../../../../modules/adminstate"
const AddAlert = (props)=>{
    const { addAlert, editAlert , alert ,allAlertListType} = props
    const themeAdd = useTheme();
    useEffect(()=>{
      if(alert)
      {
        setstate(alert)
      }
    },[])
    const defaultState = {
        code : '',
        priority : '',
        type : '',
        desc :''
    }  
    const useStyles = makeStyles((theme) => ({
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
        listItemFA: {
          padding: '5px',
          fontFamily: 'Muli',
          marginBottom: 10
        },
        tetraSwitch: {
          fontFamily: 'Muli',
          marginTop: '2px',
          marginRight: '1px'
        }
      }));
    const [state, setstate] = useState(defaultState)
    const classes = useStyles();
    const codeChangeHandler = (e)=>{
         e.persist();
        console.log("codeChangeHandler",e)
        setstate({...state,code : e.target.value})
    }
    const typeChangeHandler = (e)=>{
      setstate({...state,type : e.target.value})
    }
    const descChangeHandler = (e)=>{
      setstate({...state,desc : e.target.value})
    }
    const priorityChangeHandler = (e)=>{
      setstate({...state,priority : e.target.value})
    }

    const UpdateDetails =()=>{
      console.log("to be added or updated",state)
      if(state.code.length ==0){
        setstate({...state,errors : {code : "Please enter code"}})
      }
      else if(state.type.length ==0){
        setstate({...state,errors : {type : "Please enter type"}})
      }
      else if(state.desc.length ==0){
        setstate({...state,errors : {type : "Please enter description"}})
      }
      else if(state.priority.length == 0){
        setstate({...state,errors : {type : "Please enter priority"}})
      }
      else{
        if(alert)
        {
          editAlert(state)
        }else{
          addAlert(state)
        }
        props.hideModal();
      }
      
    }
    return(
        <div style={{padding:20}}>
        <div class="tab1-account">
          <div class="form-group">
            <label class="attribute-heading">CODE</label>
            <input
              type='number'
              disabled={alert}
              class="form-control"
              value={state.code}
              id="name"
              onChange={codeChangeHandler}
            />
            <p class="error-handling-lbl">{ state.errors && (state.errors.hasOwnProperty("code") ? state.errors["code"] : "")}</p>
          </div>
          <div class="form-group">
            <FormControl variant="filled" className={classes.formControl}>
              <InputLabel
                id="demo-simple-select-filled-label"
                className={classes.listItemFA}
              >
                Type
              </InputLabel>
              <Select
                className={classes.listItemFA}
                labelId="demo-simple-select-filled-label"
                id="demo-simple-select-filled"
                value={state.type}
                onChange={typeChangeHandler}
              >
                {allAlertListType &&
                  allAlertListType.map((usertype) => {
                    return (
                      <MenuItem value={usertype}>{usertype}</MenuItem>
                    );
                  })}
              </Select>
            </FormControl>
          </div>
  
          <div class="form-group">
            <label class="attribute-heading">Describtion</label>
            <input
              type="text"
             
              class="form-control"
              value={state.desc}
              id="name"
              onChange={descChangeHandler}
            />
            <p class="error-handling-lbl">{state.errors &&  (state.errors.hasOwnProperty("desc") ? state.errors["desc"] : "")}</p>
          </div>

          <div class="form-group">
            <label class="attribute-heading">Priority</label>
            <input
              type='number'
              min='0'
              class="form-control"
              value={state.priority}
              id="name"
              onChange={priorityChangeHandler}
            />
            <p class="error-handling-lbl">{state.errors && (state.errors.hasOwnProperty("priority") ? state.errors["priority"] : "")}</p>
          </div>
        </div>
       <div>
       <button
          class="add-btn-iwf-map"
          type="button"
          onClick={UpdateDetails}
        >
         {alert ? 'UPDATE' : 'SUBMIT' }
        </button>
       </div>
      </div>
    )
}

const mapStateToProps = ({ adminstate }) => {
    const { allAlertListType } = adminstate;
  
    return {
        allAlertListType
      
    };
  };

export default connect(mapStateToProps, {
    addAlert,
    editAlert
  })(AddAlert);