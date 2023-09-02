import React, { Component } from 'react'

export default class Train_track extends Component {
    constructor(props) {
        super(props)
        this.state = {
             trackPoints:[]
        }
    }
    componentDidMount = () => {
        const lines = parseInt(this.props.sensors);
        let newdash= [];
        for(let i =0; i<lines;i++){
            newdash.push(<div class="dot" id={i} key={i}></div>)
        }
        this.setState({ trackPoints:newdash});
    }
    render() {
        return (
            <div>
                <div class= {this.props.direction ==='N'?"line-north":"line-south"} style={this.props.style?this.props.style:{}}>
                       {this.state.trackPoints?this.state.trackPoints:null}
                </div>
            </div>
        )
    }
}



