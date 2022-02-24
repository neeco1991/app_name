import { Action, createReducer, on } from '@ngrx/store';

import * as StockActions from './stocks.actions';

export interface State {
  loading: boolean;
  error: string;
  profile: {
    loading: boolean;
    ticker: string;
    exchange: string;
    name: string;
  };
}

const initialState: State = {
  loading: false,
  error: '',
  profile: {
    loading: false,
    ticker: '',
    exchange: '',
    name: '',
  },
};

const _stockReducer = createReducer(
  initialState,
  on(StockActions.fetchStock, (state) => ({
    ...state,
    loading: false,
  })),
  on(StockActions.selectStock, (state, { ticker, name, exchange }) => ({
    ...state,
    loading: false,
    error: '',
    profile: {
      ...state.profile,
      loading: false,
      ticker,
      name,
      exchange,
    },
  })),
  on(StockActions.fetchStockError, (state, { error }) => ({
    ...state,
    error,
    loading: false,
  }))
);

export const stockReducer = (state: State | undefined, action: Action): State =>
  _stockReducer(state, action);
