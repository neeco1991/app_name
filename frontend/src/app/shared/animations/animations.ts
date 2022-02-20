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

export const inOutAnimation = (
  time: number,
  delay?: { enter?: number; leave?: number }
) => {
  let enterDelay = ``;
  let leaveDelay = ``;
  if (delay) {
    if (delay.enter) {
      enterDelay = ` ${delay.enter}s`;
    }
    if (delay.leave) {
      leaveDelay = ` ${delay.leave}s`;
    }
  }
  return trigger('inOutAnimation', [
    transition(':enter', [
      style({ height: 0 }),
      animate(`${time}s${enterDelay}`, style({})),
    ]),
    transition(':leave', [
      style({}),
      animate(`${time}s${leaveDelay}`, style({ height: 0 })),
    ]),
  ]);
};
