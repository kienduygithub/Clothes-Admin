import { ColorModel } from "../attribute/color.model";
import { SizeModel } from "../attribute/size.model";

// API 1
export class OverviewStatsModel {
    totalRevenue: number;
    totalOrders: number;
    totalSoldProducts: number;
    totalCustomers: number;
    orderStatusCounts: {
        pending: number,
        paid: number,
        shipped: number,
        completed: number,
        canceled: number
    }

    constructor(
        totalRevenue: number,
        totalOrders: number,
        totalSoldProducts: number,
        totalCustomers: number,
        orderStatusCounts: {
            pending: number,
            paid: number,
            shipped: number,
            completed: number,
            canceled: number
        }
    ) {
        this.totalRevenue = totalRevenue ?? 0;
        this.totalOrders = totalOrders ?? 0;
        this.totalSoldProducts = totalSoldProducts ?? 0;
        this.totalCustomers = totalCustomers ?? 0;
        this.orderStatusCounts = orderStatusCounts ?? {
            pending: 0,
            paid: 0,
            shipped: 0,
            completed: 0,
            canceled: 0
        };
    }
}

// API 2
export class RevenuePeriodModel {
    period: string; // YYYY-MM-DD (ngày) hoặc YYYY-WW/YYYY-MM (tuần/tháng)
    revenue: number;

    constructor(
        period: string,
        revenue: number
    ) {
        this.period = period ?? '';
        this.revenue = revenue ?? 0;
    }
}

export class RevenueStatsModel {
    revenues: RevenuePeriodModel[];
    totalRevenue: number;

    constructor(
        revenues: RevenuePeriodModel[],
        totalRevenue: number,
    ) {
        this.revenues = revenues ?? [];
        this.totalRevenue = totalRevenue ?? 0;
    }

    formatPeriod(period: string, groupBy: 'day' | 'week' | 'month'): string {
        if (groupBy === 'day') {
            return new Date(period).toLocaleDateString('vi-VN');
        } else if (groupBy === 'week') {
            return `Tuần ${period.split('-')[1]} ${period.split('-')[0]}`; // Ví dụ: Tuần 18 2025
        } else {
            return `Tháng ${period.split('-')[1]} ${period.split('-')[0]}`; // Ví dụ: Tháng 05 2025
        }
    }
}

// API 3
export interface OrderStatusCounts {
    pending: number;
    paid: number;
    shipped: number;
    completed: number;
    canceled: number;
}

export class OrderPeriod {
    period: string;
    counts: Partial<OrderStatusCounts>;

    constructor(data: Partial<OrderPeriod> = {}) {
        this.period = data.period ?? '';
        this.counts = data.counts ?? {
            canceled: 0,
            completed: 0,
            paid: 0,
            pending: 0,
            shipped: 0
        }
    }
}

export class OrderStatsModel {
    ordersByPeriod: OrderPeriod[];
    statusCounts: OrderStatusCounts;
    totalOrders: number;

    constructor(data: Partial<OrderStatsModel> = {}) {
        this.ordersByPeriod = data.ordersByPeriod ?? [];
        this.statusCounts = data.statusCounts ?? {
            pending: 0,
            paid: 0,
            shipped: 0,
            completed: 0,
            canceled: 0
        };
        this.totalOrders = data.totalOrders ?? 0;
    }

    // Dữ liệu cho biểu đồ tròn (ngx-charts)
    getPieChartData(): { name: string, value: number }[] {
        return [
            { name: 'Pending', value: this.statusCounts.pending },
            { name: 'Paid', value: this.statusCounts.paid },
            { name: 'Shipped', value: this.statusCounts.shipped },
            { name: 'Completed', value: this.statusCounts.completed },
            { name: 'Canceled', value: this.statusCounts.canceled }
        ];
    }
}

// API 4
export class ExtraInfoProductModel {
    id: number;
    product_name: string;
    unit_price: number;

    constructor(
        id?: number,
        product_name?: string,
        unit_price?: number,
    ) {
        this.id = id ?? 0;
        this.product_name = product_name ?? '';
        this.unit_price = unit_price ?? 0;
    }

    convertObj(data: any) {
        const model = new ExtraInfoProductModel();
        model.id = data?.id ?? 0;
        model.product_name = data?.product_name ?? '';
        model.unit_price = data?.unit_price ?? 0;

        return model;
    }
}

export class TopSellingProductModel {
    id: number;
    product_variant_id: number;
    sku: string;
    image_url: string;
    product: ExtraInfoProductModel | undefined;
    color: ColorModel | undefined;
    size: SizeModel | undefined;
    totalQuantity: number;
    totalRevenue: number;

    constructor(
        id?: number,
        product_variant_id?: number,
        sku?: string,
        image_url?: string,
        product?: ExtraInfoProductModel | undefined,
        color?: ColorModel,
        size?: SizeModel,
        totalQuantity?: number,
        totalRevenue?: number,
    ) {
        this.id = id ?? 0;
        this.product_variant_id = product_variant_id ?? 0;
        this.sku = sku ?? '';
        this.image_url = image_url ?? '';
        this.product = product ?? new ExtraInfoProductModel();
        this.color = color ?? undefined;
        this.size = size ?? undefined;
        this.totalQuantity = totalQuantity ?? 0;
        this.totalRevenue = totalRevenue ?? 0;
    }

