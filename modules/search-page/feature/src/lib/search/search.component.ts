import { BaseWithSandBoxComponent } from '@angular-youtube/shared-data-access';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'ay-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss'],
  imports: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SearchComponent
  extends BaseWithSandBoxComponent
  implements OnInit
{
  private route = inject(ActivatedRoute);
  private searchQuery = signal<string | null>(null);

  ngOnInit(): void {
    this.route.queryParamMap.subscribe((params) => {
      this.searchQuery.set(params.get('search_query'));
    });
  }
}
