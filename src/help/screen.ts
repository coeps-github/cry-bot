import { Console, ConsoleScreen } from '../console/model';

export function getHelpScreen(console: Console, otherScreens: ConsoleScreen[] = []): ConsoleScreen {
  const helpScreen = {
    name: 'Help',
    isRunning: () => false,
    canShow: (command: string) => {
      return command === 'h' || command === 'help';
    },
    show: () => {
      console.clear();
      console.write('Commands:');
      otherScreens.forEach(screen => screen.help());
      helpScreen.help();
    },
    hide: () => {
      // empty
    },
    help: () => {
      console.write('h    / help:                    Show available commands (this info)');
    }
  };
  return helpScreen;
}
