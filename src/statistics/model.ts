import { Observable } from 'rxjs';
import { Period } from '../binance/model';

export interface Statistics {
  readonly analyzeCandles: (symbols?: string[], period?: Period) => Observable<CandleStatistics>;
}

export interface CandleStatistics {

}
