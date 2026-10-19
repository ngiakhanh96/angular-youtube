const VerticalProps = {
  clientHeight: 'clientHeight',
  offsetHeight: 'offsetHeight',
  scrollHeight: 'scrollHeight',
  pageYOffset: 'pageYOffset',
  scrollTop: 'scrollTop',
  top: 'top',
} as const;

const HorizontalProps = {
  clientHeight: 'clientWidth',
  offsetHeight: 'offsetWidth',
  scrollHeight: 'scrollWidth',
  pageYOffset: 'pageXOffset',
  scrollTop: 'scrollLeft',
  top: 'left',
} as const;

export class AxisResolver {
  private readonly propsMap: typeof VerticalProps | typeof HorizontalProps;

  constructor(vertical = true) {
    this.propsMap = vertical ? VerticalProps : HorizontalProps;
  }

  clientHeightKey() {
    return this.propsMap.clientHeight;
  }
  offsetHeightKey() {
    return this.propsMap.offsetHeight;
  }
  scrollHeightKey() {
    return this.propsMap.scrollHeight;
  }
  pageYOffsetKey() {
    return this.propsMap.pageYOffset;
  }
  scrollTopKey() {
    return this.propsMap.scrollTop;
  }
  topKey() {
    return this.propsMap.top;
  }
}
