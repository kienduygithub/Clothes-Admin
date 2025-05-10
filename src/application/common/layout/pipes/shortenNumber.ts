import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'shortenNumber',
    standalone: true
})
export class ShortenNumberPipe implements PipeTransform {
    transform(value: number | string, args?: any): string {
        const num = typeof value === 'string' ? parseFloat(value) : value;

        if (isNaN(num) || num === 0) return '0';

        const absNum = Math.abs(num);
        let result: string;

        if (absNum >= 1000000) {
            result = (num / 1000000).toFixed(1).replace(/\.0$/, '') + 'M';
        } else if (absNum >= 1000) {
            result = (num / 1000).toFixed(1).replace(/\.0$/, '') + 'k';
        } else {
            result = num.toString();
        }

        return result;
    }
}