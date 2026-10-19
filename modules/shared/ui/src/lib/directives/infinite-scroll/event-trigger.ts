export function shouldTriggerEvents(
  alwaysCallback: boolean,
  shouldFireScrollEvent: boolean,
  isTriggeredCurrentTotal: boolean,
) {
  return shouldFireScrollEvent && (alwaysCallback || !isTriggeredCurrentTotal);
}
