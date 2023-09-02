import React, { Component } from 'react'
import Station from './Station';
import DotLTEs from './LTEs.js';
import { getDistForDiverging } from '../../utils/lib';
import Line from './Line'
import '../../constants/trainmapConfig';
import DepoBasestation from './DepoBasestation'

export default class Train_track extends Component {
    constructor(props) {
        super(props)
        const trainConfig = global.config.trainConfig;
        const lteGap = trainConfig.lteGap;
        const lteSize = trainConfig.lteSize;
        const dotSpace = lteSize + (lteGap * 2);
        const widthOfTrack = dotSpace + (trainConfig.trackCtGap * 2)

        this.state = {
            //trackPoints: [],
            widthOfTrack: widthOfTrack,
            dotSpace: dotSpace,
            p40: 40,
            p80: 80,
            p60: 60
        }
    }
    componentDidMount = async () => {

    }

    getNextLTEDist = (lteName, dirn, tracks, lineType) => {
        let dist = -1
        let dirnSearch = dirn
        if (dirn === 'up') {
            dirnSearch = 'down'
        }
        else if (dirn === 'up1') {
            dirnSearch = 'up'
        }
        else if (dirn === 'dwn') {
            dirnSearch = 'down1'
        }
        else if (dirn === 'mid') {
            dirnSearch = 'mid'
        }

        if (tracks && tracks.length == 0) {
            return dist
        }
        for (let i = 0; i < tracks.length; i++) {
            const line = tracks[i][lineType];
            if (line) {
                const lte = line[dirnSearch].filter(LTE => LTE.name.toString().toUpperCase() === lteName.toString().toUpperCase());
                if (lte.length > 0) {
                    dist = lte[0].dist
                    break
                }
            }
        }
        return dist
    }

    getPrevLTEDist = (lteName, dirn, tracks, lineType) => {
        let dist = -1
        if (tracks && tracks.length == 0) {
            return dist
        }
        let dirnSearch = dirn === 'dwn' ? 'down' : dirn
        for (let i = 0; i < tracks.length; i++) {
            const line = tracks[i][lineType];
            if (line) {
                const lte = line[dirnSearch].filter(LTE => LTE.name.toString().toUpperCase() === lteName.toString().toUpperCase());
                if (lte.length > 0) {
                    if (lteName == "VT01B") {
                        dist = lte[1].dist
                        break
                    }
                    dist = lte[0].dist
                    break
                }
            }
        }
        return dist
    }

    // getCordswrtDist(prevLteDist, nextLteDist, dirn, dirnNextLTE) {
    //     let coords = {};
    //     const trainConfig = global.config.trainConfig;
    //     console.log("Meawwwww", this.state.widthOfTrack)
    //     // const lteGap = trainConfig.lteGap;
    //     // const lteSize = trainConfig.lteSize;
    //     // const dotSpace = lteSize + (lteGap * 2);
    //     // const widthOfTrack = dotSpace + (trainConfig.trackCtGap * 2)
    //     if (dirn = 'up') {
    //         coords.x1 = prevLteDist + trainConfig.svgX + 35.165;
    //         coords.y1 = trainConfig.svgY + this.state.widthOfTrack; //y1=150 + 21   
    //         if (dirnNextLTE === 'down') {
    //             coords.x2 = nextLteDist + trainConfig.svgX + 35.165; //nextLteDist+100+35.165
    //             coords.y2 = trainConfig.svgY + this.state.widthOfTrack + trainConfig.gapBwTracks; //nextLteDist+100+35.165;
    //         }
    //         if (dirnNextLTE === 'mid') {
    //             // x2 = nextLteDist + 100 + 35.165 + 1100;
    //             // y2 = 150 + 60  
    //             coords.x2 = nextLteDist + trainConfig.svgX + 35.165 + 1100;
    //             coords.y2 = trainConfig.svgY + (trainConfig.gapBwTracks + this.state.widthOfTrack) / 2
    //         }
    //     }
    //     if (dirn === 'up1') {
    //         //x1 = prevLteDist + 50 + 35.165;
    //         // y1 = 55

