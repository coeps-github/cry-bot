import { Tick } from '../binance/model';

export function up(tick: Tick): boolean {
  return +tick.close >= +tick.open;
}

export function win(tick: Tick): number {
  return +tick.close - +tick.open;
}
