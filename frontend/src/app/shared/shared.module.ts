import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { LoadingComponent } from './loading/loading.component';
import { CapitalizePipe } from './pipes/capitalize.pipe';

@NgModule({
  declarations: [CapitalizePipe, LoadingComponent],
  imports: [CommonModule],
  exports: [CommonModule, CapitalizePipe, LoadingComponent],
})
export class SharedModule {}
