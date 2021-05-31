import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CenterHeaderComponent } from './center-header.component';
import { SearchBoxModule } from '@angular-youtube/shell/ui/search-box';
import { TopbarMenuButtonRendererModule } from '@angular-youtube/shell/ui/topbar-menu-button-renderer';

@NgModule({
  imports: [CommonModule, SearchBoxModule, TopbarMenuButtonRendererModule],
  exports: [CenterHeaderComponent],
  declarations: [CenterHeaderComponent],
})
export class CenterHeaderModule {}
