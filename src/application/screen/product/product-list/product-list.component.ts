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

const NB_LIBS = [
    NbInputModule,
    NbButtonModule,
    NbIconModule,
    NbTooltipModule
]

const ANGULAR_LIBS = [
    NgxPaginationModule
]

@Component({
    selector: 'product-list-component',
    standalone: true,
    templateUrl: './product-list.component.html',
    styleUrl: './product-list.component.scss',
    imports: [
        ...NB_LIBS,
        ...ANGULAR_LIBS,
        CommonModule,
    ],
    providers: [
        ProductManagement,
        ProductService
    ]
})

export class ProductListComponent implements OnInit {

    image_not_found: string = ImageResource.image_not_found;
    currentPage: number = 1;
    itemsPerPage: number = 3;
    totalItems: number = 20;
    offset: number = 0;
    indexTable: number = 0;
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
            let shopId: any = this.appConfig.getShopId();
            shopId = 1; // Nhớ sửa sau
            this.allProducts = await this.productManagement.fetchAllProductsByShopId(shopId);
            this.totalItems = this.allProducts.length;
        } catch (error) {
            console.log(error);
        }
    }

    onUpdateProduct(id: number) {
        this.router.navigate(['shop/product/products/view'], { queryParams: { id: id } });
    }

    onConfirmDeleteProduct(product: ProductModel) {
        this.dialogService.open(WarningComponent, {
            context: {
                title: 'Xóa',
                content: 'Bạn có chắc muốn xóa sản phẩm ' + product.product_name + ' này?',
                acceptFunc: this.handleDeleteProduct.bind(this, product.id!)
            }
        })
    }

    async handleDeleteProduct(productId: number) {
        try {
            await this.productManagement.deleteProductById(productId);
            this.allProducts = this.allProducts.filter(product => product.id !== productId);
            this.paging.totalItems = this.allProducts.length;
            this.paging.totalPage = Math.ceil(this.allProducts.length / this.paging.itemsPerPage);
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
        this.paging.itemsPerPage = 3;
        this.paging.totalItems = this.allProducts.length;
        this.paging.totalPage = Math.ceil(this.allProducts.length / 3);
        this.paging.before = 0;
        this.paging.after = 0;

        this.offset = (this.paging.currentPage - 1) * this.paging.itemsPerPage + 1;
        this.indexTable = 0;
    }
}