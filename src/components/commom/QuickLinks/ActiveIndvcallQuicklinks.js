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

class ActiveIndvCallQuickLinks extends React.Component {
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
        const { data } = this.props;
        const { seen1, seen2 } = this.state;
        return (
            <div class="flt-l">
                {seen1 ?
                    <div class="flex">
                        {/* <button class="btn btn-rgba-quick-link m-r-5 in-blc f-14">Mute</button>
                        <div class="y-divider m-r-10 m-l-5"></div>
                        <ButonPopover type='patch' text='Patch' options={this.state.options} selected={this.state.selectedOption} /> */}
                        {/* <ButonPopover type='duplex' text='Duplex' options={this.state.options} selected={this.state.selectedOption} />
                        <ButonPopover type='voice' text='Voice' options={this.state.options} selected={this.state.selectedOption} />
                        <ButonPopover type='amb' text='Ambience' options={this.state.options} selected={this.state.selectedOption} />
                        <ButonPopover type='emg' text='Emerg' options={this.state.options} selected={this.state.selectedOption} /> */}
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
    const miniTitle = (type === 'emg') ? 'Emergency' : (type === 'voice')?'Call': text+' Call';
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
                    class={type === 'emg' ? "btn btn-danger m-r-4 muli" : type === 'dgna' ? 'btn btn-rgba-quick-link m-r-4 muli' : "btn btn-rgba-quick-link m-r-4 muli"}
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
                        <div class="f-pop-text m-b-8">{Title}</div>
                        <input
                            type="text"
                            class="textinput-white w100"
                            placeholder="Subscriber Name"
                            style={{width:'232px'}}
                        />
                    </div>
                    {type!=='patch' && type!=='emg'?
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
                    {type==='emg' || type==='patch'?
                    <div class="pop-footer">
                        <div><p class="f-widg-label gray-8">{'Initiate Call'}</p></div>
                        <button class={type==='patch'?"btn btn-primary dark w100":"btn btn-danger dark w100"}>{type==='emg'?'Emergency Call':'Patch Call'}</button>
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

ActiveIndvCallQuickLinks.propTypes = propTypes

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(ActiveIndvCallQuickLinks)