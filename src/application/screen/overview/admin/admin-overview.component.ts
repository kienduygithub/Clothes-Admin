import { CommonModule } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { NbButtonModule, NbIconModule, NbInputModule, NbTooltipModule } from "@nebular/theme";
import { StatsManagement } from "../../../data/management/stats.management";
import { StatsService } from "../../../data/service/stats.service";
import { ToastNotification } from "../../common/toast/toast.component";
import { OrderActivityMonthlyStatModel, OrderActivityOverviewModel, ProductPerformanceMonthlyStatModel, ProductPerformanceOverviewModel, ShopMonthlyStatModel, ShopOverviewModel } from "../../../data/model/stats/stats.model";
import { DateRange, FilterParams, FilterStatsComponent } from "../../../common/utils/filter-stats/filter-stats.component";
import { GroupDate } from "../../../common/resource/group-date";
import { adjustToUTCWithOffset } from "../../../common/resource/time";
import { NgxEchartsDirective, provideEchartsCore } from "ngx-echarts";
import * as echarts from 'echarts/core';
import { BarChart, LineChart, LinesChart, PieChart } from 'echarts/charts';
import { GridComponent, LegendComponent, TitleComponent, ToolboxComponent, TooltipComponent } from "echarts/components";
import { CanvasRenderer } from "echarts/renderers";
import { NgxPaginationModule } from "ngx-pagination";
import { EChartsOption } from "echarts/types/dist/shared";
import { ImageResource } from "../../../common/resource/image_resource";
import { OrderStatus } from "../../../common/resource/status";
import { PagingModel } from "../../../common/model/paging.model";

echarts.use([
    BarChart,
    PieChart,
    LineChart,
    LinesChart,
    GridComponent,
    LegendComponent,
    TitleComponent,
    ToolboxComponent,
    TooltipComponent,
    CanvasRenderer
]);

const NB_LIBS = [
    NbIconModule,
    NbInputModule,
    NbButtonModule,
    NbTooltipModule,
]

const ANGULAR_MODULES = [
    CommonModule,
    NgxEchartsDirective,
    NgxPaginationModule,
]

const PROVIDERS = [
    StatsManagement,
    StatsService,
    provideEchartsCore({ echarts })
]

@Component({
    standalone: true,
    selector: 'app-admin-overview',
    templateUrl: './admin-overview.component.html',
    styleUrl: './admin-overview.component.scss',
    imports: [
        ...NB_LIBS,
        ...ANGULAR_MODULES,
        FilterStatsComponent
    ],
    providers: [...PROVIDERS]
})

export class AdminOverviewComponent implements OnInit {
    icon_money_bag: string = ImageResource.icon_money_bag;
    icon_complete_order: string = ImageResource.icon_complete_order;
    icon_product_widge: string = ImageResource.icon_product_widge;
    icon_group_customer: string = ImageResource.icon_group_customer;
    icon_edit: string = ImageResource.icon_edit;

    image_chart_line: string = ImageResource.image_chart_line;
    image_chart_pie: string = ImageResource.image_chart_pie;
    image_chart_bar: string = ImageResource.image_chart_bar;

    shopMontlyStats: ShopMonthlyStatModel[] = [];
    shopOverview: ShopOverviewModel = new ShopOverviewModel();
    orderActivityMonthlyStats: OrderActivityMonthlyStatModel[] = [];
    orderActivityOverview: OrderActivityOverviewModel = new OrderActivityOverviewModel();
    productPerformanceMonthlyStats: ProductPerformanceMonthlyStatModel[] = [];
    productPerformanceOverview: ProductPerformanceOverviewModel = new ProductPerformanceOverviewModel();
    initDateRanges: DateRange[] = [];
    groupBy: GroupDate = GroupDate.DAY;

    shopChartOptions: any = {};
    orderChartOptions: EChartsOption = {};
    productChartOptions: EChartsOption = {};

    offsetTopProduct: number = 0;
    pagingTopProduct: PagingModel = new PagingModel();
    offsetLowRatedProduct: number = 0;
    pagingLowRatedProduct: PagingModel = new PagingModel();

    constructor(
        private statsMana: StatsManagement
    ) { }

    async onFilterStats(filter: FilterParams) {
        this.groupBy = filter.filter === 'YEAR' ? GroupDate.MONTH : GroupDate.DAY;
        this.initDateRanges = filter.dateRanges;
        await this.fetchData();
    }

