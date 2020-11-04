import { Observable } from 'rxjs';
import { Period } from '../binance/model';
import { MovingAverageCombination, MovingAverageStatisticsMap } from './moving-average/model';

export interface Statistics {
  readonly analyzeCandles: (symbols?: string[], period?: Period, candleCombinations?: CountCombination[]) => Observable<CountStatisticsMap>;
  readonly analyzeMovingAverage: (symbols?: string[], period?: Period, movingAverageCombinations?: MovingAverageCombination[]) => Observable<MovingAverageStatisticsMap>;
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
