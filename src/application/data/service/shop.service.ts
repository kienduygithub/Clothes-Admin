import { Injectable } from "@angular/core";
import { ServiceCore } from "../../common/service/service-core";
import { AppConfig } from "../../common/config/app.config";
import { ShopModel } from "../model/shop.model";

@Injectable()
export class ShopService {

    constructor(
        private serviceCore: ServiceCore,
        private appConfig: AppConfig
    ) { }

    async createShop(data: ShopModel, logoFile: any, backgroundFile: any): Promise<any> {
        try {
            const domain = this.appConfig.getDomain();
            const shopInfo = new ShopModel().convertObj(data);
            const formData = new FormData();
            formData.append("shopInfo", JSON.stringify(shopInfo));
            if (logoFile) {
                formData.append("logoFile", logoFile);
            }
            if (backgroundFile) {
                formData.append("backgroundFile", backgroundFile);
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
            const shopInfo = new ShopModel().convertObj(data);
            const formData = new FormData();
            formData.append("shopInfo", JSON.stringify(shopInfo));
            if (logoFile) {
                formData.append("logoFile", logoFile);
            }
            if (backgroundFile) {
                formData.append("backgroundFile", backgroundFile);
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

    async fetchShopById(shopId: number): Promise<any> {
        try {
            const domain = this.appConfig.getDomain();
            const response = await this.serviceCore.GET(
                `${domain}`,
                `shop/${shopId}`,
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
}