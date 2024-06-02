/// <reference types="react-scripts" />
declare namespace NodeJS {
  interface ProcessEnv {
    readonly NODE_ENV: 'development' | 'production' | 'test';
    readonly PUBLIC_URL: string;
    readonly REACT_APP_BACKEND_URL: string;
    readonly REACT_APP_VWORLD_KEY: string;
  }
}

type ActionType = "back" | "reload" | "main";

interface JsonData {
  [key: string]: any;
}

interface BackendResponseData<Body = any> {
  message: string;
  action?: ActionType;
  data: Body; 
}

interface BackendResponseData {
  message: string;
  action?: ActionType;
  data?: any; 
}