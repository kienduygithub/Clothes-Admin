import { Injectable } from "@angular/core";
import { AppConfig } from "../../common/config/app.config";
import { ServiceCore } from "../../common/service/service-core";
import { CategoryModel } from "../model/category.model";

@Injectable()
export class CategoryService {

    constructor(
        private serviceCore: ServiceCore,
        private appConfig: AppConfig
    ) { }

    async fetchCategories(): Promise<any> {
        try {
            const domain = this.appConfig.getDomain();
            const response = await this.serviceCore.GET(
                `${domain}`,
                `category/all`
            );
            return response;
        } catch (error) {
            throw error;
        }
    }

    async fetchCategoryByParentId(parent_id: number): Promise<any> {
        try {
            const domain = this.appConfig.getDomain();
            const response = await this.serviceCore.GET(
                `${domain}`,
                `category/${parent_id}`
            );
            return response;
        } catch (error) {
            throw error;
        }
    }

    async addNewCategory(data: CategoryModel, file: any): Promise<any> {
        try {
            const domain = this.appConfig.getDomain();
            const formData = new FormData();
            const categoryInfo = new CategoryModel().convertModelToAdd(data);
            formData.append('categoryInfo', JSON.stringify(categoryInfo));
            if (file) {
                formData.append('categoryFile', file);
            }

            const response = await this.serviceCore.POST(
                `${domain}`,
                `category`,
                formData
            );
            return response;
        } catch (error) {
            throw error;
        }
    }

    async updateCategory(data: CategoryModel, file: any): Promise<any> {
        try {
            const domain = this.appConfig.getDomain();
            const formData = new FormData();
            const categoryInfo = new CategoryModel().convertModelToUpdate(data);
            formData.append('categoryInfo', JSON.stringify(categoryInfo));
            if (file) {
                formData.append('categoryFile', file);
            }

            const response = await this.serviceCore.PUT(
                `${domain}`,
                `category/${data.id}`,
                formData
            );
            return response;
        } catch (error) {
            throw error;
        }
    }

    async deleteCategory(categoryId: number): Promise<any> {
        try {
            const domain = this.appConfig.getDomain();
            const response = await this.serviceCore.DETELE(
                `${domain}`,
                `category/${categoryId}`,
            );
            return response;
        } catch (error) {
            throw error;
        }
    }

    async addNewSubCategory(data: CategoryModel): Promise<any> {
        try {
            const domain = this.appConfig.getDomain();
            const new_subcategory = new CategoryModel().convertSubCategoryModelToExecute(data);
            const response = await this.serviceCore.POST(
                `${domain}`,
                `category/${data.parentId}/subcategories`,
                new_subcategory
            );
            return response;
        } catch (error) {
            throw error;
        }
    }

    async updateSubCategory(data: CategoryModel): Promise<any> {
        try {
            const domain = this.appConfig.getDomain();
            const subcategory = new CategoryModel().convertSubCategoryModelToExecute(data);
            const response = await this.serviceCore.PUT(
                `${domain}`,
                `category/${data.parentId}/subcategories/${data.id}`,
                subcategory
            );
            return response;
        } catch (error) {
            throw error;
        }
    }

    async deleteSubCategory(parent_id: number, subcategory_id: number): Promise<any> {
        try {
            const domain = this.appConfig.getDomain();
            const response = await this.serviceCore.DETELE(
                `${domain}`,
                `category/${parent_id}/subcategories/${subcategory_id}`,
            );
            return response;
        } catch (error) {
            throw error;
        }
    }
}