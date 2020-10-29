import { Binance, Period } from '../binance/model';
import { CandleStatistics, Statistics } from './model';
import { scan } from 'rxjs/operators';
import { up, win } from './helpers';
import { candleCombinations } from './constants';

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
            const tickIsUp = up(tick);
            const combinationUp = statistic.combination.up > 0 ? statistic.combination.up : 1;
            const combinationDown = statistic.combination.down > 0 ? statistic.combination.down : 1;
            const buy = statistic.upCount > (combinationUp - 1);
            const sell = buy && statistic.downCount > (combinationDown - 1);
            const upCount = tickIsUp ? statistic.upCount + 1 : buy ? statistic.upCount : 0;
            const downCount = buy && !tickIsUp ? statistic.downCount + 1 : sell ? statistic.downCount : 0;
            const hits = buy && sell ? statistic.hits + 1 : statistic.hits;
            const w = buy && !sell ? statistic.win + win(tick) : statistic.win;
            return {
              ...statistic,
              hits,
              win: w,
              upCount: buy && sell ? 0 : upCount,
              downCount: buy && sell ? 0 : downCount
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
