import { Binance, CandleSticksWithHistoryOptions, Period } from '../binance/model';
import { Console } from '../console/model';
import { CountStatisticsMap, Statistics } from './model';
import { map, scan } from 'rxjs/operators';
import { defaultCandleCountCombinations } from './candle-count/constants';
import { aggregateCandleCountStatistics } from './candle-count/candle-count';
import { defaultMovingAverageCombinations } from './moving-average-count/constants';
import { aggregateMovingAverageCountStatistics } from './moving-average-count/moving-average-count';
import { MovingAverageCountStatisticsMap } from './moving-average-count/model';
import { sortStatistic } from './helpers';

export function getStatistics(binance: Binance, console: Console): Statistics {
  return {
    analyzeCandleCount: (
      symbols = ['BTCUSDT'],
      period: Period = '1m',
      options: CandleSticksWithHistoryOptions = { finalOnly: true, limit: 50000 },
      candleCombinations = defaultCandleCountCombinations
    ) => {
      return binance.getCandleSticksWithHistory(symbols, period, options).pipe(
        scan((candleStatistics, candleStick) => {
          return aggregateCandleCountStatistics(candleStatistics, candleStick, candleCombinations, console);
        }, {} as CountStatisticsMap),
        map(statistics => {
          return Object.keys(statistics).reduce((csm, key) => {
            return {
              ...csm,
              [key]: statistics[key].sort(sortStatistic)
            };
          }, {} as CountStatisticsMap);
        })
      );
    },
    analyzeMovingAverageCount: (
      symbols = ['BTCUSDT'],
      period: Period = '1m',
      options: CandleSticksWithHistoryOptions = { finalOnly: true, limit: 50000 },
      movingAverageCombinations = defaultMovingAverageCombinations
    ) => {
      return binance.getCandleSticksWithHistory(symbols, period, options).pipe(
        scan((movingAverageStatistics, candleStick) => {
          return aggregateMovingAverageCountStatistics(movingAverageStatistics, candleStick, movingAverageCombinations, console);
        }, {} as MovingAverageCountStatisticsMap),
        map(statistics => {
          return Object.keys(statistics).reduce((macsm, key) => {
            return {
              ...macsm,
              [key]: statistics[key].sort(sortStatistic)
            };
          }, {} as MovingAverageCountStatisticsMap);
        })
      );
    }
  };
}
