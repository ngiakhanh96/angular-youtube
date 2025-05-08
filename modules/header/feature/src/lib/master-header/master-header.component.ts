import {
  headerActionGroup,
  selectHeaderSearchSuggestions,
} from '@angular-youtube/header-data-access';
import {
  CenterHeaderComponent,
  EndHeaderComponent,
} from '@angular-youtube/header-ui';
import {
  BaseWithSandBoxComponent,
  IInvidiousSearchSuggestions,
  selectMyChannelInfo,
} from '@angular-youtube/shared-data-access';
import { LogoMenuComponent } from '@angular-youtube/shared-ui';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
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
  showStartHeader = input.required();
  user = this.selectSignal(selectMyChannelInfo);
  searchSuggestionsInfo: Signal<IInvidiousSearchSuggestions | undefined>;
  searchSuggestions = computed(
    () => this.searchSuggestionsInfo()?.suggestions ?? [],
  );
  constructor() {
    super();
    this.searchSuggestionsInfo = this.selectSignal(
      selectHeaderSearchSuggestions,
    );
  }

  onSearchQueryChange(query: string) {
    this.dispatchAction(
      headerActionGroup.loadYoutubeSearchSuggestions({ searchQuery: query }),
    );
  }
}
