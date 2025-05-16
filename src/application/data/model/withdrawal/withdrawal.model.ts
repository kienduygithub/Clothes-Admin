export class Withdrawal {
    id: number;
    shop_id: number;
    amount: number;
    created_at: Date | null;

    constructor(
        id?: number,
        shop_id?: number,
        amount?: number,
        created_at?: Date | null,
    ) {
        this.id = id ?? 0;
        this.shop_id = shop_id ?? 0;
        this.amount = amount ?? 0;
        this.created_at = created_at ?? null;
    }

    convertObj(data: any) {
        const item = new Withdrawal();
        item.id = data?.id ?? 0;
        item.shop_id = data?.shop_id ?? 0;
        item.amount = data?.amount ?? 0;
        item.created_at = data?.createdAt ? new Date(data.createdAt) : null;
        return item;
    }
}