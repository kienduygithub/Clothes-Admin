import { Injectable } from "@angular/core";
import { ServiceCore } from "../../common/service/service-core";
import { AppConfig } from "../../common/config/app.config";
import { CouponModel } from "../model/coupon/coupon.model";

@Injectable()
export class NotificationService {

    constructor(
        private serviceCore: ServiceCore,
        private appConfig: AppConfig
    ) { }

    fetchNotificationByUser = async (page: number, limit: number) => {
        try {
            const domain = this.appConfig.getDomain();
            const response = await this.serviceCore.GET(
                `${domain}`,
                `notification?page=${page}&limit=${limit}`
            );
            return response;
        } catch (error) {
            throw error;
        }
    }

    fetchUnreadNotificationCount = async () => {
        try {
            const domain = this.appConfig.getDomain();
            const response = await this.serviceCore.GET(
                `${domain}`,
                `notification/unread-count`
            );
            return response;
        } catch (error) {
            throw error;
        }
    }

    markNotificationAsRead = async (notification_id: number) => {
        try {
            const domain = this.appConfig.getDomain();
            const userInfo = this.appConfig.getUserInfo();
            const response = await this.serviceCore.PATCH(
                `${domain}`,
                `notification/user/${userInfo.id}/${notification_id}/read`,
                {}
            );
            return response;
        } catch (error) {
            throw error;
        }
    }

    fetchOrderDetails = async (order_id: number) => {
        try {
            const domain = this.appConfig.getDomain();
            const userInfo = this.appConfig.getUserInfo();
            const response = await this.serviceCore.GET(
                `${domain}`,
                `order/user/${userInfo.id}/${order_id}/read`,
            );

            return response;
        } catch (error) {
            throw error;
        }
    }
}