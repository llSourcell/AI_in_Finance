import requests
from flask import Flask, request, jsonify, send_from_directory
app = Flask(__name__)
import pandas as pd
import quandl
import math
import random
import os
import numpy as np
from sklearn import preprocessing, cross_validation, svm
from sklearn.linear_model import LinearRegression

if 'ON_HEROKU' in os.environ:
    @app.route('/')
    def index():
        return send_from_directory('client/build','index.html')
    @app.route('/index.html')
    def index2():
        return send_from_directory('client/build','index.html')
    @app.route('/static/css/<filename>')
    def index_css(filename):
        return send_from_directory('client/build/static/css',filename)
    @app.route('/static/js/<filename>')
    def index_js(filename):
        return send_from_directory('client/build/static/js',filename)
    @app.route('/service-worker.js')
    def index_service_worker():
        return send_from_directory('client/build', 'service-worker.js')
    @app.route('/manifest.json')
    def index_manifest():
        return send_from_directory('client/build', 'manifest.json')
    @app.route('/favicon-16x16.png')
    def index_favicon16():
        return send_from_directory('client/build', 'favicon-16x16.png')
    @app.route('/favicon-32x32.png')
    def index_favicon32():
        return send_from_directory('client/build', 'favicon-32x32.png')
    @app.route('/favicon-96x96.png')
    def index_favicon96():
        return send_from_directory('client/build', 'favicon-96x96.png')

@app.route('/getstockdata/')
def getStockData():
    stock = request.args.get('stock', default=None, type=None)
    quandl.ApiConfig.api_key = "qWcicxSctVxrP9PhyneG"
    allData = quandl.get('WIKI/'+stock)
    dataLength = 251
    allDataLength = len(allData)
    firstDataElem = math.floor(random.random()*(allDataLength-dataLength))
    mlData = allData[0:firstDataElem+dataLength]

    def FormatForModel(dataArray):
        dataArray = dataArray[['Adj. Open', 'Adj. High', 'Adj. Low', 'Adj. Close', 'Adj. Volume']]
        dataArray['HL_PCT'] = (dataArray['Adj. High'] - dataArray['Adj. Close']) / dataArray['Adj. Close'] * 100.0
        dataArray['PCT_change'] = (dataArray['Adj. Close'] - dataArray['Adj. Open']) / dataArray['Adj. Open'] * 100.0
        dataArray = dataArray[['Adj. Close', 'HL_PCT', 'PCT_change','Adj. Volume']]
        dataArray.fillna(-99999, inplace=True)
        return dataArray

    mlData = FormatForModel(mlData)

    forecast_col = 'Adj. Close'
    forecast_out = int(math.ceil(0.12*dataLength))

    mlData['label'] = mlData[forecast_col].shift(-forecast_out)
    mlData.dropna(inplace=True)

    X = np.array(mlData.drop(['label'],1))
    X = preprocessing.scale(X)
    X_data = X[-dataLength:]
    X = X[:-dataLength]
    data = mlData[-dataLength:]
    mlData = mlData[:-dataLength]
    y = np.array(mlData['label'])

    X_train, X_test, y_train, y_test = cross_validation.train_test_split(X, y, test_size=0.3)

    clf = LinearRegression()
    clf.fit(X_train, y_train)
    accuracy = clf.score(X_test, y_test)

    prediction = clf.predict(X_data)
    data = data[['Adj. Close']]
    data = data.rename(columns={'Adj. Close':'EOD'})
    data['prediction'] = prediction[:]
    data = data.to_json(orient='table')
    return jsonify(data)
