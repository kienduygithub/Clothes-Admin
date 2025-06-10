import { Injectable } from "@angular/core";
import { ServiceCore } from "../../common/service/service-core";
import { AppConfig } from "../../common/config/app.config";
import { ShopModel } from "../model/shop.model";
import { DateRange } from "../../common/utils/filter-stats/filter-stats.component";
import { UserModel } from "../model/user/user.model";

@Injectable()
export class ShopService {

    constructor(
        private serviceCore: ServiceCore,
        private appConfig: AppConfig
    ) { }

    async createShop(user: UserModel, data: ShopModel, userFile: any, logoFile: any, backgroundFile: any): Promise<any> {
        try {
            const domain = this.appConfig.getDomain();
            const userInfo = new UserModel().convertObj(user);
            const shopInfo = new ShopModel().convertObj(data);
            const formData = new FormData();
            formData.append("userInfo", JSON.stringify(userInfo));
            formData.append("shopInfo", JSON.stringify(shopInfo));

            if (userFile) {
                formData.append('adminOwnerFile', userFile);
            }

            if (logoFile) {
                formData.append("logoShopFile", logoFile);
            }

            if (backgroundFile) {
                formData.append("backgroundShopFile", backgroundFile);
            }

            const response = await this.serviceCore.POST(
                `${domain}`,
                `shop/admin/create`,
                formData
            );
            return response;
        } catch (error) {
            throw error;
        }
    }

    async updateShopById(data: ShopModel, logoFile: any, backgroundFile: any): Promise<any> {
        try {
            const domain = this.appConfig.getDomain();
            const shopInfo = new ShopModel().convertModelToUpdate(data);
            const formData = new FormData();
            formData.append("shopInfo", JSON.stringify(shopInfo));

            if (logoFile) {
                formData.append("logoShopFile", logoFile);
            }

            if (backgroundFile) {
                formData.append("backgroundShopFile", backgroundFile);
            }

            const response = await this.serviceCore.PATCH(
                `${domain}`,
                `shop/admin/${data.id}`,
                formData
            );
            return response;
        } catch (error) {
            throw error;
        }
    }

    async fetchAllShops(): Promise<any> {
        try {
            const domain = this.appConfig.getDomain();
            const response = await this.serviceCore.GET(
                `${domain}`,
                `shop/all`,
            );
            return response;
        } catch (error) {
            throw error;
        }
    }

    async fetchListShopNotPending(): Promise<any> {
        try {
            const domain = this.appConfig.getDomain();
            const response = await this.serviceCore.GET(
                `${domain}`,
                `shop/active`,
            );
            return response;
        } catch (error) {
            throw error;
        }
    }

    async fetchRegisterShops(): Promise<any> {
        try {
            const domain = this.appConfig.getDomain();
            const response = await this.serviceCore.GET(
                `${domain}`,
                `shop/register-shops`,
            );
            return response;
        } catch (error) {
            throw error;
        }
    }

    async fetchShopById(shopId: number): Promise<any> {
        try {
            const domain = this.appConfig.getDomain();
            const response = await this.serviceCore.GET(
                `${domain}`,
                `shop/admin/${shopId}`,
            );
            return response;
        } catch (error) {
            throw error;
        }
    }

    async fetchShopByTokenId(): Promise<any> {
        try {
            const domain = this.appConfig.getDomain();
            const response = await this.serviceCore.GET(
                `${domain}`,
                `shop/owner/token-shop`,
            );
            return response;
        } catch (error) {
            throw error;
        }
    }

    async fetchListLatestOrderShop(dateRanges: DateRange[]): Promise<any> {
        try {
            const domain = this.appConfig.getDomain();
            const response = await this.serviceCore.POST(
                `${domain}`,
                `shop/order/latest`,
                {
                    dateRanges
                }
            );
            return response;
        } catch (error) {
            throw error;
        }
    }

    async deleteShopById(shopId: number): Promise<any> {
        try {
            const domain = this.appConfig.getDomain();
            const response = await this.serviceCore.DETELE(
                `${domain}`,
                `shop/admin/${shopId}`,
            );
            return response;
        } catch (error) {
            throw error;
        }
    }

    async declineRegisterShopById(shopId: number): Promise<any> {
        try {
            const domain = this.appConfig.getDomain();
            const response = await this.serviceCore.POST(
                `${domain}`,
                `shop/decline-register/${shopId}`,
                {}
            );
            return response;
        } catch (error) {
            throw error;
        }
    }

    async acceptRegisterShopById(shopId: number): Promise<any> {
        try {
            const domain = this.appConfig.getDomain();
            const response = await this.serviceCore.POST(
                `${domain}`,
                `shop/accept-register/${shopId}`,
                {}
            );
            return response;
        } catch (error) {
            throw error;
        }
    }

    async changeOwnersForShop(shopId: number, ownerIds: number[]): Promise<any> {
        try {
            const domain = this.appConfig.getDomain();
            let query = `?shopId=${shopId}`;
            for (let i = 0; i < ownerIds.length; i++) {
                query += `&ownerId=${ownerIds[i]}`;
            }
            const response = await this.serviceCore.PATCH(
                `${domain}`,
                `shop/admin/change-owners${query}`,
                {}
            );
            return response;
        } catch (error) {
            throw error;
        }
    }

    async withdrawalByOwner(amount: string, password: string) {
        try {
            const domain = this.appConfig.getDomain();
            const user = this.appConfig.getUserInfo();
            const response = await this.serviceCore.POST(
                `${domain}`,
                `shop/withdrawal`,
                {
                    shop_id: user.shopId,
                    amount: parseInt(amount, 10),
                    password: password
                }
            );
            return response;
        } catch (error) {
            throw error;
        }
    }

    async fetchListWithdrawalHistories() {
        try {
            const domain = this.appConfig.getDomain();
            const response = await this.serviceCore.GET(
                `${domain}`,
                `shop/withdrawal/history`,
            );
            return response;
        } catch (error) {
            throw error;
        }
    }

    async fetchBalanceShop() {
        try {
            const domain = this.appConfig.getDomain();
            const response = await this.serviceCore.GET(
                `${domain}`,
                `shop/balance/get`,
            );
            return response;
        } catch (error) {
            throw error;
        }
    }
}