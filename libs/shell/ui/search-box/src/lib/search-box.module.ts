import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SearchBoxComponent } from './search-box.component';

@NgModule({
  imports: [CommonModule],
  exports: [SearchBoxComponent],
  declarations: [SearchBoxComponent],
})
export class SearchBoxModule {}
