import { Observable } from 'rxjs';
import { QueryResults } from './query-results';

export interface PaginatedSearchHandler<E, F> {
    search(page: number, filter?: F): Observable<any>;
}
