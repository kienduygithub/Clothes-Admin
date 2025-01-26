import {
  ChangeDetectorRef,
  Component,
  HostListener,
  Input,
} from '@angular/core';
import { NbMenuItem, NbMenuService, NbSidebarService } from '@nebular/theme';
import { ImageResource } from '../../../resource/image_resource';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss',
})
export class SidebarComponent {
  @Input() menu: any = [];

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
