import { CommonModule } from "@angular/common";
import { AfterViewInit, ChangeDetectorRef, Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, ReactiveFormsModule } from "@angular/forms";
import { ShopManagement } from "../../../../data/management/shop.management";
import { ShopService } from "../../../../data/service/shop.service";
import { ActivatedRoute, Router } from "@angular/router";
import { NbButtonModule, NbIconModule, NbInputModule, NbSelectModule, NbTooltipModule } from "@nebular/theme";
import { ShopModel } from "../../../../data/model/shop.model";
import { actions } from "../../../../common/resource/actions";
import { ImageResource } from "../../../../common/resource/image_resource";
import { AppConfig } from "../../../../common/config/app.config";
import { ValueValidators } from "../../../../common/utils/validate/value.validate";
import { CKEditorComponent } from "../../../../common/utils/ckeditor/ckeditor.component";

const NB_LIBS = [
    NbInputModule,
    NbButtonModule,
    NbTooltipModule,
    NbSelectModule,
    NbIconModule
]

@Component({
    standalone: true,
    selector: 'cru-shop-component',
    templateUrl: './cru-shop.component.html',
    styleUrl: './cru-shop.component.scss',
    imports: [
        ...NB_LIBS,
        CommonModule,
        ReactiveFormsModule,
        CKEditorComponent
    ],
    providers: [
        ShopManagement,
        ShopService
    ]
})

export class CRUShopComponent implements OnInit {

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
    isVisiblePassword = false;
    cruForm!: FormGroup;
    updatedShop!: ShopModel;
    updatedId!: number;
    updatedName!: string;
    selectedImageFile!: File;

    constructor(
        private router: Router,
        private activatedRoute: ActivatedRoute,
        private appConfig: AppConfig,
        private formBuilder: FormBuilder,
        private shopManagement: ShopManagement,
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
                this.updatedId = params['id'];
                await this.initUpdateForm();
            } else {
                this.action = actions.CREATE;
                this.initCreateForm();
            }
        })
    }

    initCreateForm() {
        this.cruForm = this.formBuilder.group({
            shop_name: ['', [ValueValidators.required]],
            contact_email: ['', [ValueValidators.required]],
            contact_address: ['', [ValueValidators.required]],
        });
    }

    async initUpdateForm() {
        try {
            this.updatedShop = await this.shopManagement.fetchShopById(this.updatedId);
            this.updatedName = this.updatedShop.shop_name!;
        } catch (error) {
            console.log(error);
        }
        if (!this.updatedShop) {
            this.action = actions.CREATE;
            this.updatedId = 0;
            this.initCreateForm();
        } else {
            this.updatedName = this.updatedShop.shop_name ?? '';
            this.cruForm = this.formBuilder.group({
                name: [this.updatedName, [ValueValidators.required]],

            });
        }
    }

    onCancel() {
        this.router.navigate(['/employee/list']);
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
            model.id = this.updatedId;
        }

        return model;
    }



}