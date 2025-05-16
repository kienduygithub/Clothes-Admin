import { ChangeDetectionStrategy, ChangeDetectorRef, Component, HostListener, OnInit } from "@angular/core";
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

const NB_LIBS = [NbInputModule, NbButtonModule, NbIconModule, NbTooltipModule, NbSelectModule];
const ANGULAR_MODULES = [CommonModule, ReactiveFormsModule, NgxPaginationModule];
const PROVIDERS = [OrderManagement, OrderService];
const PIPES = [OrderStatusColorPipe];

@Component({
    standalone: true,
    selector: 'list-order-component',
    templateUrl: './list-order.component.html',
    styleUrls: ['./list-order.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [...NB_LIBS, ...ANGULAR_MODULES, ...PIPES],
    providers: [...PROVIDERS]
})
export class ListOrderComponent implements OnInit {
    icon_filter: string = ImageResource.icon_filter;
    icon_refresh: string = ImageResource.icon_refresh;
    icon_edit: string = ImageResource.icon_edit;
    image_not_found: string = ImageResource.image_not_found;

    offset: number = 0;
    paging: PagingModel = new PagingModel();
    search = new FormControl('');
    sortControl = new FormControl('created_at_desc');

    listOrder: OrderModel[] = [];
    displayListOrder: OrderModel[] = [];

    isFilterOpen = false;
    selectedFilters: string[] = [];
    filterOptions: Option[] = [
        { label: 'Chờ xác nhận', value: OrderStatus.PENDING },
        { label: 'Đã thanh toán', value: OrderStatus.PAID },
        { label: 'Đang xử lý', value: OrderStatus.PROCESSING },
        { label: 'Đã vận chuyển', value: OrderStatus.SHIPPED },
        { label: 'Đã hoàn thành', value: OrderStatus.COMPLETED },
        { label: 'Đã hủy', value: OrderStatus.CANCELED }
    ];

    OrderStatus = OrderStatus;
    OrderStatusOptions: Option[] = [
        { label: 'Đã vận chuyển', value: OrderStatus.SHIPPED },
        { label: 'Đang xử lý', value: OrderStatus.PROCESSING }
    ];

    sortOptions: Option[] = [
        { label: 'Giá tăng dần', value: 'price_asc' },
        { label: 'Giá giảm dần', value: 'price_desc' },
        { label: 'Mới nhất', value: 'created_at_desc' },
        { label: 'Cũ nhất', value: 'created_at_asc' },
    ];

    constructor(
        private router: Router,
        private dialogService: NbDialogService,
        private cdr: ChangeDetectorRef,
        private orderMana: OrderManagement
    ) { }

    @HostListener('document:click', ['$event'])
    onDocumentClick(event: MouseEvent) {
        const filterElement = document.querySelector('.filter-box');
        const toggleButton = document.querySelector('.util-box img');
        if (this.isFilterOpen && filterElement && !filterElement.contains(event.target as Node) && !toggleButton?.contains(event.target as Node)) {
            this.isFilterOpen = false;
            this.cdr.detectChanges();
        }
    }

    async ngOnInit() {
        this.paging = new PagingModel();
        await this.fetchListShopOrder();
        this.resetPagination();

        this.search.valueChanges
            .pipe(debounceTime(300))
            .subscribe(() => this.onFilter());

        this.cdr.detectChanges();
    }

    async fetchListShopOrder() {
        try {
            this.listOrder = await this.orderMana.fetchListOrderShop();
            this.applyFilterAndSort();
        } catch (error) {
            console.error(error);
        }
    }

    applyFilterAndSort() {
        let filteredList = [...this.listOrder];
        const searchValue = this.search.value?.trim().toLowerCase() ?? '';
        const selectedSet = new Set(this.selectedFilters);

        if (searchValue) {
            filteredList = filteredList.filter(order =>
                order.id.toString().includes(searchValue) ||
                order.user?.name?.toLowerCase().includes(searchValue)
            );
        }

        if (selectedSet.size > 0) {
            filteredList = filteredList.filter(order => selectedSet.has(order.status));
        }

        const sortValue = this.sortControl.value ?? 'created_at_desc';
        filteredList.sort((a, b) => {
            switch (sortValue) {
                case 'price_asc':
                    return a.final_total - b.final_total;
                case 'price_desc':
                    return b.final_total - a.final_total;
                case 'created_at_asc':
                    return new Date(a?.created_at || 0).getTime() - new Date(b.created_at || 0).getTime();
                case 'created_at_desc':
                    return new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime();
                case 'status_asc':
                    return a.status.localeCompare(b.status);
                default:
                    return 0;
            }
        });

        this.displayListOrder = filteredList;
        this.isFilterOpen = false;
        this.resetPagination();
        this.cdr.detectChanges();
    }

    async onDetailOrder(order_id: number, order_shop_id: number) {
        this.router.navigate([OrderURL.DETAIL_ORDER], { queryParams: { order_id, order_shop_id } });
    }

    onPageChange(currentPage: number) {
        this.paging.currentPage = currentPage;
        this.offset = (currentPage - 1) * this.paging.itemsPerPage + 1;
        this.cdr.detectChanges();
    }

    resetPagination() {
        this.paging.currentPage = 1;
        this.paging.itemsPerPage = 10;
        this.paging.totalItems = this.displayListOrder.length;
        this.paging.totalPage = Math.ceil(this.displayListOrder.length / this.paging.itemsPerPage);
        this.offset = (this.paging.currentPage - 1) * this.paging.itemsPerPage + 1;
    }

    async onRefreshTable() {
        await this.fetchListShopOrder();
        this.search.setValue('', { emitEvent: false });
        this.sortControl.setValue('created_at_desc', { emitEvent: false });
        this.selectedFilters = [];
        this.applyFilterAndSort();
    }

    onToggleOpenFilter(event: Event) {
        event.stopPropagation();
        this.isFilterOpen = !this.isFilterOpen;
    }

    onFilterToggle(value: string) {
        if (this.selectedFilters.includes(value)) {
            this.selectedFilters = this.selectedFilters.filter(item => item !== value);
        } else {
            this.selectedFilters.push(value);
        }
    }

    onSortToggle(value: string) {
        this.sortControl.setValue(value, { emitEvent: false });
    }

    onFilter() {
        this.applyFilterAndSort();
    }

    onCancelFilter() {
        this.isFilterOpen = false;
        this.selectedFilters = [];
        this.applyFilterAndSort();
    }

    async onChangeStatus(order_shop_id: number, newStatus: string, index: number) {
        const order = this.listOrder.find(o => o.order_shop_id === order_shop_id);
        if (!order) return;

        try {
            await this.orderMana.updateStatusOrderShop(order_shop_id, newStatus);
            order.status = newStatus;
            this.displayListOrder[index] = order;
            this.cdr.detectChanges();
            ToastNotification.success("Đổi trạng thái đơn hàng thành công");
        } catch (error) {
            console.error('Lỗi khi cập nhật trạng thái:', error);
            ToastNotification.error("Đổi trạng thái đơn hàng thất bại");
        }
    }
}