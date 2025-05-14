import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { NbButtonModule, NbDialogModule, NbIconModule, NbInputModule, NbSelectModule, NbTooltipModule } from '@nebular/theme';
import { TranslateModule } from '@ngx-translate/core';
import { AppConfig } from '../../../../common/config/app.config';
import { ImageResource } from '../../../../common/resource/image_resource';
import { ValueValidators } from '../../../../common/utils/validate/value.validate';
import { UserModel } from '../../../../data/model/user/user.model';
import { AuthManagement } from '../../../../data/management/auth.management';
import { AuthService } from '../../../../data/service/auth.service';
import { ToastNotification } from '../../../common/toast/toast.component';
import { AuthModel } from '../../../../common/model/auth.model';
import { Router } from '@angular/router';
import { AccountUrl } from '../../account.routing';

const NB_LIBS = [
  NbTooltipModule,
  NbInputModule,
  NbButtonModule,
  NbSelectModule,
  NbDialogModule,
  NbIconModule
]

const ANGULAR_MODULE = [
  CommonModule,
  TranslateModule,
  ReactiveFormsModule,
  FormsModule,
]

const PROVIDERS = [
  AuthManagement,
  AuthService
]

@Component({
  standalone: true,
  selector: 'app-admin-account-info',
  templateUrl: './account-info.component.html',
  styleUrls: ['./account-info.component.scss'],
  imports: [...NB_LIBS, ...ANGULAR_MODULE],
  providers: [...PROVIDERS],
})
export class AdminAccountInfoComponent implements OnInit {
  icon_camera_upload: string = ImageResource.icon_camera_upload;
  image_upload_person: string = ImageResource.image_upload_person;
  preImage: string = '';

  isSubmit = false;
  userInfo!: UserModel;
  infoForm!: FormGroup;
  uploadImageFile: File | undefined;
  isChanged = false;
  originalForm: any;

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private appConfig: AppConfig,
    private authMana: AuthManagement
  ) { }

  async ngOnInit() {
    this.preImage = this.appConfig.getPreImage() ?? '';

    await this.fetchData();
    this.initProfileInfoForm();
  }

  async fetchData() {
    try {
      this.userInfo = await this.authMana.fetchAccountDetails();
      console.log(this.userInfo);
    } catch (error) {
      console.log(error);
    }
  }

  initProfileInfoForm() {
    this.infoForm = this.fb.group({
      id: this.fb.control(this.userInfo?.id ?? ''),
      name: this.fb.control(this.userInfo?.name ?? '', [ValueValidators.required]),
      gender: this.fb.control(this.userInfo?.gender?.toString() ?? 1),
      email: this.fb.control({ value: this.userInfo?.email ?? '', disabled: true }),
      phone: this.fb.control(this.userInfo?.phone ?? '', [ValueValidators.required, ValueValidators.isNumber]),
      image_url: this.fb.control(this.userInfo?.image_url ?? '')
    })

    this.originalForm = this.infoForm.value;
    this.infoForm.valueChanges.subscribe((response) => {
      this.isChanged = JSON.stringify(this.originalForm) !== JSON.stringify(response);
    })
  }

  onChangeImageFile(files: any) {
    if (files && files[0]) {
      this.uploadImageFile = files[0];
      this.infoForm.get('image_url')?.patchValue(
        URL.createObjectURL(files[0]),
      );
    }
  }

  async submitProfileInfo() {
    this.isSubmit = true;
    console.log(this.infoForm.value);
    if (this.infoForm.invalid) {
      console.log('INVALID FORM');
      return;
    }

    try {
      const model = new AuthModel('', '').convertFormToModel(this.infoForm);
      const image_url = await this.authMana.editAccountDetails(model, this.uploadImageFile);
      this.userInfo.name = model.name;
      this.userInfo.phone = model.phone;
      this.userInfo.gender = model.gender;
      this.userInfo.image_url = image_url;
      this.uploadImageFile = undefined;
      this.initProfileInfoForm();
      this.isChanged = false;
      ToastNotification.success('Lưu thông tin thành công');
    } catch (error) {
      console.log(error);
      ToastNotification.error('Lưu thông tin thất bại');
    }
  }

  navigateChangePassword() {
    this.router.navigateByUrl(AccountUrl.ADMIN_ACCOUNT_CHANGE_PASSWORD)
  }

  async reduceSizeImage(file: any) {
    let quality = 1;
    if (file.size <= 80 * 1024) {
      return file;
    } else {
      const reader = new FileReader();
      return new Promise((resolve) => {
        reader.onload = async (event) => {
          const img = new Image();
          img.onload = async () => {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');

            if (img.width > 1000) {
              var newWidth = 1000;
              var aspectRatio = newWidth / img.width;
              var newHeight = img.height * aspectRatio;

              canvas.width = newWidth;
              canvas.height = newHeight;
              ctx?.drawImage(img, 0, 0, newWidth, newHeight);
            } else {
              canvas.width = img.width;
              canvas.height = img.height;
              ctx?.drawImage(img, 0, 0, canvas.width, canvas.height);
            }
            const compress = (quality: number) => {
              return new Promise((resolve) => {
                canvas.toBlob(
                  (blob: any) => {
                    if (blob.size <= 80 * 1024) {
                      resolve(
                        new File([blob], file.name, {
                          type: 'image/jpeg',
                          lastModified: Date.now(),
                        })
                      );
                    } else {
                      resolve(compress(quality - 0.1));
                    }
                  },
                  'image/jpeg',
                  quality
                );
              });
            };
            resolve(compress(quality));
          };
          img.src = event?.target?.result as string;
        };
        reader.readAsDataURL(file);
      });
    }
  }
}
