import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../../environments/environment';
import { getUNIXTimestamp } from '../utils/dates';
import {
  BalanceSheetResponse,
  CashFlowStatementResponse,
  IncomeStatementResponse,
  StockCandlesResponse,
} from './responses.type';

interface Query {
  symbol: string;
  start?: Date | undefined;
  end?: Date | undefined;
}

@Injectable({ providedIn: 'root' })
export class StockService {
  private baseUrl = `${environment.backend.url}/stock`;
  constructor(private http: HttpClient) {}

  candles(query: Query): Observable<StockCandlesResponse> {
    const oneHundredYearsAgo = new Date();
    oneHundredYearsAgo.setFullYear(oneHundredYearsAgo.getFullYear() - 100);
    const params = {
      symbol: query.symbol,
      timestamp_from: query.start
        ? getUNIXTimestamp(query.start)
        : getUNIXTimestamp(oneHundredYearsAgo),
      timestamp_to: query.end
        ? getUNIXTimestamp(query.end)
        : getUNIXTimestamp(new Date()),
    };

    return this.http.get<StockCandlesResponse>(`${this.baseUrl}/candles`, {
      params,
    });
  }

  balanceSheet(query: Query): Observable<BalanceSheetResponse> {
    const params = {
      apikey: environment.fmg.apiKey,
    };

    return this.http.get<BalanceSheetResponse>(
      `${environment.fmg.url}/balance-sheet-statement/${query.symbol}`,
      { params }
    );
  }

  incomeStatement(query: Query): Observable<IncomeStatementResponse> {
    const params = {
      apikey: environment.fmg.apiKey,
    };

    return this.http.get<IncomeStatementResponse>(
      `${environment.fmg.url}/income-statement/${query.symbol}`,
      { params }
    );
  }

  cashFlowStatement(query: Query): Observable<CashFlowStatementResponse> {
    const params = {
      apikey: environment.fmg.apiKey,
    };

    return this.http.get<CashFlowStatementResponse>(
      `${environment.fmg.url}/cash-flow-statement/${query.symbol}`,
      { params }
    );
  }
}
