import { UserModel } from "./user.model";

export class ShopModel {
    id?: number;
    shop_name?: string;
    logo_url?: string;
    background_url?: string;
    contact_email?: string;
    contact_address?: string;
    description?: string;
    users?: UserModel[];

    constructor(
        id?: number,
        shop_name?: string,
        logo_url?: string,
        background_url?: string,
        contact_email?: string,
        contact_address?: string,
        description?: string,
        users?: UserModel[],
    ) {
        this.id = id ?? 0;
        this.shop_name = shop_name ?? '';
        this.logo_url = logo_url ?? '';
        this.background_url = background_url ?? '';
        this.contact_email = contact_email ?? '';
        this.contact_address = contact_address ?? '';
        this.users = users ?? [];
        this.description = description ?? '';
    }

    convertObj(data: any) {
        const model = new ShopModel();

        model.id = data.id;
        model.shop_name = data.shop_name;
        model.logo_url = data.logo_url;
        model.background_url = data.background_url;
        model.contact_email = data.contact_email;
        model.contact_address = data.contact_address;
        model.description = data.description;
        model.users = data?.users.map((user: any) => new UserModel().convertObj(user));

        return model;
    }

    convertModelToAdd(data: ShopModel) {
        return {
            shop_name: data.shop_name,
            contact_email: data.contact_email,
            contact_address: data.contact_address,
            description: data.description,
        }
    }

    convertModelToUpdate(data: ShopModel) {
        return {
            shop_name: data.shop_name,
            contact_email: data.contact_email,
            contact_address: data.contact_address,
            description: data.description,
        }
    }
}