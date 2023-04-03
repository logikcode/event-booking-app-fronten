import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {EventBookingService, Event} from "../../../../../sdk/bw-fullstack-reference-api-sdk";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {CountryISO, SearchCountryField} from "ngx-intl-tel-input";
import {PhoneNumberValidator} from "../../../models/etc/phone-number-validator";
import {UniqueIdValidatorService} from "../../../models/etc/unique-id-validator.service";

@Component({
  selector: 'app-booking-details',
  templateUrl: './booking-details.component.html',
  styleUrls: ['./booking-details.component.css']
})
export class BookingDetailsComponent implements OnInit {
  private eventId: any;
  singleEventData: Event;
  formGroup: FormGroup;
  SearchCountryField = SearchCountryField;
  countryISO: CountryISO.UnitedStates;
  errorSubmission: boolean;
  preferredCountries: string[] = ['ng'];
  displayPassword = false;
  @Output() nextButtonClicked = new EventEmitter<FormGroup>();

  constructor(
    private activateRoute: ActivatedRoute,
              private fb: FormBuilder,
              private eventBookingService: EventBookingService,
              private uniqueIdValidatorService: UniqueIdValidatorService) {

  }

  ngOnInit(): void {
    this.formGroup = this.fb.group({
      firstName: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
      lastName: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
      middleName: ['', [Validators.minLength(2), Validators.maxLength(50)]],
      email: ['', [Validators.required, Validators.pattern("^[a-zA-Z0-9.!#$%&amp;'^_`{}~-]+@[a-zA-Z0-9-]+(?:\\.[a-zA-Z0-9-]+)*$"), Validators.maxLength(50)]],
      phoneNumber: ['', [Validators.required, PhoneNumberValidator()]],
    });

    this.formGroup.get('phoneNumber')?.setAsyncValidators([this.uniqueIdValidatorService.phoneNumberVerifier()]);
    this.formGroup.get('email')?.setAsyncValidators([this.uniqueIdValidatorService.verifier('email', 'emailExists')]);


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

  submissionForError(){
    this.errorSubmission = true;
  }
  moveToNext() {
    this.nextButtonClicked.next(this.formGroup);
  }

}
