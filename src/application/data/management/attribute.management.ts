import { Injectable } from "@angular/core";
import { AttributeService } from "../service/attribute.service";
import { SizeModel } from "../model/attribute/size.model";
import { ColorModel } from "../model/attribute/color.model";

@Injectable()
export class AttributeManagement {

    constructor(
        private attributeService: AttributeService
    ) { }

    async fetchAllColors() {
        try {
            const result = await this.attributeService.fetchAllColors();
            const response = result?.body?.colors?.map((color: any) => new ColorModel().convertObj(color));
            return response;
        } catch (error) {
            throw error;
        }
    }

    async fetchAllSizes() {
        try {
            const result = await this.attributeService.fetchAllSizes();
            const response = result?.body?.sizes?.map((size: any) => new SizeModel().convertObj(size));
            return response;
        } catch (error) {
            throw error;
        }
    }
}