    convertObj(data: any) {
        const model = new TopSellingProductModel();
        model.id = data?.id ?? 0;
        model.product_variant_id = data?.product_variant_id ?? 0;
        model.sku = data?.sku ?? '';
        model.image_url = data?.image_url ?? '';
        model.product = data?.product ? new ExtraInfoProductModel().convertObj(data.product) : undefined;
        model.color = data?.color ? new ColorModel().convertObj(data.color) : undefined;
        model.size = data?.size ? new SizeModel().convertObj(data.size) : undefined;
        model.totalQuantity = data?.totalQuantity ?? 0;
        model.totalRevenue = data?.totalRevenue ?? 0;

        return model;
    }
}

// API 6
export class TopCustomerModel {
    userId: number;
    name: string;
    email: string;
    totalSpent: number;

    constructor(
        userId: number,
        name: string,
        email: string,
        totalSpent: number,
    ) {
        this.userId = userId;
        this.name = name;
        this.email = email;
        this.totalSpent = totalSpent;
    }
}

// API 7
export class LowStockProductModel {
    id: number;
    product_variant_id: number;
    sku: string;
    image_url: string;
    stock_quantity: number;
    product: ExtraInfoProductModel | undefined;
    color: ColorModel | undefined;
    size: SizeModel | undefined;

    constructor(
        id?: number,
        product_variant_id?: number,
        sku?: string,
        image_url?: string,
        stock_quantity?: number,
        product?: ExtraInfoProductModel | undefined,
        color?: ColorModel,
        size?: SizeModel,
    ) {
        this.id = id ?? 0;
        this.product_variant_id = product_variant_id ?? 0;
        this.sku = sku ?? '';
        this.image_url = image_url ?? '';
        this.stock_quantity = stock_quantity ?? 0;
        this.product = product ?? new ExtraInfoProductModel();
        this.color = color ?? undefined;
        this.size = size ?? undefined;
    }

    convertObj(data: any) {
        const model = new LowStockProductModel();
        model.id = data?.id ?? 0;
        model.product_variant_id = data?.product_variant_id ?? 0;
        model.sku = data?.sku ?? '';
        model.image_url = data?.image_url ?? '';
        model.stock_quantity = data?.stock_quantity ?? 0;
        model.product = data?.product ? new ExtraInfoProductModel().convertObj(data.product) : undefined;
        model.color = data?.color ? new ColorModel().convertObj(data.color) : undefined;
        model.size = data?.size ? new SizeModel().convertObj(data.size) : undefined;


        return model;
    }
}

// API 8
export class CompletionRatePeriodModel {
    period: string;
    completed: number;
    canceled: number;
    total: number;

    constructor(
        period?: string,
        completed?: number,
        canceled?: number,
        total?: number,
    ) {
        this.period = period ?? '';
        this.completed = completed ?? 0;
        this.canceled = canceled ?? 0;
        this.total = total ?? 0;
    }

    convertObj(data: any) {
        const model = new CompletionRatePeriodModel();
        model.period = data?.period ?? '';
        model.completed = data?.completed ?? 0;
        model.canceled = data?.canceled ?? 0;
        model.total = data?.total ?? 0;

        return model;
    }
}

export class CompletionRateSummaryModel {
    completed: number;
    canceled: number;
    total: number;

    constructor(
        completed?: number,
        canceled?: number,
        total?: number,
    ) {
        this.completed = completed ?? 0;
        this.canceled = canceled ?? 0;
        this.total = total ?? 0;
    }

    convertObj(data: any) {
        const model = new CompletionRateSummaryModel();
        model.completed = data?.completed ?? 0;
        model.canceled = data?.canceled ?? 0;
        model.total = data?.total ?? 0;

        return model;
    }
}

export class OrderCompletionRateModel {
    byPeriod: CompletionRatePeriodModel[];
    summary: CompletionRateSummaryModel;

    constructor(
        byPeriod?: CompletionRatePeriodModel[],
        summary?: CompletionRateSummaryModel
    ) {
        this.byPeriod = byPeriod ?? [];
        this.summary = summary ?? new CompletionRateSummaryModel();
    }

    convertObj(data: any) {
        const model = new OrderCompletionRateModel();
        model.byPeriod = data?.byPeriod?.map((item: any) => new CompletionRatePeriodModel().convertObj(item)) ?? [];
        model.summary = data?.summary ? new CompletionRateSummaryModel().convertObj(data.summary) : new CompletionRateSummaryModel();

        return model;
    }

    formatPeriod(period: string, groupBy: 'day' | 'week' | 'month'): string {
        if (groupBy === 'day') {
            return new Date(period).toLocaleDateString('vi-VN');
        } else if (groupBy === 'week') {
            return `Tuần ${period.split('-')[1]} ${period.split('-')[0]}`; // Ví dụ: Tuần 18 2025
        } else {
            return `Tháng ${period.split('-')[1]} ${period.split('-')[0]}`; // Ví dụ: Tháng 05 2025
        }
    }
}