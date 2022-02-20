import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-stock-title',
  templateUrl: './stock-title.component.html',
  styleUrls: ['./stock-title.component.scss'],
})
export class StockTitleComponent implements OnInit {
  constructor() {}

  @Input() tiker: string;

  ngOnInit(): void {}
}
