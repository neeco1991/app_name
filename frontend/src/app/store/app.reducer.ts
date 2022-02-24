import * as fromStocks from '../stocks/store';

export interface AppState {
  stock: fromStocks.State;
}

export const appReducers = {
  stock: fromStocks.stockReducer,
};
