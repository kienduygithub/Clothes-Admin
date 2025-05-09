import { CommonModule } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { NbButtonModule, NbIconModule, NbInputModule, NbTooltipModule } from "@nebular/theme";
import { OverviewManagement } from "../../../data/management/overview.management";
import { OverviewService } from "../../../data/service/overview.service";
import { LowStockProductModel, OrderCompletionRateModel, OrderStatsModel, OverviewStatsModel, RevenueStatsModel, TopCustomerModel, TopSellingProductModel } from "../../../data/model/overview/overview.model";
import { GroupDate } from "../../../common/resource/group-date";
import { OrderStatus } from "../../../common/resource/status";

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
    OverviewManagement,
    OverviewService
]

@Component({
    standalone: true,
    selector: 'app-owner-overview',
    templateUrl: './owner-overview.component.html',
    styleUrl: './owner-overview.component.scss',
    imports: [
        ...NB_LIBS,
        ...ANGULAR_MODULES
    ],
    providers: [...PROVIDERS]
})

export class OwnerOverviewComponent implements OnInit {
    overviewStats!: OverviewStatsModel;
    revenueStats!: RevenueStatsModel;
    orderStats!: OrderStatsModel;
    topSellingProducts: TopSellingProductModel[] = [];
    totalCustomers: number = 0;
    topCustomers: TopCustomerModel[] = [];
    lowStockProducts: LowStockProductModel[] = [];
    orderCompletionRate!: OrderCompletionRateModel;
    today = new Date();
    past14Days = new Date();

    constructor(
        private overviewMana: OverviewManagement
    ) { }

    async ngOnInit(): Promise<any> {
        this.past14Days.setDate(this.today.getDate() - 14)
        await this.fetchShopOverviewStats();
        await this.fetchRevenueOvertime();
        await this.fetchOrderStats();
        await this.fetchTopSellingProducts();
        await this.fetchCustomerStats();
        await this.fetchLowStockProducts();
        await this.fetchOrderCompletionStats();
    }

    async fetchShopOverviewStats() {
        try {
            const response = await this.overviewMana.fetchShopOverviewStats(this.past14Days, this.today);
            this.overviewStats = response;
        } catch (error) {
            console.log(error);
        }
    }

    async fetchRevenueOvertime() {
        try {
            const response = await this.overviewMana.fetchRevenueOvertime(this.past14Days, this.today, GroupDate.DAY);
            this.revenueStats = response;
        } catch (error) {
            console.log(error);
        }
    }

    async fetchOrderStats() {
        try {
            const response = await this.overviewMana.fetchOrderStats(
                this.past14Days,
                this.today,
                GroupDate.DAY,
                // OrderStatus.PENDING
            );
            this.orderStats = response;
        } catch (error) {
            console.log(error);
        }
    }

    async fetchTopSellingProducts() {
        try {
            const response = await this.overviewMana.fetchTopSellingProducts(
                this.past14Days,
                this.today,
                10
            );
            this.topSellingProducts = response;
        } catch (error) {
            console.log(error);
        }
    }

    async fetchCustomerStats() {
        try {
            const response = await this.overviewMana.fetchCustomerStats(
                this.past14Days,
                this.today,
                10
            );
            this.totalCustomers = response.get('totalCustomers') ?? 0;
            this.topCustomers = response.get('topCustomers') ?? [];
        } catch (error) {
            console.log(error);
        }
    }

    async fetchLowStockProducts() {
        try {
            const minStock = 50;
            const response = await this.overviewMana.fetchLowStockProducts(minStock);
            this.lowStockProducts = response;
        } catch (error) {
            console.log(error);
        }
    }

    async fetchOrderCompletionStats() {
        try {
            const response = await this.overviewMana.fetchOrderCompletionStats(
                this.past14Days,
                this.today,
                GroupDate.DAY,
                // OrderStatus.PENDING
            );
            this.orderCompletionRate = response;
        } catch (error) {
            console.log(error);
        }
    }


}