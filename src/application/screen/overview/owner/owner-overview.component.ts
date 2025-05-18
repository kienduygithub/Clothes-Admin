import { CommonModule } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { NbButtonModule, NbDatepickerModule, NbDateService, NbIconModule, NbInputModule, NbTooltipModule } from "@nebular/theme";
import { OverviewManagement } from "../../../data/management/overview.management";
import { OverviewService } from "../../../data/service/overview.service";
import { LowStockProductModel, OrderCompletionRateModel, OrderStatsModel, OverviewStatsModel, RevenueStatsModel, TopCustomerModel, TopSellingProductModel } from "../../../data/model/overview/overview.model";
import { GroupDate } from "../../../common/resource/group-date";
import { OrderStatus } from "../../../common/resource/status";
import { NbProgressBarModule } from '@nebular/theme';
import { NgxEchartsDirective, provideEchartsCore } from 'ngx-echarts';
import * as echarts from 'echarts/core';
import { BarChart, LineChart, LinesChart, PieChart } from 'echarts/charts';
import { GridComponent, LegendComponent, TitleComponent, ToolboxComponent, TooltipComponent } from 'echarts/components';
import { CanvasRenderer } from 'echarts/renderers';
import { EChartsCoreOption } from 'echarts/core';
import { Router } from "@angular/router";
import { TranslateModule } from "@ngx-translate/core";
import { ImageResource } from "../../../common/resource/image_resource";
import { AppConfig } from "../../../common/config/app.config";
import { ShortenNumberPipe } from "../../../common/layout/pipes/shortenNumber";
import { NgxPaginationModule } from "ngx-pagination";
import { PagingModel } from "../../../common/model/paging.model";
import { ProductUrl } from "../../product/product.routing";
import { Option } from "../../../common/resource/option.interface";
import { DateRange, FilterParams, FilterStatsComponent } from "../../../common/utils/filter-stats/filter-stats.component";
import { adjustToUTCWithOffset } from "../../../common/resource/time";
import { ShopManagement } from "../../../data/management/shop.management";
import { ShopService } from "../../../data/service/shop.service";
import { ToastNotification } from "../../common/toast/toast.component";
import { ShopModel } from "../../../data/model/shop.model";
import { OrderModel } from "../../../data/model/order/order.model";
import { OverviewUrl } from "../overview.routing";
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
    NbProgressBarModule
]

const ANGULAR_MODULES = [
    CommonModule,
    TranslateModule,
    NgxPaginationModule,
]

const MAT_MODULES = [
    NbDatepickerModule,
]

const PROVIDERS = [
    OverviewManagement,
    OverviewService,
    ShopManagement,
    ShopService,
    provideEchartsCore({ echarts })
]

@Component({
    standalone: true,
    selector: 'app-owner-overview',
    templateUrl: './owner-overview.component.html',
    styleUrl: './owner-overview.component.scss',
    imports: [
        ...NB_LIBS,
        ...ANGULAR_MODULES,
        ...MAT_MODULES
    ],
    providers: [...PROVIDERS]
})

export class OwnerOverviewComponent implements OnInit {
    icon_money_bag: string = ImageResource.icon_money_bag;
    icon_complete_order: string = ImageResource.icon_complete_order;
    icon_product_widge: string = ImageResource.icon_product_widge;
    icon_group_customer: string = ImageResource.icon_group_customer;
    icon_edit: string = ImageResource.icon_edit;

    image_chart_line: string = ImageResource.image_chart_line;
    image_chart_pie: string = ImageResource.image_chart_pie;
    image_chart_bar: string = ImageResource.image_chart_bar;

    preImage = '';
    overviewStats!: OverviewStatsModel;
    today = new Date();
    shopInfo: ShopModel = new ShopModel();
    latestOrderShops: OrderModel[] = [];

    /** Echarts options **/
    offsetLatestOrderShop: number = 0;
    pagingLatestOrderShop!: PagingModel;
    initDateRanges: DateRange[] = [];

    constructor(
        private router: Router,
        private appConfig: AppConfig,
        private overviewMana: OverviewManagement,
        private shopMana: ShopManagement
    ) { }

    async ngOnInit(): Promise<any> {
        this.preImage = this.appConfig.getPreImage() ?? '';
        this.pagingLatestOrderShop = new PagingModel();
        const startOfMonth = new Date(this.today.getFullYear(), this.today.getMonth(), 1);
        startOfMonth.setHours(0, 0, 0, 0);
        const todayEnd = new Date(this.today);
        todayEnd.setHours(23, 59, 59, 999);

        this.initDateRanges.push({
            startDate: adjustToUTCWithOffset(startOfMonth),
            endDate: adjustToUTCWithOffset(todayEnd)
        })
        await this.fetchShopInfo();
        await this.fetchShopOverviewStats();
        await this.fetchListLatestOrderShop();
        this.resetPageLatestOrderShop();
    }

    async fetchShopInfo() {
        try {
            this.shopInfo = await this.shopMana.fetchShopByTokenId();
        } catch (error) {
            console.log(error)
            ToastNotification.error('Hệ thống gặp sự cố, quay lại sau.');
        }
    }

    async fetchShopOverviewStats() {
        try {
            const response = await this.overviewMana.fetchShopOverviewStats(this.initDateRanges);
            this.overviewStats = response;
        } catch (error) {
            console.log(error);
        }
    }

    async fetchListLatestOrderShop() {
        try {
            const response = await this.shopMana.fetchListLatestOrderShop(this.initDateRanges);
            this.latestOrderShops = response;
        } catch (error) {
            console.log(error);
        }
    }

    onPageLatestOrderShopChange(currentPage: number) {
        this.pagingLatestOrderShop.currentPage = currentPage;
        this.offsetLatestOrderShop = (currentPage - 1) * this.pagingLatestOrderShop.itemsPerPage + 1;
        if (currentPage === 1) {
            this.pagingLatestOrderShop.before = currentPage;
            this.pagingLatestOrderShop.after = currentPage + 1;
        } else if (currentPage === this.pagingLatestOrderShop.totalPage) {
            this.pagingLatestOrderShop.before = currentPage - 1;
            this.pagingLatestOrderShop.after = currentPage;
        } else if (currentPage > 1 || currentPage < this.pagingLatestOrderShop.totalPage) {
            this.pagingLatestOrderShop.before = currentPage - 1;
            this.pagingLatestOrderShop.after = currentPage + 1;
        }
    }

    navigateShopDetails() {
        this.router.navigate([OverviewUrl.OWNER_OVERVIEW, this.shopInfo.id]);
    }

    resetPageLatestOrderShop() {
        this.pagingLatestOrderShop.currentPage = 1;
        this.pagingLatestOrderShop.itemsPerPage = 3;
        this.pagingLatestOrderShop.totalItems = this.latestOrderShops.length;
        this.pagingLatestOrderShop.totalPage = Math.ceil(this.latestOrderShops.length / 3);
        this.pagingLatestOrderShop.before = 0;
        this.pagingLatestOrderShop.after = 0;

        this.offsetLatestOrderShop = (this.pagingLatestOrderShop.currentPage - 1) * this.pagingLatestOrderShop.itemsPerPage + 1;
    }
}