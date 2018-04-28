import React, { Component } from 'react';

class StockData extends Component {
  render() {
    let stockDataJSX = [];
    const userStockData = this.props.userStockData;
    const buys = this.props.buys;
    const sells = this.props.sells;
    if (this.props.svgJSX.length > 0) {
      stockDataJSX.push(<p>You have {userStockData.currentStocks} stocks plus cash worth a total of ${(parseFloat(userStockData.currentStockValue) + parseFloat(userStockData.bank)).toFixed(2)}</p>);
      stockDataJSX.push(<p>You have {userStockData.currentBuys} {buys} and {userStockData.currentSells} {sells} left</p>);
    }
    return (
      <div>
        {stockDataJSX}
      </div>
    )
  }
}

export default StockData
