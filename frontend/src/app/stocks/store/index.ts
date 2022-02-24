import { ActionReducerMap } from '@ngrx/store';

import { State } from './stocks.reducer';
import { stockReducer } from './stocks.reducer';

export interface StockState {
  stock: State;
}

export const reducers: ActionReducerMap<StockState> = {
  stock: stockReducer,
};

export * from './stocks.reducer';
