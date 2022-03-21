import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

export interface Stats {
  price: { price: number; marketCap: number };
  valuation: { PE: number; PS: number };
}

export type StatList = 'price' | 'marketCap' | 'PE' | 'PS';

@Component({
  selector: 'app-stats',
  templateUrl: './stats.component.html',
  styleUrls: ['./stats.component.scss'],
})
export class StatsComponent {
  constructor() {}

  @Input() currency: string = 'USD';
  @Input() stats: Stats;
  @Output('selectedStat') selectedStat = new EventEmitter<StatList>();

  onSelect(stat: StatList) {
    this.selectedStat.emit(stat);
  }
}
