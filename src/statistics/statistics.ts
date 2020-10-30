import { Binance, Period } from '../binance/model';
import { Statistics } from './model';
import { scan } from 'rxjs/operators';
import { defaultCandleCombinations } from './candles/constants';
import { aggregateCandleStatistics } from './candles/candles';

export function getStatistics(binance: Binance): Statistics {
  return {
    analyzeCandles: (symbols = ['BTCUSDT'], period: Period = '1m', candleCombinations = defaultCandleCombinations) => {
      return binance.getTicks(symbols, period).pipe(
        scan((candleStatistics, tick) => {
          return aggregateCandleStatistics(candleStatistics, tick, candleCombinations);
        }, {})
      );
    }
  };
}
