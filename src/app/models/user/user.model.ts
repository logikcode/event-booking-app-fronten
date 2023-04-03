import { Account } from "../account.model";
import { PermissionType } from "../permission-type.enum";
import { PortalAccountRole } from "../portal-account-type.enum";
import { RolePojo } from "../role.pojo.model";
import { UserAccount } from "../user-account.model";


export class User {

    public accounts!: UserAccount[];
    public email!: string;
    public firstname!: string;
    public surname!: string;
    public phone!: string;
    public requiresPasswordUpdate!: boolean;
    public userId!: string;
    public status!: string;
    public username!: string;
    public accountPojo!: Account;
    public nin!: string;

   
    constructor(data: any) {
        Object.assign(this, data);
        if (data.accounts) {
            this.accounts = data.accounts;
        }
        if (data.accountPojo) {
            this.accountPojo = new Account(data.accountPojo);
        }
    }

    public permissions(): string[] {
        if (!this.accountPojo) {
          return [];
        }
        const roles: RolePojo[] = this.accountPojo.roles;
        let permits: any[] = [];
        roles.forEach(r => {
          let p: PermissionType[];
          p = r.permissions;
          permits = permits.concat(...p);
        });
      return permits.filter((v, i) => permits.indexOf(v) === i);
    }

    public hasPermission(permissionName: string | PermissionType) {
        return (this.permissions() || []).filter((it: string) => it === permissionName).length;
    }

    public getAccountsWithPermission(permission: string | PermissionType): UserAccount[] {
        return this.accounts.filter((it: UserAccount) => it.hasPermission(permission));
    }

    public getRole(roles: RolePojo[]): RolePojo {
      return <RolePojo>roles.find(r => {
        let role: RolePojo;

        switch (r.name) {
          case PortalAccountRole.ADMIN:
            role = r;
            break;
        }

        // @ts-ignore
        return role;
      });
    }


  public hasRole(roleName: string) {
    const accounts: UserAccount[] = this.accounts.filter((acct: any) => {
      return acct.roles.filter((it: string) => it === roleName).length;
    });
    if (!accounts.length) {
      return false;
    }
    return true;
  }
}
