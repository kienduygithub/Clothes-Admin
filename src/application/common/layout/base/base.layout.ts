import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  HostListener,
  Input,
} from '@angular/core';
import {
  NbLayoutModule,
  NbMenuItem,
  NbMenuService,
  NbSidebarModule,
  NbSidebarService,
} from '@nebular/theme';
import { ImageResource } from '../../resource/image_resource';
import { HeaderComponent } from './header/header.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'base-layout',
  standalone: true,
  imports: [HeaderComponent, NbLayoutModule, NbSidebarModule, CommonModule],
  styleUrls: ['../styles/base_layout.scss'],
  template: `
    <nb-layout>
      <nb-layout-header fixed class="header-bar">
        <app-header></app-header>
      </nb-layout-header>

      <nb-sidebar
        #menu
        [state]="
          screenWidth > 1920
            ? compacted
              ? 'compacted'
              : 'expanded'
            : compacted
            ? 'compacted'
            : 'expanded'
        "
        id="menu-sidebar"
        class="menu-sidebar"
        tag="menu-sidebar"
        autoCollapse="true"
      >
        <ng-content select="nb-menu"></ng-content>
        <div class="row sidebar-toggle col-lg-12 p-3" (click)="toggleSidebar()">
          <img
            *ngIf="sidebar_state == 'expanded'"
            src="{{ compacted_menu }}"
            class="mr-2"
          />
          <img
            *ngIf="sidebar_state == 'compacted'"
            src="{{ expand_menu }}"
            class="mr-2"
          />
          <div *ngIf="!compacted" style="padding-top: 2px">
            <span class="collapse-text col-lg-10 m-0 pl-0">Thu gọn</span>
          </div>
        </div>
      </nb-sidebar>

      <nb-layout-column class="layout-column-content">
        <ng-content select="router-outlet"></ng-content>
      </nb-layout-column>
    </nb-layout>
  `,
  providers: [
    NbSidebarService,
    NbMenuService
  ]
})
export class BaseLayoutComponent implements AfterViewInit {
  @Input() menu: NbMenuItem[] = [];

  menuItem: NbMenuItem[] = this.menu;
  compacted: boolean = false;
  screenWidth: number = 0;
  expand_menu = ImageResource.expand;
  compacted_menu = ImageResource.compacted;
  sidebar_state: string = '';
  currentData: any;

  @HostListener('window:resize', ['$event'])
  getScreenWidth(_event?: any) {
    this.screenWidth = window.innerWidth;
  }

  constructor(
    private sidebarService: NbSidebarService,
    private menuService: NbMenuService,
    private cdr: ChangeDetectorRef
  ) {
    this.getScreenWidth();
  }

  ngAfterViewInit(): void {
    this.getSidebarState();
    if (this.screenWidth <= 1920) {
      let i = 0;
      this.menuService.onSubmenuToggle().subscribe((data: any) => {
        if (
          !document.querySelector('nb-sidebar[ng-reflect-state="expanded"]')
        ) {
          if (this.currentData != null) {
            this.currentData.item.expanded = false;
          }
          if (i > 0) {
            this.toggleSidebar();
            data.item.expanded = true;
          }
        } else {
          if (data.item.children.length == 0) {
            this.sidebarService.toggle(true, 'menu-sidebar');
          }
        }
        i++;
        this.currentData = data;
      });
      this.compacted = true;
      this.sidebar_state = 'compacted';
    }
    this.cdr.detectChanges();
  }

  toggleSidebar() {
    if (
      document
        .getElementById('menu-sidebar')
        ?.classList.value.includes('expanded')
    ) {
      this.compacted = true;
      this.sidebar_state = 'compacted';
    } else {
      this.compacted = false;
      this.sidebar_state = 'expanded';
    }
    this.sidebarService.toggle(true, 'menu-sidebar');
  }

  getSidebarState() {
    const menu_expanded: HTMLElement | null = document.querySelector(
      'nb-sidebar[ng-reflect-state="expanded"]'
    );
    const menu_compacted: HTMLElement | null = document.querySelector(
      'nb-sidebar[ng-reflect-state="compacted"]'
    );
    if (menu_expanded) {
      this.sidebar_state = 'expanded';
    }
    if (menu_compacted) {
      this.sidebar_state = 'compacted';
    }
  }
}
