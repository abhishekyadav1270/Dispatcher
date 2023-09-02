import React from 'react'
import ReactDOM from 'react-dom'
import DialPad from './DialPad';
import './style.css';
import Select from 'react-select';

export default class Dial extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      value: '',
      capture: true,
      compact: false,
      domainType: {},
      domainOption: []
    }
    
    this.handleKeyPress = this.handleKeyPress.bind(this)
    this.handleResize = this.handleResize.bind(this)
  }
  componentDidMount() {
    const { dialerDomain } = this.props;
    console.log('mappedOption dial..', dialerDomain);

    let mappedOption = [];
    for (const domainVal of dialerDomain) {
      if (domainVal.type) {
        mappedOption = [...mappedOption, { label: domainVal.type, value: domainVal.domain }]
      }
    }

    this.setState({ domainOption:  mappedOption});

    if (mappedOption.length > 0) {
      this.setState({ domainType:  mappedOption[0]});
    }

    window.addEventListener('keypress', this.handleKeyPress)
    window.addEventListener('resize', this.handleResize)
    this.handleResize();
  }
  componentWillUnmount() {
    window.removeEventListener('keypress', this.handleKeyPress)
    window.removeEventListener('resize', this.handleResize)
  }

  isCompact() {
    const container = ReactDOM.findDOMNode(this.refs.container)
    return container ? container.getBoundingClientRect().width < 540 : false
  }

  handleResize(e) {
    const { compact } = this.state
    if (this.isCompact()) {
      if (!compact) {
        this.setState({ compact: true })
      }
    } else {
      if (compact) {
        this.setState({ compact: false })
      }
    }
  }

  handleClick(button) {
    const { value } = this.state
    let callType = ''
    if (!button.action) {
      this.setState({
        value: `${value}${button.symbol}`
      })
    } else if ('call' === button.action) {
      // console.log(`Initiate Call to ${value}`)
      //pbxUser = true
      callType = this.state.domainType.value;
      this.props.onDialPadCall(value, callType);
    } else if ('delete' === button.action) {
      if (this.state.value.length > 0) this.setState({ value: this.state.value.slice(0, -1) })
    }
  }

  handleKeyPress(e) {
    const { capture, value } = this.state
    if (!capture) {
      return
    }
    switch (e.charCode) {
      case 48:
      case 49:
      case 50:
      case 51:
      case 52:
      case 53:
      case 54:
      case 55:
      case 56:
      case 57:
      case 42:
      case 43:
        this.setState({
          value: value + String.fromCharCode(e.charCode)
        })
      default:
        break
    }
  }

  beginCapture(e) {
    this.setState({
      capture: true
    })
  }

  endCapture(e) {
    this.setState({
      capture: false
    })
  }

  reset() {
    this.setState({
      value: ''
    })
  }

  handleChange(e) {
    const { capture } = this.state
    if (!capture) {
      this.setState({
        value: e.target.value
      })
    }
  }

  domainChangeHandler(e) {
    console.log("domain changed ", e);
    this.setState({
      domainType: e
    })
  }

  render() {
    const { value, compact, domainType, domainOption } = this.state
    
    // const domainOption = [
    //   {label: "MCX", value: "mcx"},
    //   {label: "IWF", value: "iwf"},
    //   {label: "PBXMCX", value: "pbxmcx"},
    //   {label: "PBXIWF", value: "pbxiwf"}
    // ]

    return (
      <div ref='container'>
        {/* <div style={{display: "inline-block"}}> */}
        <div
          onClick={() => { this.reset.bind(this); this.props.onClose() }}
          className='dailer-reset'
        >
          &times;
        </div>
        <input
          className='dialpad-input'
          onChange={this.handleChange.bind(this)}
          onFocus={this.endCapture.bind(this)}
          onBlur={this.beginCapture.bind(this)}
          type='text'
          value={value}
        />
        <div style={{ width: "44%", display: "inline-block", borderRadius: "6px" }}>
          <Select
            // styles={selectStyle}
            closeMenuOnSelect={true}
            // components={animatedComponents}
            value={domainType}
            options={domainOption}
            onChange={this.domainChangeHandler.bind(this)}
            getOptionLabel={e => (
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <span style={{ marginLeft: 5 }}>{e.label}</span>
              </div>
            )}
          />
        </div>
        <DialPad onClick={this.handleClick.bind(this)} compact={compact} />
      </div>
    )
  }
}
