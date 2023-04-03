import {EventEmitter, Injectable} from '@angular/core';
import {HttpClient, HttpResponse} from "@angular/common/http";
import {KeycloakService} from "keycloak-angular";
import {Router} from "@angular/router";
import {AsyncSubject, BehaviorSubject, from, Observable, of, Subject} from "rxjs";
import {KeycloakLoginOptions} from "keycloak-js";
import {map} from "rxjs/operators";
import { PageManager } from 'src/app/services/page-manager';
import { ApiResponse } from 'src/app/models/etc/api-response';
import { User } from 'src/app/models/user/user.model';
import {environment} from "../../../environments/environment";


@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {


  // @ts-ignore
  private static user: Subject<User | null> = new BehaviorSubject(undefined);
  public static _user: User;
  private static ongoingFetch: Observable<any> | null;
  private static initialized: boolean;

  private static newUserToken: EventEmitter<string | null> = new EventEmitter();

  constructor(
    private httpClient: HttpClient,
    private keycloak: KeycloakService,
    private router: Router,
    private pageManager: PageManager
  ) {
    AuthenticationService.user.subscribe((user: any) => {
      if (user === undefined) {
        return;
      }
      AuthenticationService.initialized = true;
      AuthenticationService._user = user;
    });
  }

  public getLastProtectedUrl(): string | null {
    return null;
  }

  public logout(redirectUri?: string) {
    this.pageManager.clearAllData();
    this.keycloak.clearToken();
    return from(this.keycloak.logout(redirectUri));
  }

  public login(loginOptions: KeycloakLoginOptions) {
    return this.keycloak.login(loginOptions);
  }

  public requestPasswordReset(data: any): Observable<any> {
    return this.httpClient.post(`${environment.apiBaseUrl}/password/forgot`, data);
  }

  public getUser() {
    return AuthenticationService.user;
  }

  public forbidAccess() {
    this.router.navigate(['/forbidden']);
  }

  public fetchUser(): Observable<User> {
    if (AuthenticationService.initialized) {
      return of(AuthenticationService._user);
    }
    return this.fetch();
  }

  public resetPassword(data: any): Observable<any> {
    return this.httpClient.post(`${environment.apiBaseUrl}/password/reset/${data.resetToken}`,
      {password: data.password},
      {responseType: 'text'});
  }

  public changePassword(password: string): Observable<ApiResponse<string> | null> {
    const mapper = (response: HttpResponse<ApiResponse<string>>): ApiResponse<string> | null => {
      AuthenticationService.newUserToken.next(response.body && response.body.data);
      return response.body;
    };
    return this.httpClient.post<ApiResponse<string>>(`${environment.apiBaseUrl}/change-password`,
      {password},
      {observe: 'response'})
      .pipe(map(mapper));
  }

  private fetch() {

    console.log('===> calling fetch.....');
    const wrapper = new AsyncSubject();
    AuthenticationService.ongoingFetch = wrapper;

    this.httpClient.get(`${environment.bwReferenceCoreApiBaseUrl}/me`)
      .subscribe((u: any) => {
        const user = new User(u);
        wrapper.next(user);
        wrapper.complete();

        AuthenticationService.user.next(user);

        let org = this.pageManager.getCurrentOrganizationFromStorage()['organization'];
        let indexa=0; let counta = 0;
        let indexb=0; let countb = 0;
        let organization; let subscriptions
        user.accounts.forEach(account => {
          counta++;
        });
        // this.pageManager.currentOrganization$.next(data);
        AuthenticationService.ongoingFetch = null;
      }, (err: any) => {
        wrapper.error(err);
        wrapper.complete();
        AuthenticationService.user.next(null);
      });

    return AuthenticationService.ongoingFetch;
  }
}
