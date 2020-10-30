import { Observable } from 'rxjs';
import { Period } from '../binance/model';
import { CandleCombination, CandleStatistics } from './candles/model';

export interface Statistics {
  readonly analyzeCandles: (symbols?: string[], period?: Period, candleCombinations?: CandleCombination[]) => Observable<CandleStatistics>;
}
