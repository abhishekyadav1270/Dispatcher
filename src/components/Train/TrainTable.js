import React, { useState, useEffect } from "react";
import { connect } from "react-redux";

//Other
import { } from "../../modules/actions";
import { Title } from "../commom/Title";
import TrainTableRow from "./TrainTableRow";

function TrainTable({ trainDetails }) {
    const [filtered, setFiltered] = useState();
    const [lastfiltered, setLastFiltered] = useState();
    const [isSearch, setSearched] = useState(false);
    useEffect(() => {
        if (!isSearch) {
            setFiltered(trainDetails);
            setLastFiltered(trainDetails);
        }
        console.log("traintable trainNum data :", trainDetails);
    }, [trainDetails])
    //functions

    const searchTrain = (searchTrain) => {
        let filterTrain;
        const search = searchTrain.toLowerCase();
        if (search) {
            filterTrain = lastfiltered.filter(train =>
                (train.trainID && train.trainID.toLowerCase().includes(search)) ||
                (train.PTID && train.PTID.toString().toLowerCase().includes(search)) ||
                (train.radioID && train.radioID.toString().toLowerCase().includes(search)) ||
                (train.rakeId && train.rakeId.toLowerCase().includes(search))
            )
            setFiltered(filterTrain);
            setSearched(true);
        }
        else {
            setFiltered(lastfiltered);
            setSearched(false);
        }
    }

    const getTrainNo = (trainNum) => {
        if (trainNum) {
            let trainArr = trainNum.split("-");
            if (trainArr.length > 1) {
                trainArr.pop();
                return trainArr.join("-");
            }
            return trainNum
        }
        return trainNum
    }

    return (
        <div>
            <Title title="Train Details" type="TD" search={searchTrain} />
            <div class="trainTable-row-grid-head">
                {/* <div class="trt-tb-cb">
                    <input type="checkbox" />
                </div> */}
                <div class="trt-tb-tno train-cell-center ">
                    <span>Train-No</span>
                </div>
                <div class="trt-tb-dir train-cell-center ">
                    <span>Dir</span>
                </div>
                <div class="trt-tb-tgrp train-cell-center ">
                    <span>Train-Grp</span>
                </div>
                <div class="trt-tb-gf train-cell-center">
                    <span>LA</span>
                </div>
                <div class="trt-tb-sgrp train-cell-center train-cell-ml-30 ">
                    <span>Station-Master</span>
                </div>
                <div class="trt-tb-zgrp train-cell-center">
                    <span>Controller</span>
                </div>
                <div class="trt-tb-dr train-cell-center">
                    <span>Driver</span>
                </div>
                <div class="trt-tb-astdr train-cell-center">
                    <span>Asst-Driver</span>
                </div>
                <div class="trt-tb-ftrcp train-cell-center ">
                    <span>FTRCP</span>
                </div>
                <div class="trt-tb-rtrcp train-cell-center">
                    <span>RTRCP</span>
                </div>
                <div class="trt-tb-grd train-cell-center">
                    <span>Guard</span>
                </div>
            </div>
            <div style={{ height: "390px", overflowY: "scroll" }}>
                {filtered && filtered.map((data) => {
                    return (
                        <TrainTableRow
                            trainNo={getTrainNo(data.rakeId)}
                            LA={data.line}
                            rakeId={data.rakeId}
                        />
                    );
                }
                )}
                {filtered && filtered.length === 0 ? (
                    <div
                        class="pt-6 pb-6 pr-6 pl-6 f-18 f-reg white"
                        style={{
                            height: "445px",
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                        }}
                    >
                        {isSearch ? "No match found" : "No trains available"}
                    </div>
                ) : null}
            </div>
        </div>
    )
}

const mapStateToProps = ({ train }) => {
    const { trainDetails } = train;
    return {
        trainDetails,
    };
};

export default connect(mapStateToProps, {})(TrainTable);