    async ngOnInit() {
        this.initDateRanges = this.getCurrentMonthDateRange();
        await this.fetchData();
    }

    async fetchData() {
        try {
            await Promise.all([
                this.fetchNewShopStats(this.groupBy),
                this.fetchOrderActivityStats(this.groupBy),
                this.fetchProductPerformanceStats(this.groupBy)
            ]);
            this.updateChartOptions();
            this.resetPageTopProduct();
            this.resetPageLowRatedProduct();
        } catch (error) {
            console.error(error);
            ToastNotification.error('Hệ thống gặp sự cố, quay lại sau');
        }
    }

    async fetchNewShopStats(groupBy: GroupDate) {
        try {
            const respMap = await this.statsMana.fetchNewShopStats(this.initDateRanges, groupBy);
            this.shopMontlyStats = respMap.get('monthlyStats');
            this.shopOverview = respMap.get('overview');
        } catch (error) {
            console.log(error);
            ToastNotification.error('Hệ thống gặp sự cố, quay lại sau');
        }
    }

    async fetchOrderActivityStats(groupBy: GroupDate) {
        try {
            const respMap = await this.statsMana.fetchOrderActivityStats(this.initDateRanges, groupBy);
            this.orderActivityMonthlyStats = respMap.get('monthlyStats');
            this.orderActivityOverview = respMap.get('overview');
        } catch (error) {
            console.log(error);
            ToastNotification.error('Hệ thống gặp sự cố, quay lại sau');
        }
    }

    async fetchProductPerformanceStats(groupBy: GroupDate) {
        try {
            const respMap = await this.statsMana.fetchProductPerformanceStats(this.initDateRanges, groupBy);
            this.productPerformanceMonthlyStats = respMap.get('monthlyStats');
            this.productPerformanceOverview = respMap.get('overview');
        } catch (error) {
            console.log(error);
            ToastNotification.error('Hệ thống gặp sự cố, quay lại sau');
        }
    }

    private getCurrentMonthDateRange(): DateRange[] {
        const now = new Date();
        const year = now.getFullYear();
        const month = now.getMonth();

        const startMonth = new Date(year, month, 1, 0, 0, 0);
        const todayEnd = new Date();
        todayEnd.setHours(23, 59, 59, 999);

        return [
            {
                startDate: adjustToUTCWithOffset(startMonth),
                endDate: adjustToUTCWithOffset(todayEnd),
                month: month + 1,
            },
        ];
    }

    updateChartOptions() {
        this.shopChartOptions = {
            tooltip: { trigger: 'axis' },
            xAxis: {
                type: 'category',
                data: this.shopOverview.periods.map(p => p.period),
                axisLabel: { rotate: 45 }
            },
            yAxis: { type: 'value', name: '' },
            series: [{
                name: 'Cửa hàng mới',
                type: 'bar',
                data: this.shopOverview.periods.map(p => p.totalNewShops),
                itemStyle: { color: '#1890ff' },
                barWidth: '20%'
            }],
            grid: {
                left: '3%',
                right: '3%',
                bottom: '0',
                top: '10%',
                containLabel: true
            }
        };

        const statusList = [
            { enum: OrderStatus.PENDING, key: 'pending', label: 'Đang chờ' },
            { enum: OrderStatus.PAID, key: 'paid', label: 'Đã thanh toán' },
            { enum: OrderStatus.PROCESSING, key: 'processing', label: 'Đang xử lý' },
            { enum: OrderStatus.SHIPPED, key: 'shipped', label: 'Đã vận chuyển' },
            { enum: OrderStatus.COMPLETED, key: 'completed', label: 'Hoàn thành' },
            { enum: OrderStatus.CANCELED, key: 'canceled', label: 'Hủy bỏ' }
        ];
        const legendData = statusList.map(status => status.label);
        this.orderChartOptions = {
            tooltip: { trigger: 'axis' },
            legend: { data: legendData, top: 0 },
            xAxis: {
                type: 'category',
                data: this.orderActivityOverview.orders.map(o => o.period),
                axisLabel: { rotate: 45 }
            },
            yAxis: { type: 'value', name: '' },
            series: statusList.map(status => ({
                name: status.label,
                type: 'bar',
                stack: 'total',
                data: this.orderActivityOverview.orders.map((o: any) => o.counts[status.key] ?? 0),
                itemStyle: { color: this.getStatusColor(status.enum) }
            })),
            grid: {
                left: '3%',
                right: '3%',
                bottom: '0',
                top: '10%',
                containLabel: true
            }
        };

        this.productChartOptions = {
            tooltip: { trigger: 'axis' },
            legend: { data: ['Số Sản Phẩm Niêm Yết'], top: 0 },
            xAxis: {
                type: 'category',
                data: this.productPerformanceOverview.productsListed.map(p => p.period || 'N/A'),
                axisLabel: { rotate: 45 }
            },
            yAxis: { type: 'value', name: '' },
            series: [{
                name: 'Số Sản Phẩm Niêm Yết',
                type: 'line',
                data: this.productPerformanceOverview.productsListed.map(p => p.productsListed || 0),
                lineStyle: { color: '#36A2EB' },
                areaStyle: { color: 'rgba(54, 162, 235, 0.2)' }
            }],
            grid: {
                left: '3%',
                right: '3%',
                bottom: '10%',
                top: '10%',
                containLabel: true
            }
        };
    }

