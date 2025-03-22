import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from "@angular/core";
import { ShopManagement } from "../../../../data/management/shop.management";
import { ShopService } from "../../../../data/service/shop.service";
import { CommonModule } from "@angular/common";
import { Router, RouterModule } from "@angular/router";
import { ImageResource } from "../../../../common/resource/image_resource";
import { PagingModel } from "../../../../common/model/paging.model";
import { ShopModel } from "../../../../data/model/shop.model";
import { AppConfig } from "../../../../common/config/app.config";
import { NbButtonModule, NbDialogService, NbIconModule, NbInputModule, NbTooltipModule } from "@nebular/theme";
import { WarningComponent } from "../../../../common/layout/notify/warning/warnimg.component";
import { NgxPaginationModule } from "ngx-pagination";
import { CouponUrl } from "../../coupon.routing";
import { CouponManagement } from "../../../../data/management/coupon.management";
import { CouponService } from "../../../../data/service/coupon.service";
import { CouponModel } from "../../../../data/model/coupon/coupon.model";
import { CouponStatus } from "../../../../common/resource/status";
import { DiscountType } from "../../../../common/resource/coupon";
import { FormControl, ReactiveFormsModule } from "@angular/forms";
import { debounceTime } from "rxjs";

const NB_LIBS = [
    NbInputModule,
    NbButtonModule,
    NbIconModule,
    NbTooltipModule
]

const ANGULAR_MODULES = [
    CommonModule,
    ReactiveFormsModule,
    NgxPaginationModule
]

const PROVIDERS = [
    CouponManagement,
    CouponService
]

@Component({
    standalone: true,
    selector: 'coupon-list-component',
    templateUrl: './coupon-list.component.html',
    styleUrl: './coupon-list.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [
        ...NB_LIBS,
        ...ANGULAR_MODULES
    ],
    providers: [
        ...PROVIDERS
    ]
})

export class CouponListComponent implements OnInit {

    icon_filter: string = ImageResource.icon_filter;
    icon_refresh: string = ImageResource.icon_refresh;
    icon_edit: string = ImageResource.icon_edit;
    image_not_found: string = ImageResource.image_not_found;

    offset: number = 0;
    paging!: PagingModel;

    preImage: string = '';
    coupons: CouponModel[] = [];
    displayCoupons: CouponModel[] = [];
    couponStatus = CouponStatus;
    search = new FormControl('');

    isFilterOpen = false;
    selectedFilters: string[] = [];
    filterOptions = [
        { label: 'Loại phần trăm', value: '1' },
        { label: 'Loại cố định', value: '2' },
        { label: 'Chưa hết hạn', value: '3' },
        { label: 'Đã quá hạn', value: '4' }
    ];

    constructor(
        private router: Router,
        private appConfig: AppConfig,
        private dialogService: NbDialogService,
        private couponManagement: CouponManagement,
        private cdr: ChangeDetectorRef
    ) { }

    async ngOnInit() {
        this.preImage = this.appConfig.getPreImage() ?? "";
        this.paging = new PagingModel();
        await this.fetchCoupons();
        this.resetPagination();
        this.searchValueChanges();
        this.cdr.detectChanges();
    }

    async fetchCoupons() {
        try {
            this.coupons = await this.couponManagement.fetchCoupons();
            this.displayCoupons = [...this.coupons];
        } catch (error) {
            console.log(error);
        }
    }

    onEditCoupon(id: number) {
        this.router.navigate([CouponUrl.COUPON_VIEW_URL], { queryParams: { id: id } });
    }

    onConfirmDeleteCoupon(coupon: CouponModel, index: number) {
        this.dialogService.open(WarningComponent, {
            context: {
                title: 'Xóa',
                content: 'Bạn có chắc muốn xóa mã khuyến mãi ' + coupon.name + '?',
            }
        }).onClose.subscribe(async (response) => {
            if (response === true) {
                try {
                    await this.couponManagement.deleteCouponById(coupon.id);
                    this.coupons.splice(index, 1);
                    this.paging.totalItems = this.coupons.length;
                    this.paging.totalPage = Math.ceil(this.coupons.length / this.paging.itemsPerPage);
                    if (this.paging.currentPage === this.paging.totalPage + 1) {
                        this.onPageChange(this.paging.currentPage - 1);
                    }
                    this.cdr.detectChanges();
                } catch (error) {
                    console.log(error);
                }
            }
        })
    }

    transformCouponStatus(status: number) {
        switch (status) {
            case CouponStatus.ACTIVE:
                return 'Còn hạn';
            case CouponStatus.EXPIRED:
            default:
                return 'Hết hạn';
        }
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
        this.paging.totalItems = this.displayCoupons.length;
        this.paging.totalPage = Math.ceil(this.displayCoupons.length / 3);
        this.paging.before = 0;
        this.paging.after = 0;

        this.offset = (this.paging.currentPage - 1) * this.paging.itemsPerPage + 1;
    }

    convertDiscountType(type: string) {
        switch (type) {
            case DiscountType.FIXED:
                return 'Cố định';
            case DiscountType.PERCENTAGE:
                return 'Phần trăm';
            default:
                return type;
        }
    }

    private searchValueChanges() {
        this.search.valueChanges
            .pipe(debounceTime(300))
            .subscribe(value => {
                this.onFilter();
            });
    }

    async onRefreshTable() {
        await this.fetchCoupons();
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
            if (searchValue === '') {
                this.displayCoupons = [...this.coupons];
            } else {
                this.displayCoupons = this.coupons.filter(
                    coupon => coupon.name.toLowerCase().includes(searchValue.toLowerCase())
                );
            }
        } else {
            this.displayCoupons = this.coupons.filter(coupon => {
                const isPercentage = conditions.isPercentage && coupon.discount_type === DiscountType.PERCENTAGE;
                const isFixed = conditions.isFixed && coupon.discount_type === DiscountType.FIXED;
                const isNotExpired = conditions.isNotExpired && coupon.status === CouponStatus.ACTIVE;
                const isExpired = conditions.isExpired && coupon.status === CouponStatus.EXPIRED;

                return (isPercentage || isFixed || isNotExpired || isExpired)
                    && coupon.name.toLowerCase().includes(searchValue.toLowerCase());
            })
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
}