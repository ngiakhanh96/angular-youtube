import {
  playlistsEventGroup,
  PlaylistsStore,
} from '@angular-youtube/playlists-data-access';
import { PlaylistCardComponent } from '@angular-youtube/playlists-ui';
import {
  Auth,
  BaseWithSandBoxComponent,
} from '@angular-youtube/shared-data-access';
import {
  InfiniteScrollDirective,
  IVideoCategory,
  PillListComponent,
  SidebarService,
  TextIconButtonComponent,
} from '@angular-youtube/shared-ui';
import { NgTemplateOutlet } from '@angular/common';
import {
  afterNextRender,
  Component,
  effect,
  ElementRef,
  inject,
  OnDestroy,
  signal,
  untracked,
  viewChild,
} from '@angular/core';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'ay-playlists',
  imports: [
    PlaylistCardComponent,
    PillListComponent,
    InfiniteScrollDirective,
    NgTemplateOutlet,
    TextIconButtonComponent,
  ],
  templateUrl: './playlists.component.html',
  styleUrl: './playlists.component.scss',
})
export class PlaylistsComponent
  extends BaseWithSandBoxComponent
  implements OnDestroy
{
  protected readonly store = inject(PlaylistsStore);
  protected readonly auth = inject(Auth);
  protected readonly playlistCategories = signal<IVideoCategory[]>([
    { id: 'playlists', title: 'Playlists' },
    { id: 'music', title: 'Music' },
    { id: 'mixes', title: 'Mixes' },
    { id: 'courses', title: 'Courses' },
    { id: 'owned', title: 'Owned' },
    { id: 'saved', title: 'Saved' },
  ]);
  private readonly heading =
    viewChild.required<ElementRef<HTMLHeadingElement>>('heading');

  constructor() {
    super();
    inject(Title).setTitle('Playlists - Angular Youtube');
    inject(SidebarService).setSelectedIconName('playlists');
    afterNextRender(() =>
      this.heading().nativeElement.focus({ preventScroll: true }),
    );
    effect(() => {
      const accessToken = this.auth.accessToken();
      untracked(() => {
        this.sandbox.dispatchEvent(playlistsEventGroup.reset());
        if (accessToken) {
          this.dispatchEvent(playlistsEventGroup.load({}));
        }
      });
    });
  }

  ngOnDestroy(): void {
    this.sandbox.dispatchEvent(playlistsEventGroup.reset());
  }

  protected onScrollDown(): void {
    const pageToken = this.store.nextPageToken();
    if (!this.auth.isLoggedIn() || !pageToken) {
      return;
    }
    this.dispatchEvent(
      playlistsEventGroup.load({
        pageToken,
      }),
    );
  }

  protected openPlaylist(playlistId: string): void {
    if (!this.auth.isLoggedIn()) {
      return;
    }
    this.dispatchEvent(playlistsEventGroup.open({ playlistId }));
  }
}
