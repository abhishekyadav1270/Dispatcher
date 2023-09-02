import React from 'react'
import PropTypes from 'prop-types'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { Popup } from 'semantic-ui-react';
import { ButtonGroup, ToggleButton } from 'react-bootstrap'
import '../../constants/verConfig'
import { } from "../../constants/constants"
import { getNewLTE, getLTEsOnlywithDistance, getMidTrackwithDistance, setMaxLTE } from "../../utils/lib"
import TrainGrab from './train_grab';
//Other files
import Train_icon from './Train_icon';
import PlotTrack from './PlotTrack';
import Depot from './Depo';
import { atsMessageReceived, fetchTrackcircuits, fetchActiveTrains, updateTrainPosn, fetchAllBaseStations } from '../../modules/actions';
import { SystemDGNA } from '../commom';

const propTypes = {
    propData: PropTypes.array
}

class TrainMap extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            start: 0,
            trackloaded: false,
            option: '',
            type: '',
            adjust: null,
            options: [
                { text: "Live PA", value: "1" },
                { text: "Emergency", value: "2" },
            ],
            tabs: [],
            selectedHotkey: '1',
            orange: [],
            aqua: [],
            showModal: false
        }
    }

    componentDidMount = async () => {
        console.log("tabData in componentDidMount------>",this.props.tabs)
        if (this.props.tabs.length > 0) {
            this.PlotLines();
            this.setState({ trackloaded: true })
        }
    }

    componentDidUpdate = async (prevProps, prevState) => {
        if (this.state.tabs.length > 0 && !this.state.trackloaded) {
            this.PlotLines();
            this.setState({ trackloaded: true })
            // this.props.fetchActiveTrains();
        }
    }

    static getDerivedStateFromProps = (nextProps, prevState) => {
        if (nextProps.tabs.length > 0 && nextProps.lines.length > 0) {
            return { tabs: nextProps.tabs };
        }
        else return null;
    }

    PlotLines = async () => {
        const { tabs, lines } = this.props;
        console.log("tabData & lines in plotLines------>",tabs ,lines)
        for (let i = 0; i < tabs.length; i++) {
            const type = tabs[i].type;
            const trackDepo = tabs[i].value; //Line value type
            let upTrack = [], downTrack = [], midTrack = [] ,up1Track =[] ,down1Track=[];
            if (type === 'line') {
                const LineName = tabs[i].alias;
                upTrack = lines.filter(track => {
                    return track.direction === 'up' && track.line === trackDepo //value of track line #orange or #aqua
                })
                downTrack = lines.filter(track => {
                    return track.direction === 'down' && track.line === trackDepo
                }).reverse();

                midTrack = lines.filter(track => {
                    return track.direction === 'mid' && track.line === trackDepo
                }).reverse();

                up1Track = lines.filter(track => {
                    return track.direction === 'up1' && track.line === trackDepo
                });

                down1Track = lines.filter(track => {
                    return track.direction === 'down1' && track.line === trackDepo
                });

                const arrangedTrack = await getNewLTE(upTrack, downTrack)
                //constant arrangedTrackUP1 =await getNewLTE(up1Track);
                // this.printALlLTEs(arrangedTrack.downTrack,arrangedTrack.downTrack)
                // console.log('🔥 STATION ARRANGED',arrangedTrack,midTrack)
                //console.log('STATION ARRANGED... ', upTrack, downTrack, midTrack, up1Track , down1Track,arrangedTrack, this.props.tracks)
                setMaxLTE(arrangedTrack.upTrack, arrangedTrack.downTrack)
                await this.setState({ [LineName + 'Up']: arrangedTrack.upTrack, [LineName + 'Down']: arrangedTrack.downTrack, [LineName + 'Mid']: midTrack,  [LineName + 'Up1']: up1Track, [LineName + 'Down1']: down1Track, [LineName + 'Adjust']: arrangedTrack.downAdjust });

                const upTrackLTEs = getLTEsOnlywithDistance(arrangedTrack.upTrack, 'up');
                const downTrackLTEs = getLTEsOnlywithDistance(arrangedTrack.downTrack, 'down', arrangedTrack.downAdjust);
                // const midTrackLTEs = getMidTrackwithDistance(upTrackLTEs, downTrackLTEs, midTrack);
                const midTrackLTEs = getLTEsOnlywithDistance(midTrack,'mid');
                const up1TrackLTEs = getLTEsOnlywithDistance(up1Track, 'up1');
                const down1TrackLTEs = getLTEsOnlywithDistance(down1Track, 'down1');
                //console.log('STATION ARRANGED...Ltes.. ', upTrackLTEs, downTrackLTEs, midTrackLTEs,up1TrackLTEs,down1TrackLTEs ,LineName)
                const data = {
                    up: upTrackLTEs,
                    down: downTrackLTEs,
                    mid: midTrackLTEs,
                    up1:up1TrackLTEs,
                    down1:down1TrackLTEs
                }
                //console.log('🐙 POST UPDATE LTE DIST', data)
                const newLTE = { [LineName]: data };
                this.props.fetchTrackcircuits({ data: newLTE, lineType: LineName })
                if (i === 0) await this.setState({ type: type, option: LineName });
            }
        }
    }

    printALlLTEs = (trackData1, trackData2) => {  //just for testing
        for (let k = 0; k < trackData1.length; k++) {
            let LTEslist1 = trackData1[k].LTEs;
            let LTEslist2 = trackData2[k].LTEs;
            if (LTEslist1 && LTEslist1.length > 0) {
                for (let j = 0; j < LTEslist1.length; j++) {
                    if (LTEslist1[j].name === LTEslist2[j].name) console.log('😢 ==>', j, LTEslist1[j].name, LTEslist2[j].name)
                }
            }
            else {
                if (trackData1[k].name === trackData2[k].name) console.log('😢 ==>', k, trackData1[k].name, trackData2[k].name)
            }
        }
    }

    getLTEdist = (linetype, trackPosn, LTEid) => {
        const tracks = this.props.tracks;
        let dist;
        for (let i = 0; i < tracks.length; i++) {
            const line = tracks[i][linetype];
            if (line && line[trackPosn]) {
                const lte = line[trackPosn].filter(LTE => LTE.name.toUpperCase() === LTEid.toUpperCase() || LTE.divergeName === LTEid);
                if (lte.length > 0) {
                    dist = lte[0].dist;
                    return dist;
                } else {
                }
            }
        }
    }

    handleChange = (event) => {
        event.preventDefault();
        this.setState({
            [event.target.name]: event.target.value
        })
    }
    submtChange = (event) => {
        event.preventDefault();
        const { opt, end } = this.state;
        // this.props.updateTrainPosn({trainNo:opt,lte:endt.toUpperCase()})
        const lteval = this.getLTEdist('EW', 'down', end);
        if (lteval) this.setState({ update: true, endt: lteval })
        //For static update
        // this.setState({update:true,endt:parseInt(end)})
    }

    updateHotkey = (val) => {
        this.setState({ selectedHotkey: val })
    }

    grabBtnClick = () => {
        this.setState({ showModal: true })
    }

    hideModal = () => {
        this.setState({ showModal: false })
    }

    render() {
        const { } = this.props;
        const { } = this.state;

        return (
            <div style={{ height: '95%' }}>
                <ul class="nav nav-pills m-t-15 m-b-12" id="pills-tab" role="tablist">
                    {console.log("tabData------>",this.props.tabs) || this.props.tabs && this.props.tabs.map((tab, id) => {
                        return (
                            <li class key={tab.text}>
                                <a
                                    class={(this.state.option === (tab.type === 'line' ? tab.alias : tab.text)) ? "pill-tabs active nav-color" : "pill-tabs nav-color"}
                                    id="pills-contact-tab"
                                    data-toggle="pill"
                                    href="#pills-contact"
                                    role="tab"
                                    aria-controls="pills-contact"
                                    aria-selected="false"
                                    onClick={() => this.setState({ option: tab.type === 'line' ? tab.alias : tab.text, type: tab.type })}
                                >{tab.text}</a>
                            </li>
                        )
                    })}
                </ul>
                {/* <Image className='compass' src='images/compass.png' /> */}
                <div class="tab-content" id="pills-tabContent" style={{ height: '100%', position: 'relative' }}>
                    <div
                        class="tab-pane fade show active"
                        id="pills-home"
                        role="tabpanel"
                        aria-labelledby="pills-home-tab"
                    >
                        {/* <form onSubmit={this.submtChange}>
                            <Dropdown placeholder='State' search selection options={dropdown} name='opt' onChange={(e,data)=>this.setState({[data.name]:data.value})}/>
                            <div class="ui input">
                                <input type="text" class="" value={this.state.end}  placeholder="end" name='end' onChange={this.handleChange}></input>
                            </div>
                            <button type='submit' value='Submit'>Submit</button>
                        </form> */}
                        {/* <div>{this.state.val}</div> */}
                        <div class="train-map" style={{ height: '420px', marginTop: '20px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>

                            {/* <Train_track direction="N" sensors="110" /> */}
                            {/* STATIONS */}
                            {/* Allstation in loop */}
                            {this.state.type === 'line' ?
                                <div style={{ position: 'relative', }}>
                                    {/* TRAIN SN */}
                                    <Train_icon selectedline={this.state.option} />
                                    <div class="stn-div">
                                        <PlotTrack
                                            upTrack={this.state[this.state.option + 'Up']}
                                            downTrack={this.state[this.state.option + 'Down']}
                                            midTrack={this.state[this.state.option + 'Mid']}
                                            up1Track={this.state[this.state.option + 'Up1']}
                                            down1Track={this.state[this.state.option + 'Down1']}
                                            adjust={this.state[this.state.option + 'Adjust']}
                                            tracks={this.props.tracks}
                                            lineType={this.state.option}
                                        />
                                    </div>
                                </div>
                                :
                                <div class="depo-div">
                                    {this.state.type === 'depot' &&
                                        // <Depot Deponame={this.state.option === 'depot1' ? 'Hingna' : 'Mihan'} />
                                        <Depot Deponame={this.state.option} />
                                    }
                                </div>
                            }
                        </div>
                        <div class="grab-train" style={{ display: 'flex', flexDirection: 'row' }}>
                            <TrainGrab showModal={this.state.showModal} hideModal={this.hideModal} />
                            {/* {this.state.type === 'line' ? <SystemDGNA line={this.state.option} /> : null} 178*/ }
                            {/* {global.config.userConfig.Grab === 'default' && this.state.type === 'line' ?
                                <div style={{ position: 'absolute', bottom: 0, left: 150 }}>
                                    <button
                                        class="btn btn-rgba-quick-link m-r-10"
                                        style={{ color: '#fff' }}
                                        onClick={this.grabBtnClick}
                                    >{"Grab"}
                                    </button>
                                </div>
                                : null} */}
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}
const mapStateToProps = state => ({
    // trains: state.train.trains,
    tracks: state.train.track,
    tabs: state.train.tabs,
    lines: state.train.lines,
})

const mapDispatchToProps = dispatch => bindActionCreators({
    atsMessageReceived,
    fetchTrackcircuits,
    fetchActiveTrains,
    updateTrainPosn,
    fetchAllBaseStations
}, dispatch)

TrainMap.propTypes = propTypes

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(TrainMap)