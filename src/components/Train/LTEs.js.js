import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Tooltip, OverlayTrigger } from 'react-bootstrap';
import '../../constants/trainmapConfig';

const propTypes = {
    stncode: PropTypes.string,
    stnname: PropTypes.string
}
const renderTooltip = (props) => (
    <Tooltip id="button-tooltip" {...props}>
        {props.name}
    </Tooltip>
);

class LTEs extends Component {
    constructor(props) {
        super(props)
        this.state = {
            show: false,
        }
        this.target = React.createRef();
    }
//width: this.props.width ? this.props.width : this.props.station ? global.config.trainConfig.singleLTE : global.config.trainConfig.lteSize + 'px',
    render() {
        const { } = this.state;
        return (
            <OverlayTrigger
                placement="bottom"
                delay={{ show: 250, hide: 400 }}
                overlay={renderTooltip({ name: this.props.data.name.toString() })}
            >
                <div
                    class={"dot " + (this.props.isempty ? "changing-dot" : " ")}
                    style={{
                        backgroundColor: this.props.station ? 'white' : this.props.diverge ? 'gray' : null,
                        width: this.props.width ? this.props.width : global.config.trainConfig.lteSize + 'px',
                        margin: global.config.trainConfig.lteGap + 'px',
                        position: 'relative',
                        zIndex:8
                    }}
                ></div>
            </OverlayTrigger>
        )
    }
}

LTEs.propTypes = propTypes;
export default LTEs;
