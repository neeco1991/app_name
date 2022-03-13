import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-chart-title',
  templateUrl: './chart-title.component.html',
  styleUrls: ['./chart-title.component.scss'],
})
export class ChartTitleComponent implements OnInit {
  constructor() {}

  @Input() title: string;
  @Input() value: number;

  ngOnInit(): void {}
}
