import { Injectable } from "@angular/core";
import { ShopModel } from "../model/shop.model";
import { ShopService } from "../service/shop.service";
import { Withdrawal } from "../model/withdrawal/withdrawal.model";

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
            ) ?? [];
            return response;
        } catch (error) {
            throw error;
        }
    }

    async fetchListShopNotPending() {
        try {
            const result = await this.shopService.fetchListShopNotPending();
            const response = await result?.body?.shops?.map(
                (shop: any) => new ShopModel().convertObj(shop)
            ) ?? [];
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

    async fetchShopByTokenId() {
        try {
            const result = await this.shopService.fetchShopByTokenId();
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

    async declineRegisterShopById(shopId: number): Promise<any> {
        try {
            await this.shopService.declineRegisterShopById(shopId);
            return true;
        } catch (error) {
            throw error;
        }
    }

    async acceptRegisterShopById(shopId: number): Promise<any> {
        try {
            await this.shopService.acceptRegisterShopById(shopId);
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

    async withdrawalByOwner(amount: string, password: string) {
        try {
            const result = await this.shopService.withdrawalByOwner(amount, password);
            console.log(result);
            return new Withdrawal().convertObj(result?.body?.newWithdrawal);
        } catch (error) {
            throw error;
        }
    }

    async fetchListWithdrawalHistories() {
        try {
            const result = await this.shopService.fetchListWithdrawalHistories();
            const response: Withdrawal[] = result?.body?.withdrawals?.map(
                (withdrawal: any) => new Withdrawal().convertObj(withdrawal)
            )
            return response;
        } catch (error) {
            throw error;
        }
    }

    async fetchBalanceShop() {
        try {
            const result = await this.shopService.fetchBalanceShop();
            return result?.body?.balance ? parseFloat(result?.body?.balance) : 0;
        } catch (error) {
            throw error;
        }
    }


}