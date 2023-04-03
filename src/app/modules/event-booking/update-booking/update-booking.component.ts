import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {Event} from "../../../../../sdk/bw-fullstack-reference-api-sdk";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {CountryISO, SearchCountryField} from "ngx-intl-tel-input";

import {PhoneNumberValidator} from "../../../models/etc/phone-number-validator";
import {ActivatedRoute} from "@angular/router";

@Component({
  selector: 'app-update-booking',
  templateUrl: './update-booking.component.html',
  styleUrls: ['./update-booking.component.css']
})
export class UpdateBookingComponent implements OnInit {
  private eventId: any;
  singleEventData: Event;
  formGroup: FormGroup;
  SearchCountryField = SearchCountryField;
  countryISO: CountryISO.UnitedStates;
  errorSubmission: boolean;
  preferredCountries: string[] = ['ng'];
  displayPassword = false;
  @Output() nextButtonClicked = new EventEmitter<FormGroup>();


  constructor( private activateRoute: ActivatedRoute,
               private fb: FormBuilder,) { }

  ngOnInit(): void {

    this.formGroup = this.fb.group(
      {
      firstName: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
      lastName: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
      middleName: ['', [Validators.minLength(2), Validators.maxLength(50)]],
      email: ['', [Validators.required, Validators.pattern("^[a-zA-Z0-9.!#$%&amp;'^_`{}~-]+@[a-zA-Z0-9-]+(?:\\.[a-zA-Z0-9-]+)*$"), Validators.maxLength(50)]],
      phoneNumber: ['', [Validators.required, PhoneNumberValidator()]],
    });

  }

  finalSubmission ():void {

  }
}
