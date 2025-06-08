import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
    standalone: true,
    name: 'TimeAgoV2Pipe'
})

export class TimeAgoV2Pipe implements PipeTransform {
    transform(date: Date) {
        const now = new Date();
        const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));

        if (diffInMinutes < 1) return 'Vừa xong';
        if (diffInMinutes < 60) return `${diffInMinutes} phút trước`;

        const diffInHours = Math.floor(diffInMinutes / 60);
        if (diffInHours < 24) return `${diffInHours} giờ trước`;

        const diffInDays = Math.floor(diffInHours / 24);
        if (diffInDays < 30) return `${diffInDays} ngày trước`;

        const diffInMonths = Math.floor(diffInDays / 30);
        if (diffInMonths < 12) return `${diffInMonths} tháng trước`;

        return `${Math.floor(diffInMonths / 12)} năm trước`;
    }
}