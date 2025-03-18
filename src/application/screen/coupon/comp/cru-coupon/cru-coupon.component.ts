import { CommonModule } from "@angular/common";
import { ChangeDetectorRef, Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, ReactiveFormsModule } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { NbButtonModule, NbDialogService, NbIconModule, NbInputModule, NbSelectModule, NbTooltipModule } from "@nebular/theme";
import { ShopModel } from "../../../../data/model/shop.model";
import { actions } from "../../../../common/resource/actions";
import { ImageResource } from "../../../../common/resource/image_resource";
import { AppConfig } from "../../../../common/config/app.config";
import { ValueValidators } from "../../../../common/utils/validate/value.validate";
import { CouponUrl } from "../../coupon.routing";
import { CouponManagement } from "../../../../data/management/coupon.management";
import { CouponService } from "../../../../data/service/coupon.service";
import { UuidService } from "../../../../common/service/uuid.service";
import { DiscountType } from "../../../../common/resource/coupon";
import { DatePickerComponent } from "../../../common/date-picker/custom-select.component";

const NB_LIBS = [
    NbInputModule,
    NbButtonModule,
    NbTooltipModule,
    NbSelectModule,
    NbIconModule
]

const ANGULAR_MODULES = [
    CommonModule,
    ReactiveFormsModule,
]

const PROVIDERS = [
    CouponManagement,
    CouponService
]

@Component({
    standalone: true,
    selector: 'cru-coupon-component',
    templateUrl: './cru-coupon.component.html',
    styleUrl: './cru-coupon.component.scss',
    imports: [
        ...NB_LIBS,
        ...ANGULAR_MODULES,
        DatePickerComponent
    ],
    providers: [...PROVIDERS]
})

export class CRUCouponComponent implements OnInit {

    icons_arrow_line = ImageResource.icons_arrow_line;
    icon_upload_v4 = ImageResource.icon_upload_v4;
    icon_upload_v3 = ImageResource.icon_upload_v3;

    icon_delete = ImageResource.delete_button;
    icon_visible_eye = ImageResource.icon_visible_eye;
    icon_invisible_eye = ImageResource.icon_invisible_eye;
    icon_no_logo_shop = ImageResource.icon_no_logo_shop;
    image_not_found: string = ImageResource.image_not_found;
    image_no_avatar: string = ImageResource.image_no_avatar;
    preImage: string = '';

    actionWebs = actions;
    action = this.actionWebs.CREATE;
    isSubmit: boolean = false;
    cruForm!: FormGroup;
    discountType = DiscountType;

    constructor(
        private router: Router,
        private activatedRoute: ActivatedRoute,
        private appConfig: AppConfig,
        private formBuilder: FormBuilder,
        private dialogService: NbDialogService,
        private couponManagement: CouponManagement,
        private uuidService: UuidService,
        private cdr: ChangeDetectorRef
    ) { }

    async ngOnInit() {
        this.preImage = this.appConfig.getPreImage() ?? "";
        this.checkCreateOrUpdate();
    }

    checkCreateOrUpdate() {
        this.activatedRoute.queryParams.subscribe(async (params) => {
            if (params['id']) {
                this.action = actions.UPDATE;
                await this.initUpdateForm();
            } else {
                this.action = actions.CREATE;
                this.initCreateForm();
            }
        })
    }

    initCreateForm() {
        this.cruForm = this.formBuilder.group({
            coupon_name: ['', [ValueValidators.required]],
            code: [{ value: this.uuidService.generateUuid(), disabled: true }, [ValueValidators.required]],
            discount_type: [DiscountType.PERCENTAGE],
            discount_value: ['', [ValueValidators.required]],
            max_discount: ['', [ValueValidators.required]],
            min_order_value: [''],
            times_used: [''],
            max_usage: [''],
            valid_from: ['', [ValueValidators.required]],
            valid_to: ['', [ValueValidators.required]]
        });

    }

    async initUpdateForm() {
        try {

        } catch (error) {
            console.log(error);
        }
        if (true) {
            this.action = actions.CREATE;
            // this.updatedId = 0;
            this.initCreateForm();
        } else {
            this.cruForm = this.formBuilder.group({

            });
        }
    }

    onCancel() {
        // this.router.navigate([CouponUrl.COUPON_LIST_URL]);
    }

    async onSave() {
        if (this.action === actions.CREATE) {
            await this.handleCreate();
        } else if (this.action === actions.UPDATE) {
            await this.handleUpdate();
        }
    }

    async handleCreate() {
        this.isSubmit = true;
        console.log(this.cruForm.value);

        // if (this.cruForm.invalid) {
        //     console.log('INVALID FORM');
        //     return;
        // }

        try {
            const instance = this.convertValueFormToModel();

            this.onCancel();
        } catch (error) {
            console.log(error);
        }
    }

    async handleUpdate() {
        this.isSubmit = true;

        if (this.cruForm.invalid) {
            console.log('INVALID FORM');
            console.log(this.cruForm.value);
            return;
        }

        try {
            const instance = this.convertValueFormToModel();

            this.onCancel();
        } catch (error) {
            console.log(error);
        }
    }

    convertValueFormToModel() {
        const model = new ShopModel();

        if (this.action === actions.UPDATE) {
            // model.id = this.updatedId;
        }


        return model;
    }

    generateCode() {
        this.cruForm.get('code')?.patchValue(
            this.uuidService.generateUuid()
        );
    }
}