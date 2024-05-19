type ResponseModel<T> = {
  statusCode: number;
  data: T;
  succeeded: true;
  errors: string;
  extras: string;
  timestamp: number;
  tokenObject: Token
}

type Token = {
  token: string | null;
  refreshToken: string | null;
}

type Pagination = {
  page: number;
  pageSize: number;
  total: number;
}

type ResponsePagination<T> = {
  list: T;
  pagination: Pagination;
}