    //         coords.x1 = prevLteDist + 35.165 + 50
    //         coords.y1 = trainConfig.svgY - (trainConfig.gapBwTracks + this.state.widthOfTrack);
    //     }

    //     return coords;
    // }

    getLteCoord = (dirn, lteName) => {
        const trainConfig = global.config.trainConfig;
        dirn = (dirn === 'dwn') ? 'down' : dirn
        const position = ['up', 'down', 'mid', 'up1', 'down1'];
        const data = {};
        let foundLTE = false
        let next = null;
        let lte = null;
        for (let i = 0; i < this.props.tracks.length; i++) {
            const line = this.props.tracks[i][this.props.lineType];
            for (let j = 0; j < position.length; j++) {
                let postn = position[j];
                // if(checkSameTrack===false && dirn===postn ){
                //     break;
                // }
                if (line[postn]) {
                    // const lte = line[postn].filter(LTE => LTE.name.toString().toUpperCase() === lteName.toString().toUpperCase());
                    let lteArr = line[postn];
                    // console.log("trainCircuit----->", trainCircuit);
                    for (let l = 0; l < lteArr.length; l++) {
                        if (lteArr[l].name.toString().toUpperCase() === lteName.toString().toUpperCase()) {
                            lte = lteArr[l];
                            if (l + 1 < lteArr.length) {
                                next = lteArr[l + 1];
                            }
                            foundLTE = true;
                        }
                        if (foundLTE) {
                            break;
                        }
                        //prev = lteArr[l];
                    }

                    if (lte != null) {
                        //console.log("LTE COORDS :", lte, next);
                        foundLTE = true
                        // data.X = lte[0].dist;
                        data.X=lte.dist
                        // data.X = (next === null) ? (lte.dist + (this.state.dotSpace / 2)) : (lte.dist + ((next.dist - lte.dist - global.config.trainConfig.trackCtGap) / 2)) //lte.dist/2 : (lte.dist +next.dist - 5*global.config.trainConfig.trackCtGap)/2;
                        data.X = (lteName === "6UNVT01A") ? lte.dist - 37 : data.X;
                        data.Y = postn === 'up' ? trainConfig.upTrackY : postn == 'down' ? trainConfig.downTrackY : postn === 'mid' ? trainConfig.midTrackY : postn === 'down1' ? trainConfig.down1TrackY : trainConfig.up1TrackY;
                        data.trackPosn = postn
                        break;
                    }
                }
            }
            if (foundLTE) {
                break;
            }
        }
        return data;
    }


