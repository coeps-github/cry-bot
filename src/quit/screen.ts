import { Console, ConsoleScreen } from '../console/model';

export function getQuitScreen(console: Console): ConsoleScreen {
  return {
    name: 'Quit',
    isRunning: () => false,
    canShow: (command: string) => {
      return command === 'q' || command === 'quit';
    },
    show: () => {
      console.clear();
      console.write('Quit Application ...');
      process.exit(0);
    },
    hide: () => {
      // empty
    },
    help: () => {
      console.write('q    / quit:                    Quit Application');
    }
  };
}
