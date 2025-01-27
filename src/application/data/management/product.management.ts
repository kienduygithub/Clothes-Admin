import { Injectable } from "@angular/core";
import { ProductService } from "../service/product.service";
import { ProductModel } from "../model/product.model";

@Injectable()
export class ProductManagement {

    constructor(
        private productService: ProductService
    ) { }

    async createNewProduct(data: ProductModel, files: any) {
        try {
            await this.productService.createNewProduct(data, files);
        } catch (error) {
            throw error;
        }
    }
}