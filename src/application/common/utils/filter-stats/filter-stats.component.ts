import { Component, ElementRef, HostListener, OnInit, ViewChild } from "@angular/core";
import { ImageResource } from "../../resource/image_resource";
import { NbDatepickerModule, NbDateService } from "@nebular/theme";
import { TranslateModule } from "@ngx-translate/core";
import { CommonModule } from "@angular/common";
import { DefaultMatCalendarRangeStrategy, MatDatepicker, MatRangeDateSelectionModel } from "@angular/material/datepicker";
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from "@angular/material/core";
import { MomentDateAdapter } from "@angular/material-moment-adapter";
import _moment from 'moment';
import { FormControl, ReactiveFormsModule } from "@angular/forms";
import { GetLabelPipe } from "../../layout/pipes/getLabel";

export interface Option {
    label: string;
    value: string;
    range?: string;
}

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

const PIPES = [
    GetLabelPipe
]

@Component({
    standalone: true,
    selector: 'filter-stats-component',
    templateUrl: 'filter-stats.component.html',
    styleUrl: 'filter-stats.component.scss',
    imports: [
        ...ANGULAR_MODULES,
        ...MAT_MODULES,
        ...PIPES
    ],
    providers: [...PROVIDERS]
})

export class FilterStatsComponent implements OnInit {
    calendar_icon = ImageResource.icon_calendar_v2;
    icon_dropdown_arrow_left = ImageResource.icon_dropdown_arrow_left;

    max: Date;
    selectedCriterial: string = 'WEEK';
    CriteriaOptions: Option[] = [
        { label: 'Tất cả', value: 'ALL' },
        { label: 'Ngày', value: 'DAY' },
        { label: 'Tuần', value: 'WEEK' },
        { label: 'Tháng', value: 'MONTH' },
        { label: 'Năm', value: 'YEAR' }
    ];

    months: Option[] = Array.from({ length: 12 }, (_, i) => ({
        label: `Tháng ${i + 1}`,
        value: `${i + 1}`
    }));

    years: Option[] = Array.from({ length: 8 }, (_, i) => ({
        label: `Năm ${2018 + i}`,
        value: `${2018 + i}`
    }));

    weeks: Option[] = [];

    selectedMonth: string = '';
    selectedYear: string = '';
    selectedWeek: string = '';
    weekRange: string = ''; /** Lưu trữ range của tuần **/
    selectedStartDay: Date | null = null;
    selectedEndDay: Date | null = null;
    weekMonth: string = '';
    weekYear: string = '';
    maxDate: Date = new Date();
    time = new FormControl();
    @ViewChild('picker') datepicker!: ElementRef<MatDatepicker<any>>; /** Chưa dùng tới **/

