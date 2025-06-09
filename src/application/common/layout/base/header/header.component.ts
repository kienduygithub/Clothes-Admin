import { Component, ElementRef, HostListener, OnDestroy, OnInit } from '@angular/core';
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
import { NotificationManagement } from '../../../../data/management/notification.management';
import { NotificationService } from '../../../../data/service/notification.service';
import { ToastNotification } from '../../../../screen/common/toast/toast.component';
import { NotificationModel } from '../../../../data/model/notification/notification.model';
import { PagingModel } from '../../../model/paging.model';
import { NotificationActionType, NotificationReferenceType, NotificationType } from '../../../resource/notification.config';
import { CurrencyPipe } from '../../pipes/currency.pipe';
import { TimeAgoV2Pipe } from '../../pipes/time-ago-v2.pipe';
import { OrderURL } from '../../../../screen/order/order.routing';
import { NotificationStore } from '../../../../data/stores/notification.store';
import { WebSocketType } from '../../../resource/websocket-type';
import { RegisterShopURL } from '../../../../screen/register-shop/register-shop.routing';

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
    CurrencyPipe,
    TimeAgoV2Pipe
  ],
  providers: [
    AuthManagement,
    AuthService,
    NotificationManagement,
    NotificationService
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
  icon_bell_outline = ImageResource.icon_bell_outline;
  icon_check_all = ImageResource.icon_check_all;
  image_notification = ImageResource.image_notification;

  logout = ImageResource.log_out;
  logo = ImageResource.image_fashion_logo_big;

  $selectUser!: Observable<UserStoreModel>;
  userInfo!: UserStoreModel;
  private userSubscription!: Subscription;
  preImage = "";

  Tabs = {
    All: 'All',
    Unread: 'Unread'
  }

  TabSelect = this.Tabs.All;

  notifications: NotificationModel[] = [];
  unreadNotifications: NotificationModel[] = [];
  displayNotifications: NotificationModel[] = [];
  unreadCount: number = 0;
  paging!: PagingModel;
  unreadPaging!: PagingModel;
  NotificationType = NotificationType;
  NotificationActionType = NotificationActionType;
  NotificationReferenceType = NotificationReferenceType;
  private notificationSubscribe!: Subscription;
  isOpenNotification = false;

  constructor(
    private appConfig: AppConfig,
    private router: Router,
    private authManagement: AuthManagement,
    private wsService: WebSocketService,
    private notificationMana: NotificationManagement,
    private notificationStore: NotificationStore,
    private elementRef: ElementRef,
  ) { }

  async ngOnInit(): Promise<void> {
    this.preImage = this.appConfig.getPreImage() ?? "";
    this.$selectUser = this.authManagement.getSelectUser()
      .pipe(debounceTime(300));
    this.userSubscription = this.$selectUser.subscribe(
      (user: UserStoreModel) => this.userInfo = { ...user }
    )
    this.subscribeWebSocket();
    await this.fetchNotification();
  }

  private subscribeWebSocket() {
    if (this.notificationSubscribe) {
      this.notificationSubscribe.unsubscribe();
    }

    this.notificationSubscribe = this.wsService.getMessages().subscribe((data: any) => {
      switch (data.type) {
        case WebSocketType.NOTIFICATION: {
          let newNotification = new NotificationModel().convertObj(data.notification);
          this.notifications.unshift(newNotification);
          this.displayNotifications.unshift(newNotification);
          this.notificationStore.saveNotifications(this.notifications);
          this.notificationStore.saveUnreadCount(this.unreadCount + 1);
          this.unreadCount = this.unreadCount + 1;
          break;
        }
      }
    });
  }

  async fetchNotification() {
    if (this.notificationStore.fetchIsLoaded()) {
      console.log("Đã load thông báo");
      return;
    }

    try {
      const responseMap = await this.notificationMana.fetchNotificationByUser(1, 10);
      this.notifications = responseMap.get('notifications');
      this.displayNotifications = [...this.notifications];
      this.unreadCount = this.notificationStore.fetchUnreadCount();
      this.paging = responseMap.get('pagination');
    } catch (error) {
      console.log(error);
      ToastNotification.error("Hệ thống gặp sự cố, quay lại sau.");
    }
  }

  onChangeNotifyTab(tab: string) {
    if (tab === this.TabSelect) {
      return;
    }
    this.TabSelect = tab;
    if (this.TabSelect === this.Tabs.All) {
      this.displayNotifications = [...this.notifications];
    } else if (this.TabSelect === this.Tabs.Unread) {
      this.displayNotifications = this.notifications.filter(
        (notify) => notify.is_read === false
      )
    }
  }

  onToggleNotification() {
    this.isOpenNotification = !this.isOpenNotification;
  }

  async onRead(notification: NotificationModel) {
    this.isOpenNotification = false;
    if (notification.action === NotificationActionType.VIEW_ORDER && notification.reference_type === NotificationReferenceType.ORDER) {
      this.router.navigate([OrderURL.DETAIL_ORDER], { queryParams: { order_id: notification.data?.order_id, order_shop_id: notification.reference_id } })
    } else if (notification.action === NotificationActionType.VIEW_REGISTRATION && notification.reference_type === NotificationReferenceType.STORE_REGISTRATION) {
      this.router.navigate([RegisterShopURL.VIEW_REGISTER_SHOP_URL], { queryParams: { id: notification.reference_id } })
    }

    if (notification.is_read === false) {
      try {
        await this.notificationMana.markNotificationAsRead(notification.id);
        let notificationIndex = this.notifications.findIndex(n => n.id === notification.id);
        if (notificationIndex > -1) {
          this.notifications[notificationIndex].is_read = true;
          if (this.TabSelect === this.Tabs.Unread) {
            this.displayNotifications = this.displayNotifications.filter(n => n.id !== notification.id);
          }
        }
        this.unreadCount = this.notificationStore.fetchUnreadCount();
      } catch (error) {
        console.log(error);
        ToastNotification.error('Hệ thống gặp sự cố, quay lại sau.');
      }
    }
  }

  async onReadAll() {
    try {
      await this.notificationMana.markAllNotificationsAsRead();
      this.unreadCount = this.notificationStore.fetchUnreadCount();
      this.notifications = this.notificationStore.fetchListNotification();
      if (this.TabSelect === this.Tabs.Unread) {
        this.displayNotifications = [];
      } else {
        this.displayNotifications = this.notifications;
      }
    } catch (error) {
      console.log(error);
      ToastNotification.error("Hệ thống gặp sự cố, quay lại sau.");
    }
  }

  getAva() {
    return '';
  }

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

  async logOut() {
    try {
      this.appConfig.clear();
      this.wsService.disconnect();
      this.router.navigate([AuthUrl.SIGNIN]);
    } catch (error) {
      console.log(error);
    }
  }

  @HostListener('document:click', ['$event'])
  handleOutsideClick(event: MouseEvent) {
    if (this.isOpenNotification && !this.elementRef.nativeElement.contains(event.target)) {
      this.isOpenNotification = false;
    }
  }

  ngOnDestroy(): void {
    if (this.userSubscription) {
      this.userSubscription.unsubscribe();
    }

    if (this.notificationSubscribe) {
      this.notificationSubscribe.unsubscribe();
    }
  }
}
