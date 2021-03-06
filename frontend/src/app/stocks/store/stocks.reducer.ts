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
  balanceSheet: {
    loading: boolean;
    error: string;
    fy: BalanceSheetResponse;
  };
  incomeStatement: {
    loading: boolean;
    error: string;
    fy: IncomeStatementResponse;
  };
  cashFlowStatement: {
    loading: boolean;
    error: string;
    fy: CashFlowStatementResponse;
  };
}

export interface State {
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
    balanceSheet: {
      error: '',
      loading: false,
      fy: [],
    },
    incomeStatement: {
      error: '',
      loading: false,
      fy: [],
    },
    cashFlowStatement: {
      error: '',
      loading: false,
      fy: [],
    },
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
    candles: {
      ...state.candles,
      loading: false,
      error,
    },
  })),
  on(StockActions.fetchBalanceSheet, (state) => ({
    ...state,
    financials: {
      ...state.financials,
      balanceSheet: {
        ...state.financials.balanceSheet,
        loading: true,
      },
    },
  })),
  on(StockActions.fetchBalanceSheetSuccess, (state, { fy }) => ({
    ...state,
    financials: {
      ...state.financials,
      balanceSheet: {
        ...state.financials.balanceSheet,
        loading: false,
        error: '',
        fy,
      },
    },
  })),
  on(StockActions.fetchBalanceSheetError, (state, { error }) => ({
    ...state,
    financials: {
      ...state.financials,
      balanceSheet: {
        ...state.financials.balanceSheet,
        loading: false,
        fy: [],
        error,
      },
    },
  })),
  on(StockActions.fetchIncomeStatement, (state) => ({
    ...state,
    financials: {
      ...state.financials,
      incomeStatement: {
        ...state.financials.incomeStatement,
        loading: true,
      },
    },
  })),
  on(StockActions.fetchIncomeStatementSuccess, (state, { fy }) => ({
    ...state,
    financials: {
      ...state.financials,
      incomeStatement: {
        ...state.financials.incomeStatement,
        loading: false,
        error: '',
        fy,
      },
    },
  })),
  on(StockActions.fetchIncomeStatementError, (state, { error }) => ({
    ...state,
    financials: {
      ...state.financials,
      incomeStatement: {
        ...state.financials.incomeStatement,
        loading: false,
        fy: [],
        error,
      },
    },
  })),
  on(StockActions.fetchCashFlowStatement, (state) => ({
    ...state,
    financials: {
      ...state.financials,
      cashFlowStatement: {
        ...state.financials.cashFlowStatement,
        loading: true,
      },
    },
  })),
  on(StockActions.fetchCashFlowStatementSuccess, (state, { fy }) => ({
    ...state,
    financials: {
      ...state.financials,
      cashFlowStatement: {
        ...state.financials.cashFlowStatement,
        loading: false,
        error: '',
        fy,
      },
    },
  })),
  on(StockActions.fetchCashFlowStatementError, (state, { error }) => ({
    ...state,
    financials: {
      ...state.financials,
      cashFlowStatement: {
        ...state.financials.cashFlowStatement,
        loading: false,
        fy: [],
        error,
      },
    },
  }))
);

export const stockReducer = (state: State | undefined, action: Action): State =>
  _stockReducer(state, action);
