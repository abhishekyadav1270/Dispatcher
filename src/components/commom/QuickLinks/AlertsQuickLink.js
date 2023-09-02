import React from 'react'
import PropTypes from 'prop-types'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { Popup } from 'semantic-ui-react'
import {ButtonGroup,ToggleButton } from 'react-bootstrap'


//Other files

const propTypes = {
    propData: PropTypes.array
}

class AlertsQUickLinks extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            seen1: true,
            seen2: false,
            selectedOption: "radio1",
            options: [
                { text: "Low Call", value: "radio1" },
                { text: "Med Call", value: "radio2" },
                { text: "High Call", value: "radio3" },
            ],
        }
    }

    componentDidMount = () => {
    }

    collapse = () => {
        this.setState({ seen1: !this.state.seen1, seen2: !this.state.seen2 });
    }

    render() {
        const { search } = this.props;
        const { seen1, seen2 } = this.state;
        return (
            <div class="flt-l">
                {seen1 ?
                    <div>
                        {/* <ButonPopover type='newcall' text='New Call' options={this.state.options} selected={this.state.selectedOption} />
                        <ButonPopover type='sendalerts' text='Send Alerts' options={this.state.options} selected={this.state.selectedOption} />
                        <ButonPopover type='pa' text='PA' options={this.state.options} selected={this.state.selectedOption} />
                        <ButonPopover type='emergency' text='Emergency' options={this.state.options} selected={this.state.selectedOption} /> */}
                        {/* <button
                            id="popovertrainsdgna"
                            onClick={this.collapse}
                            class="sq-icon-btn in-blc m-r-5 wx32"
                            type="button"
                            style={{color:'#fff'}}
                        >
                            <i class="fa fa-search f-16"></i>
                        </button> */}
                    </div> : null}

                {seen2 ?
                    <div class="flex">
                        <div class="in-blc">
                            <button onClick={this.collapse} class="sq-icon-btn m-r-4">
                                <i class="feather icon-chevron-left"></i>
                            </button>
                        </div>
                        <div class="input-group in-blc">
                            <input
                                type="text"
                                class="textinput searchinput w80 in-blc"
                                autocomplete="off"
                                placeholder="Search"
                                aria-label="Search"
                                aria-describedby="button-addon2"
                                onChange={(e)=> search(e.target.value)}
                            />
                            <button class="btnsearch in-blc" type="submit" id="button-addon2">
                                <i class="fa fa-search"></i>
                            </button>
                        </div>
                    </div> : null}
            </div>
        )
    }
}

const ButonPopover = (props) => {
    const { type, options, selected, text } = props;
    const miniTitle = (type === 'emergency') ? text : 'Call';
    const Title ='Subscriber Name'
    return (
        <Popup
            className='hotkey-popup'
            hideOnScroll
            trigger={
                <button
                    id="popovertrainsdgna"
                    //ref="popovertraindgna"
                    style={{color:'#fff'}}
                    class={type === 'emergency' ? "btn btn-danger m-r-4 muli" : type === 'dgna' ? 'btn btn-rgba-quick-link m-r-4 muli' : "btn btn-rgba-quick-link m-r-4 muli"}
                >
                    {text}
                </button>
            }
            style={{ padding: 0 }}
            content={
                <div class="popover-grid-2">
                    <div class="pop-header">
                        <div class="pop-header">
                            <div class="pop-header-grid-2">
                                <div class="pop-name">
                                    <div>
                                        <p class="f-pop-title">{miniTitle}</p>
                                    </div>
                                </div>
                                <div class="pop-icon">
                                    <i class="feather icon-message-square"></i>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="pop-body">
                        <div class="f-pop-text">{Title}</div>
                        <input
                            type="text"
                            class="textinput-white w100"
                            placeholder="Subscriber Name"
                            style={{width:'232px'}}
                        />
                    </div>
                    {type==='newcall'?
                    <React.Fragment>
                    <div class="pop-footer">
                        <div>
                            <p class="f-widg-label gray-8">Call with Prioriy</p>
                        </div>
                    </div>
                    <ButtonGroup toggle>
                        {options.map((radio, idx) => (
                        <ToggleButton
                            key={idx}
                            size="lg"
                            type="radio"
                            variant="outline-el-m-dark-pop"
                            name="radio"
                            value={radio.value}
                            checked={selected === radio.value}
                            onChange={(e) => alert('Change')}
                        >
                            {radio.text}
                        </ToggleButton>
                        ))}
                    </ButtonGroup>
                    </React.Fragment>:null}
                    {type!=='newcall'?
                    <div class="pop-footer">
                        <div><p class="f-widg-label gray-8">{type==='emergency'?'Initiate Call':'Broadcast Call'}</p></div>
                        <button class={type==='emergency'?"btn btn-danger w100":"btn btn-success w100"}>{type==='emergency'?'Emergency Call':'Send Alert'}</button>
                    </div>:null}
                </div>
            }
            on='click'
            position='bottom center'
        />
    )
}

const mapStateToProps = state => ({
    trains: state.train.trains
})

const mapDispatchToProps = dispatch => bindActionCreators({
}, dispatch)

AlertsQUickLinks.propTypes = propTypes

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(AlertsQUickLinks)