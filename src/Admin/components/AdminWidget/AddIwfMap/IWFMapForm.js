import React, { useState, useEffect } from "react";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import { makeStyles } from "@material-ui/styles";
import { connect } from "react-redux";

const DefaultInfoData = {
  id: "",
  type: "",
  fa: "",
  mcpttId: "",
  fa_mcpttid: "FA",
  errors: {}
};

const IwfMapForm = (props) => {
  const {
    infoHandler,
    infoData,
    purpose,
    configDomain,
    mappedFilter,
    hideIwfIdView
  } = props;
  const [iwfInfo, SetIwfInfo] = useState(DefaultInfoData);
  const [iwfMapType, SetIwfMapType] = useState([]);
  const [selectedIwfMapType, SetSelectedIwfMapType] = useState(false);
  const [firstTime, setFirstTime] = useState(true)

  useEffect(() => {
    if (configDomain && configDomain.iwfs && configDomain.iwfs.length > 0) {
      let faSupportArray = []
      for (let index = 0; index < configDomain.iwfs.length; index++) {
        const element = configDomain.iwfs[index];
        if (mappedFilter) {
          if (element.supportsFA && element.supportsFA == 'true' && element.tunneledIwf == 'false') {
            faSupportArray = [...faSupportArray, element]
          }
        } else {
          if (element.tunneledIwf == 'false') {
            faSupportArray = [...faSupportArray, element]
          }
        }
      }
      console.log('faSupportArray...', faSupportArray, infoData)
      SetIwfMapType(faSupportArray)
      if (infoData && !isEmptyObject(infoData) && infoData.id && infoData.id.length > 0 ) {
        console.log('faSupportArray infoData...', infoData)
        SetIwfInfo(infoData)
        infoHandler({
          ...infoData,
          type: infoData.type,
          errors: {},
        })
        SetSelectedIwfMapType(true)
      } 
    }
  }, []);

  useEffect(() => {
    if (infoData && !isEmptyObject(infoData) && infoData.id && infoData.id.length > 0) {
      if (firstTime) {
        console.log('faSupportArray infoData useEffect..', infoData)
        SetIwfInfo(infoData)
        infoHandler({
          ...infoData,
          type: infoData.type,
          errors: {},
        })
        setFirstTime(false)
        SetSelectedIwfMapType(true)
      }
    }
  }, [infoData])

  const typeChangeHandler = (e) => {
    infoHandler({
      ...iwfInfo,
      type: e.target.value,
      errors: {},
    })
    SetIwfInfo({
      ...iwfInfo,
      type: e.target.value,
      errors: {},
    });
    SetSelectedIwfMapType(true)
  };

  const idChangeHandler = (e) => {
    infoHandler({
      ...iwfInfo,
      id: e.target.value,
      errors: {},
    })
    SetIwfInfo({
      ...iwfInfo,
      id: e.target.value,
      errors: {},
    });
  };

  const isEmptyObject = (obj) => {
    return obj
      && Object.keys(obj).length === 0
      && Object.getPrototypeOf(obj) === Object.prototype
  }

  const useStyles = makeStyles((theme) => ({
    root: {
      width: "100%",
      maxWidth: 360,
    },
    formControl: {
      width: "100%",
      marginTop: "5px",
    },
    formControlFA: {
      width: "80%",
      height: "60px",
      marginTop: "5px",
    },
    listMember_all: {
      // width: 250,
      maxHeight: 200,
    },
    listItemFA: {
      padding: "5px",
      fontFamily: "Muli",
    },
    tetraSwitch: {
      fontFamily: "Muli",
      marginTop: "2px",
      marginRight: "1px",
    },
  }));

  const classes = useStyles();
  return (
    <div>
      <div class="tab1-account">
        <div class="form-group">
          <FormControl variant="filled" className={classes.formControl}>
            <InputLabel
              id="demo-simple-select-filled-label"
              className={classes.listItemFA}
            >
              IWFs
            </InputLabel>
            <Select
              className={classes.listItemFA}
              labelId="demo-simple-select-filled-label"
              id="demo-simple-select-filled"
              value={iwfInfo ? iwfInfo.type : ''}
              onChange={typeChangeHandler}
            >
              {iwfMapType &&
                iwfMapType.map((iwf) => {
                  return (
                    <MenuItem value={iwf.type}>{iwf.name}</MenuItem>
                  );
                })}
            </Select>
          </FormControl>
          <p>{(iwfInfo && iwfInfo.errors && iwfInfo.errors.hasOwnProperty("type")) ? iwfInfo.errors["type"] : ""}</p>
        </div>
        {hideIwfIdView == false && selectedIwfMapType ?
          <div class="form-group">
            <label class="attribute-heading">Iwf Id</label>
            <input
              type="text"
              disabled={purpose && purpose === "edit"}
              class="form-control"
              value={iwfInfo ? iwfInfo.id : ''}
              id="name"
              onChange={idChangeHandler}
            />
            <p>{(iwfInfo && iwfInfo.errors && iwfInfo.errors.hasOwnProperty("id")) ? iwfInfo.errors["id"] : ""}</p>
          </div>
          :
          null
        }
      </div>
      <div>
      </div>
    </div>
  );
};

const mapStateToProps = ({ domains }) => {
  const { configDomain } = domains
  return {
    configDomain
  };
};

export default connect(mapStateToProps, null)(IwfMapForm);
