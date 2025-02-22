import { Component } from "@angular/core";
import { ImageResource } from "../../../common/resource/image_resource";

@Component({
    standalone: false,
    selector: 'sign-in-component',
    templateUrl: './sign-in.component.html',
    styleUrl: './sign-in.component.scss',
    providers: []
})

export class SignInComponent {
    image_sign_in: string = ImageResource.image_sign_in;
    icon_email: string = ImageResource.icon_email;
    icon_lock: string = ImageResource.icon_lock;
    icon_visible_eye = ImageResource.icon_visible_auth;
    icon_invisible_eye = ImageResource.icon_invisible_auth;

    isVisiblePassword = false;

    constructor() { }

    onToggleVisiblePassword() {
        this.isVisiblePassword = !this.isVisiblePassword;
    }
}