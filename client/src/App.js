import React, { Component } from 'react';
import * as d3 from "d3";
import './App.css';
import Leaderboard from './components/Leaderboard.js';
import Podium from './components/Podium.js';
import Buttons from './components/Buttons.js';
import StockData from './components/StockData.js';
import Slider from './components/Slider.js';
var async = require('async');

class App extends Component {

  constructor() {
    super();
    this.state = {
      svgJSX:[],
      data: [],
      currentData: [],
      currentUserScatterData: [],
      currentUserScatterColor: [],
      currentMLScatterData: [],
      currentMLScatterColor: [],
      randStock: '',
      stocks: [
        ['Apple Inc.','AAPL'],
        ['Pandora','P'],
        ['Microsoft','MSFT'],
        ['Alphabet','GOOGL'],
        ['IBM','IBM'],
        ['Intel','INTC'],
        ['Cisco Systems','CSCO'],
        ['Oracle','ORCL'],
        ['Facebook','FB'],
        ['Zynga','ZNGA'],
        ['HP','HPQ'],
        ['Walmart','WMT'],
        ['Tesla','TSLA'],
        ['Amazon','AMZN'],
        ['ExxonMobil','XOM'],
        ['Goldman Sachs','GS'],
        ['JPMorgan Chase','JPM'],
        ['Twitter', 'TWTR'],
        ['Salesforce','CRM'],
        ["Macy's", 'M'],
        ['Advanced Auto Parts Inc.','AAP'],
        ['Marathon Oil','MRO'],
        ['Kroger','KR'],
        ['Foot Locker','FL'],
        ['Target','TGT'],
        ['Bed Bath & Beyond','BBBY'],
        ['AutoZone','AZO'],
        ['Under Armour','UAA'],
        ['Mattel', 'MAT'],
        ["Kohl's",'KSS'],
        ['Schlumberger','SLB'],
        ['TripAdvisor','TRIP']
      ],
      gettingNewStock: false,
      userStockJSX: [],
      userStockData: {
        currentStocks: 3,
        currentBuys: 3,
        currentSells: 3,
        initialStocks: 3,
        initialBuys: 3,
        initialSells: 3,
        bank: 0
      },
      mlStockData: {
        currentStocks: 3,
        currentBuys: 3,
        currentSells: 3,
        initialStocks: 3,
        initialBuys: 3,
        initialSells: 3,
        bank: 0
      },
      userBought: false,
      userSold: false,
      records: {
        scoreHasBeenCalcd: false,
        gamesPlayed: 0,
        leaderboard: [
          {
            name: 'User',
            score: 0
          },
          {
            name: 'AI',
            score: 0
          },
          {
            name: 'Market',
            score: 0
          }
        ]
      },
      podium: [
        {
          name: 'User',
          stockValue: 0
        },
        {
          name: 'AI',
          stockValue: 0
        },
        {
          name: 'Market',
          stockValue: 0
        }
      ],
      resizing: false,
      leaderboardIsHidden: false,
      sliderVal: 50,
      showStartScreen: true,
    }
    this.plotGraph = this.plotGraph.bind(this);
    this.plotTimer = this.plotTimer.bind(this);
    this.handleStart = this.handleStart.bind(this);
    this.handleResize = this.handleResize.bind(this);
    this.handleBuySell = this.handleBuySell.bind(this);
    this.handleBuy = this.handleBuy.bind(this);
    this.handleSell = this.handleSell.bind(this);
    this.handleSlider = this.handleSlider.bind(this);
    this.getNewStock = this.getNewStock.bind(this);
    this.checkMLBuySell = this.checkMLBuySell.bind(this);
    this.calcScore = this.calcScore.bind(this);
    this.handleLeaderboardClick = this.handleLeaderboardClick.bind(this);
  }

