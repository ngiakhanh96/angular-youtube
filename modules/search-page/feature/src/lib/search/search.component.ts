import {
  BaseWithSandBoxComponent,
  IVideoCategories,
  selectVideoCategories,
  sharedActionGroup,
} from '@angular-youtube/shared-data-access';
import {
  IVideoCategory,
  VideoCategoriesComponent,
} from '@angular-youtube/shared-ui';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
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
  imports: [VideoCategoriesComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SearchComponent
  extends BaseWithSandBoxComponent
  implements OnInit
{
  protected videosCategories: Signal<IVideoCategories | undefined>;
  protected videosCategoriesViewModel: Signal<IVideoCategory[]>;
  private route = inject(ActivatedRoute);
  private searchQuery = signal<string | null>(null);
  private titleService = inject(Title);
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

    effect(() => {
      this.titleService.setTitle(
        `${this.searchQuery() ?? ''} - Angular Youtube`,
      );
    });
  }

  ngOnInit(): void {
    this.route.queryParamMap.subscribe((params) => {
      this.searchQuery.set(params.get('search_query'));
    });
  }
}
