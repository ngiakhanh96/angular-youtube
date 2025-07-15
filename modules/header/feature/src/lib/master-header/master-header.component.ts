import {
  headerEventGroup,
  HeaderStore,
} from '@angular-youtube/header-data-access';
import {
  CenterHeaderComponent,
  EndHeaderComponent,
} from '@angular-youtube/header-ui';
import {
  BaseWithSandBoxComponent,
  IInvidiousSearchSuggestions,
} from '@angular-youtube/shared-data-access';
import { LogoMenuComponent } from '@angular-youtube/shared-ui';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
  Signal,
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
  searchSuggestionsInfo: Signal<IInvidiousSearchSuggestions | undefined>;
  searchSuggestions = computed(
    () => this.searchSuggestionsInfo()?.suggestions ?? [],
  );
  constructor() {
    super();
    this.searchSuggestionsInfo = this.headerStore.searchSuggestions;
  }

  onSearchQueryChange(query: string) {
    this.dispatchEvent(
      headerEventGroup.loadYoutubeSearchSuggestions({ searchQuery: query }),
    );
  }
}
