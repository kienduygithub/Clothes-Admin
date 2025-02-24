import { Injectable } from "@angular/core";
import { AppConfig } from "../../common/config/app.config";
import { AuthService } from "../service/auth.service";
import { AuthModel } from "../../common/model/auth.model";
import { UserModel } from "../model/user.model";

@Injectable()
export class AuthManagement {

    constructor(
        private appConfig: AppConfig,
        private authService: AuthService
    ) { }

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
            return result;
        } catch (error) {
            throw error;
        }
    }

    async fetchUserDetails(id: string) {
        try {
            const result = await this.authService.fetchDetailUser(id);
            const response = result?.body?.users.map((user: any) => new UserModel().convertObj(user));
            return response[0];
        } catch (error) {
            throw error;
        }
    }
}