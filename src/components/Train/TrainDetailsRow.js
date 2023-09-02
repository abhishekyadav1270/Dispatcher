import React from 'react'
import PropTypes from 'prop-types'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { Image } from 'semantic-ui-react'

import { } from "../../constants/constants"
import { getCircuitCords } from "../../utils/lib"
import { ContextMenu } from '../commom'
import e from 'cors'

//Other files

const propTypes = {
    propData: PropTypes.array
}

class TrainDetailsRow extends React.Component {
    constructor(props) {
        super(props)

        this.state = {

        }
    }

    componentDidMount = () => {
    }

    getlivePaID = () => {
        let allRadios = this.props.radioData;
        // const Radio = allRadios.filter(rd => (parseInt(rd.RadioID_A) === parseInt(radioId) || parseInt(rd.RadioID_B) === parseInt(radioId)));
        // if(Radio.length) return Radio[0].livePaId;
        // else return ''

        const Radio = allRadios.filter(rd => {
            if (parseInt(rd.PTID) === parseInt(this.props.ptid)) {
                return rd
            }
        });
        if (Radio.length) {
            let radioId = Radio[0].RadioID_A
            let inactiveRadioId = Radio[0].RadioID_B

            if (this.props.crewid === 'DMB') {
                radioId = Radio[0].RadioID_B
                inactiveRadioId = Radio[0].RadioID_A
            }
            return { radioId, inactiveRadioId, livePaId: Radio[0].livePaId }
        } else {
            return ''
        }
    }

    render() {
        const { trainid, ptid, radioid, group, cabin, mode, line, aoc, dirc, crewid, rakeId } = this.props
        const radioData = this.getlivePaID();
        return (
            <ContextMenu id={trainid + ptid} type={'TS'} subr={radioData && radioData.radioId} inactiveRadio={radioData && radioData.inactiveRadioId} paId={radioData && radioData.livePaId} key={ptid}>
                <div className={global.config.project != 'dhaka' ? "train-row-grid" : "trainT-row-grid"}>
                    {global.config.project != 'dhaka' ?
                        <div class="tr-tb-cb"><input type="checkbox" /></div>
                        : null}
                    <div class="tr-tb-tid"><span>{trainid}</span></div>
                    <div class="tr-tb-pt-id"><span>{rakeId}</span></div>
                    <div class="tr-tb-r-id"><span>{radioid}</span></div>
                    {global.config.project != 'dhaka' ?
                        <div class="tr-tb-group"><span>{group}</span></div>
                        : null}
                    <div class="tr-tb-act-cab">
                        {cabin === 'active' ?
                            <div class="act-tags badge-warning f-12 f-bold black">{cabin}</div>
                            : null}
                        {cabin === 'inactive' ?
                            <div class="act-tags badge-info f-12 f-bold black">{cabin}</div>
                            : null}
                    </div>
                    <div class="tr-tb-ops"><span>{mode}</span></div>
                    <div class="tr-tb-line"><span>{line}</span></div>
                    {global.config.project != 'dhaka' ?
                        <div class="tr-tb-aoc"><span>{aoc}</span></div>
                        : null}
                    <div class="tr-tb-dir"><span>{dirc}</span></div>
                    <div class="tr-tb-c-id"><span>{crewid}</span></div>
                </div>
            </ContextMenu>
        )
    }
}

const mapStateToProps = ({ train }) => {
    const { radioData } = train;
    return {
        radioData
    };
};

const mapDispatchToProps = dispatch => bindActionCreators({
}, dispatch)

TrainDetailsRow.propTypes = propTypes

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(TrainDetailsRow)