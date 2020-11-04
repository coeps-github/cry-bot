import { CountCombination, CountStatistic, CountStatisticsMap } from '../model';
import { SMA } from 'trading-signals';

export interface MovingAverageStatisticsMap extends CountStatisticsMap {
  readonly [key: string]: MovingAverageStatistic[];
}

export interface MovingAverageStatistic extends CountStatistic {
  readonly combination: MovingAverageCombination;
  readonly sma: SMA;
}

export interface MovingAverageCombination extends CountCombination {
  readonly sma: number;
}
