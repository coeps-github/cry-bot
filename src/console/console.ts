import { Console } from './model';
import * as readline from 'readline';

export function getConsole(): Console {
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

  let currentInput = '';

  input.on('data', (data: string) => {
    currentInput += data;
  });

  input.on('keypress', (_char: string, key: { sequence: string, name: string, ctrl: boolean, meta: boolean, shift: boolean }) => {
    if (key.sequence === '\b' || key.name === 'backspace') {
      currentInput = currentInput.substr(0, currentInput.length - 2);
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
      listCommands();
    }
  };

  const showGraph = () => {
    clearScreen();
    write('Showing Graph ...', false);
    // TODO: show graph
  };

  const quitApplication = () => {
    clearScreen();
    write('Quit Application ...', false);
    process.exit(0);
  };

  const listCommands = (refillInput = true) => {
    clearScreen();
    write('Commands:', false);
    write('g / showGraph:    Show Graph', false);
    write('q / quit:         Quit Application', false);
    write('h / help: Show available commands (this info)', refillInput);
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

  write();

  return {
    execute,
    write
  };
}
