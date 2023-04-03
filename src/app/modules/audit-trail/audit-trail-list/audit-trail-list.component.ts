import { Component, OnInit } from '@angular/core';


import {getOffset, removeUndefinedOrNullFields} from "../../../models/search/search-model";
import {PageChangedEvent} from "ngx-bootstrap/pagination";
import {FormBuilder, FormGroup} from "@angular/forms";
import {BehaviorSubject} from "rxjs";
import {
  AuditTrail, AuditTrailControllerService,
  AuditTrailSearchFilter,
  QueryResultsAuditTrail
} from "../../../../../sdk/bw-fullstack-reference-api-sdk";


@Component({
  selector: 'app-audit-trail-list',
  templateUrl: './audit-trail-list.component.html',
  styleUrls: ['./audit-trail-list.component.css']
})
export class  AuditTrailListComponent implements OnInit {

  form: FormGroup;
  errMessage: any;
  searching: boolean;
  limit: any;
  filterData: AuditTrailSearchFilter;
  resultArray: Array<AuditTrail>;
  resultSubject = new BehaviorSubject<QueryResultsAuditTrail>({});
  queryResults: QueryResultsAuditTrail;
  offset: number;
  data: AuditTrailSearchFilter;
  showErrorMessageTrigger: boolean;
  page: number;

  constructor(private fb: FormBuilder,
              private auditTailService: AuditTrailControllerService) {}


  ngOnInit(): void {

    this.form = this.fb.group({
      action:[''],
      entityName:[''],
      ipAddress: ['']
    });

    this.onSearchClick();
  }

  onSearchClick() {
    if (!this.form?.valid) {
      this.showErrorMessage('Form is invalid.');
      return;
    }
    let filter = this.getFilter(this.limit);
    filter.offset = getOffset(0, this.limit);

    this.search(filter);
  }

  search(filter: AuditTrailSearchFilter) {
    this.searching = true;
    this.auditTailService.fetchActivityLog({filter: filter}).subscribe(v => {
      this.filterData = filter;
      Object.keys(this.filterData).forEach(v => {
        if (v == 'limit' || v == 'offset') {
          delete this.filterData![v]
        }
      })
      this.searching = false;
      this.offset = v.offset;
      this.queryResults = v;
      this.resultArray = v.results;
      this.resultSubject.next(v);
    }, () => {

    });

    this.data = filter;
  }

  changeLimit($event: number) {
    this.limit = $event;
    let filter = this.getFilter($event);
    filter.offset = getOffset(0, $event);
    this.search(filter)
  }

  onPageChange(event: PageChangedEvent) {
    let filter = this.getFilter(this.limit);
    filter.offset = getOffset(event.page, event.itemsPerPage);
    this.page = event.page;
    this.search(filter);
  }


  getFilter(limit?: number): AuditTrailSearchFilter {
    const data = this.form!.value;

    let filter: AuditTrailSearchFilter = {};
    filter.entityName = data.entityName;
    filter.actor = data.actor;
    filter.remoteAddress = data.ipAddress;
    // filter.dateOfEvent = data.dateOfEvent ? moment(data.dateOfEvent).subtract(1, 'months').format('YYYY-MM-DD') : undefined;
    // // filter.endDate = data.endDate ? moment(data.endDate).subtract(1, 'months').format('YYYY-MM-DD') : undefined;
    filter.limit = limit || 5;
    return removeUndefinedOrNullFields(filter);
  }

  getErrorMessage() {
    return this.errMessage;
  }

  showErrorMessage(error: any) {
    this.errMessage = error;
    this.showErrorMessageTrigger = true;
    window.scroll(0, 0);
    setTimeout(() => {
      this.showErrorMessageTrigger = false;
    }, 4000);
  }

}
