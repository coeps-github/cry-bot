import { Tick } from '../binance/model';
import { CandleStatistic } from './model';

export function isUp(tick: Tick): boolean {
  return +tick.close >= +tick.open;
}

export function getWin(tick: Tick): number {
  return +tick.close - +tick.open;
}

export function aggregateHits(tick: Tick, prevCandleStatistic: CandleStatistic): number {
  const up = isUp(tick);
  const b = buy(up, prevCandleStatistic);
  const s = sell(!up, prevCandleStatistic);
  if (b && s) {
    return prevCandleStatistic.hits + 1;
  }
  return prevCandleStatistic.hits;
}

export function aggregateTotalWin(tick: Tick, prevCandleStatistic: CandleStatistic): number {
  const pBuy = prevBuy(prevCandleStatistic);
  const pSell = prevSell(prevCandleStatistic);
  if (pBuy && !pSell) {
    return prevCandleStatistic.totalWin + getWin(tick);
  }
  return prevCandleStatistic.totalWin;
}

export function aggregateMinWinPerCandle(tick: Tick, prevCandleStatistic: CandleStatistic): number {
  const pBuy = prevBuy(prevCandleStatistic);
  const pSell = prevSell(prevCandleStatistic);
  if (pBuy && !pSell) {
    const win = getWin(tick);
    return prevCandleStatistic.minWin < win ? prevCandleStatistic.minWin : win;
  }
  return prevCandleStatistic.minWin;
}

export function aggregateAvgWinPerCandle(tick: Tick, prevCandleStatistic: CandleStatistic): number {
  const pBuy = prevBuy(prevCandleStatistic);
  const pSell = prevSell(prevCandleStatistic);
  if (pBuy && !pSell) {
    return (prevCandleStatistic.totalWin + getWin(tick)) / prevCandleStatistic.hits;
  }
  return prevCandleStatistic.avgWin;
}

export function aggregateMaxWinPerCandle(tick: Tick, prevCandleStatistic: CandleStatistic): number {
  const pBuy = prevBuy(prevCandleStatistic);
  const pSell = prevSell(prevCandleStatistic);
  if (pBuy && !pSell) {
    const win = getWin(tick);
    return prevCandleStatistic.maxWin > win ? prevCandleStatistic.maxWin : win;
  }
  return prevCandleStatistic.maxWin;
}

export function getNextUpCount(tick: Tick, prevCandleStatistic: CandleStatistic): number {
  const up = isUp(tick);
  const b = buy(up, prevCandleStatistic);
  const s = sell(!up, prevCandleStatistic);
  if (b && s) {
    return 0;
  }
  return count(isUp(tick), prevCandleStatistic.combination.up || 1, prevCandleStatistic.upCount);
}

export function getNextDownCount(tick: Tick, prevCandleStatistic: CandleStatistic): number {
  const up = isUp(tick);
  const b = buy(up, prevCandleStatistic);
  const s = sell(!up, prevCandleStatistic);
  if (b && s) {
    return 0;
  }
  return count(b && !isUp(tick), prevCandleStatistic.combination.down || 1, prevCandleStatistic.downCount);
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
