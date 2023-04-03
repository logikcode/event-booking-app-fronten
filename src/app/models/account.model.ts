import { RolePojo } from './role.pojo.model';
import { PermissionType } from './permission-type.enum';

export class Account {

  constructor(data: any) {
    Object.assign(this, data);
  }

  public name!: string;
  public code!: string;
  public accountType!: string;
  public roles!: RolePojo[];
  public jurisdiction!: string;
  public enabledForIntegration?: boolean;

  public hasPermission(permission: string) {
      return this.roles.map((role: RolePojo) => role.permissions.filter((p: PermissionType) =>
        p.toString() === permission).length);
  }

}
