import { createAction, props } from '@ngrx/store';

export const SELECT_STOCK = '[Stock] Select Stock';
export const FETCH_STOCK = '[Stock] Fetch Stock';
export const FETCH_STOCK_ERROR = '[Stock] Fetch Stock Error';

export const fetchStock = createAction(
  FETCH_STOCK,
  props<{ symbol: string }>()
);

export const selectStock = createAction(
  SELECT_STOCK,
  props<{ ticker: string; exchange: string; name: string }>()
);

export const fetchStockError = createAction(
  FETCH_STOCK_ERROR,
  props<{ error: string }>()
);
