import { createAyActionGroup } from '@angular-youtube/shared-data-access';
import { props } from '@ngrx/store';

export const commonActions = createAyActionGroup({
  source: 'Shared',
  events: {
    signIn: props<{ test: string }>(),
  },
});
