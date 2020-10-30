import { TickExtended } from '../../binance/model';
import {
  aggregateAvgWinPerCandle,
  aggregateCurrentWin,
  aggregateHits,
  aggregateMaxWinPerCandle,
  aggregateMinWinPerCandle,
  aggregateTotalWin,
  buy,
  getNextDownCount,
  getNextUpCount,
  getWin,
  isUp,
  prevBuy,
  prevSell,
  sell
} from './helpers';
import { CandleCombination, CandleStatistics } from './model';

export function aggregateCandleStatistics(candleStatistics: CandleStatistics, tick: TickExtended, candleCombinations: CandleCombination[]): CandleStatistics {
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
    const b = buy(up, statistic);
    const s = sell(!up, statistic);
    const hits = aggregateHits(b, s, statistic);
    const currentWin = aggregateCurrentWin(pBuy, pSell, b, s, win, statistic);
    const totalWin = aggregateTotalWin(pBuy, pSell, win, statistic);
    const minWin = aggregateMinWinPerCandle(pBuy, pSell, win, statistic);
    const avgWin = aggregateAvgWinPerCandle(pBuy, pSell, hits, totalWin, statistic);
    const maxWin = aggregateMaxWinPerCandle(pBuy, pSell, win, statistic);
    const upCount = getNextUpCount(b, s, up, statistic);
    const downCount = getNextDownCount(b, s, !up, statistic);
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
