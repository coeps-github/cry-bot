import { GraphConfig, GraphLine, GraphScreen } from './model';
import { Console } from '../console/model';
import { extractCommandValues } from '../console/helpers';
import { createGraphLineCentered, createGraphLineLeft, fillString } from './helpers';

export function getGraphScreen(console: Console, config?: GraphConfig): GraphScreen {
  let min = 0;
  let width = config?.width || 200;
  let padding = config?.padding || 10;
  let valueFactor = config?.valueFactor || 1;
  let cachedRows = config?.cachedRows || 50;

  let cache: GraphLine[] = [];

  const writeGraph = (line: GraphLine) => {
    const open = line.open;
    const close = line.close;
    const openFactor = line.open * valueFactor;
    const closeFactor = line.close * valueFactor;
    const openRound = Math.round(openFactor);
    const closeRound = Math.round(closeFactor);
    const txt = line.text;
    const win = close - open >= 0;
    const minIsEmpty = min === 0;
    const closeLength = ('' + close).length + 1;
    const closeWithLabel = win ? closeRound + closeLength : closeRound - closeLength;
    const closeExceedingPadding = closeLength > padding ? closeWithLabel : closeRound;
    const valueIsOutsidePadding = (win ? openRound : closeExceedingPadding) < (min + padding) ||
      (win ? closeExceedingPadding : openRound) > (min + width - padding);
    if (minIsEmpty || valueIsOutsidePadding) {
      const prevMin = min;
      min = closeRound - (width / 2);
      console.write(createGraphLineCentered(width, `Shift left ${prevMin / valueFactor} to ${min / valueFactor}`, ':', ':'));
    }
    const amount = win ? closeRound - openRound : openRound - closeRound;
    if (win) {
      const content = amount === 0 ? `| ${close}` : amount === 1 ? `|> ${close}` : `|${fillString(amount - 1, '=')}> ${close}`;
      console.write(createGraphLineLeft(openRound, min, width, `\x1b[32m${content}\x1b[0m ${txt}`));
    } else {
      const content = amount === 0 ? `${close} |` : amount === 1 ? `${close} <|` : `${close} <${fillString(amount - 1, '=')}|`;
      console.write(createGraphLineLeft(closeWithLabel, min, width, `\x1b[31m${content}\x1b[0m ${txt}`));
    }
  };

  return {
    name: 'Graph',
    isRunning: () => false,
    canShow: (command: string) => {
      const widthValues = extractCommandValues(['gw', 'setGraphWidth'], command);
      const paddingValues = extractCommandValues(['gp', 'setGraphPadding'], command);
      const valueFactorValues = extractCommandValues(['gvf', 'setGraphValueFactor'], command);
      const cachedRowsValues = extractCommandValues(['gcr', 'setGraphCachedRows'], command);
      if (widthValues.length) {
        width = +widthValues[0];
        min = 0;
      } else if (paddingValues.length) {
        padding = +paddingValues[0];
        min = 0;
      } else if (valueFactorValues.length) {
        valueFactor = +valueFactorValues[0];
        min = 0;
      } else if (cachedRowsValues.length) {
        cachedRows = +cachedRowsValues[0];
      }
      return true;
    },
    show: () => {
      console.clear();
      console.write('Showing Graph ...');
      cache.forEach(line => writeGraph(line));
    },
    hide: () => {
      // empty
    },
    writeGraph: (line: GraphLine) => {
      writeGraph(line);
      cache = [...cache, line];
      if (cache.length > cachedRows) {
        cache = [...cache.slice(1)];
      }
    },
    help: () => {
      console.write('gw   / setGraphWidth:           Set Graph Width             (default: 200)');
      console.write('gp   / setGraphPadding:         Set Graph Padding           (default: 10)');
      console.write('gvf  / setGraphValueFactor:     Set Graph Value Factor      (default: 1)');
      console.write('gcr  / setGraphCachedRows:      Set Graph Cached Rows       (default: 50)');
    }
  };
}
