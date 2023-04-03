export class SearchResults<T> {

    public limit!: number;
    public totalPages!: number;
    public count!: number;
    public data!: T[];
    public page!: number;
}
