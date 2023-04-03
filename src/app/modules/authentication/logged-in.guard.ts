import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, Router, RouterStateSnapshot} from '@angular/router';
import {Observable, of} from 'rxjs';
import {catchError, map} from 'rxjs/operators';
import { AuthenticationService } from './authentication-service.service';
import {KeycloakAuthGuard, KeycloakService} from "keycloak-angular";

@Injectable({
  providedIn: 'root'
})
export class LoggedInGuard extends KeycloakAuthGuard {
  constructor(
    protected readonly router: Router,
    protected readonly keycloak: KeycloakService,
    protected readonly authenticationService: AuthenticationService
  ) {
    super(router, keycloak);
  }

  public async isAccessAllowed(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ) {
    if (!this.authenticated) {
      await this.authenticationService.login({redirectUri: window.location.origin + state.url});
      return false;
    } else {
      return this.authenticationService.fetchUser()
        .pipe(map((user => {
          console.log("In LoggedInGuard...!user = " + !user);
          if (!user) {
            this.authenticationService.forbidAccess();
            return false;
          }
          if (user.requiresPasswordUpdate) {
            this.router.navigate(['change-password']);
            return false;
          }
          const permissions: string[] = route.data.permissions;
          if (!permissions || !permissions.length || permissions.filter(it => user.hasPermission(it)).length) {
            return true;
          }
          this.authenticationService.forbidAccess();
          return false;
        })))
        .pipe(catchError((err: any, caught: Observable<any>) => {
          this.authenticationService.forbidAccess();
          return of(false);
        })).toPromise();
    }
  }
}
