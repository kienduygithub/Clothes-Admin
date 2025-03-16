import { Injectable } from "@angular/core";
import { ShopModel } from "../model/shop.model";
import { ShopService } from "../service/shop.service";

@Injectable()
export class ShopManagement {
    constructor(
        private shopService: ShopService
    ) { }

    async createShop(data: ShopModel, logoFile: any, backgroundFile: any) {
        try {
            await this.shopService.createShop(data, logoFile, backgroundFile);
            return true;
        } catch (error) {
            throw error;
        }
    }

    async updateShopById(data: ShopModel, logoFile: any, backgroundFile: any) {
        try {
            await this.shopService.updateShopById(data, logoFile, backgroundFile);
            return true;
        } catch (error) {
            throw error;
        }
    }

    async fetchAllShops() {
        try {
            const result = await this.shopService.fetchAllShops();
            const response = await result?.body?.shops?.map(
                (shop: any) => new ShopModel().convertObj(shop)
            );
            return response;
        } catch (error) {
            throw error;
        }
    }

    async fetchRegisterShops() {
        try {
            const result = await this.shopService.fetchRegisterShops();
            const response = await result?.body?.shops?.map(
                (shop: any) => new ShopModel().convertObj(shop)
            );
            return response;
        } catch (error) {
            throw error;
        }
    }

    async fetchShopById(shopId: number) {
        try {
            const result = await this.shopService.fetchShopById(shopId);
            const response = await result?.body?.shops?.map(
                (shop: any) => new ShopModel().convertObj(shop)
            );
            return response[0];
        } catch (error) {
            throw error;
        }
    }

    async deleteShopById(shopId: number) {
        try {
            await this.shopService.deleteShopById(shopId);
            return true;
        } catch (error) {
            throw error;
        }
    }

    async changeOwnersForShop(shopId: number, ownerIds: number[]) {
        try {
            await this.shopService.changeOwnersForShop(shopId, ownerIds);
            return true;
        } catch (error) {
            throw error;
        }
    }
}