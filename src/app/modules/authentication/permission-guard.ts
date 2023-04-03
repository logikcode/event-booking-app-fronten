import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree} from '@angular/router';
import {Observable, of} from 'rxjs';
import {Injectable} from '@angular/core';
import {catchError, map} from 'rxjs/operators';
import { AuthenticationService } from './authentication-service.service';
import { PageManager } from 'src/app/services/page-manager';

@Injectable({
  providedIn: 'root'
})
export class PermissionGuard implements CanActivate {
  constructor(private authenticationService: AuthenticationService,
              private pageManager: PageManager,
              private router: Router) {
  }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return this.authenticationService.getUser()
      .pipe(map((user => {
        const userAccount = this.pageManager.currentUserAccount$.getValue();
        if (user == null) {
          return true;
        }
        const allowedPermissions: string[] = next.data.allowedPermissions;
        if ((allowedPermissions && allowedPermissions.filter(it => user.hasPermission(it)).length > 0)) {
          return true;
        }
        this.router.navigate(['/forbidden']);
        return false;
      })))
      .pipe(catchError((err: any, caught: Observable<any>) => {
        // this.router.navigate(['/forbidden']);
        return of(false);
      }));
  }
}
