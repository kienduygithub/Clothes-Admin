import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Result } from '../../../common/resource/result';

@Component({
    standalone: true,
    selector: 'app-toast-notification',
    imports: [CommonModule],
    templateUrl: './toast.component.html',
    styleUrl: './toast.component.scss'
})
export class ToastNotification {
    static toasts: { message: string; type: string }[] = [];

    get toasts() {
        return ToastNotification.toasts;
    }

    static success(message: string) {
        const toast = { message: message, type: Result.SUCCESS };
        ToastNotification.toasts.push(toast);
        setTimeout(() => ToastNotification.removeToast(toast), 3000);
    }

    static error(message: string) {
        const toast = { message: message, type: Result.ERROR };
        ToastNotification.toasts.push(toast);
        setTimeout(() => ToastNotification.removeToast(toast), 3000);
    }

    static warning(message: string) {
        const toast = { message: message, type: Result.WARNING };
        ToastNotification.toasts.push(toast);
        setTimeout(() => ToastNotification.removeToast(toast), 3000);
    }


    static removeToast(toast: { message: string; type: string }) {
        ToastNotification.toasts = ToastNotification.toasts.filter(t => t !== toast);
    }

    removeToast(toast: { message: string; type: string }) {
        ToastNotification.removeToast(toast);
    }
}
