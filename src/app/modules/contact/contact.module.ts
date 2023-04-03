import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CreateContactComponent } from './create-contact/create-contact.component';
import { ContactListComponent } from './contact-list/contact-list.component';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {PaginationModule} from "ngx-bootstrap/pagination";
import {RouterModule} from "@angular/router";
import {SharedModule} from "../../shared/shared.module";


@NgModule({
  declarations: [
    CreateContactComponent,
    ContactListComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    PaginationModule,
    FormsModule,
    RouterModule,
    SharedModule,
  ]
})
export class ContactModule { }
