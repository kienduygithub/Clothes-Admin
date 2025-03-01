import { Injectable } from "@angular/core";
import { StoreConfig } from "@datorama/akita";
import { StateStoreCore } from "../../common/service/state/core/state-store.core";
import { UserStoreModel } from "../model/user/user.store.model";

@Injectable({ providedIn: 'root' })
@StoreConfig({ name: 'user', resettable: true })
export class UserStore extends StateStoreCore<UserStoreModel> {

    constructor() {
        super({
            id: 0,
            name: '',
            image_url: '',
            roles: '',
            shopId: 0
        });
    }

    setUser(user: UserStoreModel) {
        this.setValueStore(user);
    }

    getUser() {
        return this.getValueStore();
    }

    getSelectUser() {
        return this.getSelectStore();
    }

    getIdUser() {
        return this.getValueStore().id;
    }

    getNameUser() {
        return this.getValueStore().name;
    }

    getImageUser() {
        return this.getValueStore().image_url;
    }

    getRoleUser() {
        return this.getValueStore().roles;
    }

    getShopIdUser() {
        return this.getValueStore().shopId;
    }

    resetUser() {
        this.resetValueStore();
    }
}