import { Console, ConsoleScreen } from '../console/model';

export function getHelpScreen(otherScreens: ConsoleScreen[] = []): ConsoleScreen {
  const helpScreen: ConsoleScreen = {
    id: 'help',
    show: (command: string) => {
      return command === 'h' || command === 'help';
    },
    write: (console: Console) => {
      console.clear();
      console.write('Commands:', false);
      otherScreens.forEach(screen => screen.help(console));
      helpScreen.help(console);
    },
    help: (console: Console) => {
      console.write('h   / help:                Show available commands (this info)', false);
    }
  };
  return helpScreen;
}
