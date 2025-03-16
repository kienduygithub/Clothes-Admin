import { Component, OnInit } from "@angular/core";
import { ShopManagement } from "../../../../data/management/shop.management";
import { ShopService } from "../../../../data/service/shop.service";
import { CommonModule } from "@angular/common";
import { Router } from "@angular/router";
import { ImageResource } from "../../../../common/resource/image_resource";
import { PagingModel } from "../../../../common/model/paging.model";
import { ShopModel } from "../../../../data/model/shop.model";
import { AppConfig } from "../../../../common/config/app.config";
import { NbButtonModule, NbDialogService, NbIconModule, NbInputModule, NbTooltipModule } from "@nebular/theme";
import { WarningComponent } from "../../../../common/layout/notify/warning/warnimg.component";
import { NgxPaginationModule } from "ngx-pagination";
import { RegisterShopURL } from "../../register-shop.routing";
import { TransformShopStatusPipe } from "../../../../common/layout/pipes/transformShopStatus";
import { ShopStatus } from "../../../../common/resource/status";
import { actions } from "../../../../common/resource/actions";

const NB_LIBS = [
    NbInputModule,
    NbButtonModule,
    NbIconModule,
    NbTooltipModule
]

const ANGULAR_MODULES = [
    CommonModule,
    NgxPaginationModule
]

const PIPES = [
    TransformShopStatusPipe
]

@Component({
    standalone: true,
    selector: 'register-shop-list-component',
    templateUrl: './register-shop-list.component.html',
    styleUrl: './register-shop-list.component.scss',
    imports: [
        ...NB_LIBS,
        ...PIPES,
        ...ANGULAR_MODULES,
    ],
    providers: [
        ShopManagement,
        ShopService
    ]
})

export class RegisterShopListComponent implements OnInit {

    icon_filter: string = ImageResource.icon_filter;
    icon_refresh: string = ImageResource.icon_refresh;
    icon_edit_white_with_line: string = ImageResource.icon_edit_white_with_line;
    icon_edit: string = ImageResource.icon_edit;
    icon_tick_accept: string = ImageResource.icon_tick_accept;
    icon_close_refuse: string = ImageResource.icon_close_refuse;

    image_not_found: string = ImageResource.image_not_found;

    offset: number = 0;
    paging!: PagingModel;

    preImage: string = '';
    shops: ShopModel[] = [];
    shopStatus = ShopStatus;
    actionWebs = actions;

    constructor(
        private router: Router,
        private appConfig: AppConfig,
        private dialogService: NbDialogService,
        private shopManagement: ShopManagement
    ) { }

    async ngOnInit() {
        this.preImage = this.appConfig.getPreImage() ?? "";
        this.paging = new PagingModel();
        await this.fetchRegisterShops();
        this.resetPagination();
    }

    async fetchRegisterShops() {
        try {
            this.shops = await this.shopManagement.fetchRegisterShops();
            console.log(this.shops);
        } catch (error) {
            console.log(error);
        }
    }

    onViewDetails(id: number) {
        this.router.navigate([RegisterShopURL.VIEW_REGISTER_SHOP_URL], { queryParams: { id: id } });
    }

    onConfirmRequest(shop: ShopModel, index: number, request: string) {
        if (request === this.actionWebs.DECLINE) {
            this.dialogService.open(WarningComponent, {
                context: {
                    title: 'Bác bỏ',
                    content: 'Bạn có chắc muốn bác bỏ đơn đăng ký cửa hàng ' + shop.shop_name + '?',
                }
            }).onClose.subscribe(async (response) => {
                if (response === true) {
                    await this.declineRegisterShop(shop.id ?? 0, index);
                }
            })
            return;
        }

        if (request === this.actionWebs.ACCEPT) {
            this.dialogService.open(WarningComponent, {
                context: {
                    title: 'Chấp thuận',
                    content: 'Bạn có chắc muốn chấp thuận đơn đăng ký cửa hàng ' + shop.shop_name + '?',
                }
            }).onClose.subscribe(async (response) => {
                if (response === true) {
                    await this.acceptRegisterShop(shop.id ?? 0, index);
                }
            })
            return
        }
    }

    async declineRegisterShop(shopId: number, index: number) {
        try {
            // await this.shopManagement.deleteShopById(shopId);
            // this.shops.splice(index, 1);
            // this.paging.totalItems = this.shops.length;
            // this.paging.totalPage = Math.ceil(this.shops.length / this.paging.itemsPerPage);
            // if (this.paging.currentPage === this.paging.totalPage + 1) {
            //     this.onPageChange(this.paging.currentPage - 1);
            // }
        } catch (error) {
            console.log(error);
        }
    }
    async acceptRegisterShop(shopId: number, index: number) {
        try {
            // await this.shopManagement.deleteShopById(shopId);
            // this.shops.splice(index, 1);
            // this.paging.totalItems = this.shops.length;
            // this.paging.totalPage = Math.ceil(this.shops.length / this.paging.itemsPerPage);
            // if (this.paging.currentPage === this.paging.totalPage + 1) {
            //     this.onPageChange(this.paging.currentPage - 1);
            // }
        } catch (error) {
            console.log(error);
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
        this.paging.totalItems = this.shops.length;
        this.paging.totalPage = Math.ceil(this.shops.length / 3);
        this.paging.before = 0;
        this.paging.after = 0;

        this.offset = (this.paging.currentPage - 1) * this.paging.itemsPerPage + 1;
    }
}