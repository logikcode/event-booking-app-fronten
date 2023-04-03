import {Injectable} from "@angular/core";
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree} from "@angular/router";
import {AuthenticationService} from "./authentication-service.service";
import {Observable, of} from "rxjs";
import {catchError, distinctUntilChanged, map, takeUntil} from "rxjs/operators";
import {PageManager} from "../../services/page-manager";


@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate {
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
        // if (user == null) {
        //   console.log('userAccount= ==');
        //
        //   return true;
        // }

        if(userAccount.accountType === "VISITS_ADMIN"){
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
