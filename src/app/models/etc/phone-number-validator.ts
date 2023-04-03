import { AbstractControl, ValidatorFn } from '@angular/forms';
import { PhoneNumberUtil} from 'google-libphonenumber';
// import { PhoneNumber } from '../model/phone-number';

const phoneNumberUtil = PhoneNumberUtil.getInstance();

export function SimplePhoneNumberValidator(regionCode: string = undefined): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } => {
    let validNumber = false;
    try {
      const phoneNumber = phoneNumberUtil.parseAndKeepRawInput(
        control.value.replace(/ /g,''), regionCode
      );
      validNumber = phoneNumberUtil.isValidNumber(phoneNumber);
    } catch (e) { }

    return validNumber ? null : { invalidNumber: true };
  };
}

export function PhoneNumberValidator(config: Config = {}): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } => {

    const value: any = control.value;

    const error = {};
    error[config.errorCode || 'invalidPhoneNumber'] = true;

    if (!value) {
      return null;
    }
    if (!value.internationalNumber) {
      return error;
    }
    try {
      const phoneNumber = phoneNumberUtil.parse(value.internationalNumber.replace(/ /g,''));
      if (phoneNumberUtil.isValidNumber(phoneNumber)) {
        return null;
      }
    } catch (e) {
      // console.error(e);
    }

    return error;
  };
}

export interface Config {
  errorCode?: string
}
