import React from 'react'
import PropTypes from 'prop-types'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { ContextMenu } from '../commom';


import { } from "../../constants/constants"
import { getDepoRadioId } from '../../utils/lib';


//Other files

const propTypes = {
    propData: PropTypes.array
}

class Depot extends React.Component {
    constructor(props) {
        super(props)
    }

    render() {
        const { data } = this.props
        return (
            <div class='ovr-scr-y' style={{ height: '390px' }}>
                {/* <div class=" pt-6 pb-6 pr-6 pl-6 f-18 f-reg black">{this.props.Deponame}</div>  */}
                <div class='grid-layout'>
                    {this.props.depo && (this.props.depo.filter(train => (train.depot && train.depot.toLowerCase()) === (this.props.Deponame && this.props.Deponame.toLowerCase()))).map((train, id) => {
                        const radioData = getDepoRadioId(this.props.radioData, train.rakeId)
                        //console.log('trains in depo...', this.props.radioData, train, this.props.Deponame, this.props.depo)
                        return (
                            <ContextMenu
                                id={train.id}
                                key={train.rakeId}
                                type={'DT'}
                                clickOpen={true}
                                subr={radioData && radioData.radioId}
                                inactiveRadio={radioData && radioData.inactiveRadioId}
                                paId={radioData && radioData.livePaId}
                            >
                                <div class='train-card' style={{ marginLeft: '20px' }}>
                                    <img style={{ height: '30px', width: '30px' }} src={`assets/images/${train.depot.toLowerCase() === 'hingna' ? 'blue' : 'green'}-train.svg`} alt={'train'} />
                                    <h2 class='f-14 f-bold m-t-5'>{train.rakeId}</h2>
                                </div>
                            </ContextMenu>
                        )
                    })}
                </div>
            </div>
        )
    }
}

const mapStateToProps = state => ({
    depo: state.train.depo,
    radioData: state.train.radioData
})

const mapDispatchToProps = dispatch => bindActionCreators({
}, dispatch)

Depot.propTypes = propTypes

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Depot)