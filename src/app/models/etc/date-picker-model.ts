import { AbstractControl } from '@angular/forms';
import * as moment from 'moment';

export class DatePickerModel {

    _date: Date;
    _formControl: AbstractControl;

    set value(val: Date) {
        this._date = val;
        if (this._formControl) {
            const m = moment(val);
            this._formControl.setValue(val ? m.format('YYYY-MM-DD') : '');
        }
    }

    set formControl(formControl: AbstractControl) {
        this._formControl = formControl;
        if (this._formControl && this._formControl.value) {
            const val = moment(this._formControl.value);
            if (val.isValid()) {
                this.value = new Date(val.unix() * 1000);
            } else {
                this.value = null;
            }
        } else {
            this.value = null;
        }
    }

    enforceMin(val: AbstractControl) {
        val.valueChanges.subscribe(val => {
            if (val && this._date && moment(val).isAfter(moment(this._date))) {
                this.value = null;
            }
        });
    }
    
    enforceMax(val: AbstractControl) {
        val.valueChanges.subscribe(val => {
            if (val && this._date && moment(val).isBefore(moment(this._date))) {
                this.value = null;
            }
        })
    }

    get value() {
        return this._date;
    }
}
