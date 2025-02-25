import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { AuthService } from "../../data/service/auth.service";
import { catchError, from, Observable, of, switchMap, throwError } from "rxjs";
import { AppConfig } from "../config/app.config";
import { HandleHttp } from "./handle-http";
import { HttpCode } from "../resource/http-code";
import { Router } from "@angular/router";
import { AuthUrl } from "../../screen/auth/auth.routing";

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

    constructor(
        private authServie: AuthService,
        private handleHttp: HandleHttp,
        private appConfig: AppConfig,
        private router: Router
    ) { }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        const accessToken = this.appConfig.getAccessToken();
        let request = req.clone({
            setHeaders: {
                Authorization: `Bearer ${accessToken}`
            }
        });

        return next.handle(request).pipe(
            catchError((error: HttpErrorResponse) => {
                if (error.status === HttpCode.UNAUTHORIZED && !req.url.includes('/auth/refresh')) {
                    return from(this.authServie.getNewAccessToken()).pipe(
                        switchMap((response: any) => {
                            const accessToken = response.access_token;
                            this.appConfig.setAccessToken(accessToken);
                            let request = req.clone({
                                setHeaders: {
                                    Authorization: `Bearer ${accessToken}`
                                }
                            });
                            return next.handle(request);
                        }),
                        catchError((error: any) => {
                            console.log(error);
                            if (error?.status && error.status === HttpCode.UNAUTHORIZED) {
                                this.appConfig.clear();
                                this.router.navigate([AuthUrl.SIGNIN]);
                                return throwError(() => error);
                            }
                            return throwError(() => error);
                        })
                    )
                }

                return throwError(() => error);
            })
        )
    }
}