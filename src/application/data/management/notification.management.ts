import { Injectable } from "@angular/core";
import { NotificationService } from "../service/notification.service";
import { NotificationModel } from "../model/notification/notification.model";
import { PagingModel } from "../../common/model/paging.model";
import { NotificationStore } from "../stores/notification.store";

@Injectable()
export class NotificationManagement {

    constructor(
        private notificationService: NotificationService,
        private notificationStore: NotificationStore
    ) { }

    fetchNotificationByUser = async (page: number, limit: number): Promise<Map<string, any>> => {
        try {
            const result = await this.notificationService.fetchNotificationByUser(page, limit);
            const response = new Map<string, any>([]);
            const notifications: NotificationModel[] = result?.body?.notifications?.map(
                (notification: any) => new NotificationModel().convertObj(notification)
            ) ?? [];
            this.notificationStore.saveNotifications(notifications);
            this.notificationStore.changeIsLoaded(true);
            this.notificationStore.saveUnreadCount(result?.body?.unreadCount);

            const pagination = new PagingModel();
            pagination.currentPage = result?.body?.pagination?.currentPage ?? 0;
            pagination.totalPage = result?.body?.pagination?.totalPages ?? 1;
            pagination.totalItems = result?.body?.pagination?.totalItems ?? 0;
            pagination.itemsPerPage = result?.body?.pagination?.limit ?? 10;

            response.set('notifications', notifications);
            response.set('pagination', pagination);
            response.set('unreadCount', result?.body?.unreadCount);
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