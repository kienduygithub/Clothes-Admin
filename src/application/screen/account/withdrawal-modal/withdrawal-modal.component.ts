import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import {
    FormBuilder,
    FormGroup,
    FormsModule,
    ReactiveFormsModule,
    Validators,
} from '@angular/forms';
import {
    NbButtonModule,
    NbCheckboxModule,
    NbDialogModule,
    NbDialogRef,
    NbDialogService,
    NbIconModule,
    NbInputModule,
    NbOptionModule,
    NbSelectModule,
} from '@nebular/theme';
import { TranslateModule } from '@ngx-translate/core';
import { ShopManagement } from '../../../data/management/shop.management';
import { ShopService } from '../../../data/service/shop.service';
import { ImageResource } from '../../../common/resource/image_resource';
import { ValueValidators } from '../../../common/utils/validate/value.validate';
import { Withdrawal } from '../../../data/model/withdrawal/withdrawal.model';
import { ErrorModel } from '../../../common/model/error';
import { ToastNotification } from '../../common/toast/toast.component';
import { ErrorComponent } from '../../../common/layout/notify/error/error.component';

const NB_LIBS = [
    NbDialogModule,
    NbIconModule,
    NbButtonModule,
    NbInputModule,
    NbCheckboxModule,
    NbSelectModule,
    NbOptionModule,
];

const ANGULAR_MODULE = [
    TranslateModule,
    ReactiveFormsModule,
    CommonModule,
    FormsModule,
];

const PROVIDERS = [
    ShopManagement,
    ShopService
];

@Component({
    selector: 'app-withdrawal-modal',
    standalone: true,
    templateUrl: './withdrawal-modal.component.html',
    styleUrl: './withdrawal-modal.component.scss',
    imports: [...NB_LIBS, ...ANGULAR_MODULE],
    providers: [...PROVIDERS],
})
export class WithdrawalModalComponent implements OnInit {
    @Input() currBalance: number = 0;
    protected icon_close_black = ImageResource.icon_close_dialog;
    protected icon_hide_eye = ImageResource.icon_eye_off;
    protected icon_eye = ImageResource.icon_eye;
    protected FormData!: FormGroup;
    protected isFormSubmit = false;
    protected isPasswordVisibility = false;

    constructor(
        protected dialogRef: NbDialogRef<WithdrawalModalComponent>,
        private formBuilder: FormBuilder,
        private shopMana: ShopManagement,
        private dialogService: NbDialogService
    ) { }

    ngOnInit() {
        this.initForm();
    }

    initForm() {
        this.FormData = this.formBuilder.group({
            amount: this.formBuilder.control('', [ValueValidators.required, ValueValidators.isNumber]),
            password: this.formBuilder.control('', [ValueValidators.required])
        })
    }

    togglePasswordVisibility() {
        this.isPasswordVisibility = !this.isPasswordVisibility;
    }

    async submit() {
        this.isFormSubmit = true;
        if (this.FormData.invalid) {
            console.log('INVALID FORM');
            return;
        }
        try {
            const withdrawal = await this.shopMana.withdrawalByOwner(
                this.FormData.getRawValue().amount,
                this.FormData.getRawValue().password
            );

            this.close(withdrawal);
        } catch (error) {
            this.isFormSubmit = false;
            console.log(error);
            if (error instanceof ErrorModel) {
                const msg = error.message;
                if (msg === 'Không có quyền truy cập cửa hàng này') {
                    this.dialogService.open(ErrorComponent, {
                        context: {
                            title: 'Không hợp lệ',
                            content: 'Không có quyền truy cập.'
                        }
                    })
                } else if (msg === 'Số dư rút không đủ') {
                    this.dialogService.open(ErrorComponent, {
                        context: {
                            title: 'Không hợp lệ',
                            content: 'Số tiền rút không được lớn hơn số dư hiện tại'
                        }
                    })
                } else if (msg.includes('Sai mật khẩu')) {
                    this.dialogService.open(ErrorComponent, {
                        context: {
                            title: 'Không hợp lệ',
                            content: msg
                        }
                    })
                }
            }
        }
    }

    close(data?: Withdrawal) {
        this.dialogRef.close(data);
    }
}
