import {HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {EventEmitter, Injectable} from '@angular/core';
import {AsyncSubject, from, Observable, Observer} from 'rxjs';
import {AuthenticationService} from './authentication-service.service';
import {KeycloakService} from 'keycloak-angular';
import {catchError, mergeMap} from 'rxjs/operators';
import * as moment from 'moment';
import {ToastrService} from "ngx-toastr";
@Injectable()
export class HttpInterceptorService implements HttpInterceptor {
  private static TOKEN_NAME = 'TOKEN';
  private static headers: any = {};
  private _httpError: EventEmitter<HttpErrorResponse> = new EventEmitter();
  private _lastSeen!: moment.Moment;
  constructor(
    private toastr: ToastrService,
    private keycloakService: KeycloakService,
    private authenticationService: AuthenticationService) {
  }
  public get httpError() {
    return this._httpError;
  }
  public intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const httpHeaders = {'X-CLIENT-NAME': 'CBS'};
    const handled: Observable<HttpEvent<any>> = from(this.keycloakService.getToken())
      .pipe(mergeMap(token => {
        // if (this.pageManager.currentUserAccount$.value) {
        //   httpHeaders['X-ACCOUNT-CODE'] = this.pageManager.currentUserAccount$.value.code;
        //   httpHeaders['CBS-ACCOUNT-ID'] = this.pageManager.currentUserAccount$.value.code;
        //   httpHeaders['CBS-ROLE'] = this.pageManager.currentUserAccount$.value.roles[0]?.name;
        //   if (token)
        //     httpHeaders['Authorization'] = 'bearer ' + token;
        // }
        return next.handle(req.clone({setHeaders: httpHeaders}));
      }));
    const subject: AsyncSubject<HttpEvent<any>> = new AsyncSubject();
    handled.subscribe(subject);
    subject.subscribe(async (event: HttpEvent<any>) => {
      if (event instanceof HttpErrorResponse) {
        if (event.status === 401) {
          await this.authenticationService.login({
            redirectUri: window.location.origin
          });
          return;
        }
        this._httpError.emit(event);
      }
    }, async (err: HttpEvent<any>) => {
      if (err instanceof HttpErrorResponse) {
        if (err.status < 1) {
          this.toastr.error('Please check your internet connection', 'Failed to contact server');
        } else if (err.status === 401) {
          await this.authenticationService.login({
            redirectUri: window.location.origin
          });
          return;
        } else if (err.status === 404) {
          return;
        }
        this._httpError.emit(err);
      }
    });
    return Observable.create((obs: Observer<HttpEvent<any>>) => {
      subject.subscribe(obs);
    });
  }
}
