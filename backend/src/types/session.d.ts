import 'express-session';

declare module 'express-session' {
  interface SessionData {
    cookie: Cookie;
    user?: {
      id: string;
      name: string;
      phone: number;
      email: string;
      inward?: boolean;
      quickly?: boolean;
      song?: boolean;
      songName?: string;
    }
  }
}