import { Injectable } from "@angular/core";
import { ServiceCore } from "../../common/service/service-core";
import { AppConfig } from "../../common/config/app.config";
import { CouponModel } from "../model/coupon/coupon.model";

@Injectable()
export class CouponService {

    constructor(
        private serviceCore: ServiceCore,
        private appConfig: AppConfig
    ) { }

    async createCoupon(coupon: CouponModel): Promise<any> {
        try {
            const domain = this.appConfig.getDomain();
            const userInfo = this.appConfig.getUserInfo();
            const model = new CouponModel().toJson(coupon);
            const response = this.serviceCore.POST(
                `${domain}`,
                `owner/coupon/${userInfo.shopId}`,
                model
            );
            return response;
        } catch (error) {
            throw error;
        }
    }

    async updateCoupon(coupon: CouponModel): Promise<any> {
        try {
            const domain = this.appConfig.getDomain();
            const model = new CouponModel().toJson(coupon);
            const response = this.serviceCore.PUT(
                `${domain}`,
                `owner/coupon/${coupon.id}`,
                model
            );
            return response;
        } catch (error) {
            throw error;
        }
    }

    async fetchCoupons(): Promise<any> {
        try {
            const domain = this.appConfig.getDomain();
            const userInfo = this.appConfig.getUserInfo();
            const response = this.serviceCore.GET(
                `${domain}`,
                `owner/coupon/${userInfo.shopId}/shop`,
            );
            return response;
        } catch (error) {
            throw error;
        }
    }

    async fetchCouponById(couponId: number): Promise<any> {
        try {
            const domain = this.appConfig.getDomain();
            const response = this.serviceCore.GET(
                `${domain}`,
                `owner/coupon/${couponId}`,
            );
            return response;
        } catch (error) {
            throw error;
        }
    }

    async deleteCouponById(couponId: number): Promise<any> {
        try {
            const domain = this.appConfig.getDomain();
            const response = this.serviceCore.DETELE(
                `${domain}`,
                `owner/coupon/${couponId}`,
            );
            return response;
        } catch (error) {
            throw error;
        }
    }
}