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

const NB_LIBS = [
    NbInputModule,
    NbButtonModule,
    NbIconModule,
    NbTooltipModule
]

@Component({
    selector: 'product-list-component',
    standalone: true,
    templateUrl: './product-list.component.html',
    styleUrl: './product-list.component.scss',
    imports: [
        ...NB_LIBS,
        CommonModule,
    ],
    providers: [
        ProductManagement,
        ProductService
    ]
})

export class ProductListComponent implements OnInit {

    image_not_found: string = ImageResource.image_not_found;

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
        await this.fetchAllProducts();
    }

    async fetchAllProducts() {
        try {
            let shopId: any = this.appConfig.getShopId();
            shopId = 1; // Nhớ sửa sau
            this.allProducts = await this.productManagement.fetchAllProductsByShopId(shopId);
            console.log(this.allProducts);
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
        } catch (error) {
            console.log(error);
        }
    }
}