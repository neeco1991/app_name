import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-page-overlay',
  templateUrl: './page-overlay.component.html',
  styleUrls: ['./page-overlay.component.scss'],
})
export class PageOverlayComponent {
  constructor() {}

  @Input() color = 'transparent';
}
