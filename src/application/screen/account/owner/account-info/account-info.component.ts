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

const NB_LIBS = [
  NbTooltipModule,
  NbInputModule,
  NbButtonModule,
  NbSelectModule,
  NbDialogModule,
  NbIconModule
]

@Component({
  selector: 'app-owner-account-info',
  standalone: true,
  imports: [
    ...NB_LIBS,
    CommonModule,
    TranslateModule,
    ReactiveFormsModule,
    FormsModule,
  ],
  providers: [],
  templateUrl: './account-info.component.html',
  styleUrls: ['./account-info.component.scss'],
})
export class OwnerAccountInfoComponent implements OnInit {
  infoForm!: FormGroup;
  avatarBlob: any

  constructor(
    private fb: FormBuilder,
    private appConfig: AppConfig,
  ) { }

  async ngOnInit() {
    await this.initProfileInfoForm()
    await this.fetchData()
  }

  async fetchData() {
    try {

    } catch (error) {

    }
  }

  async initProfileInfoForm() {

  }

  async submitProfileInfo() {

  }

  changeAvatar(blob: any) {
    this.avatarBlob = blob
  }

  async uploadAvatar(avatarBlob: any) {
    try {

    } catch (error) {
      throw error
    }
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
