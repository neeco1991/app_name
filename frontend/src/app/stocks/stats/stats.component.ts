import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

export interface Stats {
  price: { price: number; marketCap: number };
}

export type StatList = 'price' | 'marketCap';

@Component({
  selector: 'app-stats',
  templateUrl: './stats.component.html',
  styleUrls: ['./stats.component.scss'],
})
export class StatsComponent {
  constructor() {}

  @Input() currency: string = 'USD';
  @Input() stats: Stats = {
    price: {
      price: 1500,
      marketCap: 7000000000000,
    },
  };
  @Output('selectedStat') selectedStat = new EventEmitter<StatList>();

  onSelect(stat: StatList) {
    this.selectedStat.emit(stat);
  }
}
