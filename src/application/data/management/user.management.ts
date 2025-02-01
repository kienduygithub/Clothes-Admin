import { Injectable } from "@angular/core";
import { UserService } from "../service/user.service";
import { UserModel } from "../model/user.model";

@Injectable()
export class UserManagement {

    constructor(
        private userService: UserService
    ) { }

    async fetchAllUser(type?: string) {
        try {
            const result = await this.userService.fetchAllUsers(type);
            const response = result?.body?.users.map((user: any) => new UserModel().convertObj(user));
            return response;
        } catch (error) {
            throw error;
        }
    }
}