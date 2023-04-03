import { PermissionType } from './permission-type.enum';

export class RolePojo {
  public name!: string;
  public permissions!: PermissionType[];
}
