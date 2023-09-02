import React, { useEffect, useState, forwardRef, useImperativeHandle } from 'react'
import { } from 'semantic-ui-react'
import { } from 'react-bootstrap'
import Select from 'react-dropdown-select';
import { domain, subscriberStatus, subscriberType } from '../../constants/constants';
import { getCallieIdToShow } from '../../utils/lib'

const SearchableDropdown = (props, ref) => {
    const [selVal, setInput] = useState('');
    const [selId, setId] = useState('');
    const [filteredOptions, setfilteredOptions] = useState([]);
    const { buttonClass, buttonName, type, options, title, variant, inputStyle, inputClass, buttonOnRight, value, buttonRight, isAddButton, onAddSeln } = props;
    const [selTempVal, setTempSel] = useState([]);

    useImperativeHandle(ref, () => ({
        clearSelection() {
            setTempSel([])
        }
    }), [])

    useEffect(() => {
        if (type === 'SearchDropdown') {
            //ADD searchkey for search functionality
            const modifiedList = options && options.map(sub => {
                return { ...sub, searchKey: sub.mcptt_id } //+sub.contactName+sub.mcptt_id
            })
            const sortCont = modifiedList && filterData(modifiedList);
            setfilteredOptions(sortCont);
            setInput(value ? value : '')
        }
        if (type === 'inputDropdown') {
            const sortCont = options && filterData(options);
            setfilteredOptions(sortCont);
            setInput(value ? value : '')
        }
        if (type === 'buttonDropdown') {
            setfilteredOptions(options);
            setId(value ? value : '');
        }
    }, [options, buttonName, value])

    const filterData = (array) => {
        try {
            const disabled = array.filter(x => x.Reg_status !== subscriberStatus['REGISTERED'] && x.subscriber_type !== subscriberType['GROUP'])
            const enabled = array.filter(x => x.Reg_status === subscriberStatus['REGISTERED'] || x.subscriber_type === subscriberType['GROUP'])
            const rebuilt = [...enabled, ...disabled];
            return rebuilt;
        }
        catch (e) {
            console.log('CRASH REPORT: SearchableDropdown', e, array)
        }
    };

    const searchContact = (searchCont) => {
        let filterCont;
        if (searchCont) {
            filterCont = options.filter(cont =>
                cont.contactName.toLowerCase().includes(searchCont.toLowerCase()) ||
                cont.mcptt_id.includes(searchCont))
            const sortCont = filterCont && filterData(filterCont)
            setfilteredOptions(sortCont);
        }
        else {
            const sortCont = options && filterData(options)
            setfilteredOptions(sortCont);
        }
    }

    const setSelected = (opt) => {
        try {
            setInput(opt.contactName);
            setId(opt.mcptt_id)
            props.setSelection(JSON.stringify(opt));
        }
        catch (e) {
            console.log('EMPTY SELECTED:', e)
        }
    }

    const onEnterPressed = (e) => {
        if (e.key === 'Enter') {
            const selectedOpt = filteredOptions[0];
            if (setVisibility(selectedOpt, true)) setSelected(selectedOpt)
        }
    }

    const setVisibility = (data, opacity = false) => {
        if (!props.checkEnable) {
            return opacity ? true : {}
        }
        else {
            if (data.subscriber_type !== subscriberType['GROUP']) {
                if (data.Reg_status !== subscriberStatus['REGISTERED']) {
                    return opacity ? false : { pointerEvents: 'none' };
                }
                else return opacity ? true : {}
            }
            if (data.subscriber_type === subscriberType['GROUP']) return opacity ? true : {}
        }
    }

    //ButtonType
    const setItemSelected = (item) => {
        setId(item.desc)
        props.setSelection(item)
    }

    const customItemRenderer = ({ item, itemIndex, props, state, methods }) => (
        <div
            class={methods.isSelected(item) ? 'c-dropdown-item active' :
                setVisibility(item, true) ? "c-dropdown-item" : "c-dropdown-item inactive"}
            style={setVisibility(item)}
        >
            <div onClick={() => methods.addItem(item)}>
                {' (' + getCallieIdToShow(item.mcptt_id) + ') : ' + item.contactName}
            </div>
        </div>
    );

    return (
        <div class="dropdown">
            {type === 'buttonDropdown' ?
                <button
                    class={buttonClass ? buttonClass : "btn btn-mildgreen-solid dropdown-toggle"}
                    type="button"
                    id="dropdownMenuButton"
                    data-toggle="dropdown"
                    aria-haspopup="true"
                    aria-expanded="false"
                    variant={variant ? variant : "outline-el-b-dark"}
                >
                    {selId ? selId : buttonName}
                </button> : null}
            {type === 'SearchDropdown' ?
                <div class="input-group">
                    <Select
                        // className={"textinput"}
                        style={inputStyle ? inputStyle : {
                            width: '200px',
                            borderTopLeftRadius: '20px',
                            borderBottomLeftRadius: '20px',
                            paddingLeft: '16px',
                            minHeight: '23px',
                            border: '0px',
                            backgroundColor: 'rgba(255,255,255,0.5)',
                        }}
                        itemRenderer={customItemRenderer}
                        // autoFocus
                        values={selTempVal}
                        color={'white'}
                        options={filteredOptions}
                        searchBy={'mcptt_id'}
                        valueField={"mcptt_id"}
                        labelField={"contactName"}
                        dropdownPosition={"auto"}
                        dropdownHeight={"200px"}
                        dropdownHandle={false}
                        dropdownGap={-3}
                        searchable={true}
                        placeholder={'Select subscriber'}
                        backspaceDelete
                        clearOnBlur
                        clearOnSelect
                        onChange={(values) => {
                            setSelected(values[0])
                            setTempSel(values)
                        }}
                    />
                    {isAddButton &&
                        <div class="input-group-append">
                            <button
                                class="btn btn-success"
                                type="button"
                                id="button-addon-group"
                                onClick={() => {
                                    setTempSel([])
                                    onAddSeln()
                                }}
                            >
                                Add
                            </button>
                        </div>
                    }
                    {!buttonOnRight ?
                        <button
                            class="btnsearch in-blc"
                            type="submit"
                            id="button-addon2"
                        >
                            <i class="fa fa-search"> </i>
                        </button>
                        : buttonRight}
                </div> : null}
            {type === 'inputDropdown' ?
                <div
                    class="input-group"
                    id="dropdownMenuButton"
                    data-toggle="dropdown"
                    aria-haspopup="true"
                    aria-expanded="false"
                >
                    <input
                        type="text"
                        class="textinput-white w100"
                        placeholder="Subscriber Name"
                        style={{ width: '232px' }}
                        onChange={(e) => { setInput(e.target.value); searchContact(e.target.value) }}
                        value={selVal}
                        onKeyDown={onEnterPressed}
                    />
                </div>
                : null}
            {/* MENU */}
            {type === 'SearchDropdown' || type === 'inputDropdown' ?
                <div
                    class="dropdown-menu"
                    aria-labelledby="dropdownMenuButton"
                    style={filteredOptions.length > 8 ? { height: '200px', overflowY: 'scroll' } : {}}
                >
                    {filteredOptions && filteredOptions.map((opt, id) => {
                        return (
                            <div key={id}
                                class={selId === opt.mcptt_id ? "dropdown-item active" : setVisibility(opt, true) ? "dropdown-item" : "dropdown-item inactive"}
                                style={setVisibility(opt)}
                                onClick={() => setSelected(opt)}
                            >{opt.contactName + ' ( ' + (opt.Domain === domain['MCX'] ? opt.mcptt_id : opt.mcptt_id) + ' )'}</div>
                        )
                    })}
                    {filteredOptions.length === 0 ?
                        <div class="dropdown-item inactive" style={{ pointerEvents: 'none' }}>No match</div>
                        : null
                    }
                </div>
                : null}
            {type === 'buttonDropdown' ?
                <div
                    class="dropdown-menu"
                    aria-labelledby="dropdownMenuButton"
                    style={filteredOptions.length > 8 ? { height: '200px', overflowY: 'scroll' } : {}}
                >
                    <span class="context-title gray-3 muli">{title}</span>
                    <div class="context-divider"></div>
                    {filteredOptions && filteredOptions.map((opt, id) => {
                        return (
                            <div key={id}
                                class={selId === opt.code ? "dropdown-item active" : "dropdown-item"}
                                // style={setVisibility(opt)}
                                onClick={() => setItemSelected(opt)}
                            >{opt.desc}</div>
                        )
                    })}
                    {filteredOptions.length === 0 ?
                        <div class="dropdown-item inactive" style={{ pointerEvents: 'none' }}>No match</div>
                        : null
                    }
                </div>
                : null}
        </div>
    )
}

SearchableDropdown.defaultProps = {
    checkEnable: true
}

export default forwardRef(SearchableDropdown)