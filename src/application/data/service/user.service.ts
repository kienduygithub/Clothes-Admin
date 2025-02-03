import { Injectable } from "@angular/core";
import { ServiceCore } from "../../common/service/service-core";
import { AppConfig } from "../../common/config/app.config";
import { UserModel } from "../model/user.model";

@Injectable()
export class UserService {

    constructor(
        private serviceCore: ServiceCore,
        private appConfig: AppConfig
    ) { }

    async createUser(data: UserModel, file: any): Promise<any> {
        try {
            const domain = this.appConfig.getDomain();

            const info = new UserModel().convertModelToAdd(data);
            const formData = new FormData();
            formData.append('info', JSON.stringify(info));
            formData.append('adminOwnerFile', file);

            const response = await this.serviceCore.POST(
                `${domain}`,
                `user/admin/create`,
                formData
            );
            return response;
        } catch (error) {
            throw error;
        }
    }

    async updateUserById(data: UserModel, file: any): Promise<any> {
        try {
            const domain = this.appConfig.getDomain();

            const info = new UserModel().convertModelToUpdate(data);
            const formData = new FormData();
            formData.append('info', JSON.stringify(info));
            formData.append('adminOwnerFile', file);

            const response = await this.serviceCore.PATCH(
                `${domain}`,
                `user/admin/${data.id}`,
                formData
            );
            return response;
        } catch (error) {
            throw error;
        }
    }

    async fetchAllUsers(type?: string): Promise<any> {
        try {
            const domain = this.appConfig.getDomain();
            const response = await this.serviceCore.GET(
                `${domain}`,
                `user/all`
            );
            return response;
        } catch (error) {
            throw error;
        }
    }

    async fetchUserById(userId: number): Promise<any> {
        try {
            const domain = this.appConfig.getDomain();
            const response = await this.serviceCore.GET(
                `${domain}`,
                `user/${userId}`
            );
            return response;
        } catch (error) {
            throw error;
        }
    }

    async deleteUserById(userId: number): Promise<any> {
        try {
            const domain = this.appConfig.getDomain();
            const response = await this.serviceCore.DETELE(
                `${domain}`,
                `user/admin/${userId}`
            );
            return response;
        } catch (error) {
            throw error;
        }
    }
}