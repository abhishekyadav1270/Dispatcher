import React from 'react'
import PropTypes from 'prop-types'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { Image } from 'semantic-ui-react'

import { } from "../../constants/constants"
import { getCircuitCords } from "../../utils/lib"

//Other files

const propTypes = {
    propData: PropTypes.array
}

class FileName extends React.Component {
    constructor(props) {
        super(props)
    
        this.state = {
             
        }
    }
    
    componentDidMount = () => {
        console.log('DATA PROPS', this.props)
    }

    examplefunc = params => { }

    render() {
        const { data } = this.props
        return (
            <div>

            </div>
        )
    }
}

const mapStateToProps = state => ({
    trains: state.train.trains
})

const mapDispatchToProps = dispatch => bindActionCreators({
}, dispatch)

FileName.propTypes = propTypes

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(FileName)