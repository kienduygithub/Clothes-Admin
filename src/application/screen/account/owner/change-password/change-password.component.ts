import { Component, OnInit } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { NbButtonModule, NbDialogModule, NbIconModule, NbInputModule, NbRadioModule, NbSelectModule, NbTooltipModule } from '@nebular/theme';
import { TranslateModule } from '@ngx-translate/core';
import { Router } from '@angular/router';
import { ImageResource } from '../../../../common/resource/image_resource';
import { ValueValidators } from '../../../../common/utils/validate/value.validate';
import { AuthManagement } from '../../../../data/management/auth.management';
import { AuthService } from '../../../../data/service/auth.service';
import { ErrorModel } from '../../../../common/model/error';

const NB_LIBS = [
  NbTooltipModule,
  NbInputModule,
  NbButtonModule,
  NbSelectModule,
  NbDialogModule,
  NbIconModule,
  NbRadioModule
]

const PROVIDERS = [
  AuthManagement,
  AuthService
]

@Component({
  standalone: true,
  selector: 'app-account-info',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss'],
  imports: [
    ...NB_LIBS,
    CommonModule,
    TranslateModule,
    ReactiveFormsModule,
    FormsModule
  ],
  providers: [...PROVIDERS],
})
export class OwnerChangePassswordComponent implements OnInit {
  icon_eye: string = ImageResource.icon_eye;
  icon_eye_off: string = ImageResource.icon_eye_off;

  form!: FormGroup;
  isSubmit = false;
  isCurrentPasswordVisible: boolean = false;
  isNewPasswordVisible = false;
  isConfirmPasswordVisible = false;

  constructor(
    private router: Router,
    private location: Location,
    private fb: FormBuilder,
    private authMana: AuthManagement
  ) { }

  ngOnInit(): void {
    this.form = this.fb.group({
      currentPassword: this.fb.control('', [ValueValidators.required, this.validatePassword]),
      newPassword: this.fb.control('', [ValueValidators.required, this.validatePassword]),
      confirmPassword: this.fb.control('', [ValueValidators.required, this.validatePassword])
    }, {
      validators: [this.matchPasswords('newPassword', 'confirmPassword')]
    });
  }

  toggleNewPasswordVisibility() {
    this.isNewPasswordVisible = !this.isNewPasswordVisible;
  }

  toggleConfirmPasswordVisibility() {
    this.isConfirmPasswordVisible = !this.isConfirmPasswordVisible;
  }

  toggleCurrentPasswordVisibility() {
    this.isCurrentPasswordVisible = !this.isCurrentPasswordVisible;
  }

  async onSave() {
    console.log(this.form.value);
    if (this.form.invalid) {
      console.log('INVALID FORM');
      return;
    }

    try {
      const payload = {
        currentPassword: this.form.getRawValue().currentPassword,
        newPassword: this.form.getRawValue().newPassword,
      }
      await this.authMana.changePassword(payload);
      console.log('Đổi mật khẩu thành công');
    } catch (error) {
      console.log(error);
      if (error instanceof ErrorModel) {
        if (error.message === 'Mật khẩu không đúng') {
          this.form.get('currentPassword')?.setErrors({
            equalPassword: true
          })
        }
      }
    }
  }

  toPreviousPage() {
    this.location.back();
  }

  private validatePassword(control: AbstractControl): ValidationErrors | null {
    let value = control.value;
    if (value.trim() === '' || value === undefined || value === null) {
      return null;
    }

    let regex = /^.{6,}$/;
    let isValid = regex.test(value);

    return isValid ? null : {
      invalidPassword: true
    };
  }

  private matchPasswords(controlName: string, matchingControlName: string): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const password = control.get(controlName)?.value;
      const confirmPassword = control.get(matchingControlName)?.value;

      if (!password || !confirmPassword) {
        return null;
      }

      if (control.get(controlName)?.invalid || control.get(matchingControlName)?.invalid) {
        return null;
      }

      return password === confirmPassword ? null : { matchPassword: true };
    };
  }
}
