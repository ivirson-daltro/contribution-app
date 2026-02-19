export interface PaginatedResponse<T> {
  total: number;
  page: number;
  limit: number;
  offset: number;
  data: T[];
}
