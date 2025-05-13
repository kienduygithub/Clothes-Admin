import { Injectable } from "@angular/core";
import { AppConfig } from "../../common/config/app.config";
import { ServiceCore } from "../../common/service/service-core";
import { AuthModel } from "../../common/model/auth.model";
import { UserModel } from "../model/user/user.model";
import { ShopModel } from "../model/shop.model";

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

    async signUp(
        userModel: UserModel,
        shopModel: ShopModel,
        adminOwnerFile: any,
        logoShopFile: any,
        backgroundShopFile: any
    ): Promise<any> {
        try {
            const domain = this.appConfig.getDomain();
            const formData = new FormData();
            formData.append('userInfo', JSON.stringify(userModel));
            formData.append('shopInfo', JSON.stringify(shopModel));
            formData.append('adminOwnerFile', adminOwnerFile);
            formData.append('logoShopFile', logoShopFile);
            formData.append('backgroundShopFile', backgroundShopFile);
            const response = await this.serviceCore.POST(
                `${domain}`,
                `auth/sign-up`,
                formData
            );
            return response;
        } catch (error) {
            throw error;
        }
    }

    async fetchDetailUser(id: number): Promise<any> {
        try {
            const domain = this.appConfig.getDomain();
            const response = await this.serviceCore.GET(
                `${domain}`,
                `auth/user-details/${id}`,
            );
            return response;
        } catch (error) {
            throw error;
        }
    }

    async getNewAccessToken(): Promise<any> {
        try {
            const domain = this.appConfig.getDomain();
            const refreshToken = this.appConfig.getRefreshToken();
            const response = await this.serviceCore.POST(
                `${domain}`,
                'auth/refresh',
                {
                    refreshToken: refreshToken
                }
            );
            return response;
        } catch (error) {
            throw error;
        }
    }

    async changePassword(payload: any): Promise<any> {
        try {
            const domain = this.appConfig.getDomain();
            const response = await this.serviceCore.POST(
                `${domain}`,
                'account/change-password',
                payload
            );

            return response;
        } catch (error) {
            throw error;
        }
    }
}