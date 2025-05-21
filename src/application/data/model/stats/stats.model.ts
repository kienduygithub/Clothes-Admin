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

// API 2
export class CountStatModel {
    pending: number;
    paid: number;
    processing: number;
    shipped: number;
    completed: number;
    canceled: number;
    constructor(
        pending?: number,
        paid?: number,
        processing?: number,
        shipped?: number,
        completed?: number,
        canceled?: number,
    ) {
        this.pending = pending ?? 0;
        this.paid = paid ?? 0;
        this.processing = processing ?? 0;
        this.shipped = shipped ?? 0;
        this.completed = completed ?? 0;
        this.canceled = canceled ?? 0;
    }

    fromJson(data: any) {
        const obj = new CountStatModel();
        obj.pending = data?.pending ?? 0;
        obj.paid = data?.paid ?? 0;
        obj.processing = data?.processing ?? 0;
        obj.shipped = data?.shipped ?? 0;
        obj.completed = data?.completed ?? 0;
        obj.canceled = data?.canceled ?? 0;

        return obj;
    }
}

export class OrderStatModel {
    period: string;
    counts: CountStatModel;

    constructor(
        period?: string,
        counts?: CountStatModel,
    ) {
        this.period = period ?? '';
        this.counts = counts ?? new CountStatModel();
    }

    fromJson(data: any) {
        const obj = new OrderStatModel();
        obj.period = data?.period ?? '';
        obj.counts = data?.counts ?? new CountStatModel();

        return obj;
    }
}

export class OrderActivityMonthlyStatModel {
    month: string | null;
    startDate: string;
    endDate: string;
    orders: OrderStatModel[];

    constructor(
        month?: string | null,
        startDate?: string,
        endDate?: string,
        orders?: OrderStatModel[],
    ) {
        this.month = month ?? null;
        this.startDate = startDate ?? '';
        this.endDate = endDate ?? '';
        this.orders = orders ?? [];
    }

    fromJson(data: any) {
        const obj = new OrderActivityMonthlyStatModel();
        obj.month = data?.month ?? null;
        obj.startDate = data?.startDate ?? '';
        obj.endDate = data?.endDate ?? '';
        obj.orders = data?.orders?.map(
            (order: any) => new OrderStatModel().fromJson(order)
        ) ?? [];

        return obj;
    }
}

export class OrderActivityOverviewModel {
    orders: OrderStatModel[];
    totalOrders: number;
    statusCounts: CountStatModel;

    constructor(
        orders?: OrderStatModel[],
        totalOrders?: number,
        statusCounts?: CountStatModel,
    ) {
        this.orders = orders ?? [];
        this.totalOrders = totalOrders ?? 0;
        this.statusCounts = statusCounts ?? new CountStatModel();
    }

    fromJson(data: any) {
        const obj = new OrderActivityOverviewModel();
        obj.orders = data?.orders?.map(
            (order: any) => new OrderStatModel().fromJson(order)
        ) ?? [];
        obj.totalOrders = data?.totalOrders ?? 0;
        obj.statusCounts = data?.statusCounts ? new CountStatModel().fromJson(data?.statusCounts) : new CountStatModel();

        return obj
    }
}

// API 1
export class ShopStatModel {
    id: number;
    shop_name: string;
    statusChangedAt: string; // ISO

    constructor(
        id?: number,
        shop_name?: string,
        statusChangedAt?: string, // ISO
    ) {
        this.id = id ?? 0;
        this.shop_name = shop_name ?? '';
        this.statusChangedAt = statusChangedAt ?? ''; // ISO
    }

    fromJson(data: any) {
        const obj = new ShopStatModel();
        obj.id = data?.id ?? 0;
        obj.shop_name = data?.shop_name ?? '';
        obj.statusChangedAt = data?.statusChangedAt ?? ''; // ISO

        return obj;
    }
}

export class ShopMonthlyStatModel {
    month: string | null;
    startDate: string;
    endDate: string;
    totalNewShops: number;
    newShops: ShopStatModel[];

    constructor(
        month?: string | null,
        startDate?: string,
        endDate?: string,
        totalNewShops?: number,
        newShops?: ShopStatModel[],
    ) {
        this.month = month ?? '';
        this.startDate = startDate ?? '';
        this.endDate = endDate ?? '';
        this.totalNewShops = totalNewShops ?? 0;
        this.newShops = newShops ?? [];
    }

    fromJson(data: any) {
        const obj = new ShopMonthlyStatModel();
        obj.month = data?.month ?? '';
        obj.startDate = data?.startDate ?? '';
        obj.endDate = data?.endDate ?? '';
        obj.totalNewShops = data?.totalNewShops ?? 0;
        obj.newShops = data?.newShops?.map(
            (shop: any) => new ShopStatModel().fromJson(shop)
        ) ?? [];

        return obj
    }
}

export class ShopOverviewModel {
    totalNewShops: number;
    newShops: ShopStatModel[];
    periods: PeriodShopModel[];

    constructor(
        totalNewShops?: number,
        newShops?: ShopStatModel[],
        periods?: PeriodShopModel[]
    ) {
        this.totalNewShops = totalNewShops ?? 0;
        this.newShops = newShops ?? [];
        this.periods = periods ?? [];
    }

    fromJson(data: any) {
        const obj = new ShopOverviewModel();
        obj.totalNewShops = data?.totalNewShops ?? 0;
        obj.newShops = data?.newShops?.map(
            (shop: any) => new ShopStatModel().fromJson(shop)
        ) ?? [];
        obj.periods = data?.periods?.map(
            (period: any) => new PeriodShopModel().fromJson(period)
        ) ?? [];

        return obj;
    }
}

export class PeriodShopModel {
    period: string;
    totalNewShops: number;
    newShops: ShopStatModel[];

    constructor(
        period?: string,
        totalNewShops?: number,
        newShops?: ShopStatModel[],
    ) {
        this.period = period ?? '';
        this.totalNewShops = totalNewShops ?? 0;
        this.newShops = newShops ?? []
    }

    fromJson(data: any) {
        const obj = new PeriodShopModel();
        obj.period = data?.period ?? '';
        obj.totalNewShops = data?.totalNewShops ?? 0;
        obj.newShops = data?.newShops?.map(
            (shop: any) => new ShopStatModel().fromJson(shop)
        ) ?? []

        return obj;
    }
}