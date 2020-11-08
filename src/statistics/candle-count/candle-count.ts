import {
  aggregateAvgWinPerCycle,
  aggregateCurrentWin,
  aggregateHits,
  aggregateMaxWinPerCycle,
  aggregateMinWinPerCycle,
  aggregateTotalWin,
  buy,
  createGraphLine,
  getNextDownCount,
  getNextUpCount,
  getWin,
  isUp,
  prevBuy,
  prevSell,
  sell
} from '../helpers';
import { CountCombination, CountStatisticsMap } from '../model';
import { CandleStickWrapper } from '../../binance/model';
import { Console } from '../../console/model';

export function aggregateCandleCountStatistics(
  candleCountStatistics: CountStatisticsMap,
  candleStick: CandleStickWrapper,
  candleCountCombinations: CountCombination[],
  console?: Console
): CountStatisticsMap {
  const statistics = candleCountStatistics[candleStick.symbol] || candleCountCombinations.map(cc => ({
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
    const up = isUp(candleStick.tick);
    const win = getWin(candleStick.tick);
    const pBuy = prevBuy(statistic);
    const pSell = prevSell(statistic);
    const b = buy(up, statistic);
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
      downCount,
      buy: !pBuy && b,
      sell: pBuy && s
    };
  });
  if (console) {
    console.writeGraph(createGraphLine(candleStick.tick, updatedStatistics));
  }
  return {
    ...candleCountStatistics,
    [candleStick.symbol]: updatedStatistics
  };
}
