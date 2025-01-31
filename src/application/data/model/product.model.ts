export class ProductModel {
    id?: number;
    shopId?: number;
    product_name?: string;
    origin?: string;
    description?: string;
    unit_price?: string;
    sold_quantity?: number;
    image_urls?: ProductImagesModel[];
    variants?: ProductVariantModel[];
    stock_product?: number;
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
        variants?: ProductVariantModel[],
        stock_product?: number,
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
        this.variants = variants ?? [];
        this.stock_product = stock_product ?? 0;
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
        model.variants = obj.variants?.map((variant: any) => new ProductVariantModel().convertObj(variant)) ?? [];
        model.stock_product = model.variants?.reduce((stock: number, curr: ProductVariantModel) => {
            return stock + curr.stock_quantity!
        }, 0);

        model.createdAt = obj.createdAt;

        return model;
    }

    convertObjToAdd(obj: ProductModel) {
        return {
            product_name: obj.product_name,
            origin: obj.origin,
            description: obj.description,
            unit_price: obj.unit_price,
            variants: obj.variants
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
            variants: obj.variants
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

export class ProductVariantModel {
    id?: number;
    productId?: number;
    colorId?: number;
    sizeId?: number;
    image_url?: string;
    sku?: string;
    stock_quantity?: number;

    constructor(
        id?: number,
        productId?: number,
        colorId?: number,
        sizeId?: number,
        image_url?: string,
        sku?: string,
        stock_quantity?: number,
    ) {
        this.id = id ?? 0;
        this.productId = productId ?? 0;
        this.colorId = colorId ?? 0;
        this.sizeId = sizeId ?? 0;
        this.image_url = image_url ?? '';
        this.sku = sku ?? '';
        this.stock_quantity = stock_quantity ?? 0;
    }

    convertObj(data: any) {
        const model = new ProductVariantModel();
        model.id = data.id;
        model.productId = data.productId;
        model.colorId = data.colorId;
        model.sizeId = data.sizeId;
        model.image_url = data.image_url;
        model.sku = data.sku;
        model.stock_quantity = data.stock_quantity;

        return model;
    }
}