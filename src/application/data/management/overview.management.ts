import { Injectable } from "@angular/core";
import { OverviewService } from "../service/overview.service";
import { OverviewStatsModel } from "../model/overview/overview.model";

@Injectable()
export class OverviewManagement {

    constructor(
        private overviewService: OverviewService
    ) { }

    async fetchShopOverviewStats(startDate: Date, endDate: Date): Promise<OverviewStatsModel> {
        try {
            const result = await this.overviewService.fetchShopOverviewStats(startDate, endDate);
            const response: OverviewStatsModel = new OverviewStatsModel(
                result?.body?.overview?.totalRevenue,
                result?.body?.overview?.totalOrders,
                result?.body?.overview?.totalSoldProducts,
                result?.body?.overview?.totalCustomers,
                result?.body?.overview?.orderStatusCounts
            )

            return response;
        } catch (error) {
            throw error;
        }
    }
}