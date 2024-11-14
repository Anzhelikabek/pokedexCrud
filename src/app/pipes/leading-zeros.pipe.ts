import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'leadingZeros',
  standalone: true
})
export class LeadingZerosPipe implements PipeTransform {
  transform(value: number | string, length: number = 3): string {
    const strValue = value.toString();
    return '#' + strValue.padStart(length, '0');
  }
}
