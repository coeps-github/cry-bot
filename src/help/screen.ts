import { Console, ConsoleScreen } from '../console/model';

export function getHelpScreen(console: Console, otherScreens: ConsoleScreen[] = []): ConsoleScreen {
  const helpScreen = {
    show: (command: string) => {
      return command === 'h' || command === 'help';
    },
    write: () => {
      console.clear();
      console.write('Commands:', false);
      otherScreens.forEach(screen => screen.help());
      helpScreen.help();
    },
    help: () => {
      console.write('h    / help:                    Show available commands (this info)', false);
    }
  };
  return helpScreen;
}
