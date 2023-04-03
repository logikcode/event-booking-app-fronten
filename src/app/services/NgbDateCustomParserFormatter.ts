import {NgbDateParserFormatter, NgbDateStruct} from "@ng-bootstrap/ng-bootstrap";
import { Injectable } from '@angular/core';
import * as moment from "moment";
import {toInteger} from "lodash";

@Injectable()
export class NgbDateCustomParserFormatter extends NgbDateParserFormatter {

  readonly DT_FORMAT = 'MM-DD-YYYY';

  parse(value: string): NgbDateStruct {
    if (value) {
      value = moment(value.trim(), this.DT_FORMAT).toString();
      return {day: toInteger(value.split('-')[0]), month: toInteger(value.split('-')[1]), year: toInteger(value.split('-')[2])};
    }
    return null;
  }
  //
  format(date: NgbDateStruct): string {
    if (!date) return '';
    let mdt = moment([date.year, date.month - 1, date.day]);
    if (!mdt.isValid()) return '';
    return mdt.format(this.DT_FORMAT);
  }

}
