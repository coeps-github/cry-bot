import { Tick } from '../binance/model';
import { CountStatistic, Statistic } from './model';

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

export function getNextUpCount(prevBuy: boolean, sell: boolean, up: boolean, prevCountStatistic: CountStatistic): number {
  if (prevBuy && sell) {
    return 0;
  }
  return count(up, prevCountStatistic.combination.up || 1, prevCountStatistic.upCount);
}

export function getNextDownCount(prevBuy: boolean, sell: boolean, down: boolean, prevCountStatistic: CountStatistic): number {
  if (prevBuy && sell) {
    return 0;
  }
  return count(prevBuy && down, prevCountStatistic.combination.down || 1, prevCountStatistic.downCount);
}

export function prevBuy(prevCountStatistic: CountStatistic): boolean {
  return targetOrAbove(false, prevCountStatistic.combination.up || 1, prevCountStatistic.upCount);
}

export function buy(up: boolean, prevCountStatistic: CountStatistic): boolean {
  return targetOrAbove(up, prevCountStatistic.combination.up || 1, prevCountStatistic.upCount);
}

export function prevSell(prevCountStatistic: CountStatistic): boolean {
  return targetOrAbove(false, prevCountStatistic.combination.down || 1, prevCountStatistic.downCount);
}

export function sell(down: boolean, prevCountStatistic: CountStatistic): boolean {
  return targetOrAbove(down, prevCountStatistic.combination.down || 1, prevCountStatistic.downCount);
}

export function targetOrAbove(increaseCount: boolean, target: number, prevCount: number): boolean {
  return count(increaseCount, target, prevCount) >= target;
}

export function count(increaseCount: boolean, target: number, prevCount: number): number {
  return increaseCount ? prevCount + 1 : prevCount >= target ? prevCount : 0;
}

export function sortStatistic(a: Statistic, b: Statistic): 0 | 1 | -1 {
  const winA = a.totalWin - a.currentWin;
  const winB = b.totalWin - b.currentWin;
  if (winA === winB) {
    if (a.avgWin === b.avgWin) {
      if (a.hits === b.hits) {
        return a.maxWin === b.maxWin ? 0 : a.maxWin < b.maxWin ? -1 : 1;
      }
      return a.hits < b.hits ? -1 : 1;
    }
    return a.avgWin < b.avgWin ? -1 : 1;
  }
  return winA < winB ? -1 : 1;
}