    renderDivergenceTemp = (trackCircuit, dirn) => {
        const trainConfig = global.config.trainConfig;
        const LTEs = trackCircuit.LTEs;
        const diverge = trackCircuit.diverging;
        if (LTEs && LTEs.length !== 0 && diverge && diverge.length !== 0) {
            const reversed = dirn === 'dwn' && global.config.trainConfig.downRev ? LTEs.reverse() : LTEs;
            return (
                <>
                    {
                        reversed.map((lte, i) => {
                            if (diverge != null) {
                                for (let k = 0; k < diverge.length; k++) {
                                    let ltename = lte.name
                                    let nextLTE = diverge[k].nextLTE
                                    let prevLTE = diverge[k].prevLTE
                                    let x1 = 0;
                                    let x2 = 0;
                                    let y1 = 0;
                                    let y2 = 0;
                                    if (ltename == nextLTE || ltename == prevLTE) {
                                        let diveObj = diverge[k];
                                        if (diveObj) {
                                            let coordNextLte = this.getLteCoord(dirn, nextLTE);
                                            let coordPrevLte = this.getLteCoord(dirn, prevLTE);
                                            //console.log("coordinateForDivergence : ", coordNextLte, " ", coordPrevLte, "  ", nextLTE, " ", prevLTE);
                                            
                                            x2 = trainConfig.svgX + coordPrevLte.X + 36.165 //wrt to SVGX
                                            y2 = trainConfig.svgY + coordPrevLte.Y + this.state.widthOfTrack / 2;
                                            if (JSON.stringify(coordNextLte) === "{}") {
                                                x1=x2+30;
                                                if(dirn==='up1' || dirn==='up'){
                                                    y1=y2+90;
                                                }
                                                else{
                                                    y1=y2-90;
                                                }
                                            }
                                            else {
                                                x1 = trainConfig.svgX + coordNextLte.X + 36.165 //100 + 50
                                                y1 = trainConfig.svgY + coordNextLte.Y + this.state.widthOfTrack / 2;
                                            }


                                            if (coordNextLte.trackPosn === 'down1') {
                                                x1 = x1 - global.config.trainConfig.down1TrackPl;
                                            }
                                            if (coordPrevLte.trackPosn === 'down1') {
                                                x2 = x2 - global.config.trainConfig.down1TrackPl
                                            }
                                            if (coordNextLte.trackPosn === 'up1') {
                                                x1 = x1 - global.config.trainConfig.up1TrackPl +7;
                                            }
                                            if (coordPrevLte.trackPosn === 'up1') {
                                                x2 = x2 - global.config.trainConfig.up1TrackPl+7 ;
                                            }
                                            if (coordNextLte.trackPosn === 'mid') {
                                                x1 = x1 + trainConfig.midTrackX;
                                            }
                                            if (coordPrevLte.trackPosn === 'mid') {
                                                x2 = x2 + trainConfig.midTrackX;
                                            }
                                        }
                                        return (
                                            <>
                                                <line x1={x1} y1={y1} x2={x2} y2={y2} strokeWidth="1.5" strokeDasharray="10" stroke="white" />
                                                {/* <line x1="1047" y1="0" x2="1045" y2="90" strokeWidth="0.8" strokeDasharray="10" stroke="white" /> */}
                                            </>
                                        )
                                    }
                                }
                            }
                        })
                    }
                </>
            )
        }
    }

