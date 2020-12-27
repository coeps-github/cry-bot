import { GraphConfig } from '../graph/model';

export interface ConsoleConfig {
  readonly graph?: GraphConfig;
}

export interface Console {
  readonly write: (line: string, refillInput?: boolean) => void;
  readonly writeError: (line: string, refillInput?: boolean) => void;
  readonly clear: () => void;
}

export interface ConsoleScreen {
  readonly show: (command: string) => boolean;
  readonly write: () => void;
  readonly help: () => void;
}
