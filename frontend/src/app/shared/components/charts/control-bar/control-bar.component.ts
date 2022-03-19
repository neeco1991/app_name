import { Component, EventEmitter, Output } from '@angular/core';
import { Period } from '../period-selector/period-selector.component';

@Component({
  selector: 'app-control-bar',
  templateUrl: './control-bar.component.html',
  styleUrls: ['./control-bar.component.scss'],
})
export class ControlBarComponent {
  constructor() {}

  @Output('setPeriod') setPeriod = new EventEmitter<Period>();

  onSetPeriod(period: Period) {
    this.setPeriod.emit(period);
  }
}