    renderDiverge = (trackCircuit, dirn) => {
        let nextLteDist = -1;
        let prevLteDist = -1;
        const LTEs = trackCircuit.LTEs;
        const diverge = trackCircuit.diverging;
        const reversed = dirn === 'dwn' && global.config.trainConfig.downRev ? LTEs.reverse() : LTEs;
        let widthOfDiverge = (reversed.length * global.config.trainConfig.lteSize) + (2 * global.config.trainConfig.trackCtGap) + ((reversed.length - 1) * (global.config.trainConfig.lteSize * 2))
        let x1 = 0
        if (dirn == "up1") {
            console.log("LTEs + diverge :", LTEs, diverge, widthOfDiverge);
        }
        return (
            <div>
                {reversed.map((lte, i) => {
                    let Divergediff = null
                    for (let k = 0; k < diverge.length; k++) {
                        Divergediff = null
                        x1 = 0
                        let ltename = lte.name
                        let nextLTE = diverge[k].nextLTE
                        let prevLTE = diverge[k].prevLTE
                        if (ltename == nextLTE || ltename == prevLTE) {
                            let diveObj = diverge[k]
                            Divergediff = getDistForDiverging(this.props.tracks, this.props.lineType, dirn, diveObj);
                            console.log('DivergenceDiff---->', ltename, Divergediff);
                            if (dirn == 'up1') {
                                console.log('up1----->', Divergediff);
                            }
                            if (Divergediff && Divergediff.mid == false) {
                            }
                            if (diveObj && diveObj.nextLTE) {
                                nextLteDist = this.getNextLTEDist(diveObj.nextLTE, dirn, this.props.tracks, this.props.lineType)

                                console.log('nextLteDist----->', nextLteDist, diveObj.nextLTE);


                            }
                            if (diveObj && diveObj.prevLTE) {
                                prevLteDist = this.getPrevLTEDist(diveObj.prevLTE, dirn, this.props.tracks, this.props.lineType)

                                console.log('up1 prevLteDist----->', prevLteDist, diveObj.prevLTE);

                            }
                            if (i == 0) {
                                x1 = 8
                            } else if (i == reversed.length - 1) {
                                x1 = (i * global.config.trainConfig.lteSize) + (i * (global.config.trainConfig.lteSize * 2))
                            } else {
                                x1 = (i * global.config.trainConfig.lteSize) + 3 + (i * (global.config.trainConfig.lteSize * 2))
                            }
                            console.log('renderDiverge method called x1..', x1, i, ltename, diveObj, Divergediff, widthOfDiverge, nextLteDist, prevLteDist)
                            break;
                        }
                    }
                    if (Divergediff == null) {
                        return null
                    } else {
                        return (
                            <div>
                                {dirn === 'up1' ?
                                    <Line
                                        x={x1}
                                        y={0}
                                        xshift={Divergediff.diff ? Divergediff.diff : 0}
                                        length={Divergediff.mid ? 45 : 90}
                                        nextLteDist={nextLteDist}
                                        prevLteDist={prevLteDist}
                                        vertical={true}
                                        lte={lte}
                                        dirn={'up1'}
                                        siding={false}
                                        widthOfDiverge={widthOfDiverge}
                                    /> : null}
                                {dirn === 'dwn' && Divergediff.mid ?
                                    <Line
                                        x={50}
                                        y={90}
                                        xshift={-10}
                                        length={45}
                                        downtoMid={true}
                                        lte={lte}
                                        dirn={'dwn'}
                                        siding={false}
                                        widthOfDiverge={widthOfDiverge}
                                    /> : null}
                                {dirn === 'up' && Divergediff.siding ?
                                    <Line
                                        x={x1}
                                        y={0}
                                        xshift={Divergediff.direction && Divergediff.direction == 'L' ? -50 : -50}
                                        length={90}
                                        vertical={true}
                                        lte={lte}
                                        dirn={'up'}
                                        siding={true}
                                        widthOfDiverge={widthOfDiverge}
                                    /> :
                                    // null :
                                    (dirn === 'up') ?
                                        <Line
                                            x={x1}
                                            y={0}
                                            xshift={Divergediff.diff ? Divergediff.diff : 0}
                                            length={Divergediff.mid ? 45 : 90}
                                            nextLteDist={nextLteDist}
                                            prevLteDist={prevLteDist}
                                            lte={lte}
                                            vertical={true}
                                            dirn={'up'}
                                            siding={false}
                                            widthOfDiverge={widthOfDiverge}
                                        /> : null}
                                {dirn === 'dwn' && Divergediff.siding ?
                                    <Line
                                        x={50}
                                        y={0}
                                        xshift={Divergediff.direction && Divergediff.direction == 'L' ? 50 : -50}
                                        siding={true}
                                        length={90}
                                        color='blue'
                                        vertical={true}
                                        lte={lte}
                                        dirn={'dwn'}
                                    /> : null}
                            </div>
                        )
                    }
                })}
            </div>
        )
    }

