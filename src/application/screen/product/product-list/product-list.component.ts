import { Component, OnInit } from "@angular/core";
import { ProductManagement } from "../../../data/management/product.management";
import { ProductService } from "../../../data/service/product.service";
import { Router } from "@angular/router";
import { ProductModel } from "../../../data/model/product.model";
import { AppConfig } from "../../../common/config/app.config";
import { CommonModule } from "@angular/common";
import { NbButtonModule, NbDialogService, NbIconModule, NbInputModule, NbTooltipModule } from "@nebular/theme";
import { ImageResource } from "../../../common/resource/image_resource";
import { WarningComponent } from "../../../common/layout/notify/warning/warnimg.component";
import { NgxPaginationModule } from "ngx-pagination";
import { PagingModel } from "../../../common/model/paging.model";
import { ProductUrl } from "../product.routing";
import { CurrencyPipe } from "../../../common/layout/pipes/currency.pipe";

const NB_LIBS = [
    NbInputModule,
    NbButtonModule,
    NbIconModule,
    NbTooltipModule
]

const ANGULAR_LIBS = [
    CommonModule,
    NgxPaginationModule
]

const PIPES = [
    CurrencyPipe
]

@Component({
    selector: 'product-list-component',
    standalone: true,
    templateUrl: './product-list.component.html',
    styleUrl: './product-list.component.scss',
    imports: [
        ...NB_LIBS,
        ...ANGULAR_LIBS,
        ...PIPES,
    ],
    providers: [
        ProductManagement,
        ProductService
    ]
})

export class ProductListComponent implements OnInit {

    icon_filter: string = ImageResource.icon_filter;
    icon_refresh: string = ImageResource.icon_refresh;
    icon_edit: string = ImageResource.icon_edit;
    image_not_found: string = ImageResource.image_not_found;

    offset: number = 0;
    paging!: PagingModel;

    preImage: string = '';
    allProducts: ProductModel[] = [];

    constructor(
        private router: Router,
        private appConfig: AppConfig,
        private dialogService: NbDialogService,
        private productManagement: ProductManagement
    ) { }

    async ngOnInit() {
        this.preImage = this.appConfig.getPreImage() ?? "";
        this.paging = new PagingModel();
        await this.fetchAllProducts();
        this.resetPagination();
    }

    async fetchAllProducts() {
        try {
            this.allProducts = await this.productManagement.fetchAllProductsByShopId();
        } catch (error) {
            console.log(error);
        }
    }

    onUpdateProduct(id: number) {
        this.router.navigate([ProductUrl.PRODUCT_VIEW], { queryParams: { id: id } });
    }

    onConfirmDeleteProduct(product: ProductModel, index: number) {
        this.dialogService.open(WarningComponent, {
            context: {
                title: 'Xóa',
                content: 'Bạn có chắc muốn xóa sản phẩm ' + product.product_name + '?',
            }
        }).onClose.subscribe(async (response) => {
            if (response === true) {
                try {
                    await this.productManagement.deleteProductById(product.id ?? 0);
                    this.allProducts.splice(index, 1)
                    this.paging.totalItems = this.allProducts.length;
                    this.paging.totalPage = Math.ceil(this.allProducts.length / this.paging.itemsPerPage);
                    if (this.paging.currentPage === this.paging.totalPage + 1) {
                        this.onPageChange(this.paging.currentPage - 1);
                    }
                } catch (error) {
                    console.log(error);
                }
            }
        })
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
        this.paging.totalItems = this.allProducts.length;
        this.paging.totalPage = Math.ceil(this.allProducts.length / 3);
        this.paging.before = 0;
        this.paging.after = 0;

        this.offset = (this.paging.currentPage - 1) * this.paging.itemsPerPage + 1;
    }
}