import React, { useState, useEffect } from "react";
import { Button } from "@material-ui/core";
import DeleteIcon from "@material-ui/icons/Delete";
import EditLocIcon from "@material-ui/icons/EditLocationSharp";
import { getCallieIdToShow } from "../../utils/lib";
import { Hidden } from "@mui/material";

const MapUserListItem = (props) => {
  const data = props.item;
  const deleteHandler = props.deleteUser;
  const editHandler = props.edituser;

  const showUE = (ueID) => {
    if (data.userId == ueID) {
        return getCallieIdToShow(data.userId)
    }
    if (ueID) {
      if (ueID.split(":") && ueID.split(":").length > 1) {
        ueID = ueID.split(":")[1];
        if (ueID.length >= 15) {
          return `${ueID.substr(0, 15)}...`;
        }
        return ueID;
      } else {
        if (ueID.length >= 15) {
          return `${ueID.substr(0, 15)}...`;
        }
        return ueID;
      }
    }
    return null;
  };

  return (
    <div class="users-loctn-card-grid">
      <div class="user-locatn-info ">
        <span
          class="f-contact-name  blc"
          onClick={() => {
            props.onClick(data);
          }}
        >
          {data.userName}
        </span>
        {/* <span class="f-subs-id  blc">{showUE(data.ueID)}</span> */}
      </div>

      {/* <div class ="user-l1">
        <EditLocIcon  className="user-l1-edit" style={{ height: "27px", width: "27px", color: "#14e014"}} onClick={() => editHandler(data)} />
      </div> */}
      <div class ="user-l2">
        <DeleteIcon style={{ height: "27px", width: "27px" ,color: "#d32222" }} onClick={() => deleteHandler(data.id)} />
      </div>
    </div>
  );
};
export default MapUserListItem;
