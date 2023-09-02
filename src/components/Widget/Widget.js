import React, { useEffect, useState } from "react";
import { connect } from "react-redux";

import CallWidget from "./Call_Widget";
import SDSWidget from "./SDS_Widget";
import DGNAWidget from "./DGNA_Widget";
import Todo from "./Todo";
import "../../constants/verConfig";

export const Widget = (props) => {
  const [menuOptions, setMenuOptions] = useState([
    {
      text: "New Call",
      value: 1,
      IconSrc: "assets/images/svg-main/call.svg",
      id: "v-pills-home-tab",
      aria: "v-pills-home",
      disable: false,
    },
    {
      text: "Send SDS",
      value: 2,
      IconSrc: "assets/images/svg-main/sendsds.svg",
      id: "v-pills-profile-tab",
      aria: "v-pills-profile",
      disable: false,
    },
    {
      text: "DGNA",
      value: 3,
      IconSrc: "assets/images/svg-main/dgna.svg",
      id: "v-pills-messages-tab",
      aria: "v-pills-messages",
      disable: false,
    },
    // {text:'',value:4, IconSrc:"assets/images/svg-main/todo.svg",id:"v-pills-settings-tab",aria:"v-pills-settings",disable:false },
    // {text:'',value:5, IconSrc:"feather icon-hash f-22",id:"v-pills-settings-tab",aria:"v-pills-settings",disable:true },
    // {text:'',value:6, IconSrc:"feather icon-hash f-22",id:"v-pills-settings-tab",aria:"v-pills-settings",disable:true },
    // {text:'',value:7, IconSrc:"feather icon-hash f-22",id:"v-pills-settings-tab",aria:"v-pills-settings",disable:true },
  ]);
  const [selected, setSelected] = useState(1);
  const { configDGNA } = props;
  // console.log("inside widget-->" , configDGNA);
  useEffect(() => {
    let newOption = menuOptions;
    if (!global.config.userConfig["calls"]) {
      newOption = newOption.filter((tab) => tab.value !== 1);
      setSelected(2);
    }
    if (!global.config.userConfig["dgna"]) {
      newOption = newOption.filter((tab) => tab.value !== 3);
      setSelected(1);
    }
    // console.log("inside widget useEffect-->" , configDGNA);
    setMenuOptions(newOption);
  }, []);

  return (
    <div>
      <div class="c1-grid">
        <div class="c1-menu">
          <center>
            <div
              class="nav flex-column nav-pills"
              id="v-pills-tab"
              role="tablist"
              aria-orientation="vertical"
            >
              {menuOptions.map((tab, id) => {
                return (
                  <div
                    style={
                      !configDGNA && tab.text === "DGNA"
                        ? { display: "none" }
                        : null
                    }
                  >
                    <a
                      class={
                        "nav-link tbs " +
                        (tab.disable ? "opacity-30 disabled " : "") +
                        (tab.value === selected ? "active" : "")
                      }
                      style={
                        tab.disable
                          ? { height: "71px", paddingTop: "22px" }
                          : {}
                      }
                      id={tab.id}
                      data-toggle="pill"
                      // href={tab.aria}
                      role="tab"
                      aria-controls={tab.aria}
                      aria-selected={selected === tab.value}
                      onClick={() => setSelected(tab.value)}
                      key={id}
                    >
                      {!tab.disable ? (
                        <React.Fragment>
                          <div class="icons-svg w-embed">
                            <img
                              class="icons-svg w-embed"
                              src={tab.IconSrc}
                              alt={tab.value}
                            />
                          </div>{" "}
                          {tab.text}
                        </React.Fragment>
                      ) : (
                        <i class="feather icon-hash f-22"></i>
                      )}
                    </a>
                  </div>
                );
              })}
            </div>
          </center>
        </div>

        <div class="c1-tab">
          <div class="tab-content" id="v-pills-tabContent">
            <div
              class="tab-pane fade show active"
              id="v-pills-home"
              role="tabpanel"
              aria-labelledby="v-pills-home-tab"
            >
              <div class="wrap-2">
                {selected === 1 ? <CallWidget /> : null}
                {selected === 2 ? <SDSWidget /> : null}
                {selected === 3 ? <DGNAWidget /> : null}
                {selected === 4 ? <Todo /> : null}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const mapStateToProps = ({ enableDgna }) => {
  const { configDGNA } = enableDgna;
  return {
    configDGNA,
  };
};

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(Widget);
