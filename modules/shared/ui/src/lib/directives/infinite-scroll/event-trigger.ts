import { IPositionStats } from './scroll-state.model';

export interface IScrollerProps extends IDistanceRange {
  container: IPositionStats;
  alwaysCallback: boolean;
  disabled: boolean;
}

export interface ITriggerEvents {
  down: (event: any) => any;
  up: (event: any) => any;
}

export interface IDistanceRange {
  down: number;
  up: number;
}

export interface IScrollConfig {
  alwaysCallback: boolean;
  shouldFireScrollEvent: boolean;
}

export function shouldTriggerEvents(
  alwaysCallback: boolean,
  shouldFireScrollEvent: boolean,
  isTriggeredCurrentTotal: boolean,
) {
  if (alwaysCallback && shouldFireScrollEvent) {
    return true;
  }
  if (!isTriggeredCurrentTotal && shouldFireScrollEvent) {
    return true;
  }
  return false;
}
