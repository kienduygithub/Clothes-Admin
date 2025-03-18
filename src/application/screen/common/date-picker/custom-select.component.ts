import { CommonModule } from '@angular/common';
import { Component, ElementRef, EventEmitter, Input, OnInit, Output, Renderer2 } from '@angular/core';
import { NbAutocompleteModule, NbCardModule, NbCheckboxModule, NbDatepickerComponent, NbDatepickerModule, NbDateService, NbIconComponent, NbIconModule, NbInputModule, NbTimepickerModule } from '@nebular/theme';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NbDateFnsDateModule } from '@nebular/date-fns';
import { CustomDateInputDirective } from '../../../common/layout/directives/customInputDate.directive';
import { DefaultMatCalendarRangeStrategy, MatDatepickerModule, MatRangeDateSelectionModel } from '@angular/material/datepicker';
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
export class DatePickerComponent implements OnInit {


  @Input() group!: FormGroup
  @Input() controlName!: string
  @Input() options: { label: string, value: string }[] = []
  @Input() selectPlaceholder: string = ''
  @Input() inputPlaceholder: string = ''
  @Input() invalid = false;

  @Input() inputDate: string = '';
  @Input() border: boolean = true;
  @Input() isEdit = true
  @Output() valueChange = new EventEmitter();
  @Output() isDirty = new EventEmitter();
  date: string = '';
  today = new Date();
  time = new FormControl();

  constructor(
    private elementRef: ElementRef,
    private renderer: Renderer2,
    private dateService: NbDateService<Date>,
  ) { }

  ngOnInit(): void {
  }

  getDate(time: any) {
    let month = time.getMonth() + 1;
    let date = time.getDate();
    if (month < 10) {
      month = '0' + month;
    }
    if (date < 10) {
      date = '0' + date;
    }
    this.date = date + '/' + month + '/' + time.getFullYear();
    this.valueChange.emit(this.date);
    this.isDirty.emit(true);
  }

}
