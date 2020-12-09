import { GraphConfig } from '../graph/model';

export interface ConsoleConfig {
  readonly graph?: GraphConfig;
}

export interface Console {
  readonly write: (line: string, refillInput?: boolean) => void;
  readonly writeError: (line: string, refillInput?: boolean) => void;
  readonly clear: () => void;
}

export type ConsoleScreens =
  'statistics/candle-count' |
  'statistics/moving-average-count' |
  'graph' |
  'quit' |
  'help';

export interface ConsoleScreen {
  readonly id: ConsoleScreens;
  readonly show: (command: string) => boolean;
  readonly write: (console: Console) => void;
  readonly help: (console: Console) => void;
}
