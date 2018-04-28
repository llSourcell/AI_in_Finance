import React, { Component } from 'react';

class Buttons extends Component {
  render() {

    let buyBtnStyle = {};
    let sellBtnStyle = {};
    if (document.getElementById('buy-btn') && this.props.currentData.length >= 1) {
      document.getElementById('buy-btn').classList.add('btn-active');
      document.getElementById('sell-btn').classList.add('btn-active');
      if (this.props.userStockData.currentBuys === 0) {
        document.getElementById('buy-btn').classList.toggle('btn-active');
        buyBtnStyle.background = 'rgb(142, 142, 142)';
      }
      else {
        buyBtnStyle.background = 'rgb(39, 144, 214)';
      }
      if (this.props.userStockData.currentSells === 0) {
        document.getElementById('sell-btn').classList.toggle('btn-active');
        sellBtnStyle.background = 'rgb(142, 142, 142)';
      }
      else {
        sellBtnStyle.background = 'rgb(175, 3, 3)';
      }
    }

    let buttonsJSX = <div></div>;
    if (this.props.svgJSX.length > 0) {
      if (this.props.currentData.length === 0 || this.props.currentData.length  !== this.props.data.length) {
        buttonsJSX = (
          <div>
            <button onClick={() => {this.props.handleBuy()}} id="buy-btn" className="btn" style={buyBtnStyle} >Buy</button>
            <button onClick={() => {this.props.handleSell()}} id="sell-btn" className="btn" style={sellBtnStyle} >Sell</button>
          </div>
        );
      }
    }

    return(
      buttonsJSX
    );
  }
}

export default Buttons;
