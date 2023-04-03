import { Component, OnInit } from '@angular/core';
import {AuthenticationService} from "../../authentication/authentication-service.service";
import {KeycloakService} from "keycloak-angular";
import { Subject } from 'rxjs';


@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  stop$ = new Subject();
  user: any;
  showLogin: boolean = true;

  constructor(
    private authenticationService: AuthenticationService,
    private keycloakService: KeycloakService,
  ) { }

  ngOnInit(): void {
    this.keycloakService.isLoggedIn().then(result => this.showLogin = !result);


    /*this.authenticationService
    .getUser()
    .pipe(takeUntil(this.stop$))
    .subscribe((user) => {
      this.user = user;
      if(user !== null && this.user != undefined){
        this.showLogin = false;
      }
    });*/
    console.log("Init called...showLogin = " + this.showLogin);

  }

  async login() {
    this.authenticationService.logout(
      this.keycloakService.getKeycloakInstance().createLoginUrl({
        redirectUri: window.location.origin + '/dashboard',
        prompt: 'login',
      })
    );
  }

  async logout() {
    this.user = null;
    this.showLogin = true;
    this.authenticationService.logout(window.location.origin);
    //window.location.reload();
  }


}
