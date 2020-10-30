# cry-bot
crypto trade bot - node console app

## statistics
- analyzeCandles: which combination could be optimal: no. of consecutive up candles as buy trigger and no. of consecutive down candles as sell trigger (2 up, 1 down ?)
- analyzeMovingAverage: which combination could be optimal: small MA crosses big MA upwards as buy trigger and small MA crosses big MA downwards as sell trigger (small 5, big 15 ?)
- analyzeBollingerBands: which combination could be optimal: MA 1 crosses lower boll upwards as buy trigger and MA 1 crosses higher boll downwards as sell trigger (20, x1.5 ?)

### libs
- https://www.npmjs.com/package/node-binance-api
- https://www.npmjs.com/package/trading-signals

### theory
- https://www.investopedia.com/terms/m/movingaverage.asp
- https://www.investopedia.com/terms/b/bollingerbands.asp
