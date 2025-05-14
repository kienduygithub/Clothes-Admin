import { FormGroup } from "@angular/forms";
import { UserModel } from "../../data/model/user/user.model";

export class AuthModel {
    email: string;
    password: string;

    constructor(
        email: string,
        password: string
    ) {
        this.email = email;
        this.password = password;
    }

    convertFormToModel(form: FormGroup) {
        const userModel = new UserModel();
        userModel.name = form.getRawValue().name ?? '';
        userModel.phone = form.getRawValue().phone ?? '';
        userModel.gender = +form.getRawValue().gender;

        return userModel;
    }
}