    private getStatusColor(status: string): string {
        const colors: { [key: string]: string } = {
            pending: '#69C0FF',
            paid: '#FF6384',
            processing: '#1890ff',
            shipped: '#FFCD56',
            completed: '#4BC0C0',
            canceled: '#9966FF'
        };
        return colors[status] || '#999';
    }

    onPageTopProductChange(currentPage: number) {
        this.pagingTopProduct.currentPage = currentPage;
        this.offsetTopProduct = (currentPage - 1) * this.pagingTopProduct.itemsPerPage + 1;
        if (currentPage === 1) {
            this.pagingTopProduct.before = currentPage;
            this.pagingTopProduct.after = currentPage + 1;
        } else if (currentPage === this.pagingTopProduct.totalPage) {
            this.pagingTopProduct.before = currentPage - 1;
            this.pagingTopProduct.after = currentPage;
        } else if (currentPage > 1 || currentPage < this.pagingTopProduct.totalPage) {
            this.pagingTopProduct.before = currentPage - 1;
            this.pagingTopProduct.after = currentPage + 1;
        }
    }

    resetPageTopProduct() {
        this.pagingTopProduct.currentPage = 1;
        this.pagingTopProduct.itemsPerPage = 3;
        this.pagingTopProduct.totalItems = this.productPerformanceOverview.topProducts.length;
        this.pagingTopProduct.totalPage = Math.ceil(this.productPerformanceOverview.topProducts.length / 3);
        this.pagingTopProduct.before = 0;
        this.pagingTopProduct.after = 0;

        this.offsetTopProduct = (this.pagingTopProduct.currentPage - 1) * this.pagingTopProduct.itemsPerPage + 1;
    }

    onPageLowRatedProductChange(currentPage: number) {
        this.pagingLowRatedProduct.currentPage = currentPage;
        this.offsetLowRatedProduct = (currentPage - 1) * this.pagingLowRatedProduct.itemsPerPage + 1;
        if (currentPage === 1) {
            this.pagingLowRatedProduct.before = currentPage;
            this.pagingLowRatedProduct.after = currentPage + 1;
        } else if (currentPage === this.pagingLowRatedProduct.totalPage) {
            this.pagingLowRatedProduct.before = currentPage - 1;
            this.pagingLowRatedProduct.after = currentPage;
        } else if (currentPage > 1 || currentPage < this.pagingLowRatedProduct.totalPage) {
            this.pagingLowRatedProduct.before = currentPage - 1;
            this.pagingLowRatedProduct.after = currentPage + 1;
        }
    }

    resetPageLowRatedProduct() {
        this.pagingLowRatedProduct.currentPage = 1;
        this.pagingLowRatedProduct.itemsPerPage = 3;
        this.pagingLowRatedProduct.totalItems = this.productPerformanceOverview.lowRatedProducts.length;
        this.pagingLowRatedProduct.totalPage = Math.ceil(this.productPerformanceOverview.lowRatedProducts.length / 3);
        this.pagingLowRatedProduct.before = 0;
        this.pagingLowRatedProduct.after = 0;

        this.offsetTopProduct = (this.pagingLowRatedProduct.currentPage - 1) * this.pagingLowRatedProduct.itemsPerPage + 1;
    }
}