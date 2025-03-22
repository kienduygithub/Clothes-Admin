import { Routes } from "@angular/router";
import { CRUCouponComponent } from "./comp/cru-coupon/cru-coupon.component";

export const CouponUrl = {
    COUPON_LIST_URL: 'owner/coupon/list',
    COUPON_VIEW_URL: 'owner/coupon/list/view'
}

export const CouponRouting: Routes = [
    {
        path: CouponUrl.COUPON_VIEW_URL,
        component: CRUCouponComponent,
    }
];