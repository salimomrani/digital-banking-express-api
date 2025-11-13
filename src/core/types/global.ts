export type Nullable<T> = T | null;

export type PaginatedResponse<T> = {
  data: T;
  meta: {
    total: number;
    page: number;
    pageSize: number;
  };
};
