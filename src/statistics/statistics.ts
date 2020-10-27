import { Binance, Period } from '../binance/model';
import { Statistics } from './model';
import { of } from 'rxjs';

export function getStatistics(_binance: Binance): Statistics {
  return {
    analyzeCandles: (_symbols = ['BTCUSDT'], _period: Period = '1m') => {
      return of();
    }
  };
}
