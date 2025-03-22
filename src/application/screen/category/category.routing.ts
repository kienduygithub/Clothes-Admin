import { Routes } from "@angular/router";
import { CRUCategoryComponent } from "./comp/cru-category/cru-category.component";

export const CategoryUrl = {
    CATEGORY_URL: 'admin/category/list',
    VIEW_CATEGORY_URL: 'admin/category/view'
};

export const CategoryRouting: Routes = [
    {
        path: CategoryUrl.VIEW_CATEGORY_URL,
        component: CRUCategoryComponent
    }
];