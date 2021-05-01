import { Console, ConsoleScreen } from '../console/model';

export function getQuitScreen(console: Console): ConsoleScreen {
  return {
    canShow: (command: string) => {
      return command === 'q' || command === 'quit';
    },
    show: () => {
      console.clear();
      console.write('Quit Application ...');
      process.exit(0);
    },
    hide: () => {

    },
    help: () => {
      console.write('q    / quit:                    Quit Application');
    }
  };
}
