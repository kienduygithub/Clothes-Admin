import { PagingModel } from "../../../common/model/paging.model";
import { NotificationModel } from "./notification.model";

export interface NotificationStoreModel {
    notifications: NotificationModel[];
    isLoaded: boolean;
    pagination: PagingModel;
    unreadCount: number;
}