    renderDots = (trackCircuit, id, dirn) => {
        //console.log("trackCircuit -------> ", trackCircuit);
        const lteGap = global.config.trainConfig.lteGap;
        const lteSize = global.config.trainConfig.lteSize;
        let LTEAdjust = null;
        //console.log("LTEgap :", lteGap);
        //console.log("lteSize : ", lteSize);

        if (trackCircuit.rearrange) {
            const arrangeCount = trackCircuit.rearrange;
            //console.log("arrangeCount + ", arrangeCount);
            LTEAdjust = (arrangeCount * lteSize) + ((arrangeCount - 1) * 2) * lteGap + (arrangeCount - 1) * 1.1;

            //console.log('STATION ARRANGED...LTEAdjust...', arrangeCount, lteSize, lteGap, LTEAdjust)
        }

        const LTEs = trackCircuit.LTEs;
        let station = false;
        if (LTEs && LTEs.length == 1) {
            if (trackCircuit.station && trackCircuit.station.length > 0) {
                station = true
            }
        }
        const diverge = trackCircuit.diverging;
        if (LTEs && LTEs.length !== 0 && diverge && diverge.length === 0) {
            const reversed = dirn === 'dwn' && global.config.trainConfig.downRev ? LTEs.reverse() : LTEs;
            return (
                <div>
                    {reversed.map((lte, i) => {
                        if (lte.size) {
                            LTEAdjust = (lte.size * lteSize) + ((lte.size - 1) * 2) * lteGap + (lte.size - 1) * global.config.trainConfig.trackCtGap + 1;
                        }
                        return <DotLTEs id={i} key={i} data={lte} station={station} width={LTEAdjust ? i === 0 ? LTEAdjust + 'px' : null : null} />
                    })}
                </div>
            )
        }
        if (LTEs && LTEs.length !== 0 && diverge && diverge.length !== 0) {
            const reversed = dirn === 'dwn' && global.config.trainConfig.downRev ? LTEs.reverse() : LTEs;
            return (
                <div>
                    {reversed.map((lte, i) => {
                        if (lte.size) {
                            LTEAdjust = (lte.size * lteSize) + ((lte.size - 1) * 2) * lteGap + (lte.size - 1) * global.config.trainConfig.trackCtGap + 1;
                        }
                        let divergeFound = false
                        for (let k = 0; k < diverge.length; k++) {
                            let ltename = lte.name
                            let nextLTE = diverge[k].nextLTE
                            let prevLTE = diverge[k].prevLTE
                            if (ltename == nextLTE || ltename == prevLTE) {
                                divergeFound = true
                                break;
                            }
                        }
                        return (
                            <DotLTEs id={i} key={i} data={lte} station={station} diverge={divergeFound} isempty={false} width={LTEAdjust ? i === 0 ? LTEAdjust + 'px' : null : null} />
                        )
                    })}
                    {/* {trackCircuit.name == "2107T" ? this.renderDiverge(trackCircuit, dirn) : null} */}
                    {/* {this.renderDiverge(trackCircuit, dirn)} */}
                </div>
            )
        }
        if (LTEs && LTEs.length === 0 && diverge && diverge.length !== 0) {
            return (
                <div>
                    <DotLTEs id={id} key={id} data={trackCircuit} isempty={true} station={station} width={LTEAdjust ? LTEAdjust + 'px' : null} />
                </div>
            )
        }
    }

