import { Observable } from 'rxjs';
import { Period } from '../binance/model';
import { CandleCombination, CandleStatistics } from './candles/model';
import { MovingAverageCombination, MovingAverageStatistics } from './moving-average/model';

export interface Statistics {
  readonly analyzeCandles: (symbols?: string[], period?: Period, candleCombinations?: CandleCombination[]) => Observable<CandleStatistics>;
  readonly analyzeMovingAverage: (symbols?: string[], period?: Period, movingAverageCombinations?: MovingAverageCombination[]) => Observable<MovingAverageStatistics>;
}
