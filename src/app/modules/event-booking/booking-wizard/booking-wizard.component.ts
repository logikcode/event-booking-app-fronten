import {Component, OnInit, ViewChild} from '@angular/core';
import {FormGroup} from "@angular/forms";
import {WizardComponent} from "angular-archwizard";
import {EventDetailService} from "../../../models/etc/eventDetailService";
import {ActivatedRoute, Router} from "@angular/router";
import {EventBookingService} from "../../../../../sdk/bw-fullstack-reference-api-sdk";
import {BsModalRef, BsModalService} from "ngx-bootstrap/modal";
import {ModalCompletionComponent} from "../../../shared/modal-completion/modal-completion.component";

@Component({
  selector: 'app-booking-wizard',
  templateUrl: './booking-wizard.component.html',
  styleUrls: ['./booking-wizard.component.css']
})
export class BookingWizardComponent implements OnInit {

  @ViewChild(WizardComponent)
  public wizard: WizardComponent;
  formOneGroup: FormGroup;
  secondStepDetails: UploadedFile[];
  fileSubmissionList: any = [];
  private eventId: any;

  constructor(private eventDetailService: EventDetailService,
              private activateRoute: ActivatedRoute,
              private router: Router,
              public modalRef: BsModalRef, private modalService: BsModalService,
              private eventBookingService: EventBookingService) {
  }

  ngOnInit(): void {
    this.activateRoute.params.subscribe(param => {
      if (!param['id']) {
        return;
      }
      this.eventId = param['id'];
    });
  }

  firstFormDetails($event: FormGroup) {
    if ($event) {
      this.wizard.goToNextStep();
    }
    this.formOneGroup = $event;
  }

  secondFormDetails($event: UploadedFile[]) {
    if ($event) {
      this.wizard.goToNextStep();
    }
    this.secondStepDetails = $event;
    this.eventDetailService.eventDetailPojoBehaviorSubject.next({
      file: this.secondStepDetails,
      form: this.formOneGroup
    });
  }

  goToDocumentPage() {
    this.wizard.goToStep(1);
  }

  goToApplicant() {
    this.wizard.goToStep(0);
  }

  finalSubmission($event) {
    const form = this.formOneGroup.getRawValue();

    this.secondStepDetails.forEach(v => {
      const fileSet: UploadedFile = {
        fileName: v.fileName,
        fileType: v.fileType,
        fileSize: v.fileSize,
        fileData64: v.fileData64
      }
      this.fileSubmissionList.push(fileSet);
    })


    this.eventBookingService.createEventBooking({
      eventApplierDto: {
        firstName: form.firstName,
        middleName: form.middleName,
        lastName: form.lastName,
        phoneNumber: form.phoneNumber?.number,
        emailAddress: form.email,
        eventId: this.eventId,
        uploadedFilesList: this.fileSubmissionList
      }
    }).subscribe(res => {
      console.log(res)
      this.showModal("You have successfully booked this event", true);
    }, err => {
      console.log(err)
      this.showModal("Your event booking is unsuccessful", false);
    })
  }

  showModal(message?: string, isSuccess?: boolean) {
    let bsModalRef = this.modalService.show(ModalCompletionComponent, {
      initialState: {
        modalClass: 'modal-sm',
        message: message,
        isSuccess: isSuccess
      },
      keyboard: false,
      class: 'modal-sm modal-dialog-centered',
      ignoreBackdropClick: true,
    });
    bsModalRef?.content?.onClick.subscribe(v => {
      bsModalRef.hide();
      this.router.navigate(['/events']);
    });
  }
}

interface UploadedFile {
  fileName: String;
  fileType: String;
  fileSize: String;
  fileData64: String;
}
