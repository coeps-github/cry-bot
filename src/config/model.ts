import { ParsedArgs } from 'minimist';
import { BinanceConfig } from '../binance/model';
import { ConsoleConfig } from '../console/model';
import { FileConfig } from '../file/model';

export interface Args extends ParsedArgs {
  readonly c: string;
  readonly config: string;
}

export interface Config {
  readonly binance: BinanceConfig;
  readonly file?: FileConfig;
  readonly console?: ConsoleConfig;
}
