import { Injectable } from "@angular/core";
import { NotificationService } from "../service/notification.service";
import { NotificationModel } from "../model/notification/notification.model";
import { PagingModel } from "../../common/model/paging.model";

@Injectable()
export class CouponManagement {

    constructor(
        private notificationService: NotificationService
    ) { }

    fetchNotificationByUser = async (page: number, limit: number): Promise<Map<string, any>> => {
        try {
            const result = await this.notificationService.fetchNotificationByUser(page, limit);
            const response = new Map<string, any>([]);
            const notifications: NotificationModel[] = result?.notifications?.map(
                (notification: any) => new NotificationModel().convertObj(notification)
            ) ?? [];
            const pagination = new PagingModel();
            pagination.currentPage = result?.pagination?.currentPage ?? 0;
            pagination.totalPage = result?.pagination?.totalPages ?? 1;
            pagination.totalItems = result?.pagination?.totalItems ?? 0;
            pagination.itemsPerPage = result?.pagination?.limit ?? 10;

            response.set('notifications', notifications);
            response.set('pagination', pagination);
            response.set('unreadCount', result?.unreadCount);
            return response;
        } catch (error) {
            throw error;
        }
    }

    fetchUnreadNotificationCount = async (): Promise<number> => {
        try {
            const result = await this.notificationService.fetchUnreadNotificationCount();
            return result?.unreadCount ?? 0;
        } catch (error) {
            throw error;
        }
    }

    markNotificationAsRead = async (notification_id: number) => {
        try {
            await this.notificationService.markNotificationAsRead(notification_id);
            return true;
        } catch (error) {
            throw error;
        }
    }

}