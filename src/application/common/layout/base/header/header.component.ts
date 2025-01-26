import { Component } from '@angular/core';
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
export class HeaderComponent {
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
  logo = ImageResource.logo;
  constructor(
    private appConfig: AppConfig,
    private router: Router,
    // private authManagement: AuthManagement
  ) { }

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
      // await this.authManagement.logout();
      // this.appConfig.clear();
      // this.router.navigate(['/auth/login']);
    } catch (error) {
      console.log(error);
    }
  }
}
