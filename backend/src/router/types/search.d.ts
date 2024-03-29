export interface GetSearchRequest extends ExpressRequest {
  readonly params: {
    id: string;
  }
  readonly query: {
    x: string;
    y: string;
  }
}