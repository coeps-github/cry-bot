import { Observable } from 'rxjs';
import { CandleSticksWithHistoryOptions, Period } from '../binance/model';
import { MovingAverageCountCombination, MovingAverageCountStatisticsMap } from './moving-average-count/model';

export interface Statistics {
  readonly analyzeCandleCount: (symbol?: string, period?: Period, options?: CandleSticksWithHistoryOptions, candleCombinations?: CountCombination[]) => Observable<CountStatisticsMap>;
  readonly analyzeMovingAverageCount: (symbol?: string, period?: Period, options?: CandleSticksWithHistoryOptions, movingAverageCombinations?: MovingAverageCountCombination[]) => Observable<MovingAverageCountStatisticsMap>;
}

export interface StatisticsMap {
  readonly [key: string]: {
    readonly statistics: Statistic[];
    readonly quoteStatistic: QuoteStatistic;
  };
}

export interface Statistic {
  readonly combination: Record<string, number>;
  readonly hits: number;
  readonly currentWin: number;
  readonly totalWin: number;
  readonly minWin: number;
  readonly avgWin: number;
  readonly maxWin: number;
  readonly buy: boolean;
  readonly sell: boolean;
}

export interface QuoteStatistic {
  readonly totalWin: number;
  readonly totalTicks: number;
}

export interface GraphStatistic extends Statistic {
  readonly buy: boolean;
  readonly sell: boolean;
}

export interface CountStatisticsMap extends StatisticsMap {
  readonly [key: string]: {
    readonly statistics: CountStatistic[];
    readonly quoteStatistic: QuoteStatistic;
  };
}

export interface CountStatistic extends Statistic {
  readonly combination: CountCombination;
  readonly upCount: number;
  readonly downCount: number;
}

export interface CountCombination extends Record<string, number> {
  readonly up: number;
  readonly down: number;
}
