import { Binance, Period } from '../binance/model';
import { Statistics } from './model';
import { scan } from 'rxjs/operators';
import { defaultCandleCountCombinations } from './candle-count/constants';
import { aggregateCandleCountStatistics } from './candle-count/candle-count';
import { defaultMovingAverageCombinations } from './moving-average-count/constants';
import { aggregateMovingAverageCountStatistics } from './moving-average-count/moving-average-count';

export function getStatistics(binance: Binance): Statistics {
  return {
    analyzeCandleCount: (symbols = ['BTCUSDT'], period: Period = '1m', candleCombinations = defaultCandleCountCombinations) => {
      return binance.getTicks(symbols, period).pipe(
        scan((candleStatistics, tick) => {
          return aggregateCandleCountStatistics(candleStatistics, tick, candleCombinations);
        }, {})
      );
    },
    analyzeMovingAverageCount: (symbols = ['BTCUSDT'], period: Period = '1m', movingAverageCombinations = defaultMovingAverageCombinations) => {
      return binance.getTicks(symbols, period).pipe(
        scan((movingAverageStatistics, tick) => {
          return aggregateMovingAverageCountStatistics(movingAverageStatistics, tick, movingAverageCombinations);
        }, {})
      );
    }
  };
}
