export class PagingModel {
    itemsPerPage: number;
    currentPage: number;
    totalItems: number;
    totalPage: number;
    before: number;
    after: number;

    constructor(
        itemsPerPage?: number,
        currentPage?: number,
        totalItems?: number,
        totalPage?: number,
        before?: number,
        after?: number,
    ) {
        this.itemsPerPage = itemsPerPage ?? 3;
        this.currentPage = currentPage ?? 1;
        this.totalItems = totalItems ?? 0;
        this.totalPage = totalPage ?? 1;
        this.before = before ?? 0;
        this.after = after ?? 0;
    }
}