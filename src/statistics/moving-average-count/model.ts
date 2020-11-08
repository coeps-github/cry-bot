import { CountCombination, CountStatistic, CountStatisticsMap, QuoteStatistic } from '../model';
import { SMA } from 'trading-signals';

export interface MovingAverageCountStatisticsMap extends CountStatisticsMap {
  readonly [key: string]: {
    readonly statistics: MovingAverageCountStatistic[];
    readonly quoteStatistic: QuoteStatistic;
  };
}

export interface MovingAverageCountStatistic extends CountStatistic {
  readonly combination: MovingAverageCountCombination;
  readonly sma: SMA;
}

export interface MovingAverageCountCombination extends CountCombination {
  readonly sma: number;
}
