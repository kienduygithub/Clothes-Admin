import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { UserModel } from "../../data/model/user.model";

@Injectable({
    providedIn: 'root'
})

export class AppConfig {
    private domain?: string;
    private preImage?: string;

    constructor(
        private router: Router,
        private http: HttpClient
    ) { }

    async loadConfig() {
        try {
            const config = await this.http.get<any>("assets/config.json").toPromise();
            this.setDomain(config?.apis);
            this.setPreImage(config?.pre_image);
        } catch (error) {
            console.error('Error loading config: ', error);
        }
    }

    getDomain() {
        return this.domain;
    }

    setDomain(domain: string) {
        this.domain = domain;
    }

    getPreImage() {
        return this.preImage;
    }

    setPreImage(preImage: string) {
        this.preImage = preImage;
    }

    getShopId() {
        const shopId = localStorage.getItem('shopId');
        if (!shopId) {
            // Xử lý vụ đăng xuất
            return "";
        }
        return shopId;
    }

    setShopId(shopId: number) {
        localStorage.setItem('shopId', JSON.stringify(shopId));
    }

    getUserInfo() {
        const info = localStorage.getItem('info');
        if (!info) {
            return null;
        }
        return JSON.parse(info);
    }

    setUserInfo(info: UserModel) {
        localStorage.setItem('info', JSON.stringify(info));
    }

    getAccessToken() {
        const accessToken = localStorage.getItem('access-token');
        if (accessToken) {
            return JSON.parse(accessToken);
        }
        return "";
    }

    setAccessToken(token: string) {
        localStorage.setItem('access-token', token);
    }

    getRefreshToken() {
        const refreshToken = localStorage.getItem('refresh-token');
        if (refreshToken) {
            return JSON.parse(refreshToken);
        }
        return "";
    }

    setRefreshToken(token: string) {
        localStorage.setItem('refresh-token', token);
    }

    clear() {
        this.setDomain("");
        this.setPreImage("");
        localStorage.clear();
    }
}