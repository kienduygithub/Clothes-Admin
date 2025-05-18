import { CommonModule } from "@angular/common";
import { AfterViewInit, ChangeDetectorRef, Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, ReactiveFormsModule } from "@angular/forms";
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
import { OverviewUrl } from "../../overview.routing";
import { ToastNotification } from "../../../common/toast/toast.component";

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
    templateUrl: './shop-details.component.html',
    styleUrl: './shop-details.component.scss',
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

export class ShopDetailsComponent implements OnInit {

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
    updatedShop!: ShopModel;
    updatedId!: number;
    updatedName!: string;
    selectedLogoFile!: File;
    selectedBackgroundFile!: File;
    typeFiles = {
        LOGO: 'logo',
        BACKGROUND: 'background'
    };

    constructor(
        private router: Router,
        private activatedRoute: ActivatedRoute,
        private appConfig: AppConfig,
        private formBuilder: FormBuilder,
        private shopManagement: ShopManagement,
        private dialogService: NbDialogService,
        private cdr: ChangeDetectorRef
    ) { }

    async ngOnInit() {
        this.preImage = this.appConfig.getPreImage() ?? "";
        this.checkCreateOrUpdate();
    }

    checkCreateOrUpdate() {
        this.activatedRoute.paramMap.subscribe(async (params) => {
            const id = params.get('id')
            if (id && id !== '') {
                this.action = actions.UPDATE;
                this.updatedId = +id;
                await this.initUpdateForm();
            } else {
                this.router.navigate([OverviewUrl.OWNER_OVERVIEW]);
                ToastNotification.error("Cửa hàng không tồn tại");
            }
        })
    }

    initCreateForm() {
        this.cruForm = this.formBuilder.group({
            shop_name: ['', [ValueValidators.required]],
            logo_url: ['', [ValueValidators.required]],
            background_url: ['', [ValueValidators.required]],
            contact_email: ['', [ValueValidators.required]],
            contact_address: ['', [ValueValidators.required]],
            description: ['']
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
                shop_name: [this.updatedName, [ValueValidators.required]],
                logo_url: [this.updatedShop.logo_url, [ValueValidators.required]],
                background_url: [this.updatedShop.background_url, [ValueValidators.required]],
                contact_email: [this.updatedShop.contact_email, [ValueValidators.required]],
                contact_address: [this.updatedShop.contact_address, [ValueValidators.required]],
                description: [this.updatedShop.description]
            });
        }
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

    onCancel() {
        this.router.navigate([OverviewUrl.OWNER_OVERVIEW]);
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

        if (this.cruForm.invalid) {
            if (this.cruForm.get('logo_url')?.hasError('required') || this.cruForm.get('background_url')?.hasError('required')) {
                this.dialogService.open(ErrorComponent, {
                    context: {
                        title: 'Không hợp lệ',
                        content: 'Ảnh nền và logo không được để trống. Vui lòng thêm để hoàn tất thao tác.'
                    }
                })
            }
            console.log('INVALID FORM');
            return;
        }

        try {
            const instance = this.convertValueFormToModel();
            await this.shopManagement.createShop(
                instance,
                this.selectedLogoFile,
                this.selectedBackgroundFile
            );
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
            await this.shopManagement.updateShopById(
                instance,
                this.selectedLogoFile,
                this.selectedBackgroundFile
            );
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
        model.shop_name = this.cruForm.getRawValue().shop_name === this.updatedName
            ? undefined
            : this.cruForm.getRawValue().shop_name;
        model.contact_email = this.cruForm.getRawValue().contact_email;
        model.contact_address = this.cruForm.getRawValue().contact_address;
        model.description = this.cruForm.getRawValue().description;

        return model;
    }
}