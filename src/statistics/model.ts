import { Observable } from 'rxjs';
import { Period } from '../binance/model';

export interface Statistics {
  readonly analyzeCandles: (symbols?: string[], period?: Period, combinations?: CandleCombination[]) => Observable<CandleStatistics>;
}

export interface CandleStatistics {
  readonly [key: string]: CandleStatistic[];
}

export interface CandleStatistic {
  readonly combination: CandleCombination;
  readonly hits: number;
  readonly win: number;
  readonly upCount: number;
  readonly downCount: number;
}

export interface CandleCombination {
  readonly up: number;
  readonly down: number;
}
