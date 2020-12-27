import { ConsoleScreen } from '../console/model';

export interface GraphConfig {
  readonly width?: number;
  readonly padding?: number;
  readonly valueFactor?: number;
  readonly cachedRows?: number;
}

export interface GraphScreen extends ConsoleScreen {
  readonly writeGraph: (line: GraphLine) => void;
}

export interface GraphLine {
  readonly open: number;
  readonly close: number;
  readonly text: string;
}
