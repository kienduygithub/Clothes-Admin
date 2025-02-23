import { Injectable } from "@angular/core";
import { AppConfig } from "../../common/config/app.config";
import { ServiceCore } from "../../common/service/service-core";
import { AuthModel } from "../../common/model/auth.model";

@Injectable()
export class AuthService {

    constructor(
        private appConfig: AppConfig,
        private serviceCore: ServiceCore
    ) { }

    async signIn(auth: AuthModel): Promise<any> {
        try {
            const domain = this.appConfig.getDomain();
            const response = await this.serviceCore.POST(
                `${domain}`,
                `auth/sign-in`,
                auth
            );
            return response;
        } catch (error) {
            throw error;
        }
    }
}