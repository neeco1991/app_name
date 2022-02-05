import {
  style,
  animate,
  trigger,
  transition,
  state,
} from '@angular/animations';

type State = { [key: string]: string | number };

export const collapseAnimation = (
  initialState: State,
  finalState: State,
  milliseconds: number
) =>
  trigger('collapse', [
    state('false', style(initialState)),
    state('true', style(finalState)),
    transition('false <=> true', animate(milliseconds)),
  ]);
