export class ProductListedModel {
    period: string;
    productsListed: number;
    topProducts: TopProductModel[];
    lowRatedProducts: LowRatedProductModel[];

    constructor(
        period?: string,
        productsListed?: number,
        topProducts?: TopProductModel[],
        lowRatedProducts?: LowRatedProductModel[],
    ) {
        this.period = period ?? '';
        this.productsListed = productsListed ?? 0;
        this.topProducts = topProducts ?? [];
        this.lowRatedProducts = lowRatedProducts ?? [];
    }

    fromJson(data: any) {
        const obj = new ProductListedModel();
        obj.period = data?.period ?? '';
        obj.productsListed = data?.productsListed ?? 0;
        obj.topProducts = data?.topProducts?.map((product: any) => new TopProductModel().fromJson(product)) ?? [];
        obj.lowRatedProducts = data?.lowRatedProducts?.map((product: any) => new LowRatedProductModel().fromJson(product)) ?? [];

        return obj;
    }
}

export class TopProductModel {
    id: number;
    product_name: string;
    sold_quantity: number;

    constructor(
        id?: number,
        product_name?: string,
        sold_quantity?: number,
    ) {
        this.id = id ?? 0;
        this.product_name = product_name ?? '';
        this.sold_quantity = sold_quantity ?? 0;
    }

    fromJson(data: any) {
        const obj = new TopProductModel();
        obj.id = data?.id ?? 0;
        obj.product_name = data?.product_name ?? '';
        obj.sold_quantity = data?.sold_quantity ?? 0;

        return obj;
    }
}

export class LowRatedProductModel {
    id: number;
    product_name: string;
    avgRating: number;

    constructor(
        id?: number,
        product_name?: string,
        avgRating?: number
    ) {
        this.id = id ?? 0;
        this.product_name = product_name ?? '';
        this.avgRating = avgRating ?? 0;
    }

    fromJson(data: any) {
        const obj = new LowRatedProductModel();
        obj.id = data?.id ?? 0;
        obj.product_name = data?.product_name ?? '';
        obj.avgRating = data?.avgRating ?? 0;

        return obj;
    }
}

export class ProductPerformanceMonthlyStatModel {
    month: string | null;
    startDate: string;
    endDate: string;
    productsListed: ProductListedModel[];
    totalProductsListed: number;
    topProducts: TopProductModel[];
    lowRatedProducts: LowRatedProductModel[];

    constructor(
        month?: string | null,
        startDate?: string,
        endDate?: string,
        productsListed?: ProductListedModel[],
        totalProductsListed?: number,
        topProducts?: TopProductModel[],
        lowRatedProducts?: LowRatedProductModel[],
    ) {
        this.month = month ?? null;
        this.startDate = startDate ?? '';
        this.endDate = endDate ?? '';
        this.productsListed = productsListed ?? [];
        this.totalProductsListed = totalProductsListed ?? 0;
        this.topProducts = topProducts ?? [];
        this.lowRatedProducts = lowRatedProducts ?? [];
    }

    fromJson(data: any) {
        const obj = new ProductPerformanceMonthlyStatModel();
        obj.month = data?.month ?? null;
        obj.startDate = data?.startDate ?? '';
        obj.endDate = data?.endDate ?? '';
        obj.productsListed = data?.productsListed?.map((product: any) => new ProductListedModel().fromJson(product)) ?? [];
        obj.totalProductsListed = data?.totalProductsListed ?? 0;
        obj.topProducts = data?.topProducts?.map((product: any) => new TopProductModel().fromJson(product)) ?? [];
        obj.lowRatedProducts = data?.lowRatedProducts?.map((product: any) => new LowRatedProductModel().fromJson(product)) ?? [];

        return obj;
    }
}

export class ProductPerformanceOverviewModel {
    productsListed: ProductListedModel[];
    totalProductsListed: number;
    topProducts: TopProductModel[];
    lowRatedProducts: LowRatedProductModel[];

    constructor(
        productsListed?: ProductListedModel[],
        totalProductsListed?: number,
        topProducts?: TopProductModel[],
        lowRatedProducts?: LowRatedProductModel[],
    ) {
        this.productsListed = productsListed ?? [];
        this.totalProductsListed = totalProductsListed ?? 0;
        this.topProducts = topProducts ?? [];
        this.lowRatedProducts = lowRatedProducts ?? [];
    }

    fromJson(data: any) {
        const obj = new ProductPerformanceOverviewModel();
        obj.productsListed = data?.productsListed?.map((product: any) => new ProductListedModel().fromJson(product)) ?? [];
        obj.totalProductsListed = data?.totalProductsListed ?? 0;
        obj.topProducts = data?.topProducts?.map((product: any) => new TopProductModel().fromJson(product)) ?? [];
        obj.lowRatedProducts = data?.lowRatedProducts?.map((product: any) => new LowRatedProductModel().fromJson(product)) ?? [];

        return obj;
    }
}