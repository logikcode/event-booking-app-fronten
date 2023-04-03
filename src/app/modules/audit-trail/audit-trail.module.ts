import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {NgxPaginationModule} from "ngx-pagination";
import {AuditTrailListComponent} from "./audit-trail-list/audit-trail-list.component";



@NgModule({
  declarations: [],
  imports: [
    NgxPaginationModule,
    CommonModule

  ]
})
export class AuditTrailModule { }
