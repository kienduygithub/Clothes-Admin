import { CommonModule } from "@angular/common";
import { Component } from "@angular/core";
import { NbButtonModule, NbIconModule, NbInputModule, NbTooltipModule } from "@nebular/theme";
import { StatsManagement } from "../../../data/management/stats.management";
import { StatsService } from "../../../data/service/stats.service";
import { ToastNotification } from "../../common/toast/toast.component";
import { ProductPerformanceMonthlyStatModel, ProductPerformanceOverviewModel } from "../../../data/model/stats/stats.model";
import { DateRange } from "../../../common/utils/filter-stats/filter-stats.component";
import { GroupDate } from "../../../common/resource/group-date";

const NB_LIBS = [
    NbIconModule,
    NbInputModule,
    NbButtonModule,
    NbTooltipModule,
]

const ANGULAR_MODULES = [
    CommonModule,
]

const PROVIDERS = [
    StatsManagement,
    StatsService
]

@Component({
    standalone: true,
    selector: 'app-admin-overview',
    templateUrl: './admin-overview.component.html',
    styleUrl: './admin-overview.component.scss',
    imports: [
        ...NB_LIBS,
        ...ANGULAR_MODULES
    ],
    providers: [...PROVIDERS]
})

export class AdminOverviewComponent {
    productPerformanceMonthlyStats: ProductPerformanceMonthlyStatModel[] = [];
    productPerformanceOverview!: ProductPerformanceOverviewModel;
    initDateRanges: DateRange[] = [];

    constructor(
        private statsMana: StatsManagement
    ) { }

    async fetchData() {
        this.initDateRanges = this.getCurrentMonthDateRange();
        await this.fetchProductPerformanceStats(GroupDate.DAY);
    }

    async fetchProductPerformanceStats(groupBy: GroupDate) {
        try {
            const respMap = await this.statsMana.fetchProductPerformanceStats(this.initDateRanges, groupBy);
            this.productPerformanceMonthlyStats = respMap.get('monthlyStats');
            this.productPerformanceOverview = respMap.get('overview');
        } catch (error) {
            console.log(error);
            ToastNotification.error('Hệ thống gặp sự cố, quay lại sau');
        }
    }

    private getCurrentMonthDateRange(): DateRange[] {
        const now = new Date();
        const year = now.getFullYear();
        const month = now.getMonth();

        const startDate = new Date(year, month, 1, 0, 0, 0);
        const endDate = new Date(year, month + 1, 0, 23, 59, 59);

        return [
            {
                startDate: startDate,
                endDate: endDate,
                month: month + 1,
            },
        ];
    }
}