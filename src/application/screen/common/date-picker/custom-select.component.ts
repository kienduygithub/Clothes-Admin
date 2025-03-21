import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, ElementRef, EventEmitter, Input, OnInit, Output, Renderer2, ViewChild } from '@angular/core';
import { NbAutocompleteModule, NbCardModule, NbCheckboxModule, NbDatepickerComponent, NbDatepickerModule, NbDateService, NbIconComponent, NbIconModule, NbInputModule, NbTimepickerModule } from '@nebular/theme';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NbDateFnsDateModule } from '@nebular/date-fns';
import { CustomDateInputDirective } from '../../../common/layout/directives/customInputDate.directive';
import { DefaultMatCalendarRangeStrategy, MatDatepicker, MatDatepickerModule, MatRangeDateSelectionModel } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MAT_DATE_FORMATS, MAT_DATE_LOCALE, provideNativeDateAdapter } from '@angular/material/core';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter } from '@angular/material/core';

const MY_DATE_FORMAT = {
  parse: {
    dateInput: 'DD/MM/YYYY', // this is how your date will be parsed from Input
  },
  display: {
    dateInput: 'DD/MM/YYYY', // this is how your date will get displayed on the Input
    monthYearLabel: 'MM/YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MM/YYYY',
  },
};

@Component({
  selector: 'app-datepicker',
  standalone: true,
  imports: [
    CommonModule,
    NbInputModule,
    NbCheckboxModule,
    ReactiveFormsModule,
    FormsModule,
    NbDatepickerModule,
    NbTimepickerModule,
    NbCardModule,
    NbIconModule,
    NbAutocompleteModule,
    NbDateFnsDateModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatInputModule
  ],
  templateUrl: './custom-select.component.html',
  styleUrl: './custom-select.component.scss',
  providers: [
    DefaultMatCalendarRangeStrategy,
    MatRangeDateSelectionModel,
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE],
    },
    { provide: MAT_DATE_FORMATS, useValue: MY_DATE_FORMAT },
  ]
})
export class DatePickerComponent implements OnInit, AfterViewInit {

  @Input() group!: FormGroup
  @Input() controlName!: string
  @Input() options: { label: string, value: string }[] = []
  @Input() selectPlaceholder: string = ''
  @Input() inputPlaceholder: string = ''
  @Input() invalid = false;

  @Input() inputDate: string = '';
  @Input() border: boolean = true;
  @Input() isEdit = true;
  @Input() isDisableForm = false;
  @Output() valueChange = new EventEmitter();
  @Output() isDirty = new EventEmitter();
  date: string = '';
  today = new Date();
  time = new FormControl();

  @ViewChild('picker') datepicker!: ElementRef<MatDatepicker<any>>;

  constructor(
    private elementRef: ElementRef,
    private renderer: Renderer2,
    private dateService: NbDateService<Date>,
  ) { }

  ngOnInit(): void {
    // this.time.setValue((new Date().getTime() - 3888000000));
    // this.date = this.formControl?.value ?? '';
  }

  ngAfterViewInit() {
    // this.datepicker.nativeElement.select('20/02/2022');

  }

  get formControl() {
    return this.controlName ? this.group.get(this.controlName) : null;
  }

  getDate(time: any) {
    console.log(time)
    if (time === '') {
      this.formControl?.setValue('');
      this.formControl?.markAsDirty();
      this.formControl?.updateValueAndValidity();
      return;
    }

    if (!time) {
      this.formControl?.markAsDirty();
      this.formControl?.setErrors({ invalidDate: true });
      return;
    }

    if (!/^(0[1-9]|[12]\d|3[01])\/(0[1-9]|1[0-2])\/\d{4}$/.test(time)) {
      this.formControl?.setValue(time);
      this.formControl?.markAsDirty();
      this.formControl?.setErrors({ invalidDate: true });
      return;
    }

    let timeSplit = time.split('/');

    let day = timeSplit[0];
    let month = timeSplit[1];
    let year = timeSplit[2];

    if (+month < 10) {
      month = '0' + (+month);
    }
    if (+day < 10) {
      day = '0' + (+day);
    }

    this.date = day + '/' + month + '/' + year;
    this.formControl?.setValue(this.date);
    this.formControl?.setErrors(null);
    this.formControl?.markAsDirty();
    this.formControl?.updateValueAndValidity();
  }
}
