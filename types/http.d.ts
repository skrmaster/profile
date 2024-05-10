declare type responseModel<T> = {
  statusCode: number;
  data: T;
  succeeded: true;
  errors: string;
  extras: string;
  timestamp: number;
}
