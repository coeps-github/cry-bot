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
import { CandleStickWrapper } from '../../binance/model';

export function aggregateMovingAverageCountStatistics(movingAverageCountStatistics: MovingAverageCountStatisticsMap, candleStick: CandleStickWrapper, movingAverageCountCombinations: MovingAverageCountCombination[]): MovingAverageCountStatisticsMap {
  const statistics = movingAverageCountStatistics[candleStick.symbol] || movingAverageCountCombinations.map(mac => ({
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
    const up = updateSmaAndReturnIsUp(candleStick.tick, statistic);
    const win = getWin(candleStick.tick);
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
    [candleStick.symbol]: updatedStatistics
  };
}