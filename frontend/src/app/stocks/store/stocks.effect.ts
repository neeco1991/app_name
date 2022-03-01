import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
// import { Store } from '@ngrx/store';
import { catchError, map, of, switchMap, tap } from 'rxjs';

import { SearchService } from 'src/app/shared/services/search.service';

// import * as fromApp from '../../store/app.reducer';
import { splitSymbol } from 'src/app/shared/utils/stocks';
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
      ofType(StocksActions.fetchProfile),
      switchMap(({ symbol }) =>
        this.searchSrv.search({ q: symbol }).pipe(
          map(({ result }) => {
            const { symbol, description } = result[0];
            const [ticker, exchange] = splitSymbol(symbol);

            return StocksActions.fetchProfileSuccess({
              ticker,
              exchange,
              name: description,
            });
          }),
          catchError((error: HttpErrorResponse) =>
            of(StocksActions.fetchProfileError({ error: error.message }))
          )
        )
      )
    )
  );
}
