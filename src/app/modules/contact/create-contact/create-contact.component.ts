import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import {ActivatedRoute, Router, RouterLink} from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Observable, of, Subject } from 'rxjs';
import { UserAccount } from 'src/app/models/user-account.model';
import { User } from 'src/app/models/user/user.model';
import { PageManager } from 'src/app/services/page-manager';
import {
  ContactService,
  Contact,
  ContactDto,
  CreateContactRequestParams, UserPojo,
} from '../../../../../sdk/bw-fullstack-reference-api-sdk';
import GenderEnum = UserPojo.GenderEnum;

@Component({ 
  selector: 'app-create-contact',
  templateUrl: './create-contact.component.html',
  styleUrls: ['./create-contact.component.css']
})
export class CreateContactComponent implements OnInit {

  form!: FormGroup;
  account: UserAccount | undefined;
  user: User | undefined;
  user$: Observable<User> = of();
  stop$ = new Subject();
  currentAccount: UserAccount | undefined;


  nameRegex = '^[\\w\'\\-,.][^0-9_!¡?÷?¿/\\\\+=@#$%ˆ&*(){}|~<>;:[\\]]{1,}$';
  emailRegex = '^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$';


  constructor(
    private formBuilder: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private pageManager: PageManager,
    private contactService: ContactService,
    private toastr: ToastrService,
    private router: Router,
  ) {

  }

  ngOnInit(): void {
    this.form = this.formBuilder.group({

      firstName: this.formBuilder.control('', Validators.compose([Validators.required, Validators.pattern(this.nameRegex)])),
      lastName: this.formBuilder.control('', Validators.compose([Validators.required, Validators.pattern(this.nameRegex)])),
      email: this.formBuilder.control('', Validators.compose([Validators.required, Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')])),
      gender: this.formBuilder.control('', Validators.compose([Validators.required])),

    });

    this.activatedRoute.queryParams.subscribe(e => {
      if (e.email) {
        this.form.patchValue({emailAddress:e.email});
      }
    });
  }


  createContact(): void {
    console.log(this.form.value)


    if(!this.form.valid){
      this.toastr.warning('Please Fill in all fields!', 'Invalid Data');
      for (let controlsKey in this.form.controls) {
        this.form.controls[controlsKey].markAsDirty();
        this.form.controls[controlsKey].markAsTouched();
      }
      return;
    }

    const createContactRequestParams: ContactDto = this.getCreateContactRequestParams();
    this.contactService.createContact({contactDto:createContactRequestParams}).subscribe((res: any) => {
      this.toastr.success('Contact created successfully', 'Success!');
      this.router.navigate(['/dashboard']);
    }, (error: any) => {
      if (error.status === 400) {
        console.log(error);
        this.toastr.error(error.error.message, 'Error');
      } else {
        this.toastr.error('Could not Create Contact', 'Error');
      }
    });
  }

  getCreateContactRequestParams(){
    const createContactRequestParams: ContactDto = {
      email: this.form.get('email')!.value,
      firstName: this.form.get('firstName')!.value,
      lastName: this.form.get('lastName')!.value,
      gender: this.form.get('gender')!.value,
    }
    return createContactRequestParams;
  }



}
