import { Pipe, PipeTransform } from "@angular/core";
import { OrderStatus } from "../../resource/status";

@Pipe({
    standalone: true,
    name: 'OrderStatusColor'
})

export class OrderStatusColorPipe implements PipeTransform {
    transform(value: string) {
        switch (value) {
            case OrderStatus.PENDING:
                return { text: 'Chờ xác nhận', color: '#F59E0B' };
            case OrderStatus.PROCESSING:
                return { text: 'Đang xử lý', color: '#3B82F6' };
            case OrderStatus.PAID:
                return { text: 'Đã thanh toán', color: '#34D399' };
            case OrderStatus.CANCELED:
                return { text: 'Đã hủy', color: '#9CA3AF' }
            case OrderStatus.SHIPPED:
                return { text: 'Đang giao', color: '#10B981' };
            case OrderStatus.COMPLETED:
                return { text: 'Hoàn thành', color: '#22C55E' };
            case OrderStatus.ALL:
                return { text: 'Tất cả', color: '#000' }
            default:
                return { text: 'Không xác định', color: '#6B7280' };
        }
    }
}