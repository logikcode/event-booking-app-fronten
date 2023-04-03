export class ApiResponse<T> {

  public code!: number;
  public message!: string;
  public data!: T;
}
