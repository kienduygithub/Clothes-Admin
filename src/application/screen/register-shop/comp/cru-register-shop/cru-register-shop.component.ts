import { CommonModule } from "@angular/common";
import { AfterViewInit, ChangeDetectorRef, Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { ShopManagement } from "../../../../data/management/shop.management";
import { ShopService } from "../../../../data/service/shop.service";
import { ActivatedRoute, Router } from "@angular/router";
import { NbButtonModule, NbDialogService, NbIconModule, NbInputModule, NbSelectModule, NbTooltipModule } from "@nebular/theme";
import { ShopModel } from "../../../../data/model/shop.model";
import { actions } from "../../../../common/resource/actions";
import { ImageResource } from "../../../../common/resource/image_resource";
import { AppConfig } from "../../../../common/config/app.config";
import { ValueValidators } from "../../../../common/utils/validate/value.validate";
import { CKEditorComponent } from "../../../../common/utils/ckeditor/ckeditor.component";
import { ErrorComponent } from "../../../../common/layout/notify/error/error.component";
import { RegisterShopURL } from "../../register-shop.routing";
import { UserModel } from "../../../../data/model/user/user.model";
import { AuthManagement } from "../../../../data/management/auth.management";

const NB_LIBS = [
    NbInputModule,
    NbButtonModule,
    NbTooltipModule,
    NbSelectModule,
    NbIconModule
]

const PROVIDERS = [
    ShopManagement,
    ShopService
]

@Component({
    standalone: true,
    selector: 'cru-register-shop-component',
    templateUrl: './cru-register-shop.component.html',
    styleUrl: './cru-register-shop.component.scss',
    imports: [
        ...NB_LIBS,
        CommonModule,
        ReactiveFormsModule,
    ],
    providers: [...PROVIDERS]
})

export class CRURegisterShopComponent implements OnInit {

    icons_arrow_line = ImageResource.icons_arrow_line;
    icon_upload_v2 = ImageResource.icon_upload_v2;
    icon_upload_v4 = ImageResource.icon_upload_v4;
    icon_upload_v3 = ImageResource.icon_upload_v3;
    icon_delete = ImageResource.delete_button;
    icon_visible_eye = ImageResource.icon_visible_eye;
    icon_invisible_eye = ImageResource.icon_invisible_eye;
    image_not_found: string = ImageResource.image_not_found;
    image_no_avatar: string = ImageResource.image_no_avatar;
    icon_no_logo_shop = ImageResource.icon_no_logo_shop;
    image_store_logo_upload = ImageResource.image_store_logo_upload;

    actionWebs = actions;
    action = this.actionWebs.CREATE;
    isSubmit: boolean = false;
    isVisiblePassword = false;
    cruForm!: FormGroup;
    registerShopId: number = 0;
    registerShop!: ShopModel;
    selectedImageFile!: File;
    selectedLogoFile!: File;
    selectedBackgroundFile!: File;
    typeFiles = {
        LOGO: 'logo',
        BACKGROUND: 'background'
    };
    preImage: string = '';

    constructor(
        private router: Router,
        private activatedRoute: ActivatedRoute,
        private appConfig: AppConfig,
        private formBuilder: FormBuilder,
        private shopManagement: ShopManagement,
        private dialogService: NbDialogService,
    ) { }

    async ngOnInit(): Promise<void> {
        this.activatedRoute.queryParams.subscribe(
            async (params) => {
                if (params['id']) {
                    this.preImage = this.appConfig.getPreImage() ?? '';
                    this.registerShopId = params['id'];
                    await this.initCreateForm();
                } else {
                    this.onBack();
                }
            }
        )
        await this.initCreateForm();
    }

    async initCreateForm() {
        try {
            this.registerShop = await this.shopManagement.fetchShopById(this.registerShopId);
        } catch (error) {
            console.log(error);
        }

        if (!this.registerShop) {
            this.onBack();
            return;
        }

        this.cruForm = this.formBuilder.group({
            name: [this.registerShop.user?.name ?? ''],
            email: [this.registerShop.user?.email ?? ''],
            phone: [this.registerShop.user?.phone ?? ''],
            gender: [this.registerShop.user?.gender?.toString() ?? '1'],
            address: [this.registerShop.user?.address ?? ''],
            image_url: [this.registerShop.user?.image_url ?? ''],
            // Shop
            shop_name: [this.registerShop.shop_name],
            logo_url: [this.registerShop.logo_url],
            background_url: [this.registerShop.background_url],
            contact_email: [this.registerShop.contact_email],
            contact_address: [this.registerShop.contact_address],
            description: [this.registerShop.description],
        });

        this.emailValueChanges();
    }

    private emailValueChanges() {
        this.cruForm.get('email')?.valueChanges
            .subscribe((response) => {
                this.cruForm.get('contact_email')?.patchValue(response, { emitEvent: false });
            });

        this.cruForm.get('contact_email')?.valueChanges
            .subscribe((response) => {
                this.cruForm.get('email')?.patchValue(response, { emitEvent: false });
            })
    }

    onChangeLogoFile(files: any, typeFile: string) {
        if (files && files.length > 0) {
            if (typeFile === this.typeFiles.LOGO) {
                this.selectedLogoFile = files[0];
                this.cruForm.get('logo_url')?.patchValue(
                    URL.createObjectURL(files[0]),
                    { emitEvent: false }
                );
            } else if (typeFile === this.typeFiles.BACKGROUND) {
                this.selectedBackgroundFile = files[0];
                this.cruForm.get('background_url')?.patchValue(
                    URL.createObjectURL(files[0]),
                    { emitEvent: false }
                )
            }
        }
    }

    onChangeAvatarFile(files: any) {
        if (files && files[0]) {
            this.selectedImageFile = files[0];
            this.cruForm.get('image_url')?.patchValue(
                URL.createObjectURL(files[0]),
                { emitEvent: false }
            );
        }
    }

    onToggleVisiblePassword() {
        this.isVisiblePassword = !this.isVisiblePassword;
    }

    onBack() {
        this.router.navigate([RegisterShopURL.REGISTER_SHOP_URL]);
    }

    async onCancel() {
        this.router.navigate([RegisterShopURL.REGISTER_SHOP_URL]);
    }

    async onSave() {
        try {

        } catch (error) {
            console.log(error);
        }
    }
}