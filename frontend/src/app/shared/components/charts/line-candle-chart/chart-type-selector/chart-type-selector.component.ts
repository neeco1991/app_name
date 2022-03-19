import { Component, EventEmitter, Input, Output } from '@angular/core';

type GraphType = 'candle' | 'line';

@Component({
  selector: 'app-chart-type-selector',
  templateUrl: './chart-type-selector.component.html',
  styleUrls: ['./chart-type-selector.component.scss'],
})
export class ChartTypeSelectorComponent {
  constructor() {}

  @Output('setGraphType') changeGraphType = new EventEmitter<GraphType>();
  @Input() activeType: GraphType = 'line';

  graphType: GraphType = 'line';

  setGraphType(graphType: GraphType) {
    this.changeGraphType.emit(graphType);
    this.graphType = graphType;
  }
}
