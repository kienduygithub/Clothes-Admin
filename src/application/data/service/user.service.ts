import { Injectable } from "@angular/core";
import { ServiceCore } from "../../common/service/service-core";
import { AppConfig } from "../../common/config/app.config";

@Injectable()
export class UserService {

    constructor(
        private serviceCore: ServiceCore,
        private appConfig: AppConfig
    ) { }

    async fetchAllUsers(type?: string): Promise<any> {
        try {
            const domain = this.appConfig.getDomain();
            const response = await this.serviceCore.GET(
                `${domain}`,
                `user/all`
            );
            return response;
        } catch (error) {
            throw error;
        }
    }
}