// https://stackblitz.com/edit/rxjs-ruj1m3?file=chain.ts

import { Observable, Subscription } from 'rxjs';

export type ObservableGenerator<T> = Observable<T> | ((v: T | undefined) => Observable<T>)

export function chain<T>(seed: Observable<T>, ...obsGenerators: Array<ObservableGenerator<T>>): Observable<T> {
  return new Observable<T>(masterSubscriber => {
    let lastValueFromPrev: T;
    let childSubscription: Subscription;

    const switchTo = (obs: Observable<T>) => {
      childSubscription = obs.subscribe({
        next: v => {
          lastValueFromPrev = v;
          masterSubscriber.next(v);
        },
        error: masterSubscriber.error,
        complete: () => {
          if (childSubscription) {
            childSubscription.unsubscribe();
          }
          const next = obsGenerators.shift();
          if (!next) {
            masterSubscriber.complete();
          } else {
            switchTo(typeof next === 'function' ? next(lastValueFromPrev) : next);
          }
        }
      });
    };

    switchTo(seed);

    return () => {
      childSubscription.unsubscribe();
    };
  });
}
