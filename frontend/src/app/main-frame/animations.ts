import {
  style,
  animate,
  trigger,
  transition,
  state,
} from '@angular/animations';

type State = { [key: string]: string | number };

export const booleanTransition = (
  name: string,
  initialState: State,
  finalState: State,
  milliseconds: number
) =>
  trigger(name, [
    state('false', style(initialState)),
    state('true', style(finalState)),
    transition('false <=> true', animate(milliseconds)),
  ]);
