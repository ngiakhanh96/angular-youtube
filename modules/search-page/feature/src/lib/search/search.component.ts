import {
  searchPageEventGroup,
  SearchPageStore,
} from '@angular-youtube/search-page-data-access';
import { VideosSearchComponent } from '@angular-youtube/search-page-ui';
import {
  BaseWithSandBoxComponent,
  sharedEventGroup,
} from '@angular-youtube/shared-data-access';
import {
  LoadingBarService,
  PlayerPosition,
  SidebarService,
  Utilities,
} from '@angular-youtube/shared-ui';
import {
  Component,
  computed,
  effect,
  inject,
  input,
  OnInit,
} from '@angular/core';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'ay-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss'],
  imports: [VideosSearchComponent],
})
export class SearchComponent
  extends BaseWithSandBoxComponent
  implements OnInit
{
  protected searchPageStore = inject(SearchPageStore);
  protected isLoadingVideos = this.sandbox.sharedStore.getIsPendingRequest(
    searchPageEventGroup.searchYoutubeVideos.type,
  );
  protected videosCategoriesViewModel = computed(() => {
    const videoCategories = this.sandbox.sharedStore.videoCategories();
    return (
      videoCategories?.items.map((p) => ({
        title: p.snippet.title,
        id: p.id,
      })) ?? []
    );
  });
  protected PlayerPosition: typeof PlayerPosition = PlayerPosition;
  protected searchedVideosInfo = computed(() => {
    return (
      this.searchPageStore
        .searchedVideosInfo()
        .filter((p) => p.type === 'video')
        .map((p) => ({
          isSkeleton: false,
          videoId: p.videoId ?? '',
          title: p.title ?? '',
          channelName: p.author ?? '',
          viewCount: +(p.viewCount ?? 0),
          publishedDate: Utilities.epochToDate(p.published),
          // TODO dont understand why youtube keep duration in seconds - 1 when playing the video in details page but keep it in seconds when showing in search section
          lengthSeconds: p.lengthSeconds,
          channelLogoUrl:
            p.authorThumbnails[0]?.url ?? Utilities.defaultUserAvatarUrl,
          videoUrl: p.formatStreams[0]?.url ?? '',
          isVerified: p.authorVerified ?? false,
        })) ?? []
    );
  });
  readonly searchQuery = input('', {
    // eslint-disable-next-line @angular-eslint/no-input-rename -- Preserve the existing watch/search URL query parameter contract.
    alias: 'search_query',
    transform: (value: string | string[] | null | undefined) =>
      (Array.isArray(value) ? value[0] : value) ?? '',
  });
  private searchYoutubeVideosInfo = computed(() =>
    searchPageEventGroup.searchYoutubeVideos({
      searchTerm: this.searchQuery() ?? '',
      page: 1,
    }),
  );
  private titleService = inject(Title);
  private sidebarService = inject(SidebarService);
  private loadingBarService = inject(LoadingBarService);

  constructor() {
    super();
    this.dispatchEvent(sharedEventGroup.loadYoutubeVideoCategories());
    this.dispatchEventFromSignal(this.searchYoutubeVideosInfo);
    effect(() => {
      this.titleService.setTitle(
        `${this.searchQuery() ?? ''} - Angular Youtube`,
      );
      this.loadingBarService.load(25);
    });
    effect(() => {
      if (!this.isLoadingVideos()) {
        this.loadingBarService.load(100);
      }
    });
  }

  ngOnInit(): void {
    this.sidebarService.setSelectedIconName(null);
  }

  onScrollDown() {
    if (
      this.isLoadingVideos() ||
      !this.searchPageStore.hasMore() ||
      this.searchPageStore.searchTerm() !== this.searchQuery()
    ) {
      return;
    }

    this.dispatchEvent(
      searchPageEventGroup.searchYoutubeVideos({
        searchTerm: this.searchQuery(),
        page: this.searchPageStore.page() + 1,
      }),
    );
  }
}
