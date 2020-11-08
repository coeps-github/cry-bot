import { Console, ConsoleConfig, GraphLine } from './model';
import * as readline from 'readline';

export function getConsole(config?: ConsoleConfig): Console {
  const promptMarker = '> ';

  const output = process.stdout;
  //const error = process.stderr;
  const input = process.stdin;

  input.setRawMode(true);
  input.setEncoding('utf8');
  const rl = readline.createInterface({
    input,
    output
  });
  readline.emitKeypressEvents(input, rl);

  let graphMin = 0;
  let graphWidth = config?.graph?.width || 200;
  let graphPadding = config?.graph?.padding || 10;
  let graphValueFactor = config?.graph?.valueFactor || 1;

  let screen: 'graph' | 'quit' | 'help' | '' = '';

  let currentInput = '';

  input.on('data', (data: string) => {
    currentInput += data;
  });

  input.on('keypress', (_char: string, key: { sequence: string, name: string, ctrl: boolean, meta: boolean, shift: boolean }) => {
    if (key.sequence === '\b' || key.name === 'backspace') {
      currentInput = currentInput.substr(0, currentInput.length - 2);
    }
    if (key.ctrl && key.name === 'c') {
      quitApplication();
    }
  });

  rl.on('line', (line: string) => {
    currentInput = line;
    execute(line);
  });

  const execute = (command: string) => {
    if (command === 'g' || command === 'showGraph') {
      showGraph();
    } else if (command === 'q' || command === 'quit') {
      quitApplication();
    } else if (command === 'h' || command === 'help') {
      listCommands(false);
    } else {
      const graphWidthValues = extractCommandValues(['gw', 'setGraphWidth'], command);
      const graphPaddingValues = extractCommandValues(['gp', 'setGraphPadding'], command);
      const graphValueFactorValues = extractCommandValues(['gvf', 'setGraphValueFactor'], command);
      if (graphWidthValues) {
        graphWidth = +graphWidthValues[0];
        graphMin = 0;
        write('', false);
      } else if (graphPaddingValues) {
        graphPadding = +graphPaddingValues[0];
        graphMin = 0;
        write('', false);
      } else if (graphValueFactorValues) {
        graphValueFactor = +graphValueFactorValues[0];
        graphMin = 0;
        write('', false);
      } else {
        listCommands();
      }
    }
  };

  const extractCommandValues = (commands: string[], command: string) => {
    const commandSplit = command.split(' ');
    const commandValues = commandSplit.slice(1);
    return commands.includes(commandSplit[0]) ? commandValues : null;
  };

  const showGraph = () => {
    screen = '';
    clearScreen();
    write('Showing Graph ...', false);
    screen = 'graph';
  };

  const quitApplication = () => {
    screen = '';
    clearScreen();
    write('Quit Application ...', false);
    screen = 'quit';
    process.exit(0);
  };

  const listCommands = (refillInput = true) => {
    screen = '';
    clearScreen();
    write('Commands:', false);
    write('g   / showGraph:           Show Graph', false);
    write('gw  / setGraphWidth:       Set Graph Width (default: 50)', false);
    write('gp  / setGraphPadding:     Set Graph Padding (default: 5)', false);
    write('gvf / setGraphValueFactor: Set Graph Value Factor (default: 1)', false);
    write('q   / quit:                Quit Application', false);
    write('h   / help:                Show available commands (this info)', refillInput);
    screen = 'help';
  };

  const writeGraph = (line: GraphLine) => {
    if (screen === 'graph') {
      const open = line.open;
      const close = line.close;
      const openFactor = line.open * graphValueFactor;
      const closeFactor = line.close * graphValueFactor;
      const openRound = Math.round(openFactor);
      const closeRound = Math.round(closeFactor);
      const txt = line.text;
      const win = close - open >= 0;
      const graphMinIsEmpty = graphMin === 0;
      const closeLength = ('' + close).length + 1;
      const closeWithLabel = win ? closeRound + closeLength : closeRound - closeLength;
      const closeExceedingPadding = closeLength > graphPadding ? closeWithLabel : closeRound;
      const valueIsOutsidePadding = (win ? openRound : closeExceedingPadding) < (graphMin + graphPadding) ||
        (win ? closeExceedingPadding : openRound) > (graphMin + graphWidth - graphPadding);
      if (graphMinIsEmpty || valueIsOutsidePadding) {
        const prevGraphMin = graphMin;
        graphMin = closeRound - (graphWidth / 2);
        write(createGraphLineCentered(`Shift left ${prevGraphMin / graphValueFactor} to ${graphMin / graphValueFactor}`, ':', ':'));
      }
      const amount = win ? closeRound - openRound : openRound - closeRound;
      if (win) {
        const content = amount === 0 ? `| ${close}` : amount === 1 ? `|> ${close}` : `|${fillString(amount - 1, '=')}> ${close}`;
        write(createGraphLineLeft(openRound, `\x1b[32m${content}\x1b[0m ${txt}`));
      } else {
        const content = amount === 0 ? `${close} |` : amount === 1 ? `${close} <|` : `${close} <${fillString(amount - 1, '=')}|`;
        write(createGraphLineLeft(closeWithLabel, `\x1b[31m${content}\x1b[0m ${txt}`));
      }
    }
  };

  const createGraphLineCentered = (content: string, leftFill = ' ', rightFill = ' ') => {
    const left = (graphWidth / 2) - (content.length / 2);
    return createGraphLine(left, content, leftFill, rightFill);
  };

  const createGraphLineLeft = (value: number, content: string, leftFill = ' ', rightFill = ' ') => {
    const left = value - graphMin;
    return createGraphLine(left, content, leftFill, rightFill);
  };

  const createGraphLine = (left: number, content: string, leftFill = ' ', rightFill = ' ') => {
    const leftMin = left < 0 ? 0 : left;
    const right = graphWidth - leftMin - content.length;
    const rightMin = right < 0 ? 0 : right;
    return fillString(leftMin, leftFill) + content + fillString(rightMin, rightFill);
  };

  const fillString = (amount: number, fill = ' ') => {
    const amountMin = amount < 0 ? 0 : amount;
    const amountRound = Math.round(amountMin);
    return fill.repeat(amountRound);
  };

  const write = (line = '', refillInput = true) => {
    const current = rl.line || currentInput;
    readline.clearLine(output, 0);
    readline.cursorTo(output, 0);
    if (line) {
      output.write(line + '\n');
    }
    output.write(promptMarker);
    if (refillInput) {
      rl.write(current);
    }
  };

  const clearScreen = () => {
    output.write('\u001B[2J\u001B[0;0f');
  };

  execute('help');

  return {
    execute,
    write,
    writeGraph
  };
}
