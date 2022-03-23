import { Component, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import {
  combineLatest,
  filter,
  map,
  Observable,
  pluck,
  Subject,
  takeUntil,
  tap,
  withLatestFrom,
} from 'rxjs';

import * as fromApp from '../../store';
import { StatList, Stats } from '../stats/stats.component';
import { Candles } from '../store';

@Component({
  selector: 'app-summary',
  templateUrl: './summary.component.html',
  styleUrls: ['./summary.component.scss'],
})
export class SummaryComponent implements OnDestroy {
  constructor(
    private route: ActivatedRoute,
    private store: Store<fromApp.AppState>
  ) {}

  destroyed$ = new Subject<void>();
  selectedStat: StatList = 'price';

  tiker$ = this.route.params.pipe(
    takeUntil(this.destroyed$),
    pluck('symbol'),
    map((symbol: string) => {
      const splitted = symbol.split('.');
      return splitted[0];
    })
  );

  notLoading$ = this.store.select('stock').pipe(
    takeUntil(this.destroyed$),
    map(
      (state) =>
        !(
          state.candles.loading ||
          state.profile.loading ||
          state.financials.balanceSheet.loading ||
          state.financials.cashFlowStatement.loading ||
          state.financials.incomeStatement.loading
        )
    )
  );

  profile$ = this.store
    .select('stock')
    .pipe(takeUntil(this.destroyed$), pluck('profile'));

  currency$ = this.store.select('stock').pipe(
    takeUntil(this.destroyed$),
    pluck('financials'),
    pluck('incomeStatement'),
    map(({ fy }) => fy[0].reportedCurrency)
  );

  incomeStatement$ = this.store.select('stock').pipe(
    takeUntil(this.destroyed$),
    pluck('financials'),
    pluck('incomeStatement'),
    map(({ fy }) =>
      fy.map((income) => ({
        date: new Date(income.date),
        shares: income.weightedAverageShsOut,
        revenue: income.revenue,
        netIncome: income.netIncome,
      }))
    )
  );

  balanceSheet$ = this.store.select('stock').pipe(
    takeUntil(this.destroyed$),
    pluck('financials'),
    pluck('balanceSheet'),
    map(({ fy }) =>
      fy.map((income) => ({
        date: new Date(income.date),
        totalAssets: income.totalAssets,
        totalLiabilities: income.totalLiabilities,
        totDebt: income.totalDebt,
        totCashEq: income.cashAndCashEquivalents,
      }))
    )
  );

  candles$: Observable<Candles> = this.store
    .select('stock')
    .pipe(takeUntil(this.destroyed$), pluck('candles'));

  stockDaylyData$: Observable<{
    shares: number[];
    revenue: number[];
    netIncome: number[];
    totalAssets: number[];
    totalLiabilities: number[];
    price: Candles;
    marketCap: Candles;
    EV: Candles;
    PE: Candles;
    PS: Candles;
    PB: Candles;
  }> = combineLatest([
    this.candles$,
    this.incomeStatement$,
    this.balanceSheet$,
  ]).pipe(
    takeUntil(this.destroyed$),
    map(([candles, income, bs]) => {
      const marketCap: Candles = {
        close: [],
        open: [],
        low: [],
        high: [],
        time: [],
        volume: [],
      };
      const EV: Candles = {
        close: [],
        open: [],
        low: [],
        high: [],
        time: [],
        volume: [],
      };
      const PE: Candles = {
        close: [],
        open: [],
        low: [],
        high: [],
        time: [],
        volume: [],
      };
      const PS: Candles = {
        close: [],
        open: [],
        low: [],
        high: [],
        time: [],
        volume: [],
      };
      const PB: Candles = {
        close: [],
        open: [],
        low: [],
        high: [],
        time: [],
        volume: [],
      };

      const nShares: number[] = [];
      const ltmRev: number[] = [];
      const ltmNetInc: number[] = [];
      const ltmTotAssets: number[] = [];
      const ltmTotLiabilities: number[] = [];
      const ltmTotDebt: number[] = [];
      const ltmCashAndEq: number[] = [];

      const incomeLength = income.length;
      const bsLength = bs.length;
      let candlesIndex = candles.close.length - 1;
      let incomeIndex = 0;
      let bsIndex = 0;
      while (candlesIndex >= 0) {
        while (
          incomeIndex < incomeLength - 1 &&
          income[incomeIndex].date >= candles.time[candlesIndex]
        ) {
          incomeIndex++;
        }
        while (
          bsIndex < bsLength - 1 &&
          income[bsIndex].date >= candles.time[candlesIndex]
        ) {
          bsIndex++;
        }

        nShares.unshift(income[incomeIndex].shares);
        ltmRev.unshift(income[incomeIndex].revenue);
        ltmNetInc.unshift(income[incomeIndex].netIncome);
        ltmTotAssets.unshift(bs[bsIndex].totalAssets);
        ltmTotLiabilities.unshift(bs[bsIndex].totalLiabilities);
        ltmTotDebt.unshift(bs[bsIndex].totDebt);
        ltmCashAndEq.unshift(bs[bsIndex].totCashEq);

        candlesIndex--;
      }

      for (let i = 0; i < candles.close.length; i++) {
        marketCap.close.push(candles.close[i] * nShares[i]);
        marketCap.open.push(candles.open[i] * nShares[i]);
        marketCap.low.push(candles.low[i] * nShares[i]);
        marketCap.high.push(candles.high[i] * nShares[i]);
        marketCap.volume.push(candles.volume[i]);
        marketCap.time.push(candles.time[i]);

        EV.close.push(
          candles.close[i] * nShares[i] - (ltmCashAndEq[i] - ltmTotDebt[i])
        );
        EV.open.push(
          candles.open[i] * nShares[i] - (ltmCashAndEq[i] - ltmTotDebt[i])
        );
        EV.low.push(
          candles.low[i] * nShares[i] - (ltmCashAndEq[i] - ltmTotDebt[i])
        );
        EV.high.push(
          candles.high[i] * nShares[i] - (ltmCashAndEq[i] - ltmTotDebt[i])
        );
        EV.volume.push(candles.volume[i]);
        EV.time.push(candles.time[i]);

        PE.close.push(
          Math.round((candles.close[i] * nShares[i] * 100) / ltmNetInc[i]) / 100
        );
        PE.open.push(
          Math.round((candles.open[i] * nShares[i] * 100) / ltmNetInc[i]) / 100
        );
        PE.low.push(
          Math.round((candles.low[i] * nShares[i] * 100) / ltmNetInc[i]) / 100
        );
        PE.high.push(
          Math.round((candles.high[i] * nShares[i] * 100) / ltmNetInc[i]) / 100
        );
        PE.volume.push(candles.volume[i]);
        PE.time.push(candles.time[i]);

        PS.close.push(
          Math.round((candles.close[i] * nShares[i] * 100) / ltmRev[i]) / 100
        );
        PS.open.push(
          Math.round((candles.open[i] * nShares[i] * 100) / ltmRev[i]) / 100
        );
        PS.low.push(
          Math.round((candles.low[i] * nShares[i] * 100) / ltmRev[i]) / 100
        );
        PS.high.push(
          Math.round((candles.high[i] * nShares[i] * 100) / ltmRev[i]) / 100
        );
        PS.volume.push(candles.volume[i]);
        PS.time.push(candles.time[i]);

        PB.close.push(
          Math.round(
            (candles.close[i] * nShares[i] * 100) /
              (ltmTotAssets[i] - ltmTotLiabilities[i])
          ) / 100
        );
        PB.open.push(
          Math.round(
            (candles.open[i] * nShares[i] * 100) /
              (ltmTotAssets[i] - ltmTotLiabilities[i])
          ) / 100
        );
        PB.low.push(
          Math.round(
            (candles.low[i] * nShares[i] * 100) /
              (ltmTotAssets[i] - ltmTotLiabilities[i])
          ) / 100
        );
        PB.high.push(
          Math.round(
            (candles.high[i] * nShares[i] * 100) /
              (ltmTotAssets[i] - ltmTotLiabilities[i])
          ) / 100
        );
        PB.volume.push(candles.volume[i]);
        PB.time.push(candles.time[i]);
      }

      return {
        price: candles,
        shares: nShares,
        revenue: ltmRev,
        netIncome: ltmNetInc,
        totalAssets: ltmTotAssets,
        totalLiabilities: ltmTotLiabilities,
        marketCap,
        EV,
        PE,
        PS,
        PB,
      };
    })
  );

  stats$ = this.stockDaylyData$.pipe(
    takeUntil(this.destroyed$),
    map(
      ({ price, marketCap, EV, PE, PS, PB }): Stats => ({
        price: {
          price: price.close[price.close.length - 1],
          marketCap: marketCap.close[marketCap.close.length - 1],
          EV: EV.close[EV.close.length - 1],
        },
        valuation: {
          PE: PE.close[PE.close.length - 1],
          PS: PS.close[PS.close.length - 1],
          PB: PB.close[PB.close.length - 1],
        },
      })
    )
  );

  ngOnDestroy(): void {
    this.destroyed$.next();
    this.destroyed$.complete();
  }

  onSelectStat(stat: StatList) {
    this.selectedStat = stat;
  }
}
