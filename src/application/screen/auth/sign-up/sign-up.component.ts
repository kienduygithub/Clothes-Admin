import { Component, OnInit } from "@angular/core";
import { AuthManagement } from "../../../data/management/auth.management";
import { CommonModule } from "@angular/common";
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { NbButtonModule, NbCheckboxModule, NbDialogService, NbInputModule, NbLayoutModule, NbSelectModule } from "@nebular/theme";
import { ImageResource } from "../../../common/resource/image_resource";
import { Router } from "@angular/router";
import { AppConfig } from "../../../common/config/app.config";
import { ValueValidators } from "../../../common/utils/validate/value.validate";
import { UserModel } from "../../../data/model/user/user.model";
import { ShopModel } from "../../../data/model/shop.model";
import { ErrorComponent } from "../../../common/layout/notify/error/error.component";
import { AuthUrl } from "../auth.routing";

const NB_LIBS = [
    NbButtonModule,
    NbInputModule,
    NbSelectModule,
    NbLayoutModule,
    NbCheckboxModule
]

@Component({
    standalone: true,
    selector: 'sign-up-component',
    templateUrl: './sign-up.component.html',
    styleUrl: './sign-up.component.scss',
    imports: [
        ...NB_LIBS,
        CommonModule,
        ReactiveFormsModule,
    ],
    providers: [
        AuthManagement
    ]
})

export class SignUpComponent implements OnInit {

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

    isSubmit: boolean = false;
    isVisiblePassword = false;
    registerForm!: FormGroup;
    confirmForm!: FormGroup;
    selectedImageFile!: File;
    selectedLogoFile!: File;
    selectedBackgroundFile!: File;
    typeFiles = {
        LOGO: 'logo',
        BACKGROUND: 'background'
    };


    constructor(
        private router: Router,
        private appConfig: AppConfig,
        private formBuilder: FormBuilder,
        private dialogService: NbDialogService,
        private authManagement: AuthManagement
    ) { }

    ngOnInit(): void {
        this.initCreateForm();
    }

    initCreateForm() {
        this.confirmForm = this.formBuilder.group({
            name: ['', [ValueValidators.required]],
            email: ['', [ValueValidators.required, Validators.email]],
            password: ['', [ValueValidators.required]],
            phone: ['', [ValueValidators.required]],
            gender: ['1'],
            address: [''],
            image_url: ['', [ValueValidators.required]],
            // Shop
            shop_name: ['', [ValueValidators.required]],
            logo_url: ['', [ValueValidators.required]],
            background_url: ['', [ValueValidators.required]],
            contact_email: ['', [ValueValidators.required]],
            contact_address: ['', [ValueValidators.required]],
            description: [''],
            accept: [false]
        });

        this.emailValueChanges();
    }

    private emailValueChanges() {
        this.confirmForm.get('email')?.valueChanges
            .subscribe((response) => {
                this.confirmForm.get('contact_email')?.patchValue(response, { emitEvent: false });
            });

        this.confirmForm.get('contact_email')?.valueChanges
            .subscribe((response) => {
                this.confirmForm.get('email')?.patchValue(response, { emitEvent: false });
            })
    }

    onChangeLogoFile(files: any, typeFile: string) {
        if (files && files.length > 0) {
            if (typeFile === this.typeFiles.LOGO) {
                this.selectedLogoFile = files[0];
                this.confirmForm.get('logo_url')?.patchValue(
                    URL.createObjectURL(files[0]),
                    { emitEvent: false }
                );
            } else if (typeFile === this.typeFiles.BACKGROUND) {
                this.selectedBackgroundFile = files[0];
                this.confirmForm.get('background_url')?.patchValue(
                    URL.createObjectURL(files[0]),
                    { emitEvent: false }
                )
            }
        }
    }

    onChangeAvatarFile(files: any) {
        if (files && files[0]) {
            this.selectedImageFile = files[0];
            this.confirmForm.get('image_url')?.patchValue(
                URL.createObjectURL(files[0]),
                { emitEvent: false }
            );
        }
    }

    onToggleVisiblePassword() {
        this.isVisiblePassword = !this.isVisiblePassword;
    }

    onCancel() {
        this.router.navigate([AuthUrl.SIGNIN]);
    }

    async onSignUp() {
        this.isSubmit = true;
        console.log(this.confirmForm.value);
        if (this.confirmForm.invalid) {
            console.log('INVALID FORM');
            let errorMessage: string[] = [];
            if (this.confirmForm.get('image_url')?.hasError('required')) {
                errorMessage.push("Ảnh đại diện <b>người dùng</b> không được bỏ trống</br>");
            }
            if (this.confirmForm.get('logo_url')?.hasError('required')) {
                errorMessage.push("Ảnh đại diện <b>cửa hàng</b> không được bỏ trống</br>");
            }
            if (this.confirmForm.get('background_url')?.hasError('required')) {
                errorMessage.push("Ảnh nền <b>cửa hàng</b> không được bỏ trống</br>");
            }
            this.dialogService.open(ErrorComponent, {
                context: {
                    title: 'Không hợp lệ',
                    content: errorMessage.join("")
                }
            });
            return;
        }

        try {
            const userModel = this.convertValueFormToUserModel();
            const shopModel = this.convertValueFormToShopModel();
            const adminOwnerFile = this.selectedImageFile;
            const logoShopFile = this.selectedLogoFile;
            const backgroundShopFile = this.selectedBackgroundFile;
            await this.authManagement.signUp(
                userModel,
                shopModel,
                adminOwnerFile,
                logoShopFile,
                backgroundShopFile
            );
            this.router.navigate([AuthUrl.SIGNIN]);
        } catch (error) {
            console.log(error);
        }
    }

    convertValueFormToUserModel() {
        const model = new UserModel();
        model.name = this.confirmForm.getRawValue().name.trim();
        model.email = this.confirmForm.getRawValue().email.trim();
        model.password = this.confirmForm.getRawValue().password.trim();
        model.phone = this.confirmForm.getRawValue().phone.trim();
        model.address = this.confirmForm.getRawValue().address.trim();
        model.gender = this.confirmForm.getRawValue().gender;

        return model;
    }

    convertValueFormToShopModel() {
        const model = new ShopModel();
        model.shop_name = this.confirmForm.getRawValue().shop_name.trim();
        model.contact_email = this.confirmForm.getRawValue().contact_email.trim();
        model.contact_address = this.confirmForm.getRawValue().contact_address.trim();
        model.description = this.confirmForm.getRawValue().description.trim();

        return model;
    }
}