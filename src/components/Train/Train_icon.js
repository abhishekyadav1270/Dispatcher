import React, { Component } from 'react'
import { connect } from 'react-redux'
import TrainIconUpdate from './TrainIconUpdate';

class Train_icon extends Component {
    constructor(props) {
        super(props)

        this.state = {
            show: false,
            activeItem: '',
        }
        this.target = React.createRef();
    }

    // componentDidMount(){
    //     console.log('train iconnnnnn')
    // }

    // componentDidUpdate(){
    //     console.log('train iconnnnnn update')
    // }

    // getLTEdist = (linetype, trackPosn, LTEid) => {
    //     const tracks = this.props.track;
    //     let dist;
    //     for (let i = 0; i < tracks.length; i++) {
    //         const line = tracks[i][linetype];
    //         //console.log('train tab line  ', trackPosn, line, LTEid)
    //         if (line && line[trackPosn]) {
    //             const lte = line[trackPosn].filter(LTE => LTE.name.toUpperCase() === LTEid.toUpperCase() || LTE.divergeName === LTEid);
    //             if (lte.length > 0) {
    //                 dist = lte[0].dist;
    //                 return dist;
    //             }
    //         }
    //     }
    // }

    // getMoveingDist = (mvDirn, train) => {
    //     let mid = false, moveTo = '', trackPosn = '';
    //     const { selectedline } = this.props;
    //     if (!mvDirn) {
    //         moveTo = this.getLTEdist(selectedline, 'up', train.virtualTrackCircuit)
    //         trackPosn = 'up';
    //         if (!moveTo) {
    //             moveTo = this.getLTEdist(selectedline, 'down', train.virtualTrackCircuit);
    //             trackPosn = 'down';
    //             if (!moveTo) {
    //                 moveTo = this.getLTEdist(selectedline, 'mid', train.virtualTrackCircuit);
    //                 mid = moveTo ? true : false;
    //                 trackPosn = 'mid';
    //             }
    //         }
    //     }
    //     else if (mvDirn) {
    //         moveTo = this.getLTEdist(selectedline, 'down', train.virtualTrackCircuit)
    //         trackPosn = 'down';
    //         if (!moveTo) {
    //             moveTo = this.getLTEdist(selectedline, 'up', train.virtualTrackCircuit);
    //             trackPosn = 'up';
    //             if (!moveTo) {
    //                 moveTo = this.getLTEdist(selectedline, 'mid', train.virtualTrackCircuit);
    //                 mid = moveTo ? true : false;
    //                 trackPosn = 'mid';
    //             }
    //         }
    //     }
    //     return { moveTo, trackPosn, mid }
    // }

    render() {
        const { trains, selectedline } = this.props;
        return (
            <div>
                {trains && trains.map((train, id) => {
                    console.log("TrainIconTrainSelectedLine :", trains, " ", selectedline)
                    if (train.line.toString() === selectedline.toString()) {
                        return (
                            <TrainIconUpdate
                                selectedline={selectedline.toString()}
                                train={train}
                                dirn={train.trackPosn}
                                moveTo={train.moveTo}
                                coordY={train.coordY}
                            />
                        )
                    }
                    // if (train.line.toString() === selectedline.toString()) {
                    //     let trainData = train
                    //     if (!trainData.trackPosn) {
                    //         trainData = this.getMoveingDist(JSON.parse(train.movementDirection), train);
                    //         //console.log('broadcast train_icon data not move', train, trainData)
                    //     } 
                    //     if (trainData && trainData.trackPosn) {
                    //         console.log('broadcast train_icon data move', trainData, selectedline)
                    //         return (
                    //             <TrainIconUpdate
                    //                 selectedline={selectedline.toString()}
                    //                 train={train}
                    //                 dirn={trainData.trackPosn}
                    //                 moveTo={trainData.moveTo}
                    //                 mid={trainData.mid}
                    //             />
                    //         )
                    //     } else {
                    //         return null
                    //     }
                    // }
                })}
            </div>
        )
    }
}

const mapStateToProps = ({ train }) => {
    const { trains, track } = train;
    return {
        trains, track
    };
};

export default connect(mapStateToProps, {})(Train_icon)