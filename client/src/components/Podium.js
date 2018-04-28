import React, { Component } from 'react';

class Podium extends Component {
  render() {

    var podiumJSX = [];
    let podium = this.props.podium;
    podiumJSX.push(<br />);
    if (this.props.currentData.length > 0 && this.props.data.length === this.props.currentData.length && !this.props.gettingNewStock) {
      podiumJSX.push(
        <div className="podium">
          <p><span style={{"font-weight":"bold"}}>1st</span> {podium[0].name}: ${podium[0].stockValue.toFixed(2)}</p>
          <p><span style={{"font-weight":"bold"}}>2nd</span> {podium[1].name}: ${podium[1].stockValue.toFixed(2)}</p>
          <p><span style={{"font-weight":"bold"}}>3rd</span> {podium[2].name}: ${podium[2].stockValue.toFixed(2)}</p>
        </div>
      );
    }

    return (
      <div className="podium-container">
        {podiumJSX}
      </div>
    );
  }
}

export default Podium;
