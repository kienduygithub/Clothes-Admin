import { Injectable } from "@angular/core";
import { AppConfig } from "../../common/config/app.config";
import { ServiceCore } from "../../common/service/service-core";

@Injectable()
export class OverviewService {

    constructor(
        private appConfig: AppConfig,
        private serviceCore: ServiceCore,
    ) { }

    async fetchShopOverviewStats(startDate: Date, endDate: Date): Promise<any> {
        try {
            const domain = this.appConfig.getDomain();

            const response = await this.serviceCore.POST(
                `${domain}`,
                `overview/stats`,
                {
                    startDate,
                    endDate
                }
            );
            return response;
        } catch (error) {
            throw error;
        }
    }
}