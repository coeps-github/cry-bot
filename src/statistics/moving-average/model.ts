export interface MovingAverageStatistics {
  readonly [key: string]: MovingAverageStatistic[];
}

export interface MovingAverageStatistic {
  readonly combination: MovingAverageCombination;
  readonly hits: number;
  readonly currentWin: number;
  readonly totalWin: number;
  readonly minWin: number;
  readonly avgWin: number;
  readonly maxWin: number;
}

export interface MovingAverageCombination {
  readonly small: number;
  readonly big: number;
}
