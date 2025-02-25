import { APP_INITIALIZER, NgModule } from "@angular/core";
import { ApplicationComponent } from "./application.component";
import { ApplicationRouting } from "./application.routing";
import { AppConfig } from "./common/config/app.config";
import { HTTP_INTERCEPTORS, HttpClient, provideHttpClient, withInterceptors, withInterceptorsFromDi } from "@angular/common/http";
import { BrowserModule } from "@angular/platform-browser";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations"
import { NbDatepickerModule, NbDialogModule, NbMenuModule, NbSidebarModule, NbThemeModule, NbTimepickerModule, NbToastrModule } from "@nebular/theme";
import { NbEvaIconsModule } from "@nebular/eva-icons";
import { TranslateHttpLoader } from "@ngx-translate/http-loader";
import { TranslateLoader, TranslateModule } from "@ngx-translate/core";
import { AuthRouting } from "./screen/auth/auth.routing";
import { AuthService } from "./data/service/auth.service";
import { AuthInterceptor } from "./common/utils/auth.interceptor";

export function HttpLoaderFactory(http: HttpClient) {
    return new TranslateHttpLoader(http);
}

export function initializeApp(appConfig: AppConfig) {
    return async () => await appConfig.loadConfig();
}

const NB_LIB = [
    NbSidebarModule.forRoot(),
    NbThemeModule.forRoot({ name: 'default' }),
    NbDialogModule.forRoot(),
    NbToastrModule.forRoot({
        duration: 3000,
        limit: 5,
    }),
    NbMenuModule.forRoot(),
    NbDatepickerModule.forRoot(),
    NbTimepickerModule.forRoot(),
    NbEvaIconsModule
];

const ANGULAR_LIB = [
    BrowserModule,
    BrowserAnimationsModule,
    TranslateModule.forRoot({
        loader: {
            provide: TranslateLoader,
            useFactory: HttpLoaderFactory,
            deps: [HttpClient],
        },
    }),
];

@NgModule({
    declarations: [
        ApplicationComponent
    ],
    imports: [
        ...NB_LIB,
        ...ANGULAR_LIB,
        AuthRouting,
        ApplicationRouting,
    ],
    bootstrap: [ApplicationComponent],
    providers: [
        provideHttpClient(
            // withInterceptors([]),
            withInterceptorsFromDi()
        ),
        {
            provide: APP_INITIALIZER,
            useFactory: initializeApp,
            deps: [AppConfig],
            multi: true
        },
        AuthService,
        { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    ]
})

export class ApplicationModule { }