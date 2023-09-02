import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { Tooltip, OverlayTrigger } from "react-bootstrap";
import { DISPACTHER_MODE, DISPACTHER_MODES } from "../../constants/constants";
// import './styles.css'

//Other files

const propTypes = {
  propData: PropTypes.array,
};


const SearchCollapse = (props) => {
  const [seen1, setSeen1] = useState(true);
  const [seen2, setSeen2] = useState(false);
  const [serchText, setSearchText] = useState("");
  const { search, userList, template, org, indvGrp } = props;
  const collapse = () => {
    setSeen1(!seen1);
    setSeen2(!seen2);
    search("");
  };

  const searchEntered = (text) => {
    setSearchText(text);
    search(text);
  };

  return (
    <div class="flt-l">
      {seen1 ? (
        <div class="in-blc">
          {userList ? (
            <React.Fragment>
              <FilterButton
                iconclass={"feather icon-plus-circle f-16 text-success"}
                filtr={indvGrp}
                info={"Add User"}
                type={"add"}
              />
              <FilterButton
                iconclass={"feather icon-user mr-2"}
                filtr={indvGrp}
                info={"Individual"}
                type={"indv"}
              />
              <FilterButton
                  iconclass={"feather icon-map mr-2"}
                  filtr={indvGrp}
                  info={"IWF Map"}
                  type={"iwf_map"}
                  />
                  <FilterButton
                  iconclass={"feather icon-alert-triangle mr-2"}
                  filtr={indvGrp}
                  info={"ALERTS"}
                  type={"alerts"}
                  />
                  <FilterButton
                  iconclass={"feather icon-aperture mr-2"}
                  filtr={indvGrp}
                  info={"Org"}
                  type={"org"}
                  />
                  <FilterButton
                  iconclass={"feather icon-users mr-2"}
                  filtr={indvGrp}
                  info={"Group"}
                  type={"grp"}
                  />
            </React.Fragment>
          ) : null}
            {org ? (
            <React.Fragment>
              <FilterButton
                iconclass={"feather icon-plus-circle f-16 text-success"}
                filtr={indvGrp}
                info={"Add Org"}
                type={"add"}
              />
              <FilterButton
                iconclass={"feather icon-user mr-2"}
                filtr={indvGrp}
                info={"Individual"}
                type={"indv"}
              />
              <FilterButton
                iconclass={"feather icon-users mr-2"}
                filtr={indvGrp}
                info={"Group"}
                type={"grp"}
              />
            </React.Fragment>
          ) : null}
          {template ? (
            <React.Fragment>
              <FilterButton
                iconclass={"feather icon-plus-circle f-16 text-success"}
                filtr={indvGrp}
                info={"Add Template"}
                type={"add"}
              />
              
            </React.Fragment>
          ) : null}
          {userList ? (
            <button
              class="sq-icon-btn in-blc m-r-5 wx32"
              onClick={collapse}
              type="button"
              id=""
            >
              <i class="fa fa-search f-16"> </i>
            </button>
          ) : null}
        </div>
      ) : null}

      {seen2 ? (
        <div class="input-group in-blc">
          <input
            type="text"
            class="textinput searchinput w80 in-blc"
            autoFocus
            placeholder="Search"
            aria-label="Search"
            aria-describedby="button-addon2"
            onChange={(e) => searchEntered(e.target.value)}
          />
          <button
            class="btnsearch in-blc"
            onClick={collapse}
            type="submit"
            id="button-addon2"
          >
            <i class="feather icon-chevron-right"> </i>
          </button>
        </div>
      ) : null}
    </div>
  );
};

const FilterButton = (props) => {
  const { info, filtr, btnClass, iconclass, type, active } = props;
  const filtrType =
    info === "TETRA" ? "tetra" : info === "Individual" ? "indv" : "grp";
  return (
    <OverlayTrigger
      placement="bottom"
      delay={{ show: 250, hide: 400 }}
      overlay={renderTooltip({ info: info })}
    >
      <button
        class={
          btnClass
            ? btnClass
            : "sq-icon-btn in-blc wx32 " + (active === type ? "active" : "")
        }
        onClick={() => filtr(type)}
      >
        <i class={iconclass}></i>
      </button>
    </OverlayTrigger>
  );
};
const renderTooltip = (props) => (
  <Tooltip id="button-tooltip" {...props}>
    {props.info}
  </Tooltip>
);

const mapStateToProps = ({ communication }) => {
  return {};
};

const mapDispatchToProps = (dispatch) => bindActionCreators({}, dispatch);

SearchCollapse.propTypes = propTypes;

export default connect(mapStateToProps, mapDispatchToProps)(SearchCollapse);
