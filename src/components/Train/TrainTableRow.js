import React from 'react'
import { ContextMenu } from '../commom';
import { getRandomString } from '../../utils/lib';

function TrainTableRow(props) {
    const { trainNo, LA, rakeId } = props

    const getTrainNo = (trainNum) => {
        if (trainNum) {
            let trainDetails = trainNum.split("-");
            if (trainDetails.length >= 2) {
                return trainDetails[0];
            }
        }
        return trainNum;
    }
    const getTrainDirection = (trainNum)=>{
        if(trainNum){
            let trainDetails = trainNum.split("-")
            if(trainDetails.length >=3){
                return trainDetails[2]
            }
        }
        return ""
    }
    return (
        <div class="trainTable-row-grid">
            {/* <div class="trt-tb-cb">
                    <input type="checkbox" />
                </div> */}
            <div class="trt-tb-tno train-cell-center">
                <span>{getTrainNo(trainNo)}</span>
            </div>
            <div class="trt-tb-dir train-cell-center">
                <span>{getTrainDirection(rakeId)}</span>
            </div>
            <div class="trt-tb-tgrp train-cell-center">
                <ContextMenu id={getRandomString(5)} Class="sds-ops" type={'TDG'} subr={`${trainNo}`} routeName={'trnGrp'} clickOpen={true}>
                    <button class="arrow-icon vg_bottom">
                        <i class="fa fa-caret-right"></i>
                    </button>
                </ContextMenu>
            </div>
            <div class="trt-tb-gf train-cell-center">
                <span>{LA}</span>
            </div>
            <div class="trt-tb-sgrp train-cell-center">
                <ContextMenu id={getRandomString(5)} Class="sds-ops" type={'TD'} subr={`TR-STATIONMASTER-${trainNo}`} routeName={'trn'} isFACall={true} clickOpen={true}>
                    <button class="arrow-icon vg_bottom">
                        <i class="fa fa-caret-right"></i>
                    </button>
                </ContextMenu>
            </div>
            <div class="trt-tb-zgrp train-cell-center">
                <ContextMenu id={getRandomString(5)} Class="sds-ops" type={'TD'} subr={`TR-ZONE-${trainNo}`} routeName={'trn'} isFACall={true} clickOpen={true}>
                    <button class="arrow-icon vg_bottom">
                        <i class="fa fa-caret-right"></i>
                    </button>
                </ContextMenu>
            </div>
            <div class="trt-tb-dr train-cell-center">
                <ContextMenu id={getRandomString(5)} Class="sds-ops" type={'TD'} subr={`TR-DRIVER-${trainNo}`} routeName={'trn'} isFACall={true} clickOpen={true}>
                    <button class="arrow-icon vg_bottom">
                        <i class="fa fa-caret-right"></i>
                    </button>
                </ContextMenu>
            </div>
            <div class="trt-tb-astdr train-cell-center">
                <ContextMenu id={getRandomString(5)} Class="sds-ops" type={'TD'} subr={`TR-ASSTDRIVER-${trainNo}`} routeName={'trn'} isFACall={true} clickOpen={true}>
                    <button class="arrow-icon vg_bottom">
                        <i class="fa fa-caret-right"></i>
                    </button>
                </ContextMenu>
            </div>
            <div class="trt-tb-ftrcp train-cell-center">
                <ContextMenu id={getRandomString(5)} Class="sds-ops" type={'TD'} subr={`TR-FRONTTRCP-${trainNo}`} routeName={'trn'} isFACall={true} clickOpen={true}>
                    <button class="arrow-icon vg_bottom">
                        <i class="fa fa-caret-right"></i>
                    </button>
                </ContextMenu>
            </div>
            <div class="trt-tb-rtrcp train-cell-center">
                <ContextMenu id={getRandomString(5)} Class="sds-ops" type={'TD'} subr={`TR-REARTRCP-${trainNo}`} routeName={'trn'} isFACall={true} clickOpen={true}>
                    <button class="arrow-icon vg_bottom">
                        <i class="fa fa-caret-right"></i>
                    </button>
                </ContextMenu>
            </div>
            <div class="trt-tb-grd train-cell-center">
                <ContextMenu id={getRandomString(5)} Class="sds-ops" type={'TD'} subr={`TR-GUARD-${trainNo}`} routeName={'trn'} isFACall={true} clickOpen={true}>
                    <button class="arrow-icon vg_bottom">
                        <i class="fa fa-caret-right"></i>
                    </button>
                </ContextMenu>
                {/* <span>{guard}</span> */}
            </div>
        </div>
    )
}

export default TrainTableRow