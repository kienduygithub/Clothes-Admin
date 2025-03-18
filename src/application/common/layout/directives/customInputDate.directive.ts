import { ContentChild, Directive, ElementRef, HostListener, OnInit, Renderer2 } from '@angular/core';
import { NbDatepickerDirective } from '@nebular/theme';
import { parse, format, isValid } from 'date-fns';

@Directive({
  selector: '[appCustomDateInput]',
  standalone: true
})
export class CustomDateInputDirective implements OnInit {
  private currentValue: string = '';
  private cursorPosition: number = 0;
  private readonly DATE_FORMAT = 'dd/MM/yyyy';
  private get inputElement(): HTMLInputElement {
    // Đảm bảo phần tử là HTMLInputElement
    return this.el.nativeElement as HTMLInputElement;
  }

  constructor(
    private el: ElementRef<HTMLInputElement>, // Chỉ định rõ type là HTMLInputElement
    private renderer: Renderer2,
  ) { }

  ngOnInit() {
    if (this.inputElement) {
      this.inputElement.addEventListener('focus', () => {
        if (this.inputElement.value === this.DATE_FORMAT) {
          this.safelySetSelection(this.inputElement, 0, 2);
        }
      });

    }
  }

  // Phương thức an toàn để set selection range
  private safelySetSelection(input: HTMLInputElement, start: number, end: number) {
    try {
      if (input && typeof input.setSelectionRange === 'function') {
        input.setSelectionRange(start, end);
      }
    } catch (error) {
      console.warn('Không thể set selection range:', error);
    }
  }

  @HostListener('input', ['$event'])
  onInput(event: InputEvent) {
    const input = event.target as HTMLInputElement;
    let value = input.value;

    this.cursorPosition = input.selectionStart || 0;

    if (value === this.DATE_FORMAT) {
      value = '';
    }
    if (value.length > 10) {
      this.renderer.setProperty(input, 'value', this.currentValue);
      this.safelySetSelection(input, this.cursorPosition, this.cursorPosition);
      return;
    }

    if (event.data === '/') {
      if (value.length > 1 && value[value.length - 1] === '/' && value[value.length - 2] === '/') {
        value = value.substring(0, value.length - 1);
      } else {
        const parts = value.split('/');
        if (parts[0]?.length === 1) {
          value = `0${parts[0]}/`;
        } else if (parts[1]?.length === 1) {
          value = `${parts[0]}/0${parts[1]}/`;
        }
      }
    } else {
      value = this.formatDateWithNumbers(value);
    }

    this.currentValue = value;
    this.renderer.setProperty(input, 'value', value);


    if (event.type === 'click' && input.selectionStart === input.selectionEnd) {
      this.selectAppropriateSection(input, value);
    }

  }

  private selectAppropriateSection(input: HTMLInputElement, value: string) {
    const parts = value.split('/');

    if (parts[0]?.length < 2 || (parts[0]?.length === 2 && !parts[1])) {
      this.safelySetSelection(input, 0, 2);
    } else if (!parts[2] && (parts[1]?.length < 2 || (parts[1]?.length === 2 && !parts[2]))) {
      this.safelySetSelection(input, 3, 5);
    } else if (parts[2]) {
      this.safelySetSelection(input, 6, 10);
    }
  }

  @HostListener('keydown', ['$event'])
  onKeyDown(event: KeyboardEvent) {
    const input = event.target as HTMLInputElement;
    const value = input.value;
    const cursorPos = input.selectionStart || 0;

    // Nếu độ dài vượt quá và không phải các phím điều hướng
    if (input.selectionStart === input.selectionEnd && value.length >= 10 &&
        !['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'Tab'].includes(event.key)) {
      event.preventDefault();
      return;
    }

    // Xử lý phím Backspace
    if (event.key === 'Backspace') {
      // Nếu có đoạn text được chọn, để mặc định xử lý
      if (input.selectionStart !== input.selectionEnd) {
        return;
      }

      event.preventDefault();
      // Xử lý các trường hợp đặc biệt với dấu "/"
      if (value[cursorPos - 1] === '/') {
        const newValue = value.slice(0, cursorPos - 2) + value.slice(cursorPos);
        this.renderer.setProperty(input, 'value', newValue);
        this.safelySetSelection(input, cursorPos - 2, cursorPos - 2);
      } else {
        // Xử lý trường hợp bình thường (xóa 1 ký tự)
        const newValue = value.slice(0, cursorPos - 1) + value.slice(cursorPos);
        this.renderer.setProperty(input, 'value', newValue);
        this.safelySetSelection(input, cursorPos - 1, cursorPos - 1);
      }
      this.currentValue = input.value;
    }
  }


  private formatDateWithNumbers(value: string): string {
    value = value.replace(/[^\d/]/g, '');

    const parts = value.split('/');
    let formatted = '';

    // Xử lý phần ngày
    if (parts[0]) {
      if (parts[0].length === 1) {
        formatted = parts[0];
      } else {
        // Đảm bảo ngày không vượt quá 31
        let day = parseInt(parts[0]);
        if (day > 31) day = 31;
        formatted = day.toString().padStart(2, '0');
      }
    }

    // Xử lý phần tháng
    if (parts[1]) {
      if (parts[1].length === 1) {
        formatted += `/${parts[1]}`;
      } else {
        // Đảm bảo tháng không vượt quá 12
        let month = parseInt(parts[1]);
        if (month > 12) month = 12;
        formatted += `/${month.toString().padStart(2, '0')}`;
      }
    } else if (formatted.length === 2) {
      formatted += '/';
    }

    // Xử lý phần năm
    if (parts[2]) {
      formatted += `/${parts[2].substring(0, 4)}`;
    } else if (parts[1] && parts[1].length === 2) {
      formatted += '/';
    }

    return formatted;
  }
}
