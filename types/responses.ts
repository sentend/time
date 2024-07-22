export type BaseResponse<T> = {
  status: number;
  responseCode: number;
  data: T;
};
