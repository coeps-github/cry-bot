import { Observable } from 'rxjs';

export interface BinanceConfig {
  readonly apiKey: string;
  readonly apiSecret: string;
}

export interface Binance {
  readonly getChart: (symbol?: string, period?: Period) => Observable<ChartExtended>;
  readonly getCandleStickHistory: (symbol?: string, period?: Period, options?: CandleStickHistoryOptions) => Observable<CandleStickWrapper>
  readonly getCandleSticks: (symbols?: string[], period?: Period, options?: CandleStickOptions) => Observable<CandleStickWrapper>;
  readonly getCandleSticksWithHistory: (symbols?: string[], period?: Period, options?: CandleStickHistoryOptions) => Observable<CandleStickWrapper>;
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

export interface CandleStickHistoryOptions extends CandleStickOptions {
  readonly limit?: number;
  readonly startTime?: number;
  readonly endTime?: number;
}

export interface CandleStickOptions {
  readonly finalOnly?: boolean;
}

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

export interface CandleStickHistoryAPI extends Tick {
  readonly time: number;
  readonly closeTime: number;
  readonly trades: number;
  readonly assetVolume: string;
  readonly buyBaseVolume: string;
  readonly buyAssetVolume: string;
  readonly ignored: boolean;
}

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
