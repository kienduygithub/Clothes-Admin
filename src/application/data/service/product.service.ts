import { Injectable } from "@angular/core";
import { AppConfig } from "../../common/config/app.config";
import { ServiceCore } from "../../common/service/service-core";
import { ProductModel } from "../model/product.model";

@Injectable()
export class ProductService {

    constructor(
        private serviceCore: ServiceCore,
        private appConfig: AppConfig
    ) { }

    async createNewProduct(
        data: ProductModel,
        files: any,
        variantFiles: any
    ): Promise<any> {
        try {
            const domain = this.appConfig.getDomain();
            const basicInfo = new ProductModel().convertObjToAdd(data);
            const formData = new FormData();
            formData.append('basicInfo', JSON.stringify(basicInfo));
            for (let i = 0; i < files.length; i++) {
                formData.append('infoImages', files[i]);
            }
            for (let i = 0; i < variantFiles.length; i++) {
                formData.append('variantImages', variantFiles[i]);
            }
            const response = await this.serviceCore.POST(
                `${domain}`,
                `product/?shopId=${data.shopId}`,
                formData
            );
            return response;
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
    ): Promise<any> {
        try {
            const domain = this.appConfig.getDomain();
            const basicInfo = new ProductModel().convertObjToUpdate(data);
            const formData = new FormData();
            formData.append('basicInfo', JSON.stringify(basicInfo));
            formData.append('updatedIds', JSON.stringify(updatedIds));
            formData.append('deletedIds', JSON.stringify(deletedIds));
            for (let i = 0; i < files.length; i++) {
                formData.append('infoImages', files[i]);
            }
            for (let i = 0; i < variantFiles.length; i++) {
                formData.append('variantImages', variantFiles[i]);
            }
            for (let i = 0; i < updatedFiles.length; i++) {
                formData.append('variantUpdateImages', updatedFiles[i]);
            }
            const response = this.serviceCore.PATCH(
                `${domain}`,
                `product/${data.id}`,
                formData
            );
            return response;
        } catch (error) {
            throw error;
        }
    }

    async fetchAllProductByShopId(shopId: number): Promise<any> {
        try {
            const domain = this.appConfig.getDomain();
            const response = await this.serviceCore.GET(
                `${domain}`,
                `product/?shopId=${shopId}`
            );
            return response;
        } catch (error) {
            throw error;
        }
    }

    async fetchProductById(productId: number): Promise<any> {
        try {
            const domain = this.appConfig.getDomain();
            const response = await this.serviceCore.GET(
                `${domain}`,
                `product/${productId}`
            );
            return response;
        } catch (error) {
            throw error;
        }
    }

    async deleteProductById(productId: number): Promise<any> {
        try {
            const domain = this.appConfig.getDomain();
            const response = await this.serviceCore.DETELE(
                `${domain}`,
                `product/${productId}`
            );
            return response;
        } catch (error) {
            throw error;
        }
    }
}