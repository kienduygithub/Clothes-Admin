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
import { BarChart, LineChart, LinesChart, PieChart } from 'echarts/charts';
import { GridComponent, LegendComponent, TitleComponent, ToolboxComponent, TooltipComponent } from 'echarts/components';
import { CanvasRenderer } from 'echarts/renderers';
import { EChartsCoreOption } from 'echarts/core';
import { Router } from "@angular/router";
import { TranslateModule } from "@ngx-translate/core";
import { ImageResource } from "../../../common/resource/image_resource";
import { AppConfig } from "../../../common/config/app.config";
import { ShortenNumberPipe } from "../../../common/layout/pipes/shortenNumber";
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
    NgxEchartsDirective
]

const PIPES = [
    ShortenNumberPipe
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
        ...ANGULAR_MODULES,
        // ...PIPES,
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

    preImage = '';
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
    orderPieChartOptions: any;
    topCustomerChartOptions: any;
    orderCompletionChartOptions: any;

    constructor(
        private router: Router,
        private appConfig: AppConfig,
        private overviewMana: OverviewManagement
    ) { }

    async ngOnInit(): Promise<any> {
        this.preImage = this.appConfig.getPreImage() ?? '';
        this.past14Days.setDate(this.today.getDate() - 14)
        await this.fetchShopOverviewStats();
        await this.fetchRevenueOvertime();
        await this.fetchOrderStats();
        await this.fetchTopSellingProducts();
        await this.fetchCustomerStats();
        await this.fetchLowStockProducts();
        await this.fetchOrderCompletionStats();
        this.initRevenueChart();
        this.initOrderPieChart();
        this.initTopCustomerChart();
        this.initOrderCompletionChart();
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

    initOrderPieChart() {
        if (!this.orderStats || !this.orderStats.statusCounts) {
            return;
        }

        this.orderPieChartOptions = {
            tooltip: {
                trigger: 'item',
                formatter: '{b}: {c} ({d}%)'
            },
            legend: {
                orient: 'horizontal',
                bottom: 'bottom',
                type: 'scroll',
                itemWidth: 20,
                itemHeight: 14,
                textStyle: {
                    color: '#515151',
                    fontSize: 12
                }
            },
            series: [{
                name: 'Trạng thái đơn hàng',
                type: 'pie',
                radius: ['30%', '60%'],
                avoidLabelOverlap: false,
                minAngle: 5,
                label: {
                    show: true,
                    formatter: '{b}: {c}',
                    fontSize: 12,
                    color: '#515151'
                },
                emphasis: {
                    label: {
                        show: true,
                        fontSize: 14,
                        fontWeight: 'bold'
                    }
                },
                labelLine: {
                    show: true
                },
                data: [
                    { value: this.orderStats.statusCounts.pending, name: 'Đang chờ' },
                    { value: this.orderStats.statusCounts.paid, name: 'Đã thanh toán' },
                    { value: this.orderStats.statusCounts.shipped, name: 'Đã vận chuyển' },
                    { value: this.orderStats.statusCounts.completed, name: 'Hoàn thành' },
                    { value: this.orderStats.statusCounts.canceled, name: 'Hủy bỏ' }
                ],
                itemStyle: {
                    color: function (params: any) {
                        const colors = ['#69C0FF', '#FF6384', '#FFCD56', '#4BC0C0', '#9966FF'];
                        return colors[params.dataIndex % colors.length];
                    }
                }
            }],
            grid: {
                left: '0',
                right: '0',
                bottom: '15%',
                top: '0',
                containLabel: true
            }
        };
    }

    initTopCustomerChart() {
        if (!this.topCustomers || this.topCustomers.length === 0) {
            this.topCustomerChartOptions = { series: [{ type: 'bar', data: [], show: false }] };
            return;
        }
        this.topCustomerChartOptions = {
            xAxis: {
                type: 'category',
                data: this.topCustomers.map(customer => customer.name),
                axisLabel: { rotate: 0, fontSize: 12, color: '#515151' },
                axisLine: { show: true },
                axisTick: { show: false }
            },
            yAxis: {
                type: 'value',
                axisLabel: { formatter: '{value}', fontSize: 12, color: '#515151' },
                axisLine: { show: false },
                splitLine: { lineStyle: { color: '#E0E0E0', type: 'dashed' } },
                min: 0
            },
            series: [{
                type: 'bar',
                data: this.topCustomers.map(customer => customer.totalSpent),
                itemStyle: {
                    color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                        { offset: 0, color: '#69C0FF' },
                        { offset: 1, color: '#F5F5F5' }
                    ]),
                    borderRadius: [5, 5, 0, 0]
                },
                barWidth: '30%',
                label: {
                    show: true,
                    position: 'top',
                    formatter: '{c}',
                    fontSize: 12,
                    color: '#515151'
                }
            }],
            tooltip: {
                trigger: 'axis',
                formatter: (params: any) => `
                    <div style="padding: 5px; background: #fff; border: 1px solid #ccc; border-radius: 3px;">
                        <strong>${params[0].name}</strong><br/>
                        Tổng chi tiêu: <span style="color: #4a90e2">${this.shortenNumber(params[0].value)} VNĐ</span>
                    </div>
                `,
                textStyle: { fontSize: 12 }
            },
            grid: { left: '3%', right: '3%', bottom: '0', top: '15%', containLabel: true }
        };
    }

    initOrderCompletionChart() {
        if (!this.orderCompletionRate || !this.orderCompletionRate.summary) {
            return;
        }

        // Tính các trạng thái khác dựa trên total (giả định total bao gồm tất cả các trạng thái)
        const total = this.orderCompletionRate.summary.total || 0;
        const completed = this.orderCompletionRate.summary.completed || 0;
        const canceled = this.orderCompletionRate.summary.canceled || 0;
        const pending = total - completed - canceled; // Giả định pending là phần còn lại

        this.orderCompletionChartOptions = {
            tooltip: {
                trigger: 'item',
                formatter: '{b}: {c} ({d}%)'
            },
            legend: {
                orient: 'horizontal',
                bottom: '0',
                left: 'center',
                type: 'scroll',
                itemWidth: 20,
                itemHeight: 10,
                textStyle: { color: '#515151', fontSize: 12 }
            },
            series: [{
                name: 'Tỉ lệ hoàn thành',
                type: 'pie',
                radius: ['30%', '60%'],
                avoidLabelOverlap: false,
                minAngle: 20,
                label: {
                    show: true,
                    formatter: '{b}: {d}%',
                    fontSize: 12,
                    color: '#515151'
                },
                emphasis: {
                    label: { show: true, fontSize: 14, fontWeight: 'bold' }
                },
                labelLine: { show: true },
                data: [
                    { value: completed, name: 'Hoàn thành' },
                    { value: pending > 0 ? pending : 0, name: 'Đang chờ' },
                    { value: canceled, name: 'Hủy bỏ' }
                ],
                itemStyle: {
                    color: function (params: any) {
                        const colors = ['#4BC0C0', '#69C0FF', '#9966FF'];
                        return colors[params.dataIndex % colors.length];
                    }
                }
            }],
            grid: { left: '0', right: '0', bottom: '0', top: '15%', containLabel: true }
        };
    }

    private shortenNumber(value: number | string) {
        const num = typeof value === 'string' ? parseFloat(value) : value;

        if (isNaN(num) || num === 0) return '0';

        const absNum = Math.abs(num);
        let result: string;

        if (absNum >= 1000000) {
            result = (num / 1000000).toFixed(1).replace(/\.0$/, '') + 'M';
        } else if (absNum >= 1000) {
            result = (num / 1000).toFixed(1).replace(/\.0$/, '') + 'k';
        } else {
            result = num.toString();
        }

        return result;
    }
}