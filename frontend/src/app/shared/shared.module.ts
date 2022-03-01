import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { LoadingComponent } from './components/loading/loading.component';
import { CapitalizePipe } from './pipes/capitalize.pipe';
import { PageOverlayComponent } from './components/page-overlay/page-overlay.component';

@NgModule({
  declarations: [CapitalizePipe, LoadingComponent, PageOverlayComponent],
  imports: [CommonModule],
  exports: [
    CommonModule,
    CapitalizePipe,
    LoadingComponent,
    PageOverlayComponent,
  ],
})
export class SharedModule {}
