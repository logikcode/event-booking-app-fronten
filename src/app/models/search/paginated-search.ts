import * as moment from 'moment';
import { filter } from 'rxjs/operators';

export class PaginatedSearch<E> {

    private filter: E;
    private size: number;
    private page = 0;
    // private limit = 10;
    // private offset = 0;

    constructor(filter: E, size: number, page = 0) {
        this.filter = filter;
        this.size = size;
        this.page = page;
        // this.limit = size;
        // this.offset = page;
    }

    private static removeNullFields(filter) {
        Object.keys(filter).forEach(fieldName => {
            if (!filter[fieldName]) {
                delete filter[fieldName];
            }
        });
        return filter;
    }

    public static createSimplePager(size: number, page = 0) {
        return new PaginatedSearch({}, size, page);
    }

    public static createCleanFilter<E>(filter: E, size: number, page = 0) {
        return new PaginatedSearch<E>(PaginatedSearch.removeNullFields(filter), size, page);
    }

    public getSearchParams(): any {
        return Object.assign({}, this.filter, { page: this.page, size: this.size });
    }

    public getBackendParams(): any {
      const obj = Object.assign({}, this.filter, { offset: this.page, limit: this.size });
      delete obj['page'];
      delete obj['size'];
      return obj;
    }
}
