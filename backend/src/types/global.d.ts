declare namespace NodeJS {
  interface ProcessEnv {
    readonly NODE_ENV: 'development' | 'production' | 'test';
    readonly PUBLIC_URL: string;
    readonly FRONTEND_URL: string;
  }
}

type ExpressRequest = import("express").Request;
type ExpressResponse = import("express").Response;

interface GetRequest<Params = any, Query = any> extends ExpressRequest {
  readonly params: Params
  readonly query: Query
}

interface PostRequest<Params = any, Body = any> extends ExpressRequest {
  readonly params: T
  readonly body: K
}

interface PatchRequest<Params = any, Body = any> extends ExpressRequest {
  readonly params: T
  readonly body: K
}

interface PutRequest<Params = any, Body = any> extends ExpressRequest {
  readonly params: T
  readonly body: K
}

interface DeleteRequest<Params = any> extends ExpressRequest {
  readonly params: T
}