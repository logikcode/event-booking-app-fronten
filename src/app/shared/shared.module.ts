import {CUSTOM_ELEMENTS_SCHEMA, NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {PaginationModule} from "ngx-bootstrap/pagination";
import {PageSizeComponent} from "./page-size/page-size.component";
import {PageLengthComponent} from './page-length/page-length.component';
import { FieldErrorComponent } from './field-error/field-error.component';
import { ModalCompletionComponent } from './modal-completion/modal-completion.component';
import {RemoveUnderscoresPipe} from "./remove-underscores.pipe";


@NgModule({
  declarations: [
    PageSizeComponent,
    PageLengthComponent,
    FieldErrorComponent,
    ModalCompletionComponent,
    RemoveUnderscoresPipe
  ],
    exports: [
        PageSizeComponent,
        PageLengthComponent,
        FieldErrorComponent,
      RemoveUnderscoresPipe
    ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    PaginationModule,
    FormsModule,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class SharedModule {
}
