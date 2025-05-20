import { CommonModule } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { NbButtonModule, NbIconModule, NbInputModule, NbTooltipModule } from "@nebular/theme";
import { StatsManagement } from "../../../data/management/stats.management";
import { StatsService } from "../../../data/service/stats.service";
import { ToastNotification } from "../../common/toast/toast.component";
import { OrderActivityMonthlyStatModel, OrderActivityOverviewModel, ProductPerformanceMonthlyStatModel, ProductPerformanceOverviewModel, ShopMonthlyStatModel, ShopOverviewModel } from "../../../data/model/stats/stats.model";
import { DateRange } from "../../../common/utils/filter-stats/filter-stats.component";
import { GroupDate } from "../../../common/resource/group-date";
import { adjustToUTCWithOffset } from "../../../common/resource/time";

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

export class AdminOverviewComponent implements OnInit {
    shopMontlyStats: ShopMonthlyStatModel[] = [];
    shopOverview!: ShopOverviewModel;
    orderActivityMonthlyStats: OrderActivityMonthlyStatModel[] = [];
    orderActivityOverview!: OrderActivityOverviewModel;
    productPerformanceMonthlyStats: ProductPerformanceMonthlyStatModel[] = [];
    productPerformanceOverview!: ProductPerformanceOverviewModel;
    initDateRanges: DateRange[] = [];

    constructor(
        private statsMana: StatsManagement
    ) { }

    async ngOnInit() {
        await this.fetchData();
    }

    async fetchData() {
        this.initDateRanges = this.getCurrentMonthDateRange();
        await this.fetchNewShopStats(GroupDate.DAY);
        await this.fetchOrderActivityStats(GroupDate.DAY);
        await this.fetchProductPerformanceStats(GroupDate.DAY);
    }

    async fetchNewShopStats(groupBy: GroupDate) {
        try {
            const respMap = await this.statsMana.fetchNewShopStats(this.initDateRanges, groupBy);
            this.shopMontlyStats = respMap.get('monthlyStats');
            this.shopOverview = respMap.get('overview');
        } catch (error) {
            console.log(error);
            ToastNotification.error('Hệ thống gặp sự cố, quay lại sau');
        }
    }

    async fetchOrderActivityStats(groupBy: GroupDate) {
        try {
            const respMap = await this.statsMana.fetchOrderActivityStats(this.initDateRanges, groupBy);
            this.orderActivityMonthlyStats = respMap.get('monthlyStats');
            this.orderActivityOverview = respMap.get('overview');
        } catch (error) {
            console.log(error);
            ToastNotification.error('Hệ thống gặp sự cố, quay lại sau');
        }
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
                startDate: adjustToUTCWithOffset(startDate),
                endDate: adjustToUTCWithOffset(endDate),
                month: month + 1,
            },
        ];
    }
}