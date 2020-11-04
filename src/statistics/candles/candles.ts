import { TickExtended } from '../../binance/model';
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
  isUp,
  prevBuy,
  prevSell,
  sell
} from '../helpers';
import { CountCombination, CountStatisticsMap } from '../model';

export function aggregateCandleStatistics(candleStatistics: CountStatisticsMap, tick: TickExtended, candleCombinations: CountCombination[]): CountStatisticsMap {
  const statistics = candleStatistics[tick.symbol] || candleCombinations.map(cc => ({
    combination: cc,
    hits: 0,
    currentWin: 0,
    totalWin: 0,
    minWin: 0,
    avgWin: 0,
    maxWin: 0,
    upCount: 0,
    downCount: 0
  }));
  const updatedStatistics = statistics.map(statistic => {
    const up = isUp(tick);
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
    return {
      ...statistic,
      hits,
      currentWin,
      totalWin,
      minWin,
      avgWin,
      maxWin,
      upCount,
      downCount
    };
  });
  return {
    ...candleStatistics,
    [tick.symbol]: updatedStatistics
  };
}
