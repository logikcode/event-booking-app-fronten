import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoggedInGuard } from './modules/authentication/logged-in.guard';
import { ContactListComponent } from './modules/contact/contact-list/contact-list.component';
import { CreateContactComponent } from './modules/contact/create-contact/create-contact.component';
import { DashboardComponent } from './modules/dashboard/dashboard.component';
import { HomeComponent } from './modules/extranet/home/home.component';
import {AuditTrailListComponent} from "./modules/audit-trail/audit-trail-list/audit-trail-list.component";
import {EventSelectComponent} from "./modules/event-booking/event-select/event-select.component";
import {EventListingsComponent} from "./modules/event-booking/event-listings/event-listings.component";
import {EventDescriptionComponent} from "./modules/event-booking/event-description/event-description.component";
import {SelectEventComponent} from "./modules/event-booking/select-event/select-event.component";
import {ViewDetailsComponent} from "./modules/event-booking/View-details/view-details.component";
import {BookingWizardComponent} from "./modules/event-booking/booking-wizard/booking-wizard.component";
import {ViewBookedEventsComponent} from "./modules/event-booking/view-booked-events/view-booked-events.component";
import {BookedEventsComponent} from "./modules/event-booking/booked-events/booked-events.component";
import {EventMailComponent} from "./modules/event-booking/event-mail/event-mail.component";
import {UpdateBookingComponent} from "./modules/event-booking/update-booking/update-booking.component";

const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    pathMatch: 'full',
  },
  {
    path: 'dashboard',
    component: DashboardComponent,
    pathMatch: 'full',
    canActivate: [LoggedInGuard],
  },
  {
    path: 'create-contact',
    component: CreateContactComponent,
    pathMatch: 'full',
  },
  {
    path: 'contact-list',
    component: ContactListComponent,
    pathMatch: 'full',
  },
  {
    path: 'audit-trail-list',
    component: AuditTrailListComponent,
    pathMatch: 'full',
  },
  {
    path: 'events',
    component: EventListingsComponent,
    pathMatch: 'full',
  },
  {
    path: 'event-listings/:id',
    component: EventSelectComponent,
    pathMatch: 'full',
  },
  {
    path: 'event-listings/booking/:id',
    component: BookingWizardComponent,
    pathMatch: 'full',
  },
  {
    path: 'event-description',
    component: EventDescriptionComponent,
    pathMatch: 'full',
  },
  {
    path: 'select-event',
    component: SelectEventComponent,
    pathMatch: 'full',
  },
  {
    path: 'events/bookings',
    component: ViewBookedEventsComponent,
    pathMatch: 'full'
  },
  {
    path: 'event-mail',
    component: EventMailComponent,
    pathMatch: 'full'
  },
  {
    path: 'booked-event/update',
    component: UpdateBookingComponent,
    pathMatch: 'full'
  }


];

@NgModule({
  imports: [RouterModule.forRoot(routes, { onSameUrlNavigation: 'reload' })],
  exports: [RouterModule],
})
export class AppRoutingModule {}
