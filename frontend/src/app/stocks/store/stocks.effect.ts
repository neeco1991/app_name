import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
// import { Store } from '@ngrx/store';
import { catchError, map, of, switchMap, tap } from 'rxjs';

import { SearchService } from 'src/app/shared/services/search.service';
import { StockService } from 'src/app/shared/services/stocks.service';
// import * as fromApp from '../../store/app.reducer';
import { splitSymbol } from 'src/app/shared/utils/stocks';
import * as StocksActions from './stocks.actions';

@Injectable()
export class StocksEffect {
  constructor(
    private actions$: Actions,
    // private store: Store<fromApp.AppState>,
    private searchSrv: SearchService,
    private stockSrv: StockService
  ) {}

  fetchProfile$ = createEffect(() =>
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

  fetchCandles$ = createEffect(() =>
    this.actions$.pipe(
      ofType(StocksActions.fetchCandles),
      switchMap(({ symbol, request_from, request_to }) =>
        this.stockSrv
          .candles({ symbol, start: request_from, end: request_to })
          .pipe(
            map(({ h, l, c, o, v, t, s }) => {
              if (s === 'ok') {
                const time = t.map((timestamp) => new Date(timestamp * 1000));
                return StocksActions.fetchCandlesSuccess({
                  close: c,
                  high: h,
                  low: l,
                  open: o,
                  volume: v,
                  time,
                });
              }
              return StocksActions.fetchCandlesError({ error: s });
            }),
            catchError((error: HttpErrorResponse) =>
              of(StocksActions.fetchCandlesError({ error: error.message }))
            )
          )
      )
    )
  );
}
