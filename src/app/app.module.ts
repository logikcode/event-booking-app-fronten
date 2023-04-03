import {APP_INITIALIZER, CUSTOM_ELEMENTS_SCHEMA, NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {LoginComponent} from './modules/login/login.component';
import {DashboardComponent} from './modules/dashboard/dashboard.component';
import {NavbarComponent} from "./modules/navigation/navbar/navbar.component";
import {HttpClientModule} from "@angular/common/http";
import {KeycloakAngularModule, KeycloakEventType, KeycloakService} from "keycloak-angular";
import {AuthenticationService} from "./modules/authentication/authentication-service.service";
import {environment} from "../environments/environment";
import {BASE_PATH} from "../../sdk/bw-fullstack-reference-api-sdk";
import {CreateContactComponent} from './modules/contact/create-contact/create-contact.component';
import {ToastrModule} from 'ngx-toastr';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {ContactListComponent} from "./modules/contact/contact-list/contact-list.component";
import {PaginationModule} from "ngx-bootstrap/pagination";
import { PageSizeComponent } from './shared/page-size/page-size.component';
import {ContactModule} from "./modules/contact/contact.module";
import {SharedModule} from "./shared/shared.module";
import {EventListingsComponent} from "./modules/event-booking/event-listings/event-listings.component";
import {EventSelectComponent} from "./modules/event-booking/event-select/event-select.component";
import {CompanyInfoComponent} from "./modules/event-booking/company-info/company-info.component";
import {BookedEventsComponent} from "./modules/event-booking/booked-events/booked-events.component";
import {EventDescriptionComponent} from "./modules/event-booking/event-description/event-description.component";
import {HeaderComponent} from "./modules/navigation/header/header.component";
import {SelectEventComponent} from "./modules/event-booking/select-event/select-event.component";
import {ExtranetModule} from "./modules/extranet/extranet.module";
import {NgbDateParserFormatter, NgbDatepickerModule, NgbModule} from "@ng-bootstrap/ng-bootstrap";
import {BsDatepickerConfig, BsDatepickerModule} from "ngx-bootstrap/datepicker";
import {NgbDateCustomParserFormatter} from "./services/NgbDateCustomParserFormatter";
import {BookingDetailsComponent} from "./modules/event-booking/booking-details/booking-details.component";
import {ViewDetailsComponent} from "./modules/event-booking/View-details/view-details.component";
import { BookingWizardComponent } from './modules/event-booking/booking-wizard/booking-wizard.component';
import {ArchwizardModule} from "angular-archwizard";

import {NgxIntlTelInputModule} from "ngx-intl-tel-input";
import {BsModalRef, BsModalService, ModalModule} from "ngx-bootstrap/modal";
import {AuditTrailListComponent} from "./modules/audit-trail/audit-trail-list/audit-trail-list.component";
import {ViewBookedEventsComponent} from "./modules/event-booking/view-booked-events/view-booked-events.component";
import {NgxIntlTelInputComponent} from "ngx-intl-tel-input";
import {BookingDetailsTwoComponent} from "./modules/event-booking/booking-details-two/booking-details-two.component";
import {EventMailComponent} from "./modules/event-booking/event-mail/event-mail.component";
import { UpdateBookingComponent } from './modules/event-booking/update-booking/update-booking.component';


function initializeKeycloak(
  keycloak: KeycloakService,
  authenticationService: AuthenticationService,
) {
  keycloak.keycloakEvents$.subscribe(async (value) => {
    if (value.type === KeycloakEventType.OnAuthSuccess) {
      await authenticationService.fetchUser().toPromise();
    }
  });
  return () =>
    keycloak.init({
      config: environment.keycloakConfig,
      initOptions: {
        enableLogging: !environment.production,
        onLoad: 'check-sso',
        // silentCheckSsoRedirectUri: window.location.origin + '/assets/silent-check-sso.html',
        checkLoginIframe: false,
      },
    });
}
export function getDatepickerConfig(): BsDatepickerConfig {
  return Object.assign(new BsDatepickerConfig(), {
    dateInputFormat: "MM/DD/YYYY",
  });
}

@NgModule({
  declarations: [

    AppComponent,
    LoginComponent,
    DashboardComponent,
    NavbarComponent,
    EventListingsComponent,
    EventSelectComponent,
    BookingDetailsComponent,
    CompanyInfoComponent,
    BookedEventsComponent,
    AuditTrailListComponent,
    EventDescriptionComponent,
    HeaderComponent,
    SelectEventComponent,
    ViewDetailsComponent,
    BookingWizardComponent,
    BookingDetailsTwoComponent,
    ViewBookedEventsComponent,
    EventMailComponent,
    UpdateBookingComponent







  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    ExtranetModule,
    KeycloakAngularModule,
    PaginationModule.forRoot(),
    FormsModule,
    ContactModule,
    ReactiveFormsModule,
    ToastrModule.forRoot(),
    BrowserAnimationsModule,
    SharedModule,
    NgbDatepickerModule,
    ModalModule.forRoot(),
    BsDatepickerModule.forRoot(),
    ArchwizardModule, NgxIntlTelInputModule
  ],

  providers: [
    BsModalService,
    BsModalRef,
    {
      provide: BASE_PATH,
      useValue: environment.bwReferenceCoreApiBaseUrl,
    },
    {
      provide: APP_INITIALIZER,
      useFactory: initializeKeycloak,
      multi: true,
      deps: [KeycloakService, AuthenticationService],
    },

    {provide: BsDatepickerConfig, useFactory: getDatepickerConfig},
    {provide: NgbDateParserFormatter, useClass: NgbDateCustomParserFormatter}
    // {provide: HTTP_INTERCEPTORS, useClass: HttpInterceptorService, multi: true},
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  bootstrap: [AppComponent],
})
export class AppModule {
}
