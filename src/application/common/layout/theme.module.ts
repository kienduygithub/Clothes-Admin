import { CommonModule } from '@angular/common';
import { NgModule, ModuleWithProviders } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import {
  NbActionsModule,
  NbLayoutModule,
  NbMenuModule,
  NbSidebarModule,
  NbThemeModule,
} from '@nebular/theme';
import { FooterComponent } from './base/footer/footer.component';
import { DEFAULT_THEME } from './styles/theme.default';
import { MatMenuModule } from '@angular/material/menu';
import { AvatarComponent } from './base/avatar/avatar.component';
import { TranslateModule } from '@ngx-translate/core';

const COMMON_MODULES = [
  AvatarComponent,
  CommonModule,
  FormsModule,
  RouterModule,
  TranslateModule,
];

const NB_MODULES = [
  NbLayoutModule,
  NbMenuModule,
  NbSidebarModule,
  NbLayoutModule,
  NbActionsModule,
];

const MAT_MODULES = [MatMenuModule];

const COMPONENTS = [
  // BaseLayoutComponent,
  // HeaderComponent,
  // SidebarComponent,
  FooterComponent,
];

@NgModule({
  exports: [CommonModule, ...COMPONENTS],
  declarations: [...COMPONENTS],
  imports: [COMMON_MODULES, ...NB_MODULES, ...MAT_MODULES],
})
export class ThemeModule {
  static forRoot(): ModuleWithProviders<ThemeModule> {
    const nbTheme = NbThemeModule.forRoot(
      {
        name: 'default',
      },
      [DEFAULT_THEME]
    ).providers;
    return {
      ngModule: ThemeModule,
      providers: [...(nbTheme ? nbTheme : [])],
    };
  }
}
