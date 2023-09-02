import React from 'react'
import PropTypes from 'prop-types'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { Popup } from 'semantic-ui-react'
import { ButtonGroup, ToggleButton } from 'react-bootstrap'
import { sendMPTT, releaseMPTT, masterPTT, sendGroupCallAction, sendIndividualCallAction, initiateDefaultGrpCall } from '../../../modules/communication'
import { showMessage } from '../../../modules/alerts'
import { CallAction } from '../../../models/callAction'
import { sipIndividualCallTypes } from '../../../utils/sipConfig'

const propTypes = {
    propData: PropTypes.array
}
var isPTTFired = false;

class ActiveGrpCallQuickLinks extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            seen1: true,
            seen2: false,
            selectedOption: "radio1",
            pttPressed: false,
            mpttPressed: false,
            options: [
                { text: "Low Call", value: "radio1" },
                { text: "Med Call", value: "radio2" },
                { text: "High Call", value: "radio3" },
            ],
        }
    }

    componentDidMount = () => {
        //EVENT F13 as MPTT
        console.log('KEY UP PRESSED componentDidMount called')
        const _this = this;
        document.addEventListener("keydown", (event) => _this.keydownPHandler(event))
        document.addEventListener("keyup", (event) => _this.keyupPHandler(event))
    }

    componentWillUnmount = () => {
        // document.removeEventListener("keydown",()=>{},false)
        console.log('KEY UP PRESSED componentWillUnmount called')
        document.removeEventListener('keydown', this.keydownPHandler);
        document.removeEventListener('keyup', this.keyupPHandler);
    }

    keydownPHandler = (e) => {
        //console.log('KEY DOWN PRESSED', e.key, e, this.props.initMptt)
        const { mpttKey } = this.props;
        if (e.key === mpttKey) {
            if (!isPTTFired) {
                isPTTFired = true
                this.sendMpttReq()
            }
            e.preventDefault();
        }
    }

    keyupPHandler = (e) => {
        const { mpttKey } = this.props;
        if (e.key === mpttKey) {
            if (isPTTFired) {
                this.releaseMpttReq();
            }
            e.preventDefault();
        }
    }

    handleClose = () => {
        this.setState({ showLogoutConfirm: false })
    }

    collapse = () => {
        this.setState({ seen1: !this.state.seen1, seen2: !this.state.seen2 });
    }

    sendMpttReq = () => {
        const { sendMPTT } = this.props;
        let grpObj = initiateDefaultGrpCall();
        if (grpObj && grpObj.initMptt && !this.state.mpttPressed) {
            if (grpObj.mpttList && grpObj.mpttList.length > 1) {
                sendMPTT()
                this.setState({ mpttPressed: true })
            }
        }
        if (grpObj && grpObj.currentCall && grpObj.currentCall.length && !grpObj.initMptt && isPTTFired) {
            this.updateCallAction(grpObj.currentCall[0], 'ACQUIRE_PUSH_TO_TALK')
        }
    }

    releaseMpttReq = () => {
        const { releaseMPTT } = this.props;
        let grpObj = initiateDefaultGrpCall();
        if (grpObj && grpObj.initMptt && isPTTFired) {
            isPTTFired = false
            releaseMPTT();
            this.setState({ mpttPressed: false })
        }
        if (grpObj && grpObj.currentCall && grpObj.currentCall.length && !grpObj.initMptt && isPTTFired) {
            isPTTFired = false
            this.updateCallAction(grpObj.currentCall[0], 'RELEASE_PUSH_TO_TALK')
        }
        isPTTFired = false
    }

    updateCallAction = (data, type) => {
        const { sendGroupCallAction, sendIndividualCallAction, user } = this.props;
        console.log('MPTT SEND ACTION', sendIndividualCallAction, user);
        if (data.callType !== sipIndividualCallTypes.duplex) {
            if (user && user.profile) {
                const call = new CallAction(data, type);
                // const stateup= getCallActionState('ACQUIRE_PUSH_TO_TALK',actionItem);
                console.log('MPTT : INITATED ACTION', call, data)
                call.actionItem = [];
                call.fromId = user && user.profile.mcptt_id
                if (call.callType.includes('GROUP')) sendGroupCallAction(user, call)
                else sendIndividualCallAction(user, call)
            }
        }
    };

    handleMpttButton = () => {
        const { mpttList, sendMPTT, initMptt, releaseMPTT } = this.props;
        if (initMptt && !this.state.mpttPressed) {
            console.log('SEND MPTT BUTTON', mpttList)
            if (mpttList && mpttList.length > 1) {
                sendMPTT()
                this.setState({ mpttPressed: true })
            }
        }
        if (initMptt && this.state.mpttPressed) {
            releaseMPTT();
            this.setState({ mpttPressed: false })
        }
    }

    render() {
        const { data, initMptt, masterPTT } = this.props;
        const { seen1, seen2, mpttPressed } = this.state;
        return (
            <div class="flt-l">
                {seen1 ?
                    <div class="flex">
                        <button
                            class="btn btn-rgba-quick-link m-r-5 in-blc f-14"
                            onClick={() => masterPTT(!initMptt)}
                        >{(initMptt ? 'Disable' : 'Enable') + ' M-PTT'}
                        </button>
                        <button
                            class="btn btn-rgba-quick-link m-r-4 in-blc f-14"
                            onClick={this.handleMpttButton}
                            style={!this.props.initMptt ? { backgroundColor: '#A0A4A8', pointerEvents: 'none' } : mpttPressed ? { backgroundColor: '#008f39' } : { backgroundColor: '#ffb01f' }}
                        >M-PTT</button>
                        {/* <button class="btn btn-rgba-quick-link m-r-5 in-blc f-14">Mute</button> */}
                        {/* <div class="y-divider m-r-10 m-l-5"></div> */}
                        {/* <ButonPopover type='patch' text='Patch' options={this.state.options} selected={this.state.selectedOption} /> */}
                        {/* <ButonPopover type='voice' text='Voice' options={this.state.options} selected={this.state.selectedOption} />
                        <ButonPopover type='bcast' text='Bcast' options={this.state.options} selected={this.state.selectedOption} />
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
    const miniTitle = (type === 'emg') ? 'Emergency' : (type === 'voice') ? 'Call' : (type === 'bcast') ? 'Broadcast Call' : text + ' Call';
    const Title = 'Subscriber Name'
    return (
        <Popup
            className='hotkey-popup'
            hideOnScroll
            trigger={
                <button
                    id="popovertrainsdgna"
                    //ref="popovertraindgna"
                    style={{ color: '#fff' }}
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
                            style={{ width: '232px' }}
                        />
                    </div>
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
                </div>
            }
            on='click'
            position='bottom center'
        />
    )
}

const mapStateToProps = state => ({
    trains: state.train.trains,
    mpttList: state.communication.mpttList,
    initMptt: state.communication.initMptt,
    currentCall: state.communication.currentCall,
    user: state.auth.user,
    mpttKey: state.settings.mpttKey
})

ActiveGrpCallQuickLinks.propTypes = propTypes

export default connect(
    mapStateToProps,
    { sendMPTT, showMessage, releaseMPTT, masterPTT, sendGroupCallAction, sendIndividualCallAction }
)(ActiveGrpCallQuickLinks)