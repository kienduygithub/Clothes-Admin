import { Component, OnInit } from "@angular/core";
import { ImageResource } from "../../../common/resource/image_resource";
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { AuthManagement } from "../../../data/management/auth.management";
import { AuthModel } from "../../../common/model/auth.model";
import { CommonModule } from "@angular/common";
import { Router } from "@angular/router";
import { NbAlertModule, NbDialogService, NbLayoutModule, NbRestoreScrollTopHelper, NbToastrService } from "@nebular/theme";
import { MatSnackBar, MatSnackBarModule } from "@angular/material/snack-bar";
import { ErrorModel } from "../../../common/model/error";
import { HttpCode } from "../../../common/resource/http-code";
import { WarningComponent } from "../../../common/layout/notify/warning/warnimg.component";
import { ShopURL } from "../../shop/shop.routing";
import { EmployeeUrl } from "../../employee/employee.routing";

@Component({
    standalone: true,
    selector: 'sign-in-component',
    templateUrl: './sign-in.component.html',
    styleUrl: './sign-in.component.scss',
    imports: [
        CommonModule,
        ReactiveFormsModule,
        NbLayoutModule,
        // MatSnackBarModule
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
        private dialogService: NbDialogService,
        // private snackBar: MatSnackBar
        private toastrService: NbToastrService
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
            await this.authManagement.signIn(auth);
            this.router.navigate([EmployeeUrl.EMPLOYEE_LIST]);
        } catch (error) {
            console.log(error);
            if (error instanceof ErrorModel) {
                if (error.code === HttpCode.BAD_REQUEST) {
                    return;
                }

                if (error.code === HttpCode.NOT_FOUND) {
                    if (error.message.includes('Tên đăng nhập hoặc mật khẩu không chính xác.')) {
                        this.toastrService.danger(
                            'Tên đăng nhập hoặc mật khẩu không chính xác.',
                            'Không hợp lệ',
                        );
                    }
                    return;
                }
            }
        }
    }

    onToggleVisiblePassword() {
        this.isVisiblePassword = !this.isVisiblePassword;
    }
}