export class ProductModel {
    id?: number;
    shopId?: number;
    product_name?: string;
    origin?: string;
    description?: string;
    unit_price?: string;
    sold_quantity?: number;
    image_urls?: ProductImagesModel[];
    createdAt?: string;

    constructor(
        id?: number,
        shopId?: number,
        product_name?: string,
        origin?: string,
        description?: string,
        unit_price?: string,
        sold_quantity?: number,
        image_urls?: ProductImagesModel[],
        createdAt?: string,
    ) {
        this.id = id ?? 0;
        this.shopId = shopId ?? 0;
        this.product_name = product_name ?? "";
        this.origin = origin ?? "Việt Nam";
        this.description = description ?? "";
        this.unit_price = unit_price ?? "0.00";
        this.sold_quantity = sold_quantity ?? 0;
        this.image_urls = image_urls ?? [];
        this.createdAt = createdAt ?? "";
    }

    convertObj(obj: any) {
        const model = new ProductModel();
        model.id = obj.id;
        model.shopId = obj.shopId;
        model.product_name = obj.product_name;
        model.origin = obj.origin;
        model.unit_price = obj.unit_price;
        model.description = obj.description;
        model.sold_quantity = obj.sold_quantity;
        model.image_urls = obj.product_images.map((item: any) => {
            const productImages = new ProductImagesModel();
            productImages.id = item.id;
            productImages.productId = item.productId;
            productImages.image_url = item.image_url;
            return productImages;
        });
        model.createdAt = obj.createdAt;

        return model;
    }

    convertObjToAdd(obj: ProductModel) {
        return {
            product_name: obj.product_name,
            origin: obj.origin,
            description: obj.description,
            unit_price: obj.unit_price,
        }
    };

    convertObjToUpdate(obj: ProductModel) {
        return {
            shopId: obj.shopId,
            product_name: obj.product_name,
            origin: obj.origin,
            description: obj.description,
            unit_price: obj.unit_price,
            image_urls: obj.image_urls, // Dùng để xóa ảnh
        }
    }
}

export class ProductImagesModel {
    id?: number;
    productId?: number;
    image_url?: string;

    constructor(
        id?: number,
        productId?: number,
        image_url?: string
    ) {
        this.id = id ?? 0;
        this.productId = productId ?? 0;
        this.image_url = image_url ?? "";
    }
}