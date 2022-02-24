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
    this.store.dispatch(StockActions.fetchStock({ symbol }));
  }
}
