import { Binance, CandleStickHistoryOptions, Period } from '../binance/model';
import { Statistics } from './model';
import { scan } from 'rxjs/operators';
import { defaultCandleCountCombinations } from './candle-count/constants';
import { aggregateCandleCountStatistics } from './candle-count/candle-count';
import { defaultMovingAverageCombinations } from './moving-average-count/constants';
import { aggregateMovingAverageCountStatistics } from './moving-average-count/moving-average-count';

export function getStatistics(binance: Binance): Statistics {
  return {
    analyzeCandleCount: (
      symbols = ['BTCUSDT'],
      period: Period = '1m',
      options: CandleStickHistoryOptions = { finalOnly: true, limit: 999999999 },
      candleCombinations = defaultCandleCountCombinations
    ) => {
      return binance.getCandleSticksWithHistory(symbols, period, options).pipe(
        scan((candleStatistics, candleStick) => {
          return aggregateCandleCountStatistics(candleStatistics, candleStick, candleCombinations);
        }, {})
      );
    },
    analyzeMovingAverageCount: (
      symbols = ['BTCUSDT'],
      period: Period = '1m',
      options: CandleStickHistoryOptions = { finalOnly: true, limit: 999999999 },
      movingAverageCombinations = defaultMovingAverageCombinations
    ) => {
      return binance.getCandleSticksWithHistory(symbols, period, options).pipe(
        scan((movingAverageStatistics, candleStick) => {
          return aggregateMovingAverageCountStatistics(movingAverageStatistics, candleStick, movingAverageCombinations);
        }, {})
      );
    }
  };
}
