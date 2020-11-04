import { TickExtended } from '../../binance/model';
import { MovingAverageCombination, MovingAverageStatisticsMap } from './model';
import {
  aggregateAvgWinPerCycle,
  aggregateCurrentWin,
  aggregateHits,
  aggregateMaxWinPerCycle,
  aggregateMinWinPerCycle,
  aggregateTotalWin,
  getNextDownCount,
  getNextUpCount,
  getWin,
  prevBuy,
  prevSell,
  sell
} from '../helpers';
import { SMA } from 'trading-signals';
import { smaIsUp } from './helpers';

export function aggregateMovingAverageStatistics(movingAverageStatistics: MovingAverageStatisticsMap, tick: TickExtended, movingAverageCombinations: MovingAverageCombination[]): MovingAverageStatisticsMap {
  const statistics = movingAverageStatistics[tick.symbol] || movingAverageCombinations.map(mac => ({
    combination: mac,
    hits: 0,
    currentWin: 0,
    totalWin: 0,
    minWin: 0,
    avgWin: 0,
    maxWin: 0,
    upCount: 0,
    downCount: 0,
    sma: new SMA(mac.sma)
  }));
  const updatedStatistics = statistics.map(statistic => {
    const up = smaIsUp(tick, statistic);
    const win = getWin(tick);
    const pBuy = prevBuy(statistic);
    const pSell = prevSell(statistic);
    const s = sell(!up, statistic);
    const hits = aggregateHits(pBuy, s, statistic);
    const currentWin = aggregateCurrentWin(pBuy, pSell, s, win, statistic);
    const totalWin = aggregateTotalWin(pBuy, pSell, win, statistic);
    const minWin = aggregateMinWinPerCycle(pBuy, pSell, win, statistic);
    const avgWin = aggregateAvgWinPerCycle(pBuy, pSell, hits, totalWin, statistic);
    const maxWin = aggregateMaxWinPerCycle(pBuy, pSell, win, statistic);
    const upCount = getNextUpCount(pBuy, s, up, statistic);
    const downCount = getNextDownCount(pBuy, s, !up, statistic);
    const sma = statistic.sma;
    return {
      ...statistic,
      hits,
      currentWin,
      totalWin,
      minWin,
      avgWin,
      maxWin,
      upCount,
      downCount,
      sma
    };
  });
  return {
    ...movingAverageStatistics,
    [tick.symbol]: updatedStatistics
  };
}
