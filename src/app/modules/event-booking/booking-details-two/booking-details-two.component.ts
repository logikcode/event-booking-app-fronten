import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {FormBuilder, FormGroup} from "@angular/forms";
import * as Events from "events";
import {EventBookingService} from "../../../../../sdk/bw-fullstack-reference-api-sdk";

@Component({
  selector: 'app-booking-details-two',
  templateUrl: './booking-details-two.component.html',
  styleUrls: ['./booking-details-two.component.css']
})
export class BookingDetailsTwoComponent implements OnInit {
  private eventId: any;
  singleEventData: any;
  private errMessage: any;
  showErrorMessageTrigger: boolean;
  savedFiles: UploadedFile[] = [];
  @Output() nextButtonClicked = new EventEmitter<UploadedFile[]>();


  constructor(private activateRoute: ActivatedRoute,
              private fb: FormBuilder,
              private eventControllerService: EventBookingService) {
  }

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

  onFileChange(event) {
    let f = event.target.files[0];
    if (f.size > 1024 * 1024 * 10) {
      this.showErrorMessage('File size must not be more than 10MB');
      return;
    }

    const validExtensions = ["image/jpg", "image/jpeg", "image/png", "application/pdf", "image/bmp", "image/x-bmp"];
    const isValidExtension = validExtensions.indexOf(f.type) > -1;

    if (!isValidExtension) {
      this.showErrorMessage('Invalid File Type.');
      return;
    }

    const reader = new FileReader();
    if (event.target.files && event.target.files.length) {

      // this.xrayUrl.push(f);
      // this.fileDoc.name = f.name;
      reader.readAsDataURL(f);
      reader.onload = (_event) => {
        this.addFilesToList(f.name, f.type, f.size, reader.result);
      }
    }
  }

  showErrorMessage(error: any) {
    this.errMessage = error;
    this.showErrorMessageTrigger = true;
    window.scroll(0, 0);
    setTimeout(() => {
      this.showErrorMessageTrigger = false;
    }, 5000);
  }

  getErrorMessage() {
    return this.errMessage;
  }

  addFilesToList(fileName, fileType, fileSize, fileData64) {
    if(this.savedFiles.length > 4){
      this.showErrorMessage('Cannot upload more than five(5) files.');
      return;
    }

    this.savedFiles.push({fileName, fileType, fileSize, fileData64});
    console.log(this.savedFiles)
  }

  removeFiles(index: number){
    this.savedFiles.splice(index, 1);
  }

  moveToSummaryPage(){
    if(this.savedFiles.length == 0){
      this.showErrorMessage('You need to upload at least One(1) file.');
      return;
    }

    this.nextButtonClicked.emit(this.savedFiles);
  }
}

interface UploadedFile {
  fileName: String;
  fileType: String;
  fileSize: String;
  fileData64: String;
}
