export interface Response<T> {
  statusCode: number;
  data: T;
}

export interface PaginatedResponse<T> {
  statusCode: number;
  data: {
    items: T[];
    pageIndex: number;
    itemsPerPage: number;
    pageCount: number;
    itemCount: number;
  };
}
