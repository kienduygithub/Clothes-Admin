import { Injectable } from "@angular/core";
import { ProductService } from "../service/product.service";
import { ProductModel } from "../model/product.model";

@Injectable()
export class ProductManagement {

    constructor(
        private productService: ProductService
    ) { }

    async createNewProduct(data: ProductModel, files: any, variantFiles: any) {
        try {
            await this.productService.createNewProduct(data, files, variantFiles);
            return true;
        } catch (error) {
            throw error;
        }
    }

    async updateProduct(
        data: ProductModel,
        files: any,
        variantFiles: any,
        updatedIds: number[],
        updatedFiles: any,
        deletedIds: number[]
    ) {
        try {
            await this.productService.updateProduct(data, files, variantFiles, updatedIds, updatedFiles, deletedIds);
            return true;
        } catch (error) {
            throw error;
        }
    }

    async fetchAllProductsByShopId(shopId: number) {
        try {
            const result = await this.productService.fetchAllProductByShopId(shopId);
            const response = result?.body?.products?.map((product: any) => new ProductModel().convertObj(product));
            return response;
        } catch (error) {
            throw error;
        }
    }

    async fetchProductById(productId: number) {
        try {
            const result = await this.productService.fetchProductById(productId);
            const response = result?.body?.products?.map((product: any) => new ProductModel().convertObj(product));
            return response[0];
        } catch (error) {
            throw error;
        }
    }
}