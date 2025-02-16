import { Routes } from "@angular/router";
import { CRUCategoryComponent } from "./comp/cru-category/cru-category.component";

export const CategoryUrl = {
    CATEGORY_URL: 'category/list',
    VIEW_CATEGORY_URL: 'category/list/view'
};

export const CategoryRouting: Routes = [
    {
        path: CategoryUrl.VIEW_CATEGORY_URL,
        component: CRUCategoryComponent
    }
];