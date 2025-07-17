import {
  headerEventGroup,
  HeaderStore,
} from '@angular-youtube/header-data-access';
import {
  CenterHeaderComponent,
  EndHeaderComponent,
} from '@angular-youtube/header-ui';
import { BaseWithSandBoxComponent } from '@angular-youtube/shared-data-access';
import { LogoMenuComponent } from '@angular-youtube/shared-ui';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
} from '@angular/core';

@Component({
  selector: 'ay-master-header',
  templateUrl: './master-header.component.html',
  styleUrls: ['./master-header.component.scss'],
  imports: [LogoMenuComponent, CenterHeaderComponent, EndHeaderComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MasterHeaderComponent extends BaseWithSandBoxComponent {
  headerStore = inject(HeaderStore);
  showStartHeader = input.required();
  user = this.sandbox.sharedStore.myChannelInfo;
  searchSuggestions = computed(
    () => this.headerStore.searchSuggestions()?.suggestions ?? [],
  );

  onSearchQueryChange(query: string) {
    this.dispatchEvent(
      headerEventGroup.loadYoutubeSearchSuggestions({ searchQuery: query }),
    );
  }
}
