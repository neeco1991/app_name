import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../../environments/environment';
import { StockSearchResponse } from './responses.type';

interface Query {
  q: string;
}

@Injectable({ providedIn: 'root' })
export class SearchService {
  private baseUrl = `${environment.backend.url}/search`;
  constructor(private http: HttpClient) {}

  search(query: Query): Observable<StockSearchResponse> {
    const params = {
      q: query.q ? query.q : '',
    };

    return this.http.get<StockSearchResponse>(`${this.baseUrl}`, {
      params,
    });
  }
}
