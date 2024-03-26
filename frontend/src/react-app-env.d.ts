/// <reference types="react-scripts" />
declare namespace NodeJS {
  interface ProcessEnv {
    readonly NODE_ENV: 'development' | 'production' | 'test';
    readonly PUBLIC_URL: string;
    readonly REACT_APP_BACKEND_URL: string;
    readonly REACT_APP_VWORLD_KEY: string;
  }
}

interface JsonData {
  [key: string]: any;
}