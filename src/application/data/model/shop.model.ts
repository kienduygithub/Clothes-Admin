import { ShopStatus } from "../../common/resource/status";
import { ProductModel } from "./product.model";
import { UserModel } from "./user/user.model";

export class ShopModel {
    id?: number;
    shop_name?: string;
    logo_url?: string;
    background_url?: string;
    contact_email?: string;
    contact_address?: string;
    description?: string;
    user?: UserModel;
    products?: ProductModel[];
    stock_quantities?: number;
    status?: string;
    createdAt?: string;

    constructor(
        id?: number,
        shop_name?: string,
        logo_url?: string,
        background_url?: string,
        contact_email?: string,
        contact_address?: string,
        description?: string,
        user?: UserModel,
        products?: ProductModel[],
        stock_quantities?: number,
        status?: string,
        createdAt?: string,
    ) {
        this.id = id ?? 0;
        this.shop_name = shop_name ?? '';
        this.logo_url = logo_url ?? '';
        this.background_url = background_url ?? '';
        this.contact_email = contact_email ?? '';
        this.contact_address = contact_address ?? '';
        this.user = user;
        this.description = description ?? '';
        this.products = products ?? [];
        this.stock_quantities = stock_quantities ?? 0;
        this.status = status ?? ShopStatus.ACTIVE;
        this.createdAt = createdAt;
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
        model.user = data.user ? new UserModel().convertObj(data.user) : undefined;
        model.products = data.products?.map((product: any) => new ProductModel().convertObj(product));
        model.stock_quantities = data?.total_stock ?? 0;
        model.status = data.status ?? ShopStatus.ACTIVE;
        model.createdAt = data.createdAt;

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