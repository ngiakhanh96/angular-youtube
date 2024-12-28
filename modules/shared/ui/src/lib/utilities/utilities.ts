export class Utilities {
  static numberToString(
    number: number,
    suffix?: string,
    zeroPresentation?: string,
  ) {
    let resultString = '';
    if (number === 0 && zeroPresentation) {
      resultString += `${zeroPresentation}`;
    } else if (number <= 1000) {
      resultString = `${number}`;
    } else if (number <= 1000000) {
      let roundedViewCountToOneDecimalPoint =
        Math.floor((number / 1000) * 10) / 10;
      if (roundedViewCountToOneDecimalPoint >= 10) {
        roundedViewCountToOneDecimalPoint = Math.floor(
          roundedViewCountToOneDecimalPoint,
        );
      }
      resultString = `${roundedViewCountToOneDecimalPoint}K`;
    } else if (number <= 1000000000) {
      let roundedViewCountToOneDecimalPoint =
        Math.floor((number / 1000000) * 10) / 10;
      if (roundedViewCountToOneDecimalPoint >= 10) {
        roundedViewCountToOneDecimalPoint = Math.floor(
          roundedViewCountToOneDecimalPoint,
        );
      }
      resultString = `${roundedViewCountToOneDecimalPoint}M`;
    } else if (number <= 1000000000000) {
      let roundedViewCountToOneDecimalPoint =
        Math.floor((number / 1000000000) * 10) / 10;
      if (roundedViewCountToOneDecimalPoint >= 10) {
        roundedViewCountToOneDecimalPoint = Math.floor(
          roundedViewCountToOneDecimalPoint,
        );
      }
      resultString = `${roundedViewCountToOneDecimalPoint}B`;
    } else {
      let roundedViewCountToOneDecimalPoint =
        Math.floor((number / 1000000000000) * 10) / 10;
      if (roundedViewCountToOneDecimalPoint >= 10) {
        roundedViewCountToOneDecimalPoint = Math.floor(
          roundedViewCountToOneDecimalPoint,
        );
      }
      resultString = `${roundedViewCountToOneDecimalPoint}T`;
    }
    if (suffix) {
      resultString += ` ${suffix}`;
      if (number > 1) {
        resultString += 's';
      }
    }

    return resultString;
  }
}
