import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import {
  NbActionsModule,
  NbMenuService,
  NbOptionModule,
  NbSelectModule,
  NbTooltipModule,
} from '@nebular/theme';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { AppConfig } from '../../../config/app.config';
import { ImageResource } from '../../../resource/image_resource';
import { MatMenuModule } from '@angular/material/menu';
import { AvatarComponent } from '../avatar/avatar.component';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { CommonModule } from '@angular/common';
import { Subject } from 'rxjs';
import { AuthUrl } from '../../../../screen/auth/auth.routing';
import { UserModel } from '../../../../data/model/user.model';
// import { AuthManagement } from '../../../../data/management/auth.management';
// import { EndDeviceService } from '../../../../data/service/end-device.service';
// import { EndDeviceManagement } from '../../../../data/management/end-device.management';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    AvatarComponent,
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    TranslateModule,
    NbActionsModule,
    NbOptionModule,
    NbSelectModule,
    NbTooltipModule,
    MatAutocompleteModule,
    MatMenuModule,
  ],
  providers: [
    // AuthManagement, 
    // EndDeviceManagement, 
    // EndDeviceService
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent implements OnInit {
  filteredSubjects: any;
  isInputVisible: boolean = false;
  routerBase = '';
  private searchInputSubject: Subject<string> = new Subject<string>();
  subjectCtrl = new FormControl('');
  userName: string = '';
  userId: string = '';

  avt_3 = ImageResource.avt_3;
  account_setting = ImageResource.account_setting;
  change_password = ImageResource.change_password;
  icon_search = ImageResource.icon_search;
  logout = ImageResource.log_out;
  logo = ImageResource.image_fashion_logo_big;

  userInfo!: UserModel;
  preImage = "";
  constructor(
    private appConfig: AppConfig,
    private router: Router,
    // private authManagement: AuthManagement
  ) { }

  async ngOnInit(): Promise<void> {
    this.preImage = this.appConfig.getPreImage() ?? "";

    const info = this.appConfig.getUserInfo();
    this.userInfo = new UserModel();
    this.userInfo.id = info?.id ?? 0;
    this.userInfo.name = info?.name ?? 'Anonymous';
    this.userInfo.image_url = info?.image_url ?? '';
    this.userInfo.roles = info?.roles ?? '';
  }

  getApp() { }

  getAva() {
    return '';
  }

  onChange() { }

  toChangePassword() { }

  toAccountManagement() { }

  toggleInput() {
    this.isInputVisible = !this.isInputVisible;
  }

  async logOut() {
    try {
      this.appConfig.clear();
      this.router.navigate([AuthUrl.SIGNIN]);
    } catch (error) {
      console.log(error);
    }
  }
}