  componentWillMount() {
    document.addEventListener("keydown", this.handleBuySell, false);
    window.addEventListener("resize", this.handleResize, false);
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.state.leaderboardIsHidden !== prevState.leaderboardIsHidden) {
      document.body.style.zoom = 1.0;
      this.handleResize();
    }
}

  handleResize() {
    var currentData = this.state.currentData.slice();
    var data = this.state.data.slice();
    var currentUserScatterData = this.state.currentUserScatterData.slice();
    var currentUserScatterColor = this.state.currentUserScatterColor.slice();
    var currentMLScatterData = this.state.currentMLScatterData.slice();
    var currentMLScatterColor = this.state.currentMLScatterColor.slice();
    if (currentData.length > 0 && currentData.length === data.length) {
      this.setState({resizing:true});
      this.plotGraph(data, currentData, currentUserScatterData, currentUserScatterColor, currentMLScatterData, currentMLScatterColor);
    }
  }

  handleSlider(event) {
    this.setState({sliderVal:event.target.value});
  }

  getNewStock() {
    var data = [];
    var randStock;
    var stocks = this.state.stocks.slice();
    var userStockData = this.state.userStockData;
    var mlStockData = this.state.mlStockData;
    async.series([
      (callback) => {
        randStock = stocks[Math.floor(Math.random()*stocks.length)];
        console.log(randStock);
        fetch('/getstockdata/?stock=' + randStock[1], {
          method: 'get'
        }).then(function(res) {
          return res.json();
        }).then(function(response) {
          data = JSON.parse(response).data;
          callback();
        });
      },
      (callback) => {
        userStockData.finalStockValue = parseFloat(data[data.length-1].EOD * userStockData.currentStocks);
        this.setState({
          data:data,
          randStock:randStock,
          currentData: [],
          currentUserScatterData: [],
          currentUserScatterColor: [],
          currentMLScatterData: [],
          currentMLScatterColor: [],
          gettingNewStock: false,
          userStockData: userStockData,
          mlStockData: mlStockData,
        });
        this.plotTimer();
        callback();
      }
    ]);
  }

  handleStart() {
    if (document.getElementById('start-btn').classList.contains('btn-active')) {
      document.getElementById('start-btn').style.backgroundColor = 'rgb(142, 142, 142)';
      document.getElementById('start-btn').classList.toggle('btn-active');
      var currentData = this.state.currentData.slice();
      var data = this.state.data.slice();
      var userStockData = this.state.userStockData;
      var mlStockData = this.state.mlStockData;
      if (currentData.length === data.length) {
        userStockData.currentStocks = userStockData.initialStocks;
        userStockData.currentBuys = userStockData.initialBuys;
        userStockData.currentSells = userStockData.initialSells;
        userStockData.bank = 0;
        mlStockData.currentStocks = mlStockData.initialStocks;
        mlStockData.currentBuys = mlStockData.initialBuys;
        mlStockData.currentSells = mlStockData.initialSells;
        mlStockData.bank = 0;
        this.setState({
          gettingNewStock: true,
          userStockData: userStockData,
          mlStockData: mlStockData
        });
        this.getNewStock();
      }
    }
  }

  handleBuySell = (event) => {
    var userStockData = this.state.userStockData;
    if (event.key == 'ArrowDown' && userStockData.currentSells > 0) {
      this.setState({userSold:true});
    }
    if (event.key == 'ArrowUp' && userStockData.currentBuys > 0) {
      this.setState({userBought:true});
    }
  }
  handleBuy = (event) => {
    var userStockData = this.state.userStockData;
    if (userStockData.currentBuys > 0) {
      this.setState({userBought:true});
    }
  }
  handleSell = (event) => {
    var userStockData = this.state.userStockData;
    if (userStockData.currentSells > 0) {
      this.setState({userSold:true});
    }
  }

  checkMLBuySell(currentData) {
    var lastElem = currentData[currentData.length-1];
    var dataLength = this.state.data.length;
    var currentDataLength = currentData.length;
    var multiplier = (dataLength*0.88 - currentDataLength) / (dataLength*0.88) * 1.0;
    if (multiplier < 0.01) {
      multiplier = 0.01;
    }
    var mlStockData = this.state.mlStockData;
    var pctDiff = (lastElem.prediction - lastElem.EOD) / lastElem.EOD * 100.0;
    if (currentDataLength % 1 === 0) {
      if (pctDiff > 10 * multiplier && mlStockData.currentBuys > 0) {
        return 'buy';
      }
      if (pctDiff < -10 * multiplier && mlStockData.currentSells > 0) {
        return 'sell';
      }
    }
    return false;
  }

  plotTimer() {
    var data = this.state.data.slice();
    var currentData = this.state.currentData.slice();
    var currentUserScatterData = this.state.currentUserScatterData.slice();
    var currentUserScatterColor = this.state.currentUserScatterColor.slice();
    var currentMLScatterData = this.state.currentMLScatterData.slice();
    var currentMLScatterColor = this.state.currentMLScatterColor.slice();
    var records = this.state.records;
    if (data.length !== currentData.length) {
      if (records.scoreHasBeenCalcd) {
        records.scoreHasBeenCalcd = false;
      }
      currentData = data.slice(0,currentData.length+1);
      var userStockData = this.state.userStockData;
      var mlStockData = this.state.mlStockData;
      var lastStockPrice = parseFloat(currentData[currentData.length-1].EOD);
      var mlShouldBuySell = this.checkMLBuySell(currentData);
      if (mlShouldBuySell) {
        if (mlShouldBuySell === 'buy') {
          currentMLScatterColor.push("rgba(39, 144, 214, 0.4)");
          currentMLScatterData.push(currentData[currentData.length-1]);
          mlStockData.currentBuys--;
          mlStockData.currentStocks++;
          mlStockData.bank = (parseFloat(mlStockData.bank) - lastStockPrice).toFixed(2);
          mlStockData.currentStockValue += lastStockPrice;
        }
        else if (mlShouldBuySell === 'sell') {
          currentMLScatterColor.push("rgba(175, 3, 3, 0.4)");
          currentMLScatterData.push(currentData[currentData.length-1]);
          mlStockData.currentSells--;
          mlStockData.currentStocks--;
          mlStockData.bank = (parseFloat(mlStockData.bank) + lastStockPrice).toFixed(2);
          mlStockData.currentStockValue -= lastStockPrice;
        }
      }
      if (this.state.userSold) {
        currentUserScatterColor.push("rgba(175, 3, 3, 1.0)");
        currentUserScatterData.push(currentData[currentData.length-1]);
        userStockData.currentSells--;
        userStockData.currentStocks--;
        userStockData.bank = (parseFloat(userStockData.bank) + lastStockPrice).toFixed(2);
        userStockData.currentStockValue -= lastStockPrice;
        this.setState({userSold:false});
      }
      else if (this.state.userBought) {
        currentUserScatterColor.push("rgba(39, 144, 214, 1.0)");
        currentUserScatterData.push(currentData[currentData.length-1]);
        userStockData.currentBuys--;
        userStockData.currentStocks++;
        userStockData.bank = (parseFloat(userStockData.bank) - lastStockPrice).toFixed(2);
        userStockData.currentStockValue += lastStockPrice;
        this.setState({userBought:false});
      }
      userStockData.currentStockValue = (lastStockPrice * userStockData.currentStocks).toFixed(2);
      mlStockData.currentStockValue = (lastStockPrice * mlStockData.currentStocks).toFixed(2);
      this.setState({
        userStockData:userStockData,
        mlStockData:mlStockData,
      });
      var timeWait;
      if (userStockData.currentBuys + userStockData.currentSells === 0) {
        timeWait = 50;
      }
      else {
        timeWait = 450-this.state.sliderVal*4;
      }
      setTimeout(function () {
        this.plotGraph(data, currentData, currentUserScatterData, currentUserScatterColor, currentMLScatterData, currentMLScatterColor);
      }.bind(this), timeWait);
    }
    else {
      if (!records.scoreHasBeenCalcd) {
        records.scoreHasBeenCalcd = true;
        this.calcScore();
      }
    }
    this.setState({records:records});
  }

  calcScore() {
    var userStockData = this.state.userStockData;
    var mlStockData = this.state.mlStockData;
    var podium = [
      {
        name: 'User',
        stockValue: parseFloat((parseFloat(userStockData.currentStockValue) + parseFloat(userStockData.bank)).toFixed(2))
      },
      {
        name: 'AI',
        stockValue: parseFloat((parseFloat(mlStockData.currentStockValue) + parseFloat(mlStockData.bank)).toFixed(2))
      },
      {
        name: 'Market',
        stockValue: parseFloat(userStockData.finalStockValue.toFixed(2))
      }
    ];
    podium.sort(function (a, b) {
        return b.stockValue - a.stockValue;
      }
    );
    var lastScores = {};
    var pointsGiven = 0;
    if (podium[0].stockValue !== podium[1].stockValue) {
      lastScores[podium[0].name] = 3;
      pointsGiven += 3;
    }
    if (podium[2].stockValue !== podium[1].stockValue) {
      lastScores[podium[2].name] = 1;
      pointsGiven += 1;
    }
    if (pointsGiven === 4) {
      lastScores[podium[1].name] = 2;
      pointsGiven += 2;
    }
    if (pointsGiven === 0) {
      lastScores[podium[0].name] = 2;
      lastScores[podium[1].name] = 2;
      lastScores[podium[2].name] = 2;
      pointsGiven += 6;
    }
    else if (pointsGiven === 3) {
      lastScores[podium[1].name] = 1.5;
      lastScores[podium[2].name] = 1.5;
      pointsGiven += 3;
    }
    else if (pointsGiven === 1) {
      lastScores[podium[0].name] = 2.5;
      lastScores[podium[1].name] = 2.5;
      pointsGiven += 5;
    }

    var records = this.state.records;
    records.gamesPlayed++;

    for (let i = 0; i < records.leaderboard.length; i++) {
      if (records.leaderboard[i].name === 'User') {
        records.leaderboard[i].score += lastScores['User']
      }
      if (records.leaderboard[i].name === 'AI') {
        records.leaderboard[i].score += lastScores['AI']
      }
      if (records.leaderboard[i].name === 'Market') {
        records.leaderboard[i].score += lastScores['Market']
      }
    }
    records.leaderboard.sort(function (a, b) {
        return b.score - a.score;
      }
    );

    this.setState({
      podium:podium,
      records:records
    })
  }

  plotGraph(data, currentData, currentUserScatterData, currentUserScatterColor, currentMLScatterData, currentMLScatterColor) {
    var margin;
    var outerWidth;
    var svgStyle = {};
    margin = {top: window.innerHeight/20.0, right: window.innerWidth/35.0, bottom: window.innerHeight/45.0, left: window.innerWidth/12.0};
    if (margin.top > 20) {
      margin.top = 20;
    }
    if (margin.bottom > 20) {
      margin.bottom = 20;
    }
    if (margin.left > 30) {
      margin.left = 30;
    }
    if (margin.right > 10) {
      margin.right = 10;
    }
    outerWidth = (window.innerWidth - document.getElementById('leaderboard').offsetWidth);
    var padding = {top: window.innerHeight/39.0, right: window.innerWidth/35.0, bottom: 20, left: 25};
    if (padding.right > 15) {
      padding.right = 15;
    }
    var outerHeight = window.innerHeight*0.7;
    if (outerHeight > 1.5*outerWidth) {
      outerHeight = 1.5*outerWidth;
    }
    var innerWidth = outerWidth - margin.left - margin.right;
    var innerHeight = outerHeight - margin.top - margin.bottom;
    var width = innerWidth - padding.left - padding.right;
    var height = innerHeight - padding.top - padding.bottom;

    var selectX = datum => (new Date(datum['Date']).setHours(0,0,0,0));
    var selectY = datum => datum.EOD;
    var xScale = d3.scaleTime()
                   .domain(d3.extent(currentData, selectX))
                   .range([margin.left+padding.left, margin.left+padding.left+width]);
    var yScale = d3.scaleLinear()
                   .domain(d3.extent(currentData, selectY))
                   .range([margin.top+padding.top+height, margin.top+padding.top]);
    const xAxis = d3.axisBottom()
                    .scale(xScale)
                    .ticks(Math.floor(window.innerWidth/183.0));
    const yAxis = d3.axisLeft()
                    .scale(yScale)
                    .ticks(5);
    const selectScaledX = datum => xScale(selectX(datum));
    const selectScaledY = datum => yScale(selectY(datum));
    const sparkLine = d3.line()
                        .x(selectScaledX)
                        .y(selectScaledY);
    const linePath = sparkLine(currentData);
    const userCirclePoints = currentUserScatterData.map(datum => ({
      x: selectScaledX(datum),
      y: selectScaledY(datum),
    }));
    const mlCirclePoints = currentMLScatterData.map(datum => ({
      x: selectScaledX(datum),
      y: selectScaledY(datum),
    }));
    var randStockName = this.state.randStock[0];
    var title = [];
    if (currentData.length === data.length) {
      title.push(
        <text
          x={(outerWidth/2)}
          y={(margin.top)}
          style={{
            "font-size": "1.2em",
            "font-weight": "bold",
            "text-anchor": "middle"
          }}
          >
            {randStockName}
          </text>
        );
    }
    var svgJSX = [];
    svgJSX.push(
      <svg
        className="container"
        height={outerHeight}
        width={outerWidth}
        style={svgStyle}
      >
        <g
          className="xAxis"
          ref={node => d3.select(node).call(xAxis)}
          style={{
            transform: `translateY(${height+padding.top+margin.top}px)`,
            "font-size": "1.0em"
          }}
        />
        <g
          className="yAxis"
          ref={node => d3.select(node).call(yAxis)}
          style={{
            transform: `translateX(${padding.left+margin.left}px)`,
            "font-size": "1.0em"
          }}
        />
        <g className="line">
          <path d={linePath} />
        </g>
        <g className="scatter">
          {userCirclePoints.map((circlePoint, index) => (
            <circle
              cx={circlePoint.x}
              cy={circlePoint.y}
              key={`${circlePoint.x},${circlePoint.y}`}
              r={6}
              style={{"fill":currentUserScatterColor[index]}}
            />
          ))}
        </g>
        <g className="scatter">
          {mlCirclePoints.map((circlePoint, index) => (
            <circle
              cx={circlePoint.x}
              cy={circlePoint.y}
              key={`${circlePoint.x},${circlePoint.y}`}
              r={6}
              style={{"fill":currentMLScatterColor[index]}}
            />
          ))}
        </g>
        {title}
      </svg>
    );
    this.setState(
      {
        svgJSX:svgJSX,
        data:data,
        currentData:currentData,
        currentUserScatterData:currentUserScatterData,
        currentUserScatterColor: currentUserScatterColor,
        currentMLScatterData:currentMLScatterData,
        currentMLScatterColor: currentMLScatterColor,
        showStartScreen: false
      }
    );
    var gettingNewStock = this.state.gettingNewStock;
    var resizing = this.state.resizing;
    if (currentData.length !== 0 && !gettingNewStock && !resizing) {
      this.plotTimer();
    }
    this.setState({resizing:false});
  }

  handleLeaderboardClick() {
    document.getElementById('hamburger').classList.toggle("change");
    this.setState({leaderboardIsHidden:!this.state.leaderboardIsHidden});
  }

  render() {
    var records = this.state.records;
    var data = this.state.data.slice();
    var currentData = this.state.currentData.slice();
    var userStockData = this.state.userStockData;
    var podium = this.state.podium;
    var svgJSX = this.state.svgJSX.slice();
    var gettingNewStock = this.state.gettingNewStock;
    var bankStr;
    if (userStockData.bank < 0) {
      bankStr = '-$' + (-1*userStockData.bank);
    }
    else {
      bankStr = '$' + userStockData.bank;
    }
    var buys = 'buys';
    if (userStockData.currentBuys === 1) {
      buys = 'buy';
    }
    var sells = 'sells';
    if (userStockData.currentSells === 1) {
      sells = 'sell';
    }
    var introJSX = [];
    var startJSX = [];
    if (svgJSX.length > 0) {
      document.getElementById('container').classList.add('content-container');
      document.getElementById('container').classList.remove('landing');
      if (currentData.length !== 0 && currentData.length  === data.length) {
        startJSX.push(
          <div id="start-buy-sell-container">
            <button onClick={() => {this.handleStart()}} id="start-btn" className="btn btn-active" >Start</button>
          </div>
        );
      }
    }
    else {
      introJSX.push(
        <div id="intro">
          <h2>Welcome to StockIT!</h2>
          <h4>Test your stock-picking skills against the market and a machine learning algorithm</h4>
          <p>A random 365-day period of a random stock will be chosen. You and the AI will each start with 3 stocks, 3 "buys", and 3 "sells". Press the up arrow key to "buy" a stock, and press the down arrow key to "sell" a stock.</p>
          <br />
          <p>Good Luck!</p>
          <br />
        </div>
      );
      startJSX.push(
        <div id="start-buy-sell-container">
          <button onClick={() => {this.handleStart()}} id="start-btn" className="btn btn-active" >Start</button>
        </div>
      );
    }
    return (
      <div>
        <div id="container" className="landing">
          {introJSX}
          <div id="svg-container">
            {svgJSX}
            <div id="below-svg">
              <div id="start-buy-sell-container">
                <Slider
                  sliderVal = {this.state.sliderVal}
                  handleSlider={(event) => this.handleSlider(event)}
                  showStartScreen={this.state.showStartScreen}
                />
                {startJSX}
                <Buttons
                  svgJSX={svgJSX}
                  currentData={currentData}
                  data={data}
                  handleBuy={() => this.handleBuy()}
                  handleSell={() => this.handleSell()}
                  userStockData={userStockData}
                />
              </div>
              <StockData
                svgJSX={svgJSX}
                userStockData={userStockData}
                buys={buys}
                sells={sells}
              />
              <Podium
                currentData={currentData}
                data={data}
                gettingNewStock={gettingNewStock}
                podium={podium}
              />
            </div>
          </div>
          <Leaderboard
            leaderboardIsHidden={this.state.leaderboardIsHidden}
            handleLeaderboardClick={() => this.handleLeaderboardClick()}
            records={records}
            data={data}
            currentData={currentData}
          />
        </div>
      </div>
    );
  }
}

export default App;
