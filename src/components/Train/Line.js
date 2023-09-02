import React from 'react';
import '../../constants/trainmapConfig';

export default class Line extends React.Component {
  prepareCords() {
    let coords = {
      x1: this.props.x,
      y1: this.props.y
    }
    if (this.props.nextLteDist) {
      let nextLte = this.props.nextLteDist
      let prevLte = this.props.prevLteDist
      //console.log('nextLte...prevLte...',nextLte, prevLte)
      if (nextLte > prevLte) { //right 
        let diffDist = nextLte - prevLte;
        coords.x2 = diffDist + 2;
        coords.y2 = coords.y1 + this.props.length;
      } else { //left
        let diffDist = prevLte - nextLte;
        coords.x2 = diffDist - 2;
        coords.y2 = coords.y1 + this.props.length;
      }
    } else {
      if (this.props.vertical) {
        coords.x2 = coords.x1 - this.props.xshift;
        coords.y2 = coords.y1 + this.props.length;
      }
    }

    if (this.props.horizontal) {
      coords.x2 = coords.x1 + this.props.length;
      coords.y2 = coords.y1;
    }
    // if(this.props.vertical) {
    //   coords.x2 = coords.x1 - this.props.xshift;
    //   coords.y2 = coords.y1 + this.props.length;
    // }
    if (this.props.downtoMid) {
      coords.x2 = coords.x1 - this.props.xshift;
      coords.y2 = coords.y1 - this.props.length;
    }
    return coords;
  }

  render() {
    const mainStyle = {
      position: 'absolute',
      top: '21px',
      marginLeft: '0px',
      zIndex: 1,
      //backgroundColor:'rgb(1,1,0,0.9)',
    };
    const sidingStyle = {
      position: 'absolute',
      top: '133px',
      marginLeft: '-42px',
      zIndex: 1,
      //backgroundColor:'rgb(0,0,1,0.8)',
    };
    const upSidingStyle = {
      position: 'absolute',
      top: '-90px',
      marginLeft: '-42px',
      zIndex: 1,
      //backgroundColor:'rgb(1,0,0,0.5)',
    };
    let coords = this.prepareCords();
    // let coords = {
    //   x1: 17,
    //   y1: 0,
    //   x2: 3,
    //   y2: 90
    // }
    let strokeWidth = global.config.trainConfig.lteSize
    if (strokeWidth < 5) strokeWidth = 0.5;
    else strokeWidth = 2;
    console.log('renderDiverge method called line...', coords)
    return (
      <div style={this.props.siding && this.props.dirn == 'up' ? upSidingStyle : this.props.siding ? sidingStyle : mainStyle}>
        <svg width={this.props.widthOfDiverge} height="90">
          <line {...coords} class={!this.props.siding ? 'fill-changing' : 'fill-siding'} strokeWidth={strokeWidth} strokeDasharray="5" />
        </svg>
      </div>
    )
  }
}