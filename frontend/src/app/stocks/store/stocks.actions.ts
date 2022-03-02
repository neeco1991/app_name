import { createAction, props } from '@ngrx/store';

export const FETCH_PROFILE = '[Stock] Fetch Profile';
export const FETCH_PROFILE_SUCCESS = '[Stock] Fetch Profile Success';
export const FETCH_PROFILE_ERROR = '[Stock] Fetch Profile Error';

export const FETCH_CANDLES = '[Stock] Fetch Candles';
export const FETCH_CANDLES_SUCCESS = '[Stock] Fetch Candles Success';
export const FETCH_CANDLES_ERROR = '[Stock] Fetch Candles Error';

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
