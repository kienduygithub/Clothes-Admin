import { Injectable } from "@angular/core";
import { AppConfig } from "../../common/config/app.config";
import { ServiceCore } from "../../common/service/service-core";
import { GroupDate } from "../../common/resource/group-date";
import { OrderStatus } from "../../common/resource/status";
import { DateRange } from "../../common/utils/filter-stats/filter-stats.component";

@Injectable()
export class OverviewService {

    constructor(
        private appConfig: AppConfig,
        private serviceCore: ServiceCore,
    ) { }

    async fetchShopOverviewStats(dateRanges: DateRange[]): Promise<any> {
        try {
            const domain = this.appConfig.getDomain();

            const response = await this.serviceCore.POST(
                `${domain}`,
                `overview/stats`,
                {
                    dateRanges: dateRanges
                }
            );
            return response;
        } catch (error) {
            throw error;
        }
    }

    async fetchRevenueOvertime(
        dateRanges: DateRange[],
        groupBy: GroupDate = GroupDate.DAY
    ): Promise<any> {
        try {
            const domain = this.appConfig.getDomain();

            const response = await this.serviceCore.POST(
                `${domain}`,
                `overview/stats/by-period`,
                {
                    dateRanges,
                    groupBy
                }
            );
            return response;
        } catch (error) {
            throw error;
        }
    }

    async fetchOrderStats(
        dateRanges: DateRange[],
        groupBy: GroupDate = GroupDate.DAY,
        status?: OrderStatus
    ): Promise<any> {
        try {
            const domain = this.appConfig.getDomain();

            const response = await this.serviceCore.POST(
                `${domain}`,
                `overview/stats/order/by-status-or-period`,
                {
                    dateRanges,
                    groupBy,
                    status
                }
            );
            return response;
        } catch (error) {
            throw error;
        }
    }

    async fetchTopSellingProducts(
        dateRanges: DateRange[],
        limit = 10
    ): Promise<any> {
        try {
            const domain = this.appConfig.getDomain();

            const response = await this.serviceCore.POST(
                `${domain}`,
                `overview/stats/product/top-selling`,
                {
                    dateRanges,
                    limit
                }
            );
            return response;
        } catch (error) {
            throw error;
        }
    }

    async fetchCustomerStats(
        dateRanges: DateRange[],
        limit = 5
    ): Promise<any> {
        try {
            const domain = this.appConfig.getDomain();

            const response = await this.serviceCore.POST(
                `${domain}`,
                `overview/stats/customer/total-and-top-rank`,
                {
                    dateRanges,
                    limit
                }
            );
            return response;
        } catch (error) {
            throw error;
        }
    }

    async fetchLowStockProducts(
        minStock = 10
    ): Promise<any> {
        try {
            const domain = this.appConfig.getDomain();

            const response = await this.serviceCore.POST(
                `${domain}`,
                `overview/stats/product/low-stock`,
                {
                    minStock
                }
            );
            return response;
        } catch (error) {
            throw error;
        }
    }

    async fetchOrderCompletionStats(
        dateRanges: DateRange[],
        groupBy: GroupDate = GroupDate.DAY,
        status?: OrderStatus
    ): Promise<any> {
        try {
            const domain = this.appConfig.getDomain();

            const response = await this.serviceCore.POST(
                `${domain}`,
                `overview/stats/order/completion-rate`,
                {
                    dateRanges,
                    groupBy,
                    status
                }
            );
            return response;
        } catch (error) {
            throw error;
        }
    }

}