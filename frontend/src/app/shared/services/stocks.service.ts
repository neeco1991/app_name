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
  start?: Date;
  end?: Date;
}

@Injectable({ providedIn: 'root' })
export class StockService {
  private baseUrl = `${environment.backend.url}/stock`;
  constructor(private http: HttpClient) {}

  // candles(query: CandlesQuery): Observable<StockCandlesResponse> {
  //   return this.http.get<StockCandlesResponse>(`${this.baseUrl}/candles`, {
  //     params: query,
  //   });
  // }
}
