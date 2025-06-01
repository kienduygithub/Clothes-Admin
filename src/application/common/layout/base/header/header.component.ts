import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import {
  NbActionsModule,
  NbOptionModule,
  NbSelectModule,
  NbTooltipModule,
} from '@nebular/theme';
import { AppConfig } from '../../../config/app.config';
import { ImageResource } from '../../../resource/image_resource';
import { MatMenuModule } from '@angular/material/menu';
import { AvatarComponent } from '../avatar/avatar.component';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { CommonModule } from '@angular/common';
import { debounceTime, Observable, Subject, Subscription } from 'rxjs';
import { AuthUrl } from '../../../../screen/auth/auth.routing';
import { AuthService } from '../../../../data/service/auth.service';
import { AuthManagement } from '../../../../data/management/auth.management';
import { UserStoreModel } from '../../../../data/model/user/user.store.model';
import { WebSocketService } from '../../../service/websocket.service';
import { Roles } from '../../../resource/roles';
import { AccountUrl } from '../../../../screen/account/account.routing';
import { OverviewUrl } from '../../../../screen/overview/overview.routing';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    AvatarComponent,
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    NbActionsModule,
    NbOptionModule,
    NbSelectModule,
    NbTooltipModule,
    MatAutocompleteModule,
    MatMenuModule,
  ],
  providers: [
    AuthManagement,
    AuthService
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent implements OnInit, OnDestroy {
  filteredSubjects: any;
  isInputVisible: boolean = false;
  routerBase = '';
  private searchInputSubject: Subject<string> = new Subject<string>();
  subjectCtrl = new FormControl('');

  avt_3 = ImageResource.avt_3;
  account_setting = ImageResource.account_setting;
  change_password = ImageResource.change_password;
  icon_search = ImageResource.icon_search;
  logout = ImageResource.log_out;
  logo = ImageResource.image_fashion_logo_big;

  $selectUser!: Observable<UserStoreModel>;
  userInfo!: UserStoreModel;
  private userSubscription!: Subscription;
  preImage = "";
  constructor(
    private appConfig: AppConfig,
    private router: Router,
    private authManagement: AuthManagement,
    private wsService: WebSocketService
  ) { }

  async ngOnInit(): Promise<void> {
    this.preImage = this.appConfig.getPreImage() ?? "";
    this.$selectUser = this.authManagement.getSelectUser()
      .pipe(debounceTime(300));
    this.userSubscription = this.$selectUser.subscribe(
      (user: UserStoreModel) => this.userInfo = { ...user }
    )
  }

  getApp() { }

  getAva() {
    return '';
  }

  onChange() { }

  toChangePassword() {
    if (this.router.url.includes('owner')) {
      this.router.navigate([AccountUrl.OWNER_ACCOUNT_CHANGE_PASSWORD]);
    } else if (this.router.url.includes('admin')) {
      this.router.navigate([AccountUrl.ADMIN_ACCOUNT_CHANGE_PASSWORD]);
    }
  }

  toAccountManagement() {
    if (this.router.url.includes('owner')) {
      this.router.navigate([AccountUrl.OWNER_ACCOUNT_INFO]);
    } else if (this.router.url.includes('admin')) {
      this.router.navigate([AccountUrl.ADMIN_ACCOUNT_INFO]);
    }
  }

  toOverview() {
    if (this.userInfo.roles === Roles.OWNER) {
      this.router.navigate([OverviewUrl.OWNER_OVERVIEW]);
    } else if (this.userInfo.roles === Roles.ADMIN) {
      this.router.navigate([OverviewUrl.ADMIN_OVERVIEW]);
    }
  }

  toggleInput() {
    this.isInputVisible = !this.isInputVisible;
  }

  async logOut() {
    try {
      this.appConfig.clear();
      this.wsService.disconnect();
      this.router.navigate([AuthUrl.SIGNIN]);
    } catch (error) {
      console.log(error);
    }
  }

  ngOnDestroy(): void {
    if (this.userSubscription) {
      this.userSubscription.unsubscribe();
    }
  }
}
