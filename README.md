# cry-bot
crypto trade bot - node console app

## statistics
### count
- analyzeCandleCount: no. of consecutive up candles as buy trigger and no. of consecutive down candles as sell trigger (2 up, 3 down ?)
- analyzeMovingAverageCount: no. of consecutive up sma as buy trigger and no. of consecutive down sma as sell trigger (5 up, 5 down, sma 5 ?)

### increase over time
- analyzeCandleIncreaseOverTime: increase in % per no. of candles as buy trigger and decrease in % per no. of candles as sell trigger (0.2% up, 0.2% down, 5min/candles ?)
- analyzeMovingAverageIncreaseOverTime: increase in % of sma per no. of candles as buy trigger and decrease in % of sma per no. of candles as sell trigger (0.2% up, 0.2% down, sma 5, 5min/candles ?)

### bollinger bands
- analyzeBollingerBands: MA 1 crosses lower/median boll upwards as buy trigger and MA 1 crosses upper/median/lower boll downwards as sell trigger (20, x1.5 ?)

### todo
- Maybe combinations with "BB squeeze" and "being close to lower BB" and "2 consecutive up candles"?
- ...

## trade
### todo
- ...

## div

### libs
- https://www.npmjs.com/package/node-binance-api
- https://www.npmjs.com/package/trading-signals

### theory
- https://www.investopedia.com/terms/m/movingaverage.asp
- https://www.investopedia.com/terms/b/bollingerbands.asp
