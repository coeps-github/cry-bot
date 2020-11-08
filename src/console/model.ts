export interface ConsoleConfig {
  readonly graph: GraphConfig;
}

export interface GraphConfig {
  readonly width?: number;
  readonly padding?: number;
  readonly valueFactor?: number;
}

export interface Console {
  readonly execute: (command: string) => void;
  readonly write: (line: string, refillInput?: boolean) => void;
  readonly writeGraph: (line: GraphLine) => void;
}

export interface GraphLine {
  readonly open: number;
  readonly close: number;
  readonly text: string;
}
