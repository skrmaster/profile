declare type responseModel<T> = {
  statusCode: number;
  data: T;
  succeeded: true;
  errors: string;
  extras: string;
  timestamp: number;
  tokenObject: tokenType
}

declare type tokenType = {
  token: string | null;
  refreshToken: string | null;
}
