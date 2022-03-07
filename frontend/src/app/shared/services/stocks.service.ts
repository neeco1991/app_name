import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';
import { getUNIXTimestamp } from '../utils/dates';

interface StockCandlesResponse {
  c: number[];
  o: number[];
  l: number[];
  h: number[];
  t: number[];
  v: number[];
  s: string;
}

interface CandlesQuery {
  symbol: string;
  start?: Date | undefined;
  end?: Date | undefined;
}

@Injectable({ providedIn: 'root' })
export class StockService {
  private baseUrl = `${environment.backend.url}/stock`;
  constructor(private http: HttpClient) {}

  candles(query: CandlesQuery): Observable<StockCandlesResponse> {
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
}
