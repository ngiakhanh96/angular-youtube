import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'count' })
export class CountPipe implements PipeTransform {
  transform(value: number): unknown[] {
    return value <= 0
      ? []
      : Array(value)
          .fill(0)
          .map((x, i) => i);
  }
}
