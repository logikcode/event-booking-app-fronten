import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from "@angular/core";
import {ActivatedRoute} from "@angular/router";
import {FormBuilder, FormGroup} from "@angular/forms";
import {EventDetailService} from "../../../models/etc/eventDetailService";
import {EventBookingService} from "../../../../../sdk/bw-fullstack-reference-api-sdk";

@Component({
  selector: 'app-view-details',
  templateUrl: './view-details.component.html',
  styleUrls: ['./view-details.component.css']
})
export class ViewDetailsComponent implements OnInit, OnChanges {

  private eventId: any;
  singleEventData: any;
  @Input()
  secondStepDetails: UploadedFile[];
  @Input()
  firstFormDetails: FormGroup;
  firstForm: any;
  file: UploadedFile[];
  @Output() applicantEmit = new EventEmitter<any>();
  @Output() documentEmit = new EventEmitter<any>();
  @Output() finalSubmission = new EventEmitter<any>();

  constructor(private activateRoute: ActivatedRoute,
              private fb: FormBuilder,
              private eventControllerService: EventBookingService,
              private eventDetailService: EventDetailService) { }

  ngOnInit(): void {

    this.activateRoute.params.subscribe(param => {
      if (!param['id']) {
        return;
      }
      this.eventId = param['id'];
    });

    this.eventControllerService.retrieveEventById({id: this.eventId}).subscribe(res => {
      this.singleEventData = res;
    })
  }

  ngOnChanges(changes: SimpleChanges): void {

    this.eventDetailService.eventDetailPojoBehaviorSubject.subscribe(res =>{
      this.firstForm = res?.form?.getRawValue();
      this.file = res?.file;
    })
  }
  removeFiles(index: number){
    this.file.splice(index, 1);
  }



}
interface UploadedFile {
  fileName: String;
  fileType: String;
  fileSize: String;
  fileData64: String;
}
