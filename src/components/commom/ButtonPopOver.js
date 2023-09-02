import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Popup } from 'semantic-ui-react'
import {ButtonGroup,ToggleButton } from 'react-bootstrap'

import SearchableDropdown from './SearchableDropdown';

const ButonPopover = ({ 
    type='button', 
    options,
    calloption=false,
    Class,
    Style,
    btnText='Send',
    title='Call',
    header='Subscriber Name',
    btnHighlight='Send',
    submitText='Send',
    onSubmit,
    contactList 
}) => {

    const [selectedSubscriber, setSubscriber] = useState({});
    const [selected, setSelected] = useState('radio1');

    useEffect(() => {
        
    }, [contactList])

    const sendSubmit = () =>{
        const selectedSub= JSON.parse(selectedSubscriber);
        if(selectedSub){
            onSubmit(selectedSub)
            setSubscriber({})
        }
    }

    return (
        <Popup
            className='hotkey-popup'
            hideOnScroll
            trigger={
                <button
                    id="popovertrainsdgna"
                    style={Style?Style:{}}
                    class={Class?Class:"btn btn-rgba-quick-link m-r-4 muli"}
                >
                    {btnText}
                </button>
            }
            style={{ padding: 0 }}
            content={
                <div class="popover-grid-2">
                    <div class="pop-header">
                        <div class="pop-header-grid-2">
                            <div class="pop-name">
                                <div>
                                    <p class="f-pop-title">{title}</p>
                                </div>
                            </div>
                            <div class="pop-icon">
                                <i class="feather icon-message-square"></i>
                            </div>
                        </div>
                    </div>
                    <div class="pop-body">
                        <div class="f-pop-text">{header}</div>
                        <SearchableDropdown
                            options={contactList}
                            type={'inputDropdown'}
                            setSelection={(sub)=>{setSubscriber(sub)}}
                        />
                    </div>
                    {calloption?
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
                    {type==='button'?
                    <div class="pop-footer">
                        <div>
                            <p class="f-widg-label gray-8">{btnHighlight}</p>
                        </div>
                        <button class="btn btn-success w100" onClick={sendSubmit}>{submitText}</button>
                    </div>:null}
                    {type==='emergency'?
                    <div class="pop-footer">
                        <div>
                            <p class="f-widg-label gray-8">{btnHighlight}</p>
                        </div>
                        <button class="btn btn-danger w100" onClick={sendSubmit}>{submitText}</button>
                    </div>:null}
                </div>
            }
            on='click'
            position='bottom center'
        />
    )
}

const mapStateToProps = ({ communication,auth }) => {
    const { contactList } = communication;
    const { user } = auth;
    return {
        contactList,
        user
    };
};

export default connect(mapStateToProps, {})(ButonPopover)