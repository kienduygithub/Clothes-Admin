import { Injectable } from "@angular/core";
import { OverviewService } from "../service/overview.service";
import { LowStockProductModel, OrderCompletionRateModel, OrderStatsModel, OverviewStatsModel, RevenueStatsModel, TopCustomerModel, TopSellingProductModel } from "../model/overview/overview.model";
import { GroupDate } from "../../common/resource/group-date";
import { OrderStatus } from "../../common/resource/status";

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

    async fetchRevenueOvertime(
        startDate: Date,
        endDate: Date,
        groupBy: GroupDate = GroupDate.DAY
    ): Promise<RevenueStatsModel> {
        try {
            const result = await this.overviewService.fetchRevenueOvertime(startDate, endDate, groupBy);
            const response: RevenueStatsModel = new RevenueStatsModel(
                result?.body?.revenues,
                result?.body?.totalRevenue
            )

            return response;
        } catch (error) {
            throw error;
        }
    }

    async fetchOrderStats(
        startDate: Date,
        endDate: Date,
        groupBy: GroupDate = GroupDate.DAY,
        status?: OrderStatus
    ): Promise<OrderStatsModel> {
        try {
            const result = await this.overviewService.fetchOrderStats(startDate, endDate, groupBy, status);
            const response: OrderStatsModel = new OrderStatsModel(result?.body)

            return response;
        } catch (error) {
            throw error;
        }
    }

    async fetchTopSellingProducts(
        startDate: Date,
        endDate: Date,
        limit = 10
    ): Promise<TopSellingProductModel[]> {
        try {
            const result = await this.overviewService.fetchTopSellingProducts(startDate, endDate, limit);
            const response: TopSellingProductModel[] = result?.body?.products?.map(
                (product: any) => new TopSellingProductModel().convertObj(product)
            ) ?? [];

            return response;
        } catch (error) {
            throw error;
        }
    }

    async fetchCustomerStats(
        startDate: Date,
        endDate: Date,
        limit = 10
    ): Promise<Map<string, any>> {
        try {
            const result = await this.overviewService.fetchCustomerStats(startDate, endDate, limit);
            const totalCustomers = result?.body?.totalCustomers || 0;
            const topCustomers: TopCustomerModel[] = result?.body?.topCustomers?.map(
                (topCustomer: any) => new TopCustomerModel(
                    topCustomer?.userId,
                    topCustomer?.name,
                    topCustomer?.email,
                    topCustomer?.image_url,
                    topCustomer?.totalSpent)
            ) ?? [];
            const response = new Map<string, any>([]);
            response.set('totalCustomers', totalCustomers);
            response.set('topCustomers', topCustomers);

            return response;
        } catch (error) {
            throw error;
        }
    }

    async fetchLowStockProducts(
        minStock = 10
    ): Promise<LowStockProductModel[]> {
        try {
            const result = await this.overviewService.fetchLowStockProducts(minStock);
            const response: LowStockProductModel[] = result?.body?.products?.map(
                (product: any) => new LowStockProductModel().convertObj(product)
            ) ?? [];

            return response;
        } catch (error) {
            throw error;
        }
    }

    async fetchOrderCompletionStats(
        startDate: Date,
        endDate: Date,
        groupBy: GroupDate = GroupDate.DAY,
        status?: OrderStatus
    ): Promise<OrderCompletionRateModel> {
        try {
            const result = await this.overviewService.fetchOrderCompletionStats(startDate, endDate, groupBy, status);
            const response: OrderCompletionRateModel = new OrderCompletionRateModel(result?.body)

            return response;
        } catch (error) {
            throw error;
        }
    }

}