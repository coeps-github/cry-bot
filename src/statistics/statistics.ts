import { Binance, Period } from '../binance/model';
import { CandleStatistics, Statistics } from './model';
import { scan } from 'rxjs/operators';
import { candleCombinations } from './constants';
import { aggregateHits, aggregateWin, getNextDownCount, getNextUpCount } from './helpers';

export function getStatistics(binance: Binance): Statistics {
  return {
    analyzeCandles: (symbols = ['BTCUSDT'], period: Period = '1m', combinations = candleCombinations) => {
      return binance.getTicks(symbols, period).pipe(
        scan((result, tick) => {
          const statistics = result[tick.symbol] || combinations.map(cc => ({
            combination: cc,
            hits: 0,
            win: 0,
            upCount: 0,
            downCount: 0
          }));
          const updatedStatistics = statistics.map(statistic => {
            const hits = aggregateHits(tick, statistic);
            const win = aggregateWin(tick, statistic);
            const upCount = getNextUpCount(tick, statistic);
            const downCount = getNextDownCount(tick, statistic);
            return {
              ...statistic,
              hits,
              win,
              upCount,
              downCount
            };
          });
          return {
            ...result,
            [tick.symbol]: updatedStatistics
          };
        }, {} as CandleStatistics)
      );
    }
  };
}
