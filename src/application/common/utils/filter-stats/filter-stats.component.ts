import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { Option } from "../../resource/option.interface";
import { ImageResource } from "../../resource/image_resource";
import { NbDatepickerModule, NbDateService } from "@nebular/theme";
import { TranslateModule } from "@ngx-translate/core";
import { CommonModule } from "@angular/common";
import { DefaultMatCalendarRangeStrategy, MatDatepicker, MatRangeDateSelectionModel } from "@angular/material/datepicker";
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from "@angular/material/core";
import { MomentDateAdapter } from "@angular/material-moment-adapter";
import _moment from 'moment';
import { FormControl, ReactiveFormsModule } from "@angular/forms";

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

const ANGULAR_MODULES = [
    CommonModule,
    TranslateModule,
    ReactiveFormsModule
]

const MAT_MODULES = [
    NbDatepickerModule,
]

const PROVIDERS = [
    DefaultMatCalendarRangeStrategy,
    MatRangeDateSelectionModel,
    {
        provide: DateAdapter,
        useClass: MomentDateAdapter,
        deps: [MAT_DATE_LOCALE],
    },
    { provide: MAT_DATE_FORMATS, useValue: MY_DATE_FORMAT },
]

@Component({
    standalone: true,
    selector: 'filter-stats-component',
    templateUrl: 'filter-stats.component.html',
    styleUrl: 'filter-stats.component.scss',
    imports: [
        ...ANGULAR_MODULES,
        ...MAT_MODULES
    ],
    providers: []
})

export class FilterStatsComponent implements OnInit {
    max: Date;
    calendar_icon = ImageResource.icon_calendar_v2;
    selectedCriterial: string = 'ALL';
    CriteriaOptions: Option[] = [
        { label: 'Tất cả', value: 'ALL' },
        { label: 'Ngày', value: 'DAY' },
        { label: 'Tháng', value: 'MONTH' },
        { label: 'Năm', value: 'YEAR' }
    ];

    months: Option[] = [
        { label: 'Tháng 1', value: '1' },
        { label: 'Tháng 2', value: '2' },
        { label: 'Tháng 3', value: '3' },
        { label: 'Tháng 4', value: '4' },
        { label: 'Tháng 5', value: '5' },
        { label: 'Tháng 6', value: '6' },
        { label: 'Tháng 7', value: '7' },
        { label: 'Tháng 8', value: '8' },
        { label: 'Tháng 9', value: '9' },
        { label: 'Tháng 10', value: '10' },
        { label: 'Tháng 11', value: '11' },
        { label: 'Tháng 12', value: '12' }
    ];

    years: Option[] = Array.from({ length: 11 }, (_, i) => ({
        label: `Năm ${2020 + i}`,
        value: `${2020 + i}`
    }));

    selectedMonth: string = '';
    selectedYear: string = '';
    time = new FormControl();
    @ViewChild('picker') datepicker!: ElementRef<MatDatepicker<any>>; /** Chưa dùng tới **/

    constructor(
        private dateService: NbDateService<Date>
    ) {
        this.max = this.dateService.today();
    }

    ngOnInit(): void {
        const currentMonth = new Date().getMonth() + 1;
        const currentYear = new Date().getFullYear();
        this.selectedMonth = currentMonth.toString();
        this.selectedYear = currentYear.toString();

        // if (this.formControl?.value !== '') {
        //     this.time.setValue(_moment(`${this.formControl?.value}`, "DD/MM/YYYY"));
        // }
    }

    onSelectCriteria(criterial: string) {
        this.selectedCriterial = criterial;
        if (criterial === 'MONTH') {
            const currentMonth = new Date().getMonth() + 1;
            this.selectedMonth = currentMonth.toString();
        } else {
            this.selectedMonth = '';
        }
        if (criterial === 'YEAR') {
            const currentYear = new Date().getFullYear();
            this.selectedYear = currentYear.toString();
        } else {
            this.selectedYear = '';
        }
    }

    onSelectMonth(month: string) {
        this.selectedMonth = month;
    }

    onSelectYear(year: string) {
        this.selectedYear = year;
    }
}