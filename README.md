# StockIT

StockIT is a machine learning web app game that allows the user to compete agiainst the AI in buying/selling stocks. Random stocks are chosen and a random date in the past is chosen. The stock price starts trending from that date and continues for 365 days. While the stock price trends, the user competes against the AI in buying/selling stocks.

Pandas and Scikit Learn was used to develop a linear regression model to predict stock price. D3 and React were used to plot the data and update the leaderboard. Optimized for desktop and mobile.

## Getting Started

In order to run a dev server on your local host, you will need to first install all the required npm packages for the frontend.

`cd client`

`npm install`

Now that you have installed all the required frontend packages, you can start the frontend server on port 3000:

`npm start`

Next you will need to install the required python packages:

`cd ..`
`pip install -r requirements.txt`

Now you can open up an additional terminal and start up a server for the backend on port 5000:

`python -m flask run FLASK_APP=app.py`

`flask run`

Now you are all set up!

## Built With

* React
* D3
* Python
* Flask
* Pandas
* Scikit Learn

## Authors

Austin Tackaberry

## License

This project is licensed under the MIT License - see the LICENSE.md file for details
