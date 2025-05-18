import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
    standalone: true,
    name: 'CurrencyPipe'
})

export class CurrencyPipe implements PipeTransform {
    transform(value: string): string {
        return parseFloat(value).toLocaleString('vi-VN');
    }
}