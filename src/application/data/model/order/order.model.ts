import { OrderStatus } from "../../../common/resource/status";
import { formatDate } from "../../../common/utils/time.helper";
import { AddressModel } from "../address/address.model";
import { CouponModel } from "../coupon/coupon.model";
import { ProductVariantModel } from "../product.model";
import { ShopModel } from "../shop.model";
import { UserModel } from "../user/user.model";

export class OrderModel {
    id: number;
    order_shop_id: number;
    user: UserModel | undefined;
    address: AddressModel | undefined;
    coupon: CouponModel | undefined;
    subtotal: number;
    discount: number;
    final_total: number;
    status: string;
    status_changed_at: string | null;
    payment_date: string | null;
    created_at: string | null;
    order_items: OrderItemModel[];

    constructor(
        id?: number,
        order_shop_id?: number,
        user?: UserModel,
        address?: AddressModel,
        coupon?: CouponModel,
        subtotal?: number,
        discount?: number,
        final_total?: number,
        status?: string,
        status_changed_at?: string | null,
        payment_date?: string | null,
        created_at?: string | null,
        order_items?: OrderItemModel[],
    ) {
        this.id = id ?? 0;
        this.order_shop_id = order_shop_id ?? 0;
        this.user = user ?? undefined;
        this.address = address ?? undefined;
        this.coupon = coupon ?? undefined;
        this.subtotal = subtotal ?? 0;
        this.discount = discount ?? 0;
        this.final_total = final_total ?? 0;
        this.status = status ?? '';
        this.status_changed_at = status_changed_at ?? null;
        this.payment_date = payment_date ?? null;
        this.created_at = created_at ?? null;
        this.order_items = order_items ?? [];
    }

    convertObj(data: any) {
        const model = new OrderModel();
        model.id = data?.id ?? 0;
        model.order_shop_id = data?.order_shop_id ?? 0;
        model.user = data?.user ? new UserModel().convertObj(data.user) : undefined;
        model.address = data?.address ? new AddressModel().convertObj(data.address) : undefined;
        model.coupon = data?.coupon ? new CouponModel().fromJson(data.coupon) : undefined;
        model.subtotal = data?.subtotal ?? 0;
        model.discount = data?.discount ?? 0;
        model.final_total = data?.final_total ?? 0;
        model.status = data?.status ?? OrderStatus.PENDING;
        model.status_changed_at = data?.status_changed_at ? formatDate(new Date(data.status_changed_at)) : null;
        model.payment_date = data?.payment_date ? formatDate(new Date(data.payment_date)) : null;
        model.created_at = data?.created_at ? formatDate(new Date(data.created_at)) : null;
        model.order_items = data?.order_items?.map(
            (item: any) => new OrderItemModel().convertObj(item)
        ) ?? [];
        return model;
    }
}

export class OrderItemModel {
    id: number;
    product_variant: ProductVariantModel | undefined;
    quantity: number;

    constructor(
        id?: number,
        product_variant?: ProductVariantModel,
        quantity?: number,
    ) {
        this.id = id ?? 0;
        this.product_variant = product_variant ?? undefined;
        this.quantity = quantity ?? -1;
    }

    convertObj(data: any) {
        const obj = new OrderItemModel();
        obj.id = data?.id ?? 0;
        obj.product_variant = data?.product_variant ? new ProductVariantModel().convertObj(data.product_variant) : undefined;
        obj.quantity = data?.quantity;

        return obj;
    }
}