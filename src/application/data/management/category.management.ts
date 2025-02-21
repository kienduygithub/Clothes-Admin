import { Injectable } from "@angular/core";
import { CategoryModel } from "../model/category.model";
import { CategoryService } from "../service/category.service";

@Injectable()
export class CategoryManagement {

    constructor(
        private categoryService: CategoryService
    ) { }

    async fetchCategories() {
        try {
            const result = await this.categoryService.fetchCategories();
            const response = result?.body?.categories?.map(
                (category: any) => new CategoryModel().convertObj(category)
            );
            return response;
        } catch (error) {
            throw error;
        }
    }

    async fetchCategoryByParentId(parent_id: number) {
        try {
            const result = await this.categoryService.fetchCategoryByParentId(parent_id);
            const response = result?.body?.categories?.map(
                (category: any) => new CategoryModel().convertObj(category)
            );
            return response[0];
        } catch (error) {
            throw error;
        }
    }

    async addNewCategory(data: CategoryModel, file: any) {
        try {
            const result = await this.categoryService.addNewCategory(data, file);
            const response = result?.body?.categories?.map(
                (category: any) => new CategoryModel().convertObj(category)
            );
            return response[0];
        } catch (error) {
            throw error;
        }
    }

    async updateCategory(data: CategoryModel, file: any) {
        try {
            const result = await this.categoryService.updateCategory(data, file);
            const response = result?.body?.categories?.map(
                (category: any) => new CategoryModel().convertObj(category)
            );
            return response[0];
        } catch (error) {
            throw error;
        }
    }

    async deleteCategory(categoryId: number) {
        try {
            await this.categoryService.deleteCategory(categoryId);
            return true;
        } catch (error) {
            throw error;
        }
    }

    async addNewSubCategory(data: CategoryModel) {
        try {
            const result = await this.categoryService.addNewSubCategory(data);
            const response = new CategoryModel().convertObj(result?.body?.subCategory);
            return response;
        } catch (error) {
            throw error;
        }
    }

    async updateSubCategory(data: CategoryModel) {
        try {
            const result = await this.categoryService.updateSubCategory(data);
            const response = new CategoryModel().convertSubObj(result?.body?.subCategory);
            return response;
        } catch (error) {
            throw error;
        }
    }

    async deleteSubCategory(parent_id: number, subcategory_id: number) {
        try {
            await this.categoryService.deleteSubCategory(parent_id, subcategory_id);
            return true;
        } catch (error) {
            throw error;
        }
    }
}