import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux'
import { Tooltip, OverlayTrigger } from 'react-bootstrap';
import { motion } from "framer-motion"

//Other
import { ContextMenu } from '../commom';
import { getRadioId } from '../../utils/lib';
import '../../constants/trainmapConfig'


let hidden = null;
let visibilityChange = null;
if (typeof document.hidden !== 'undefined') { // Opera 12.10 and Firefox 18 and later support 
    hidden = 'hidden';
    visibilityChange = 'visibilitychange';
} else if (typeof document.msHidden !== 'undefined') {
    hidden = 'msHidden';
    visibilityChange = 'msvisibilitychange';
} else if (typeof document.webkitHidden !== 'undefined') {
    hidden = 'webkitHidden';
    visibilityChange = 'webkitvisibilitychange';
}

const TrainIconUpdate = (props) => {
    const { selectedline, moveTo, dirn, coordY, train } = props;
    const [animate, setAnimate] = useState(false);
    useEffect(() => {
        setAnimate(true)
        console.log("useEffect in trainIconUpodate : " + coordX + " " + coordY + " " + train.line)
        document.addEventListener(visibilityChange, handleVisibilityChange, false);
        return () => {
            document.removeEventListener(visibilityChange, handleVisibilityChange);
        }
    }, [])

    //functions
    const handleVisibilityChange = () => {
        if (document[hidden]) {
            setAnimate(false)
        } else {
            setAnimate(true)
        }
    }

    const renderTooltip = (props) => (
        <Tooltip id="button-tooltip" {...props}>
            {props.stn}
        </Tooltip>
    );

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
    const trainConfig = global.config.trainConfig;
    const lteGap = trainConfig.lteGap;
    const lteSize = trainConfig.lteSize;
    const dotSpace = lteSize + (lteGap * 2);
    // const widthOfGreenIcon = dotSpace / 2;
    // const trainGreenIconWrtTrainIconArea = (90.72 - widthOfGreenIcon) / 2
    // const trainGreenIconPostnWRTmovingtoX0 = -(trainGreenIconWrtTrainIconArea);                 // 98 :width of whole area of train icon 
    //let coordX = moveTo //+widthOfGreenIcon/2+trainGreenIconPostnWRTmovingtoX0; 
    //     let foundLTE = false
    //     let next = null;
    //     let lte = null;
    //     let prev=null;
    //     let diffLTEDist=0;
    //     console.log("Gaddar --->" ,tracks);
    //     if(tracks!=null){

    //     for (let i = 0; i < tracks.length; i++) {
    //         const line = tracks[i][train.line];
    //         if (line && line[dirn]) {
    //             // const lte = line[postn].filter(LTE => LTE.name.toString().toUpperCase() === data.virtualTrackCircuit.toString().toUpperCase() || LTE.divergeName === data.virtualTrackCircuit);
    //             let lteArr = line[dirn];
    //             for (let l = 0; l < lteArr.length; l++) {
    //                 if (lteArr[l].name.toString().toUpperCase() === train.virtualTrackCircuit.toString().toUpperCase()) {
    //                     lte = lteArr[l];
    //                     if (l + 1 < lteArr.length) {
    //                         next = lteArr[l + 1];
    //                     }
    //                     foundLTE = true;
    //                 }
    //                 if (foundLTE) {
    //                     break;
    //                 }
    //                 prev = lteArr[l];
    //             }
    //             if (foundLTE) {
    //                 break;
    //             }
    //         }
    //     }
    //    }
    //     console.log(next ,"Hindustan " , lte ," " ,prev)

    //     if(foundLTE){
    //         let trainWidth=global.config.trainConfig.trainIcon;
    //         if(next!=null){
    //             diffLTEDist=next.dist-lte.dist;
    //         }
    //         else{
    //             diffLTEDist=dotSpace;
    //         }
    //         if(dirn==='up' || dirn==='down'){
    //             coordX=global.config.trainConfig.startGap+(dotSpace/2)-trainWidth/2;
    //             if(prev!=null){
    //                 coordX= prev.dist+diffLTEDist;
    //             } 
    //         }
    //         if(dirn==='up1'){
    //             coordX=global.config.trainConfig.up1TrackPl+(dotSpace/2)-trainWidth/2+diffLTEDist;
    //         }
    //         if(dirn==='down1'){
    //             coordX=global.config.trainConfig.down1TrackPl+(dotSpace/2)-trainWidth/2+diffLTEDist;
    //         }
    //         if(dirn==='mid'){
    //             coordX=global.config.trainConfig.midTrackPl+(dotSpace/2)-trainWidth/2+diffLTEDist;
    //         }
    //     }
    let coordX = moveTo - dotSpace / 1.7;
    if (process.env.REACT_APP_PROJECT === 'cdot') {
        coordX = coordX + 30
    }
    console.log("inTrainMovement : " + coordX + " " + coordY)
    if (dirn === 'up1' || dirn === 'down1') {
        console.log("inTrainMovement : " + coordX + " " + coordY)
        coordX = coordX - 50;
        coordX = (train.virtualTrackCircuit === "6UNVT01A") ? coordX - 35 : coordX;
    }
    if (dirn === 'mid') {
        coordX = coordX + global.config.trainConfig.midTrackX;
    }

    const renderNSTrainIcon = (train) => {  //downTrack Train Icon
        const mid = false;
        //const { selectedline, moveTo, dirn,coordY } = props;
        //const radioData = getRadioId(props.radioData, train.rakeId, train.movementDirection, train.activeCab)
        const radioData = (process.env.REACT_APP_ISRAILWAY).toLowerCase() == 'true' ? null : getRadioId(props.radioData, train.rakeId, train.movementDirection, train.activeCab);
        let routename = (process.env.REACT_APP_ISRAILWAY).toLowerCase() == 'true' ? 'trn' : ''
        let type = (process.env.REACT_APP_ISRAILWAY).toLowerCase() == 'true' ? 'TDS' : 'TS'
        let traindata = (process.env.REACT_APP_ISRAILWAY).toLowerCase() == 'true' ? `TR-FRONTTRCP-${getTrainNo(train.rakeId)}` : null
        let isFACall = (process.env.REACT_APP_ISRAILWAY).toLowerCase() == 'true' ? true : false
        return (
            <ContextMenu id={train.rakeId.toString()} key={train.rakeId.toString()} type={type} subr={radioData ? radioData.radioId : traindata} inactiveRadio={radioData && radioData.inactiveRadioId} paId={radioData && radioData.livePaId} routeName={routename} isFACall={isFACall}>
                <OverlayTrigger
                    placement="bottom"
                    delay={{ show: 250, hide: 400 }}
                    overlay={renderTooltip({ stn: train.rakeId })}
                >
                    <motion.div class="train-move" style={{ ...props.style, marginTop: 20, zIndex: 5 }}
                        // <motion.div class="train-move" style={{ ...props.style, zIndex: 10 }}
                        animate={{ x: coordX, y: coordY }}
                        transition={{ duration: animate ? 5 : 0 }}
                    >
                        <div class="train-status" style={{ width: dotSpace / 2 }}></div>
                        <button class="btn" style={{ width: '90px' }} >
                            <img style={{ padding: '6px' }} src={train.movementDirection ? "assets/images/dirn-train-south.svg" : "assets/images/dirn-train-north.svg"} alt={'train'} />
                            <div class="f-12 f-bold gray-0">{`${train.trainNumber} / ${train.rakeId}`}</div>
                        </button>
                    </motion.div>
                </OverlayTrigger>
            </ContextMenu>
        )
    }

    const renderSNTrainIcon = (train) => {  //upTrack Train Icon
        //const { selectedline, moveTo,coordY } = props;
        //const radioData = getRadioId(props.radioData, train.rakeId, train.movementDirection, train.activeCab)
        const radioData = (process.env.REACT_APP_ISRAILWAY).toLowerCase() == 'true' ? null : getRadioId(props.radioData, train.rakeId, train.movementDirection, train.activeCab);
        let routename = (process.env.REACT_APP_ISRAILWAY).toLowerCase() == 'true' ? 'trn' : ''
        let type = (process.env.REACT_APP_ISRAILWAY).toLowerCase() == 'true' ? 'TDS' : 'TS'
        let traindata = (process.env.REACT_APP_ISRAILWAY).toLowerCase() == 'true' ? `TR-FRONTTRCP-${getTrainNo(train.rakeId)}` : null
        let isFACall = (process.env.REACT_APP_ISRAILWAY).toLowerCase() == 'true' ? true : false
        return (
            <ContextMenu id={train.rakeId.toString()} key={train.rakeId.toString()} type={type} subr={radioData ? radioData.radioId : traindata} inactiveRadio={radioData && radioData.inactiveRadioId} paId={radioData && radioData.livePaId} routeName={routename} isFACall={isFACall}>
                <OverlayTrigger
                    placement="top"
                    delay={{ show: 250, hide: 400 }}
                    overlay={renderTooltip({ stn: train.rakeId })}
                >
                    {/* <motion.div class="train-move-left" style={{ ...props.style, top: mid ? 35 : null, zIndex: 10 }}
                        animate={{ x: coordX, y: coordY }}
                        transition={{ duration: animate ? 5 : 0 }}
                    > */}
                    <motion.div class="train-move-left" style={{ ...props.style, zIndex: 5 }}
                        animate={{ x: coordX, y: coordY }}
                        transition={{ duration: animate ? 5 : 0 }}
                    >
                        <button class="btn" style={{ width: '90px' }}>
                            <div class="f-12 f-bold gray-0">{`${train.trainNumber} / ${train.rakeId}`}</div>
                            <img style={{ padding: '6px', color: 'red' }} src={train.movementDirection ? "assets/images/dirn-train-south.svg":"assets/images/dirn-train-north.svg" } alt={'train'} />
                        </button>
                        <div class="train-status m-t-2" style={{ marginTop: '2px', width: dotSpace / 2 }}></div>
                    </motion.div>
                </OverlayTrigger>
            </ContextMenu>
        )
    }

    return (
        <React.Fragment>
            {dirn === 'up' || dirn === 'up1' || dirn === 'mid' ? renderSNTrainIcon(props.train) : renderNSTrainIcon(props.train)}
        </React.Fragment>
    )
}
//ref={this.target}
const mapStateToProps = ({ train }) => {
    const { radioData } = train;
    return {
        radioData
    };
};

export default connect(mapStateToProps, {})(TrainIconUpdate);
// export default TrainIconUpdate
