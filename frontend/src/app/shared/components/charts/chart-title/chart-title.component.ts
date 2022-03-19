import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-chart-title',
  templateUrl: './chart-title.component.html',
  styleUrls: ['./chart-title.component.scss'],
})
export class ChartTitleComponent {
  constructor() {}

  @Input() title: string;
  @Input() value: number;
  @Input() bigNumbers: boolean = false;
  @Input() currency: string | null;
}
