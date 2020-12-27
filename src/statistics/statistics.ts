import { Binance, CandleSticksWithHistoryOptions, Period } from '../binance/model';
import { CountStatisticsMap, Statistics } from './model';
import { map, scan } from 'rxjs/operators';
import { defaultCandleCountCombinations } from './candle-count/constants';
import { aggregateCandleCountStatistics } from './candle-count/candle-count';
import { defaultMovingAverageCombinations } from './moving-average-count/constants';
import { aggregateMovingAverageCountStatistics } from './moving-average-count/moving-average-count';
import { sortStatistic } from './helpers';
import { MovingAverageCountStatisticsMap } from './moving-average-count/model';
import { GraphScreen } from '../graph/model';

export function getStatistics(binance: Binance): Statistics {
  return {
    analyzeCandleCount: (
      symbol = 'BTCUSDT',
      period: Period = '1m',
      options: CandleSticksWithHistoryOptions = { finalOnly: true, limit: 100000 },
      candleCombinations = defaultCandleCountCombinations,
      graphScreen?: GraphScreen
    ) => {
      return binance.getCandleSticksWithHistoryLocal(symbol, period, options).pipe(
        scan((candleStatistics, candleStick) => {
          return aggregateCandleCountStatistics(candleStatistics, candleStick, candleCombinations, graphScreen);
        }, {} as CountStatisticsMap),
        map(statistics => {
          return Object.keys(statistics).reduce((csm, key) => {
            return {
              ...csm,
              [key]: {
                ...statistics[key],
                statistics: statistics[key].statistics.sort(sortStatistic)
              }
            };
          }, {} as CountStatisticsMap);
        })
      );
    },
    analyzeMovingAverageCount: (
      symbol = 'BTCUSDT',
      period: Period = '1m',
      options: CandleSticksWithHistoryOptions = { finalOnly: true, limit: 100000 },
      movingAverageCombinations = defaultMovingAverageCombinations,
      graphScreen?: GraphScreen
    ) => {
      return binance.getCandleSticksWithHistoryLocal(symbol, period, options).pipe(
        scan((movingAverageStatistics, candleStick) => {
          return aggregateMovingAverageCountStatistics(movingAverageStatistics, candleStick, movingAverageCombinations, graphScreen);
        }, {} as MovingAverageCountStatisticsMap),
        map(statistics => {
          return Object.keys(statistics).reduce((macsm, key) => {
            return {
              ...macsm,
              [key]: {
                ...statistics[key],
                statistics: statistics[key].statistics.sort(sortStatistic)
              }
            };
          }, {} as MovingAverageCountStatisticsMap);
        })
      );
    }
  };
}
