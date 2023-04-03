import * as moment from 'moment';
import { PortalAccountType } from './portal-account-type.enum';

export class PortalAccount {

    public id!: number;
    public name!: string;
    public displayName!: string;
    public code!: string;
    public status!: string;
    public type!: PortalAccountType;
    public phoneNumber!: string;
    public emailAddress!: string;
    public sector!: string;
    public asaDetail!: AccountDetail;
    private _dateCreated!: moment.Moment;

    constructor(data: any) {
        Object.assign(this, data);
    }

    public set dateCreated(val: string | moment.Moment) {
        this._dateCreated = moment(val);
    }

    public getDateCreated(): moment.Moment {
        return this._dateCreated;
    }
}

export class AccountDetail {
  public id!: number;
  public liveMode!: boolean;
}
