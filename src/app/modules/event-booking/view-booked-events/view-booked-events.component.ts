import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup} from "@angular/forms";

import {BehaviorSubject} from "rxjs";
import {getOffset, removeUndefinedOrNullFields} from "../../../models/search/search-model";
import {PageChangedEvent} from "ngx-bootstrap/pagination";
import {
  AuditTrailSearchFilter, BookedEvent,
  BookedEventSearchFilter,
  QueryResultsBookedEvent, BookedEventControllerService, EventBookingService
} from "../../../../../sdk/bw-fullstack-reference-api-sdk";
import * as moment from "moment";

@Component({
  selector: 'app-view-booked-events',
  templateUrl: './view-booked-events.component.html',
  styleUrls: ['./view-booked-events.component.css']
})
export class ViewBookedEventsComponent implements OnInit {

  form: FormGroup;
  errMessage: any;
  searching: boolean;
  limit: any;
  filterData: BookedEventSearchFilter;
  resultArray: Array<BookedEvent>;
  resultSubject = new BehaviorSubject<QueryResultsBookedEvent>({});
  queryResults: QueryResultsBookedEvent;
  offset: number;
  data: BookedEventSearchFilter;
  showErrorMessageTrigger: boolean;
  page: number;
  ngModel1: any;
  ngModel: any;

  constructor(private fb: FormBuilder,
              private bookedEventControllerService: BookedEventControllerService, private eventBookingService: EventBookingService) {}



  ngOnInit(): void {
    this.form = this.fb.group({
      applicant:[''],
      events:[''],
      startDate: [''],
      endDate:['']
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

  search(filter: BookedEventSearchFilter) {
    this.searching = true;
    this.bookedEventControllerService.searchBookedEvents({filter: filter}).subscribe(v => {
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

    let filter: BookedEventSearchFilter = {};
    filter.eventApplier = data.applicant;
    filter.events = data.event;
    // filter.remoteAddress = data.ipAddress;
    filter.startDate = data.dateOfEvent ? moment(data.dateOfEvent).subtract(1, 'months').format('YYYY-MM-DD') : undefined;
    filter.endDate = data.endDate ? moment(data.endDate).subtract(1, 'months').format('YYYY-MM-DD') : undefined;
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
  deleteBookedEvent(id){
    this.eventBookingService.cancelEvent({id: id}).subscribe(res =>{
      this.onSearchClick();
    }, error => {

    })
  }
}
