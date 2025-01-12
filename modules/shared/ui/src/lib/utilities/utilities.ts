export class Utilities {
  static secondsInOneMinute = 60;
  static secondsInOneHour = Utilities.secondsInOneMinute * 60;
  static secondsInOneDay = Utilities.secondsInOneHour * 24;
  static secondsInOneMonth = Utilities.secondsInOneDay * 30;
  static secondsInOneYear = Utilities.secondsInOneMonth * 12;
  static timeIntervals = [
    { unit: 'second', value: 1 },
    { unit: 'minute', value: Utilities.secondsInOneMinute },
    { unit: 'hour', value: Utilities.secondsInOneHour },
    { unit: 'day', value: Utilities.secondsInOneDay },
    { unit: 'month', value: Utilities.secondsInOneMonth },
    { unit: 'year', value: Utilities.secondsInOneYear },
    { unit: 'more than year', value: Infinity },
  ];
  static numberUnits = ['K', 'M', 'B', 'T'];
  static months = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ];
  static hoursInIntervals = [24 * 365, 24 * 7, 24, 1];

  static numberToString(
    number: number,
    suffix?: string,
    zeroPresentation?: string,
  ) {
    let resultString = '';
    if (number === 0 && zeroPresentation) {
      resultString += `${zeroPresentation}`;
    } else if (number < 1000) {
      resultString = `${number}`;
    } else {
      let unitIndex = -1;
      let roundedViewCountToOneDecimalPoint = number;
      while (
        roundedViewCountToOneDecimalPoint >= 1000 &&
        unitIndex < Utilities.numberUnits.length - 1
      ) {
        roundedViewCountToOneDecimalPoint /= 1000;
        unitIndex++;
      }
      roundedViewCountToOneDecimalPoint =
        Math.floor(roundedViewCountToOneDecimalPoint * 10) / 10;
      if (roundedViewCountToOneDecimalPoint >= 10) {
        roundedViewCountToOneDecimalPoint = Math.floor(
          roundedViewCountToOneDecimalPoint,
        );
      }
      resultString = `${roundedViewCountToOneDecimalPoint}${Utilities.numberUnits[unitIndex]}`;
    }
    if (suffix) {
      resultString += ` ${suffix}`;
      if (number > 1) {
        resultString += 's';
      }
    }

    return resultString;
  }

  static epochToDate(epoch: number): Date {
    // Multiply by 1000 to convert seconds to milliseconds
    return new Date(epoch * 1000);
  }

  static dateToString(date: Date): string {
    const month = Utilities.months[date.getMonth()];
    const day = date.getDate();
    const year = date.getFullYear();

    return `${month} ${day}, ${year}`;
  }

  static numberToStringWithCommas(number: number): string {
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  }

  static publishedDateToString(date: Date) {
    let publishDateString = '';
    const dateDiffInSeconds = Math.floor(
      (new Date().getTime() - date.getTime()) / 1000,
    );
    let dateDiffNumber = 0;

    for (let i = 0; i < Utilities.timeIntervals.length; i++) {
      if (dateDiffInSeconds < Utilities.timeIntervals[i].value) {
        const dateDiff = Math.floor(
          dateDiffInSeconds / Utilities.timeIntervals[i - 1].value,
        );
        publishDateString += `${dateDiff} ${Utilities.timeIntervals[i - 1].unit}`;
        dateDiffNumber = dateDiff;
        break;
      }
    }

    if (dateDiffNumber > 1) {
      publishDateString += 's';
    }

    publishDateString += ' ago';
    return publishDateString;
  }

  static durationToString(duration: string) {
    let durationString = '';
    const matches = duration.match(
      /P(\d+Y)?(\d+W)?(\d+D)?T(\d+H)?(\d+M)?(\d+S)?/,
    );
    if (!matches) {
      return durationString;
    }

    let durationArrIndex = 0;
    let hours = 0;
    matches
      .slice(1)
      .map((_) => (_ ? parseInt(_.replace(/\D/, '')) : 0))
      .forEach((amount, index) => {
        if (index <= matches.length - 2 - 2) {
          hours += amount * Utilities.hoursInIntervals[durationArrIndex++];
          if (index === matches.length - 2 - 2 && hours > 0) {
            durationString += `${hours}`;
          }
        } else {
          if (durationString !== '') {
            durationString += ':';
          }
          if (index === matches.length - 2 - 1 && durationString === '') {
            durationString += `${amount}`;
          } else {
            durationString += `${amount < 10 ? `0${amount}` : amount}`;
          }
        }
      });

    return durationString;
  }
}
