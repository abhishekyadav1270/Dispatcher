import React from 'react'
import ReactDOM from 'react-dom'
import './style.css';

class DialButton extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            active: false
        }
        this.handleMouseDown = this.handleMouseDown.bind(this)
        this.handleMouseUp = this.handleMouseUp.bind(this)
    }

    componentDidMount() {
        const element = ReactDOM.findDOMNode(this.refs.button)
        element.addEventListener('mousedown', this.handleMouseDown)
        window.addEventListener('mouseup', this.handleMouseUp)
    }

    componentWillUnmount() {
        const element = ReactDOM.findDOMNode(this.refs.button)
        element.removeEventListener('mousedown', this.handleMouseDown)
        window.removeEventListener('mouseup', this.handleMouseUp)
    }

    handleMouseDown(e) {
        this.setState({ active: true })
    }

    handleMouseUp(e) {
        if (this.state.active) {
            this.setState({ active: false })
        }
    }

    render() {
        const { symbol, alias, icon, compact, onClick, i } = this.props;
        const { active } = this.state
        return (
            <li
                onClick={() => onClick(this.props)}
                className='dialpad-button-wrapper'
                style={{ width: 'calc(100%/3)', 'backgroundColor': active ? 'rgba(0,0,0,0.7)' : 'transparent' }}
                key={i}
            >
                <p
                    ref='button'
                    className='dialer-button-text'
                >
                    {icon}
                    {(!icon || !compact) && (
                        <span>{symbol}</span>
                    )}
                    {!!alias && !compact && (
                        <sup className='dialer-button-alias'>{alias}</sup>
                    )}
                </p>
            </li>
        )
    }
}

export default DialButton;