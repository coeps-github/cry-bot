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
