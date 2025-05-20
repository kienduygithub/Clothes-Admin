import { Injectable } from "@angular/core";
import { ServiceCore } from "../../common/service/service-core";
import { AppConfig } from "../../common/config/app.config";
import { DateRange } from "../../common/utils/filter-stats/filter-stats.component";
import { GroupDate } from "../../common/resource/group-date";

@Injectable()
export class StatsService {

    constructor(
        private serviceCore: ServiceCore,
        private appConfig: AppConfig
    ) { }

    async fetchProductPerformanceStats(dateRanges: DateRange[], groupBy: GroupDate = GroupDate.DAY): Promise<any> {
        try {
            const domain = this.appConfig.getDomain();
            const response = await this.serviceCore.POST(
                `${domain}`,
                `admin/product-performance-stats`,
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
}