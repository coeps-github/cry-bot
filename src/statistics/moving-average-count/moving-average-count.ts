import { TickExtended } from '../../binance/model';
import { MovingAverageCountCombination, MovingAverageCountStatisticsMap } from './model';
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
import { updateSmaAndReturnIsUp } from './helpers';

export function aggregateMovingAverageCountStatistics(movingAverageCountStatistics: MovingAverageCountStatisticsMap, tick: TickExtended, movingAverageCountCombinations: MovingAverageCountCombination[]): MovingAverageCountStatisticsMap {
  const statistics = movingAverageCountStatistics[tick.symbol] || movingAverageCountCombinations.map(mac => ({
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
    const up = updateSmaAndReturnIsUp(tick, statistic);
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
    ...movingAverageCountStatistics,
    [tick.symbol]: updatedStatistics
  };
}
