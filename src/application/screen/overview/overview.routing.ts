import { Routes } from "@angular/router"
import { ShopDetailsComponent } from "./owner/shop-details/shop-details.component"

export const OverviewUrl = {
    ADMIN_OVERVIEW: 'admin/overview',
    OWNER_OVERVIEW: 'owner/overview'
}

export const OverviewRouting: Routes = [
    {
        path: OverviewUrl.OWNER_OVERVIEW + '/:id',
        component: ShopDetailsComponent,
    }
]