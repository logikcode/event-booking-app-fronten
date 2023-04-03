export class PaginatedResponse<T> {

    public totalRecords!: number;
    public data!: T[];
    public meta!: any;
    public recordsTotal!: number;
    public message!: string;
}
