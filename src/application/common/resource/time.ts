export const adjustToUTCWithOffset = (date: Date): Date => {
    const offsetDate = new Date(date);
    // Điều chỉnh múi giờ để khi chuyển sang UTC, nó vẫn đúng với +07:00
    offsetDate.setMinutes(offsetDate.getMinutes() - offsetDate.getTimezoneOffset());
    return offsetDate;
};