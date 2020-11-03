import { Statistic } from '../model';
import { SMA } from 'trading-signals';

export interface MovingAverageStatistics {
  readonly [key: string]: MovingAverageStatistic[];
}

export interface MovingAverageStatistic extends Statistic {
  readonly combination: MovingAverageCombination;
  readonly smallSMA: SMA;
  readonly bigSMA: SMA;
}

export interface MovingAverageCombination extends Record<string, number> {
  readonly small: number;
  readonly big: number;
}
