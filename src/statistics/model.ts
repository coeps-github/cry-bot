import { Observable } from 'rxjs';
import { CandleSticksWithHistoryOptions, Period } from '../binance/model';
import { MovingAverageCountCombination, MovingAverageCountStatisticsMap } from './moving-average-count/model';

export interface Statistics {
  readonly analyzeCandleCount: (symbols?: string[], period?: Period, options?: CandleSticksWithHistoryOptions, candleCombinations?: CountCombination[]) => Observable<CountStatisticsMap>;
  readonly analyzeMovingAverageCount: (symbols?: string[], period?: Period, options?: CandleSticksWithHistoryOptions, movingAverageCombinations?: MovingAverageCountCombination[]) => Observable<MovingAverageCountStatisticsMap>;
}

export interface StatisticsMap {
  readonly [key: string]: Statistic[];
}

export interface Statistic {
  readonly combination: Record<string, number>;
  readonly hits: number;
  readonly currentWin: number;
  readonly totalWin: number;
  readonly minWin: number;
  readonly avgWin: number;
  readonly maxWin: number;
}

export interface CountStatisticsMap extends StatisticsMap {
  readonly [key: string]: CountStatistic[];
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
