import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { HandleHttp } from '../utils/handle-http';
import { AppConfig } from '../config/app.config';

@Injectable({ providedIn: 'root' })
export class ServiceCore {
  optionsConfig: any;

  constructor(
    private appConfig: AppConfig,
    private handleHttp: HandleHttp,
    private http: HttpClient
  ) { }

  async GET(domain: string, url: string, options?: any): Promise<any> {
    try {
      let optionsConfig = {
        headers: new HttpHeaders({
          Authorization: this.appConfig.getAccessToken(),
        }),
      };
      const result = await this.http
        .get<any>(`${domain}/${url}`, options ?? optionsConfig)
        .pipe(
          map((response) => {
            return response;
          })
        )
        .toPromise();
      return this.handleHttp.success(result)
    } catch (error) {
      throw this.handleHttp.exception(error);
    }
  }

  async POST(domain: string, url: string, body: any | null, options?: any): Promise<any> {
    try {
      let optionsConfig = {
        headers: new HttpHeaders({
          Authorization: this.appConfig.getAccessToken(),
        }),
      };

      const result = await this.http
        .post<any>(`${domain}/${url}`, body, options ?? optionsConfig)
        .pipe(
          map((response) => {
            return response;
          })
        )
        .toPromise();
      return this.handleHttp.success(result)
    } catch (error) {
      throw this.handleHttp.exception(error);
    }
  }

  async PUT(domain: string, url: string, body?: any | null, options?: any): Promise<any> {
    try {
      let optionsConfig = {
        headers: new HttpHeaders({
          Authorization: this.appConfig.getAccessToken(),
        }),
      };

      const result = await this.http
        .put<any>(`${domain}/${url}`, body, options ?? optionsConfig)
        .pipe(
          map((response) => {
            return response;
          })
        )
        .toPromise();
      return this.handleHttp.success(result)
    } catch (error) {
      throw this.handleHttp.exception(error);
    }
  }

  async DETELE(domain: string, url: string, options?: any): Promise<any> {
    try {
      let optionsConfig = {
        headers: new HttpHeaders({
          Authorization: this.appConfig.getAccessToken(),
        }),
      };

      const result = await this.http
        .delete<any>(`${domain}/${url}`, options ?? optionsConfig)
        .pipe(
          map((response) => {
            return response;
          })
        )
        .toPromise();
      return this.handleHttp.success(result)
    } catch (error) {
      throw this.handleHttp.exception(error);
    }
  }

  async PATCH(domain: string, url: string, body?: any | null, options?: any) {
    try {
      let optionsConfig = {
        headers: new HttpHeaders({
          Authorization: this.appConfig.getAccessToken(),
        }),
      };

      const result = await this.http
        .patch<any>(`${domain}/${url}`, body, options ?? optionsConfig)
        .pipe(
          map((response) => {
            return response;
          })
        )
        .toPromise();
      return this.handleHttp.success(result)
    } catch (error) {
      throw this.handleHttp.exception(error);
    }
  }
}
