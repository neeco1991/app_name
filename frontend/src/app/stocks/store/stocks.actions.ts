import { createAction, props } from '@ngrx/store';
import {
  BalanceSheetResponse,
  CashFlowStatementResponse,
  IncomeStatementResponse,
} from 'src/app/shared/services/responses.type';

export const FETCH_PROFILE = '[Stock] Fetch Profile';
export const FETCH_PROFILE_SUCCESS = '[Stock] Fetch Profile Success';
export const FETCH_PROFILE_ERROR = '[Stock] Fetch Profile Error';

export const FETCH_CANDLES = '[Stock] Fetch Candles';
export const FETCH_CANDLES_SUCCESS = '[Stock] Fetch Candles Success';
export const FETCH_CANDLES_ERROR = '[Stock] Fetch Candles Error';

export const FETCH_BALANCE_SHEET = '[Stock] Fetch Balance Sheet';
export const FETCH_BALANCE_SHEET_SUCCESS =
  '[Stock] Fetch Balance Sheet Success';
export const FETCH_BALANCE_SHEET_ERROR = '[Stock] Fetch Balance Sheet Error';

export const FETCH_INCOME_STATEMENT = '[Stock] Fetch Income Statement';
export const FETCH_INCOME_STATEMENT_SUCCESS =
  '[Stock] Fetch Income Statement Success';
export const FETCH_INCOME_STATEMENT_ERROR =
  '[Stock] Fetch Income Statement Error';

export const FETCH_CASH_FLOW_STATEMENT = '[Stock] Fetch Cash Flow Statement';
export const FETCH_CASH_FLOW_STATEMENT_SUCCESS =
  '[Stock] Fetch Cash Flow Statement Success';
export const FETCH_CASH_FLOW_STATEMENT_ERROR =
  '[Stock] Fetch Cash Flow Statement Error';

export const fetchProfile = createAction(
  FETCH_PROFILE,
  props<{ symbol: string }>()
);
export const fetchProfileSuccess = createAction(
  FETCH_PROFILE_SUCCESS,
  props<{ ticker: string; exchange: string; name: string }>()
);
export const fetchProfileError = createAction(
  FETCH_PROFILE_ERROR,
  props<{ error: string }>()
);

export const fetchCandles = createAction(
  FETCH_CANDLES,
  props<{
    symbol: string;
    request_from: Date | undefined;
    request_to: Date | undefined;
  }>()
);
export const fetchCandlesSuccess = createAction(
  FETCH_CANDLES_SUCCESS,
  props<{
    close: number[];
    high: number[];
    low: number[];
    open: number[];
    time: Date[];
    volume: number[];
  }>()
);
export const fetchCandlesError = createAction(
  FETCH_CANDLES_SUCCESS,
  props<{ error: string }>()
);

export const fetchBalanceSheet = createAction(
  FETCH_BALANCE_SHEET,
  props<{
    symbol: string;
    limit: number | undefined;
  }>()
);
export const fetchBalanceSheetSuccess = createAction(
  FETCH_BALANCE_SHEET_SUCCESS,
  props<{ fy: BalanceSheetResponse }>()
);
export const fetchBalanceSheetError = createAction(
  FETCH_BALANCE_SHEET_ERROR,
  props<{ error: string }>()
);

export const fetchIncomeStatement = createAction(
  FETCH_INCOME_STATEMENT,
  props<{
    symbol: string;
    limit: number | undefined;
  }>()
);
export const fetchIncomeStatementSuccess = createAction(
  FETCH_INCOME_STATEMENT_SUCCESS,
  props<{ fy: IncomeStatementResponse }>()
);
export const fetchIncomeStatementError = createAction(
  FETCH_INCOME_STATEMENT_ERROR,
  props<{ error: string }>()
);

export const fetchCashFlowStatement = createAction(
  FETCH_CASH_FLOW_STATEMENT,
  props<{
    symbol: string;
    limit: number | undefined;
  }>()
);
export const fetchCashFlowStatementSuccess = createAction(
  FETCH_CASH_FLOW_STATEMENT_SUCCESS,
  props<{ fy: CashFlowStatementResponse }>()
);
export const fetchCashFlowStatementError = createAction(
  FETCH_CASH_FLOW_STATEMENT_ERROR,
  props<{ error: string }>()
);
