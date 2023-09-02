import React from 'react'
import DialButton from './DialButton'
import './style.css';

export class DialPad extends React.Component {
    constructor(props) {
        super(props)
    }
    render() {
        const { onClick, compact } = this.props
        const buttons = [
            {
                symbol: '1'
            },
            {
                symbol: '2',
                alias: 'abc'
            },
            {
                symbol: '3',
                alias: 'def'
            },
            {
                symbol: '4',
                alias: 'ghi'
            },
            {
                symbol: '5',
                alias: 'jkl'
            },
            {
                symbol: '6',
                alias: 'mno'
            },
            {
                symbol: '7',
                alias: 'pqrs'
            },
            {
                symbol: '8',
                alias: 'tuv'
            },
            {
                symbol: '9',
                alias: 'wxyz'
            },
            {
                symbol: '*'
            },
            {
                symbol: '0'
            },
            {
                symbol: '#'
            },
            {
                icon: (<i className='fa fa-phone' />),
                symbol: 'Call',
                action: 'call'
            },
            {
                symbol: '+'
            },
            {
                icon: (<i className='fa fa-angle-left' />),
                symbol: 'delete',
                action: 'delete'
            }
        ]
        return (
            <div>
                <div className='dialpad-wrapper'>
                    <ol className='dialpad-list'>
                        {buttons.map((button, i) => (
                            <DialButton
                                {...button}
                                compact={compact}
                                onClick={onClick}
                            />
                        ))}
                    </ol>
                </div>
            </div>
        )
    }
}

DialPad.defaultProps = {
    onClick: () => { }
}

export default DialPad;