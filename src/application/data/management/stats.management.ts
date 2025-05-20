import { Injectable } from "@angular/core";
import { DateRange } from "../../common/utils/filter-stats/filter-stats.component";
import { GroupDate } from "../../common/resource/group-date";
import { StatsService } from "../service/stats.service";
import { ProductPerformanceMonthlyStatModel, ProductPerformanceOverviewModel } from "../model/stats/stats.model";

@Injectable()
export class StatsManagement {
    constructor(
        private statsService: StatsService
    ) { }

    async fetchProductPerformanceStats(dateRanges: DateRange[], groupBy: GroupDate = GroupDate.DAY) {
        try {
            const result = await this.statsService.fetchProductPerformanceStats(dateRanges, groupBy);
            const productPerformanceMonthlyStats: ProductPerformanceMonthlyStatModel[] = result?.monthlyStats?.map(
                (stats: any) => new ProductPerformanceMonthlyStatModel().fromJson(stats)
            ) ?? [];
            const productPerformanceOverview = new ProductPerformanceOverviewModel().fromJson(result?.overview);
            const respMap = new Map();
            respMap.set('monthlyStats', productPerformanceMonthlyStats);
            respMap.set('overview', productPerformanceOverview);

            return respMap;
        } catch (error) {
            throw error;
        }
    }
}