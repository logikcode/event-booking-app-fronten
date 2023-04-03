export class QueryResults<T> {

    public limit!: number;
    public offset!: number;
    public total!: number;
    public results!: T[];
    public empty!: boolean;
    public sum?: number;
    public currencyCode?: number;
}
