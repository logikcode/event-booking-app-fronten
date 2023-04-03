import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup} from "@angular/forms";
import * as moment from "moment";
import {getOffset, removeUndefinedOrNullFields} from "../../../models/search/search-model";
import {
  EventBookingService,

  Event,
  EventBookingSearchFilter,
  QueryResultsEvent
} from "../../../../../sdk/bw-fullstack-reference-api-sdk";
import {PageChangedEvent} from "ngx-bootstrap/pagination";
import {BehaviorSubject} from "rxjs";

@Component({
  selector: 'app-event-listings',
  templateUrl: './event-listings.component.html',
  styleUrls: ['./event-listings.component.css']
})
export class EventListingsComponent implements OnInit {

  form: FormGroup;
  currentStartDate: any;
  errMessage: any;
  searching: boolean;
  limit: number = 5;
  filterData: EventBookingSearchFilter;
  resultArray: Array<Event>;
  resultSubject = new BehaviorSubject<QueryResultsEvent>({});
  queryResults: QueryResultsEvent;
  offset: number;
  data: EventBookingSearchFilter;
  showErrorMessageTrigger: boolean;
  page: number;
  ngModel: any;

  constructor(private fb: FormBuilder,
              private eventBookingService: EventBookingService) { }

  ngOnInit(): void {

    this.form = this.fb.group({
      nameOfEvent:[''],
      venue:[''],
      location:[''],
      dateOfEvent:[''],
    });

    // this.form.controls .dateOfEvent.valueChanges.subscribe(v => {
    //   this.currentStartDate = v;
    //   if (v != moment(v).format('YYYY-MM-DD')) {
    //     this.form.patchValue({endDate: ''});
    //   }
    // });
    //
    // this.form.controls.dateOfEvent.valueChanges.subscribe(v => {
    //   if (moment(this.currentStartDate) > moment(v)) {
    //     this.showErrorMessage('Date(from) should be greater than Date(to).');
    //     this.form.patchValue({endDate: ''});
    //   }
    // });

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

  search(filter: EventBookingSearchFilter) {
    this.searching = true;
    this.eventBookingService.retrieveAllEvents({filter: filter}).subscribe(v => {
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


  getFilter(limit?: number): EventBookingSearchFilter {
    const data = this.form!.value;

    let filter: EventBookingSearchFilter = {};
    filter.name = data.nameOfEvent;
    filter.location = data.location;
    filter.dateOfEvent = data.dateOfEvent ? moment(data.dateOfEvent).subtract(1, 'months').format('YYYY-MM-DD') : undefined;
    // filter.endDate = data.endDate ? moment(data.endDate).subtract(1, 'months').format('YYYY-MM-DD') : undefined;
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

  maxYear() {
    return moment(new Date()).year();
  }

  maxMonth() {
    const check = moment(new Date(), 'YYYY/MM/DD');
    return check.format('M');
  }

  maxDay() {
    const check = moment(new Date(), 'YYYY/MM/DD');
    return check.format('D');
  }

}
