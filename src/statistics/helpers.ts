import { Tick } from '../binance/model';
import { Statistic } from './model';

export function isUp(tick: Tick): boolean {
  return +tick.close >= +tick.open;
}

export function getWin(tick: Tick): number {
  return +tick.close - +tick.open;
}

export function aggregateHits(prevBuy: boolean, sell: boolean, prevStatistic: Statistic): number {
  if (prevBuy && sell) {
    return prevStatistic.hits + 1;
  }
  return prevStatistic.hits;
}

export function aggregateCurrentWin(prevBuy: boolean, prevSell: boolean, sell: boolean, win: number, prevStatistic: Statistic): number {
  if (prevBuy && sell) {
    return 0;
  }
  if (prevBuy && !prevSell) {
    return prevStatistic.currentWin + win;
  }
  return prevStatistic.currentWin;
}

export function aggregateTotalWin(prevBuy: boolean, prevSell: boolean, win: number, prevStatistic: Statistic): number {
  if (prevBuy && !prevSell) {
    return prevStatistic.totalWin + win;
  }
  return prevStatistic.totalWin;
}

export function aggregateMinWinPerCycle(prevBuy: boolean, prevSell: boolean, win: number, prevStatistic: Statistic): number {
  if (prevBuy && !prevSell) {
    return prevStatistic.minWin < win ? prevStatistic.minWin : win;
  }
  return prevStatistic.minWin;
}

export function aggregateAvgWinPerCycle(prevBuy: boolean, prevSell: boolean, hits: number, totalWin: number, prevStatistic: Statistic): number {
  if (prevBuy && !prevSell) {
    if (hits > 0) {
      return totalWin / hits;
    }
    return 0;
  }
  return prevStatistic.avgWin;
}

export function aggregateMaxWinPerCycle(prevBuy: boolean, prevSell: boolean, win: number, prevStatistic: Statistic): number {
  if (prevBuy && !prevSell) {
    return prevStatistic.maxWin > win ? prevStatistic.maxWin : win;
  }
  return prevStatistic.maxWin;
}
