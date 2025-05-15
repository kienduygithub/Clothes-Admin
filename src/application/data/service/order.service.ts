import { Injectable } from "@angular/core";
import { ServiceCore } from "../../common/service/service-core";
import { AppConfig } from "../../common/config/app.config";

@Injectable()
export class OrderService {

    constructor(
        private serviceCore: ServiceCore,
        private appConfig: AppConfig
    ) { }

    async fetchListOrderShop(status?: string): Promise<any> {
        try {
            const domain = this.appConfig.getDomain();
            const response = this.serviceCore.GET(
                `${domain}`,
                status ? `order/shop?status=${status}` : `order/shop`,
            );
            return response;
        } catch (error) {
            throw error;
        }
    }

    async updateStatusOrderShop(order_shop_id: number, status: string): Promise<any> {
        try {
            const domain = this.appConfig.getDomain();
            const response = this.serviceCore.PATCH(
                `${domain}`,
                `order/shop`,
                {
                    order_shop_id: order_shop_id,
                    status: status
                }
            );
            return response;
        } catch (error) {
            throw error;
        }
    }

    async fetchOrderShopDetail(order_id: number, order_shop_id: number): Promise<any> {
        try {
            const domain = this.appConfig.getDomain();
            const response = this.serviceCore.GET(
                `${domain}`,
                `order/shop/detail?order_id=${order_id}&order_shop_id=${order_shop_id}`,
            );
            return response;
        } catch (error) {
            throw error;
        }
    }

}