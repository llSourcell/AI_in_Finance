import React, { Component } from 'react';

class Slider extends Component {
  render() {
    let slider;
    if (!this.props.showStartScreen) {
      slider = <input type="range" min="0" max="100" value={this.props.sliderVal} step="5" className="slider" id="myRange" onChange={(event) => this.props.handleSlider(event)} />
    }

    return (
      <div id="slidecontainer">
        {slider}
      </div>
    );
  }
}

export default Slider;
