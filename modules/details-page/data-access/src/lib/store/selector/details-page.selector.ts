import { toObservable, ToObservableOptions } from '@angular/core/rxjs-interop';
import { signalStoreFeature, type, withProps } from '@ngrx/signals';
import { map } from 'rxjs';
import { IDetailsPageState } from '../reducers/details-page.reducer';

export function withDetailsPageSelectors() {
  return signalStoreFeature(
    { state: type<IDetailsPageState>() },
    withProps(({ nestedVideoCommentsInfo }) => ({
      getNestedVideoCommentsInfoByCommentId$: (
        commentId: string,
        options: ToObservableOptions,
      ) =>
        toObservable(nestedVideoCommentsInfo, options).pipe(
          map(
            (nestedVideoCommentsInfo) =>
              nestedVideoCommentsInfo[commentId] ?? undefined,
          ),
        ),
    })),
  );
}
