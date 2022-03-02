import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';

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
  q: string;
  start?: Date | undefined;
  end?: Date | undefined;
}

@Injectable({ providedIn: 'root' })
export class StockService {
  private baseUrl = `${environment.backend.url}/stock`;
  constructor(private http: HttpClient) {}

  candles(query: CandlesQuery): Observable<StockCandlesResponse> {
    const oneYearAgo = new Date();
    oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);
    const params = {
      q: query.q,
      start: query.start
        ? query.start.getTime() / 1000
        : oneYearAgo.getTime() / 1000,
      end: query.end ? query.end.getTime() / 1000 : new Date().getTime() / 1000,
    };

    return this.http.get<StockCandlesResponse>(`${this.baseUrl}/candles`, {
      params,
    });
  }
}
