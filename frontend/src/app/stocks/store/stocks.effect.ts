import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
// import { Store } from '@ngrx/store';
import { catchError, map, of, switchMap, tap } from 'rxjs';

import { SearchService } from 'src/app/shared/services/search.service';
// import * as fromApp from '../../store/app.reducer';
import * as StocksActions from './stocks.actions';

@Injectable()
export class StocksEffect {
  constructor(
    private actions$: Actions,
    // private store: Store<fromApp.AppState>,
    private searchSrv: SearchService
  ) {}

  fetchStock$ = createEffect(() =>
    this.actions$.pipe(
      ofType(StocksActions.fetchStock),
      switchMap(({ symbol }) =>
        this.searchSrv.search({ q: symbol }).pipe(
          map(({ result }) => {
            const { symbol, description } = result[0];
            const splitted = symbol.split('.');
            const ticker = splitted[0];
            const exchange = splitted.length > 1 ? splitted[1] : 'USA';

            return StocksActions.selectStock({
              ticker,
              exchange,
              name: description,
            });
          }),
          catchError((error: HttpErrorResponse) =>
            of(StocksActions.fetchStockError({ error: error.message }))
          )
        )
      )
    )
  );
}
