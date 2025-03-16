import { Injectable } from "@angular/core";
import { CouponService } from "../service/coupon.service";
import { CouponModel } from "../model/coupon/coupon.model";

@Injectable()
export class CouponManagement {

    constructor(
        private couponService: CouponService
    ) { }

    async createCoupon(coupon: CouponModel) {
        try {
            const resultAPI = await this.couponService.createCoupon(coupon);
            const response: CouponModel[] = resultAPI?.body?.coupons?.map(
                (coupon: any) => new CouponModel().fromJson(coupon)
            ) ?? [];
            if (response.length === 0) {
                return [];
            }
            return response[0];
        } catch (error) {
            throw error;
        }
    }

    async updateCoupon(coupon: CouponModel) {
        try {
            const resultAPI = await this.couponService.updateCoupon(coupon);
            const response: CouponModel[] = resultAPI?.body?.coupons?.map(
                (coupon: any) => new CouponModel().fromJson(coupon)
            ) ?? [];
            if (response.length === 0) {
                return [];
            }
            return response[0];
        } catch (error) {
            throw error;
        }
    }

    async fetchCoupons() {
        try {
            const resultAPI = await this.couponService.fetchCoupons();
            const response: CouponModel[] = resultAPI?.body?.coupons?.map(
                (coupon: any) => new CouponModel().fromJson(coupon)
            ) ?? [];
            return response;
        } catch (error) {
            throw error;
        }
    }

    async fetchCouponById(couponId: number) {
        try {
            const resultAPI = await this.couponService.fetchCouponById(couponId);
            const response: CouponModel[] = resultAPI?.body?.coupons?.map(
                (coupon: any) => new CouponModel().fromJson(coupon)
            ) ?? [];
            if (response.length === 0) {
                return undefined;
            }
            return response[0];
        } catch (error) {
            throw error;
        }
    }

    async deleteCouponById(couponId: number) {
        try {
            await this.couponService.deleteCouponById(couponId);
            return true;
        } catch (error) {
            throw error;
        }
    }
}