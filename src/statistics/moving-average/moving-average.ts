import { TickExtended } from '../../binance/model';
import { MovingAverageCombination, MovingAverageStatistics } from './model';
import {
  aggregateAvgWinPerCycle,
  aggregateCurrentWin,
  aggregateHits,
  aggregateMaxWinPerCycle,
  aggregateMinWinPerCycle,
  aggregateTotalWin,
  getWin
} from '../helpers';
import { buy, sell } from './helpers';
import { SMA } from 'trading-signals';

export function aggregateMovingAverageStatistics(movingAverageStatistics: MovingAverageStatistics, tick: TickExtended, movingAverageCombinations: MovingAverageCombination[]): MovingAverageStatistics {
  const statistics = movingAverageStatistics[tick.symbol] || movingAverageCombinations.map(mac => ({
    combination: mac,
    hits: 0,
    currentWin: 0,
    totalWin: 0,
    minWin: 0,
    avgWin: 0,
    maxWin: 0,
    smallSMA: new SMA(mac.small),
    bigSMA: new SMA(mac.big)
  }));
  const updatedStatistics = statistics.map(statistic => {
    const win = getWin(tick);
    const pBuy = buy(statistic);
    const pSell = sell(statistic);
    statistic.smallSMA.update(tick.close);
    statistic.bigSMA.update(tick.close);
    const s = sell(statistic);
    const hits = aggregateHits(pBuy, s, statistic);
    const currentWin = aggregateCurrentWin(pBuy, pSell, s, win, statistic);
    const totalWin = aggregateTotalWin(pBuy, pSell, win, statistic);
    const minWin = aggregateMinWinPerCycle(pBuy, pSell, win, statistic);
    const avgWin = aggregateAvgWinPerCycle(pBuy, pSell, hits, totalWin, statistic);
    const maxWin = aggregateMaxWinPerCycle(pBuy, pSell, win, statistic);
    return {
      ...statistic,
      hits,
      currentWin,
      totalWin,
      minWin,
      avgWin,
      maxWin
    };
  });
  return {
    ...movingAverageStatistics,
    [tick.symbol]: updatedStatistics
  };
}
