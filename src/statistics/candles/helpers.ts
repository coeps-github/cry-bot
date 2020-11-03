import { CandleStatistic } from './model';

export function getNextUpCount(prevBuy: boolean, sell: boolean, up: boolean, prevCandleStatistic: CandleStatistic): number {
  if (prevBuy && sell) {
    return 0;
  }
  return count(up, prevCandleStatistic.combination.up || 1, prevCandleStatistic.upCount);
}

export function getNextDownCount(prevBuy: boolean, sell: boolean, down: boolean, prevCandleStatistic: CandleStatistic): number {
  if (prevBuy && sell) {
    return 0;
  }
  return count(prevBuy && down, prevCandleStatistic.combination.down || 1, prevCandleStatistic.downCount);
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
