import {HttpErrorResponse} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {AbstractControl, AsyncValidatorFn, ValidationErrors} from '@angular/forms';
import {Observable, of} from 'rxjs';
import {catchError, map} from 'rxjs/operators';
import {ResourceVerificationControllerService} from "../../../../sdk/bw-fullstack-reference-api-sdk";

@Injectable({
  providedIn: 'root'
})
export class UniqueIdValidatorService {

  constructor(private verifyService: ResourceVerificationControllerService) {
  }

  verifier(type: 'email' | 'mobile_number' | 'license' | 'npi', errorName?: string): AsyncValidatorFn {

    return (control: AbstractControl): Observable<ValidationErrors | null> => {

      if (!control.value) {
        return of(null);
      }
      return this.verify(type, control.value, errorName);
    };
  }

  phoneNumberVerifier(errorName = 'phoneNumberExists'): AsyncValidatorFn {
    return (control: AbstractControl): Observable<ValidationErrors | null> => {
      if (!control.value) {
        return of(null);
      }
      return this.verify('mobile_number', control.value.number.replace(/ /g, ''), errorName);
    };
  }

  private verify(type: 'email' | 'mobile_number' | 'license' | 'npi', value: string, errorName: string): Observable<ValidationErrors> {
    // @ts-ignore
    return this.verifyService
      .verifyResource({identifier: value, type: type})
      .pipe(map(users => null))
      .pipe(catchError((err: HttpErrorResponse, caught) => {
        const val = {};
        // @ts-ignore
        val[errorName || 'invalid'] = true;
        return of(val);
      }));
  }

}
