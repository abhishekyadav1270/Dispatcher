import React from "react";
import SearchCollapseTab from "./SearchCollapseTab";

export const TitleTab = (props) => {
  return (
    <div class={props.class ? props.class : ""}>
      {props.type === "none" ? (
        <div class="title-grid-1">
          <div class="title">
            <div class="pt-6 pb-6 pr-6 pl-6 f-18 f-reg white muli">
              {props.title}
            </div>
          </div>
        </div>
      ) : null}

      {props.type !== "none" ? (
        <div class="title-grid-2">
          <div class="title">
            <div class="pt-6 pb-6 pr-6 pl-6 f-18 f-reg white">
              {props.title}
            </div>
          </div>
          <div class="search">
            {props.type === "userListTab" ? (
              <SearchCollapseTab
                search={props.search}
                indvGrp={props.filtr}
                userList={true}
              />
            ) : null}
            {props.type === "orgTab" ? (
              <SearchCollapseTab
                search={props.search}
                indvGrp={props.filtr}
                userList={true}
              />
            ) : null}
            {props.type === "template" ? (
              <SearchCollapseTab
                search={props.search}
                indvGrp={props.filtr}
                template={true}
              />
            ) : null}
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default TitleTab;
