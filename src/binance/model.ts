import { Observable } from 'rxjs';

export interface BinanceConfig {
  readonly apiKey: string;
  readonly apiSecret: string;
}

export interface Binance {
  readonly getCandleSticks: (
    symbols?: string[],
    period?: Period,
    finalOnly?: boolean
  ) => Observable<CandleSticks>;
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

export interface TicksShort {
  readonly o: string;
  readonly h: string;
  readonly l: string;
  readonly c: string;
  readonly v: string;
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

export interface Ticks {
  readonly open: string;
  readonly high: string;
  readonly low: string;
  readonly close: string;
  readonly volume: string;
  readonly trades: number;
  readonly interval: string;
  readonly isFinal: boolean;
  readonly quoteVolume: string;
  readonly buyVolume: string;
  readonly quoteBuyVolume: string;
}


