import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';

interface StockSearch {
  description: string;
  symbol: string;
  displaySymbol: string;
  type: string;
}

interface StockSearchResponse {
  count: number;
  result: StockSearch[];
}

interface Query {
  [param: string]: string;
}

@Injectable({ providedIn: 'root' })
export class SearchService {
  private baseUrl = `${environment.backend.url}search`;
  constructor(private http: HttpClient) {}

  search(query?: Query): Observable<StockSearchResponse> {
    return this.http.get<StockSearchResponse>(`${this.baseUrl}`, {
      params: query,
    });
  }
}