    openDropdown: string | null = null; /** Lưu ID của dropdown đang mở **/

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
        this.weekMonth = currentMonth.toString();
        this.weekYear = currentYear.toString();
        this.selectedStartDay = new Date(currentYear, currentMonth - 1, 1);
        this.selectedEndDay = new Date();
        this.updateWeeks(currentMonth, currentYear);
        this.selectedWeek = this.getWeekNumber(new Date()).toString();
        this.weekRange = this.weeks.find(w => w.value === this.selectedWeek)?.range || 'Range';
        // if (this.formControl?.value !== '') {
        //     this.time.setValue(_moment(`${this.formControl?.value}`, "DD/MM/YYYY"));
        // }
    }

    onSelectCriteria(value: string) {
        this.selectedCriterial = value;
        this.resetSelections();
        const currentMonth = new Date().getMonth() + 1;
        const currentYear = new Date().getFullYear();

        if (value === 'MONTH') {
            this.selectedMonth = currentMonth.toString();
            this.selectedYear = currentYear.toString();
        }

        if (value === 'YEAR') {
            this.selectedYear = currentYear.toString();
        }

        if (value === 'WEEK') {
            this.weekMonth = currentMonth.toString();
            this.weekYear = currentYear.toString();
            this.updateWeeks(currentMonth, currentYear);
            this.selectedWeek = this.getWeekNumber(new Date()).toString();
            this.weekRange = this.weeks.find(w => w.value === this.selectedWeek)?.range || 'Range';
        }

        if (value === 'DAY') {
            this.selectedStartDay = new Date(currentYear, currentMonth - 1, 1);
            this.selectedEndDay = new Date();
        }
    }

    toggleDropdown(dropdownId: string) {
        this.openDropdown = this.openDropdown === dropdownId ? null : dropdownId;
    }

    onSelectMonth(month: string) {
        this.selectedMonth = month;
        this.openDropdown = null;
    }

    onSelectYear(year: string, type: 'month' | 'week' | 'year') {
        if (type === 'month') this.selectedYear = year;
        if (type === 'week') {
            this.weekYear = year;
            this.updateWeeks(+this.weekMonth, +year);
            this.selectedWeek = this.weeks[0]?.value || '';
            this.weekRange = this.weeks.find(w => w.value === this.selectedWeek)?.range || 'Range';
        }
        if (type === 'year') this.selectedYear = year;
        this.openDropdown = null; // Đóng dropdown
    }

    onSelectWeekMonth(month: string) {
        this.weekMonth = month;
        this.updateWeeks(+month, +this.weekYear);
        this.selectedWeek = this.weeks[0]?.value || '';
        this.weekRange = this.weeks.find(w => w.value === this.selectedWeek)?.range || 'Range';
        this.openDropdown = null; // Đóng dropdown
    }

    onSelectWeek(week: string) {
        this.selectedWeek = week;
        this.weekRange = this.weeks.find(w => w.value === week)?.range || 'Range';
        this.openDropdown = null; // Đóng dropdown
    }

    onSelectDay(type: 'start' | 'end', date: Date) {
        if (type === 'start') this.selectedStartDay = date;
        if (type === 'end') this.selectedEndDay = date;
        this.validateDates();
    }

    onConfirm() {
        if (this.isValidSelection()) {
            this.updateDashboardData();
        } else {
            // this.snackBar.open('Vui lòng chọn đầy đủ các trường!', 'Đóng', {
            //     duration: 3000,
            //     verticalPosition: 'top'
            // });
        }
    }

    isValidSelection(): boolean {
        switch (this.selectedCriterial) {
            case 'DAY':
                return !!this.selectedStartDay && !!this.selectedEndDay;
            case 'WEEK':
                return !!this.weekYear && !!this.weekMonth && !!this.selectedWeek;
            case 'MONTH':
                return !!this.selectedMonth && !!this.selectedYear;
            case 'YEAR':
                return !!this.selectedYear;
            case 'ALL':
                return true;
            default:
                return false;
        }
    }

    isConfirmDisabled(): boolean {
        return !this.isValidSelection();
    }

    private validateDates() {
        if (this.selectedStartDay && this.selectedEndDay) {
            if (this.selectedEndDay < this.selectedStartDay) {
                this.selectedEndDay = this.selectedStartDay;
            }
            if (this.selectedEndDay > this.maxDate) {
                this.selectedEndDay = this.maxDate;
            }
        }
    }

    private updateWeeks(month: number, year: number) {
        this.weeks = [];
        const firstDay = new Date(year, month - 1, 1);
        const lastDay = new Date(year, month, 0);
        let weekStart = new Date(firstDay);
        let weekNumber = 1;

        while (weekStart <= lastDay) {
            const weekEnd = new Date(weekStart);
            weekEnd.setDate(weekStart.getDate() + 6);

            // Đảm bảo weekEnd không vượt quá lastDay của tháng
            if (weekEnd > lastDay) {
                weekEnd.setTime(lastDay.getTime()); // Đặt weekEnd chính xác bằng lastDay
            }

            this.weeks.push({
                label: `Tuần ${weekNumber}`,
                value: `${weekNumber}`,
                range: `${weekStart.getDate()}/${weekStart.getMonth() + 1} - ${weekEnd.getDate()}/${weekEnd.getMonth() + 1}`,
            });

            // Chuyển đến ngày đầu của tuần tiếp theo
            weekStart.setDate(weekStart.getDate() + 7);
            weekNumber++;
        }

        /**
         * Kiểm tra xem selectedWeek hiện tại có tồn tại trong danh sách
         * weeks mới không. Nếu không thì thực hiên cập nhật
         * Example: Tháng thay đổi, tuần trước không còn hợp lệ
         */
        if (!this.weeks.find(w => w.value === this.selectedWeek)) {
            this.selectedWeek = this.weeks[0]?.value || '';
            this.weekRange = this.weeks[0]?.range || 'Range';
        }
    }

    private getWeekNumber(date: Date): number {
        const d = new Date(date);
        d.setHours(0, 0, 0, 0);
        d.setDate(d.getDate() + 4 - (d.getDay() || 7));
        const yearStart = new Date(d.getFullYear(), 0, 1);
        return Math.ceil((((d.getTime() - yearStart.getTime()) / 86400000) + 1) / 7);
    }

    private resetSelections() {
        this.selectedMonth = '';
        this.selectedYear = '';
        this.selectedWeek = '';
        this.weekRange = '';
        this.weekMonth = '';
        this.weekYear = '';
        this.selectedStartDay = null;
        this.selectedEndDay = null;
        this.openDropdown = null;
    }

    private updateDashboardData() {
        console.log(`Filter: ${this.selectedCriterial}, Month: ${this.selectedMonth}, Year: ${this.selectedYear}, Week: ${this.selectedWeek}, WeekRange: ${this.weekRange}, StartDay: ${this.selectedStartDay?.toISOString()}, EndDay: ${this.selectedEndDay?.toISOString()}`);
    }

    @HostListener('document:click', ['$event'])
    onDocumentClick(event: MouseEvent) {
        const target = event.target as HTMLElement;
        if (!target.closest('.dropdown-container-inner')) {
            this.openDropdown = null;
        }
    }
}