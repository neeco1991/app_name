import { Action, createReducer, on } from '@ngrx/store';
import {
  BalanceSheetResponse,
  CashFlowStatementResponse,
  IncomeStatementResponse,
} from 'src/app/shared/services/responses.type';

import * as StockActions from './stocks.actions';

export interface Profile {
  ticker: string;
  exchange: string;
  name: string;
}

export interface Candles {
  close: number[];
  high: number[];
  low: number[];
  open: number[];
  time: Date[];
  volume: number[];
}

export interface Financials {
  balanceSheet: BalanceSheetResponse;
  incomeStatement: IncomeStatementResponse;
  cashFlowStatement: CashFlowStatementResponse;
}

export interface State {
  loading: boolean;
  errors: boolean;
  profile: Profile & {
    error: string;
    loading: boolean;
  };
  candles: Candles & {
    error: string;
    loading: boolean;
    timestamp_from: Date | null;
    timestamp_to: Date | null;
  };
  financials: Financials;
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
    timestamp_from: null,
    timestamp_to: null,
    close: [],
    high: [],
    low: [],
    open: [],
    time: [],
    volume: [],
  },
  financials: {
    balanceSheet: [],
    incomeStatement: [],
    cashFlowStatement: [],
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
  on(StockActions.fetchCandles, (state, { request_from, request_to }) => ({
    ...state,
    loading: true,
    candles: {
      ...state.candles,
      loading: true,
      request_from,
      request_to,
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
