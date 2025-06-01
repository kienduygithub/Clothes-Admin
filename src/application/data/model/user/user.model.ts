import { ShopModel } from "../shop.model";

export class UserModel {
    id?: number;
    name?: string;
    email?: string;
    password?: string;
    phone?: string;
    gender?: number;
    address?: string;
    image_url?: string;
    shopId?: number;
    roles?: string; // "Admin", "Customer", "Owner",
    createdAt?: string;
    shop: ShopModel | null;

    constructor(
        id?: number,
        name?: string,
        email?: string,
        password?: string,
        phone?: string,
        gender?: number,
        address?: string,
        image_url?: string,
        shopId?: number,
        roles?: string, // "Admin", "Customer", "Owner",
        createdAt?: string,
        shop?: ShopModel,
    ) {
        this.id = id ?? 0;
        this.name = name ?? "";
        this.email = email ?? "";
        this.password = password ?? "";
        this.phone = phone ?? "";
        this.gender = gender ?? 1;
        this.address = address ?? "";
        this.image_url = image_url ?? "";
        this.shopId = shopId ?? 0;
        this.roles = roles; // "Admin", "Customer", "Owner",
        this.shop = shop ?? null;
        this.createdAt = createdAt ?? "";
    }

    convertObj(obj: any) {
        const model = new UserModel();
        model.id = obj.id;
        model.name = obj.name;
        model.email = obj.email;
        model.password = obj.password;
        model.phone = obj.phone;
        model.gender = obj.gender;
        model.address = obj.address;
        model.image_url = obj.image_url;
        model.shopId = obj.shopId;
        model.roles = obj.roles;
        model.createdAt = obj.createdAt;
        model.shop = obj?.shop ? new ShopModel().convertObj(obj.shop) : null;

        return model;
    }

    convertModelToAdd(data: UserModel) {
        return {
            name: data.name,
            email: data.email,
            password: data.password,
            phone: data.phone,
            gender: data.gender,
            address: data.address,
            shopId: data.shopId === 0 ? undefined : data.shopId,
            roles: data.roles,
        }
    }

    convertModelToUpdate(data: UserModel) {
        return {
            name: data.name,
            email: data.email,
            phone: data.phone,
            gender: data.gender,
            address: data.address,
            shopId: data.shopId === 0 ? undefined : data.shopId,
            roles: data.roles,
        }
    }
}