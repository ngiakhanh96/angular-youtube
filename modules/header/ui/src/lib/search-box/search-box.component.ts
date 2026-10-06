import {
  ISection,
  ISectionItem,
  MenuComponent,
  OverlayDirective,
  TextIconButtonComponent,
} from '@angular-youtube/shared-ui';
import { OverlayModule } from '@angular/cdk/overlay';

import {
  afterNextRender,
  Component,
  computed,
  debounced,
  DestroyRef,
  DOCUMENT,
  effect,
  ElementRef,
  inject,
  input,
  linkedSignal,
  output,
  signal,
  untracked,
  viewChild,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { form, FormField, required } from '@angular/forms/signals';
import { NavigationEnd, Router, Event as RouterEvent } from '@angular/router';
import { filter, map } from 'rxjs';

@Component({
  selector: 'ay-search-box',
  templateUrl: './search-box.component.html',
  styleUrls: ['./search-box.component.scss'],
  imports: [
    FormField,
    OverlayDirective,
    OverlayModule,
    MenuComponent,
    TextIconButtonComponent,
  ],
  host: {
    '[style.--search-icon-legacy-bg-color]':
      'searchIconLegacyBackgroundColor()',
    '[style.--search-box-container-padding-left]':
      'searchBoxContainerPaddingLeft()',
  },
})
export class SearchBoxComponent {
  searchIconLegacyBackgroundColor = signal('rgb(248, 248, 248)');
  inputElement = viewChild.required<ElementRef>('input');
  shouldOpenSuggestionDropdown = signal(false);
  searchBoxContainerPaddingLeftPx = signal(16);
  searchBoxContainerPaddingLeft = computed(
    () => `${this.searchBoxContainerPaddingLeftPx()}px`,
  );
  suggestionTexts = input<string[]>([]);
  suggestions = linkedSignal<ISection[]>(() => {
    const sectionItems: ISectionItem[] = this.suggestionTexts().map((v) => ({
      iconName: 'search',
      displayHtml: this.highlightSearchText(
        v,
        this.form.searchQuery().value(),
      ),
    }));
    return [{ sectionItems }];
  });
  isOpenedSuggestionDropdown = linkedSignal(() => {
    const shouldOpenSuggestionDropdown = this.shouldOpenSuggestionDropdown();
    const hasSuggestion = this.suggestions()[0]?.sectionItems.length > 0;
    return shouldOpenSuggestionDropdown && hasSuggestion;
  });
  selectedText = signal<string | null>(null);
  searchQueryChange = output<string>();

  private router = inject(Router);
  private destroyRef = inject(DestroyRef);
  private document = inject(DOCUMENT);

  private readonly searchModel = signal({ searchQuery: '' });
  readonly form = form(this.searchModel, (path) => {
    required(path.searchQuery);
  });
  private readonly debouncedSearchQuery = debounced(
    () =>
      this.form.searchQuery().dirty()
        ? this.form.searchQuery().value()
        : '',
    300,
  );

  constructor() {
    const tmp = this.document.createElement('DIV');
    effect(() => {
      const selectedText = this.selectedText();
      if (selectedText === null) return;

      tmp.innerHTML = selectedText;
      untracked(() => {
        this.form.searchQuery().reset(tmp.textContent ?? '');
        this.search();
      });
    });

    afterNextRender({
      read: () => {
        this.router.events
          .pipe(
            filter(
              (event: RouterEvent) =>
                event instanceof NavigationEnd ||
                (event as { routerEvent?: NavigationEnd })
                  .routerEvent instanceof NavigationEnd,
            ),
            map((event: RouterEvent) =>
              event instanceof NavigationEnd
                ? event
                : (event as { routerEvent: NavigationEnd }).routerEvent,
            ),
            takeUntilDestroyed(this.destroyRef),
          )
          .subscribe((event: NavigationEnd) => {
            this.shouldOpenSuggestionDropdown.set(false);
            const url = new URL(event.url, this.document.baseURI);
            if (url.pathname.includes('results')) {
              this.form.searchQuery().reset(
                url.searchParams.get('search_query') ?? '',
              );
            } else {
              this.form.searchQuery().reset();
            }
          });
      },
    });
    effect(() => {
      const value = this.debouncedSearchQuery.value().trim();

      untracked(() => {
        if (!value || !this.form.searchQuery().dirty()) {
          this.shouldOpenSuggestionDropdown.set(false);
          return;
        }

        this.searchQueryChange.emit(value);
        this.suggestions.set([]);
        this.shouldOpenSuggestionDropdown.set(true);
      });
    });
  }

  onSubmit(event: Event) {
    event.preventDefault();
    this.search();
  }

  search() {
    if (this.form().valid()) {
      this.shouldOpenSuggestionDropdown.set(false);
      this.form.searchQuery().reset();
      this.router.navigate(['results'], {
        queryParams: {
          search_query: this.form.searchQuery().value(),
        },
      });
    }
  }

  onMouseEnter() {
    this.searchIconLegacyBackgroundColor.set('rgb(240, 240, 240)');
  }

  onMouseLeave() {
    this.searchIconLegacyBackgroundColor.set('rgb(248, 248, 248)');
  }

  onClear(event: Event) {
    event.preventDefault();
    this.form().reset({ searchQuery: '' });
    this.shouldOpenSuggestionDropdown.set(false);
    this.inputElement().nativeElement.focus();
  }

  private highlightSearchText(text: string, searchQuery?: string): string {
    if (!searchQuery) {
      return text;
    }
    const index = text.toLowerCase().indexOf(searchQuery.toLowerCase());
    if (index === -1) return text;

    const before = text.slice(0, index);
    const match = text.slice(index, index + searchQuery.length);
    const after = text.slice(index + searchQuery.length);

    return `${before}<b>${match}</b>${after}`;
  }
}
