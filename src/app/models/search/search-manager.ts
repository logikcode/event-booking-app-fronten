import { QueryResults } from './query-results';
import { PaginatedSearchHandler } from './paginated-search-handler';
import { SearchFilterSource } from './search-filter-source';


export class SearchManager<E, S> {

  _working: boolean;
  private filter: S;
  private _itemsPerPage = 10;

  private _queryResult: QueryResults<E>;

  private searchHandler: PaginatedSearchHandler<E, S>;
  private filterSource: SearchFilterSource<S>;

  private _page: number;

  constructor(searchHandler: PaginatedSearchHandler<E, S>, filterSource?: SearchFilterSource<S>) {
    this.searchHandler = searchHandler;
    this.filterSource = filterSource;
  }

  private set queryResult(queryResult: QueryResults<E>) {
    this._queryResult = queryResult;
    this._page = (this.offset / this.itemsPerPage) + 1;
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
      return -1;
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

  private goToPage(page: number) {
    this._working = true;
    if (this.filter && (typeof this.filter === 'string' || typeof this.filter === 'number')) {
      this.searchHandler.search(page, this.filter).subscribe(queryResult => {
        this.doneWorking();
        this.queryResult = queryResult;
      }, () => {
        this.doneWorking();
      });
    } else {
      this.searchHandler.search(page, Object.assign({}, this.filter)).subscribe(queryResult => {
        this.doneWorking();
        this.queryResult = queryResult;
      }, () => {
        this.doneWorking();
      });
    }
  }

  private doneWorking() {
    setTimeout(() => {
      this._working = false;
    });
  }
}
