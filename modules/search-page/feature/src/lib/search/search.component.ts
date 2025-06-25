import {
  searchPageActionGroup,
  selectSearchedVideosInfo,
} from '@angular-youtube/search-page-data-access';
import { VideosSearchComponent } from '@angular-youtube/search-page-ui';
import {
  BaseWithSandBoxComponent,
  IVideoCategories,
  selectVideoCategories,
  sharedActionGroup,
} from '@angular-youtube/shared-data-access';
import {
  IVideoCategory,
  IVideoPlayerCardInfo,
  LoadingBarService,
  PlayerPosition,
  SidebarService,
  Utilities,
} from '@angular-youtube/shared-ui';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  linkedSignal,
  OnInit,
  Signal,
  signal,
} from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'ay-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss'],
  imports: [VideosSearchComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SearchComponent
  extends BaseWithSandBoxComponent
  implements OnInit
{
  protected videosCategories: Signal<IVideoCategories | undefined>;
  protected videosCategoriesViewModel: Signal<IVideoCategory[]>;
  protected PlayerPosition: typeof PlayerPosition = PlayerPosition;
  protected searchedVideosInfo: Signal<IVideoPlayerCardInfo[]>;
  private route = inject(ActivatedRoute);
  private searchQuery = signal<string | null>(null);
  private searchYoutubeVideosInfo = computed(() =>
    searchPageActionGroup.searchYoutubeVideos({
      searchTerm: this.searchQuery() ?? '',
      page: this.page(),
    }),
  );
  private titleService = inject(Title);
  private sidebarService = inject(SidebarService);
  private loadingBarService = inject(LoadingBarService);
  private page = linkedSignal(() => {
    this.searchQuery();
    return 1;
  });

  constructor() {
    super();
    this.dispatchAction(sharedActionGroup.loadYoutubeVideoCategories());
    this.videosCategories = this.selectSignal(selectVideoCategories);
    this.videosCategoriesViewModel = computed(() => {
      const videoCategories = this.videosCategories();
      return (
        videoCategories?.items.map((p) => ({
          title: p.snippet.title,
          id: p.id,
        })) ?? []
      );
    });
    this.searchedVideosInfo = this.selectSignal(
      selectSearchedVideosInfo,
      (searchedVideos) =>
        searchedVideos
          .filter((p) => p.type === 'video')
          .map((p) => ({
            isSkeleton: false,
            videoId: p.videoId ?? '',
            title: p.title ?? '',
            channelName: p.author ?? '',
            viewCount: +(p.viewCount ?? 0),
            publishedDate: Utilities.epochToDate(p.published),
            //TODO dont understand why youtube keep duration in seconds - 1 when playing the video in details page but keep it in seconds when showing in search section
            lengthSeconds: p.lengthSeconds,
            channelLogoUrl: p.authorThumbnails[0]?.url ?? '',
            videoUrl: p.formatStreams[0]?.url ?? '',
            isVerified: p.authorVerified ?? false,
          })) ?? [],
    );
    this.dispatchActionFromSignal(this.searchYoutubeVideosInfo);
    effect(() => {
      this.titleService.setTitle(
        `${this.searchQuery() ?? ''} - Angular Youtube`,
      );
    });
    effect(() => {
      if (this.searchedVideosInfo().length > 0) {
        this.loadingBarService.load(100);
      }
    });
  }

  ngOnInit(): void {
    this.route.queryParamMap
      .pipe(this.takeUntilDestroyed())
      .subscribe((params) => {
        this.searchQuery.set(params.get('search_query'));
        this.loadingBarService.load(25);
      });
    this.sidebarService.setSelectedIconName(null);
  }

  onScrollDown() {
    this.page.update((p) => p + 1);
  }
}
