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
                if (value?.trim() === '') {
                    this.displayCoupons = [...this.coupons];
                    this.resetPagination();
                    this.cdr.detectChanges();
                    return;
                }

                this.displayCoupons = this.coupons.filter(coupon => coupon.name.toLowerCase().includes(value?.toLowerCase()?.trim() ?? ''))
                this.resetPagination();
                this.cdr.detectChanges();
            });
    }

    async onRefreshTable() {
        await this.fetchCoupons();
        this.resetPagination();
        this.search.setValue('', { emitEvent: false });
        this.cdr.detectChanges();
    }
}