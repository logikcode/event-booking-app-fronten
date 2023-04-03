import { RolePojo } from './role.pojo.model';
import { PermissionType } from './permission-type.enum';
import { PortalAccount } from './portal-account.model';

export class UserAccount {

    constructor(data: any) {
        Object.assign(this, data);
    }

    public accountCode!: string;
    public accountId!: number;
    public accountName!: string;
    public accountType!: string;
    public sponsorAgencyCode!: string;
    public permissions!: string[];
    public roles: RolePojo[] | undefined;
    public code: string | undefined;
    public name: string | undefined;
    public id: number | undefined;
    public enabledForIntegration?: boolean;
    public showEnrolmentAge?: boolean;



  public hasPermission(permission: string | PermissionType) {
        if (this.permissions && this.permissions.length > 0) {
            return this.permissions.filter((it: string) => it === permission).length;
        }
        return null;
    }

    public getPortalAccount() {
        return new PortalAccount({
            id: this.accountId,
            name: this['name'],
            code: this['code'],
            type: this.accountType,
            accountType: this.accountType,
            enabledForIntegration: this.enabledForIntegration
        });
    }
}
