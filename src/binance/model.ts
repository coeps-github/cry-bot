import { Observable } from 'rxjs';

export interface BinanceConfig {
  readonly apiKey: string;
  readonly apiSecret: string;
}

export interface Binance {
  readonly getChart: (symbol?: string, period?: Period) => Observable<ChartExtended>;
  readonly getCandleSticks: (symbols?: string[], period?: Period, finalOnly?: boolean) => Observable<CandleSticks>;
}

export type Period =
  '1m'
  | '3m'
  | '5m'
  | '15m'
  | '30m'
  | '1h'
  | '2h'
  | '4h'
  | '6h'
  | '8h'
  | '12h'
  | '1d'
  | '3d'
  | '1w'
  | '1M';

export interface CandleSticksShort {
  readonly e: string;
  readonly E: number;
  readonly s: string;
  readonly k: TicksShort;
}

export interface TickShort {
  readonly o: string;
  readonly h: string;
  readonly l: string;
  readonly c: string;
  readonly v: string;
}

export interface TicksShort extends TickShort {
  readonly n: number;
  readonly i: string;
  readonly x: boolean;
  readonly q: string;
  readonly V: string;
  readonly Q: string;
}

export interface CandleSticks {
  readonly eventType: string;
  readonly eventTime: number;
  readonly symbol: string;
  readonly ticks: Ticks;
}

export interface Tick {
  readonly open: string;
  readonly high: string;
  readonly low: string;
  readonly close: string;
  readonly volume: string;
}

export interface Ticks extends Tick {
  readonly trades: number;
  readonly interval: string;
  readonly isFinal: boolean;
  readonly quoteVolume: string;
  readonly buyVolume: string;
  readonly quoteBuyVolume: string;
}

export interface Chart {
  readonly [key: string]: Tick;
}

export interface ChartWrapper {
  readonly symbol: string;
  readonly interval: string;
  readonly chart: Chart;
}

export interface ChartExtended extends ChartWrapper {
  readonly lastTickTime: string;
  readonly lastTick: Tick;
}
