import { Injectable } from "@angular/core";
import { AppConfig } from "../../common/config/app.config";
import { AuthService } from "../service/auth.service";
import { AuthModel } from "../../common/model/auth.model";
import { UserModel } from "../model/user/user.model";
import { UserStore } from "../stores/user.store";
import { UserStoreModel } from "../model/user/user.store.model";
import { ShopModel } from "../model/shop.model";

@Injectable()
export class AuthManagement {

    constructor(
        private appConfig: AppConfig,
        private authService: AuthService,
        private userStore: UserStore
    ) { }

    getSelectUser() {
        return this.userStore.getSelectUser();
    }

    getUserStore() {
        return { ...this.userStore.getUser() } as UserStoreModel;
    }

    async signIn(auth: AuthModel) {
        try {
            const result = await this.authService.signIn(auth);
            const accessToken = result?.body?.access_token;
            const refreshToken = result?.body?.refresh_token;
            const info = result?.body?.info;
            this.appConfig.setAccessToken(accessToken);
            this.appConfig.setRefreshToken(refreshToken);
            const user = new UserModel().convertObj(info);
            this.appConfig.setUserInfo(user);
            const userStoreModel: UserStoreModel = {
                id: user.id ?? 0,
                name: user.name ?? '',
                image_url: user.image_url ?? '',
                roles: user.roles ?? '',
                shopId: user.shopId ?? 0,
            };
            this.userStore.setUser(userStoreModel);
            return result;
        } catch (error) {
            throw error;
        }
    }

    async signUp(
        userModel: UserModel,
        shopModel: ShopModel,
        logoShopFile: any,
        backgroundShopFile: any
    ): Promise<any> {
        try {
            await this.authService.signUp(
                userModel,
                shopModel,
                logoShopFile,
                backgroundShopFile
            );
            return true;
        } catch (error) {
            throw error;
        }
    }

    async fetchUserDetails(id: number) {
        try {
            const result = await this.authService.fetchDetailUser(id);
            const response: UserModel[] = result?.body?.users.map(
                (user: any) => new UserModel().convertObj(user)
            ) ?? [];

            if (response.length === 0) {
                return undefined;
            }

            const userStoreModel: UserStoreModel = {
                id: response[0].id ?? 0,
                name: response[0].name ?? '',
                image_url: response[0].image_url ?? '',
                roles: response[0].roles ?? '',
                shopId: response[0].shopId ?? 0
            };
            this.userStore.setUser(userStoreModel);
            this.appConfig.setUserInfo(response[0]);
        } catch (error) {
            throw error;
        }
    }

    async changePassword(payload: any): Promise<any> {
        try {
            await this.authService.changePassword(payload);
            return true;
        } catch (error) {
            throw error;
        }
    }

    async fetchAccountDetails() {
        try {
            const result = await this.authService.fetchAccountDetails();
            return new UserModel().convertObj(result?.body?.users[0]);
        } catch (error) {
            throw error;
        }
    }

    async editAccountDetails(userModel: UserModel, adminOwnerFile: any) {
        try {
            const result = await this.authService.editAccountDetails(
                userModel,
                adminOwnerFile
            );
            return result?.body?.image_url;
        } catch (error) {
            throw error;
        }
    }

    async checkUserForShopRegistration(auth: AuthModel) {
        try {
            const result = await this.authService.checkUserForShopRegistration(auth);
            return new UserModel().convertObj(result?.body?.users[0]);
        } catch (error) {
            throw error;
        }
    }
}