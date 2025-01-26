import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";

@Injectable({
    providedIn: 'root'
})

export class AppConfig {
    private domain?: string;

    constructor(
        private router: Router,
        private http: HttpClient
    ) { }

    async loadConfig() {
        try {
            const config = await this.http.get<any>("assets/config.json").toPromise();
            this.setDomain(config?.apis);
            console.log(this.domain);
        } catch (error) {
            console.error('Error loading config: ', error);
        }
    }

    getDomain() {
        return this.domain;
    }

    setDomain(domain: string) {
        this.domain = domain;
    }

    getAccessToken() {
        const accessToken = localStorage.getItem('access-token');
        if (accessToken) {
            return JSON.parse(accessToken);
        }
        return "";
    }

    setAccessToken(token: string) {
        localStorage.setItem('access-token', token);
    }

    getRefreshToken() {
        const refreshToken = localStorage.getItem('refresh-token');
        if (refreshToken) {
            return JSON.parse(refreshToken);
        }
        return "";
    }

    setRefreshToken(token: string) {
        localStorage.setItem('refresh-token', token);
    }
}