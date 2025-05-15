import { Injectable } from "@angular/core";
import { OrderModel } from "../model/order/order.model";
import { OrderService } from "../service/order.service";

@Injectable()
export class OrderManagement {

    constructor(
        private orderService: OrderService
    ) { }

    async fetchListOrderShop(status?: string) {
        try {
            const resultAPI = await this.orderService.fetchListOrderShop(status);
            const response: OrderModel[] = resultAPI?.body?.orders?.map(
                (order: any) => new OrderModel().convertObj(order)
            ) ?? [];
            return response;
        } catch (error) {
            throw error;
        }
    }

    async updateStatusOrderShop(order_shop_id: number, status: string) {
        try {
            await this.orderService.updateStatusOrderShop(order_shop_id, status);
            return true;
        } catch (error) {
            throw error;
        }
    }
}