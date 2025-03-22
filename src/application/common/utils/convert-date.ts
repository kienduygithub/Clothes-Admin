import { format } from 'date-fns';
export class DateUtils {

    static formatDateToDDMMYYYY(timestamp: string): string {
        if (!timestamp) return '';
        return format(new Date(timestamp), 'dd/MM/yyyy');
    }

    static convertDDMMYYYYToISOEndOfDay(ddMMyyyy: string): string {
        const [day, month, year] = ddMMyyyy.split('/').map(Number);
        const date = new Date(Date.UTC(year, month - 1, day, 16, 59, 59, 999));
        return date.toISOString();
    }

    static convertDDMMYYYYToISOStartOfDay(ddMMyyyy: string): string {
        const [day, month, year] = ddMMyyyy.split('/').map(Number);
        const date = new Date(Date.UTC(year, month - 1, day - 1, 17, 0, 0, 0));
        return date.toISOString();
    }

    static compareDateIOSToToday(dateIOS: string) {
        const today = new Date().setHours(0, 0, 0, 0); // Lấy ngày hiện tại, bỏ giờ phút giây
        const inputDate = new Date(dateIOS).setHours(0, 0, 0, 0); // Chuyển đổi ngày từ chuỗi ISO
        return inputDate - today;
    }
}