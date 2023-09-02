import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux'
import { Tooltip, OverlayTrigger, Overlay, Popover } from 'react-bootstrap';
//import 'bootstrap/dist/css/bootstrap.min.css';
import { ActionItemMenu, ContextMenu } from '../commom';
import { getStationRadioId } from '../../utils/lib';
import '../../constants/trainmapConfig'

const propTypes = {
    stncode: PropTypes.string,
    stnname: PropTypes.string
}

const renderTooltip = (props) => (
    <Tooltip id="button-tooltip" {...props}>
        <p class='f-header-14b'>{props.stn && props.stn.split(/ /g).map(word => `${word.substring(0, 1).toUpperCase()}${word.substring(1)}`).join(" ")}</p>
        {props.data.isBaseStn &&
            <div>
                <div class='partition' />
                <p class='f-detail-14'>{'Base Station : ' + props.data.location}</p>
                <p class='f-detail-14'>{'Node No : ' + props.data.nodeNumber}</p>
            </div>
        }
    </Tooltip>
);

class Station extends Component {
    constructor(props) {
        super(props)

        this.state = {
            show: false,
            activeItem: ''
        }
        this.target = React.createRef();
    }

    componentDidMount() {
    }

    // handleClick = e => {
    //     e.stopPropagation();  //  <------ Here is the magic
    //     this.props.onClick();
    //   }

    handleItemClick = (e, { name }) => {
        this.setState({ activeItem: name, show: false })
    }

    getStatus = (status) => {
        switch (status) {
            case '1':
            case 1:
                return 'warning' // Yellow
            case '2':
            case 2:
                return 'alarm' // Magenta
            case '0':
            case 0:
                return 'active' // Green
            case '3':
            case 3:
                return 'inactive' // Red
            case '4':
            case 4:
                return 'unknown' // Gray    

            default:
                break;
        }
    }

    getStnSize = () => {
        let fSize = global.config.trainConfig.singleLTE > 12 ? 13 : 9
        let stnCard = global.config.trainConfig.singleLTE > 12 ? 13 : 9
        if (global.config.project == 'mumbai' || global.config.project == 'dhaka' || global.config.project == 'pune') {
            // fSize = global.config.trainConfig.lteSize / 0.9;
            // stnCard = global.config.trainConfig.singleLTE * 1.5

            fSize = global.config.trainConfig.lteSize * 2
            stnCard = global.config.trainConfig.singleLTE * 2.5

            // fSize = global.config.trainConfig.singleLTE / 6;
            // stnCard = global.config.trainConfig.singleLTE / 6
        }
        return { fSize, stnCard }
    }

    render() {
        const { stncode, stationRadios, basestations } = this.props;
        const tetraId = (process.env.REACT_APP_ISRAILWAY).toLowerCase() == 'true' ? 'SM-SC' : getStationRadioId(stationRadios, stncode);
        //console.log('radio id tetraId....',tetraId)
        let isBaseStn = basestations.findIndex((item) => item.location == stncode)
        let basestnVal = {}
        if (isBaseStn != -1) {
            basestnVal = basestations[isBaseStn];
            isBaseStn = true;
        }
        else isBaseStn = false
        //console.log('BSCGH', basestnVal, isBaseStn) 
        // /subscriber_type
        let routename = (process.env.REACT_APP_ISRAILWAY).toLowerCase() == 'true' ? 'trn' : 'stn'
        let type = (process.env.REACT_APP_ISRAILWAY).toLowerCase() == 'true' ? 'TD' : 'TS'
        let isFACall = (process.env.REACT_APP_ISRAILWAY).toLowerCase() == 'true' ? true : false
        return (
            <div>
                <ContextMenu id={this.props.stnname} type={type} subr={tetraId} paId={tetraId} routeName={routename} isFACall={isFACall}>
                    <div class='plot-stn' style={{ width: global.config.trainConfig.lteSize / 2 + 'px', marginLeft: (global.config.trainConfig.lteSize + global.config.trainConfig.lteGap*2  - global.config.trainConfig.lteSize / 2 ) / 2 + 'px' }}>
                        <OverlayTrigger
                            placement="bottom"
                            delay={{ show: 250, hide: 400 }}
                            overlay={renderTooltip({ stn: this.props.stnname, data: { ...basestnVal, isBaseStn } })}
                        >
                            <div
                                class={"stn-tag " + (isBaseStn ? this.getStatus(basestnVal.status) : '')}
                                // style={{ width: this.getStnSize().stnCard + 'px' }}
                                // style={{ width: '50px'}}
                                ref={this.target}
                                onClick={() => this.setState({ show: !this.state.show })}
                            >
                                <div class="f-stn" style={{ fontSize: this.getStnSize().fSize + 'px' }}>{this.props.stncode}</div>
                            </div>
                        </OverlayTrigger>
                    </div>
                </ContextMenu>
            </div>
        )
    }
}

Station.propTypes = propTypes;

const mapStateToProps = ({ train }) => {
    const { stationRadios, basestations } = train;
    return {
        stationRadios, basestations
    };
};

export default connect(mapStateToProps, {})(Station);