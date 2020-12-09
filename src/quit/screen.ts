import { Console, ConsoleScreen } from '../console/model';

export function getQuitScreen(): ConsoleScreen {
  return {
    id: 'quit',
    show: (command: string) => {
      return command === 'q' || command === 'quit';
    },
    write: (console: Console) => {
      console.clear();
      console.write('Quit Application ...', false);
      process.exit(0);
    },
    help: (console: Console) => {
      console.write('q   / quit:                Quit Application', false);
    }
  }
}
