import { Console, ConsoleScreen } from '../console/model';
import { timer } from 'rxjs';

export function getExecutionScreen(console: Console, screens: ConsoleScreen[] = []): ConsoleScreen {
  let visible = false;

  const show = () => {
    console.clear();
    console.write('Execution status:');
    screens.forEach(screen => console.write(`${screen.name}: ${screen.isRunning() ? 'Running' : 'Idle'}`));
    timer(1000).subscribe(() => {
      if (visible) {
        show();
      }
    });
  };

  return {
    name: 'Execution',
    isRunning: () => visible,
    canShow: (command: string) => {
      return command === 'e' || command === 'execution';
    },
    show: () => {
      visible = true;
      show();
    },
    hide: () => {
      visible = false;
    },
    help: () => {
      console.write('e    / execution:               Show execution status');
    }
  };
}
