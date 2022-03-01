import { Action, createReducer, on } from '@ngrx/store';

import * as StockActions from './stocks.actions';

export interface State {
  loading: boolean;
  errors: boolean;
  profile: {
    error: string;
    loading: boolean;
    ticker: string;
    exchange: string;
    name: string;
  };
  candles: {
    error: string;
    loading: boolean;
    close: number[];
    high: number[];
    low: number[];
    open: number[];
    time: Date[];
    volume: number[];
  };
}

const initialState: State = {
  loading: false,
  errors: false,
  profile: {
    loading: false,
    error: '',
    ticker: '',
    exchange: '',
    name: '',
  },
  candles: {
    loading: false,
    error: '',
    close: [],
    high: [],
    low: [],
    open: [],
    time: [],
    volume: [],
  },
};

const _stockReducer = createReducer(
  initialState,
  on(StockActions.fetchProfile, (state) => ({
    ...state,
    loading: true,
    profile: {
      ...state.profile,
      loading: true,
    },
  })),
  on(StockActions.fetchProfileSuccess, (state, { ticker, name, exchange }) => ({
    ...state,
    loading: state.candles.loading,
    errors: !!state.candles.error,
    profile: {
      ...state.profile,
      loading: false,
      error: '',
      ticker,
      name,
      exchange,
    },
  })),
  on(StockActions.fetchProfileError, (state, { error }) => ({
    ...state,
    loading: state.candles.loading,
    errors: true,
    profile: {
      ...state.profile,
      loading: false,
      error,
    },
  })),
  on(StockActions.fetchCandles, (state) => ({
    ...state,
    loading: true,
    candles: {
      ...state.candles,
      loading: true,
    },
  })),
  on(
    StockActions.fetchCandlesSuccess,
    (state, { open, close, high, low, volume, time }) => ({
      ...state,
      loading: state.profile.loading,
      errors: !!state.profile.error,
      candles: {
        ...state.candles,
        loading: false,
        error: '',
        open,
        close,
        high,
        low,
        volume,
        time,
      },
    })
  ),
  on(StockActions.fetchCandlesError, (state, { error }) => ({
    ...state,
    loading: state.profile.loading,
    errors: true,
    candles: {
      ...state.candles,
      loading: false,
      error,
    },
  }))
);

export const stockReducer = (state: State | undefined, action: Action): State =>
  _stockReducer(state, action);
