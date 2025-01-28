import { Injectable } from "@angular/core";
import { ServiceCore } from "../../common/service/service-core";
import { AppConfig } from "../../common/config/app.config";

@Injectable()
export class AttributeService {

    constructor(
        private serviceCore: ServiceCore,
        private appConfig: AppConfig
    ) { }

    async fetchAllColors(): Promise<any> {
        try {
            const domain = this.appConfig.getDomain();
            const response = await this.serviceCore.GET(
                `${domain}`,
                `attr/color`
            );
            return response;
        } catch (error) {
            throw error;
        }
    }

    async fetchAllSizes(): Promise<any> {
        try {
            const domain = this.appConfig.getDomain();
            const response = await this.serviceCore.GET(
                `${domain}`,
                `attr/size`
            );
            return response;
        } catch (error) {
            throw error;
        }
    }
}