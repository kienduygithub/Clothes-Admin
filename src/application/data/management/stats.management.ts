import { Injectable } from "@angular/core";
import { DateRange } from "../../common/utils/filter-stats/filter-stats.component";
import { GroupDate } from "../../common/resource/group-date";
import { StatsService } from "../service/stats.service";
import { OrderActivityMonthlyStatModel, OrderActivityOverviewModel, ProductPerformanceMonthlyStatModel, ProductPerformanceOverviewModel, ShopMonthlyStatModel, ShopOverviewModel } from "../model/stats/stats.model";

@Injectable()
export class StatsManagement {
    constructor(
        private statsService: StatsService
    ) { }

    async fetchNewShopStats(dateRanges: DateRange[], groupBy: GroupDate = GroupDate.DAY) {
        try {
            const result = await this.statsService.fetchNewShopStats(dateRanges, groupBy);
            const shopMontlyStats: ShopMonthlyStatModel[] = result?.body?.monthlyStats?.map(
                (stats: any) => new ShopMonthlyStatModel().fromJson(stats)
            ) ?? [];
            const shopOverview = new ShopOverviewModel().fromJson(result?.body?.overview);
            const respMap = new Map();
            respMap.set('monthlyStats', shopMontlyStats);
            respMap.set('overview', shopOverview);

            return respMap;
        } catch (error) {
            throw error;
        }
    }

    async fetchOrderActivityStats(dateRanges: DateRange[], groupBy: GroupDate = GroupDate.DAY) {
        try {
            const result = await this.statsService.fetchOrderActivityStats(dateRanges, groupBy);
            const orderActivityMonthlyStats: OrderActivityMonthlyStatModel[] = result?.body?.monthlyStats?.map(
                (stats: any) => new OrderActivityMonthlyStatModel().fromJson(stats)
            ) ?? [];
            const orderActivityOverview = new OrderActivityOverviewModel().fromJson(result?.body?.overview);
            const respMap = new Map();
            respMap.set('monthlyStats', orderActivityMonthlyStats);
            respMap.set('overview', orderActivityOverview);

            return respMap;
        } catch (error) {
            throw error;
        }
    }

    async fetchProductPerformanceStats(dateRanges: DateRange[], groupBy: GroupDate = GroupDate.DAY) {
        try {
            const result = await this.statsService.fetchProductPerformanceStats(dateRanges, groupBy);
            const productPerformanceMonthlyStats: ProductPerformanceMonthlyStatModel[] = result?.body?.monthlyStats?.map(
                (stats: any) => new ProductPerformanceMonthlyStatModel().fromJson(stats)
            ) ?? [];
            const productPerformanceOverview = new ProductPerformanceOverviewModel().fromJson(result?.body?.overview);
            const respMap = new Map();
            respMap.set('monthlyStats', productPerformanceMonthlyStats);
            respMap.set('overview', productPerformanceOverview);

            return respMap;
        } catch (error) {
            throw error;
        }
    }
}