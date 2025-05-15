import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { Router } from "@angular/router";
import { NbButtonModule, NbDialogService, NbIconModule, NbInputModule, NbSelectModule, NbTooltipModule } from "@nebular/theme";
import { NgxPaginationModule } from "ngx-pagination";
import { FormControl, ReactiveFormsModule } from "@angular/forms";
import { debounceTime } from "rxjs";
import { ImageResource } from "../../../common/resource/image_resource";
import { PagingModel } from "../../../common/model/paging.model";
import { AppConfig } from "../../../common/config/app.config";
import { OrderURL } from "../order.routing";
import { OrderModel } from "../../../data/model/order/order.model";
import { OrderManagement } from "../../../data/management/order.management";
import { OrderService } from "../../../data/service/order.service";
import { OrderStatusColorPipe } from "../../../common/layout/pipes/orderStatusColor";
import { Option } from "../../../common/utils/filter-stats/filter-stats.component";
import { OrderStatus } from "../../../common/resource/status";
import { ToastNotification } from "../../common/toast/toast.component";

const NB_LIBS = [
    NbInputModule,
    NbButtonModule,
    NbIconModule,
    NbTooltipModule,
    NbSelectModule
]

const ANGULAR_MODULES = [
    CommonModule,
    ReactiveFormsModule,
    NgxPaginationModule
]

const PROVIDERS = [
    OrderManagement,
    OrderService
]

const PIPES = [
    OrderStatusColorPipe
]

@Component({
    standalone: true,
    selector: 'list-order-component',
    templateUrl: './list-order.component.html',
    styleUrl: './list-order.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [
        ...NB_LIBS,
        ...ANGULAR_MODULES,
        ...PIPES
    ],
    providers: [
        ...PROVIDERS
    ]
})

export class ListOrderComponent implements OnInit {

    icon_filter: string = ImageResource.icon_filter;
    icon_refresh: string = ImageResource.icon_refresh;
    icon_edit: string = ImageResource.icon_edit;
    image_not_found: string = ImageResource.image_not_found;

    offset: number = 0;
    paging!: PagingModel;

    preImage: string = '';
    search = new FormControl('');

    listOrder: OrderModel[] = [];
    displayListOrder: OrderModel[] = [];

    isFilterOpen = false;
    selectedFilters: string[] = [];
    filterOptions = [
        { label: 'Loại phần trăm', value: '1' },
        { label: 'Loại cố định', value: '2' },
        { label: 'Chưa hết hạn', value: '3' },
        { label: 'Đã quá hạn', value: '4' }
    ];

    OrderStatus = OrderStatus;
    OrderStatusOptions: Option[] = [
        { label: 'Đã giao hàng', value: OrderStatus.SHIPPED },
        { label: 'Đang xử lý', value: OrderStatus.PROCESSING },
    ]

    constructor(
        private router: Router,
        private appConfig: AppConfig,
        private dialogService: NbDialogService,
        private cdr: ChangeDetectorRef,
        private orderMana: OrderManagement
    ) { }

    async ngOnInit() {
        this.preImage = this.appConfig.getPreImage() ?? "";
        this.paging = new PagingModel();
        await this.fetchListShopOrder();
        this.resetPagination();
        this.searchValueChanges();
        this.cdr.detectChanges();
    }

    async fetchListShopOrder() {
        try {
            this.listOrder = await this.orderMana.fetchListOrderShop();
            this.displayListOrder = [...this.listOrder];
        } catch (error) {
            console.log(error);
        }
    }

    async onDetailOrder(order_id: number, order_shop_id: number) {
        this.router.navigate([OrderURL.DETAIL_ORDER], { queryParams: { order_id: order_id, order_shop_id: order_shop_id } });
    }

    onPageChange(currentPage: number) {
        this.paging.currentPage = currentPage;
        this.offset = (currentPage - 1) * this.paging.itemsPerPage + 1;
        if (currentPage === 1) {
            this.paging.before = currentPage;
            this.paging.after = currentPage + 1;
        } else if (currentPage === this.paging.totalPage) {
            this.paging.before = currentPage - 1;
            this.paging.after = currentPage;
        } else if (currentPage > 1 || currentPage < this.paging.totalPage) {
            this.paging.before = currentPage - 1;
            this.paging.after = currentPage + 1;
        }
    }

    resetPagination() {
        this.paging.currentPage = 1;
        this.paging.itemsPerPage = 10;
        this.paging.totalItems = this.displayListOrder.length;
        this.paging.totalPage = Math.ceil(this.displayListOrder.length / 10);
        this.paging.before = 0;
        this.paging.after = 0;

        this.offset = (this.paging.currentPage - 1) * this.paging.itemsPerPage + 1;
    }

    private searchValueChanges() {
        this.search.valueChanges
            .pipe(debounceTime(300))
            .subscribe(value => {
                this.onFilter();
            });
    }

    async onRefreshTable() {
        await this.fetchListShopOrder();
        this.resetPagination();
        this.search.setValue('', { emitEvent: false });
        this.selectedFilters = [];
        this.cdr.detectChanges();
    }

    onToggleOpenFilter() {
        this.isFilterOpen = !this.isFilterOpen;
        this.cdr.detectChanges();
    }

    onFilterToggle(value: string) {
        if (this.selectedFilters.includes(value)) {
            this.selectedFilters = this.selectedFilters.filter(item => item !== value);
        } else {
            this.selectedFilters.push(value);
        }
    }

    onFilter() {
        this.isFilterOpen = false;
        const searchValue = this.search.value?.trim() ?? '';
        const selectedSet = new Set(this.selectedFilters);
        const conditions = {
            isPercentage: selectedSet.has('1'),
            isFixed: selectedSet.has('2'),
            isNotExpired: selectedSet.has('3'),
            isExpired: selectedSet.has('4')
        };
        if (selectedSet.size === 0) {
            // if (searchValue === '') {
            //     this.displayCoupons = [...this.coupons];
            // } else {
            //     this.displayCoupons = this.coupons.filter(
            //         coupon => coupon.name.toLowerCase().includes(searchValue.toLowerCase())
            //     );
            // }
        } else {
            // this.displayCoupons = this.coupons.filter(coupon => {
            //     const isPercentage = conditions.isPercentage && coupon.discount_type === DiscountType.PERCENTAGE;
            //     const isFixed = conditions.isFixed && coupon.discount_type === DiscountType.FIXED;
            //     const isNotExpired = conditions.isNotExpired && coupon.status === CouponStatus.ACTIVE;
            //     const isExpired = conditions.isExpired && coupon.status === CouponStatus.EXPIRED;

            //     return (isPercentage || isFixed || isNotExpired || isExpired)
            //         && coupon.name.toLowerCase().includes(searchValue.toLowerCase());
            // })
        }
        this.resetPagination();
        this.cdr.detectChanges();
    }

    onCancelFilter() {
        this.isFilterOpen = false;
        this.selectedFilters = [];
        this.onFilter();
        this.resetPagination();
        this.cdr.detectChanges();
    }

    async onChangeStatus(order_shop_id: number, newStatus: string, index: number) {
        const order = this.listOrder.find(o => o.order_shop_id === order_shop_id);

        if (!order) {
            return;
        }

        try {
            await this.orderMana.updateStatusOrderShop(order_shop_id, newStatus);
            order.status = newStatus;
            this.displayListOrder[index] = order;
            this.cdr.detectChanges();
            ToastNotification.success("Đổi trạng thái đơn hàng thành công")
        } catch (error) {
            console.error('Lỗi khi cập nhật trạng thái:', error);
        }
    }
}