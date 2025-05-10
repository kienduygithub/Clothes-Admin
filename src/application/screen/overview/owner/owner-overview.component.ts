import { CommonModule } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { NbButtonModule, NbIconModule, NbInputModule, NbTooltipModule } from "@nebular/theme";
import { OverviewManagement } from "../../../data/management/overview.management";
import { OverviewService } from "../../../data/service/overview.service";
import { LowStockProductModel, OrderCompletionRateModel, OrderStatsModel, OverviewStatsModel, RevenueStatsModel, TopCustomerModel, TopSellingProductModel } from "../../../data/model/overview/overview.model";
import { GroupDate } from "../../../common/resource/group-date";
import { OrderStatus } from "../../../common/resource/status";
import { NbProgressBarModule } from '@nebular/theme';
import { NgxEchartsDirective, provideEchartsCore } from 'ngx-echarts';
import * as echarts from 'echarts/core';
import { BarChart, LineChart, LinesChart } from 'echarts/charts';
import { GridComponent, LegendComponent, TitleComponent, ToolboxComponent, TooltipComponent } from 'echarts/components';
import { CanvasRenderer } from 'echarts/renderers';
import { EChartsCoreOption } from 'echarts/core';
import { Router } from "@angular/router";
import { TranslateModule } from "@ngx-translate/core";
import { ImageResource } from "../../../common/resource/image_resource";
echarts.use([
    BarChart,
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
    NgxEchartsDirective
]

const PROVIDERS = [
    OverviewManagement,
    OverviewService,
    provideEchartsCore({ echarts })
]

@Component({
    standalone: true,
    selector: 'app-owner-overview',
    templateUrl: './owner-overview.component.html',
    styleUrl: './owner-overview.component.scss',
    imports: [
        ...NB_LIBS,
        ...ANGULAR_MODULES
    ],
    providers: [...PROVIDERS]
})

export class OwnerOverviewComponent implements OnInit {
    icon_money_bag: string = ImageResource.icon_money_bag;
    icon_complete_order: string = ImageResource.icon_complete_order;
    icon_product_widge: string = ImageResource.icon_product_widge;
    icon_group_customer: string = ImageResource.icon_group_customer;

    image_chart_line: string = ImageResource.image_chart_line;
    image_chart_pie: string = ImageResource.image_chart_pie;
    image_chart_bar: string = ImageResource.image_chart_bar;

    overviewStats!: OverviewStatsModel;
    revenueStats!: RevenueStatsModel;
    orderStats!: OrderStatsModel;
    topSellingProducts: TopSellingProductModel[] = [];
    totalCustomers: number = 0;
    topCustomers: TopCustomerModel[] = [];
    lowStockProducts: LowStockProductModel[] = [];
    orderCompletionRate!: OrderCompletionRateModel;
    today = new Date();
    past14Days = new Date();

    /** Echarts options **/
    revenueChartOptions: any;

    constructor(
        private router: Router,
        private overviewMana: OverviewManagement
    ) { }

    async ngOnInit(): Promise<any> {
        this.past14Days.setDate(this.today.getDate() - 14)
        await this.fetchShopOverviewStats();
        await this.fetchRevenueOvertime();
        await this.fetchOrderStats();
        await this.fetchTopSellingProducts();
        await this.fetchCustomerStats();
        await this.fetchLowStockProducts();
        await this.fetchOrderCompletionStats();
        this.initRevenueChart();
    }

    async fetchShopOverviewStats() {
        try {
            const response = await this.overviewMana.fetchShopOverviewStats(this.past14Days, this.today);
            this.overviewStats = response;
        } catch (error) {
            console.log(error);
        }
    }

    async fetchRevenueOvertime() {
        try {
            const response = await this.overviewMana.fetchRevenueOvertime(this.past14Days, this.today, GroupDate.DAY);
            this.revenueStats = response;
        } catch (error) {
            console.log(error);
        }
    }

    async fetchOrderStats() {
        try {
            const response = await this.overviewMana.fetchOrderStats(
                this.past14Days,
                this.today,
                GroupDate.DAY,
                // OrderStatus.PENDING
            );
            this.orderStats = response;
        } catch (error) {
            console.log(error);
        }
    }

    async fetchTopSellingProducts() {
        try {
            const response = await this.overviewMana.fetchTopSellingProducts(
                this.past14Days,
                this.today,
                10
            );
            this.topSellingProducts = response;
        } catch (error) {
            console.log(error);
        }
    }

    async fetchCustomerStats() {
        try {
            const response = await this.overviewMana.fetchCustomerStats(
                this.past14Days,
                this.today,
                10
            );
            this.totalCustomers = response.get('totalCustomers') ?? 0;
            this.topCustomers = response.get('topCustomers') ?? [];
        } catch (error) {
            console.log(error);
        }
    }

    async fetchLowStockProducts() {
        try {
            const minStock = 50;
            const response = await this.overviewMana.fetchLowStockProducts(minStock);
            this.lowStockProducts = response;
        } catch (error) {
            console.log(error);
        }
    }

    async fetchOrderCompletionStats() {
        try {
            const response = await this.overviewMana.fetchOrderCompletionStats(
                this.past14Days,
                this.today,
                GroupDate.DAY,
                // OrderStatus.PENDING
            );
            this.orderCompletionRate = response;
        } catch (error) {
            console.log(error);
        }
    }

    initRevenueChart() {
        if (!this.revenueStats || !this.revenueStats.revenues) {
            this.revenueChartOptions = {
                xAxis: { show: false },
                yAxis: { show: false },
                series: [{ type: 'bar', data: [], show: false }]
            };
            return;
        }

        this.revenueChartOptions = {
            xAxis: {
                type: 'category',
                data: this.revenueStats.revenues.map(item => this.revenueStats.formatPeriod(item.period, GroupDate.DAY)),
                axisLabel: {
                    rotate: 0,
                    fontSize: 12,
                    color: '#515151',
                },
                axisLine: { show: true },
                axisTick: { show: true }
            },
            yAxis: {
                type: 'value',
                axisLabel: {
                    formatter: '{value} VNĐ',
                    fontSize: 12,
                    color: '#515151'
                },
                axisLine: { show: false },
                splitLine: {
                    lineStyle: {
                        color: '#E0E0E0',
                        type: 'dashed'
                    }
                },
                min: 0
            },
            series: [{
                type: 'bar',
                data: this.revenueStats.revenues.map(item => item.revenue),
                itemStyle: {
                    color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                        { offset: 0, color: '#69C0FF' },
                        { offset: 1, color: '#F5F5F5' }
                    ]),
                    borderRadius: [5, 5, 0, 0] // Bo góc trên cùng
                },
                barWidth: '30%', // Độ rộng cột
                label: {
                    show: true,
                    position: 'top',
                    formatter: '{c} VNĐ',
                    fontSize: 12,
                    color: '#515151'
                }
            }],
            tooltip: {
                trigger: 'axis',
                formatter: (params: any) => `
                    <div style="padding: 5px; background: #fff; border: 1px solid #ccc; border-radius: 3px;">
                        <strong>${params[0].name}</strong><br/>
                        Doanh thu: <span style="color: #69C0FF">${params[0].value} VNĐ</span><br/>
                        Tổng: <span style="color: #515151">${this.revenueStats.totalRevenue} VNĐ</span>
                    </div>
                `,
                textStyle: { fontSize: 12 }
            },
            grid: {
                left: '3%',
                right: '3%',
                bottom: '0',
                top: '10%',
                containLabel: true
            }
        };
    }
}