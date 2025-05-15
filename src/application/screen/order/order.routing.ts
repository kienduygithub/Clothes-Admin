import { Routes } from "@angular/router";
import { OrderShopDetailComponent } from "./order-shop-detail/order-shop-detail.component";

export const OrderURL = {
    ORDER: 'owner/order',
    LIST_ORDER: 'owner/order/list',
    DETAIL_ORDER: 'owner/order/detail'
}

export const OrderRouting: Routes = [
    { path: OrderURL.DETAIL_ORDER, component: OrderShopDetailComponent, title: 'Chi tiết đơn hàng' }
];