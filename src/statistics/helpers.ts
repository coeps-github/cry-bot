import { Tick } from '../binance/model';
import { CandleStatistic } from './model';

export function isUp(tick: Tick): boolean {
  return +tick.close >= +tick.open;
}

export function getWin(tick: Tick): number {
  return +tick.close - +tick.open;
}

export function aggregateHits(buy: boolean, sell: boolean, prevCandleStatistic: CandleStatistic): number {
  if (buy && sell) {
    return prevCandleStatistic.hits + 1;
  }
  return prevCandleStatistic.hits;
}

export function aggregateTotalWin(prevBuy: boolean, prevSell: boolean, win: number, prevCandleStatistic: CandleStatistic): number {
  if (prevBuy && !prevSell) {
    return prevCandleStatistic.totalWin + win;
  }
  return prevCandleStatistic.totalWin;
}

export function aggregateMinWinPerCandle(prevBuy: boolean, prevSell: boolean, win: number, prevCandleStatistic: CandleStatistic): number {
  if (prevBuy && !prevSell) {
    return prevCandleStatistic.minWin < win ? prevCandleStatistic.minWin : win;
  }
  return prevCandleStatistic.minWin;
}

export function aggregateAvgWinPerCandle(prevBuy: boolean, prevSell: boolean, hits: number, totalWin: number, prevCandleStatistic: CandleStatistic): number {
  if (prevBuy && !prevSell) {
    if (hits > 0) {
      return totalWin / hits;
    }
    return 0;
  }
  return prevCandleStatistic.avgWin;
}

export function aggregateMaxWinPerCandle(prevBuy: boolean, prevSell: boolean, win: number, prevCandleStatistic: CandleStatistic): number {
  if (prevBuy && !prevSell) {
    return prevCandleStatistic.maxWin > win ? prevCandleStatistic.maxWin : win;
  }
  return prevCandleStatistic.maxWin;
}

export function getNextUpCount(buy: boolean, sell: boolean, up: boolean, prevCandleStatistic: CandleStatistic): number {
  if (buy && sell) {
    return 0;
  }
  return count(up, prevCandleStatistic.combination.up || 1, prevCandleStatistic.upCount);
}

export function getNextDownCount(buy: boolean, sell: boolean, down: boolean, prevCandleStatistic: CandleStatistic): number {
  if (buy && sell) {
    return 0;
  }
  return count(buy && down, prevCandleStatistic.combination.down || 1, prevCandleStatistic.downCount);
}

export function prevBuy(prevCandleStatistic: CandleStatistic): boolean {
  return targetOrAbove(false, prevCandleStatistic.combination.up || 1, prevCandleStatistic.upCount);
}

export function buy(up: boolean, prevCandleStatistic: CandleStatistic): boolean {
  return targetOrAbove(up, prevCandleStatistic.combination.up || 1, prevCandleStatistic.upCount);
}

export function prevSell(prevCandleStatistic: CandleStatistic): boolean {
  return targetOrAbove(false, prevCandleStatistic.combination.down || 1, prevCandleStatistic.downCount);
}

export function sell(down: boolean, prevCandleStatistic: CandleStatistic): boolean {
  return targetOrAbove(down, prevCandleStatistic.combination.down || 1, prevCandleStatistic.downCount);
}

export function targetOrAbove(increaseCount: boolean, target: number, prevCount: number): boolean {
  return count(increaseCount, target, prevCount) >= target;
}

export function count(increaseCount: boolean, target: number, prevCount: number): number {
  return increaseCount ? prevCount + 1 : prevCount >= target ? prevCount : 0;
}
