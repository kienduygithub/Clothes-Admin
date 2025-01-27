import { Injectable } from '@angular/core';
import { ErrorModel } from '../model/error';
import { AppConfig } from '../config/app.config';
import { Router } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class HandleHttp {
  constructor(private appConfig: AppConfig, private router: Router) { }

  success(result: any) {
    return result;
  }

  exception(result: any) {
    if (result?.status === 401) {
      this.appConfig.clear();
      this.router.navigate(['/auth/login']);
    }
    let error = new ErrorModel(result?.status, result?.error?.msg)
    console.log(error)
    return error
  }
}
