import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {EventBookingService, Event} from "../../../../../sdk/bw-fullstack-reference-api-sdk";

@Component({
  selector: 'app-event-select',
  templateUrl: './event-select.component.html',
  styleUrls: ['./event-select.component.css']
})
export class EventSelectComponent implements OnInit {
  eventId: any;
  singleEventData: Event;

  constructor(private activateRoute: ActivatedRoute,
              private eventBookingService: EventBookingService) {

  }

  ngOnInit(): void {

    this.activateRoute.params.subscribe(param => {
      if (!param['id']) {
        return;
      }
      this.eventId = param['id'];
    });

    this.eventBookingService.retrieveEventById({id: this.eventId}).subscribe(res => {
      this.singleEventData = res;
    })
  }

}
