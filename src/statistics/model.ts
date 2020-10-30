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
  readonly currentWin: number;
  readonly totalWin: number;
  readonly minWin: number;
  readonly avgWin: number;
  readonly maxWin: number;
  readonly upCount: number;
  readonly downCount: number;
}

export interface CandleCombination {
  readonly up: number;
  readonly down: number;
}
