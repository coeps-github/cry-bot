import { Statistic } from '../model';

export interface CandleStatistics {
  readonly [key: string]: CandleStatistic[];
}

export interface CandleStatistic extends Statistic {
  readonly combination: CandleCombination;
  readonly upCount: number;
  readonly downCount: number;
}

export interface CandleCombination extends Record<string, number> {
  readonly up: number;
  readonly down: number;
}
