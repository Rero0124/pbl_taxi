declare namespace NodeJS {
  interface ProcessEnv {
    readonly NODE_ENV: 'development' | 'production' | 'test';
    readonly PUBLIC_URL: string;
    readonly FRONTEND_URL: string;
  }
}

type ExpressRequest = import("express").Request;
type ExpressResponse = import("express").Response<ResponseData>;

interface ResponseData {
  message: string;
  action?: "back" | "reload" | "main";
  data?: any; 
} 

interface AddressType {
  title: string;
  address: string;
  point: {
    x: number;
    y: number;
  }
}

interface GetRequest<Params = any, Query = any> extends ExpressRequest {
  readonly params: Params
  readonly query: Query
}

interface PostRequest<Body = any, Params = any> extends ExpressRequest {
  readonly params: Params
  readonly body: Body
}

interface PatchRequest<Body = any, Params = any> extends ExpressRequest {
  readonly params: Params
  readonly body: Body
}

interface PutRequest<Body = any, Params = any> extends ExpressRequest {
  readonly params: Params
  readonly body: Body
}

interface DeleteRequest<Params = any> extends ExpressRequest {
  readonly params: Params
}