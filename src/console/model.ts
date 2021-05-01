import { GraphConfig } from '../graph/model';

export interface ConsoleConfig {
  readonly graph?: GraphConfig;
}

export interface Console {
  readonly write: (line: string) => void;
  readonly writeError: (line: string) => void;
  readonly clear: () => void;
  readonly execute: (command: string) => void;
  readonly addScreens: (...consoleScreens: ConsoleScreen[]) => void;
}

export interface ConsoleScreen {
  readonly name: string;
  readonly isRunning: () => boolean;
  readonly canShow: (command: string) => boolean;
  readonly show: () => void;
  readonly hide: () => void;
  readonly help: () => void;
}
