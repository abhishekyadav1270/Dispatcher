import React from "react";
//import 'bootstrap/dist/css/bootstrap.min.css';
import { Menu } from "semantic-ui-react";
export default function RenderMenu(props) {
  return (
    <Menu vertical color={"#30368f"} borderless={true}>
      <Menu.Item
        name="username"
        active={props.activeItem === "username"}
        onClick={props.handleItemClick}
      >
        <a>
          <i class="feather icon-alert-circle context-icon red-5"></i>
          <span class="red-4">User Name</span>
        </a>
      </Menu.Item>
      <Menu.Item
        name="userid"
        active={props.activeItem === "userid"}
        onClick={props.handleItemClick}
      >
        <a>
          <i class="feather icon-user-check context-icon lime-4"></i>User Id{" "}
        </a>
      </Menu.Item>

      <Menu.Item
        name="mcxid"
        active={props.activeItem === "mcxid"}
        onClick={props.handleItemClick}
      >
        <a>
          <i class="feather icon-user-check context-icon lime-4"></i>MCX Id{" "}
        </a>
      </Menu.Item>

      <Menu.Item
        name="groupname"
        active={props.activeItem === "groupname"}
        onClick={props.handleItemClick}
      >
        <a>
          <i class="feather icon-alert-circle context-icon red-5"></i>
          <span class="red-4">Group Name</span>
        </a>
      </Menu.Item>
      <Menu.Item
        name="groupid"
        active={props.activeItem === "groupid"}
        onClick={props.handleItemClick}
      >
        <a>
          <i class="feather icon-user-check context-icon lime-4"></i>Group Id{" "}
        </a>
      </Menu.Item>

      <Menu.Item
        name="members"
        active={props.activeItem === "members"}
        onClick={props.handleItemClick}
      >
        <a>
          <i class="feather icon-user-check context-icon lime-4"></i>Members{" "}
        </a>
      </Menu.Item>
      <Menu.Item
        name="addremove"
        active={props.activeItem === "addremove"}
        onClick={props.handleItemClick}
      >
        <a>
          <i class="feather icon-star context-icon yellow"></i>{" "}
        </a>
      </Menu.Item>
    </Menu>
  );
}
