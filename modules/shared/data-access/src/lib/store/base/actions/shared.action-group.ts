import { emptyProps } from '@ngrx/store';
import { createAyActionGroup } from '../../base/actions/base.action-group';

export const sharedActionGroup = createAyActionGroup({
  source: 'Common',
  events: {
    empty: emptyProps(),
  },
});
