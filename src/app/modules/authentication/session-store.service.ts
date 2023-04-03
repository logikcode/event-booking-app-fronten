import { Injectable, OnInit } from '@angular/core';
import { AuthenticationService } from './authentication-service.service';

@Injectable({
  providedIn: 'root'
})
export class SessionStoreService {

  storeName = '_session-store';
  store: any;

  constructor(private authenticationService: AuthenticationService) {
    // this.store = { id: localStorage.getItem(HttpInterceptorService.TOKEN_NAME), data: {} };
    // authenticationService.newToken().subscribe((token) => {
    //   localStorage.removeItem(this.storeName);
    //   this.store = { id: token, data: {} };
    // });
    this.authenticationService.getUser().subscribe(user => {
      if (user) {
        const sessionStore = localStorage.getItem(this.storeName);
        // console.log(sessionStore);
        this.store = sessionStore ? JSON.parse(sessionStore) : { id: user.userId, data: {} };
        if (this.store.id !== user.userId) {
          this.store = { id: user.userId, data: {} };
        }
      } else if (user !== undefined) {
        localStorage.removeItem(this.storeName);
      }
    });
  }

  saveData(scope: string, name: string, data: any) {
    if (!this.store.data[scope]) {
      this.store.data[scope] = {};
    }
    this.store.data[scope][name] = data instanceof Object ? JSON.stringify(data) : data;
    localStorage.setItem(this.storeName, JSON.stringify(this.store));
    // console.log(localStorage.getItem(this.storeName));
  }

  getData(scope: string, name: string) {
    if (!this.store.data[scope]) {
      return;
    }
    return this.store.data[scope][name];
  }

  removeData(scope: string, name: string) {
    if (!this.store.data[scope]) {
      return;
    }
    delete this.store.data[scope][name];
    localStorage.setItem(this.storeName, JSON.stringify(this.store));
  }
}
