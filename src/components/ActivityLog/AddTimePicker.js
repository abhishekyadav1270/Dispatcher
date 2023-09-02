import React, { Component, useState, useEffect } from "react";
import DatePicker from "react-datepicker"
import "react-datepicker/dist/react-datepicker.css"

const AddTimePicker = (props) => {

    const UpdateExportDetails = () => {
        props.exportBtnClick(fromDate, toDate)
    }
    const myStyle = {
        color: "black",
        padding: "10px",
        fontFamily: "Sans-Serif"
    };

    const [fromDate, setFromDate] = useState(new Date());
    const [toDate, setToDate] = useState(new Date());

    return (
        <div >
            <h1 style={myStyle} >From :</h1>
            <DatePicker
                style={myStyle}
                selected={fromDate}
                onChange={(date) => {
                    setFromDate(date)
                }}
            />
            <h1 style={myStyle}>To : </h1>
            <DatePicker
                style={myStyle}
                selected={toDate}
                onChange={(date) =>
                    setToDate(date)
                } 
            />
            <button
                class="update-btn-profile"
                type="button"
                onClick={UpdateExportDetails}
            >
                Export

            </button>
        </div>
    );


}
export default AddTimePicker;