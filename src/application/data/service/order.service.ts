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



}