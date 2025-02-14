import { Component, OnInit } from "@angular/core";
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
import { ShopURL } from "../../shop.routing";

const NB_LIBS = [
    NbInputModule,
    NbButtonModule,
    NbIconModule,
    NbTooltipModule
]

@Component({
    standalone: true,
    selector: 'shop-list-component',
    templateUrl: './shop-list.component.html',
    styleUrl: './shop-list.component.scss',
    imports: [
        ...NB_LIBS,
        CommonModule,
        NgxPaginationModule
    ],
    providers: [
        ShopManagement,
        ShopService
    ]
})

export class ShopListComponent implements OnInit {

    icon_filter: string = ImageResource.icon_filter;
    icon_refresh: string = ImageResource.icon_refresh;
    image_not_found: string = ImageResource.image_not_found;

    offset: number = 0;
    paging!: PagingModel;

    preImage: string = '';
    allShops: ShopModel[] = [];

    constructor(
        private router: Router,
        private appConfig: AppConfig,
        private dialogService: NbDialogService,
        private shopManagement: ShopManagement
    ) { }

    async ngOnInit() {
        this.preImage = this.appConfig.getPreImage() ?? "";
        this.paging = new PagingModel();
        await this.fetchAllShops();
        this.resetPagination();
    }

    async fetchAllShops() {
        try {
            this.allShops = await this.shopManagement.fetchAllShops();
            console.log(this.allShops);
        } catch (error) {
            console.log(error);
        }
    }

    onUpdateShop(id: number) {
        this.router.navigate([ShopURL.EDIT_SHOP_URL], { queryParams: { id: id } });
    }

    onConfirmDeleteShop(shop: ShopModel, index: number) {
        this.dialogService.open(WarningComponent, {
            context: {
                title: 'Xóa',
                content: 'Bạn có chắc muốn xóa cửa hàng ' + shop.shop_name + '?',
                acceptFunc: this.handleDeleteShop.bind(this, shop.id!, index)
            }
        })
    }

    async handleDeleteShop(userId: number, index: number) {
        try {
            // await this.shopManagement.deleteShopById(userId);
            this.allShops.splice(index, 1);
            this.paging.totalItems = this.allShops.length;
            this.paging.totalPage = Math.ceil(this.allShops.length / this.paging.itemsPerPage);
            if (this.paging.currentPage === this.paging.totalPage + 1) {
                this.onPageChange(this.paging.currentPage - 1);
            }
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
        this.paging.totalItems = this.allShops.length;
        this.paging.totalPage = Math.ceil(this.allShops.length / 3);
        this.paging.before = 0;
        this.paging.after = 0;

        this.offset = (this.paging.currentPage - 1) * this.paging.itemsPerPage + 1;
    }
}