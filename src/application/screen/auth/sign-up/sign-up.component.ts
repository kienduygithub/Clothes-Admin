import { Component, OnInit } from "@angular/core";
import { AuthManagement } from "../../../data/management/auth.management";
import { CommonModule } from "@angular/common";
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { NbButtonModule, NbCheckboxModule, NbInputModule, NbLayoutModule, NbSelectModule } from "@nebular/theme";
import { ImageResource } from "../../../common/resource/image_resource";
import { Router } from "@angular/router";
import { AppConfig } from "../../../common/config/app.config";
import { ValueValidators } from "../../../common/utils/validate/value.validate";

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
    cruForm!: FormGroup;
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
    ) { }

    ngOnInit(): void {
        this.initCreateForm();
    }

    initCreateForm() {
        this.cruForm = this.formBuilder.group({
            name: ['', [ValueValidators.required]],
            email: ['', [ValueValidators.required, Validators.email]],
            password: ['', [ValueValidators.required]],
            phone: ['', [ValueValidators.required]],
            gender: ['1'],
            address: [''],
            image_url: [''],
            // Shop
            shop_name: ['', [ValueValidators.required]],
            logo_url: ['', [ValueValidators.required]],
            background_url: ['', [ValueValidators.required]],
            contact_email: ['', [ValueValidators.required]],
            contact_address: ['', [ValueValidators.required]],
            description: [''],
            accept: [false]
        });
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
}