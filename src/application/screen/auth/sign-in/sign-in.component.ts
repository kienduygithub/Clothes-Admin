import { Component, OnInit } from "@angular/core";
import { ImageResource } from "../../../common/resource/image_resource";
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { AuthManagement } from "../../../data/management/auth.management";
import { AuthModel } from "../../../common/model/auth.model";
import { CommonModule } from "@angular/common";
import { Router } from "@angular/router";
import { NbLayoutModule, } from "@nebular/theme";
import { ErrorModel } from "../../../common/model/error";
import { AuthUrl } from "../auth.routing";
import { Roles } from "../../../common/resource/roles";
import { OverviewUrl } from "../../overview/overview.routing";
import { ToastNotification } from "../../common/toast/toast.component";

@Component({
    standalone: true,
    selector: 'sign-in-component',
    templateUrl: './sign-in.component.html',
    styleUrl: './sign-in.component.scss',
    imports: [
        CommonModule,
        ReactiveFormsModule,
        NbLayoutModule,
    ],
    providers: [
        AuthManagement
    ]
})

export class SignInComponent implements OnInit {
    image_sign_in: string = ImageResource.image_sign_in;
    icon_email: string = ImageResource.icon_email;
    icon_lock: string = ImageResource.icon_lock;
    icon_visible_eye = ImageResource.icon_visible_auth;
    icon_invisible_eye = ImageResource.icon_invisible_auth;

    isVisiblePassword = false;

    authForm!: FormGroup;

    constructor(
        private router: Router,
        private fb: FormBuilder,
        private authManagement: AuthManagement,
    ) { }

    ngOnInit(): void {
        this.initForm();
    }

    initForm() {
        this.authForm = this.fb.group({
            email: ['', [Validators.email]],
            password: ['']
        });
    }

    async onSignIn() {
        console.log(this.authForm.value);
        if (this.authForm.invalid) {
            console.log('INVALID FORM');
            return;
        }

        try {
            const email = this.authForm.getRawValue().email;
            const password = this.authForm.getRawValue().password;
            const auth = new AuthModel(email, password);
            const response = await this.authManagement.signIn(auth);
            const info = response?.body?.info;
            if (info?.roles === Roles.ADMIN) {
                this.router.navigate([OverviewUrl.ADMIN_OVERVIEW]);
                ToastNotification.success('Đăng nhập thành công.')
            } else if (info?.roles === Roles.OWNER) {
                this.router.navigate([OverviewUrl.OWNER_OVERVIEW]);
                ToastNotification.success('Đăng nhập thành công.')
            }
        } catch (error) {
            console.log(error);
            if (error instanceof ErrorModel) {
                ToastNotification.error(error.message);
                return;
            }

            ToastNotification.error('Hệ thống gặp sự cố, quay lại sau.')
        }
    }

    onToggleVisiblePassword() {
        this.isVisiblePassword = !this.isVisiblePassword;
    }

    onSignUp() {
        this.router.navigate([AuthUrl.SIGNUP]);
    }
}