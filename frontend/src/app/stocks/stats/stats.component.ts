import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Observable, of } from 'rxjs';

export interface Stats {
  price: { price: number; marketCap: number };
}

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
  @Output('selectedStat') selectedStat = new EventEmitter<string>();

  onSelect(stat: string) {
    this.selectedStat.emit(stat);
  }
}
