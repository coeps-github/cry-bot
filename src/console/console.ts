import { Console, ConsoleScreen } from './model';
import * as readline from 'readline';

export function getConsole(): Console {
  const promptMarker = '\x1b[1m\x1b[34m>\x1b[0m ';

  const output = process.stdout;
  const error = process.stderr;
  const input = process.stdin;

  input.setRawMode(true);
  input.setEncoding('utf8');
  const rl = readline.createInterface({
    input,
    output
  });
  readline.emitKeypressEvents(input, rl);

  const screens: ConsoleScreen[] = [];
  let screen: ConsoleScreen;

  let currentInput = '';

  input.on('data', (data: string) => {
    currentInput += data;
  });

  input.on('keypress', (_char: string, key: { sequence: string, name: string, ctrl: boolean, meta: boolean, shift: boolean }) => {
    if (key.sequence === '\b' || key.name === 'backspace') {
      currentInput = currentInput.substr(0, currentInput.length - 2);
    }
    if (key.ctrl && key.name === 'c') {
      execute('quit');
    }
  });

  rl.on('line', (line: string) => {
    currentInput = line;
    execute(line);
  });

  const write = (line = '', refillInput = true, isError = false) => {
    const current = rl.line || currentInput;
    readline.clearLine(output, 0);
    readline.cursorTo(output, 0);
    if (line) {
      if (isError) {
        error.write(`\x1b[31m${line}\x1b[0m\n`);
      } else {
        output.write(`${line}\n`);
      }
    }
    output.write(promptMarker);
    if (refillInput) {
      rl.write(current);
    }
  };

  const writeError = (line = '', refillInput = true) => {
    write(line, refillInput, true);
  };

  const clear = () => {
    output.write('\u001B[2J\u001B[0;0f');
  };

  const addScreens = (...consoleScreens: ConsoleScreen[]) => {
    screens.push(...consoleScreens);
  };

  const console = {
    write,
    writeError,
    clear,
    addScreens
  };

  const execute = (command: string) => {
    screen = screens.filter(screen => screen.show(command))[0];
    if (screen) {
      screen.write();
    } else {
      execute('help');
    }
  };

  return console;
}
