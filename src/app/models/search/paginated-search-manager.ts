import {QueryResults} from './query-results';
import {PaginatedSearchHandler} from './paginated-search-handler';
import {SearchFilterSource} from './search-filter-source';
import {query} from '@angular/animations';
import { SessionStoreService } from 'src/app/modules/authentication/session-store.service';


export class PaginatedSearchManager<E, S> {

  _working: boolean;
  public filter: S;
  private _itemsPerPage = 10;

  private _queryResult: QueryResults<E>;

  private searchHandler: PaginatedSearchHandler<E, S>;
  public filterSource: SearchFilterSource<S>;

  private _page: number;

  private _sessionStoreService: SessionStoreService;

  constructor(searchHandler: PaginatedSearchHandler<E, S>, filterSource?: SearchFilterSource<S>) {
    this.searchHandler = searchHandler;
    this.filterSource = filterSource;
  }

  private set queryResult(queryResult: QueryResults<E>) {
    this._queryResult = queryResult;
    this._page = (this.offset / this.itemsPerPage) + 1;
  }

  getQueryResult() {
    return this._queryResult;
  }

  get working() {
    return this._working;
  }

  get offset() {
    if (!this._queryResult) {
      return 0;
    }
    return this._queryResult.offset;
  }

  get list() {
    return this._queryResult ? this._queryResult.results : [];
  }

  get totalCount() {
    if (!this._queryResult) {
      return 0;
    }
    return this._queryResult.total;
  }

  get itemsPerPage() {
    return this._itemsPerPage;
  }

  set itemsPerPage(val: number) {
    this._itemsPerPage = val;
    // this.reloadAndShowFirstPage();
  }

  get page(): number {
    return this._page;
  }

  set page(page: number) {
    this._page = page;
    this.goToPage(page);
  }

  public reloadAndShowFirstPage() {
    localStorage.removeItem('registerSearchList');
    try {
      const f: S = this.filterSource && this.filterSource.getFilter();
      if (typeof f === 'string' || typeof f === 'number') {
        this.filter = f;
      } else if (f) {
        this.filter = Object.assign({}, f);
      }
      this.page = 1;
    } catch (error) {
      console.error(error);
    }
  }

  set sessionStoreService(sessionStoreService: SessionStoreService) {
    this._sessionStoreService = sessionStoreService;
    if (sessionStoreService) {
      sessionStoreService.getData('searchFilter', location.href).subscribe(filter => {
        if (!filter) {
          return;
        }
        this.filter = filter;
        if (this.filterSource && this.filterSource['setFilter']) {
          this.filterSource['setFilter'](this.filter);
        }
      });
    }
  }

  public reloadPage(page: number) {
    try {
      const f: S = this.filterSource && this.filterSource.getFilter();
      if (typeof f === 'string' || typeof f === 'number') {
        this.filter = f;
      } else if (f) {
        this.filter = Object.assign({}, f);
      }
      this.page = page;
    } catch (error) {
      console.error(error);
    }
  }

  private goToPage(page: number) {
    this._working = true;
    try {
      const filter: S = this.filterSource && this.filterSource.getFilter();
      this.filter = filter;
      //   isNullOrUndefined(filter['size']) ? 10 : filter['size'];
      if (filter && (typeof filter === 'string' || typeof filter === 'number')) {
        this.searchHandler.search(page, this.filter).subscribe(queryResult => {
          this.doneWorking();
          this.queryResult = queryResult;
        }, () => {
          this.doneWorking();
        });
      } else {
        this.searchHandler.search(page, Object.assign({}, filter)).subscribe(queryResult => {
          this.doneWorking();
          this.queryResult = queryResult;
        }, () => {
          this.doneWorking();
        });
      }
    } catch (error) {
      console.error(error);
    }
  }

  private doneWorking() {
    setTimeout(() => {
      this._working = false;
    });
  }
}
