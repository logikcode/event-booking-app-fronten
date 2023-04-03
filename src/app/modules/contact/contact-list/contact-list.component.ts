import { Component, OnInit } from '@angular/core';
import {
  ContactService,
  Contact,
  ContactDto,
  DeleteContactRequestParams,
  SearchContactsRequestParams, QueryResultsContact,
} from '../../../../../sdk/bw-fullstack-reference-api-sdk';
import {ToastrService} from 'ngx-toastr';
import { Router } from '@angular/router';
import { PageManager } from 'src/app/services/page-manager';
import { AuthenticationService } from '../../authentication/authentication-service.service';
import { PaginatedSearchHandler } from 'src/app/models/search/paginated-search-handler';
import { SearchFilterSource } from 'src/app/models/search/search-filter-source';
import { PaginatedSearchManager } from 'src/app/models/search/paginated-search-manager';
import { Observable } from 'rxjs';
import {FormBuilder, FormGroup} from '@angular/forms';
import {SearchManager} from "../../../models/search/search-manager";

@Component({
  selector: 'app-contact-list',
  templateUrl: './contact-list.component.html',
  styleUrls: ['./contact-list.component.css']
})
export class ContactListComponent implements OnInit, PaginatedSearchHandler<Contact, any>, SearchFilterSource<any>{

  form: FormGroup;
  working: boolean;
  searchManager: SearchManager<Contact, any> = new SearchManager<Contact, any>(this, this);
  filterData: any;
  isFilterEmpty = true;
  filters: SearchContactsRequestParams;


  constructor(
    private contactService: ContactService,
    private toastr: ToastrService,
    private router: Router,
    private pageManager: PageManager,
    private authenticationService: AuthenticationService,
    private fb: FormBuilder
  ) {  }

  ngOnInit(): void {
    this.form = this.fb.group({
      firstName: '',
      lastName:'',
    })
  }

  deleteContact(id: number){
    this.contactService.deleteContact({id}).subscribe((res: any) => {
      this.toastr.success('Contact has been deleted successfully');
      this.searchManager.reloadAndShowFirstPage();
    }, err => {
      if (err.error != null) {
        if (err.error.message != null) {
          this.toastr.error(`Error: ${err.error.message}.`);
        } else {
          this.toastr.error(`Error: ${JSON.stringify(err.error)}.`);
        }
      } else {
        this.toastr.error(`Could not delete contact. This may be an error on our end. Please refresh the page and try again `);
      }
    });
  }



  getFilter() {
    const data = Object.assign({}, this.form!.value);
    Object.keys(data).forEach(it => {
      if (!data[it]) {
        delete data[it];
      }
    });
    this.filterData = data;
    this.isFilterEmpty = Object.getOwnPropertyNames(this.filterData).length === 0;
    return data;
  }

  search(page: number, filter?: any): Observable<any> {


    localStorage.setItem('contactSearchList', JSON.stringify(this.form!.value));

    const offset = (page - 1) * this.searchManager!.itemsPerPage;

    return this.contactService.searchContacts ({filter:{
      id: filter.id,
      status: filter.status,
      firstName: filter.firstName,
      lastName: filter.lastName,
      offset,
      limit: this.searchManager!.itemsPerPage,
    }});
    return null;
  }


}
