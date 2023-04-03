import { Component, OnInit } from '@angular/core';
import {AuthenticationService} from "../authentication/authentication-service.service";
import * as Keycloak from "keycloak-js";
import {KeycloakService} from "keycloak-angular";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {

  constructor(
    private authenticationService: AuthenticationService,
    private keycloakService: KeycloakService,
  ) { }

  ngOnInit(): void {
  }



  async login() {
    this.authenticationService.logout(this.keycloakService.getKeycloakInstance().createLoginUrl({
      redirectUri: window.location.origin + '/dashboard',
      prompt: 'login'
    }));
  }

}
