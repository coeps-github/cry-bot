import { Console, ConsoleScreen } from '../console/model';

export function getQuitScreen(console: Console): ConsoleScreen {
  return {
    show: (command: string) => {
      return command === 'q' || command === 'quit';
    },
    write: () => {
      console.clear();
      console.write('Quit Application ...', false);
      process.exit(0);
    },
    help: () => {
      console.write('q    / quit:                    Quit Application', false);
    }
  };
}
