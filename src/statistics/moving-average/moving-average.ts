import { TickExtended } from '../../binance/model';
import { MovingAverageCombination, MovingAverageStatistics } from './model';

export function aggregateMovingAverageStatistics(movingAverageStatistics: MovingAverageStatistics, _tick: TickExtended, _movingAverageCombinations: MovingAverageCombination[]): MovingAverageStatistics {
  return movingAverageStatistics;
}
