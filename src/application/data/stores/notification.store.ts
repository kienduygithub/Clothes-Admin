import { Injectable } from "@angular/core";
import { StoreConfig } from "@datorama/akita";
import { StateStoreCore } from "../../common/service/state/core/state-store.core";
import { NotificationStoreModel } from "../model/notification/notification.store.model";
import { PagingModel } from "../../common/model/paging.model";
import { NotificationModel } from "../model/notification/notification.model";

@Injectable({ providedIn: 'root' })
@StoreConfig({ name: 'user', resettable: true })
export class NotificationStore extends StateStoreCore<NotificationStoreModel> {

    constructor() {
        super({
            notifications: [],
            isLoaded: false,
            pagination: {
                currentPage: 1,
                totalPage: 0,
                totalItems: 0,
                itemsPerPage: 10,
            } as PagingModel,
            unreadCount: 0
        });
    }

    saveNotifications(notifications: NotificationModel[]) {
        this.setValueStore({
            ...this.getValueStore(),
            notifications: notifications
        })
    }

    fetchListNotification() {
        return this.getValueStore().notifications;
    }

    saveUnreadCount(unreadCount: number) {
        this.setValueStore({
            ...this.getValueStore(),
            unreadCount: unreadCount
        })
    }

    fetchUnreadCount() {
        return this.getValueStore().unreadCount;
    }

    savePagination(pagination: PagingModel) {
        this.setValueStore({
            ...this.getValueStore(),
            pagination: pagination
        })
    }

    fetchPagination() {
        return this.getValueStore().pagination;
    }

    changeIsLoaded(isLoaded: boolean) {
        this.setValueStore({
            ...this.getValueStore(),
            isLoaded: isLoaded
        });
    }

    fetchIsLoaded() {
        return this.getValueStore().isLoaded;
    }

    resetStore() {
        this.resetValueStore();
    }
}