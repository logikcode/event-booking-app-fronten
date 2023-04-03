import {Injectable} from '@angular/core';
import {Router} from '@angular/router';
import {BehaviorSubject, Subscription} from 'rxjs';
import { Constant } from '../models/enums/constants';
import { UserAccount } from '../models/user-account.model';

@Injectable({
  providedIn: 'root'
})
export class PageManager {

  // public language$: BehaviorSubject<string>;
  public currentUserAccount$: BehaviorSubject<UserAccount>;

  private _storeName = '_session-store';

  private store: any;

  private _subs: Subscription[] = [];
  private _organizationScope = 'USER_ORGANIZATION';
  private _currentOrganizationKey = 'currentOrganization'

  constructor(public router: Router) {
    // this.language$ = new BehaviorSubject<string>(this.getLanguageFromStorage());
    this.currentUserAccount$ = new BehaviorSubject<UserAccount>(this.getCurrentUserAccountFromStorage());
  }

  

  getCurrentUserAccountFromStorage() {

    return this.getData('USER_ACCOUNT', 'currentAccount', Constant.Storage.LOCAL);
  }

  getCurrentOrganizationFromStorage() {
    return this.getData(this._organizationScope, this._currentOrganizationKey, Constant.Storage.LOCAL);
  }

  public setCurrentUserAccount(userAccount: UserAccount) {
    if (!userAccount) {
      console.log("no user");
      this.currentUserAccount$.next(this.getCurrentUserAccountFromStorage());
    } else {
      this.currentUserAccount$.next(userAccount);
      this.storeData('USER_ACCOUNT', 'currentAccount', userAccount, Constant.Storage.LOCAL);
    }
  }


  getStore(storageType: Constant.Storage) {
    const sessionStore = this.isLocal(storageType) ? localStorage.getItem(this._storeName) : sessionStorage.getItem(this._storeName);
    return sessionStore ? JSON.parse(sessionStore) : {};
  }

  public storeData(scope: string, key: string, data: any, storageType: Constant.Storage = Constant.Storage.LOCAL): boolean {
    // if (!this.storages.includes(storageType.toLowerCase())) return false;

    this.store = this.getStore(storageType);
    if (!this.store[scope]) {
      this.store[scope] = {};
    }
    this.store[scope][key] = JSON.stringify(data);

    this.persist(storageType);

    return this.store[scope];
  }

  public getData(scope: string, key: string, storageType: Constant.Storage = Constant.Storage.LOCAL): any | boolean {

    // if (!this.storages.includes(storageType.toLowerCase())) return false;

    this.store = this.getStore(storageType);
    if (!this.store[scope] || !this.store[scope][key]) {
      return false;
    }
    return JSON.parse(this.store[scope][key]);
  }

  public removeData(scope: string, key: string, storageType: Constant.Storage = Constant.Storage.LOCAL): boolean {

    this.store = this.getStore(storageType);

    if (!this.store[scope] || !this.store[scope][key]) {
      return false;
    }
    delete this.store[scope][key];

    this.persist(storageType);

    return true;
  }

  public clearAllData() {
    localStorage.clear();
    sessionStorage.clear();
  }

  public setIntegration(userAccount: UserAccount) {
    let account = this.currentUserAccount$.getValue();
    account.enabledForIntegration = userAccount.enabledForIntegration;
    this.setCurrentUserAccount(account);
  }

  private persist(storageType: Constant.Storage) {
    if (this.isLocal(storageType)) {
      localStorage.setItem(this._storeName, JSON.stringify(this.store));
    } else {
      sessionStorage.setItem(this._storeName, JSON.stringify(this.store));
    }
  }

  isLocal(type: Constant.Storage): boolean {
    return type === Constant.Storage.LOCAL;
  }
}
