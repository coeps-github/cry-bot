import { Observable } from 'rxjs';

export interface BinanceConfig {
  readonly apiKey: string;
  readonly apiSecret: string;
}

export interface Binance {
  readonly getChart: (symbol?: string, period?: Period) => Observable<ChartExtended>;
  readonly getCandleStickHistory: (symbol?: string, period?: Period, options?: CandleStickHistoryOptions) => Observable<CandleStickWrapper>
  readonly getCandleStickHistoryRecursive: (symbol: string, period?: Period, lastCandleStick?: CandleStickWrapper, options?: CandleStickHistoryRecursiveOptions) => Observable<CandleStickWrapper>
  readonly getCandleStickHistoryLocal: (symbol?: string, period?: Period, options?: CandleStickHistoryLimitOptions) => Observable<CandleStickWrapper>;
  readonly getCandleSticks: (symbol?: string, period?: Period, options?: CandleSticksOptions) => Observable<CandleStickWrapper>;
  readonly getCandleSticksWithHistory: (symbol?: string, period?: Period, options?: CandleSticksWithHistoryOptions) => Observable<CandleStickWrapper>;
  readonly getCandleSticksWithHistoryLocal: (symbol?: string, period?: Period, options?: CandleSticksWithHistoryOptions) => Observable<CandleStickWrapper>;
  readonly checkCandleStickHistoryLocal: (symbol?: string, period?: Period) => Observable<boolean>;
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

export interface ChartExtended extends ChartWrapper {
  readonly lastTickTime: string;
  readonly lastTick: Tick;
}

export interface ChartWrapper {
  readonly symbol: string;
  readonly interval: string;
  readonly chart: Chart;
}

export interface Chart {
  readonly [key: string]: Tick;
}

export interface CandleStickHistoryOptions extends CandleStickHistoryRecursiveOptions {
  readonly endTime?: number;
}

export interface CandleStickHistoryRecursiveOptions extends CandleStickHistoryLimitOptions {
  readonly startTime?: number;
}

export interface CandleStickHistoryLimitOptions {
  readonly limit?: number;
}

export interface CandleSticksOptions {
  readonly finalOnly?: boolean;
}

export type CandleSticksWithHistoryOptions = CandleSticksOptions & CandleStickHistoryLimitOptions;

export interface CandleStickWrapper {
  readonly symbol: string;
  readonly interval: string;
  readonly tick: TickEvent;
}

export interface TickEvent extends TickMarket {
  readonly eventType?: string;
  readonly eventTime: number;
  readonly closeTime?: number;
  readonly isFinal: boolean;
}

export interface TickMarket extends Tick {
  readonly trades: number;
  readonly quoteVolume: string;
  readonly buyVolume: string;
  readonly quoteBuyVolume: string;
}

export interface Tick {
  readonly open: string;
  readonly high: string;
  readonly low: string;
  readonly close: string;
  readonly volume: string;
}

export type CandleStickHistoryAPI = (number & string & boolean)[];

export interface CandleStickWrapperAPI {
  readonly e: string;
  readonly E: number;
  readonly s: string;
  readonly k: TickMarketAPI;
}

export interface TickMarketAPI extends TickAPI {
  readonly n: number;
  readonly i: string;
  readonly x: boolean;
  readonly q: string;
  readonly V: string;
  readonly Q: string;
}

export interface TickAPI {
  readonly o: string;
  readonly h: string;
  readonly l: string;
  readonly c: string;
  readonly v: string;
}

export interface CandleStickValidationResult {
  readonly valid: boolean;
  readonly last: CandleStickWrapper | null;
}
