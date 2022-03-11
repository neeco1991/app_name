import { Component, EventEmitter, OnInit, Output } from '@angular/core';

export type Period =
  | '1w'
  | '1m'
  | '3m'
  | '6m'
  | '1y'
  | '3y'
  | '5y'
  | 'ytd'
  | 'all';

@Component({
  selector: 'app-period-selector',
  templateUrl: './period-selector.component.html',
  styleUrls: ['./period-selector.component.scss'],
})
export class PeriodSelectorComponent {
  constructor() {}

  @Output('periodChange') click = new EventEmitter<Period>();

  setPeriod(period: Period) {
    this.click.emit(period);
  }
}
