declare namespace NodeJS {
  interface ProcessEnv {
    readonly NODE_ENV: 'development' | 'production' | 'test';
    readonly PUBLIC_URL: string;
    readonly FRONTEND_URL: string;
  }
}

type ExpressRequest = import("express").Request;
type ExpressResponse = import("express").Response;