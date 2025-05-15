import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { NbButtonModule, NbCheckboxModule, NbDialogService, NbInputModule, NbSelectModule, NbTooltipModule } from "@nebular/theme";
import { OrderManagement } from "../../../data/management/order.management";
import { OrderService } from "../../../data/service/order.service";
import { ImageResource } from "../../../common/resource/image_resource";
import { OrderModel } from "../../../data/model/order/order.model";
import { ActivatedRoute, Router } from "@angular/router";
import { AppConfig } from "../../../common/config/app.config";
import { OrderURL } from "../order.routing";


const NB_LIBS = [
    NbInputModule,
    NbButtonModule,
    NbSelectModule,
    NbCheckboxModule,
    NbTooltipModule
]

const ANGULAR_MODULES = [
    CommonModule,
    ReactiveFormsModule,
]

const PIPES = [
    // TransformColorId
]

const PROVIDERS = [
    OrderManagement,
    OrderService
]

@Component({
    standalone: true,
    selector: 'order-shop-detail-component',
    templateUrl: './order-shop-detail.component.html',
    styleUrl: './order-shop-detail.component.scss',
    imports: [
        ...NB_LIBS,
        ...ANGULAR_MODULES,
        // ...PIPES,
    ],
    providers: [...PROVIDERS],
})

export class OrderShopDetailComponent implements OnInit {

    icons_arrow_line = ImageResource.icons_arrow_line;
    icon_upload_v2 = ImageResource.icon_upload_v2;
    icon_delete = ImageResource.delete_button;
    image_not_found: string = ImageResource.image_not_found;

    preImage: string = '';

    detailOrderShop!: OrderModel;

    constructor(
        private router: Router,
        private activatedRoute: ActivatedRoute,
        private appConfig: AppConfig,
        private orderMana: OrderManagement,
        private dialogService: NbDialogService,
    ) { }

    async ngOnInit() {
        this.preImage = this.appConfig.getPreImage() ?? "";
        this.checkCreateOrUpdate();
    }


    checkCreateOrUpdate() {
        this.activatedRoute.queryParams.subscribe(async (params) => {
            if (params['order_id'] && params['order_shop_id']) {
                await this.fetchDetailOrderShop(parseInt(params['order_id']), parseInt(params['order_shop_id']));
            } else {
                this.router.navigate([OrderURL.LIST_ORDER]);
            }
        })
    }

    async fetchDetailOrderShop(order_id: number, order_shop_id: number) {
        try {
            this.detailOrderShop = await this.orderMana.fetchOrderShopDetail(order_id, order_shop_id)
        } catch (error) {
            console.log(error);
        }
    }

    async onSave() {

    }

    onCancel() {
        this.router.navigate([OrderURL.LIST_ORDER]);
    }
}