    render() {
        const { } = this.state;
        const { midTrack, upTrack, downTrack, dirn, tracks, lineType } = this.props;
        let length = 1100;
        console.log("midTrack in PlotTrack", midTrack);
        // if (midTrack && midTrack.length > 0) {
        //     for (var i = 0; i < midTrack.length; i++) {
        //         if (midTrack[i].diverging && midTrack[i].diverging.length > 0) {
        //             console.log("midTrack in PlotTrack in loop", midTrack[i]);
        //             const dist = getDistForDiverging(upTrack, downTrack, tracks, lineType, 'mid', midTrack[i].diverging[0])
        //             if (dist < length) length = dist;
        //         }
        //     }
        // }
        const trainConfig = global.config.trainConfig;
        // console.log("configData --->",(trainConfig.gapBwTracks + this.state.widthOfTrack)/2, global.config.trainConfig + " ", `-${trainConfig.svgX}px`, trainConfig.trackView);
        // console.log('GLOBAL',trainConfig,trainConfig.startGap +this.props.adjust*trainConfig.singleLTE,this.props.adjust)
        return (
            <div>
                <svg
                    style={{
                        position: 'absolute',
                        zIndex:1,
                        left: `-${trainConfig.svgX}px`,  //initial start point to draw a line wrt to  up track
                        top: `-${trainConfig.svgY}px`,
                    }}
                    width={trainConfig.svgWidth}
                    height={trainConfig.svgHeight}>
                    {

                        this.props.upTrack && this.props.upTrack.map((trackCircuit, id) => {
                            return (
                                <>
                                    {this.renderDivergenceTemp(trackCircuit, 'up')}
                                </>
                            )
                        })
                    }
                    {
                        this.props.up1Track && this.props.up1Track.map((trackCircuit, id) => {
                            return (
                                <>
                                    {this.renderDivergenceTemp(trackCircuit, 'up1')}
                                </>
                            )
                        })
                    }
                    {
                        this.props.downTrack && this.props.downTrack.map((trackCircuit, id) => {
                            return (
                                <>
                                    {this.renderDivergenceTemp(trackCircuit, 'dwn')}
                                </>
                            )
                        })
                    }
                </svg>
                {/* MID TRACK  */}

                {this.props.midTrack && this.props.midTrack.length > 0 ?
                    <div class='midTrackView'
                        style={{
                            position: 'absolute',
                            top: `${trainConfig.midTrackY}px`,
                            left: `${trainConfig.midTrackX}px`,
                            paddingLeft: `${global.config.trainConfig.midTrackPl}px`,
                            paddingRight: `${this.state.p40}px`,
                        }}>
                        {
                            this.props.midTrack && this.props.midTrack.map((trackCircuit, id) => {
                                return (
                                    <div class='trackCircuits'
                                        style={{ marginRight: trainConfig.trackCtGap + 'px', backgroundColor: 'rgba(128,128,128,.3)' }}
                                    >
                                        {trackCircuit.station && trackCircuit.station.length > 0 ?
                                            <Station stncode={trackCircuit.station[0].abbr} stnname={trackCircuit.station[0].name} dirn={true} />
                                            : null}
                                        {this.renderDots(trackCircuit, id, 'mid')}
                                    </div>
                                )
                            })
                        }
                    </div> : null
                }

                {this.props.up1Track && this.props.up1Track.length > 0 ?
                    <div class='plot-line-up1'
                        style={{
                            position: 'absolute',
                            top: `${trainConfig.up1TrackY}px`,  //90+21
                            left: `${trainConfig.up1TrackX}px`,
                            paddingLeft: `${global.config.trainConfig.up1TrackPl}px`
                        }}>
                        {
                            this.props.up1Track && this.props.up1Track.map((trackCircuit, id) => {
                                return (
                                    <div class='trackCircuits'
                                        style={{ marginRight: trainConfig.trackCtGap + 'px', backgroundColor: 'rgba(128,128,128,.3)' }}
                                    >
                                        {trackCircuit.station && trackCircuit.station.length > 0 ?
                                            <Station stncode={trackCircuit.station[0].abbr} stnname={trackCircuit.station[0].name} dirn={true} />
                                            : null}
                                        {this.renderDots(trackCircuit, id, 'up1')}
                                    </div>
                                )
                            })
                        }
                    </div> : null

                }
                {this.props.down1Track && this.props.down1Track.length > 0 ?

                    <div class='plot-line-down1'
                        style={{
                            position: 'absolute',
                            top: `${trainConfig.down1TrackY}px`, //90 +90+21+21
                            left: `${trainConfig.down1TrackX}px`,
                            paddingLeft:`${global.config.trainConfig.down1TrackPl}px`
                        }}>
                        {
                            this.props.down1Track && this.props.down1Track.map((trackCircuit, id) => {
                                return (
                                    <div class='trackCircuits'
                                        style={{ marginRight: trainConfig.trackCtGap + 'px', backgroundColor: 'rgba(128,128,128,.3)' }}
                                    >
                                        {trackCircuit.station && trackCircuit.station.length > 0 ?
                                            <Station stncode={trackCircuit.station[0].abbr} stnname={trackCircuit.station[0].name} dirn={true} />
                                            : null}
                                        {this.renderDots(trackCircuit, id, 'down1')}
                                    </div>
                                )
                            })
                        }
                    </div>
                    : null}
                <div class='arrowleft'>
                    <i
                        class="feather icon-arrow-right f-14 m-l-100"
                        style={{
                            fontWeight: '800',
                            fontSize: ' 18px !important',
                            position: 'absolute',
                            marginTop: '15px',
                            // marginBottom:'20px',
                            //top:0,  
                            color: '#00b8d4',
                        }}
                    ></i>
                </div>
                <div class='plot-line-north' style={{ paddingLeft: trainConfig.startGap, paddingRight: trainConfig.endGap }}>

                    {
                        this.props.upTrack && this.props.upTrack.map((trackCircuit, id) => {
                            return (
                                <div class='trackCircuits'
                                    style={{ marginRight: trainConfig.trackCtGap + 'px', backgroundColor: 'rgba(128,128,128,.3)' }}
                                >
                                    {trackCircuit.station && trackCircuit.station.length > 0 ?
                                        <Station stncode={trackCircuit.station[0].abbr} stnname={trackCircuit.station[0].name} dirn={true} />
                                        : null}
                                    {this.renderDots(trackCircuit, id, 'up')}
                                </div>
                            )
                        })
                    }
                </div>
                <div
                    class='plot-line-south'
                    style={
                        this.props.adjust && this.props.adjust ?
                            { marginTop: `${trainConfig.gapBwTracks}px`, paddingLeft: (trainConfig.startGap + this.props.adjust * trainConfig.singleLTE) + 'px'}
                            : { marginTop: `${trainConfig.gapBwTracks}px`, paddingLeft: trainConfig.startGap, paddingRight: trainConfig.endGap }
                    }
                >
                    {
                        this.props.downTrack && this.props.downTrack.map((trackCircuit, id) => {
                            return (
                                <div class='trackCircuits-south'
                                    style={{ marginRight: trainConfig.trackCtGap + 'px', backgroundColor: 'rgba(128,128,128,.3)' }}
                                >
                                    {this.renderDots(trackCircuit, id, 'dwn')}
                                </div>
                            )
                        })
                    }
                </div>
                <div>
                    <i
                        class="feather icon-arrow-left f-14 m-l-100"
                        style={{
                            fontWeight: '800',
                            fontSize: ' 18px !important',
                            position: 'absolute',
                            marginTop: '1px',
                            color: '#00b8d4',
                        }}
                    ></i>
                </div>
                <div style={{ position: 'absolute', top: '149px', left: '1px' }}>
                    {global.config.project === 'mumbai' ?
                        <p class='pt-6 pb-6 pr-6 pl-6 f-12 f-reg white'>{lineType == '2A' ? 'UP(North)' : 'UP(South)'}</p>
                        : <p class='pt-6 pb-6 pr-6 pl-6 f-12 f-reg white'>NORTH BOUND</p>
                    }
                </div>
                <div style={{ position: 'absolute', top: '34px', left: '1px' }}>
                    {global.config.project === 'mumbai' ?
                        <p class='pt-6 pb-6 pr-6 pl-6 f-12 f-reg white'>{lineType == '2A' ? 'Down(South)' : 'DOWN(North)'}</p>
                        : <p class='pt-6 pb-6 pr-6 pl-6 f-12 f-reg white'>SOUTH BOUND</p>
                    }
                </div>
                <div style={{ position: 'absolute', top: '220px', marginLeft: '886px', width: '136px', height: '30px' }}>
                    {global.config.project === 'mumbai' && lineType == '2A' ?
                        <DepoBasestation stncode={'CHD'} />
                        : null
                    }
                </div>
            </div>
        )
    }
}



