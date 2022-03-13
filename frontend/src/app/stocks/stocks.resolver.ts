import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  Resolve,
  RouterStateSnapshot,
} from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';

import * as fromApp from '../store/app.reducer';
import * as StockActions from './store/stocks.actions';

@Injectable()
export class StocksResolver implements Resolve<void> {
  constructor(private store: Store<fromApp.AppState>) {}

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): void | Observable<void> | Promise<void> {
    const { symbol } = route.params;
    this.store.dispatch(StockActions.fetchProfile({ symbol }));
    this.store.dispatch(
      StockActions.fetchCandles({
        symbol,
        request_from: undefined,
        request_to: undefined,
      })
    );
    this.store.dispatch(
      StockActions.fetchBalanceSheet({ symbol, limit: undefined })
    );
    this.store.dispatch(
      StockActions.fetchIncomeStatement({ symbol, limit: undefined })
    );
    this.store.dispatch(
      StockActions.fetchCashFlowStatement({ symbol, limit: undefined })
    );
  }
}
